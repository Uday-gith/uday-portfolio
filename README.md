# Uday Dongre — Free Creative Portfolio

A zero-cost portfolio using GitHub Pages + Google Drive API.

## Pages
- `index.html` — homepage with three service previews, latest work, intro and contact.
- `video.html` — Video Editing portfolio.
- `graphics.html` — Graphics & Branding portfolio.
- `performance.html` — Performance Marketing portfolio.

## Drive folders
Create one parent folder and three subfolders:

```text
Portfolio/
├── Video Editing/
├── Graphics & Branding/
└── Performance Marketing/
```

Upload your files to the relevant folder. The website reads those folders and updates automatically when the page is loaded.

## Setup
1. Create a Google Cloud project.
2. Enable the Google Drive API.
3. Create an API key and restrict it to the Google Drive API if possible.
4. Make each portfolio folder accessible for link viewing as appropriate for your content.
5. Copy the three folder IDs from their Drive URLs into `config.js`.
6. Paste your API key into `config.js`.
7. Replace `YOUR_EMAIL@example.com` in `index.html` with your email.
8. Upload the repository to GitHub and enable GitHub Pages.

## 3D background
The homepage uses Three.js from jsDelivr and procedurally builds a lightweight fish rather than downloading a large model. This keeps the site free and reduces asset weight. On reduced-motion settings, the fish becomes static.

## Performance
- Three.js pixel ratio is capped at 1.5.
- The fish is deliberately low-poly and translucent.
- Portfolio images lazy-load.
- 3D card tilt is disabled when reduced motion is requested.
- The visual 3D effects are progressive enhancement; the portfolio remains usable without WebGL.
