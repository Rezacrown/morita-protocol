# SaaS Dashboard Example

Contoh implementasi dashboard SaaS dengan design preset SaaS - modern, minimal, bento grid.

## Design System Configuration

```json
{
  "preset": "saas",
  "colors": {
    "primary": "#6366F1",
    "primary-light": "#818CF8",
    "secondary": "#64748B",
    "accent": "#10B981",
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "text": {
      "primary": "#0F172A",
      "secondary": "#64748B",
      "muted": "#94A3B8"
    },
    "border": "#E2E8F0"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headings": {
      "h1": "2rem / 700",
      "h2": "1.5rem / 600",
      "h3": "1.125rem / 600"
    },
    "body": {
      "base": "1rem / 400",
      "small": "0.875rem / 400"
    }
  },
  "layout": {
    "bento": {
      "gap": "1.5rem",
      "radius": "1rem",
      "shadow": "0 1px 3px rgba(0,0,0,0.1)"
    }
  }
}
```

## Component Structure

```
app/
├── (app)/
│   ├── layout.tsx
│   ├── page.tsx           # Dashboard
│   ├── analytics/
│   │   └── page.tsx
│   ├── team/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── components/
    ├── layout/
    │   ├── AppSidebar.tsx
    │   ├── AppHeader.tsx
    │   └── CommandPalette.tsx
    ├── dashboard/
    │   ├── BentoGrid.tsx
    │   ├── MetricCard.tsx
    │   ├── ActivityFeed.tsx
    │   └── TeamMembers.tsx
    └── ui/
        ├── Avatar.tsx
        ├── Badge.tsx
        └── Progress.tsx
```

## Bento Grid Layout

```tsx
// components/dashboard/BentoGrid.tsx
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: React.ReactNode;
  /** Grid column span */
  colSpan?: 1 | 2 | 3 | 4;
  /** Grid row span */
  rowSpan?: 1 | 2;
  className?: string;
}

const colSpanClasses = {
  1: "col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-1 md:col-span-2 lg:col-span-3",
  4: "col-span-1 md:col-span-2 lg:col-span-4",
};

const rowSpanClasses = {
  1: "row-span-1",
  2: "row-span-1 md:row-span-2",
};

export function BentoItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
}: BentoItemProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
        "transition-all duration-200 hover:shadow-md hover:border-slate-200",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className,
      )}
    >
      {children}
    </div>
  );
}
```

## Metric Card

```tsx
// components/dashboard/MetricCard.tsx
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  trend?: Array<{ day: string; value: number }>;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
}: MetricCardProps) {
  const changeColors = {
    positive: "text-emerald-600 bg-emerald-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50",
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {change && (
          <span
            className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              changeColors[changeType],
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
```

## Dashboard Page Implementation

```tsx
// app/(app)/page.tsx
import { BentoGrid, BentoItem } from "@/components/dashboard/BentoGrid";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TeamMembers } from "@/components/dashboard/TeamMembers";
import { RecentDeals } from "@/components/dashboard/RecentDeals";

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid>
        {/* Row 1: Metrics */}
        <BentoItem>
          <MetricCard
            title="Total Revenue"
            value="$48,574"
            change="+12.5%"
            changeType="positive"
            icon={<DollarIcon />}
          />
        </BentoItem>

        <BentoItem>
          <MetricCard
            title="Active Users"
            value="2,847"
            change="+8.2%"
            changeType="positive"
            icon={<UsersIcon />}
          />
        </BentoItem>

        <BentoItem>
          <MetricCard
            title="Conversion Rate"
            value="3.24%"
            change="+2.1%"
            changeType="positive"
            icon={<TrendingIcon />}
          />
        </BentoItem>

        <BentoItem>
          <MetricCard
            title="Churn Rate"
            value="1.8%"
            change="-0.5%"
            changeType="positive"
            icon={<RefreshIcon />}
          />
        </BentoItem>

        {/* Row 2: Main Content */}
        <BentoItem colSpan={2} rowSpan={2}>
          <RevenueChart />
        </BentoItem>

        <BentoItem colSpan={2}>
          <ActivityFeed />
        </BentoItem>

        <BentoItem colSpan={2}>
          <RecentDeals />
        </BentoItem>

        <BentoItem colSpan={2}>
          <TeamMembers />
        </BentoItem>
      </BentoGrid>
    </div>
  );
}
```

