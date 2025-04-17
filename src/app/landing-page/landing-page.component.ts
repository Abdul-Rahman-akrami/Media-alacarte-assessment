import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { ServicesSectionComponent } from './services-section/services-section.component';
import { FooterSectionComponent } from './footer-section/footer-section.component';
import { AboutUsSectionComponent } from './about-us-section/about-us-section.component';
import { ValuePropositionSectionComponent } from './value-proposition-section/value-proposition-section.component';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsSection2Component } from './analytics-section2/analytics-section2.component';
import { ScrollServiceService } from '../services/scroll-service.service';

@Component({
  selector: 'app-landing-page',
  imports: [
    HeroSectionComponent,
    ServicesSectionComponent,
    FooterSectionComponent,
    AboutUsSectionComponent,
    ValuePropositionSectionComponent,
    AnalyticsSection2Component,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements AfterViewInit {
  constructor(
    private smootherService: ScrollServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.smootherService.initScrollSmoother();
    }
  }
}
