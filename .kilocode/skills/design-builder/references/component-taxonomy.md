# Component Taxonomy

Klasifikasi dan kategorisasi komponen UI berdasarkan tipe dan fungsi.

## Kategori Komponen

### 1. Layout Components

Komponen yang mengatur struktur dan layout halaman.

| Component   | Deskripsi                | Props                            |
| ----------- | ------------------------ | -------------------------------- |
| `Container` | Wrapper dengan max-width | `children`, `size`               |
| `Grid`      | CSS Grid layout          | `columns`, `gap`, `children`     |
| `Stack`     | Flexbox stack layout     | `direction`, `gap`, `children`   |
| `Flex`      | Flex container           | `align`, `justify`, `children`   |
| `Sidebar`   | Side navigation          | `items`, `collapsed`, `onToggle` |
| `Header`    | Page header              | `title`, `actions`, `breadcrumb` |
| `Footer`    | Page footer              | `links`, `copyright`             |

### 2. Typography Components

Komponen untuk menampilkan teks.

| Component | Deskripsi            | Props                             |
| --------- | -------------------- | --------------------------------- |
| `Heading` | Judul dengan variant | `level`, `children`, `className`  |
| `Text`    | Paragraf teks        | `size`, `color`, `children`       |
| `Label`   | Label untuk form     | `htmlFor`, `required`, `children` |
| `Link`    | Anchor link          | `href`, `external`, `children`    |
| `Code`    | Code snippet         | `language`, `children`            |
| `Quote`   | Blockquote           | `author`, `children`              |

### 3. Form Components

Komponen untuk input dan form.

| Component    | Deskripsi        | Props                                      |
| ------------ | ---------------- | ------------------------------------------ |
| `Input`      | Text input field | `type`, `placeholder`, `error`, `onChange` |
| `Textarea`   | Multi-line input | `rows`, `resize`, `error`                  |
| `Select`     | Dropdown select  | `options`, `value`, `onChange`             |
| `Checkbox`   | Checkbox input   | `checked`, `label`, `onChange`             |
| `Radio`      | Radio button     | `options`, `value`, `onChange`             |
| `Switch`     | Toggle switch    | `checked`, `onChange`, `label`             |
| `Slider`     | Range slider     | `min`, `max`, `value`, `onChange`          |
| `Button`     | Action button    | `variant`, `size`, `loading`, `onClick`    |
| `FileUpload` | File input       | `accept`, `multiple`, `onUpload`           |

### 4. Data Display

Komponen untuk menampilkan data.

| Component  | Deskripsi                 | Props                            |
| ---------- | ------------------------- | -------------------------------- |
| `Table`    | Tabular data              | `columns`, `data`, `sortable`    |
| `Card`     | Content container         | `title`, `footer`, `children`    |
| `List`     | Vertical list             | `items`, `renderItem`            |
| `Badge`    | Status indicator          | `variant`, `children`            |
| `Avatar`   | User avatar               | `src`, `alt`, `size`, `fallback` |
| `Image`    | Image dengan optimization | `src`, `alt`, `loading`, `sizes` |
| `Skeleton` | Loading placeholder       | `variant`, `width`, `height`     |
| `Empty`    | Empty state               | `title`, `description`, `action` |

### 5. Navigation

Komponen untuk navigasi.

| Component    | Deskripsi        | Props                            |
| ------------ | ---------------- | -------------------------------- |
| `Tabs`       | Tab navigation   | `items`, `activeTab`, `onChange` |
| `Breadcrumb` | Breadcrumb trail | `items`, `separator`             |
| `Pagination` | Page navigation  | `page`, `total`, `onChange`      |
| `Menu`       | Dropdown menu    | `items`, `trigger`, `onSelect`   |
| `Nav`        | Navigation links | `items`, `active`, `onNavigate`  |
| `Drawer`     | Slide-out panel  | `open`, `position`, `onClose`    |

### 6. Feedback

Komponen untuk feedback dan notifications.