## Team Members Component

```tsx
// components/dashboard/TeamMembers.tsx
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: "online" | "offline" | "away";
}

const members: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    avatar: "/avatars/sarah.jpg",
    role: "Product",
    status: "online",
  },
  {
    id: "2",
    name: "Alex Kim",
    email: "alex@company.com",
    avatar: "/avatars/alex.jpg",
    role: "Engineering",
    status: "online",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@company.com",
    avatar: "/avatars/mike.jpg",
    role: "Design",
    status: "away",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@company.com",
    avatar: "/avatars/emma.jpg",
    role: "Marketing",
    status: "offline",
  },
];

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-slate-400",
  away: "bg-amber-500",
};

export function TeamMembers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="relative">
              <Avatar src={member.avatar} alt={member.name} size="md" />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 truncate">
                {member.name}
              </div>
              <div className="text-sm text-slate-500 truncate">
                {member.email}
              </div>
            </div>

            <Badge variant="secondary">{member.role}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Command Palette

```tsx
// components/layout/CommandPalette.tsx
"use client";

import { useState, useEffect } from "react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b">
          <SearchIcon className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search commands..."
            className="flex-1 py-4 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-slate-100 px-1.5 font-mono text-xs text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-2 max-h-96 overflow-y-auto">
          {query ? (
            <CommandGroup
              title="Suggestions"
              items={[
                {
                  icon: <HomeIcon />,
                  label: "Go to Dashboard",
                  shortcut: "G D",
                },
                { icon: <UsersIcon />, label: "Team Members", shortcut: "G T" },
                { icon: <SettingsIcon />, label: "Settings", shortcut: "G S" },
              ]}
            />
          ) : (
            <>
              <CommandGroup
                title="Recent"
                items={[
                  {
                    icon: <FileIcon />,
                    label: "Marketing Report",
                    shortcut: "R",
                  },
                  { icon: <FileIcon />, label: "Q4 Analytics", shortcut: "R" },
                ]}
              />
              <CommandGroup
                title="Actions"
                items={[
                  { icon: <PlusIcon />, label: "New Project", shortcut: "N" },
                  { icon: <UploadIcon />, label: "Upload File", shortcut: "U" },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CommandGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ icon: React.ReactNode; label: string; shortcut?: string }>;
}) {
  return (
    <div className="mb-2">
      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">
        {title}
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-100 transition-colors"
        >
          <span className="text-slate-500">{item.icon}</span>
          <span className="flex-1 text-slate-700">{item.label}</span>
          {item.shortcut && (
            <kbd className="text-xs text-slate-400">{item.shortcut}</kbd>
          )}
        </button>
      ))}
    </div>
  );
}
```

## Sidebar Navigation

```tsx
// components/layout/AppSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: <HomeIcon /> },
  { name: "Analytics", href: "/analytics", icon: <ChartIcon /> },
  { name: "Customers", href: "/customers", icon: <UsersIcon /> },
  { name: "Products", href: "/products", icon: <PackageIcon /> },
  { name: "Settings", href: "/settings", icon: <SettingsIcon /> },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="h-16 flex items-center px-6">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="ml-3 text-lg font-semibold text-slate-900">
          SaaS App
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-slate-900 truncate">John Doe</div>
            <div className="text-xs text-slate-500 truncate">
              john@company.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

## Color Palette

| Token            | Hex       | Usage                   |
| ---------------- | --------- | ----------------------- |
| `primary`        | `#6366F1` | Buttons, links, accents |
| `primary-light`  | `#818CF8` | Hover states            |
| `secondary`      | `#64748B` | Secondary text          |
| `accent`         | `#10B981` | Success, positive       |
| `surface`        | `#FFFFFF` | Cards, panels           |
| `background`     | `#F8FAFC` | Page background         |
| `border`         | `#E2E8F0` | Borders                 |
| `text-primary`   | `#0F172A` | Headings                |
| `text-secondary` | `#64748B` | Body text               |

## Best Practices

1. **Bento grid** - Card-based modular layout
2. **Clean whitespace** - Generous padding
3. **Subtle shadows** - Soft depth
4. **Typography hierarchy** - Clear information structure
5. **Command palette** - Quick actions (⌘K)
6. **Responsive** - Mobile-first design
