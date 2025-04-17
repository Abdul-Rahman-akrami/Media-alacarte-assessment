import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer2,
  HostListener
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ApplicationRef } from '@angular/core';
import { NodeBackgroundComponent } from '../node-background/node-background.component';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  imports: [NodeBackgroundComponent]
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mobileMenuOverlay') mobileMenuOverlay!: ElementRef;
  @ViewChild('mobileMenuContent') mobileMenuContent!: ElementRef;
  @ViewChild('ctaButton', { static: false }) buttonRef!: ElementRef;
  @ViewChild('ctaFlair', { static: true }) flairRef!: ElementRef;
  @ViewChild('ctaLabel', { static: true }) labelRef!: ElementRef;


  private menuAnimation: any;
  private buttonAnimation: any;
  private animationInterval: any;
  private animationDuration = 1;


  private isLoaded = false;


  private isMenuOpen = false;
  private textItems: HTMLElement[] = [];
  private currentBottom!: HTMLElement;
  private currentCenter!: HTMLElement;
  private currentTop!: HTMLElement;


  private xSet!: (value: number) => void;
  private ySet!: (value: number) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private appRef: ApplicationRef
  ) {}



  ngOnInit(): void {
    // Initialize animations after a brief delay to ensure DOM is ready
    setTimeout(() => {
      this.setupMenuAnimation();
      this.setupButtonAnimation();
    });
  }

  async ngAfterViewInit() {
    // Wait for Angular to stabilize before initializing view-dependent animations
    await this.waitForStable();

    // Initialize all animations
    this.initializeAnimation();
    this.setupTextScroll();
    this.setupRibbonScroll();
    this.setupButtonHoverEffects();
  }

  ngOnDestroy(): void {
    // Clean up animations to prevent memory leaks
    this.stopAnimation();
  }

  // =============================================
  // Menu Functionality
  // =============================================

  /**
   * Sets up the mobile menu animation timeline
   */
  private setupMenuAnimation(): void {
    if (!this.mobileMenuOverlay || !this.mobileMenuContent) {
      console.error('Menu elements not found');
      return;
    }

    this.menuAnimation = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" }
    })
    .to(this.mobileMenuOverlay.nativeElement, {
      opacity: 1,
      visibility: 'visible',
      duration: 0.3
    })
    .from(this.mobileMenuContent.nativeElement.querySelectorAll('li'), {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.3
    }, "-=0.2")
    .from(this.mobileMenuContent.nativeElement.querySelector('.mobile-loginBtn'), {
      opacity: 0,
      y: 20,
      duration: 0.3
    }, "-=0.1");

    // Initialize menu in closed state
    this.menuAnimation.reverse();
  }

  /**
   * Toggles the mobile menu open/close state
   */
  toggleMobileMenu(): void {
    if (!this.menuAnimation) {
      console.error('Menu animation not initialized');
      return;
    }

    if (this.isMenuOpen) {
      this.menuAnimation.reverse();
      this.buttonAnimation.reverse();
    } else {
      this.menuAnimation.play();
      this.buttonAnimation.play();
    }
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Closes the mobile menu
   */
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.menuAnimation.reverse();
      this.isMenuOpen = false;
    }
  }

  // =============================================
  // Button Animations
  // =============================================

  /**
   * Sets up the menu button animation
   */
  private setupButtonAnimation(): void {
    const button = document.querySelector('.menu-toggle');
    if (!button) return;

    const q = gsap.utils.selector(button);
    const offset = button.getBoundingClientRect().height * 0.2;

    // Initial animation on load
    gsap.set(button, { autoAlpha: 1 });
    gsap.from(q(".toggle-bar"), {
      y: gsap.utils.wrap([offset, -offset]),
      duration: 0.15,
      ease: "power4.in"
    });
    gsap.from(q(".text"), { opacity: 0 });

    // Button animation timeline
    this.buttonAnimation = gsap.timeline({
      paused: true,
      defaults: { duration: 0.3, ease: "power3.in" }
    })
    .to(q(".toggle-bar"), { y: 0 })
    .to(q(".toggle-bar"), {
      rotate: gsap.utils.wrap([45 * 3, 45 * 5]),
      duration: 0.45
    }, "<")
    .to(q(".text"), {
      opacity: 0,
      duration: 0.1
    }, "<");
  }

  /**
   * Sets up hover effects for the CTA button
   */
  private setupButtonHoverEffects(): void {
    const button = this.buttonRef.nativeElement;
    const flair = this.flairRef.nativeElement;
    const label = this.labelRef.nativeElement;

    // Initialize quick setters for performance
    this.xSet = gsap.quickSetter(flair, "xPercent") as (value: number) => void;
    this.ySet = gsap.quickSetter(flair, "yPercent") as (value: number) => void;

    // Mouse enter effect
    button.addEventListener("mouseenter", (e: MouseEvent) => {
      const { x, y } = this.getXY(e, button);
      this.xSet(x);
      this.ySet(y);

      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(label, {
        color: "#d9207c",
        duration: 0.8,
        ease: "power2.out"
      });
    });

    // Mouse leave effect
    button.addEventListener("mouseleave", (e: MouseEvent) => {
      const { x, y } = this.getXY(e, button);
      gsap.to(label, {
        color: "white",
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(flair, {
        xPercent: x > 0 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 0 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    // Mouse move effect
    button.addEventListener("mousemove", (e: MouseEvent) => {
      const { x, y } = this.getXY(e, button);
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  }

  /**
   * Calculates normalized x,y coordinates relative to button
   */
  private getXY(e: MouseEvent, button: HTMLElement): { x: number; y: number } {
    const { left, top, width, height } = button.getBoundingClientRect();

    const xTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, width, 0, 100),
      gsap.utils.clamp(0, 100)
    );

    const yTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, height, 0, 100),
      gsap.utils.clamp(0, 100)
    );

    return {
      x: xTransformer(e.clientX - left),
      y: yTransformer(e.clientY - top)
    };
  }

  // =============================================
  // Text Animation System
  // =============================================

  /**
   * Initializes the text animation system
   */
  private initializeAnimation(): void {
    this.textItems = Array.from(document.querySelectorAll('.hero-text-item')) as HTMLElement[];

    if (this.textItems.length >= 3) {
      this.currentBottom = this.textItems[0];
      this.currentCenter = this.textItems[1];
      this.currentTop = this.textItems[2];

      this.setInitialStyles();
      this.startAutoScroll();
    }
  }

  /**
   * Sets initial styles for the text animation
   */
  private setInitialStyles(): void {
    gsap.set(this.currentBottom, { y: 60, opacity: 0.6, fontSize: '36px' });
    gsap.set(this.currentCenter, { y: 0, opacity: 1, fontSize: '80px' });
    gsap.set(this.currentTop, { y: -60, opacity: 0.6, fontSize: '36px' });
  }

  /**
   * Rotates the text elements in the animation sequence
   */
  private rotateTexts(): void {
    const {
      yTop, yCenter, yBottom, yHidden,
      fontSizeTop, fontSizeCenter, fontSizeBottom, fontSizeHidden
    } = this.getViewportValues();

    // Animate current top text out
    gsap.to(this.currentTop, {
      y: yHidden,
      opacity: 0,
      fontSize: fontSizeHidden,
      duration: this.animationDuration,
      ease: "sine.inOut",
      onComplete: () => {
        gsap.set(this.currentTop, {
          y: yBottom + 10,
          opacity: 0,
          fontSize: '0px'
        });

        gsap.to(this.currentTop, {
          y: yBottom,
          opacity: 0.6,
          fontSize: fontSizeBottom,
          duration: this.animationDuration * 2,
          ease: "expo.out",
          onComplete: () => {
            this.currentTop.classList.remove('hero-text-item--top', 'hero-text-item--center');
            this.currentTop.classList.add('hero-text-item--bottom');
          }
        });
      }
    });

    // Animate current bottom to center
    gsap.to(this.currentBottom, {
      y: yCenter,
      opacity: 1,
      fontSize: fontSizeCenter,
      duration: this.animationDuration * 2,
      ease: "power2.inOut",
      onComplete: () => {
        this.currentBottom.classList.remove('text-bottom', 'text-top');
        this.currentBottom.classList.add('text-center');
      }
    });

    // Animate current center to top
    gsap.to(this.currentCenter, {
      y: yTop,
      opacity: 0.6,
      fontSize: fontSizeTop,
      duration: this.animationDuration * 2,
      ease: "power2.inOut",
      onComplete: () => {
        this.currentCenter.classList.remove('text-center', 'text-bottom');
        this.currentCenter.classList.add('text-top');
        this.updateElementReferences();
      }
    });
  }

  /**
   * Gets viewport-specific values for responsive animation
   */
  private getViewportValues(): {
    yTop: number, yCenter: number, yBottom: number, yHidden: number,
    fontSizeTop: string, fontSizeCenter: string, fontSizeBottom: string, fontSizeHidden: string
  } {
    const viewportWidth = window.innerWidth;
    const breakpoints = {
      mobile: 480, mid: 650, tablet: 768, desktop: 1024, large: 1200
    };

    // Define responsive values for each breakpoint
    const values = {
      mobile: {
        yTop: -25, yCenter: 0, yBottom: 50, yHidden: -60,
        fontSizeTop: '16px', fontSizeCenter: '28px', fontSizeBottom: '16px', fontSizeHidden: '10px'
      },
      mid: {
        yTop: -30, yCenter: 0, yBottom: 60, yHidden: -50,
        fontSizeTop: '22.1px', fontSizeCenter: '45.9px', fontSizeBottom: '22.1px', fontSizeHidden: '14px'
      },
      tablet: {
        yTop: -35, yCenter: 0, yBottom: 70, yHidden: -40,
        fontSizeTop: '26px', fontSizeCenter: '54px', fontSizeBottom: '26px', fontSizeHidden: '18px'
      },
      desktop: {
        yTop: -35, yCenter: 0, yBottom: 70, yHidden: -50,
        fontSizeTop: '28.8px', fontSizeCenter: '56px', fontSizeBottom: '28.8px', fontSizeHidden: '18px'
      },
      large: {
        yTop: -40, yCenter: 0, yBottom: 100, yHidden: -60,
        fontSizeTop: '36px', fontSizeCenter: '80px', fontSizeBottom: '36px', fontSizeHidden: '24px'
      }
    };

    // Return appropriate values based on viewport width
    if (viewportWidth >= breakpoints.large) return values.large;
    if (viewportWidth >= breakpoints.desktop) return values.desktop;
    if (viewportWidth >= breakpoints.tablet) return values.tablet;
    if (viewportWidth >= breakpoints.mid) return values.mid;
    return values.mobile;
  }

  /**
   * Updates element references after animation cycle
   */
  private updateElementReferences(): void {
    const newBottom = this.currentTop;
    const newCenter = this.currentBottom;
    const newTop = this.currentCenter;

    this.currentBottom = newBottom;
    this.currentCenter = newCenter;
    this.currentTop = newTop;
  }

  /**
   * Starts the auto-scroll animation
   */
  private startAutoScroll(): void {
    this.rotateTexts();
    this.animationInterval = setInterval(() => this.rotateTexts(), 3000);
  }

  /**
   * Stops all animations
   */
  private stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  // =============================================
  // Scrolling Text Effects
  // =============================================

  /**
   * Sets up the ribbon scroll effect
   */
  private setupRibbonScroll(): void {
    const backText = document.querySelector('.ribbon-scroll--back p');
    const frontText = document.querySelector('.ribbon-scroll--front p');

    // Duplicate text for seamless looping
    if (backText) backText.innerHTML += ' ' + backText.textContent;
    if (frontText) frontText.innerHTML += ' ' + frontText.textContent;

    const scrollSpeed = 100; // pixels per second

    // Animate back text
    if (backText) {
      const backDuration = backText.scrollWidth / scrollSpeed;
      gsap.to(backText, {
        x: `-=${backText.scrollWidth/2}`,
        duration: backDuration,
        ease: 'none',
        repeat: -1
      });
    }

    // Animate front text
    if (frontText) {
      const frontDuration = frontText.scrollWidth / scrollSpeed;
      gsap.to(frontText, {
        x: `-=${frontText.scrollWidth/2}`,
        duration: frontDuration,
        ease: 'none',
        repeat: -1
      });
    }
  }

  /**
   * Sets up the text scroll effect
   */
  private setupTextScroll(): void {
    const scrollSpeed = 100; // pixels per second

    // Back text animation
    const backText = document.querySelector('.ribbon-text-back .ribbon-text');
    if (backText) {
      const width = backText.clientWidth;
      gsap.to('.ribbon-text-back .ribbon-text-scroller', {
        x: -width,
        duration: width / scrollSpeed,
        ease: 'none',
        repeat: -1
      });
    }

    // Front text animation (faster)
    const frontText = document.querySelector('.ribbon-text-front .ribbon-text');
    if (frontText) {
      const width = frontText.clientWidth;
      gsap.to('.ribbon-text-front .ribbon-text-scroller', {
        x: -width,
        duration: width / (scrollSpeed * 1.3),
        ease: 'none',
        repeat: -1
      });
    }
  }

  // =============================================
  // Utility Methods
  // =============================================

  /**
   * Waits for Angular to stabilize before proceeding
   */
  private async waitForStable(): Promise<void> {
    if (this.appRef.isStable) return;

    return new Promise(resolve => {
      const sub = this.appRef.isStable.subscribe(stable => {
        if (stable) {
          sub.unsubscribe();
          resolve();
        }
      });
    });
  }

  // =============================================
  // Event Listeners
  // =============================================

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Close menu if window is resized to desktop size
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.menuAnimation.reverse();
      this.isMenuOpen = false;
    }
  }
}

