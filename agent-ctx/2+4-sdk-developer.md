# Task 2+4: SDK Developer

## Task
Create Nexus AI SDK file and serve route

## Work Done
1. Created `/public/sdk/nexus-ai.js` — self-contained SDK file (13,658 bytes)
2. Created `/src/app/api/sdk/route.ts` — API route to serve the SDK file for download
3. Verified both endpoints work correctly via curl

## Key Decisions
- SDK uses POST to `/api/search` endpoint (already returns structured JSON)
- SDK supports both ESM and CommonJS via `module.exports` + `window` globals
- Default baseUrl: `window.location.origin` in browser, `https://api.nexusai.dev` in Node.js
- API key support: sent via body, Authorization header, and X-API-Key header (future-proofing)
- Timeout: 60s default with AbortController-based cancellation
- Custom NexusAIError with error codes matching API error codes

## Artifacts
- `/public/sdk/nexus-ai.js` — The SDK file
- `/src/app/api/sdk/route.ts` — The serve route
