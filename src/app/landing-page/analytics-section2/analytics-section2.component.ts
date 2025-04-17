// import { AfterViewInit, Component, ElementRef } from '@angular/core';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @Component({
//   selector: 'app-analytics-section2',
//   imports: [],
//   templateUrl: './analytics-section2.component.html',
//   styleUrl: './analytics-section2.component.scss',
// })
// export class AnalyticsSection2Component implements AfterViewInit {
//   constructor(private el: ElementRef) {
//     gsap.registerPlugin(ScrollTrigger);
//   }

//   ngAfterViewInit() {
//     this.initAnimation();
//   }

//   initAnimation() {
//     const analyticsSection = this.el.nativeElement.querySelector('.analytics');

//     // Set initial state
//     gsap.set(analyticsSection, {
//       scale: 0.8,
//       opacity: 0.7,
//     });

//     // Create timeline for smooth sequencing
//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: analyticsSection,
//         start: 'top 80%',
//         end: 'top 0%',
//         scrub: true,
//         markers: false, // Keep true for debugging
//         toggleActions: 'play none none none',
//       },
//     });

//     // Scale UP animation (middle section)
//     tl.to(
//       analyticsSection,
//       {
//         scale: 1,
//         opacity: 1,
//         ease: 'power2.out',
//         duration: 1, // Relative duration for this segment
//       },
//       'start'
//     );

//     // Scale BACK DOWN animation (lower section)
//     tl.to(
//       analyticsSection,
//       {
//         scale: 0.8,
//         opacity: 0.7,
//         ease: 'power2.in',
//         duration: 1, // Relative duration for this segment
//       },
//       'middle'
//     );

//     // Section animations with same behavior
//     const sections =
//       this.el.nativeElement.querySelectorAll('.analytics section');
//     sections.forEach((section: HTMLElement, index: number) => {
//       const sectionTl = gsap.timeline({
//         scrollTrigger: {
//           trigger: analyticsSection,
//           start: 'top 80%',
//           end: 'top 0%',
//           scrub: true,
//         },
//       });

//       // Animate in
//       sectionTl.fromTo(
//         section,
//         { opacity: 0.7 },
//         {
//           y: 0,
//           opacity: 1,
//           ease: 'power2.out',
//           duration: 0.5,
//         }
//       );

//       // Animate out
//       sectionTl.to(section, {
//         // y: 20 + (indsex * 10),
//         opacity: 0.7,
//         ease: 'power2.in',
//         duration: 0.5,
//       });
//     });
//   }
// }
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


@Component({
  selector: 'app-analytics-section2',
  imports: [],
  templateUrl: './analytics-section2.component.html',
  styleUrl: './analytics-section2.component.scss',
})
export class AnalyticsSection2Component implements AfterViewInit {

  /**
   * Constructor - Initializes the component with ElementRef
   * @param el Reference to the host element for animation targets
   */
  constructor(private el: ElementRef) {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
  }

  /**
   * Lifecycle Hook - After View Initialization
   * Called after Angular initializes the component's views
   */
  ngAfterViewInit() {
    this.initAnimation();
  }

  /**
   * Main Animation Initialization
   * Sets up all GSAP animations and scroll triggers
   */
  private initAnimation(): void {
    const analyticsSection = this.el.nativeElement.querySelector('.analytics');

    // ==============================================
    // SECTION-WIDE ANIMATION (MAIN CONTAINER)
    // ==============================================

    // Set initial state before animations
    gsap.set(analyticsSection, {
      scale: 0.8,      // Start slightly scaled down
      opacity: 0.7,    // Start partially transparent
    });

    // Create master timeline for coordinated animations
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: analyticsSection,  // Element that triggers the animation
        start: 'top 80%',           // When top of element hits 80% viewport
        end: 'top 0%',              // When top of element hits top of viewport
        scrub: true,                // Smooth scrubbing effect
        markers: false,             // Visual markers for debugging (disable in production)
        toggleActions: 'play none none none', // Only play animation on enter
      },
    });

    // Animation sequence:
    // 1. Scale up and fade in when entering viewport
    masterTimeline.to(
      analyticsSection,
      {
        scale: 1,                   // Full scale
        opacity: 1,                 // Fully opaque
        ease: 'power2.out',        // Smooth easing
        duration: 1,                // Animation duration
      },
      'start'                      // Label for synchronization
    );

    // 2. Scale back down and fade out when scrolling past
    masterTimeline.to(
      analyticsSection,
      {
        scale: 0.8,                 // Return to initial scale
        opacity: 0.7,               // Return to initial opacity
        ease: 'power2.in',          // Different easing for exit
        duration: 1,                // Animation duration
      },
      'middle'                      // Label for synchronization
    );

    // ==============================================
    // INDIVIDUAL SECTION ANIMATIONS
    // ==============================================
    const sections = this.el.nativeElement.querySelectorAll('.analytics section');

    sections.forEach((section: HTMLElement, index: number) => {
      // Create individual timeline for each section
      const sectionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: analyticsSection,  // Same trigger as main animation
          start: 'top 80%',           // Sync with main animation
          end: 'top 0%',
          scrub: true,
        },
      });

      // Animation sequence for each section:
      // 1. Fade in and slide up when entering
      sectionTimeline.fromTo(
        section,
        { opacity: 0.7 },            // Start state
        {
          y: 0,                      // Final position
          opacity: 1,                // Fully visible
          ease: 'power2.out',        // Smooth easing
          duration: 0.5,             // Shorter duration for quicker response
        }
      );

      // 2. Fade out when scrolling past
      sectionTimeline.to(section, {
        opacity: 0.7,                // Return to semi-transparent
        ease: 'power2.in',           // Different easing for exit
        duration: 0.5,
      });


    });
  }
}
