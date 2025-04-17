# Media-alacarte-assessment
Project Overview
This Angular application serves as the portal for MediaAlacarte, providing a user interface for various operations and management tasks.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (version 16.x or later recommended)

npm (comes with Node.js) or yarn

Angular CLI (version 19.2.5 or compatible)

Getting Started
Follow these steps to set up and run the application locally:

Clone the repository


git clone <repository-url>
cd MediaAlacarte
Install dependencies


npm install
Run the development server


ng serve
Access the application
Open your browser and navigate to:

Copy
http://localhost:4200/
Development Workflow
Running the Application
Development mode (with live reload):


ng serve
Production-like build (optimized):


ng serve --configuration production
Building the Application
Development build:


ng build
Production build (optimized for deployment):


ng build --configuration production
Testing
Run unit tests:


ng test
Run end-to-end tests (if configured):


ng e2e
Project Structure
Key directories:

src/app/ – Contains Angular components, services, and modules

src/assets/ – Static assets (images, fonts, etc.)

src/environments/ – Environment-specific configurations

Generating New Components
To create new components, services, or modules:


ng generate component component-name
For a full list of available schematics:


ng generate --help
