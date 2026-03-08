# Accessibility Guidelines

Panduan accessibility (a11y) untuk membuat UI yang dapat diakses oleh semua pengguna.

## Prinsip Dasar WCAG 2.1

### 1. Perceivable (Dapat Diterima)

- Informasi harus dapat disajikan dalam cara yang dapat dirasakan pengguna
- Include alt text untuk gambar
- Contrast ratio minimum 4.5:1 untuk teks normal
- Captions untuk video

### 2. Operable (Dapat Dioperasikan)

- Komponen UI harus dapat dioperasikan oleh semua pengguna
- Keyboard navigation untuk semua interactive elements
- Skip links untuk navigation
- Tidak ada seizure triggers

### 3. Understandable (Dapat Dipahami)

- Informasi dan operasi UI harus dapat dipahami
- Consistent navigation
- Error identification dan suggestions
- Labels dan instructions yang jelas

### 4. Robust (Kuat)

- Konten harus dapat diinterpretasikan oleh berbagai user agents
- Valid HTML
- ARIA attributes yang正确

## Keyboard Navigation

### Focus Management

```tsx
// Selalu visible focus indicator
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

// Skip link untuk keyboard users
<>
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>
  <main id="main-content">
    {/* Page content */}
  </main>
</>
```

### Focus Trap in Modal

```tsx
import { useEffect, useRef } from "react";

/**
 * Trap focus inside modal when open
 */
function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return containerRef;
}
```

## ARIA Attributes

### ARIA Roles

```tsx
// Landmark roles
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>

// Interactive roles
<button role="menuitem">...</button>
<dialog role="dialog">...</dialog>
```

### ARIA States

```tsx
// Expanded state
<button aria-expanded={isOpen} aria-controls="menu-id">
  Menu
</button>
<div id="menu-id" hidden={!isOpen}>...</div>

// Checked/Selected state
<button aria-checked={isSelected} role="radio">
  Option
</button>

// Disabled state
<button aria-disabled={isDisabled}>...</button>

// Invalid state
<input aria-invalid={hasError} aria-describedby="error-id" />
<div id="error-id" role="alert">{errorMessage}</div>
```

### Live Regions

```tsx
// Announce dynamic content
<div role="status" aria-live="polite">
  {message}
</div>

// Announce errors
<div role="alert" aria-live="assertive">
  {error}
</div>
```

## Color Contrast

### Minimum Contrast Ratios

```css
/* 
 * WCAG AA - Minimum untuk semua teks
 * Normal text: 4.5:1
 * Large text (18px+ or 14px bold): 3:1
 * WCAG AAA - Enhanced
 * Normal text: 7:1
 * Large text: 4.5:1
 */

/* Primary text - harus memenuhi 4.5:1 */
.text-primary {
  color: #1f2937; /* contrast: 14.5:1 dengan white */
}

/* Secondary text - 4.5:1 minimum */
.text-secondary {
  color: #6b7280; /* contrast: 4.7:1 dengan white */
}

/* Disabled state */
.text-disabled {
  color: #d1d5db; /* contrast: 2.3:1 - hanya untuk decoration */
}
```

### Tools untuk Check Contrast

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Figma Contrast Plugin](https://www.figma.com/community/plugin/748533339900615277)
- Chrome DevTools Accessibility Inspector

## Screen Reader Support

### Alt Text

```tsx
// Descriptive alt text
<img src="chart.png" alt="Sales chart showing 25% increase from Q1 to Q2" />

// Decorative images - empty alt
<img src="decorative-line.png" alt="" />

// Complex images - use longdesc or aria-describedby
<img
  src="flowchart.png"
  alt="User registration flowchart"
  aria-describedby="flowchart-desc"
/>
<div id="flowchart-desc" className="sr-only">
  1. User fills form → 2. System validates → 3. Success/Error message
</div>
```

### Form Labels

```tsx
// Explicit label - recommended
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Label with required indicator
<label htmlFor="username">
  Username
  <span aria-hidden="true">*</span>
</label>
<input
  id="username"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="username-help"
/>
<span id="username-help" className="text-sm text-gray-500">
  Minimum 3 characters
</span>
```

### Error Messages

```tsx
// Associate error with input
<input
  id="password"
  aria-invalid={hasError}
  aria-describedby="password-error"
/>;
{
  hasError && (
    <span id="password-error" role="alert" className="text-red-600">
      Password must be at least 8 characters
    </span>
  );
}
```

## Focus Visible

### Custom Focus Styles

```css
/* Always visible focus - tidak tergantung prefers-reduced-motion */
.focus-visible:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Ring effect untuk enhanced visibility */
.focus-ring:focus-visible {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4);
}
```

### Visible Only on Focus

```css
/* Hidden by default, visible on focus */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus-visible:focus:not(.sr-only) {
  /* Make visible on focus */
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## Reduced Motion

### Respect User Preference

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### React Implementation

```tsx
import { useReducedMotion } from "framer-motion";

/**
 * Hook untuk check reduced motion preference
 */
function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  const animation = shouldReduceMotion
    ? { opacity: 1 } // Skip animation
    : { opacity: 0, animate: { opacity: 1 } };

  return <motion.div {...animation} />;
}
```

## Testing Checklist

### Manual Testing

- [ ] Navigasi dengan keyboard saja (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader test (NVDA, VoiceOver)
- [ ] Zoom 200% test
- [ ] Color blindness simulation
- [ ] Focus trap dalam modal

### Automated Testing

- [ ] axe-core integration
- [ ] eslint-plugin-jsx-a11y
- [ ] Lighthouse accessibility audit
- [ ] WAVE evaluation tool

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
