/**
 * Enhanced Typewriter Effect with independent dual language support
 * Fixes the issue where Amharic text doesn't start fresh on hover
 */
class DualLanguageTypewriter {
  constructor(options = {}) {
    // Configuration with defaults
    this.config = {
      englishElement: options.englishElement || '#typewriter',
      amharicElement: options.amharicElement || '#typewriterAM',
      hoverTarget: options.hoverTarget || '.c2',
      englishPhrases: options.englishPhrases || ["[Powerful]", "[Lightweight]", "[Effortless]"],
      amharicPhrases: options.amharicPhrases || ["ፊደል ስዊፍት የአማርያኛ ኪቦርድ መተግበርያ"],
      typingDelay: options.typingDelay || 90,
      deletingDelay: options.deletingDelay || 60,
      pauseAfterCompletion: options.pauseAfterCompletion || 1200,
      pauseAfterDeletion: options.pauseAfterDeletion || 600,
      clearAmharicOnLeave: options.clearAmharicOnLeave !== false,
      ...options
    };

    // Separate state management for English and Amharic
    this.englishState = {
      currentIndex: 0,
      letterIndex: 0,
      isDeleting: false,
      animationId: null
    };

    this.amharicState = {
      currentIndex: 0,
      letterIndex: 0,
      isDeleting: false,
      isActive: false,
      animationId: null
    };

    this.isRunning = false;

    // DOM elements
    this.elements = {};
    
    // Bound methods for event listeners
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    
    this.init();
  }

  /**
   * Initialize the typewriter effect
   */
  init() {
    if (!this.validateElements()) {
      console.error('DualLanguageTypewriter: Required elements not found');
      return;
    }

    this.setupEventListeners();
    this.start();
  }

  /**
   * Validate and cache DOM elements
   */
  validateElements() {
    try {
      this.elements.english = document.querySelector(this.config.englishElement);
      this.elements.amharic = document.querySelector(this.config.amharicElement);
      this.elements.hoverTarget = document.querySelector(this.config.hoverTarget);

      return this.elements.english && this.elements.amharic;
    } catch (error) {
      console.error('DualLanguageTypewriter: Error finding elements', error);
      return false;
    }
  }

