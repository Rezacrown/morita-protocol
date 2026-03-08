---
name: design-builder
description: Skill untuk membuat atau meng-expand UI components dan pages berdasarkan design system - dengan brainstorming wajib sebelum coding
---

# Instructions

Skill ini digunakan untuk membuat atau mengembangkan UI components dan pages berdasarkan design system. Gunakan skill ini ketika:

1. **Membuat komponen baru** - Ketika perlu membuat komponen UI dari nol
2. **Mengembangkan design system** - Ketika perlu expand atau modify design system yang ada
3. **Membuat halaman baru** - Ketika perlu membuat page berdasarkan preset design

## Mandatory Brainstorming Sebelum Coding

**Wajib** lakukan brainstorming dengan pertanyaan berikut sebelum menulis kode:

### Step 1: Tanya Design System yang Ada

- Apakah sudah ada design system di project ini?
- Jika ya, mana file design system-nya? (biasanya di `components/theme/`, `lib/design-system.ts`, dll)
- Apa saja komponen yang sudah tersedia?

### Step 2: Tanya Referensi Design

- Apakah ada design reference/referensi design (Figma, mockup, screenshot)?
- Jika ada, minta user share link atau file-nya

### Step 3: Jika Tidak Ada Design System

- SARANKAN preset yang sesuai (lihat section Design Presets di bawah)
- Tanya ke user preset mana yang preferred
- Atau buat custom design system bersama user

## Mandatory Questions Untuk User

Sebelum mulai coding, wajib tanya ke user:

1. **Design system sudah ada atau belum?**
   - Jika belum, apakah mau buat baru atau gunakan preset?

2. **Library preference:**
   - shadcn/ui (recommended - Radix + Tailwind)
   - Radix UI (headless)
   - DaisyUI (Tailwind CSS)
   - Custom (tanpa library)

3. **Framework:**
   - React
   - Next.js (App Router)

4. **Design theme:**
   - Finance (clean, professional, data-focused)
   - Fantasy (immersive, decorative, rich animations)
   - SaaS (modern, minimal, bento grid)
   - Elegant (sophisticated, typography-focused)
   - Minimal (ultra-clean, monochrome)
   - Gaming (bold, vibrant, high contrast)

# Design Presets

## Finance

- Clean, professional, data-focused
- Dark/Light mode support
- Charts dan data visualization
- Professional typography (Inter, SF Pro)
- Primary colors: Blue (#0F172A), Green (#10B981), White
- Use cases: Dashboard, Banking, Trading, Analytics

## Fantasy

- Immersive, decorative, rich animations
- Dark theme dominant
- Custom fonts (medieval, magical feel)
- Particle effects, glow effects
- Primary colors: Purple (#7C3AED), Gold (#F59E0B), Dark (#1F1F2E)
- Use cases: Game UI, RPG, Fantasy themes

## SaaS

- Modern, minimal, bento grid layouts
- Clean whitespace
- Card-based design
- Primary colors: Indigo (#6366F1), Slate (#64748B), White
- Use cases: SaaS Dashboard, Admin Panel, Landing Pages

## Elegant

- Sophisticated, typography-focused
- Serif fonts for headings (Playfair Display, Cormorant)
- Generous spacing
- Muted color palette
- Primary colors: Black (#1A1A1A), Cream (#FDFBF7), Gold accent (#C9A227)
- Use cases: Luxury brands, Portfolio, Editorial

## Minimal

- Ultra-clean, monochrome
- Maximum whitespace
- Simple typography (Helvetica, Arial)
- No decoration, pure function
- Primary colors: Black (#000), White (#FFF), Gray (#888)
- Use cases: Portfolio, Personal site, Blog

## Gaming

- Bold, vibrant, high contrast
- Dynamic gradients
- Neon accents
- Animated elements
- Primary colors: Cyan (#00D9FF), Magenta (#FF0080), Dark (#0A0A0F)
- Use cases: Esports, Gaming platform, Streamer UI

# Best Practices

## Tailwind CSS

- Gunakan utility classes yang consistent
- Follow Tailwind's recommended configuration
- Gunakan `@apply` hanya jika perlu untuk reusable components
- Gunakan CSS variables untuk theming

## shadcn/ui Patterns

- Import komponen dari `@/components/ui/`
- Follow komponen props pattern
- Gunakan `cn()` utility untuk class merging
  -Ikuti Radix UI accessibility standards

## Radix UI

- Gunakan Primitives sebagai base
- Override styles dengan CSS modules atau Tailwind
- Maintain accessibility (keyboard navigation, screen reader)
- Follow Radix composition patterns

## Component Structure

```tsx
// Component dengan proper structure dan comments
interface ComponentProps {
  // Deskripsi props
  variant?: 'default' | 'primary' | 'secondary';
  // Tambahan props...
}

export function Component({
  variant = 'default',
  ...props
}: ComponentProps) {
  // Logic dengan comments

  return (
    // JSX dengan proper class names
  );
}
```

# Code Documentation Requirement

**Semua pattern wajib punya comments:**

- Komentar fungsi/blok kode penting
- Jelaskan props dan interface
- Dokumentasi penggunaan di comments
- Gunakan TypeScript interfaces yang jelas

# References

See the [references/](references/) folder untuk complete guides:

- [Design System Guides](references/design-system-guides.md)
- [Component Taxonomy](references/component-taxonomy.md)
- [Accessibility Guidelines](references/accessibility-guidelines.md)

# Examples

See the [example/](example/) folder untuk usage examples:

- [Finance Dashboard](example/finance-dashboard.md)
- [Fantasy Game UI](example/fantasy-game-ui.md)
- [SaaS Dashboard](example/saas-dashboard.md)
- [Elegant Landing](example/elegant-landing.md)

# Patterns

See the [pattern/](pattern/) folder untuk templates:

- [Component Template](pattern/component-template.md)
- [Page Template](pattern/page-template.md)
- [Design Presets](pattern/design-presets/)
  - [Finance](pattern/design-presets/finance.md)
  - [Fantasy](pattern/design-presets/fantasy.md)
  - [SaaS](pattern/design-presets/saas.md)
  - [Elegant](pattern/design-presets/elegant.md)
  - [Minimal](pattern/design-presets/minimal.md)
  - [Gaming](pattern/design-presets/gaming.md)
