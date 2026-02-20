# Coupang Partners API & AI Video Analysis Integration

## Overview
This update transitions the app from a static simulation to a functional tool that integrates Coupang Partners API and prepares for AI Video Analysis.

## Core Updates
1. **API Credentials Management:** Added a settings panel to store Coupang Access Key, Secret Key, and AF ID.
2. **Dynamic Search & Link Generation:** Instead of random links, the app will now attempt to search products via API (simulated for now, requiring server-side proxy).
3. **Context-Aware Content:** Descriptions will now pull from the file name or metadata to ensure relevance to the uploaded video.

## Technical Requirements
- **Coupang API:** Requires a server-side proxy (Firebase Functions or Node.js) because Coupang API does not support direct Client-side (CORS) requests.
- **Vision API:** Integration point for OpenAI or Google Cloud Vision to identify products in video frames.

## Next Steps
- Implement UI for API Key input.
- Refine product identification logic based on file names as a temporary context provider.
