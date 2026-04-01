# Pisky Design System - Installation Guide

## Step 1: Install Dependencies

```bash
pnpm add @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-tabs @radix-ui/react-dialog class-variance-authority clsx tailwind-merge lucide-react
```

## Step 2: Setup Tailwind CSS

Pastikan `tailwind.config.ts` sudah terkonfigurasi dengan benar:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

## Step 3: Copy Design Tokens

Copy isi file-file CSS dari folder `tokens/` ke `app/globals.css`:

```bash
# Atau gabungkan semua menjadi satu file globals.css
cat pisky-design-kit/tokens/*.css >> app/globals.css
```

## Step 4: Setup Utility Function

Buat file `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Step 5: Copy Components

Copy komponen yang dibutuhkan dari `pisky-design-kit/components/` ke `components/ui/`:

```bash
# Copy semua komponen
cp -r pisky-design-kit/components/* components/ui/

# Atau copy hanya yang dibutuhkan
cp pisky-design-kit/components/button.tsx components/ui/button.tsx
cp pisky-design-kit/components/card.tsx components/ui/card.tsx
# ... dan seterusnya
```

## Step 6: Update Imports

Di file komponen yang sudah di-copy, pastikan path import sudah sesuai:

```typescript
// Sebelumnya (di design kit)
import { cn } from '@/lib/utils'

// Setelah di-copy ke aplikasi Anda
import { cn } from '@/lib/utils' // pastikan path ini benar
```

## Step 7: Verify

Buat test page untuk memverifikasi:

```tsx
// app/test/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Pisky Design System Test</h1>

      <div className="flex gap-2">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Card Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test card component.</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Troubleshooting

### Colors not working

Pastikan CSS variables sudah terdefinisi di `globals.css`. Coba restart dev server.

### Components not found

Pastikan path imports sudah sesuai dengan struktur folder aplikasi Anda.

### TypeScript errors

Run `pnpm check-types` untuk melihat error lainnya.
