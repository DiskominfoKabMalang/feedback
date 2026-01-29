# Widget Build Documentation

Documentation for building and deploying the FeedbackApp embeddable widget using Preact.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Development](#development)
6. [Production Build](#production-build)
7. [Deployment](#deployment)
8. [Widget Integration Guide](#widget-integration-guide)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The FeedbackApp widget is a lightweight, embeddable feedback form built with **Preact** for minimal bundle size. Users can integrate it into their websites with a simple script tag.

### Key Features

- 📦 **Lightweight** - Built with Preact for small bundle size (~30KB gzipped)
- 🎨 **Customizable** - Theme, colors, position, and behavior configurable
- 🧠 **Logic Builder** - Dynamic forms based on user ratings
- 📱 **Responsive** - Works on all devices
- 🌙 **Dark Mode** - Automatic dark mode support
- ⚡ **Zero Config** - Works out of the box with sensible defaults

---

## Project Structure

```
packages/widget/
├── src/
│   ├── widget.tsx      # Main widget component
│   ├── widget.css      # Scoped widget styles
│   └── types.ts        # TypeScript definitions
├── package.json
├── vite.config.ts      # Vite build configuration
└── tsconfig.json       # TypeScript configuration
```

---

## Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- Parent project dependencies installed

---

## Installation

### 1. Install Dependencies

From the project root, install widget dependencies:

```bash
cd packages/widget
pnpm install
```

Or from the root:

```bash
pnpm --filter @feedbackapp/widget install
```

### 2. Verify Installation

```bash
pnpm --filter @feedbackapp/widget run --help
```

You should see available scripts: `dev`, `build`, `preview`

---

## Development

### Start Development Server

```bash
cd packages/widget
pnpm dev
```

The development server starts at `http://localhost:5173`

### Test Widget Locally

Create a test HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Widget Test</title>
  </head>
  <body>
    <h1>Feedback Widget Test</h1>
    <p>This page tests the feedback widget.</p>

    <!-- Load widget from dev server -->
    <script type="module" src="http://localhost:5173/src/widget.tsx"></script>
    <script>
      FeedbackWidget.init({
        projectId: 'test-project-id',
        apiEndpoint: 'http://localhost:3000',
        debug: true,
      })
    </script>
  </body>
</html>
```

---

## Production Build

### Build Command

```bash
cd packages/widget
pnpm build
```

### Build Output

After building, output files are in `packages/widget/dist/`:

```
dist/
├── widget.js         # UMD format (for script tags)
├── widget.es.js      # ES Module format
└── assets/           # CSS and other assets
```

### Build Options

The `vite.config.ts` includes these build options:

| Option     | Value           | Description                       |
| ---------- | --------------- | --------------------------------- |
| `formats`  | `['umd', 'es']` | UMD for browsers, ES for bundlers |
| `fileName` | `widget`        | Output file name                  |
| `minify`   | `terser`        | Minification enabled              |

---

## Deployment

### Option 1: Deploy to CDN

1. Build the widget:

```bash
cd packages/widget
pnpm build
```

2. Upload `dist/widget.js` and `dist/assets/` to your CDN:

```bash
# Example with AWS S3 + CloudFront
aws s3 sync dist/ s3://your-cdn-bucket/widget/
```

3. Update the installation URL in your documentation:

```html
<script src="https://cdn.your-domain.com/widget/widget.js"></script>
```

### Option 2: Serve from Next.js App

1. Build the widget:

```bash
cd packages/widget
pnpm build
```

2. Copy to Next.js public folder:

```bash
cp -r dist/* ../public/widget/
```

3. Access at `https://your-domain.com/widget/widget.js`

### Option 3: Separate Widget Service

1. Create a separate Vercel/Netlify project for the widget

2. Set `vite.config.ts` base path:

```ts
export default defineConfig({
  base: '/widget/',
  // ... rest of config
})
```

3. Deploy and get the URL

---

## Widget Integration Guide

### Method 1: Script Tag (Recommended)

```html
<script src="https://your-domain.com/widget.js"></script>
<script>
  FeedbackWidget.init({
    projectId: 'YOUR_PROJECT_ID',
    apiEndpoint: 'https://your-domain.com',
  })
</script>
```

### Method 2: Data Attributes (Auto-Init)

```html
<script
  src="https://your-domain.com/widget.js"
  data-feedback-widget
  data-project-id="YOUR_PROJECT_ID"
  data-api-endpoint="https://your-domain.com"
  data-debug="false"
></script>
```

### Configuration Options

| Option        | Type    | Required | Default | Description                    |
| ------------- | ------- | -------- | ------- | ------------------------------ |
| `projectId`   | string  | Yes      | -       | Your project ID from dashboard |
| `apiEndpoint` | string  | No       | -       | API endpoint URL               |
| `debug`       | boolean | No       | `false` | Enable console logging         |
| `autoInit`    | boolean | No       | `true`  | Auto-open widget on load       |

### Programmatic API

```javascript
// Initialize widget
FeedbackWidget.init({
  projectId: 'abc123',
  apiEndpoint: 'https://api.example.com',
  debug: true,
})

// Destroy widget
FeedbackWidget.destroy()

// Update config at runtime
FeedbackWidget.updateConfig({
  theme: {
    color_primary: '#ff0000',
  },
})
```

---

## Installation Page for Users

Add this to your Installation page:

### HTML Integration

Copy and paste this code into your website, before the closing `</body>` tag:

```html
<script src="https://your-domain.com/widget.js"></script>
<script>
  FeedbackWidget.init({
    projectId: 'YOUR_PROJECT_ID',
  })
</script>
```

### WordPress Integration

1. Install a "Header and Footer Scripts" plugin
2. Paste the widget code in the footer section
3. Replace `YOUR_PROJECT_ID` with your actual project ID

### Shopify Integration

1. Go to Online Store > Themes
2. Edit theme code
3. Add to `theme.liquid` before `</body>`:

```html
<script src="https://your-domain.com/widget.js"></script>
<script>
  FeedbackWidget.init({
    projectId: '{{ shop.permanent_domain }}',
  })
</script>
```

### React Integration

```jsx
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    // Load widget script
    const script = document.createElement('script')
    script.src = 'https://your-domain.com/widget.js'
    script.async = true
    document.body.appendChild(script)

    // Initialize widget
    script.onload = () => {
      window.FeedbackWidget.init({
        projectId: 'YOUR_PROJECT_ID',
      })
    }

    return () => {
      // Cleanup
      if (window.FeedbackWidget) {
        window.FeedbackWidget.destroy()
      }
    }
  }, [])

  return <div>Your App</div>
}
```

---

## Troubleshooting

### Widget not appearing

1. Check browser console for errors
2. Verify `projectId` is correct
3. Check that script is loaded before `init()` call
4. Enable `debug: true` to see detailed logs

### Build errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### CORS issues

Make sure your API allows cross-origin requests:

```ts
// In your API route
export async function POST(req: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

### Large bundle size

Check bundle size:

```bash
pnpm build -- --mode production
ls -lh dist/
```

Target sizes:

- `widget.js`: ~50KB (unminified)
- After gzip: ~15KB

---

## Versioning

The widget uses semantic versioning. When updating:

1. Update `package.json` version
2. Build and deploy
3. Update documentation with new version URL

Example:

```html
<!-- Version 1.0.0 -->
<script src="https://your-domain.com/widget/v1.0.0/widget.js"></script>
```

---

## Support

For issues or questions:

- GitHub: https://github.com/your-org/feedbackapp/issues
- Docs: https://docs.feedbackapp.com
