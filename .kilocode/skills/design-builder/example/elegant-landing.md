# Elegant Landing Page Example

Contoh implementasi landing page dengan design preset Elegant - sophisticated, typography-focused.

## Design System Configuration

```json
{
  "preset": "elegant",
  "colors": {
    "primary": "#1A1A1A",
    "secondary": "#2D2D2D",
    "accent": "#C9A227",
    "background": "#FDFBF7",
    "surface": "#FFFFFF",
    "cream": "#FDFBF7",
    "text": {
      "primary": "#1A1A1A",
      "secondary": "#4A4A4A",
      "muted": "#8A8A8A"
    },
    "border": "#E8E4DD"
  },
  "typography": {
    "fontFamily": {
      "heading": "Playfair Display, Georgia, serif",
      "body": "Cormorant Garamond, Garamond, serif",
      "sans": "Inter, sans-serif"
    },
    "fontSize": {
      "display": "4.5rem",
      "h1": "3.5rem",
      "h2": "2.5rem",
      "h3": "1.75rem",
      "body": "1.125rem"
    }
  },
  "layout": {
    "container": "max-w-6xl",
    "spacing": {
      "section": "120px",
      "element": "32px"
    }
  }
}
```

## Component Structure

```
app/
├── page.tsx               # Landing page
├── layout.tsx
└── components/
    ├── landing/
    │   ├── Hero.tsx
    │   ├── Features.tsx
    │   ├── Testimonials.tsx
    │   ├── Pricing.tsx
    │   └── Footer.tsx
    └── ui/
        ├── Button.tsx
        ├── Section.tsx
        └── DecorativeLine.tsx
```

## Typography Components

```tsx
// components/ui/DisplayText.tsx
import { cn } from "@/lib/utils";

interface DisplayTextProps {
  children: React.ReactNode;
  className?: string;
  /** Heading level */
  level?: "h1" | "h2" | "h3" | "h4";
  /** Visual variant */
  variant?: "display" | "heading" | "subheading";
}

/**
 * Elegant display text dengan serif typography
 */
export function DisplayText({
  children,
  level = "h1",
  variant = "heading",
  className,
}: DisplayTextProps) {
  const variants = {
    display: "font-playfair text-5xl md:text-7xl font-medium leading-tight",
    heading: "font-playfair text-4xl md:text-5xl font-medium leading-tight",
    subheading:
      "font-playfair text-2xl md:text-3xl font-normal leading-relaxed",
  };

  const Component = level;

  return (
    <Component className={cn("text-primary", variants[variant], className)}>
      {children}
    </Component>
  );
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "body" | "small" | "caption";
}

/**
 * Elegant body text dengan serif typography
 */
export function BodyText({
  children,
  variant = "body",
  className,
}: BodyTextProps) {
  const variants = {
    body: "font-cormorant text-lg md:text-xl leading-relaxed text-secondary",
    small: "font-cormorant text-base text-secondary",
    caption: "font-cormorant text-sm text-muted italic",
  };

  return <p className={cn(variants[variant], className)}>{children}</p>;
}
```

## Hero Section

```tsx
// components/landing/Hero.tsx
import { Button } from "@/components/ui/Button";
import { DisplayText, BodyText } from "@/components/ui/DisplayText";
import { DecorativeLine } from "@/components/ui/DecorativeLine";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cream">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/30 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-px h-40 bg-gradient-to-b from-transparent via-amber-300/30 to-transparent" />
      <div className="absolute top-40 right-20 w-px h-60 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Overline */}
        <div className="mb-6">
          <span className="inline-block font-sans text-xs tracking-[0.3em] uppercase text-muted">
            Est. 2024
          </span>
        </div>

        {/* Title */}
        <DisplayText
          level="h1"
          variant="display"
          className="max-w-4xl mx-auto mb-8"
        >
          Crafting Digital
          <span className="relative mx-4">
            <span className="relative z-10">Excellence</span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-amber-200/50"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,9 Q50,0 100,9 T200,9"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </span>
        </DisplayText>

        {/* Subtitle */}
        <BodyText className="max-w-2xl mx-auto mb-12 text-lg">
          We blend timeless elegance with modern innovation to create digital
          experiences that resonate. Every pixel, every interaction, designed
          with intention.
        </BodyText>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg">
            Start Your Journey
          </Button>
          <Button variant="ghost" size="lg">
            View Our Work
          </Button>
        </div>

        {/* Decorative line */}
        <div className="mt-16 flex justify-center">
          <DecorativeLine variant="centered" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-primary/40 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
```

## Features Section

```tsx
// components/landing/Features.tsx
import { DisplayText, BodyText } from "@/components/ui/DisplayText";
import { DecorativeLine } from "@/components/ui/DecorativeLine";

const features = [
  {
    title: "Timeless Design",
    description:
      "Our approach transcends trends, creating experiences that remain beautiful for years to come.",
    icon: "✦",
  },
  {
    title: "Meticulous Craft",
    description:
      "Every detail is considered, every interaction refined to perfection through careful iteration.",
    icon: "◈",
  },
  {
    title: "Purposeful Innovation",
    description:
      "Technology serves elegance, not the other way around. We build with intention.",
    icon: "◇",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <DisplayText level="h2" className="mb-6">
            Our Philosophy
          </DisplayText>
          <DecorativeLine variant="centered" className="mb-8" />
          <BodyText>
            We believe that true elegance lies in the balance between form and
            function, beauty and purpose.
          </BodyText>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full border border-primary/10 group-hover:border-amber-300/50 group-hover:bg-amber-50/30 transition-all duration-500">
                <span className="text-2xl text-primary/80 group-hover:text-amber-600 transition-colors">
                  {feature.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-playfair text-xl font-medium text-primary mb-4">
                {feature.title}
              </h3>

              {/* Decorative line */}
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent mx-auto mb-4" />

              {/* Description */}
              <BodyText variant="small" className="text-muted">
                {feature.description}
              </BodyText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Testimonials Section

```tsx
// components/landing/Testimonials.tsx
import { DisplayText, BodyText } from "@/components/ui/DisplayText";
import { DecorativeLine } from "@/components/ui/DecorativeLine";

