# Widget Integration Guide

The FeedbackApp widget can be embedded on any website or web application regardless of the framework. This guide covers integration for various platforms.

## Universal Embed Code

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Your Website</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
    <p>Your content here...</p>

    <!-- Feedback Widget -->
    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
      FeedbackWidget.init({
        projectId: 'YOUR_PROJECT_ID',
        apiEndpoint: 'https://app.yourdomain.com',
      })
    </script>
  </body>
</html>
```

## Framework-Specific Integration

### Next.js (App Router)

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>
        {children}

        {/* Widget Script */}
        <Script
          src="https://cdn.yourdomain.com/widget.js"
          strategy="afterInteractive"
        />
        <Script
          id="widget-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              FeedbackWidget.init({
                projectId: '${process.env.NEXT_PUBLIC_FEEDBACKAPP_PROJECT_ID}',
                apiEndpoint: 'https://app.yourdomain.com'
              })
            `,
          }}
        />
      </body>
    </html>
  )
}
```

### Next.js (Pages Router)

```jsx
// pages/_app.js
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />

      <Script
        src="https://cdn.yourdomain.com/widget.js"
        strategy="afterInteractive"
      />
      <Script
        id="widget-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            FeedbackWidget.init({
              projectId: '${process.env.NEXT_PUBLIC_FEEDBACKAPP_PROJECT_ID}',
              apiEndpoint: 'https://app.yourdomain.com'
            })
          `,
        }}
      />
    </>
  )
}

export default MyApp
```

### Laravel (Blade)

```blade
<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Laravel App')</title>
</head>
<body>
    @yield('content')

    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
        FeedbackWidget.init({
            projectId: '{{ config('feedbackapp.project_id') }}',
            apiEndpoint: 'https://app.yourdomain.com'
        })
    </script>
</body>
</html>
```

Add to `config/feedbackapp.php`:

```php
<?php

return [
    'project_id' => env('FEEDBACKAPP_PROJECT_ID'),
];
```

Add to `.env`:

```bash
FEEDBACKAPP_PROJECT_ID=your_project_id
```

### CodeIgniter 4

```php
<!-- app/Views/template.php -->
<!DOCTYPE html>
<html>
<head>
    <title><?= $title ?? 'My App' ?></title>
</head>
<body>
    <?= $this->renderSection('content') ?>

    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
        FeedbackWidget.init({
            projectId: '<?= env('FEEDBACKAPP_PROJECT_ID') ?>',
            apiEndpoint: 'https://app.yourdomain.com'
        })
    </script>
</body>
</html>
```

### Native PHP

```php
<?php
// header.php
?>
<!DOCTYPE html>
<html>
<head>
    <title>My PHP App</title>
</head>
<body>
    <nav>
        <!-- Your navigation -->
    </nav>
    <main>
        <?php include $content; ?>
    </main>

    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
        FeedbackWidget.init({
            projectId: '<?php echo getenv('FEEDBACKAPP_PROJECT_ID'); ?>',
            apiEndpoint: 'https://app.yourdomain.com'
        })
    </script>
</body>
</html>
```

### WordPress

#### Option 1: Simple Plugin

Create `wp-content/plugins/feedbackapp-widget/feedbackapp-widget.php`:

```php
<?php
/*
Plugin Name: FeedbackApp Widget
Version: 1.0
*/

function feedbackapp_enqueue_widget() {
    $project_id = get_option('feedbackapp_project_id', '');

    if (empty($project_id)) {
        return;
    }

    wp_enqueue_script(
        'feedbackapp-widget',
        'https://cdn.yourdomain.com/widget.js',
        [],
        null,
        true
    );

    wp_add_inline_script('feedbackapp-widget', sprintf(
        'FeedbackWidget.init({ projectId: "%s", apiEndpoint: "https://app.yourdomain.com" });',
        esc_js($project_id)
    ));
}
add_action('wp_enqueue_scripts', 'feedbackapp_enqueue_widget');

// Admin settings page
function feedbackapp_admin_menu() {
    add_options_page(
        'FeedbackApp',
        'FeedbackApp',
        'manage_options',
        'feedbackapp-settings',
        'feedbackapp_settings_page'
    );
}
add_action('admin_menu', 'feedbackapp_admin_menu');

function feedbackapp_settings_page() {
    ?>
    <div class="wrap">
        <h1>FeedbackApp Widget Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('feedbackapp_settings');
            do_settings_sections('feedbackapp');
            ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="feedbackapp_project_id">Project ID</label>
                    </th>
                    <td>
                        <input type="text"
                               id="feedbackapp_project_id"
                               name="feedbackapp_project_id"
                               value="<?php echo esc_attr(get_option('feedbackapp_project_id')); ?>"
                               class="regular-text"
                        />
                        <p class="description">
                            Get your Project ID from
                            <a href="https://app.yourdomain.com" target="_blank">app.yourdomain.com</a>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function feedbackapp_register_settings() {
    register_setting('feedbackapp_settings', 'feedbackapp_project_id', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
}
add_action('admin_init', 'feedbackapp_register_settings');
```

