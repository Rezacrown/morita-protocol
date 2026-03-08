# Design System Guides

Panduan lengkap untuk membuat dan mengelola design system dalam project.

## Apa Itu Design System?

Design system adalah kumpulan standarisasi desain, komponen, dan guidelines yang digunakan untuk membuat UI yang konsisten.

## Struktur Design System

### 1. Foundations

#### Colors

```typescript
// colors.ts - Define color palette
export const colors = {
  // Primary colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },
  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
} as const;
```

#### Typography

```typescript
// typography.ts - Font families dan sizes
export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    serif: ["Playfair Display", "serif"],
    mono: ["JetBrains Mono", "monospace"],
  },
  fontSize: {
    "xs": "0.75rem", // 12px
    "sm": "0.875rem", // 14px
    "base": "1rem", // 16px
    "lg": "1.125rem", // 18px
    "xl": "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
} as const;
```

#### Spacing

```typescript
// spacing.ts - Consistent spacing scale
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
} as const;
```

#### Border Radius

```typescript
// border-radius.ts
export const borderRadius = {
  "none": "0",
  "sm": "0.125rem", // 2px
  "DEFAULT": "0.25rem", // 4px
  "md": "0.375rem", // 6px
  "lg": "0.5rem", // 8px
  "xl": "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "full": "9999px",
} as const;
```

### 2. Components

#### Component Architecture

```tsx
// components/Button/Button.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Button component dengan multiple variants dan sizes
 * Menggunakan Radix UI primitives untuk accessibility
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-colors focus-visible:outline-none focus-visible:ring-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

const variantStyles = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "hover:bg-slate-100",
};

const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-lg",
};
```

### 3. Patterns

#### Layout Patterns

- **Container** - Max-width wrapper
- **Stack** - Vertical/horizontal layout
- **Grid** - Responsive grid system
- **Sidebar** - Navigation layout

#### Data Display

- **Table** - Tabular data
- **Card** - Content container
- **List** - Vertical list
- **Badge** - Status indicator

#### Forms

- **Input** - Text input
- **Select** - Dropdown
- **Checkbox/Radio** - Option selection
- **Switch** - Toggle

#### Feedback

- **Toast** - Notification
- **Modal** - Dialog
- **Alert** - Inline message
- **Skeleton** - Loading state

## Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## shadcn/ui Integration

```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

## Best Practices

1. **Konsistensi** - Gunakan token design yang sama
2. **Reusability** - Build komponen yang reusable
3. **Accessibility** - Ikuti WCAG guidelines
4. **Documentation** - Dokumentasikan setiap komponen
5. **Testing** - Test komponen di berbagai kondisi
