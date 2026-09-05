# PetVision - Smart Glasses Pet Owner Assistant

## Project Overview
**PetVision** is a cutting-edge smart glasses application designed for comprehensive pet care management. Developed as part of a Software Engineering Analysis class project, this application bridges the gap between wearable innovation and pet care needs. 

It transforms how pet owners interact with and care for their animals by providing real-time health monitoring, intelligent nutrition management, veterinary teleconsultation, and advanced pet tracking capabilities directly within the user's field of vision using Augmented Reality (AR).

## Team Members
- Gamze Batil
- Ali Kosari
- Asra Sarwari
- Farah Bougnine
- Gözde Celikkol

## Core Features (10 Modules)

1. **Pet Registration**: Allows pet owners to create and manage pet profiles by entering details and capturing reference images.
2. **Pet Recognition**: Visually identifies a registered pet in real-time using the smart glasses camera and an AI recognition server.
3. **Smart Collar Recognition**: Connects via Bluetooth Low Energy (BLE) to identify the pet's smart collar and retrieve telemetry data.
4. **Lost Pet Tracker**: Displays a directional AR navigation route and compass guiding the user toward their pet's last known GPS location.
5. **Health Overlay Display**: Displays real-time health metrics (temperature, heart rate, activity level) as an AR overlay once the pet is recognized.
6. **Vet Teleconsultation**: Enables real-time video streaming from the smart glasses to a veterinarian for remote diagnosis and guidance.
7. **Smart Nutrition Scanner**: Scans pet food barcodes/labels to identify nutritional information and calculate safe portions.
8. **Nutrition Calculator**: Calculates the pet's daily calorie needs based on age, weight, breed, and activity level.
9. **Memory Capture**: Captures photos or short videos hands-free using voice commands (e.g., "Record!").
10. **Memory Journal**: Collects and compiles stored photos and videos into an AI-generated memory story/highlight reel with music.

## About This Simulation
This repository contains the web-based simulation of the **PetVision AR Interface**, built with React and Vite. It serves as an interactive GUI prototype demonstrating the user journey, HUD (Heads-Up Display) layout, and core interaction flows defined in the software engineering design document.

### Development Setup

#### Prerequisites
- Node.js (v24 LTS recommended)
- npm or yarn

#### Installation & Running
1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser to interact with the PetVision Smart Glasses simulator.
