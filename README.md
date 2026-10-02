# Uday Dongre Portfolio — Free GitHub Pages Version

This version keeps the site free and removes the Google Drive API key from browser code.

## Architecture

- GitHub Pages: hosting
- Google Drive: portfolio source folders
- GitHub Actions: syncs Drive files into `portfolio.json` every 15 minutes
- GitHub Actions secrets: stores the Drive API key privately
- Google Sheets + Google Form: optional public testimonials feed
- Three.js: lightweight 3D rocket background

## Drive structure

Create:

```text
Portfolio/
├── Video Editing/
│   ├── Performance Ads & Paid Media/
│   ├── AI-Powered UGC & E-commerce Creatives/
│   ├── Documentary-Style Edits/
│   ├── Podcast and Repurposed Long-Form/
│   ├── UI/SaaS Animation/
│   ├── YouTube Long-Form Editing/
│   └── Performance Ad Editing/
├── Graphics & Branding/
│   ├── Logo & Visual Identity/
│   ├── Brand Strategy & Identity Systems/
│   ├── Social Media Branding/
│   ├── Campaign & Event Branding/
│   ├── Creator & Personal Branding/
│   ├── Packaging & Print/
│   └── Rebrands & Identity Refresh/
└── Performance Marketing/
    └── Create any niche folders you want; the site will detect them automatically.
```

Each project can be a file inside its niche folder. The portfolio page shows the first 3 projects and reveals the rest with **See more**.

## GitHub Actions secrets

Repository → Settings → Secrets and variables → Actions → New repository secret.

Create:

- `GOOGLE_DRIVE_API_KEY`
- `VIDEO_FOLDER_ID`
- `GRAPHICS_FOLDER_ID`
- `PERFORMANCE_FOLDER_ID`

The API key must NOT be placed in `config.js`.

The folder IDs are already known:

- Video: `1ZjUboAvM9BHbFfJdNSPkzf7bJrOZac1Z`
- Graphics: `1pNLYueU7sUynhoiQ3uJ0iyqpQ4qLuDPG`
- Performance: `1gQZxwdtMq20GtAG5jdGPDNfVndotW9yS`

## API key restrictions

Restrict the key to:

- Application restriction: your GitHub Pages website/referrer if Google Cloud accepts the configuration you use
- API restriction: Google Drive API

The key is only consumed by the GitHub Actions runner, not by the public website.

## Testimonials

Create a Google Form with fields such as:

- Name
- Role / Company
- Testimonial

Link the responses to Google Sheets. Publish the response sheet as CSV, then put the published CSV URL into `config.js` as `testimonialsCsvUrl` and the form URL into `testimonialFormUrl`.

The homepage duplicates the testimonial cards into a continuous left-to-right marquee. Hovering pauses it.

## Cinematic service images

The three service cards use cinematic image backgrounds. Replace the image URLs in `style.css` with your own work or generated images later if you want the site to be fully self-owned.
