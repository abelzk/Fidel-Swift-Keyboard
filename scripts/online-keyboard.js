(function () {
  'use strict';

  var CONSONANTS = {
    h: ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ', 'ኋ'],
    l: ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ', 'ሏ'],
    H: ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ', 'ሗ'],
    m: ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ', 'ሟ'],
    r: ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ', 'ሯ'],
    s: ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ', 'ሷ'],
    S: ['ሸ', 'ሹ', 'ሺ', 'ሻ', 'ሼ', 'ሽ', 'ሾ', 'ሿ'],
    q: ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ', 'ቋ'],
    b: ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ', 'ቧ'],
    v: ['ቨ', 'ቩ', 'ቪ', 'ቫ', 'ቬ', 'ቭ', 'ቮ', 'ቯ'],
    t: ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ', 'ቷ'],
    c: ['ቸ', 'ቹ', 'ቺ', 'ቻ', 'ቼ', 'ች', 'ቾ', 'ቿ'],
    n: ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ', 'ኗ'],
    N: ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ', 'ኗ'],
    G: ['ኘ', 'ኙ', 'ኚ', 'ኛ', 'ኜ', 'ኝ', 'ኞ', 'ኟ'],
    x: ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ', 'ኧ'],
    k: ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ', 'ኳ'],
    K: ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ', 'ኳ'],
    w: ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ', 'ዏ'],
    z: ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ', 'ዟ'],
    Z: ['ዠ', 'ዡ', 'ዢ', 'ዣ', 'ዤ', 'ዥ', 'ዦ', 'ዧ'],
    Y: ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ', 'ዯ'],
    d: ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ', 'ዷ'],
    j: ['ጀ', 'ጁ', 'ጂ', 'ጃ', 'ጄ', 'ጅ', 'ጆ', 'ጇ'],
    g: ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ', 'ጏ'],
    T: ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ', 'ጧ'],
    C: ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ', 'ጯ'],
    P: ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ', 'ጷ'],
    X: ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ', 'ፇ'],
    f: ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ', 'ፏ'],
    p: ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ', 'ፗ']
  };

  var CONSONANTS_CAPS = {
    H: ['ኸ', 'ኹ', 'ኺ', 'ኻ', 'ኼ', 'ኽ', 'ኾ', 'ዃ'],
    K: ['ኸ', 'ኹ', 'ኺ', 'ኻ', 'ኼ', 'ኽ', 'ኾ'],
    S: ['ሠ', 'ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ', 'ሧ'],
    X: ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ']
  };

  var VOWELS = {
    u: 1,
    i: 2,
    a: 3,
    y: 4,
    e: 5,
    o: 6,
    ']': 7,
    U: 1,
    I: 2,
    A: 3,
    Y: 4,
    E: 5,
    O: 6
  };

  var SPECIAL_CHARS = {
    ',': '፣',
    '.': '።',
    ';': '፤',
    ':': '፡'
  };

  var editor = document.getElementById('keyboard-editor');
  var docTitle = document.getElementById('doc-title');
  var charCount = document.getElementById('char-count');
  var wordCount = document.getElementById('word-count');
  var clearBtn = document.getElementById('clear-btn');
  var copyBtn = document.getElementById('copy-btn');
  var copyStatus = document.getElementById('copy-status');
  var downloadBtn = document.getElementById('download-btn');
  var printBtn = document.getElementById('print-btn');
  var exportDocBtn = document.getElementById('export-doc-btn');
  var templateSelect = document.getElementById('template-select');
  var saveStatus = document.getElementById('save-status');

  if (!editor) {
    console.error('[Fidel Swift] Missing #keyboard-editor.');
    return;
  }

  var activeTextNode = null;
  var activeOffset = null;
  var activeChars = null;
  var saveTimer = null;

  var STORAGE_KEY_TITLE = 'fidelSwiftDocTitle';
  var STORAGE_KEY_CONTENT = 'fidelSwiftDocContent';

  function updateCounts() {
    var text = editor.innerText || '';

    if (charCount) {
      charCount.textContent = String(text.length);
    }

    if (wordCount) {
      var words = text.trim() ? text.trim().split(/\s+/).length : 0;
      wordCount.textContent = String(words);
    }
  }

  function setSaveStatus(msg) {
    if (saveStatus) {
      saveStatus.textContent = msg;
    }
  }

  function saveDraft() {
    var title = docTitle ? docTitle.value : '';
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

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    saveTimer = setTimeout(saveDraft, 500);
  }

  function restoreDraft() {
    try {
      var savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);
      var savedContent = localStorage.getItem(STORAGE_KEY_CONTENT);

      if (savedTitle !== null && docTitle) {
        docTitle.value = savedTitle;
      }

      if (savedContent !== null) {
        editor.innerHTML = savedContent;
        setSaveStatus('Restored draft');

        setTimeout(function () {
          setSaveStatus('');
        }, 2000);
      }
    } catch (e) {}

    updateCounts();
  }

  function clearDraft() {
    if (docTitle) {
      docTitle.value = '';
    }

    editor.innerHTML = '';

    try {
      localStorage.removeItem(STORAGE_KEY_TITLE);
      localStorage.removeItem(STORAGE_KEY_CONTENT);
      setSaveStatus('Draft cleared');

      setTimeout(function () {
        setSaveStatus('');
      }, 2000);
    } catch (e) {}

    resetActiveConsonant();
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

  function isUppercaseConsonantKey(event) {
    return event.key.length === 1 &&
      event.key === event.key.toUpperCase() &&
      CONSONANTS[event.key];
  }

  function isStandaloneVowelKey(event) {
  return event.key.length === 1 &&
    Object.prototype.hasOwnProperty.call(VOWELS, event.key);
}

  function getCurrentRange() {
    var sel = window.getSelection();

    if (!sel || sel.rangeCount === 0) {
      return null;
    }

    var range = sel.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
      return null;
    }

    return range;
  }

  function insertTextAtCaret(text) {
    var range = getCurrentRange();

    if (!range) {
      return null;
    }

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
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      return false;
    }

    textNode.textContent = replacement;

    var range = document.createRange();
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    return true;
  }

  function getCharsForConsonant(key, event) {
    var capsOn = event.getModifierState && event.getModifierState('CapsLock');

    if (capsOn && CONSONANTS_CAPS[key]) {
      return CONSONANTS_CAPS[key];
    }

    return CONSONANTS[key] || null;
  }

  function handleVowelKey(event) {
    var vowelIndex = VOWELS[event.key];

    if (vowelIndex === undefined || activeChars === null || activeTextNode === null) {
      return false;
    }

    var replacement = activeChars[vowelIndex];

    if (!replacement) {
      resetActiveConsonant();
      return false;
    }

    event.preventDefault();

    replaceLastChar(activeTextNode, 0, replacement);

    activeOffset = 0;

    updateCounts();
    debounceSave();

    return true;
  }

  function handleConsonantKey(event) {
    var chars = getCharsForConsonant(event.key, event);

    if (!chars) {
      return false;
    }

    event.preventDefault();

    var textNode = insertTextAtCaret(chars[0]);

    if (!textNode) {
      return false;
    }

    activeTextNode = textNode;
    activeOffset = 0;
    activeChars = chars;

    updateCounts();
    debounceSave();

    return true;
  }

  function handleSpecialChar(event) {
    var replacement = SPECIAL_CHARS[event.key];

    if (!replacement) {
      return false;
    }

    event.preventDefault();

    insertTextAtCaret(replacement);
    resetActiveConsonant();
    updateCounts();
    debounceSave();

    return true;
  }

  editor.addEventListener('keydown', function (event) {
  if (isModifierPressed(event)) {
    return;
  }

  var navigationKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Escape'
  ];

  if (navigationKeys.includes(event.key)) {
    resetActiveConsonant();
    return;
  }

  if (event.key === 'Backspace' || event.key === 'Delete') {
    resetActiveConsonant();
    return;
  }

  /*
    Uppercase consonants must be handled before vowel logic.
    Example:
      Shift + Y should insert የ
      not modify previous ር into ሬ
  */
  if (isUppercaseConsonantKey(event)) {
    resetActiveConsonant();

    if (handleConsonantKey(event)) {
      return;
    }
  }

  /*
    If there is an active consonant, vowel keys modify it.
    Example:
      b + y = ቤ
      l + e = ል
  */
  if (handleVowelKey(event)) {
    return;
  }

  /*
    Standalone vowel keys should not type English letters.
    This prevents a, e, i, o, u, y, ], A, E, I, O, U, Y from appearing
    when they are not modifying a previous consonant.

    To type independent vowel characters, use the x family:
      x  = አ
      xu = ኡ
      xi = ኢ
      xa = ኣ
      xy = ኤ
      xe = እ
      xo = ኦ
      x] = ኧ
  */
  if (isStandaloneVowelKey(event)) {
    event.preventDefault();
    resetActiveConsonant();
    return;
  }

  if (handleConsonantKey(event)) {
    return;
  }

  if (handleSpecialChar(event)) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') {
    resetActiveConsonant();
  }
});

  editor.addEventListener('input', function () {
    updateCounts();
    debounceSave();
  });

  editor.addEventListener('paste', function () {
    resetActiveConsonant();

    setTimeout(function () {
      updateCounts();
      debounceSave();
    }, 0);
  });

  var FORMAT_CHECKS = {
    bold: function () {
      return document.queryCommandState('bold');
    },
    italic: function () {
      return document.queryCommandState('italic');
    },
    underline: function () {
      return document.queryCommandState('underline');
    },
    heading1: function () {
      var v = document.queryCommandValue('formatBlock');
      return v.replace(/[<>]/g, '').toLowerCase() === 'h1';
    },
    heading2: function () {
      var v = document.queryCommandValue('formatBlock');
      return v.replace(/[<>]/g, '').toLowerCase() === 'h2';
    },
    paragraph: function () {
      var v = document.queryCommandValue('formatBlock');
      return v.replace(/[<>]/g, '').toLowerCase() === 'p';
    },
    bullet: function () {
      return document.queryCommandState('insertUnorderedList');
    },
    numbered: function () {
      return document.queryCommandState('insertOrderedList');
    },
    'align-left': function () {
      return document.queryCommandState('justifyLeft');
    },
    'align-center': function () {
      return document.queryCommandState('justifyCenter');
    },
    'align-right': function () {
      return document.queryCommandState('justifyRight');
    }
  };

  function updateToolbarState() {
    var sel = window.getSelection();

    if (!sel || (!editor.contains(document.activeElement) && !editor.contains(sel.focusNode))) {
      return;
    }

    var buttons = document.querySelectorAll('[data-format]');

    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var fmt = btn.getAttribute('data-format');
      var check = FORMAT_CHECKS[fmt];

      if (check) {
        btn.classList.toggle('active', !!check());
      } else {
        btn.classList.remove('active');
      }
    }
  }

  editor.addEventListener('mouseup', updateToolbarState);
  editor.addEventListener('keyup', updateToolbarState);

  var FORMAT_COMMANDS = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    heading1: ['formatBlock', 'h1'],
    heading2: ['formatBlock', 'h2'],
    paragraph: ['formatBlock', 'p'],
    bullet: 'insertUnorderedList',
    numbered: 'insertOrderedList',
    'align-left': 'justifyLeft',
    'align-center': 'justifyCenter',
    'align-right': 'justifyRight',
    'clear-format': 'removeFormat'
  };

  function execFormat(id) {
    var cmd = FORMAT_COMMANDS[id];

    if (!cmd) {
      return;
    }

    resetActiveConsonant();

    var sel = window.getSelection();
    var savedRange = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

    editor.focus();

    if (savedRange) {
      var newSel = window.getSelection();
      newSel.removeAllRanges();
      newSel.addRange(savedRange);
    }

    if (Array.isArray(cmd)) {
      document.execCommand(cmd[0], false, cmd[1]);
    } else {
      document.execCommand(cmd, false, null);
    }

    updateCounts();
    debounceSave();
    updateToolbarState();
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-format]');

    if (!btn) {
      return;
    }

    var formatId = btn.getAttribute('data-format');

    if (formatId) {
      execFormat(formatId);
    }
  });

  var fontSizeSelect = document.getElementById('font-size-select');

  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', function () {
      resetActiveConsonant();

      var size = this.value;
      var sel = window.getSelection();

      if (!sel.rangeCount || sel.isCollapsed) {
        editor.style.fontSize = size + 'px';
        debounceSave();
        return;
      }

      var savedRange = sel.getRangeAt(0);
      editor.focus();

      var newSel = window.getSelection();
      newSel.removeAllRanges();
      newSel.addRange(savedRange);

      document.execCommand('fontSize', false, 7);

      var fonts = editor.querySelectorAll('font[size="7"]');

      for (var i = 0; i < fonts.length; i++) {
        var span = document.createElement('span');
        span.style.fontSize = size + 'px';

        while (fonts[i].firstChild) {
          span.appendChild(fonts[i].firstChild);
        }

        fonts[i].parentNode.replaceChild(span, fonts[i]);
      }

      updateCounts();
      debounceSave();
      updateToolbarState();
    });
  }

  var lineHeightSelect = document.getElementById('line-height-select');

  if (lineHeightSelect) {
    lineHeightSelect.addEventListener('change', function () {
      resetActiveConsonant();

      var val = this.value;
      var blocks = editor.querySelectorAll('p, h1, h2, h3, h4, li, div');

      for (var i = 0; i < blocks.length; i++) {
        blocks[i].style.lineHeight = val;
      }

      debounceSave();
    });
  }

  function applySpacingToSelection(prop, val) {
    resetActiveConsonant();

    var sel = window.getSelection();

    if (!sel.rangeCount || sel.isCollapsed) {
      var blocks = editor.querySelectorAll('p, h1, h2, h3, h4, li, div, span');

      for (var i = 0; i < blocks.length; i++) {
        blocks[i].style[prop] = val;
      }

      debounceSave();
      return;
    }

    var savedRange = sel.getRangeAt(0);
    editor.focus();

    var newSel = window.getSelection();
    newSel.removeAllRanges();
    newSel.addRange(savedRange);

    document.execCommand('fontSize', false, 7);

    var fonts = editor.querySelectorAll('font[size="7"]');

    for (var j = 0; j < fonts.length; j++) {
      var span = document.createElement('span');
      span.style[prop] = val;

      while (fonts[j].firstChild) {
        span.appendChild(fonts[j].firstChild);
      }

      fonts[j].parentNode.replaceChild(span, fonts[j]);
    }

    updateCounts();
    debounceSave();
    updateToolbarState();
  }

  var letterSpacingSelect = document.getElementById('letter-spacing-select');

  if (letterSpacingSelect) {
    letterSpacingSelect.addEventListener('change', function () {
      applySpacingToSelection('letterSpacing', this.value + 'px');
    });
  }

  var wordSpacingSelect = document.getElementById('word-spacing-select');

  if (wordSpacingSelect) {
    wordSpacingSelect.addEventListener('change', function () {
      applySpacingToSelection('wordSpacing', this.value + 'px');
    });
  }

  var TEMPLATES = {
    '': '<p style="line-height: 1.8;"><br></p>',
    blank: '<p style="line-height: 1.8;"><br></p>',
    'formal-letter': '<h1>መደበኛ ደብዳቤ</h1><p>ቀን፡ __________</p><p>ለ፡ __________</p><p>ጉዳዩ፡ __________</p><p style="line-height: 1.8;"><br></p><p>ክቡር ኃላፊ፣</p><p style="line-height: 1.8;"><br></p><p>ይህ ደብዳቤ የሚጻፈው __________ን በተመለከተ ነው።</p><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><p>ከሰላምታ ጋር፣</p><p>ስም፡ __________</p><p>ፊርማ፡ __________</p>',
    application: '<h1>የማመልከቻ ደብዳቤ</h1><p>ቀን፡ __________</p><p>ለ፡ __________</p><p>ጉዳዩ፡ __________</p><p style="line-height: 1.8;"><br></p><p>እኔ __________ ለ __________ ለማመልከት ይህን ደብዳቤ አቀርባለሁ።</p><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><p>ከሰላምታ ጋር፣</p><p>ስም፡ __________</p>',
    minutes: '<h1>የስብሰባ ማስታወሻ</h1><p>ቀን፡ __________</p><p>ሰዓት፡ __________</p><p>ቦታ፡ __________</p><p>ተሳታፊዎች፡ __________</p><p style="line-height: 1.8;"><br></p><h2>የውይይት ነጥቦች</h2><p>1. __________</p><p>2. __________</p><p>3. __________</p><p style="line-height: 1.8;"><br></p><h2>ውሳኔዎች</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ቀጣይ እርምጃዎች</h2><p>__________</p>',
    assignment: '<h1>የትምህርት ሥራ</h1><p>የተማሪ ስም፡ __________</p><p>ክፍል፡ __________</p><p>ትምህርት፡ __________</p><p>ቀን፡ __________</p><p style="line-height: 1.8;"><br></p><h2>ርዕስ፡ __________</h2><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ማጠቃለያ</h2><p>__________</p>',
    cv: '<h1>የትምህርትና የሥራ ልምድ ማጠቃለያ</h1><p style="line-height: 1.8;"><br></p><h2>የግል መረጃ</h2><p>ሙሉ ስም፡ __________</p><p>አድራሻ፡ __________</p><p>ስልክ፡ __________</p><p>ኢሜል፡ __________</p><p style="line-height: 1.8;"><br></p><h2>የትምህርት ታሪክ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>የሥራ ልምድ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ክህሎቶች</h2><p>__________</p>',
    proposal: '<h1>የንግድ ሐሳብ</h1><p>የተዘጋጀው በ፡ __________</p><p>ቀን፡ __________</p><p style="line-height: 1.8;"><br></p><h2>የፕሮጀክቱ ርዕስ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ዓላማ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>ዕቅድ</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>በጀት</h2><p>__________</p><p style="line-height: 1.8;"><br></p><h2>መደምደሚያ</h2><p>__________</p>',
    notice: '<h1>ማስታወቂያ</h1><p>ቀን፡ __________</p><p style="line-height: 1.8;"><br></p><p>ለሁሉም __________ ይታወቅ።</p><p style="line-height: 1.8;"><br></p><p>__________</p><p style="line-height: 1.8;"><br></p><p>ከሰላምታ ጋር፣</p><p>__________</p>'
  };

  if (templateSelect) {
    templateSelect.addEventListener('change', function () {
      var key = templateSelect.value;

      if (!key || !TEMPLATES[key]) {
        return;
      }

      if (editor.innerText.trim()) {
        if (!confirm('Replace current document content?')) {
          templateSelect.value = '';
          return;
        }
      }

      resetActiveConsonant();
      editor.innerHTML = TEMPLATES[key];
      updateCounts();
      debounceSave();
      editor.focus();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (editor.innerText.trim()) {
        if (!confirm('Clear the entire document?')) {
          return;
        }
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

          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': blobHtml,
              'text/plain': blobText
            })
          ]);
        } else {
          throw new Error('ClipboardItem API unavailable');
        }
      } catch (e) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (e2) {}
      }

      if (copyStatus) {
        copyStatus.textContent = 'Copied!';
        copyStatus.classList.add('copy-success');

        setTimeout(function () {
          copyStatus.textContent = '';
          copyStatus.classList.remove('copy-success');
        }, 2000);
      }

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

  function safeFilename(name) {
    return name
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  function getDocTitle() {
    var title = docTitle && docTitle.value.trim() ? docTitle.value.trim() : 'fidel-swift-document';
    return safeFilename(title) || 'fidel-swift-document';
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      var text = editor.innerText;

      if (!text) {
        return;
      }

      downloadBlob(text, 'text/plain;charset=utf-8', getDocTitle() + '.txt');
      editor.focus();
    });
  }

  if (exportDocBtn) {
    exportDocBtn.addEventListener('click', function () {
      var title = getDocTitle();

      var html = '<!DOCTYPE html>\n<html lang="am">\n<head>\n<meta charset="UTF-8">\n<title>' +
        title +
        '</title>\n<style>body{font-family:Arial,sans-serif;line-height:1.8;max-width:800px;margin:40px auto;padding:24px;color:#000;}h1,h2,h3,p{margin-top:0;}ul,ol{padding-left:24px;}</style>\n</head>\n<body>\n<h1>' +
        title +
        '</h1>\n' +
        editor.innerHTML +
        '\n</body>\n</html>';

      downloadBlob(html, 'application/msword;charset=utf-8', title + '.doc');
      editor.focus();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', function () {
      var title = getDocTitle();
      var content = editor.innerHTML;
      var pw = window.open('', '_blank', 'width=800,height=600');

      if (!pw) {
        alert('Please allow pop-ups to print.');
        return;
      }

      pw.document.write(
        '<!DOCTYPE html><html lang="am"><head><meta charset="UTF-8"><title>' +
          title +
          '</title>' +
          '<style>' +
          '@page{size:A4;margin:10mm;}' +
          '*{box-sizing:border-box;}' +
          'body{font-family:Arial,sans-serif;font-size:12pt;line-height:1.6;color:#000;background:#fff;margin:0;padding:10mm;}' +
          'p,h1,h2,h3,ul,ol,li{margin-top:0;}' +
          'p{line-height:1.6;margin-bottom:6pt;}' +
          'h1{font-size:16pt;margin-bottom:8pt;}' +
          'h2{font-size:14pt;margin-bottom:6pt;}' +
          'ul,ol{padding-left:24pt;margin-bottom:6pt;}' +
          'li{line-height:1.6;}' +
          '</style>' +
          '</head><body>' +
          content +
          '</body></html>'
      );

      pw.document.close();
      pw.focus();

      setTimeout(function () {
        pw.print();
      }, 250);
    });
  }

  if (docTitle) {
    docTitle.addEventListener('input', debounceSave);
  }

  restoreDraft();

  (function () {
    var toolbar = document.querySelector('.toolbar');
    var leftBtn = document.getElementById('toolbar-scroll-left');
    var rightBtn = document.getElementById('toolbar-scroll-right');

    if (!toolbar || !leftBtn || !rightBtn) {
      return;
    }

    function updateToolbarArrows() {
      leftBtn.style.display = toolbar.scrollLeft > 0 ? 'flex' : 'none';
      rightBtn.style.display =
        toolbar.scrollLeft < toolbar.scrollWidth - toolbar.clientWidth - 4 ? 'flex' : 'none';
    }

    leftBtn.addEventListener('click', function () {
      toolbar.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', function () {
      toolbar.scrollBy({ left: 200, behavior: 'smooth' });
    });

    toolbar.addEventListener('scroll', updateToolbarArrows);
    window.addEventListener('resize', updateToolbarArrows);

    updateToolbarArrows();
  })();

  var maximizeBtn = document.getElementById('maximize-btn');
  var minimizeBtn = document.getElementById('minimize-btn');
  var fsTopBar = document.getElementById('fullscreen-top-bar');
  var fsOptionsBtn = document.getElementById('fullscreen-options-btn');
  var fsOptionsPanel = document.getElementById('fullscreen-options-panel');
  var fsPanelClose = document.getElementById('fs-panel-close');
  var fullscreenHide = [];

  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', function () {
      document.documentElement.classList.add('editor-fullscreen');

      if (fsTopBar) {
        fsTopBar.style.display = 'flex';
      }

      var els = document.querySelectorAll(
        'nav, footer, .preloader-def, #mode-cards-wrapper, .w-full.mr-btm-2:not(#editor-container):not(.editor-fullscreen #editor-container), .hero-title, .text-muted-foreground'
      );

      for (var i = 0; i < els.length; i++) {
        if (els[i].closest('#editor-container')) {
          continue;
        }

        els[i].style.display = 'none';
        fullscreenHide.push(els[i]);
      }
    });
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', function () {
      document.documentElement.classList.remove('editor-fullscreen');

      if (fsTopBar) {
        fsTopBar.style.display = 'none';
      }

      if (fsOptionsPanel) {
        fsOptionsPanel.style.display = 'none';
      }

      for (var i = 0; i < fullscreenHide.length; i++) {
        fullscreenHide[i].style.display = '';
      }

      fullscreenHide = [];
    });
  }

  if (fsOptionsBtn && fsOptionsPanel) {
    fsOptionsBtn.addEventListener('click', function () {
      var shown = fsOptionsPanel.style.display !== 'none';
      fsOptionsPanel.style.display = shown ? 'none' : 'block';
    });
  }

  if (fsPanelClose && fsOptionsPanel) {
    fsPanelClose.addEventListener('click', function () {
      fsOptionsPanel.style.display = 'none';
    });
  }

  function wireFsBtn(btnId, targetBtn) {
    var btn = document.getElementById(btnId);

    if (btn && targetBtn) {
      btn.addEventListener('click', function () {
        targetBtn.click();
      });
    }
  }

  wireFsBtn('fs-clear-btn', clearBtn);
  wireFsBtn('fs-copy-btn', copyBtn);
  wireFsBtn('fs-print-btn', printBtn);
  wireFsBtn('fs-dl-txt-btn', downloadBtn);
  wireFsBtn('fs-dl-doc-btn', exportDocBtn);
})();
