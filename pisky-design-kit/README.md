# Pisky Design Kit

Design system reusable untuk aplikasi web lain. Dibuat berdasarkan implementasi di Feedback SaaS Platform.

## Struktur Folder

```
pisky-design-kit/
├── README.md              # Dokumentasi ini
├── tokens/                # Design tokens (colors, spacing, typography)
│   ├── colors.css         # Color palette
│   ├── spacing.css        # Spacing & radius
│   └── typography.css     # Typography scale
├── components/            # Core UI components
│   ├── button.tsx         # Button variants
│   ├── card.tsx           # Card components
│   ├── input.tsx          # Input & form elements
│   ├── badge.tsx          # Badge component
│   ├── table.tsx          # Table components
│   ├── dialog.tsx         # Dialog/Modal
│   ├── alert.tsx          # Alert notifications
│   ├── tabs.tsx           # Tab navigation
│   └── label.tsx          # Form labels
├── layouts/               # Layout patterns
│   ├── dashboard.tsx      # Dashboard layout dengan sidebar
│   ├── auth.tsx           # Auth layout (centered)
│   └── page-header.tsx    # Page header pattern
└── examples/              # Usage examples
    ├── stats-grid.tsx     # Stats cards grid
    ├── data-table.tsx     # Data table dengan actions
    └── form-section.tsx   # Form section pattern
```

## Instalasi Dependencies

```bash
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
```

## Quick Start

### 1. Copy Design Tokens ke `app/globals.css`

Copy seluruh isi `tokens/` ke file globals.css aplikasi Anda.

### 2. Copy Utility Function ke `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 3. Copy Components yang Dibutuhkan

Copy komponen dari folder `components/` ke `components/ui/` di aplikasi Anda.

### 4. Gunakan Layout Pattern

Copy layout pattern dari folder `layouts/` sesuai kebutuhan.

## Design Tokens Overview

### Colors

| Token         | Light Mode | Dark Mode |
| ------------- | ---------- | --------- |
| `--primary`   | #1B53D9    | #4E89F0   |
| `--secondary` | #E07A5F    | #E07A5F   |
| `--success`   | #10B981    | #10B981   |
| `--warning`   | #F59E0B    | #F59E0B   |
| `--error`     | #EF4444    | #F87171   |

### Spacing

| Token         | Value |
| ------------- | ----- |
| `--radius-sm` | 4px   |
| `--radius-md` | 8px   |
| `--radius-lg` | 12px  |
| `--radius-xl` | 16px  |

### Typography

| Token         | Value |
| ------------- | ----- |
| `--text-xs`   | 10px  |
| `--text-sm`   | 13px  |
| `--text-base` | 16px  |
| `--text-lg`   | 20px  |

## Component Variants

### Button

```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Badge

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## Best Practices

1. **Gunakan `cn()` untuk class merging**

   ```tsx
   className={cn("base-class", isActive && "active-class", className)}
   ```

2. **Gunakan semantic tokens, bukan hardcode values**
   - ✅ `text-muted-foreground`
   - ❌ `text-gray-600`

3. **Gunakan `data-slot` untuk component identification**

   ```tsx
   <div data-slot="card" />
   ```

4. **Responsive design dengan mobile-first**
   ```tsx
   className = 'grid gap-4 md:grid-cols-2 lg:grid-cols-4'
   ```

## License

MIT
