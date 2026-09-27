/**
 * Fidel Swift – Amharic Speech-to-Text Module
 * ============================================
 * Browser-based voice dictation using the Web Speech API (SpeechRecognition)
 * with real-time audio visualisation via Web Audio API AnalyserNode.
 *
 * Design goals
 * ────────────
 *   • Insert recognised Amharic text directly into the contenteditable editor,
 *     bypassing the phonetic conversion engine.
 *   • Show interim results in a separate preview bar (never in the editor) and
 *     commit each final result exactly once.
 *   • Provide a microphone volume-driven waveform that is visually distinct
 *     from the "listening but silent" breathing ring.
 *   • Gracefully degrade when the Speech API or Amharic language is unavailable.
 *   • Keep recognition logic decoupled enough to swap in a backend provider.
 *
 * Hugeicons licence notice
 * ────────────────────────
 * The microphone and stop SVG icons used in the HTML are from Hugeicons
 * (https://hugeicons.com) and are used under the MIT licence.
 *
 * @file   scripts/speech-to-text.js
 * @author Abel Zecharias – Fidel Swift
 */
(function () {
  'use strict';

  /* ========================================================================
     DOM references
     ======================================================================== */
  var editor          = document.getElementById('keyboard-editor');
  var micBtn          = document.getElementById('stt-mic-btn');
  var waveformEl      = document.getElementById('stt-waveform');
  var interimBar      = document.getElementById('stt-interim-bar');
  var interimTextEl   = document.getElementById('stt-interim-text');
  var statusEl        = document.getElementById('stt-status');
  var liveRegion      = document.getElementById('stt-live-region');
  var fsMicBtn        = document.getElementById('fs-stt-mic-btn');

  if (!editor || !micBtn) {
    return; // Page does not contain the keyboard editor
  }

  /* ========================================================================
     Feature detection
     ======================================================================== */
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var isSupported = !!SpeechRecognition;

  if (!isSupported) {
    micBtn.title = 'Voice dictation is not supported in this browser';
    micBtn.disabled = true;
    micBtn.style.opacity = '0.4';
    micBtn.style.cursor = 'not-allowed';
    if (fsMicBtn) {
      fsMicBtn.title = micBtn.title;
      fsMicBtn.disabled = true;
      fsMicBtn.style.opacity = '0.4';
      fsMicBtn.style.cursor = 'not-allowed';
    }
    return;
  }

  /* ========================================================================
     Keyboard module bridge
     ======================================================================== */
  var bridge = editor._fidelSwift || {};

  function resetActiveConsonant() {
    if (typeof bridge.resetActiveConsonant === 'function') {
      bridge.resetActiveConsonant();
    }
  }

  function updateCounts() {
    if (typeof bridge.updateCounts === 'function') {
      bridge.updateCounts();
    }
  }

  function debounceSave() {
    if (typeof bridge.debounceSave === 'function') {
      bridge.debounceSave();
    }
  }

  /* ========================================================================
     State
     ======================================================================== */
  /** @type {'idle'|'requesting'|'listening'|'speech'|'stopping'|'error'} */
  var state = 'idle';

  /** @type {SpeechRecognition|null} */
  var recognition = null;

  /** @type {MediaStream|null} */
  var micStream = null;

  /** @type {AudioContext|null} */
  var audioCtx = null;

  /** @type {AnalyserNode|null} */
  var analyser = null;

  /** @type {MediaStreamAudioSourceNode|null} */
  var audioSource = null;

  /** @type {number|null} */
  var animFrameId = null;

  /** @type {Uint8Array|null} */
  var freqData = null;

  /**
   * We track a "document version" that increments whenever the user clears,
   * templates, or otherwise replaces the entire document.  Recognition results
   * arriving after a version change are discarded.
   */
  var docVersion = 0;
  var sessionDocVersion = 0;

  /**
   * Saved selection: captured when the user clicks the mic button so that
   * dictated text is inserted at the right position even though clicking the
   * button moves focus away from the editor.
   */
  var savedRange = null;

  /** Guards against committing the same final result twice. */
  var lastCommittedResultIndex = -1;

  /** Whether the user explicitly requested a stop (vs. unexpected end). */
  var userRequestedStop = false;

  /** Whether audio analysis is available for this session. */
  var audioAnalysisAvailable = false;

  /** Smoothed amplitude (0–1) for waveform rendering. */
  var smoothedAmplitude = 0;

  /** Bars DOM cache. */
  var bars = waveformEl ? waveformEl.querySelectorAll('.stt-bar') : [];

  /* ========================================================================
     Helpers: selection persistence
     ======================================================================== */
  function saveEditorSelection() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      if (editor.contains(range.commonAncestorContainer)) {
        savedRange = range.cloneRange();
        return;
      }
    }
    // Fallback: place caret at the end of the editor
    savedRange = null;
  }

  function restoreEditorSelection() {
    if (savedRange) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange);
    } else {
      // Place caret at end
      var range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      var sel2 = window.getSelection();
      sel2.removeAllRanges();
      sel2.addRange(range);
    }
  }

  /* ========================================================================
     Helpers: UI updates
     ======================================================================== */
  function setState(newState) {
    state = newState;
    micBtn.setAttribute('data-stt-state', newState);
    var isActive = newState !== 'idle' && newState !== 'error';
    micBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    if (fsMicBtn) {
      fsMicBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    // Update label
    var labels = {
      idle: '',
      requesting: 'Requesting microphone…',
      listening: 'Listening…',
      speech: 'Speech detected',
      stopping: 'Stopping…',
      error: ''
    };
    setStatusText(labels[newState] || '', newState === 'error' ? 'error' : (newState === 'speech' ? 'speech' : (isActive ? 'active' : '')));
  }

  function setStatusText(text, level) {
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.setAttribute('data-stt-level', level || '');
    }
  }

  function announce(msg) {
    if (liveRegion) {
      liveRegion.textContent = '';
      // Force screen readers to re-announce by toggling content
      requestAnimationFrame(function () {
        liveRegion.textContent = msg;
      });
    }
  }

  function showInterim(text) {
    if (interimBar && interimTextEl) {
      if (text) {
        interimTextEl.textContent = text;
        interimBar.classList.add('visible');
      } else {
        interimTextEl.textContent = '';
        interimBar.classList.remove('visible');
      }
    }
  }

  function showWaveform(active) {
    if (waveformEl) {
      waveformEl.classList.toggle('active', active);
      if (active) {
        waveformEl.setAttribute('data-stt-speech', 'false');
      }
    }
  }

  /* ========================================================================
     Audio analysis (Web Audio API)
     ======================================================================== */
  function setupAudioAnalysis(stream) {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) { return false; }

      audioCtx = new AudioCtx();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;

      audioSource = audioCtx.createMediaStreamSource(stream);
      audioSource.connect(analyser);

      freqData = new Uint8Array(analyser.frequencyBinCount);
      audioAnalysisAvailable = true;
      return true;
    } catch (e) {
      audioAnalysisAvailable = false;
      return false;
    }
  }

  /**
   * Animation loop: reads actual microphone amplitude from the AnalyserNode
   * and drives the waveform bars.  When audio analysis is unavailable we fall
   * back to a simple static indicator controlled by speech events.
   */
  function startWaveformLoop() {
    if (!audioAnalysisAvailable) { return; }

    function tick() {
      if (state !== 'listening' && state !== 'speech') {
        resetBars();
        return;
      }

      analyser.getByteFrequencyData(freqData);

      // Compute RMS-like amplitude from the first 40 bins (voice frequencies)
      var sum = 0;
      var count = Math.min(40, freqData.length);
      for (var i = 0; i < count; i++) {
        sum += freqData[i];
      }
      var raw = sum / (count * 255); // 0–1

      // Exponential smoothing
      var alpha = raw > smoothedAmplitude ? 0.35 : 0.12;
      smoothedAmplitude = smoothedAmplitude * (1 - alpha) + raw * alpha;

      // Determine if the user is actually speaking (amplitude threshold)
      var isSpeaking = smoothedAmplitude > 0.04;
      if (waveformEl) {
        waveformEl.setAttribute('data-stt-speech', isSpeaking ? 'true' : 'false');
      }

      // Drive individual bars with slight variation per bar
      var barCount = bars.length;
      for (var b = 0; b < barCount; b++) {
        // Sample different frequency bins for each bar
        var binIndex = Math.floor((b / barCount) * count);
        var binValue = (freqData[binIndex] || 0) / 255;
        // Blend with smoothed amplitude for stability
        var barHeight = (binValue * 0.5 + smoothedAmplitude * 0.5);
        // At silence, collapse to minimum
        if (!isSpeaking) { barHeight = 0; }
        var px = Math.max(2, Math.round(barHeight * 18));
        bars[b].style.height = px + 'px';
      }

      animFrameId = requestAnimationFrame(tick);
    }

    animFrameId = requestAnimationFrame(tick);
  }

  function resetBars() {
    smoothedAmplitude = 0;
    for (var i = 0; i < bars.length; i++) {
      bars[i].style.height = '2px';
    }
  }

  /* ========================================================================
     Text insertion into the editor
     ======================================================================== */

  /**
   * Insert plain text at the saved cursor position in the editor.
   * Bypasses phonetic conversion, resets the active consonant state,
   * and triggers counting + draft save.
   */
  function insertRecognisedText(text) {
    if (!text) { return; }

    resetActiveConsonant();
    editor.focus();
    restoreEditorSelection();

    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      // Fallback: append at end
      var range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    var currentRange = sel.getRangeAt(0);
    currentRange.deleteContents();

    var textNode = document.createTextNode(text);
    currentRange.insertNode(textNode);

    // Move caret after the inserted text
    currentRange.setStartAfter(textNode);
    currentRange.setEndAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(currentRange);

    // Update the saved range to the new caret position
    savedRange = currentRange.cloneRange();

    updateCounts();
    debounceSave();
  }

  /* ========================================================================
     Document mutation observer
     ======================================================================== */
  /**
   * Increment docVersion whenever the editor's content is wholesale replaced
   * (clear, template, restore draft).  We detect this via MutationObserver
   * watching for large childList changes.
   */
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].type === 'childList' && mutations[i].removedNodes.length > 2) {
        docVersion++;
        // If we're currently recording and the document was replaced,
        // update savedRange to point at end of new content
        if (state !== 'idle' && state !== 'error') {
          savedRange = null; // Will fallback to end-of-editor
        }
        break;
      }
    }
  });
  observer.observe(editor, { childList: true });

  /* ========================================================================
     Cursor tracking
     ======================================================================== */
  /**
   * Track manual cursor moves and edits while dictation is active
   * so the next final result inserts at the right place.
   */
  editor.addEventListener('mouseup', function () {
    if (state === 'listening' || state === 'speech') {
      saveEditorSelection();
    }
  });
  editor.addEventListener('keyup', function () {
    if (state === 'listening' || state === 'speech') {
      saveEditorSelection();
    }
  });

  /* ========================================================================
     Recognition lifecycle
     ======================================================================== */
  function startDictation() {
    if (state !== 'idle' && state !== 'error') {
      // Already active – stop instead
      stopDictation();
      return;
    }

    saveEditorSelection();
    userRequestedStop = false;
    lastCommittedResultIndex = -1;
    sessionDocVersion = docVersion;

    setState('requesting');
    announce('Requesting microphone access');

    recognition = new SpeechRecognition();
    recognition.lang = 'am-ET';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      setState('listening');
      announce('Listening for Amharic speech');
      showWaveform(true);
      startWaveformLoop();
    };

    recognition.onspeechstart = function () {
      setState('speech');
    };

    recognition.onspeechend = function () {
      if (state === 'speech') {
        setState('listening');
      }
    };

    recognition.onresult = function (event) {
      if (docVersion !== sessionDocVersion) {
        // Document was replaced since this session started; discard
        return;
      }

      var interim = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var result = event.results[i];
        if (result.isFinal) {
          // Prevent double-commit
          if (i <= lastCommittedResultIndex) { continue; }
          lastCommittedResultIndex = i;

          var finalText = result[0].transcript;
          showInterim('');

          // Add a space before the text if the editor isn't empty and
          // doesn't already end with whitespace
          var editorText = editor.innerText || '';
          if (editorText.length > 0 && !/\s$/.test(editorText)) {
            finalText = ' ' + finalText;
          }

          insertRecognisedText(finalText);
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) {
        showInterim(interim);
        if (state === 'listening') {
          setState('speech');
        }
      }
    };

    recognition.onerror = function (event) {
      var msg = '';
      switch (event.error) {
        case 'not-allowed':
          msg = 'Microphone access denied';
          break;
        case 'no-speech':
          msg = 'No speech detected — try again';
          break;
        case 'audio-capture':
          msg = 'No microphone found';
          break;
        case 'network':
          msg = 'Network error — speech service unreachable';
          break;
        case 'language-not-supported':
          msg = 'Amharic (am-ET) is not supported by this browser\'s speech service';
          break;
        case 'service-not-allowed':
          msg = 'Speech service not allowed';
          break;
        case 'aborted':
          // User or programmatic abort – not an error
          return;
        default:
          msg = 'Speech error: ' + event.error;
      }

      announce(msg);
      setStatusText(msg, 'error');

      // Let the error message persist for a few seconds
      setTimeout(function () {
        if (state === 'error') {
          setStatusText('', '');
        }
      }, 5000);

      cleanupSession();
      setState('error');
      // Reset to idle after showing error state briefly
      setTimeout(function () {
        if (state === 'error') {
          setState('idle');
        }
      }, 5000);
    };

    recognition.onend = function () {
      showInterim('');

      if (state === 'stopping' || userRequestedStop) {
        // Normal stop
        cleanupSession();
        setState('idle');
        announce('Voice dictation stopped');
        return;
      }

      if (state === 'error') {
        // Error handler already dealt with it
        return;
      }

      // Unexpected termination (e.g. silence timeout or service glitch)
      // Do NOT auto-restart – the user didn't ask for it
      cleanupSession();
      setState('idle');
      setStatusText('Dictation ended', '');
      announce('Voice dictation ended');
      setTimeout(function () {
        setStatusText('', '');
      }, 3000);
    };

    // Request microphone access first (for audio analysis), then start recognition
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        micStream = stream;
        setupAudioAnalysis(stream);
        try {
          recognition.start();
        } catch (e) {
          // Recognition may already be started in some browsers
          cleanupSession();
          setState('error');
          setStatusText('Could not start recognition', 'error');
        }
      })
      .catch(function (err) {
        // getUserMedia failed – try starting recognition without audio analysis
        // (on some browsers, SpeechRecognition handles its own mic access)
        audioAnalysisAvailable = false;
        try {
          recognition.start();
        } catch (e) {
          setState('error');
          var errMsg = err.name === 'NotAllowedError' ? 'Microphone access denied' :
                       err.name === 'NotFoundError'   ? 'No microphone found' :
                       'Microphone error: ' + err.message;
          setStatusText(errMsg, 'error');
          announce(errMsg);
          setTimeout(function () {
            if (state === 'error') {
              setState('idle');
              setStatusText('', '');
            }
          }, 5000);
        }
      });
  }

  function stopDictation() {
    if (state === 'idle') { return; }

    userRequestedStop = true;
    setState('stopping');

    if (recognition) {
      try {
        // .stop() allows the final result to be delivered before onend fires
        recognition.stop();
      } catch (e) {
        cleanupSession();
        setState('idle');
      }
    } else {
      cleanupSession();
      setState('idle');
    }
  }

  function cleanupSession() {
    // Cancel animation
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    // Disconnect audio nodes
    if (audioSource) {
      try { audioSource.disconnect(); } catch (e) {}
      audioSource = null;
    }
    if (analyser) {
      analyser = null;
    }

    // Close AudioContext
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null;
    }

    // Stop all mic tracks
    if (micStream) {
      micStream.getTracks().forEach(function (track) {
        track.stop();
      });
      micStream = null;
    }

    freqData = null;
    audioAnalysisAvailable = false;
    recognition = null;

    // Reset UI
    showWaveform(false);
    resetBars();
    showInterim('');
  }

  /* ========================================================================
     Event binding
     ======================================================================== */
  micBtn.addEventListener('mousedown', function (e) {
    // Prevent the mousedown from moving focus away from the editor
    // so we can capture the selection accurately
    e.preventDefault();
  });

  micBtn.addEventListener('click', function () {
    if (state === 'idle' || state === 'error') {
      startDictation();
    } else {
      stopDictation();
    }
  });

  // Fullscreen mic button mirrors the toolbar button
  if (fsMicBtn) {
    fsMicBtn.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });
    fsMicBtn.addEventListener('click', function () {
      if (state === 'idle' || state === 'error') {
        startDictation();
      } else {
        stopDictation();
      }
    });
  }

  /* ========================================================================
     Page visibility / unload cleanup
     ======================================================================== */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state !== 'idle') {
      stopDictation();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (state !== 'idle') {
      cleanupSession();
    }
  });

  /* ========================================================================
     Keyboard shortcut: Ctrl+Shift+M to toggle dictation
     ======================================================================== */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
      e.preventDefault();
      if (state === 'idle' || state === 'error') {
        startDictation();
      } else {
        stopDictation();
      }
    }
  });
})();
