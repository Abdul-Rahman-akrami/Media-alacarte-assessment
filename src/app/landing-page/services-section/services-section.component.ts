// Angular core imports
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ServiceCard {
  title: string;
  description: string;
  selected: boolean;
  image: string;
}

@Component({
  selector: 'app-services-section', // Component selector
  imports: [CommonModule], // Required Angular modules
  templateUrl: './services-section.component.html', // Template file
  styleUrl: './services-section.component.scss', // Styles file
})
export class ServicesSectionComponent {
  /**
   * Array of service cards data
   * @type {ServiceCard[]}
   */
  services: ServiceCard[] = [
    {
      title: 'Advertisers',
      description: 'Run & optimize ads across multiple platforms effortlessly.',
      selected: true, // Default selected card
      image: '../../../assets/advertisers.jpeg',
    },
    {
      title: 'Agencies',
      description:
        'Comprehensive solutions for marketing agencies of all sizes.',

      selected: false,
      image: '../../../assets/agencies.jpeg',
    },
    {
      title: 'Media Owners',
      description: 'Maximize your digital assets and monetize your content.',
      selected: false,
      image: '../../../assets/media-owner.jpeg',
    },
  ];


  selectCard(selectedCard: ServiceCard): void {
    // First deselect all cards to ensure only one is selected at a time
    this.services.forEach((card) => (card.selected = false));

    // Toggle selection state of the clicked card
    selectedCard.selected = !selectedCard.selected;
  }
}