| Component  | Deskripsi          | Props                                  |
| ---------- | ------------------ | -------------------------------------- |
| `Alert`    | Inline message     | `variant`, `title`, `children`         |
| `Toast`    | Notification toast | `message`, `duration`, `onClose`       |
| `Modal`    | Dialog modal       | `open`, `onClose`, `title`, `children` |
| `Dialog`   | Radix Dialog       | `open`, `onOpenChange`, `children`     |
| `Tooltip`  | Hover tooltip      | `content`, `children`, `side`          |
| `Progress` | Progress bar       | `value`, `max`, `variant`              |
| `Spinner`  | Loading spinner    | `size`, `color`                        |
| `Skeleton` | Loading skeleton   | `variant`, `width`, `height`           |

### 7. Data Visualization

Komponen untuk charts dan visualisasi data.

| Component    | Deskripsi          | Props                          |
| ------------ | ------------------ | ------------------------------ |
| `Chart`      | Base chart wrapper | `type`, `data`, `options`      |
| `BarChart`   | Bar chart          | `data`, `xKey`, `yKey`         |
| `LineChart`  | Line chart         | `data`, `xKey`, `yKey`         |
| `PieChart`   | Pie chart          | `data`, `valueKey`, `labelKey` |
| `AreaChart`  | Area chart         | `data`, `xKey`, `yKey`         |
| `DonutChart` | Donut chart        | `data`, `valueKey`, `labelKey` |

### 8. Overlay Components

Komponen yang overlays di atas content.

| Component     | Deskripsi        | Props                                        |
| ------------- | ---------------- | -------------------------------------------- |
| `Popover`     | Popover content  | `trigger`, `content`, `open`, `onOpenChange` |
| `Dropdown`    | Dropdown menu    | `trigger`, `items`, `onSelect`               |
| `ContextMenu` | Right-click menu | `items`, `onSelect`                          |
| `Tooltip`     | Tooltip overlay  | `content`, `children`, `side`                |

### 9. Composite Components

Kombinasi dari beberapa komponen dasar.

| Component        | Deskripsi                   | Props                                |
| ---------------- | --------------------------- | ------------------------------------ |
| `Form`           | Form wrapper                | `onSubmit`, `children`               |
| `FormField`      | Form field                  | `name`, `label`, `error`, `children` |
| `SearchInput`    | Search dengan button        | `value`, `onChange`, `onSearch`      |
| `SelectOption`   | Select dengan search        | `options`, `value`, `onChange`       |
| `DataTable`      | Table dengan sorting/filter | `columns`, `data`, `pagination`      |
| `CommandPalette` | Cmd+K palette               | `items`, `onSelect`                  |

## Component Props Pattern

### Interface Definition

```typescript
// Selalu gunakan interface untuk props
interface ComponentNameProps {
  /** Deskripsi props untuk docs */
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Callback saat diklik */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
}
```

### Variant Pattern

```tsx
// Gunakan variant pattern untuk different looks
const variantStyles = {
  default: "bg-white text-gray-900",
  primary: "bg-blue-600 text-white",
  secondary: "bg-gray-100 text-gray-900",
  ghost: "bg-transparent hover:bg-gray-100",
  danger: "bg-red-600 text-white",
};
```

### Size Pattern

```tsx
const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};
```

## Component Composition

### Compound Components

```tsx
// Compound component pattern
interface CardCompound {
  Root: typeof CardRoot;
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

export const Card: CardCompound = ({ children }) => (
  <div className="rounded-lg border bg-white shadow">{children}</div>
);

Card.Root = function CardRoot({ children }) {
  return <div className="rounded-lg border bg-white shadow">{children}</div>;
};

Card.Header = function CardHeader({ children, className }) {
  return <div className="border-b p-4">{children}</div>;
};

Card.Body = function CardBody({ children, className }) {
  return <div className="p-4">{children}</div>;
};

Card.Footer = function CardFooter({ children, className }) {
  return <div className="border-t p-4">{children}</div>;
};
```

### Render Props

```tsx
// Render props pattern untuk flexibility
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

function List<T>({ items, renderItem, renderEmpty }: ListProps<T>) {
  if (items.length === 0) {
    return renderEmpty?.() ?? null;
  }
  return <>{items.map(renderItem)}</>;
}
```

## Responsive Props

```tsx
interface ResponsiveProps {
  /** Hidden on mobile, visible on desktop */
  hideOnMobile?: boolean;
  /** Visible on mobile, hidden on desktop */
  showOnMobile?: "block" | "flex" | "grid";
  /** Responsive columns */
  columns?: number | { base: number; md: number; lg: number };
}
```