const testimonials = [
  {
    quote:
      "Working with this team transformed our digital presence. Their attention to detail and commitment to excellence is unparalleled.",
    author: "Alexandra Mitchell",
    role: "CEO, Artisan Studios",
  },
  {
    quote:
      "They didn't just build us a website—they crafted an experience. Every interaction feels intentional, every moment, memorable.",
    author: "James Crawford",
    role: "Founder, Heritage Collective",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <DisplayText level="h2" className="mb-6">
            Client Stories
          </DisplayText>
          <DecorativeLine variant="centered" className="mb-8" />
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-10 border border-border relative"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-200/30" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-200/30" />

              {/* Quote */}
              <BodyText className="italic mb-8 relative">
                <span className="text-4xl text-amber-200/50 absolute -top-2 -left-2 font-playfair">
                  "
                </span>
                {testimonial.quote}
              </BodyText>

              {/* Author */}
              <div className="border-t border-border/50 pt-4">
                <div className="font-playfair font-medium text-primary">
                  {testimonial.author}
                </div>
                <div className="text-sm text-muted font-cormorant">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Pricing Section

```tsx
// components/landing/Pricing.tsx
import { DisplayText, BodyText } from "@/components/ui/DisplayText";
import { DecorativeLine } from "@/components/ui/DecorativeLine";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    name: "Essence",
    price: "$2,500",
    description:
      "Perfect for small businesses beginning their digital journey.",
    features: [
      "Custom website design",
      "Mobile responsive",
      "Basic SEO optimization",
      "Contact form integration",
      "3 months support",
    ],
    featured: false,
  },
  {
    name: "Signature",
    price: "$5,000",
    description: "For businesses ready to make a lasting impression.",
    features: [
      "Everything in Essence",
      "Advanced animations",
      "CMS integration",
      "E-commerce ready",
      "Analytics setup",
      "6 months priority support",
    ],
    featured: true,
  },
  {
    name: "Bespoke",
    price: "Custom",
    description: "For those seeking truly unique digital experiences.",
    features: [
      "Everything in Signature",
      "Custom development",
      "Third-party integrations",
      "White-glove service",
      "Dedicated account manager",
      "12 months premium support",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <DisplayText level="h2" className="mb-6">
            Investment
          </DisplayText>
          <DecorativeLine variant="centered" className="mb-8" />
          <BodyText>
            Choose the package that aligns with your vision. Each includes our
            commitment to excellence.
          </BodyText>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 border ${plan.featured ? "border-amber-200/50 bg-cream" : "border-border"}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-200/30 text-amber-700 text-xs font-sans tracking-wider uppercase">
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <h3 className="font-playfair text-2xl text-primary mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="font-playfair text-4xl text-primary">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-muted">/project</span>
                )}
              </div>

              {/* Description */}
              <BodyText variant="small" className="mb-8">
                {plan.description}
              </BodyText>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-secondary"
                  >
                    <span className="text-amber-400 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.featured ? "primary" : "outline"}
                className="w-full"
              >
                {plan.price === "Custom" ? "Contact Us" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Button Components

```tsx
// components/ui/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    ghost: "text-primary hover:bg-primary/5",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-300",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
```

## Decorative Components

```tsx
// components/ui/DecorativeLine.tsx
import { cn } from "@/lib/utils";

interface DecorativeLineProps {
  variant?: "left" | "centered" | "right";
  className?: string;
}

export function DecorativeLine({
  variant = "centered",
  className,
}: DecorativeLineProps) {
  const variants = {
    left: "justify-start",
    centered: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={cn("flex", variants[variant], className)}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-gradient-to-r from-amber-200 to-amber-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
        <div className="w-20 h-px bg-gradient-to-r from-amber-300 to-transparent" />
      </div>
    </div>
  );
}
```

## Footer

```tsx
// components/landing/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="font-playfair text-2xl mb-4">Studio</div>
            <p className="font-cormorant text-white/60">
              Crafting digital excellence since 2024.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs tracking-wider uppercase text-white/40 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-wider uppercase text-white/40 mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>hello@studio.com</li>
              <li>+1 (555) 123-4567</li>
              <li>New York, NY</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-sans text-xs tracking-wider uppercase text-white/40 mb-4">
              Follow
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm">
          <p>© 2024 Studio. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

## Color Palette

| Token        | Hex       | Usage                    |
| ------------ | --------- | ------------------------ |
| `primary`    | `#1A1A1A` | Headings, primary text   |
| `secondary`  | `#2D2D2D` | Body text                |
| `accent`     | `#C9A227` | Gold accents, highlights |
| `background` | `#FDFBF7` | Cream page background    |
| `surface`    | `#FFFFFF` | Cards, sections          |
| `cream`      | `#FDFBF7` | Alternative background   |
| `border`     | `#E8E4DD` | Subtle borders           |

## Best Practices

1. **Typography-focused** - Playfair Display + Cormorant Garamond
2. **Generous whitespace** - Large vertical spacing
3. **Subtle animations** - Slow, elegant transitions
4. **Gold accents** - Amber tones for elegance
5. **Minimal decoration** - Less is more
6. **High contrast** - Black on cream