  /**
   * Setup event listeners for hover interactions
   */
  setupEventListeners() {
    if (this.elements.hoverTarget) {
      this.elements.hoverTarget.addEventListener('mouseenter', this.handleMouseEnter);
      this.elements.hoverTarget.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  /**
   * Handle mouse enter event - Start fresh Amharic typing
   */
  handleMouseEnter() {
    // Reset Amharic state to start fresh
    this.amharicState.isActive = true;
    this.amharicState.letterIndex = 0;
    this.amharicState.isDeleting = false;
    
    // Clear any existing Amharic animation
    if (this.amharicState.animationId) {
      clearTimeout(this.amharicState.animationId);
    }
    
    // Start Amharic typing immediately
    this.typeAmharicText();
  }

  /**
   * Handle mouse leave event
   */
  handleMouseLeave() {
    this.amharicState.isActive = false;
    
    // Clear Amharic animation
    if (this.amharicState.animationId) {
      clearTimeout(this.amharicState.animationId);
      this.amharicState.animationId = null;
    }
    
    if (this.config.clearAmharicOnLeave && this.elements.amharic) {
      this.elements.amharic.textContent = '';
    }
  }

  /**
   * Get current English phrase
   */
  getCurrentEnglishPhrase() {
    const index = this.englishState.currentIndex % this.config.englishPhrases.length;
    return this.config.englishPhrases[index];
  }

  /**
   * Get current Amharic phrase
   */
  getCurrentAmharicPhrase() {
    const index = this.amharicState.currentIndex % this.config.amharicPhrases.length;
    return this.config.amharicPhrases[index];
  }

  /**
   * Main English typing animation loop
   */
  typeEnglishText() {
    if (!this.isRunning) return;

    const phrase = this.getCurrentEnglishPhrase();

    if (this.elements.english) {
      this.elements.english.textContent = phrase.substring(0, this.englishState.letterIndex);
    }

    if (!this.englishState.isDeleting) {
      // Typing phase
      this.englishState.letterIndex++;
      
      if (this.englishState.letterIndex > phrase.length) {
        this.englishState.isDeleting = true;
        this.scheduleEnglishNext(this.config.pauseAfterCompletion);
        return;
      }
    } else {
      // Deleting phase
      this.englishState.letterIndex--;
      
      if (this.englishState.letterIndex < 0) {
        this.englishState.isDeleting = false;
        this.englishState.currentIndex++;
        this.scheduleEnglishNext(this.config.pauseAfterDeletion);
        return;
      }
    }

    const delay = this.englishState.isDeleting ? this.config.deletingDelay : this.config.typingDelay;
    this.scheduleEnglishNext(delay);
  }

  /**
   * Amharic typing animation loop (independent of English)
   */
  typeAmharicText() {
    if (!this.amharicState.isActive) return;

    const phrase = this.getCurrentAmharicPhrase();

    if (this.elements.amharic) {
      this.elements.amharic.textContent = phrase.substring(0, this.amharicState.letterIndex);
    }

    if (!this.amharicState.isDeleting) {
      // Typing phase
      this.amharicState.letterIndex++;
      
      if (this.amharicState.letterIndex > phrase.length) {
        this.amharicState.isDeleting = true;
        this.scheduleAmharicNext(this.config.pauseAfterCompletion);
        return;
      }
    } else {
      // Deleting phase
      this.amharicState.letterIndex--;
      
      if (this.amharicState.letterIndex < 0) {
        this.amharicState.isDeleting = false;
        this.amharicState.currentIndex++;
        this.scheduleAmharicNext(this.config.pauseAfterDeletion);
        return;
      }
    }

    const delay = this.amharicState.isDeleting ? this.config.deletingDelay : this.config.typingDelay;
    this.scheduleAmharicNext(delay);
  }

  /**
   * Schedule the next English animation frame
   */
  scheduleEnglishNext(delay) {
    this.englishState.animationId = setTimeout(() => this.typeEnglishText(), delay);
  }

  /**
   * Schedule the next Amharic animation frame
   */
  scheduleAmharicNext(delay) {
    this.amharicState.animationId = setTimeout(() => this.typeAmharicText(), delay);
  }

  /**
   * Start the typewriter effect
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.typeEnglishText();
  }

  /**
   * Stop the typewriter effect
   */
  stop() {
    this.isRunning = false;
    this.amharicState.isActive = false;
    
    if (this.englishState.animationId) {
      clearTimeout(this.englishState.animationId);
      this.englishState.animationId = null;
    }
    
    if (this.amharicState.animationId) {
      clearTimeout(this.amharicState.animationId);
      this.amharicState.animationId = null;
    }
  }

  /**
   * Reset the typewriter to initial state
   */
  reset() {
    this.stop();
    
    // Reset English state
    this.englishState.currentIndex = 0;
    this.englishState.letterIndex = 0;
    this.englishState.isDeleting = false;
    
    // Reset Amharic state
    this.amharicState.currentIndex = 0;
    this.amharicState.letterIndex = 0;
    this.amharicState.isDeleting = false;
    this.amharicState.isActive = false;
    
    if (this.elements.english) this.elements.english.textContent = '';
    if (this.elements.amharic) this.elements.amharic.textContent = '';
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Add new phrases
   */
  addPhrases(englishPhrases = [], amharicPhrases = []) {
    if (englishPhrases.length) {
      this.config.englishPhrases.push(...englishPhrases);
    }
    if (amharicPhrases.length) {
      this.config.amharicPhrases.push(...amharicPhrases);
    }
  }

  /**
   * Force restart Amharic typing (useful for debugging)
   */
  restartAmharic() {
    if (this.amharicState.isActive) {
      this.handleMouseEnter();
    }
  }

  /**
   * Clean up event listeners and timers
   */
  destroy() {
    this.stop();
    
    if (this.elements.hoverTarget) {
      this.elements.hoverTarget.removeEventListener('mouseenter', this.handleMouseEnter);
      this.elements.hoverTarget.removeEventListener('mouseleave', this.handleMouseLeave);
    }
    
    // Clear references
    this.elements = {};
  }
}

// Usage example with your original configuration
const typewriter = new DualLanguageTypewriter({
  englishPhrases: ["[Powerful]", "[Lightweight]", "[Effortless]"],
  amharicPhrases: ["ፊደል ስዊፍት የአማርኛ ኪቦርድ መተግበርያ", "Fidel Swift Amharic Keyboard Software"],
  englishElement: '#typewriter',
  amharicElement: '#typewriterAM',
  hoverTarget: '.c2',
  typingDelay: 90,
  deletingDelay: 60,
  pauseAfterCompletion: 1200,
  pauseAfterDeletion: 600
});

// Optional: Expose methods for external control
window.typewriter = typewriter;