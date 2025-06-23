/**
 * Logo Morphing Animation for Fidel Swift
 * Adapted for your specific HTML structure
 */

class FidelSwiftLogoMorph {
  constructor(options = {}) {
    this.config = {
      initialScale: 2.0, // Start 2x larger than nav logo
      morphDuration: 800,
      fadeDelay: 700,
      fadeDuration: 600,
      hideDelay: 1300,
      easing: "ease-in-out",
      debug: false,
      ...options,
    }

    this.elements = {
      preloader: null,
      preloaderLogo: null,
      navLogo: null,
    }

    this.timers = []
    this.animationId = null
  }

  init() {
    try {
      this.elements.preloader = document.getElementById("preloader")
      this.elements.preloaderLogo = document.getElementById("preloaderLogo")
      this.elements.navLogo = document.getElementById("navLogo")

      if (!this.elements.preloader || !this.elements.preloaderLogo || !this.elements.navLogo) {
        throw new Error("Required elements not found")
      }

      this.setupInitialState()
      return true
    } catch (error) {
      console.error("FidelSwiftLogoMorph initialization failed:", error)
      return false
    }
  }

  setupInitialState() {
    const { preloader, preloaderLogo, navLogo } = this.elements

    // Wait for layout to be ready
    requestAnimationFrame(() => {
      // Get nav logo dimensions
      const navRect = navLogo.getBoundingClientRect()

      // Calculate initial scale based on nav logo size
      const navWidth = navRect.width
      const navHeight = navRect.height

      // Set preloader logo to be larger initially
      const scaleTransform = `scale(${this.config.initialScale})`
      preloaderLogo.style.transform = scaleTransform

      // Setup transition properties
      preloaderLogo.style.transformOrigin = "center center"
      preloaderLogo.style.willChange = "transform"

      // Initially hide nav logo
      navLogo.style.opacity = "0"
      navLogo.style.transition = `opacity ${this.config.fadeDuration}ms ease`

      if (this.config.debug) {
        console.log(`Initial setup complete. Nav logo: ${navWidth}x${navHeight}px, Scale: ${this.config.initialScale}x`)
      }
    })
  }

  calculateTransformation() {
    const { preloaderLogo, navLogo } = this.elements

    // Force layout recalculation
    void preloaderLogo.offsetWidth
    void navLogo.offsetWidth

    const preRect = preloaderLogo.getBoundingClientRect()
    const navRect = navLogo.getBoundingClientRect()

    // Calculate center points
    const preCenterX = preRect.left + preRect.width / 2
    const preCenterY = preRect.top + preRect.height / 2
    const navCenterX = navRect.left + navRect.width / 2
    const navCenterY = navRect.top + navRect.height / 2

    // Calculate translation needed
    const translateX = navCenterX - preCenterX
    const translateY = navCenterY - preCenterY

    // Calculate final scale (from initialScale back to 1, then to nav size ratio)
    const finalScale = 2.6 / this.config.initialScale

    const transformation = {
      translateX,
      translateY,
      scale: finalScale,
      preRect,
      navRect,
    }

    if (this.config.debug) {
      console.log("Transformation calculated:", transformation)
    }

    return transformation
  }

  startAnimation() {
    this.animationId = requestAnimationFrame(() => {
      try {
        const transform = this.calculateTransformation()
        this.performMorph(transform)
      } catch (error) {
        console.error("Animation failed:", error)
        this.fallbackTransition()
      }
    })
  }

  performMorph(transform) {
    const { preloader, preloaderLogo, navLogo } = this.elements
    const { translateX, translateY, scale } = transform

    // Apply the transformation
    const transformString = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    preloaderLogo.style.transform = transformString

    if (this.config.debug) {
      console.log("Applied transform:", transformString)
    }

    // Schedule fade transition
    const fadeTimer = setTimeout(() => {
      preloader.style.opacity = "0"
      navLogo.style.opacity = "1"
    }, this.config.fadeDelay)

    // Schedule preloader removal
    const hideTimer = setTimeout(() => {
      preloader.style.display = "none"
      this.cleanup()
    }, this.config.hideDelay)

    this.timers.push(fadeTimer, hideTimer)
  }

  fallbackTransition() {
    const { preloader, navLogo } = this.elements
    preloader.style.display = "none"
    navLogo.style.opacity = "1"
    this.cleanup()
  }

  reset() {
    this.cleanup()
    const { preloader, preloaderLogo, navLogo } = this.elements

    if (preloader && preloaderLogo && navLogo) {
      preloader.style.display = "flex"
      preloader.style.opacity = "1"
      preloaderLogo.style.transform = `scale(${this.config.initialScale})`
      navLogo.style.opacity = "0"
    }
  }

  cleanup() {
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers = []

    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    if (this.elements.preloaderLogo) {
      this.elements.preloaderLogo.style.willChange = "auto"
    }
  }
}

// Initialize when page loads
window.addEventListener("load", () => {
  const logoMorph = new FidelSwiftLogoMorph({
    initialScale: 2.6,
    morphDuration: 800,
    fadeDelay: 700,
    debug: true, // Set to false in production
  })

  if (logoMorph.init()) {
    // Start animation after brief delay
    setTimeout(() => {
      logoMorph.startAnimation()
    }, 300)
  }

  // Expose for debugging
  window.fidelSwiftLogoMorph = logoMorph
})
