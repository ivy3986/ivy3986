# Coupang Partners Threads Generator - Advanced Integration

## Overview
A specialized tool for affiliate marketers to generate high-engagement content for Threads, featuring real-time Coupang API integration, connection testing, and separated content for posts/comments.

## New Features
1. **API Connection Test:** A button in the settings to verify if the Access/Secret keys are valid by making a test call.
2. **Accurate Product Linking:** Enhanced search logic to find the specific product from Coupang's database.
3. **Split Content Generation:**
    - **Main Post:** 3-line engaging text (MZ style).
    - **Comment:** Affiliate link + mandatory disclosure statement.
4. **Dual Copy Buttons:** Separate "Copy Post" and "Copy Comment" buttons for easy uploading.

## Technical Details
- **Validation:** Uses the `search` API with a test keyword to verify credentials.
- **Disclosure:** "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다." automatically appended to comments.
- **State Management:** Handles connection status (Valid/Invalid) and separated content strings.

## Current Plan
1. Update `main.js` with `testConnection` logic.
2. Modify UI to show two result sections and two copy buttons.
3. Ensure the Korean disclosure is correctly formatted.
