import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollServiceService {
  private smoother: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async initScrollSmoother(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const gsap = (await import('gsap')).gsap;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
      const ScrollSmoother = (await import('gsap-trial/ScrollSmoother')).ScrollSmoother;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      this.smoother = ScrollSmoother.create({
        content: "#smooth-content",
        wrapper: "#smooth-wrapper",
        smooth: 1.5,
        effects: true,
      });
    }
  }
}
