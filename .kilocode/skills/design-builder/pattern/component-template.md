# Component Template

Template untuk membuat komponen React yang reusable dengan variants dan compound pattern.

## Basic Component

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * ComponentName - Deskripsi singkat component
 *
 * Penjelasan lebih detail tentang component ini, termasuk:
 * - Kapan harus menggunakan component ini
 * - Props apa saja yang tersedia
 * - Contoh penggunaan
 *
 * @example
 * // Basic usage
 * <ComponentName>Content</ComponentName>
 *
 * // With variants
 * <ComponentName variant="primary" size="lg">Click Me</ComponentName>
 */
export interface ComponentNameProps {
  /** Visual variant - menentukan look utama component */
  variant?: "default" | "primary" | "secondary" | "ghost";
  /** Size - menentukan ukuran component */
  size?: "sm" | "md" | "lg";
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Optional icon */
  icon?: React.ReactNode;
}

/**
 * Main ComponentName component
 *
 * @param variant - 'default' | 'primary' | 'secondary' | 'ghost'
 * @param size - 'sm' | 'md' | 'lg'
 * @param disabled - boolean
 * @param className - Additional classes
 * @param children - Content
 * @param onClick - Click handler
 * @param icon - Optional icon
 */
export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      disabled = false,
      children,
      onClick,
      icon,
      ...props
    },
    ref,
  ) => {
    // Variant styles configuration
    const variantStyles = {
      default: {
        base: "bg-slate-900 text-white",
        hover: "hover:bg-slate-800",
      },
      primary: {
        base: "bg-indigo-600 text-white",
        hover: "hover:bg-indigo-700",
      },
      secondary: {
        base: "bg-slate-100 text-slate-900",
        hover: "hover:bg-slate-200",
      },
      ghost: {
        base: "bg-transparent",
        hover: "hover:bg-slate-100",
      },
    };

    // Size styles configuration
    const sizeStyles = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-base gap-2",
      lg: "h-12 px-6 text-lg gap-2.5",
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg font-medium",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",

          // Dynamic variant styles
          variantStyles[variant].base,
          variantStyles[variant].hover,

          // Dynamic size styles
          sizeStyles[size],

          // Disabled state
          disabled && "opacity-50 cursor-not-allowed",

          // User provided className
          className,
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  },
);

// Display name for React DevTools
ComponentName.displayName = "ComponentName";

// Default export
export default ComponentName;
```

## Component dengan Loading State

```tsx
/**
 * Template untuk komponen dengan states
 */
interface WithStatesProps {
  /** Loading state */
  loading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Full width */
  fullWidth?: boolean;
}

export interface FullComponentProps
  extends ComponentNameProps, WithStatesProps {}

/**
 * Component dengan loading state
 */
export const ComponentWithLoading = forwardRef<
  HTMLDivElement,
  FullComponentProps
>(({ loading, loadingText, fullWidth, children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingText || "Loading..."}
        </span>
      ) : (
        children
      )}
    </div>
  );
});

ComponentWithLoading.displayName = "ComponentWithLoading";
```

## Compound Component Pattern

```tsx
/**
 * Template untuk compound components
 */
interface CompoundComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface CompoundComponentCompound {
  Root: typeof CompoundRoot;
  Header: typeof CompoundHeader;
  Body: typeof CompoundBody;
  Footer: typeof CompoundFooter;
}

/**
 * Compound component - Container
 */
export function CompoundComponent({
  children,
  className,
}: CompoundComponentProps) {
  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

/**
 * Root - Main container
 */
function CompoundRoot({ children, className }: CompoundComponentProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

/**
 * Header - Optional header section
 */
function CompoundHeader({ children, className }: CompoundComponentProps) {
  return <div className={cn("pb-3 border-b mb-3", className)}>{children}</div>;
}

/**
 * Body - Main content section
 */
function CompoundBody({ children, className }: CompoundComponentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

/**
 * Footer - Optional footer section
 */
function CompoundFooter({ children, className }: CompoundComponentProps) {
  return <div className={cn("pt-3 border-t mt-3", className)}>{children}</div>;
}

// Attach sub-components
CompoundComponent.Root = CompoundRoot;
CompoundComponent.Header = CompoundHeader;
CompoundComponent.Body = CompoundBody;
CompoundComponent.Footer = CompoundFooter;

export const Card = CompoundComponent as unknown as typeof CompoundComponent & {
  Root: typeof CompoundRoot;
  Header: typeof CompoundHeader;
  Body: typeof CompoundBody;
  Footer: typeof CompoundFooter;
};
```

## Example Usage

```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```
