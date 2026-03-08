# Page Template

Template untuk membuat halaman Next.js dengan metadata, loading state, error handling, dan not found page.

## Metadata - SEO Configuration

```typescript
import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * PageName - Deskripsi halaman
 *
 * Penjelasan lebih detail tentang halaman ini, termasuk:
 * - Apa yang ditampilkan di halaman ini
 * - Route/path halaman
 * - Data apa yang diperlukan
 *
 * @route /page-name
 */

/**
 * Metadata untuk halaman
 * Include title, description, og:image, etc.
 */
export const metadata: Metadata = {
  title: "Page Name | App Name",
  description: "Page description for SEO and social sharing",
  keywords: ["keyword1", "keyword2", "keyword3"],
  openGraph: {
    title: "Page Title for OG",
    description: "Description for social sharing",
    // images: ['/og-image.jpg'],
  },
};
```

## Page Props

```typescript
/**
 * Props yang diterima oleh page component
 */
interface PageProps {
  /** Search params dari URL query string */
  searchParams?: Record<string, string | string[] | undefined>;
  /** URL params untuk dynamic routes */
  params?: Record<string, string>;
  /** Preview mode flag */
  preview?: boolean;
}
```

## Main Page Component

```tsx
/**
 * Main Page Component
 *
 * @param searchParams - URL search parameters
 * @param params - URL path parameters
 * @param preview - Preview mode flag
 */
export default function PageName({ searchParams, params, preview }: PageProps) {
  // ============================================
  // DATA FETCHING - Ambil data dari API/DB
  // ============================================

  // Example: const data = await fetchData();
  // Example: const { id } = params;

  // ============================================
  // RENDER - Tampilkan konten halaman
  // ============================================

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        title="Page Title"
        description="Page description goes here"
        actions={
          <div className="flex gap-2">
            {/* Header actions like buttons, filters */}
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page content here */}
        <Section title="Section Title">
          <p>Section content</p>
        </Section>
      </main>
    </div>
  );
}
```

## Sub-Components

### PageHeader Component

```tsx
/**
 * Page Header Component
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                {item.href ? (
                  <a href={item.href} className="hover:text-foreground">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title & Actions */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
```

### Section Component

```tsx
/**
 * Section Component
 */
interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

function Section({
  title,
  description,
  children,
  className,
  actions,
}: SectionProps) {
  return (
    <section className={className}>
      {(title || actions) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
```

## Loading State

```tsx
/**
 * Loading state component
 * Ditampilkan saat page sedang loading (async)
 */
export default function PageNameLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="h-9 w-48 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Skeleton loaders */}
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </main>
    </div>
  );
}
```

## Error State

```tsx
"use client";

import { useEffect } from "react";

/**
 * Error state component
 * Ditampilkan saat terjadi error
 */
interface PageNameErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function PageNameError({ error, reset }: PageNameErrorProps) {
  useEffect(() => {
    // Log error ke error reporting service
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Export error component
export { PageNameError };
```

## Not Found (404)

```tsx
import Link from "next/link";

/**
 * 404 Not Found component
 * Ditampilkan saat halaman tidak ditemukan
 */
export function PageNameNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
```

## Example Usage

```tsx
// app/page-name/page.tsx
import { PageName, metadata } from './page';

// Override metadata
export metadata: Metadata = {
  ...metadata,
  title: 'Custom Title | App Name',
};

// Override default export with loading/error/not-found
export { PageName, PageNameLoading, PageNameError, PageNameNotFound };
```