#### Option 2: Using functions.php

Add to your theme's `functions.php`:

```php
function feedbackapp_widget() {
    $project_id = get_theme_mod('feedbackapp_project_id', '');

    if (empty($project_id)) {
        return;
    }
    ?>
    <script src="https://cdn.yourdomain.com/widget.js"></script>
    <script>
        FeedbackWidget.init({
            projectId: '<?php echo esc_js($project_id); ?>',
            apiEndpoint: 'https://app.yourdomain.com'
        })
    </script>
    <?php
}
add_action('wp_footer', 'feedbackapp_widget');

// Customizer setting
function feedbackapp_customize_register($wp_customize) {
    $wp_customize->add_section('feedbackapp_section', [
        'title' => 'FeedbackApp Widget',
        'priority' => 30,
    ]);

    $wp_customize->add_setting('feedbackapp_project_id', [
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ]);

    $wp_customize->add_control('feedbackapp_project_id', [
        'label' => 'Project ID',
        'section' => 'feedbackapp_section',
        'type' => 'text',
    ]);
}
add_action('customize_register', 'feedbackapp_customize_register');
```

### React (Vite)

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Load widget
const script = document.createElement('script')
script.src = 'https://cdn.yourdomain.com/widget.js'
script.async = true
document.head.appendChild(script)

script.onload = () => {
  ;(window as any).FeedbackWidget?.init({
    projectId: import.meta.env.VITE_FEEDBACKAPP_PROJECT_ID,
    apiEndpoint: 'https://app.yourdomain.com',
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Vue 3

```vue
<!-- App.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Load widget script
  const script = document.createElement('script')
  script.src = 'https://cdn.yourdomain.com/widget.js'
  script.async = true
  document.head.appendChild(script)

  script.onload = () => {
    ;(window as any).FeedbackWidget?.init({
      projectId: import.meta.env.VITE_FEEDBACKAPP_PROJECT_ID,
      apiEndpoint: 'https://app.yourdomain.com',
    })
  }
})
</script>

<template>
  <router-view />
</template>
```

### Angular

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core'

declare global {
  interface Window {
    FeedbackWidget?: {
      init: (config: { projectId: string; apiEndpoint: string }) => void
    }
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.loadWidget()
  }

  loadWidget() {
    const script = document.createElement('script')
    script.src = 'https://cdn.yourdomain.com/widget.js'
    script.async = true
    script.onload = () => {
      window.FeedbackWidget?.init({
        projectId: environment.feedbackAppProjectId,
        apiEndpoint: 'https://app.yourdomain.com',
      })
    }
    document.head.appendChild(script)
  }
}
```

## Configuration Options

```javascript
FeedbackWidget.init({
  // Required
  projectId: 'YOUR_PROJECT_ID',

  // Optional: API endpoint (default: same domain)
  apiEndpoint: 'https://app.yourdomain.com',

  // Optional: Enable debug mode for development
  debug: true,

  // Optional: Auto-open settings
  autoOpen: false,
  delayOpen: 5, // seconds
})
```

## Common Issues

### Widget not appearing

1. Check browser console for errors
2. Verify `projectId` is correct
3. Check that `apiEndpoint` is reachable
4. Ensure no CSS `z-index` conflicts

### CORS errors

The widget API must have CORS enabled. Check:

```bash
curl -I -H "Origin: https://yourdomain.com" \
  https://app.yourdomain.com/api/v1/widget/config?project_id=test
```

Should return:

```
Access-Control-Allow-Origin: *
```

### Widget loads but feedback not submitting

1. Check network tab in browser dev tools
2. Verify API endpoint is correct
3. Check server logs for errors
4. Ensure database is accessible

## Advanced Usage

### Dynamic Project ID

For multi-tenant applications:

```javascript
// Fetch project ID from your backend
fetch('/api/get-feedback-project-id')
  .then((res) => res.json())
  .then((data) => {
    FeedbackWidget.init({
      projectId: data.projectId,
      apiEndpoint: 'https://app.yourdomain.com',
    })
  })
```

### Widget Events

```javascript
// Listen to widget events
window.addEventListener('feedbackapp:submitted', (e) => {
  console.log('Feedback submitted:', e.detail)
})

window.addEventListener('feedbackapp:opened', () => {
  console.log('Widget opened')
})

window.addEventListener('feedbackapp:closed', () => {
  console.log('Widget closed')
})
```

### Custom Trigger Button

```html
<!-- Hide default trigger -->
<script>
  FeedbackWidget.init({
    projectId: 'YOUR_PROJECT_ID',
    apiEndpoint: 'https://app.yourdomain.com',
    showTrigger: false, // Hide default button
  })
</script>

<!-- Your custom button -->
<button onclick="FeedbackWidget.open()">Give Feedback</button>
```
