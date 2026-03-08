# Finance Dashboard Example

Contoh implementasi dashboard keuangan dengan design preset Finance.

## Design System Configuration

```json
{
  "preset": "finance",
  "colors": {
    "primary": "#0F172A",
    "accent": "#10B981",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "text": {
      "primary": "#0F172A",
      "secondary": "#64748B"
    }
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headings": {
      "h1": "2.25rem / 700",
      "h2": "1.875rem / 600",
      "h3": "1.25rem / 600"
    }
  },
  "layout": {
    "sidebar": {
      "width": "280px",
      "collapsed": "80px"
    },
    "container": "max-w-7xl"
  }
}
```

## Component Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── page.tsx            # Main dashboard
│   ├── analytics/
│   │   └── page.tsx        # Analytics page
│   └── transactions/
│       └── page.tsx        # Transactions page
└── components/
    ├── layout/
    │   ├── Sidebar.tsx
    │   ├── Header.tsx
    │   └── StatsCard.tsx
    ├── charts/
    │   ├── RevenueChart.tsx
    │   ├── ExpensePieChart.tsx
    │   └── TrendLineChart.tsx
    └── widgets/
        ├── RecentTransactions.tsx
        ├── BudgetOverview.tsx
        └── QuickActions.tsx
```

## Key Components

### Sidebar Navigation

```tsx
// components/layout/Sidebar.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
  { label: "Transactions", href: "/transactions", icon: <TransactionsIcon /> },
  { label: "Analytics", href: "/analytics", icon: <AnalyticsIcon /> },
  { label: "Accounts", href: "/accounts", icon: <AccountsIcon /> },
  { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-slate-900 text-white transition-all duration-300",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-emerald-400">FinanceHub</span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
```

### Stats Card

```tsx
// components/layout/StatsCard.tsx
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatsCardProps) {
  const changeColors = {
    positive: "text-emerald-500",
    negative: "text-red-500",
    neutral: "text-slate-500",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      </div>
      <div className="mt-4">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {change && (
          <span className={cn("ml-2 text-sm", changeColors[changeType])}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
```

### Revenue Chart

```tsx
// components/charts/RevenueChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
];

export function RevenueChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Revenue Overview
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981" }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: "#EF4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### Transaction Table

```tsx
// components/widgets/RecentTransactions.tsx
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  category: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Salary Deposit",
    amount: 5000,
    date: "2024-01-15",
    status: "completed",
    category: "Income",
  },
  {
    id: "2",
    description: "Grocery Store",
    amount: -156.32,
    date: "2024-01-14",
    status: "completed",
    category: "Food",
  },
  {
    id: "3",
    description: "Electric Bill",
    amount: -89.99,
    date: "2024-01-13",
    status: "completed",
    category: "Utilities",
  },
  {
    id: "4",
    description: "Freelance Work",
    amount: 1200,
    date: "2024-01-12",
    status: "pending",
    category: "Income",
  },
  {
    id: "5",
    description: "Internet Bill",
    amount: -59.99,
    date: "2024-01-11",
    status: "completed",
    category: "Utilities",
  },
];

const statusColors = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

export function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Transactions
        </h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">
                  {tx.description}
                </div>
                <div className="text-sm text-slate-500">{tx.category}</div>
              </td>
              <td
                className={`px-6 py-4 font-medium ${tx.amount >= 0 ? "text-emerald-600" : "text-slate-900"}`}
              >
                {tx.amount >= 0 ? "+" : ""}
                {tx.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[tx.status]}`}
                >
                  {tx.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Dashboard Page Implementation

```tsx
// app/(dashboard)/page.tsx
import { StatsCard } from "@/components/layout/StatsCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { RecentTransactions } from "@/components/widgets/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Balance"
          value="$24,562.00"
          change="+12.5%"
          changeType="positive"
          icon={<WalletIcon />}
        />
        <StatsCard
          title="Monthly Income"
          value="$8,450.00"
          change="+8.2%"
          changeType="positive"
          icon={<TrendingUpIcon />}
        />
        <StatsCard
          title="Monthly Expenses"
          value="$3,210.00"
          change="-5.1%"
          changeType="negative"
          icon={<TrendingDownIcon />}
        />
        <StatsCard
          title="Savings Rate"
          value="62%"
          change="+2.3%"
          changeType="positive"
          icon={<PiggyBankIcon />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart />
        <ExpensePieChart />
      </div>

      {/* Transactions */}
      <RecentTransactions />
    </div>
  );
}
```

## Color Palette

| Token        | Hex       | Usage                            |
| ------------ | --------- | -------------------------------- |
| `primary`    | `#0F172A` | Headers, primary text            |
| `accent`     | `#10B981` | Success states, positive numbers |
| `warning`    | `#F59E0B` | Pending states, warnings         |
| `error`      | `#EF4444` | Errors, negative numbers         |
| `surface`    | `#FFFFFF` | Card backgrounds                 |
| `background` | `#F8FAFC` | Page background                  |
| `border`     | `#E2E8F0` | Borders, dividers                |

## Best Practices

1. **Data-focused design** - Use clear hierarchy untuk financial data
2. **Consistent spacing** - 8px grid system
3. **Color coding** - Green for positive, Red for negative
4. **Responsive tables** - Horizontal scroll on mobile
5. **Loading states** - Skeleton loaders for async data
