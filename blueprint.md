# Threads Content Generator for Coupang Partners

## Overview
A specialized tool for affiliate marketers to generate high-engagement content for Threads. It processes video uploads, identifies products, generates 3-line descriptions, and prepares Coupang Partners links.

## Project Outline
- **Target Platform:** Threads (optimized for short, engaging text).
- **Core Feature 1:** Video Upload & Preview.
- **Core Feature 2:** AI-driven (Simulated) Product Identification & Description Generation.
- **Core Feature 3:** Coupang Partners Link Integration (Placeholder for API).
- **Visual Design:** Clean, modern "Glassmorphism" UI with deep shadows and vibrant accents.

## Current Plan & Steps
1. **Scaffold New UI:** Update `index.html` to focus on the Content Generator.
2. **Enhanced Styling:** Add styles for video previews, progress bars, and result cards.
3. **Logic Implementation:** 
    - Handle video file selection.
    - Simulate "AI Video Analysis" with a professional progress indicator.
    - Generate 3-line descriptions based on the detected product.
    - Provide a placeholder for the Coupang search result.
4. **Localization:** Keep the UI in Korean as requested.

## Technical Details
- **Video Processing:** Uses browser-native `<video>` for preview.
- **Styling:** `oklch` colors, `:has()` for state management, CSS Variables for theming.
- **Animation:** GSAP-like smooth transitions using CSS Animations.
