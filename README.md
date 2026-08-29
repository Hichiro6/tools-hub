# Tools Hub

Central hub for navigating between all my privacy-first web applications.

## Apps

| App | Description |
|-----|-------------|
| 🔒 WaterMark | Client-side document watermarking |
| 📱 QR Code Generator | Custom QR code generator |
| 📄 PDF Merger | Merge multiple PDFs into one |
| ✂️ PDF Splitter | Split PDF into parts |
| 📦 PDF Compressor | Compress PDF files |
| 🖼️ PDF to Images | Convert PDF to PNG/JPG |
| 🔄 PDF Reorder | Reorder PDF pages |
| ➡️ Images to PDF | Convert images to PDF |
| 🧹 Exif Stripper | Remove EXIF metadata |
| 🗜️ Image Compressor | Compress images |

## Features

- **Bilingual**: English / Français
- **Dark mode** design (Linear-inspired)
- **Search & filters**: Find tools quickly by name or category
- **Zero tracking**, zero cookies
- All links open external apps in new tabs
- Deployed on GitHub Pages

## Tech Stack

- Vite (vanilla JavaScript)
- CSS custom properties (design system)
- LocalStorage for language persistence
- Service Worker (offline-first caching)
- Fully client-side, no backend required

## Development

```bash
npm install
npm run dev
```

Then visit `http://localhost:5173`

## Deployment

Build and push to GitHub Pages:

```bash
npm run build
git add dist/
git commit -m "build: update deployment"
git push
```

GitHub Actions will auto-deploy from the `dist/` folder.
