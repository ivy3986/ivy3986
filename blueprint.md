# Coupang Partners API Real Integration

## Overview
Transitions from simulated links to actual revenue-generating links by calling the Coupang Partners Open API.

## API Specification
- **Endpoint:** `https://api-gateway.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products/search`
- **Method:** `GET`
- **Authentication:** HMAC-SHA256 signature in the `Authorization` header.
- **Payload:** `keyword`, `limit=1`

## Implementation Details
1. **Signature Helper:** Generates the required timestamp and HMAC signature using `SubtleCrypto`.
2. **Search Logic:**
   - Input: Product name from video file.
   - Output: `trackingUrl` from Coupang API response.
3. **CORS Handling:** Noted that direct browser calls may require a proxy or server-side implementation for production.

## Current Plan
1. Add `Crypto` utility to `main.js` for API signing.
2. Update `startAnalysis` to fetch real data if API keys are present.
3. Update result display to show real product data from Coupang.
