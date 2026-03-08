# SaaS Design Preset

Modern, minimal, bento grid layouts for SaaS applications.

## Color Palette

```json
{
  "primary": "#6366F1",
  "primary-light": "#818CF8",
  "primary-dark": "#4F46E5",
  "secondary": "#64748B",
  "accent": "#10B981",
  "success": "#10B981",
  "warning": "#F59E0B",
  "error": "#EF4444",
  "info": "#06B6D4",
  "background": "#F8FAFC",
  "surface": "#FFFFFF",
  "surface-elevated": "#FFFFFF",
  "border": "#E2E8F0",
  "text": {
    "primary": "#0F172A",
    "secondary": "#64748B",
    "muted": "#94A3B8",
    "inverse": "#FFFFFF"
  }
}
```

## Typography

```json
{
  "fontFamily": {
    "heading": "Inter, system-ui, sans-serif",
    "body": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, monospace"
  },
  "fontSize": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem"
  },
  "fontWeight": {
    "normal": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700"
  }
}
```

## Layout

### Bento Grid

```json
{
  "gap": "1.5rem",
  "radius": "1rem",
  "shadow": "0 1px 3px rgba(0,0,0,0.1)",
  "hover": {
    "shadow": "0 4px 6px -1px rgba(0,0,0,0.1)",
    "border": "#E2E8F0"
  }
}
```

### Sidebar

```json
{
  "width": "280px",
  "collapsed": "80px"
}
```

### Container

```json
{
  "container": "max-w-7xl"
}
```

## Components

### Button

```json
{
  "primary": {
    "background": "#6366F1",
    "color": "#FFFFFF",
    "hover": "#4F46E5"
  },
  "secondary": {
    "background": "#F1F5F9",
    "color": "#0F172A",
    "hover": "#E2E8F0"
  },
  "ghost": {
    "background": "transparent",
    "color": "#64748B",
    "hover": "#F1F5F9"
  },
  "outline": {
    "background": "transparent",
    "border": "1px solid #E2E8F0",
    "color": "#0F172A",
    "hover": "#F8FAFC"
  }
}
```

### Card

```json
{
  "background": "#FFFFFF",
  "border": "#F1F5F9",
  "shadow": "0 1px 3px rgba(0,0,0,0.05)",
  "radius": "1rem",
  "hover": {
    "shadow": "0 4px 6px -1px rgba(0,0,0,0.1)",
    "border": "#E2E8F0"
  }
}
```

### Input

```json
{
  "background": "#FFFFFF",
  "border": "#E2E8F0",
  "focus": "#6366F1",
  "radius": "0.5rem"
}
```

### Badge

```json
{
  "primary": "bg-indigo-100 text-indigo-700",
  "success": "bg-emerald-100 text-emerald-700",
  "warning": "bg-amber-100 text-amber-700",
  "error": "bg-red-100 text-red-700"
}
```

### Avatar

```json
{
  "size": {
    "sm": "2rem",
    "md": "2.5rem",
    "lg": "3rem"
  }
}
```

## Use Cases

- SaaS Dashboard
- Admin Panel
- Landing Page
- Settings Page
- Team Management
- Analytics

## Recommended Libraries

- shadcn/ui
- Radix UI
- Framer Motion
- Recharts
- TanStack Table
- cmdk

## Recommended Fonts

- Inter
- Plus Jakarta Sans
- DM Sans
