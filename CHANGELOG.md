# LIDYA FASHION - Changelog

All notable changes made during development sessions are documented here.

---

## [Session - March 19, 2026]

### Terminology Updates
- **Replaced "Virtual Try-On" terminology with "AI Style Preview" / "AI Personalization"**
  - "Virtual Try-On" → "AI Style Preview" in modal title
  - "try-on previews" → "personalized previews"
  - "virtual try-on technology" → "AI personalization technology"
  - "Generate Try-On" → "Generate Preview"
  - "Try-on generated" → "Preview generated successfully"
  - Updated metadata title: "AI Personalized Fashion"
  - Updated localStorage key from `vton_` to `lidya_`
  - Updated comments in code from "Try-On" to "Style Preview"

### Branding Updates
- **Rebranded from "VTON" to "LIDYA FASHION"**
  - Updated header component with new logo and brand name
  - Updated footer component with new logo and brand name
  - Updated contact modal with new logo and brand name
  - Updated category page header with new logo and brand name
  - Changed brand text to **Times New Roman** font
  - Updated email to `support@lidyafashion.com`
  - Updated copyright text to "© 2026 LIDYA FASHION"

### Logo Updates
- Added user uploaded logo image to:
  - `/public/logo.png` - Main logo file
  - `/public/assets/watermark-logo.png` - Watermark for downloads
  - `/src/app/icon.png` - Browser tab favicon
  - `/src/app/apple-icon.png` - iOS device icon

### Metadata Updates
- Updated page title to "LIDYA FASHION - Virtual Try-On Fashion"
- Updated favicon/browser tab icon
- Updated OpenGraph metadata for social sharing

### Virtual Try-On API
- **Switched from IDM-VTON to bytedance/seedream-5-lite model**
  - Updated `/api/tryon/route.ts` to use Seedream 5 Lite
  - Implemented async polling pattern for long-running requests
  - Added prediction ID tracking and status polling (GET endpoint)
  - Added category-based prompts for better results:
    - Women: "A woman wearing fashionable clothing, professional fashion photography..."
    - Men: "A man wearing fashionable clothing, professional fashion photography..."
  - Added model parameters: `num_inference_steps: 28`, `guidance_scale: 3.5`
  - Added negative prompts to improve quality

### Try-On Modal Updates
- Added async polling mechanism for Seedream API
- Shows elapsed time during processing
- Changed "Try Another" button to "Done" (closes modal)
- Better UX with real-time status updates
- Cleanup polling interval on unmount

### Watermark System
- **Dual watermark system on downloaded images:**
  - Top-Right: Logo watermark (LIDYA FASHION logo)
  - Bottom-Right: URL watermark (**lidyafashion.com**)
- Both watermarks scale proportionally to image size
- **Increased sizes for better visibility:**
  - Logo: 25% of image width (max 300px)
  - URL: 22% of image width (max 260px)
- Semi-transparent gradient backgrounds (85% opacity)
- Bold text for better readability
- Rounded corners for professional appearance

### Environment Configuration
- Added `REPLICATE_API_TOKEN` to `.env` file for API authentication

---

## Technical Details

### API Flow (Try-On)
```
[BROWSER]                [SERVER]                    [REPLICATE API]
    │                        │                            │
    │  POST /api/tryon       │                            │
    │  (user image, product) │                            │
    │ ──────────────────────►│                            │
    │                        │  Create prediction         │
    │                        │ ──────────────────────────►│
    │                        │                            │
    │  Returns predictionId  │                            │
    │ ◄──────────────────────│                            │
    │                        │                            │
    │  GET /api/tryon?id=... │                            │
    │ ──────────────────────►│                            │
    │                        │  Check prediction status   │
    │                        │ ──────────────────────────►│
    │                        │                            │
    │  Returns status        │                            │
    │ ◄──────────────────────│                            │
    │                        │                            │
    │  (Polls until done)    │                            │
    │                        │                            │
    │  Returns base64 image  │                            │
    │ ◄──────────────────────│                            │
```

### Security Notes
- API tokens stored in `.env` (never exposed to client)
- All AI prompts constructed server-side
- Model parameters hidden from users
- Users only see their own request data, not server-side configuration

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/header.tsx` | Logo, brand name, Times New Roman font |
| `src/components/footer.tsx` | Logo, brand name, copyright |
| `src/components/contact-modal.tsx` | Logo, brand name, email |
| `src/components/category-page.tsx` | Logo, brand name |
| `src/components/try-on-modal.tsx` | Async polling, elapsed time, Done button |
| `src/app/layout.tsx` | Page title, favicon, metadata |
| `src/app/api/tryon/route.ts` | Seedream model, polling endpoints |
| `src/app/api/download/route.ts` | Dual watermarks (logo + URL) |
| `.env` | Replicate API token |

---

## Next Steps (Future)
- [ ] Deploy to Vercel
- [ ] Add more product categories
- [ ] Improve mobile responsiveness
- [ ] Add user authentication features
- [ ] Implement shopping cart persistence
