(function () {
  'use strict';

  var ENGINE = window.FidelSwiftEngine;
  if (!ENGINE) {
    console.error('[Fidel Swift Writer] Engine not found.');
    return;
  }

  var CONSONANTS = ENGINE.CONSONANTS;
  var CONSONANTS_CAPS = ENGINE.CONSONANTS_CAPS;
  var VOWELS = ENGINE.VOWELS;
  var SPECIAL_CHARS = ENGINE.SPECIAL_CHARS;

  var editor = document.getElementById('writer-editor');
  var titleInput = document.getElementById('writer-title');
  var modeToggle = document.getElementById('writer-mode-toggle');
  var modeStatus = document.getElementById('writer-mode-status');
  var charCount = document.getElementById('writer-char-count');
  var wordCount = document.getElementById('writer-word-count');
  var saveStatus = document.getElementById('writer-save-status');
  var templateSelect = document.getElementById('writer-template-select');
  var clearBtn = document.getElementById('writer-clear-btn');
  var copyBtn = document.getElementById('writer-copy-btn');
  var printBtn = document.getElementById('writer-print-btn');
  var exportTxtBtn = document.getElementById('writer-export-txt-btn');
  var exportHtmlBtn = document.getElementById('writer-export-html-btn');
  var exportDocBtn = document.getElementById('writer-export-doc-btn');

  if (!editor) {
    console.error('[Fidel Swift Writer] Missing #writer-editor.');
    return;
  }

  var amharicMode = true;
  var activeTextNode = null;
  var activeOffset = null;
  var activeChars = null;
  var saveTimer = null;

  var STORAGE_KEY_TITLE = 'fidelSwiftWriterTitle';
  var STORAGE_KEY_CONTENT = 'fidelSwiftWriterContent';

  function updateCounts() {
    var text = editor.innerText || '';
    if (charCount) charCount.textContent = String(text.length);
    if (wordCount) {
      var words = text.trim() ? text.trim().split(/\s+/).length : 0;
      wordCount.textContent = String(words);
    }
  }

  function setSaveStatus(msg) {
    if (saveStatus) saveStatus.textContent = msg;
  }

  function saveDraft() {
    var title = titleInput ? titleInput.value : '';
    var content = editor.innerHTML;
    try {
      localStorage.setItem(STORAGE_KEY_TITLE, title);
      localStorage.setItem(STORAGE_KEY_CONTENT, content);
      setSaveStatus('Saved');
    } catch (e) {
      setSaveStatus('Save failed');
    }
  }

  function debounceSave() {
    setSaveStatus('Saving...');
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 500);
  }

  function restoreDraft() {
    try {
      var savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);
      var savedContent = localStorage.getItem(STORAGE_KEY_CONTENT);
      if (savedTitle !== null && titleInput) titleInput.value = savedTitle;
      if (savedContent !== null) {
        editor.innerHTML = savedContent;
        setSaveStatus('Restored draft');
        setTimeout(function () { setSaveStatus(''); }, 2000);
      }
    } catch (e) {
      /* no stored draft */
    }
    updateCounts();
  }

  function clearDraft() {
    if (titleInput) titleInput.value = '';
    editor.innerHTML = '';
    try {
      localStorage.removeItem(STORAGE_KEY_TITLE);
      localStorage.removeItem(STORAGE_KEY_CONTENT);
      setSaveStatus('Draft cleared');
      setTimeout(function () { setSaveStatus(''); }, 2000);
    } catch (e) { /* */ }
    updateCounts();
    editor.focus();
  }

  function resetActiveConsonant() {
    activeTextNode = null;
    activeOffset = null;
    activeChars = null;
  }

  function isModifierPressed(event) {
    return event.ctrlKey || event.metaKey || event.altKey;
  }

  function getCurrentRange() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    var range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return null;
    return range;
  }

  function insertTextAtCaret(text) {
    var range = getCurrentRange();
    if (!range) return null;
    range.deleteContents();
    var textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    return textNode;
  }

  function replaceLastChar(textNode, offset, replacement) {
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    var current = textNode.textContent;
    var start = offset || 0;
    var before = current.slice(0, start);
    var after = current.slice(start + 1);
    textNode.textContent = before + replacement + after;
    var range = document.createRange();
    range.setStart(textNode, start + replacement.length);
    range.setEnd(textNode, start + replacement.length);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function getCharsForConsonant(key, event) {
    var capsOn = event.getModifierState && event.getModifierState('CapsLock');
    if (capsOn && CONSONANTS_CAPS[key]) return CONSONANTS_CAPS[key];
    return CONSONANTS[key] || null;
  }

  function handleVowelKey(event) {
    var vowelIndex = VOWELS[event.key];
    if (vowelIndex === undefined || activeChars === null || activeTextNode === null) return false;
    var replacement = activeChars[vowelIndex];
    if (!replacement) { resetActiveConsonant(); return false; }
    event.preventDefault();
    replaceLastChar(activeTextNode, activeOffset, replacement);
    activeOffset = activeOffset + replacement.length - 1;
    return true;
  }

  function handleConsonantKey(event) {
    var chars = getCharsForConsonant(event.key, event);
    if (!chars) return false;
    event.preventDefault();
    var textNode = insertTextAtCaret(chars[0]);
    if (!textNode) return false;
    var range = getCurrentRange();
    var offset = range ? range.startOffset - 1 : 0;
    activeTextNode = textNode;
    activeOffset = offset;
    activeChars = chars;
    return true;
  }

  function handleSpecialChar(event) {
    var replacement = SPECIAL_CHARS[event.key];
    if (!replacement) return false;
    event.preventDefault();
    insertTextAtCaret(replacement);
    resetActiveConsonant();
    return true;
  }

  editor.addEventListener('keydown', function (event) {
    if (!amharicMode || isModifierPressed(event)) return;

    var navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Escape'];
    if (navigationKeys.includes(event.key)) { resetActiveConsonant(); return; }

    if (event.key === 'Backspace' || event.key === 'Delete') { resetActiveConsonant(); return; }

    if (handleVowelKey(event)) return;
    if (handleConsonantKey(event)) return;
    if (handleSpecialChar(event)) return;

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') resetActiveConsonant();
  });

  editor.addEventListener('input', function () {
    updateCounts();
    debounceSave();
  });

  editor.addEventListener('paste', function () {
    resetActiveConsonant();
    setTimeout(function () { updateCounts(); debounceSave(); }, 0);
  });

  if (modeToggle) {
    modeToggle.addEventListener('click', function () {
      amharicMode = !amharicMode;
      modeToggle.classList.toggle('amharic-on', amharicMode);
      modeToggle.classList.toggle('amharic-off', !amharicMode);
      if (modeStatus) modeStatus.textContent = amharicMode ? 'On' : 'Off';
      resetActiveConsonant();
      editor.focus();
    });
  }

  var FORMAT_COMMANDS = {
    'writer-bold': 'bold',
    'writer-italic': 'italic',
    'writer-underline': 'underline',
    'writer-heading1': ['formatBlock', 'h1'],
    'writer-heading2': ['formatBlock', 'h2'],
    'writer-paragraph': ['formatBlock', 'p'],
    'writer-bullet': 'insertUnorderedList',
    'writer-numbered': 'insertOrderedList',
    'writer-align-left': 'justifyLeft',
    'writer-align-center': 'justifyCenter',
    'writer-align-right': 'justifyRight',
    'writer-clear-format': 'removeFormat'
  };

  function execFormat(id) {
    var cmd = FORMAT_COMMANDS[id];
    if (!cmd) return;
    editor.focus();
    if (Array.isArray(cmd)) {
      document.execCommand(cmd[0], false, cmd[1]);
    } else {
      document.execCommand(cmd, false, null);
    }
    updateCounts();
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-format]');
    if (!btn) return;
    var formatId = btn.getAttribute('data-format');
    if (formatId) execFormat(formatId);
  });

  var TEMPLATES = {
    '': '<p style="line-height: 1.8;"><br></p>',
    'blank': '<p style="line-height: 1.8;"><br></p>',
    'formal-letter': '<h1>መደበኛ ደብዳቤ</h1><p>ቀን፡ __________</p><p>ለ፡ __________</p><p>ጉዳዩ፡ __________</p><p style="line-height: 1.8;"><br></p><p>ክቡር ኃላፊ፣</p><p style="line-height: 1.8;"><br></p><p>ይህ ደብዳቤ የሚጻፈው __________ን በተመለከተ ነው።</p><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><p>ከሰላምታ ጋር፣</p><p>ስም፡ __________</p><p>ፊርማ፡ __________</p>',
    'application': '<h1>የማመልከቻ ደብዳቤ</h1><p>ቀን፡ __________</p><p>ለ፡ __________</p><p>ጉዳዩ፡ __________</p><p style="line-height: 1.8;"><br></p><p>እኔ __________ ለ __________ ለማመልከት ይህን ደብዳቤ አቀርባለሁ።</p><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><p>ከሰላምታ ጋር፣</p><p>ስም፡ __________</p>',
    'minutes': '<h1>የስብሰባ ማስታወሻ</h1><p>ቀን፡ __________</p><p>ሰዓት፡ __________</p><p>ቦታ፡ __________</p><p>ተሳታፊዎች፡ __________</p><p style="line-height: 1.8;"><br></p><h2>የውይይት ነጥቦች</h2><p>1. __________</p><p>2. __________</p><p>3. __________</p><p style="line-height: 1.8;"><br></p><h2>ውሳኔዎች</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ቀጣይ እርምጃዎች</h2><p>__________</p>',
    'assignment': '<h1>የትምህርት ሥራ</h1><p>የተማሪ ስም፡ __________</p><p>ክፍል፡ __________</p><p>ትምህርት፡ __________</p><p>ቀን፡ __________</p><p style="line-height: 1.8;"><br></p><h2>ርዕስ፡ __________</h2><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ማጠቃለያ</h2><p>__________</p>',
    'cv': '<h1>የትምህርትና የሥራ ልምድ ማጠቃለያ</h1><p style="line-height: 1.8;"><br></p><h2>የግል መረጃ</h2><p>ሙሉ ስም፡ __________</p><p>አድራሻ፡ __________</p><p>ስልክ፡ __________</p><p>ኢሜል፡ __________</p><p style="line-height: 1.8;"><br></p><h2>የትምህርት ታሪክ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>የሥራ ልምድ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ክህሎቶች</h2><p>__________</p>',
    'proposal': '<h1>የንግድ ሐሳብ</h1><p>የተዘጋጀው በ፡ __________</p><p>ቀን፡ __________</p><p style="line-height: 1.8;"><br></p><h2>የፕሮጀክቱ ርዕስ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ዓላማ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ዕቅድ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>በጀት</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>መደምደሚያ</h2><p>__________</p>',
    'notice': '<h1>ማስታወቂያ</h1><p>ቀን፡ __________</p><p style="line-height: 1.8;"><br></p><p>ለሁሉም __________ ይታወቅ።</p><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><p>ከሰላምታ ጋር፣</p><p>__________</p>'
  };

  if (templateSelect) {
    templateSelect.addEventListener('change', function () {
      var key = templateSelect.value;
      if (!key || !TEMPLATES[key]) return;
      if (editor.innerText.trim()) {
        if (!confirm('Replace current document content?')) {
          templateSelect.value = '';
          return;
        }
      }
      editor.innerHTML = TEMPLATES[key];
      updateCounts();
      debounceSave();
      editor.focus();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (editor.innerText.trim()) {
        if (!confirm('Clear the entire document?')) return;
      }
      clearDraft();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async function () {
      var html = editor.innerHTML;
      var text = editor.innerText;
      try {
        if (navigator.clipboard && navigator.clipboard.write && window.isSecureContext) {
          var blobHtml = new Blob([html], { type: 'text/html' });
          var blobText = new Blob([text], { type: 'text/plain' });
          var items = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
          await navigator.clipboard.write(items);
        } else {
          throw new Error('clipboard API not available');
        }
      } catch (e) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (e2) {
          /* fallback */
        }
      }
      setSaveStatus('Copied!');
      setTimeout(function () { setSaveStatus(''); }, 2000);
      editor.focus();
    });
  }

  function downloadBlob(content, mime, filename) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function getDocTitle() {
    return (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : 'fidel-swift-document';
  }

  if (exportTxtBtn) {
    exportTxtBtn.addEventListener('click', function () {
      var text = editor.innerText;
      if (!text) return;
      downloadBlob(text, 'text/plain;charset=utf-8', getDocTitle() + '.txt');
      editor.focus();
    });
  }

  if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener('click', function () {
      var title = getDocTitle();
      var html = '<!DOCTYPE html>\n<html lang="am">\n<head>\n<meta charset="UTF-8">\n<title>' +
        title + '</title>\n<style>\nbody {\n  font-family: Arial, sans-serif;\n  line-height: 1.8;\n  max-width: 800px;\n  margin: 40px auto;\n  padding: 24px;\n}\n</style>\n</head>\n<body>\n<h1>' +
        title + '</h1>\n' + editor.innerHTML + '\n</body>\n</html>';
      downloadBlob(html, 'text/html;charset=utf-8', title + '.html');
      editor.focus();
    });
  }

  if (exportDocBtn) {
    exportDocBtn.addEventListener('click', function () {
      var title = getDocTitle();
      var html = '<html>\n<head>\n<meta charset="UTF-8">\n<title>' +
        title + '</title>\n</head>\n<body>\n<h1>' +
        title + '</h1>\n' + editor.innerHTML + '\n</body>\n</html>';
      downloadBlob(html, 'application/msword;charset=utf-8', title + '.doc');
      editor.focus();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', function () {
      var printTitle = document.getElementById('writer-print-title');
      var printContent = document.getElementById('writer-print-content');
      if (printTitle) printTitle.textContent = getDocTitle();
      if (printContent) printContent.innerHTML = editor.innerHTML;
      window.print();
    });
  }

  if (titleInput) {
    titleInput.addEventListener('input', debounceSave);
  }

  restoreDraft();
})();
