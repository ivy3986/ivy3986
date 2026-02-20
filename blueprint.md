# Coupang Partners API - CORS Fix & Proxy Integration

## Overview
Addressing the CORS issue that prevents direct browser-to-Coupang API calls.

## Problem
Browsers block requests to `api-gateway.coupang.com` because the server does not return the required `Access-Control-Allow-Origin` headers for web-based clients.

## Solution
1. **CORS Proxy Integration:** Use `https://corsproxy.io/` to wrap API requests. This service forwards the request and adds the necessary CORS headers.
2. **Proxy Settings:** Added a toggle in the settings panel to enable/disable the proxy (enabled by default for web environments).

## Security Note
While a public proxy works for prototypes, a dedicated server-side backend (Node.js/Firebase) is recommended for production to keep API Secret Keys fully protected.

## Current Plan
1. Update `fetchCoupangProduct` in `main.js` to use `corsproxy.io`.
2. Add "Proxy Mode" toggle in the settings UI.
3. Update connection test logic to account for proxy latency.
