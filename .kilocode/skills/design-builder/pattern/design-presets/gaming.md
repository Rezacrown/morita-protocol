# Gaming Design Preset

Bold, vibrant, high contrast design for gaming and esports applications.

## Color Palette

```json
{
  "primary": "#00D9FF",
  "primary-light": "#5EEAFF",
  "primary-dark": "#00A3CC",
  "secondary": "#FF0080",
  "secondary-light": "#FF4DA6",
  "accent": "#7C3AED",
  "accent-alt": "#FF6B35",
  "success": "#00FF88",
  "warning": "#FFB800",
  "error": "#FF3366",
  "background": "#0A0A0F",
  "background-alt": "#12121A",
  "surface": "#1A1A24",
  "surface-elevated": "#22222E",
  "card": "#16161F",
  "border": "#2A2A3A",
  "text": {
    "primary": "#FFFFFF",
    "secondary": "#B0B0C0",
    "muted": "#6A6A7A",
    "accent": "#00D9FF",
    "inverse": "#0A0A0F"
  },
  "neon": {
    "cyan": "#00D9FF",
    "magenta": "#FF0080",
    "purple": "#7C3AED",
    "green": "#00FF88",
    "yellow": "#FFB800"
  }
}
```

## Typography

```json
{
  "fontFamily": {
    "heading": "Orbitron, Rajdhani, sans-serif",
    "body": "Inter, Rajdhani, sans-serif",
    "display": "Orbitron, sans-serif",
    "gaming": "Press Start 2P, cursive"
  },
  "fontSize": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
    "5xl": "3.5rem"
  },
  "effects": {
    "glow": "0 0 20px rgba(0, 217, 255, 0.5)",
    "textGlow": "0 0 10px currentColor",
    "gradient": "linear-gradient(135deg, #00D9FF, #FF0080)"
  }
}
```

## Effects

### Glows

```json
{
  "cyan": "0 0 20px rgba(0, 217, 255, 0.5)",
  "magenta": "0 0 20px rgba(255, 0, 128, 0.5)",
  "purple": "0 0 20px rgba(124, 58, 237, 0.5)",
  "green": "0 0 20px rgba(0, 255, 136, 0.5)"
}
```

### Gradients

```json
{
  "primary": "linear-gradient(135deg, #00D9FF, #7C3AED)",
  "secondary": "linear-gradient(135deg, #FF0080, #FF6B35)",
  "dark": "linear-gradient(180deg, #1A1A24 0%, #0A0A0F 100%)"
}
```

### Animations

```json
{
  "pulse": "glow-pulse 2s ease-in-out infinite",
  "float": "float 3s ease-in-out infinite",
  "slide": "slide-in 0.5s ease-out",
  "typing": "typing 3s steps(40) infinite"
}
```

## Components

### Button

```json
{
  "primary": {
    "background": "linear-gradient(135deg, #00D9FF, #7C3AED)",
    "color": "#FFFFFF",
    "hover": "linear-gradient(135deg, #00A3CC, #6D28D9)",
    "glow": "0 0 20px rgba(0, 217, 255, 0.4)"
  },
  "secondary": {
    "background": "transparent",
    "border": "2px solid #00D9FF",
    "color": "#00D9FF",
    "hover": "rgba(0, 217, 255, 0.1)"
  },
  "danger": {
    "background": "linear-gradient(135deg, #FF3366, #FF0080)",
    "color": "#FFFFFF",
    "glow": "0 0 20px rgba(255, 51, 102, 0.4)"
  }
}
```

### Card

```json
{
  "background": "#16161F",
  "border": "1px solid #2A2A3A",
  "glow": "0 0 30px rgba(0, 217, 255, 0.15)",
  "radius": "0.75rem",
  "hover": {
    "border": "#00D9FF",
    "glow": "0 0 40px rgba(0, 217, 255, 0.2)"
  }
}
```

### Input

```json
{
  "background": "#1A1A24",
  "border": "1px solid #2A2A3A",
  "focus": "#00D9FF",
  "glow": "0 0 10px rgba(0, 217, 255, 0.3)",
  "radius": "0.5rem"
}
```

### Badge

```json
{
  "live": "bg-red-500 animate-pulse",
  "online": "bg-green-500",
  "offline": "bg-gray-500"
}
```

## Use Cases

- Esports Platform
- Gaming Dashboard
- Streamer UI
- Tournament Brackets
- Leaderboards
- Game Store

## Recommended Libraries

- Framer Motion
- React Spring
- Three.js
- React Three Fiber
- Zustand

## Recommended Fonts

- Orbitron
- Rajdhani
- Press Start 2P
- Bebas Neue
- Audiowide

## Design Principles

- Dynamic gradients
- Neon accents
- Bold typography
- Animated elements
- High contrast
