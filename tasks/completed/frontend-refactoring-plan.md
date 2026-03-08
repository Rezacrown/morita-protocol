# Frontend Refactoring Plan - Morita Protocol

## Ringkasan Eksekutif

Dokumen ini berisi rencana refactoring frontend yang lebih fokus dan sederhana. Fokus utama adalah **memisahkan inline components** dari setiap page ke struktur yang terorganisir, dengan klasifikasi:

- **ui/** → компонент reusable untuk design system
- **modules/[nama-page]/** → komponen single-page yang tidak reusable

---

## Analisis Inline Components

### Page 1: Home [`page.tsx`](frontend/src/app/page.tsx)

**Inline Components yang ditemukan:**

| Component    | Line    | Type                 | Classification                |
| ------------ | ------- | -------------------- | ----------------------------- |
| `ProcessRow` | 198-224 | Process step display | `modules/home/ProcessRow.tsx` |
| `SpecRow`    | 226-235 | Specification row    | `ui/SpecRow.tsx`              |

**Struktur ProcessRow:**

```tsx
// attributes:
// - num: string (step number "01", "02", "03")
// - title: string (step title: "Encrypt", "Commit", "Reveal")
// - desc: string (step description)
// - Used 3x dalam section "Architecture of Privacy"
```

**Struktur SpecRow:**

```tsx
// attributes:
// - label: string
// - value: string
// - isMono?: boolean (untuk transaction hash dkk)
// - Used 5x di home + history/[id]/page.tsx
```

---

### Page 2: Create Invoice [`create/page.tsx`](frontend/src/app/create/page.tsx)

**Inline Components: NONE**

**Catatan:**

- Form fields langsung di page tanpa isolasi
- Status handling (idle/loading/success) di dalam page
- Form sections yang bisa diekstrak:
  - `InvoiceFormFields` (client, description, amount, wallet)
  - `InvoiceSuccessView` (url display + copy button)

---

### Page 3: History [`history/page.tsx`](frontend/src/app/history/page.tsx)

**Inline Components: NONE (tapi ada inline mock data)**

**Inline Mock Data:**
| Variable | Line | Type |
|----------|------|------|
| `MOCK_INVOICES` | 6-11 | Array of invoice objects |

**Elements yang bisa diekstrak:**
| Element | Line | Classification |
|---------|------|----------------|
| Filter section | 34-84 | `modules/history/InvoiceFilters.tsx` |
| Table header row | 88-94 | `modules/history/InvoiceTable.tsx` |
| Table data rows | 103-137 | `modules/history/InvoiceTable.tsx` |

---

### Page 4: Invoice Detail [`history/[id]/page.tsx`](frontend/src/app/history/[id]/page.tsx)

**Inline Components yang ditemukan:**

| Component | Line    | Type              | Classification            |
| --------- | ------- | ----------------- | ------------------------- |
| `SpecRow` | 108-115 | Specification row | `ui/SpecRow.tsx` (SHARED) |

**Catatan:**

- `SpecRow` sama dengan yang ada di home page → harus di-share
- Section layout yang bisa diekstrak:
  - Invoice header (title + id)
  - Status badge component

---

### Page 5: Pay Invoice [`pay/page.tsx`](frontend/src/app/pay/page.tsx)

**Inline Components:**

| Component           | Line  | Type                 | Classification                      |
| ------------------- | ----- | -------------------- | ----------------------------------- |
| `PayInvoiceContent` | 7-121 | Page content wrapper | `modules/pay/PayInvoiceContent.tsx` |

**Elements yang bisa diekstrak:**
| Element | Line | Classification |
|---------|------|----------------|
| Loading view | 37-43 | `modules/pay/PaymentLoadingView.tsx` |
| Paid view | 45-67 | `modules/pay/PaymentPaidView.tsx` |
| Invoice display | 69-120 | `modules/pay/InvoicePaymentCard.tsx` |

---

## Component Classification Summary

### UI Components (Reusable multi-page)

| Path                                                       | Used By             | Purpose                   |
| ---------------------------------------------------------- | ------------------- | ------------------------- |
| [`ui/SpecRow.tsx`](frontend/src/components/ui/SpecRow.tsx) | Home + History/[id] | Specification display row |
| `ui/Button.tsx`                                            | All pages           | Design system button      |
| `ui/Input.tsx`                                             | Create + History    | Form input                |

### Module Components (Single-page / non-reusable)

| Path                                                                                                     | Page         | Purpose                  |
| -------------------------------------------------------------------------------------------------------- | ------------ | ------------------------ |
| [`modules/home/ProcessRow.tsx`](frontend/src/components/modules/home/ProcessRow.tsx)                     | Home         | Process step display     |
| [`modules/home/ManifestoSection.tsx`](frontend/src/components/modules/home/ManifestoSection.tsx)         | Home         | Animated manifesto       |
| [`modules/home/FeatureSection.tsx`](frontend/src/components/modules/home/FeatureSection.tsx)             | Home         | Specs/features display   |
| [`modules/create/InvoiceForm.tsx`](frontend/src/components/modules/create/InvoiceForm.tsx)               | Create       | Invoice creation form    |
| [`modules/history/InvoiceFilters.tsx`](frontend/src/components/modules/history/InvoiceFilters.tsx)       | History      | Filter + search controls |
| [`modules/history/InvoiceTable.tsx`](frontend/src/components/modules/history/InvoiceTable.tsx)           | History      | Invoice list display     |
| [`modules/history/InvoiceDetailCard.tsx`](frontend/src/components/modules/history/InvoiceDetailCard.tsx) | History/[id] | Invoice detail view      |
| [`modules/pay/PaymentFlow.tsx`](frontend/src/components/modules/pay/PaymentFlow.tsx)                     | Pay          | Payment process flow     |

---

## Struktur Target

```
frontend/src/
├── components/
│   ├── ui/                    # Reusable design system
│   │   ├── SpecRow.tsx        # ← SPECIFIC: Spec display row
│   │   ├── Button.tsx         # Design system button
│   │   ├── Input.tsx          # Form input
│   │   ├── Textarea.tsx       # Form textarea
│   │   ├── Badge.tsx          # Status badge
│   │   └── index.ts           # Barrel export
│   │
│   ├── modules/               # Single-page components
│   │   ├── home/              # Home page components
│   │   │   ├── ManifestoSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   └── FeatureSection.tsx
│   │   ├── create/            # Create page components
│   │   │   └── InvoiceForm.tsx
│   │   ├── history/           # History page components
│   │   │   ├── InvoiceFilters.tsx
│   │   │   ├── InvoiceTable.tsx
│   │   │   └── InvoiceDetailCard.tsx
│   │   └── pay/               # Pay page components
│   │       ├── PaymentLoadingView.tsx
│   │       ├── PaymentPaidView.tsx
│   │       └── InvoicePaymentCard.tsx
│   │
│   └── shared/                # Shared layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── app/                       # Pages (thin wrappers)
│   ├── page.tsx
│   ├── create/page.tsx
│   ├── history/page.tsx
│   ├── history/[id]/page.tsx
│   └── pay/page.tsx
│
├── lib/                       # Utilities
│   ├── types/                 # TypeScript types
│   ├── constants/             # App constants
│   └── utils.ts               # Utility functions
│
└── hooks/                     # Custom hooks
```

---

## Task List Per Page

### Task Group 1: UI Components (Foundation)

| #   | Task                            | File                         | Classification |
| --- | ------------------------------- | ---------------------------- | -------------- |
| 1.1 | Create `ui/SpecRow.tsx`         | `components/ui/SpecRow.tsx`  | **ui/**        |
| 1.2 | Create `ui/Button.tsx`          | `components/ui/Button.tsx`   | **ui/**        |
| 1.3 | Create `ui/Input.tsx`           | `components/ui/Input.tsx`    | **ui/**        |
| 1.4 | Create `ui/Textarea.tsx`        | `components/ui/Textarea.tsx` | **ui/**        |
| 1.5 | Create `ui/Badge.tsx`           | `components/ui/Badge.tsx`    | **ui/**        |
| 1.6 | Create `components/ui/index.ts` | `components/ui/index.ts`     | barrel export  |

### Task Group 2: Home Page (`page.tsx`)

| #   | Task                                                              | Classification    | Dependencies  |
| --- | ----------------------------------------------------------------- | ----------------- | ------------- |
| 2.1 | Create `modules/home/ManifestoSection.tsx`                        | **modules/home/** | None          |
| 2.2 | Create `modules/home/ProcessSection.tsx`<br>(includes ProcessRow) | **modules/home/** | 1.1           |
| 2.3 | Create `modules/home/FeatureSection.tsx`<br>(includes SpecRow)    | **modules/home/** | 1.1, 1.5      |
| 2.4 | Refactor `app/page.tsx` to compose components                     | **app/**          | 2.1, 2.2, 2.3 |

### Task Group 3: Create Page (`create/page.tsx`)

| #   | Task                                              | Classification      | Dependencies  |
| --- | ------------------------------------------------- | ------------------- | ------------- |
| 3.1 | Create `modules/create/InvoiceForm.tsx`           | **modules/create/** | 1.2, 1.3, 1.4 |
| 3.2 | Refactor `app/create/page.tsx` to use InvoiceForm | **app/**            | 3.1           |

### Task Group 4: History Page (`history/page.tsx`)

| #   | Task                                              | Classification       | Dependencies |
| --- | ------------------------------------------------- | -------------------- | ------------ |
| 4.1 | Create `modules/history/InvoiceFilters.tsx`       | **modules/history/** | 1.2, 1.3     |
| 4.2 | Create `modules/history/InvoiceTable.tsx`         | **modules/history/** | 1.1, 1.5     |
| 4.3 | Refactor `app/history/page.tsx` to use components | **app/**             | 4.1, 4.2     |

### Task Group 5: History Detail Page (`history/[id]/page.tsx`)

| #   | Task                                                   | Classification       | Dependencies |
| --- | ------------------------------------------------------ | -------------------- | ------------ |
| 5.1 | Create `modules/history/InvoiceDetailCard.tsx`         | **modules/history/** | 1.1, 1.5     |
| 5.2 | Refactor `app/history/[id]/page.tsx` to use components | **app/**             | 5.1          |

### Task Group 6: Pay Page (`pay/page.tsx`)

| #   | Task                                          | Classification   | Dependencies  |
| --- | --------------------------------------------- | ---------------- | ------------- |
| 6.1 | Create `modules/pay/PaymentLoadingView.tsx`   | **modules/pay/** | None          |
| 6.2 | Create `modules/pay/PaymentPaidView.tsx`      | **modules/pay/** | 1.2           |
| 6.3 | Create `modules/pay/InvoicePaymentCard.tsx`   | **modules/pay/** | 1.3, 1.5      |
| 6.4 | Refactor `app/pay/page.tsx` to use components | **app/**         | 6.1, 6.2, 6.3 |

---

## Dependencies Graph

```
                    ┌─────────────────┐
                    │   1.1-1.6       │
                    │ (UI Components) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │ 2.1-2.3     │  │   3.1       │  │   4.1-4.2   │
     │ (Home)      │  │  (Create)   │  │  (History)  │
     └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
            │                │                │
            ▼                ▼                ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │   2.4       │  │   3.2       │  │   4.3       │
     │Refactor Home│  │RefactorCreate│  │RefactorHistory│
     └─────────────┘  └─────────────┘  └──────┬──────┘
                                              │
                                              ▼
                                     ┌─────────────┐
                                     │    5.1      │
                                     │ (Detail)    │
                                     └──────┬──────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │    5.2      │
                                     │Refactor Detail│
                                     └─────────────┘
```

---

## Execution Order

**Phase Foundation:**

1. Task 1.1 - 1.6 (UI Components)

**Phase Per Page:** 2. Task 2.1 - 2.4 (Home) 3. Task 3.1 - 3.2 (Create) 4. Task 4.1 - 4.3 (History) 5. Task 5.1 - 5.2 (Detail) 6. Task 6.1 - 6.4 (Pay)

---

## Benefits Summary

| Aspect                | Before                             | After                                           |
| --------------------- | ---------------------------------- | ----------------------------------------------- |
| **Inline Components** | 4 components tersebar di pages     | Centralized di folders                          |
| **Reusability**       | SpecRow di-copy, ProcessRow inline | SpecRow di `ui/`, ProcessRow di `modules/home/` |
| **Maintainability**   | Ubah SpecRow = edit 2 files        | Ubah SpecRow = edit 1 file                      |
| **Readability**       | Page files 200+ baris              | Page files < 50 baris (hanya compose)           |
| **Testing**           | Testing di page-level              | Unit test per component                         |

---

## Quick Wins

1. **SpecRow extraction** - paling sering digunakan (6x), impact tinggi
2. **InvoiceTable** - kompleksitas tinggi, cocok untuk isolation
3. **InvoiceForm** - banyak state management, lebih baik di module terpisah
