# DataTable V2 — Architecture & Developer Guide

> A fully-featured, headless-first data table built on **TanStack Table v8**, powered by a **React Context + `useReducer`** state machine, with a JSON-Logic filter engine and optional server-side mode.

---

## Table of Contents

1. [Package Dependencies](#1-package-dependencies)
2. [Directory Structure](#2-directory-structure)
3. [Architecture Overview](#3-architecture-overview)
4. [The State Machine — Reducer](#4-the-state-machine--reducer)
   - [DataTableState](#datatablestate)
   - [DataTableAction (all 20 actions)](#datatableaction-all-20-actions)
   - [dataTableReducer](#datatablereducer)
   - [createInitialState](#createinitialstate)
5. [The Context — DataTableProvider](#5-the-context--datatableprovider)
   - [What the Provider builds](#what-the-provider-builds)
   - [processedData (client-side filtering pipeline)](#processeddata-client-side-filtering-pipeline)
   - [dispatchWithCallbacks](#dispatchwithcallbacks)
   - [TanStack Table instance](#tanstack-table-instance)
   - [computed values](#computed-values)
   - [contextValue — what every consumer receives](#contextvalue--what-every-consumer-receives)
6. [How Context + Reducer Work Together (step-by-step)](#6-how-context--reducer-work-together-step-by-step)
7. [The Filter Engine](#7-the-filter-engine)
   - [react-querybuilder → JSON Logic → json-logic-js](#react-querybuilder--json-logic--json-logic-js)
   - [Custom operators](#custom-operators)
8. [Client vs Server Mode](#8-client-vs-server-mode)
9. [Context Hooks API](#9-context-hooks-api)
10. [DataTableV2WithContext — the ready-to-use component](#10-datatablev2withcontext--the-ready-to-use-component)
11. [Quick Usage Examples](#11-quick-usage-examples)
12. [Data Flow Diagram](#12-data-flow-diagram)

---

## 1. Package Dependencies

| Package                                                  | Purpose                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `@tanstack/react-table`                                  | Core headless table — sorting, pagination, filter, visibility, selection |
| `react-querybuilder`                                     | Visual query builder UI + `RuleGroupType` format                         |
| `json-logic-js`                                          | Applies JSON Logic rules to JS objects client-side                       |
| `@dnd-kit/core` `@dnd-kit/sortable` `@dnd-kit/utilities` | Drag-and-drop handles in the QueryBuilder UI                             |
| `date-fns`                                               | Date utilities used by relative-date filter operators                    |

Install:

```bash
npm install @tanstack/react-table react-querybuilder json-logic-js \
  @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D @types/json-logic-js
```

---

## 2. Directory Structure

```
data-table-v2/
├── DataTableV2WithContext.tsx   ← Ready-to-drop-in component (wraps Provider + all UI)
├── index.ts                     ← Public barrel exports
│
├── context/                     ← The brain of the system
│   ├── DataTableContext.tsx      ← React.createContext + DataTableProvider
│   ├── reducer.ts                ← useReducer reducer + createInitialState
│   ├── types.ts                  ← DataTableState, DataTableAction, DataTableContextValue
│   ├── hooks.ts                  ← useDataTableContext (safe hook)
│   └── index.ts
│
├── constants/
│   └── defaults.ts               ← DEFAULT_QUERY, DEFAULT_PAGINATION, DEFAULT_CONFIG …
│
├── engine/                       ← Filter logic
│   ├── filterEngine.ts           ← queryToJsonLogic, applyFilter, createTableFilterFn
│   └── converters/index.ts       ← react-querybuilder → JSON Logic converters
│
├── filters/
│   ├── fieldConfig.ts            ← Generates fields[] from ColumnDef metadata
│   ├── operatorConfig.ts         ← Operator list + relative-date helpers
│   ├── QueryBuilderFilter/       ← Advanced filter panel (react-querybuilder + shadcn UI)
│   └── SimpleFilter/             ← Simpler single-field filter panel
│
├── ui/
│   ├── Table.tsx                 ← DataTableCore — renders <table> from TanStack table
│   ├── Pagination.tsx            ← Page controls
│   ├── ColumnHeader.tsx          ← Sortable column headers
│   └── ColumnVisibility.tsx      ← Column show/hide dropdown
│
├── components/
│   ├── toolbar/                  ← Toolbar, QuickSearch, FilterButton, ColumnVisibilityDropdown
│   ├── EmptyState.tsx
│   ├── LoadingState.tsx
│   └── ErrorBoundary.tsx
│
├── hooks/                        ← Convenience hooks that read from context
│   ├── useDataTableV2.ts
│   ├── useTableFiltering.ts
│   ├── useTablePagination.ts
│   ├── useTableSorting.ts
│   ├── useTableSelection.ts
│   └── useDebouncedValue.ts
│
├── utils/
│   └── createSelectionColumn.tsx ← Helper to build checkbox selection column
│
└── table-types/                  ← Re-exported TanStack types (SortingState etc.)
```

---

## 3. Architecture Overview

```
┌────────────────────────── DataTableProvider ──────────────────────────┐
│                                                                         │
│  useReducer(dataTableReducer, createInitialState())                    │
│       │                                                                 │
│       ▼                                                                 │
│  DataTableState ──────────────────────────────────────────────────►   │
│   ├─ query (RuleGroupType)          Client-side filter pipeline        │
│   ├─ globalFilter (string)          processedData = applyFilter(data)  │
│   ├─ sorting []                          │                              │
│   ├─ pagination { pageIndex, pageSize }  │                              │
│   ├─ columnVisibility {}                 ▼                              │
│   ├─ rowSelection {}             useReactTable({                        │
│   └─ isFilterPanelOpen              data: processedData,               │
│                                     state: { sorting, pagination … }   │
│  dispatch ──────────────────────►   onSortingChange → dispatch         │
│  (wrapped in dispatchWithCallbacks) onPaginationChange → dispatch      │
│                                  })                                     │
│                                                                         │
│  Context value exposed to all children:                                │
│   { state, dispatch, table, config, computed, fields }                 │
└─────────────────────────────────────────────────────────────────────────┘
          ▲                 ▲                  ▲
          │                 │                  │
     Toolbar           DataTableCore       Pagination
  (reads state,      (reads table)        (reads state
   dispatches)                             + table)
```

The key insight: **a single `DataTableState` is the source of truth**, managed by a pure reducer. TanStack Table is a _subscriber_ — it receives state slices and fires callbacks that loop back through `dispatch`.

---

## 4. The State Machine — Reducer

### DataTableState

Defined in `context/types.ts`:

```typescript
interface DataTableState {
  query: RuleGroupType; // Advanced QueryBuilder filter tree
  sorting: SortingState; // Array of { id, desc }
  pagination: PaginationState; // { pageIndex, pageSize }
  columnVisibility: VisibilityState; // { [columnId]: boolean }
  rowSelection: Record<string, boolean>; // { [rowIndex]: boolean }
  globalFilter: string; // Quick search input value
  isFilterPanelOpen: boolean; // Whether the filter panel drawer is open
}
```

All seven fields together describe the _entire observable state_ of the table. Nothing is stored anywhere else.

### DataTableAction (all 20 actions)

Every possible mutation is described as a discriminated union:

| Action Type                | Payload                  | What it does                                           |
| -------------------------- | ------------------------ | ------------------------------------------------------ |
| `SET_QUERY`                | `RuleGroupType`          | Replace the entire filter query tree; resets page to 0 |
| `SET_GLOBAL_FILTER`        | `string`                 | Update quick-search; resets page to 0                  |
| `SET_SORTING`              | `SortingState`           | Replace sorting array                                  |
| `SET_PAGINATION`           | `PaginationState`        | Replace full pagination object                         |
| `SET_PAGE_INDEX`           | `number`                 | Jump to a specific page                                |
| `SET_PAGE_SIZE`            | `number`                 | Change rows per page; resets to page 0                 |
| `SET_COLUMN_VISIBILITY`    | `VisibilityState`        | Replace visibility map                                 |
| `TOGGLE_COLUMN_VISIBILITY` | `{ columnId, visible }`  | Show/hide a single column                              |
| `SET_ROW_SELECTION`        | `Record<string,boolean>` | Replace entire selection map                           |
| `TOGGLE_ROW_SELECTION`     | `string` (rowId)         | Flip selection of one row                              |
| `SELECT_ALL_ROWS`          | `boolean`                | Select or deselect all                                 |
| `TOGGLE_FILTER_PANEL`      | —                        | Open ↔ close filter panel                              |
| `OPEN_FILTER_PANEL`        | —                        | Force-open filter panel                                |
| `CLOSE_FILTER_PANEL`       | —                        | Force-close filter panel                               |
| `RESET_FILTERS`            | —                        | Clear query + globalFilter, reset to page 0            |
| `RESET_SORTING`            | —                        | Back to default sort                                   |
| `RESET_PAGINATION`         | —                        | Back to page 0, default page size                      |
| `RESET_COLUMN_VISIBILITY`  | —                        | Show all columns                                       |
| `RESET_ROW_SELECTION`      | —                        | Deselect all rows                                      |
| `RESET_ALL`                | —                        | Full state reset to defaults                           |

### dataTableReducer

Located in `context/reducer.ts`. It is a **pure function** — no side effects, no API calls:

```typescript
function dataTableReducer(
  state: DataTableState,
  action: DataTableAction,
): DataTableState {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
        pagination: { ...state.pagination, pageIndex: 0 }, // ← auto-reset page
      };

    case "SET_PAGE_SIZE":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageSize: action.payload,
          pageIndex: 0, // ← auto-reset page when page size changes
        },
      };

    case "TOGGLE_ROW_SELECTION": {
      const rowId = action.payload;
      return {
        ...state,
        rowSelection: {
          ...state.rowSelection,
          [rowId]: !state.rowSelection[rowId], // ← flip boolean
        },
      };
    }

    case "RESET_ALL":
      return {
        query: DEFAULT_QUERY,
        sorting: DEFAULT_SORTING,
        pagination: DEFAULT_PAGINATION,
        columnVisibility: DEFAULT_COLUMN_VISIBILITY,
        rowSelection: DEFAULT_ROW_SELECTION,
        globalFilter: "",
        isFilterPanelOpen: false,
      };

    // ... all other cases
  }
}
```

**Key design rules baked into the reducer:**

- Changing filters → page resets to 0 (UX: you never land on page 5 of a newly filtered result)
- Changing page size → page resets to 0
- Every case returns a **new object** (immutable updates)

### createInitialState

```typescript
function createInitialState(
  overrides?: Partial<DataTableState>,
): DataTableState {
  return {
    query: overrides?.query ?? DEFAULT_QUERY,
    sorting: overrides?.sorting ?? DEFAULT_SORTING,
    pagination: overrides?.pagination ?? DEFAULT_PAGINATION,
    columnVisibility: overrides?.columnVisibility ?? DEFAULT_COLUMN_VISIBILITY,
    rowSelection: overrides?.rowSelection ?? DEFAULT_ROW_SELECTION,
    globalFilter: overrides?.globalFilter ?? "",
    isFilterPanelOpen: false,
  };
}
```

Called once inside the Provider to construct the initial state, allowing `config.initialQuery`, `config.initialSorting` etc. to customize the starting point.

---

## 5. The Context — DataTableProvider

### What the Provider builds

`DataTableProvider` orchestrates five things in sequence:

```
1. Merge config (user config + DEFAULT_CONFIG)
2. createInitialState(config) → passed to useReducer
3. processedData = client-side filter pipeline (useMemo)
4. dispatchWithCallbacks = dispatch + external callbacks
5. table = useReactTable({ data: processedData, state: state, ... })
6. computed = derived booleans/counts
7. contextValue = { state, dispatch, table, config, computed, fields }
```

### processedData (client-side filtering pipeline)

Only runs in `filterMode: "client"`. In server mode it returns `data` as-is.

```typescript
const processedData = useMemo(() => {
  if (config.filterMode === "server") return data; // passthrough

  let result = data;

  // Step 1: Apply QueryBuilder filter tree via JSON Logic
  if (state.query.rules && state.query.rules.length > 0) {
    result = applyFilter(result, state.query);
    //        ↑ converts RuleGroupType → JSON Logic → runs json-logic-js
  }

  // Step 2: Apply global quick-search across ALL column values
  if (state.globalFilter?.trim()) {
    const searchTerm = state.globalFilter.toLowerCase().trim();
    result = result.filter((row) =>
      Object.values(row).some(
        (value) =>
          value != null && String(value).toLowerCase().includes(searchTerm),
      ),
    );
  }

  return result;
}, [data, state.query, state.globalFilter, config.filterMode]);
```

Both filters are applied **in memory** — no network call needed.

### dispatchWithCallbacks

A wrapper around `dispatch` that fires external callbacks (for server mode or analytics):

```typescript
const dispatchWithCallbacks = useCallback(
  (action: DataTableAction) => {
    dispatch(action); // always update internal state

    // Notify parent when relevant actions happen
    switch (action.type) {
      case "SET_QUERY":
        onFilterChange?.(action.payload);
        break;
      case "SET_SORTING":
        onSortingChange?.(action.payload);
        break;
      case "SET_PAGINATION":
        onPaginationChange?.(action.payload);
        break;
      case "SET_PAGE_INDEX":
        onPaginationChange?.({
          ...state.pagination,
          pageIndex: action.payload,
        });
        break;
      case "SET_PAGE_SIZE":
        onPaginationChange?.({ pageIndex: 0, pageSize: action.payload });
        break;
      case "SET_ROW_SELECTION":
        onRowSelectionChange?.(action.payload);
        break;
    }
  },
  [
    state.pagination,
    onFilterChange,
    onSortingChange,
    onPaginationChange,
    onRowSelectionChange,
  ],
);
```

The parent can react to filter/pagination changes to fetch from the server without needing to read internal state.

### TanStack Table instance

```typescript
const table = useReactTable({
  data: processedData, // ← already filtered by our engine in client mode
  columns,
  state: {
    sorting: state.sorting,
    pagination: state.pagination,
    columnVisibility: state.columnVisibility,
    rowSelection: state.rowSelection,
    // Note: no "globalFilter" here — we filter before passing to TanStack
  },

  // Server mode: tell TanStack "you don't control pagination/sorting"
  rowCount: config.filterMode === "server" ? totalRowCount : undefined,
  manualPagination: config.filterMode === "server",
  manualSorting: config.filterMode === "server",
  manualFiltering: true, // always true — we manage filtering ourselves

  // Models active only in client mode (TanStack would double-sort/page otherwise)
  getSortedRowModel:
    config.filterMode === "client" ? getSortedRowModel() : undefined,
  getPaginationRowModel:
    config.filterMode === "client" ? getPaginationRowModel() : undefined,
  getFilteredRowModel:
    config.filterMode === "client" ? getFilteredRowModel() : undefined,

  // When TanStack fires a change (user clicks sort header, page button), loop back → dispatch
  onSortingChange: (updater) => {
    const newSorting =
      typeof updater === "function" ? updater(state.sorting) : updater;
    dispatchWithCallbacks({ type: "SET_SORTING", payload: newSorting });
  },
  onPaginationChange: (updater) => {
    const newPagination =
      typeof updater === "function" ? updater(state.pagination) : updater;
    dispatchWithCallbacks({ type: "SET_PAGINATION", payload: newPagination });
  },
  // ... similar for visibility and row selection
});
```

### computed values

Derived values memoized separately to avoid re-rendering consumers that don't need them:

```typescript
const computed = useMemo(() => ({
  isFiltering:       state.query.rules && state.query.rules.length > 0,
  activeFilterCount: state.query.rules?.length ?? 0,
  pageCount:
    config.filterMode === "server" && totalRowCount !== undefined
      ? Math.ceil(totalRowCount / state.pagination.pageSize) // server mode
      : table.getPageCount(),                                // client mode
  selectedRows: table.getSelectedRowModel().rows.map((r) => r.original),
  processedData,
}), [...]);
```

### contextValue — what every consumer receives

```typescript
interface DataTableContextValue<TData> {
  state: DataTableState; // raw reducer state
  dispatch: React.Dispatch<DataTableAction>; // (wrapped with callbacks)
  table: Table<TData>; // TanStack table instance
  config: DataTableContextConfig; // merged config
  computed: {
    isFiltering: boolean;
    activeFilterCount: number;
    pageCount: number;
    selectedRows: TData[];
    processedData: TData[];
  };
  fields: FieldDef[]; // QueryBuilder field definitions
}
```

---

## 6. How Context + Reducer Work Together (step-by-step)

Here is the **complete lifecycle of a user clicking "Next Page"**:

```
1. User clicks ▶ (next page) in <Pagination />
   │
2. Pagination calls: dispatch({ type: "SET_PAGE_INDEX", payload: currentPage + 1 })
   │
3. dispatchWithCallbacks fires:
   ├─ dispatch(action)   → reducer runs
   │     case "SET_PAGE_INDEX":
   │       return { ...state, pagination: { ...state.pagination, pageIndex: 2 } }
   │     → React schedules re-render with new state
   │
   └─ onPaginationChange?.({ pageIndex: 2, pageSize: 10 })  ← notifies server if needed
   │
4. Provider re-renders:
   ├─ processedData stays the same (still same data + same query)
   ├─ table re-created with state.pagination.pageIndex = 2
   └─ computed.pageCount stays same
   │
5. <DataTableCore /> re-renders:
   └─ table.getRowModel() returns rows 20–29 (page 3 in 0-based index)
```

Here is the lifecycle of a user **applying an advanced filter**:

```
1. User builds rule in QueryBuilderFilter and hits "Apply"
   │
2. Component calls: dispatch({ type: "SET_QUERY", payload: newQuery })
   │
3. dispatchWithCallbacks:
   ├─ dispatch(action) → reducer:
   │     case "SET_QUERY":
   │       return {
   │         ...state,
   │         query: newQuery,
   │         pagination: { ...state.pagination, pageIndex: 0 }  ← reset!
   │       }
   │
   └─ onFilterChange?.(newQuery)  ← server mode: parent fetches with new filters
   │
4. Provider re-renders:
   ├─ processedData = applyFilter(data, newQuery)  ← JSON Logic runs
   │     queryToJsonLogic(newQuery) → { "and": [{ ">=": [{ "var": "age" }, 18] }] }
   │     data.filter(row => jsonLogic.apply(logic, row))
   │
   ├─ table = useReactTable({ data: filteredData, state: { pagination: { pageIndex: 0 } } })
   └─ computed.activeFilterCount = newQuery.rules.length
   │
5. All consumers re-render with filtered data at page 0
```

---

## 7. The Filter Engine

### react-querybuilder → JSON Logic → json-logic-js

The filter engine lives in `engine/`. It is a **three-layer pipeline**:

```
User builds rule in QueryBuilderFilter UI
        │
        ▼
RuleGroupType (react-querybuilder's tree format)
  {
    combinator: "and",
    rules: [
      { field: "age",  operator: ">=", value: "18" },
      { field: "name", operator: "contains", value: "Ali" }
    ]
  }
        │
        ▼  toJsonLogic() in converters/index.ts
JSON Logic object
  {
    "and": [
      { ">=": [{ "var": "age" },  18] },
      { "in": ["ali", { "var": "name" }] }
    ]
  }
        │
        ▼  jsonLogic.apply(logic, row)
true / false  per row
```

`formatQuery` from `react-querybuilder` does the heavy lifting. The custom `jsonLogicRuleProcessor` handles extended operators (like `isRelativeToToday`) that `formatQuery` doesn't know about natively.

### Custom operators

| Operator            | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `contains`          | String includes (case-insensitive)                                  |
| `doesNotContain`    | String does not include                                             |
| `beginsWith`        | String starts with                                                  |
| `endsWith`          | String ends with                                                    |
| `isRelativeToToday` | Date is within a relative window (e.g. "last 7 days", "this month") |
| `in`                | Value is in an array field                                          |
| `notIn`             | Value is not in an array field                                      |

Custom operators are registered into `json-logic-js` once via `registerJsonLogicOperators()` which is auto-called on module import.

---

## 8. Client vs Server Mode

Configure via `config.filterMode`:

| Setting                 | `"client"` (default)              | `"server"`                                   |
| ----------------------- | --------------------------------- | -------------------------------------------- |
| `processedData`         | Filtered in-memory via JSON Logic | Raw `data` prop (already filtered by server) |
| `manualPagination`      | `false` — TanStack paginates      | `true` — TanStack just displays              |
| `manualSorting`         | `false` — TanStack sorts          | `true` — parent must sort on fetch           |
| `rowCount`              | Not set (TanStack calculates)     | `totalRowCount` prop                         |
| `getSortedRowModel`     | Enabled                           | Disabled                                     |
| `getPaginationRowModel` | Enabled                           | Disabled                                     |
| Callbacks               | Informational only                | Required — used to refetch                   |

**Server mode usage:**

```tsx
<DataTableV2WithContext
  data={data} // current page data from API
  columns={columns}
  config={{ filterMode: "server" }}
  totalRowCount={500} // total records in DB
  onFilterChange={(query) => setApiFilters(query)}
  onSortingChange={(sort) => setApiSort(sort)}
  onPaginationChange={(page) => setApiPage(page)}
/>
```

---

## 9. Context Hooks API

Access context anywhere inside `DataTableProvider`:

```typescript
import { useDataTableContext } from "./context";

const MyComponent = () => {
  const { state, dispatch, table, computed } = useDataTableContext();

  // Read state
  console.log(state.pagination.pageIndex); // current page
  console.log(state.query.rules.length); // how many filters
  console.log(computed.activeFilterCount); // same thing
  console.log(computed.selectedRows); // typed array of selected TData

  // Dispatch actions
  dispatch({ type: "SET_PAGE_SIZE", payload: 20 });
  dispatch({ type: "RESET_ALL" });
  dispatch({ type: "SET_GLOBAL_FILTER", payload: "search term" });
  dispatch({ type: "TOGGLE_FILTER_PANEL" });

  // Use TanStack table directly
  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups();
};
```

Specialty hooks wrap common patterns:

```typescript
// useTableFiltering — get filter state + actions
const { query, globalFilter, isFiltering, setQuery, resetFilters } =
  useTableFiltering();

// useTablePagination — get pagination state + goto helpers
const { pageIndex, pageSize, pageCount, setPageIndex, setPageSize } =
  useTablePagination();

// useTableSorting — sorting state
const { sorting, setSorting } = useTableSorting();

// useTableSelection — row selection
const { selectedRows, toggleRowSelection, clearSelection } =
  useTableSelection();
```

---

## 10. DataTableV2WithContext — the ready-to-use component

Wraps `DataTableProvider` + all UI sub-components into a single drop-in:

```tsx
import { DataTableV2WithContext } from "@shared/components/data-table-v2";

<DataTableV2WithContext
  data={rows}
  columns={columns}
  // Feature toggles (all default to true)
  showToolbar={true}
  showQuickSearch={true}
  showAdvancedFilter={true}
  showColumnVisibility={true}
  showPagination={true}
  // Config
  config={{
    filterMode: "client", // or "server"
    defaultPageSize: 10,
    enableAdvancedFilter: true,
  }}
  // Loading / empty states
  isLoading={isFetching}
  emptyState={<p>No results found</p>}
  // Row interaction
  onRowClick={(row) => navigate(`/detail/${row.id}`)}
  // Server mode
  totalRowCount={500}
  onFilterChange={(q) => refetch({ filter: q })}
  onPaginationChange={(p) => refetch({ page: p.pageIndex })}
/>;
```

---

## 11. Quick Usage Examples

### Minimal client-side table

```tsx
const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "age", header: "Age" },
];

<DataTableV2WithContext data={users} columns={columns} />;
```

### Custom toolbar action

```tsx
<DataTableV2WithContext
  data={drivers}
  columns={columns}
  toolbarContent={
    <Button onClick={handleAddDriver}>
      <Plus className="me-2 h-4 w-4" /> Add Driver
    </Button>
  }
/>
```

### Selection with action

```tsx
const Inner = () => {
  const { computed } = useDataTableContext();
  return (
    <>
      {computed.selectedRows.length > 0 && (
        <Button onClick={() => deleteAll(computed.selectedRows)}>
          Delete {computed.selectedRows.length} selected
        </Button>
      )}
    </>
  );
};

<DataTableProvider data={drivers} columns={columns} enableRowSelection>
  <Inner />
</DataTableProvider>;
```

### Creating a selection column

```tsx
import { createSelectionColumn } from "@shared/components/data-table-v2/utils";

const columns = [
  createSelectionColumn<Driver>(),
  { accessorKey: "name", header: "Name" },
  // ...
];
```

---

## 12. Data Flow Diagram

```
Props (data, columns, config, totalRowCount, callbacks)
              │
              ▼
    ┌─── DataTableProvider ───────────────────────────────────────────┐
    │                                                                  │
    │  useReducer(dataTableReducer, createInitialState(config))       │
    │     ┌──────────────────────────────────────────────────┐        │
    │     │              DataTableState                       │        │
    │     │  query  sorting  pagination  visibility  selection│        │
    │     │  globalFilter  isFilterPanelOpen                 │        │
    │     └──────────────────────────────────────────────────┘        │
    │              │                    ▲                              │
    │              │ state              │ dispatch(action)             │
    │              ▼                    │                              │
    │     processedData (useMemo)    dispatchWithCallbacks             │
    │       applyFilter(data, query)    │    fires external callbacks  │
    │       + globalFilter search       │                              │
    │              │                    │                              │
    │              ▼                    │                              │
    │     useReactTable({              │                              │
    │       data: processedData,        │                              │
    │       state: { sorting, pagination, visibility, selection }      │
    │       onSortingChange ──────────►─┤                              │
    │       onPaginationChange ───────►─┤                              │
    │       onColumnVisibilityChange ──►┤                              │
    │       onRowSelectionChange ─────►─┘                              │
    │     })                                                           │
    │              │                                                   │
    │     Context: { state, dispatch, table, config, computed, fields }│
    └──────────────────────────────────────┬──────────────────────────┘
                                           │
              ┌────────────────────────────┼─────────────────────────┐
              ▼                            ▼                          ▼
         <Toolbar />                <DataTableCore />          <Pagination />
       reads: state.isFiltering    reads: table.getRowModel()  reads: computed.pageCount
       dispatches: TOGGLE_FILTER_PANEL   renders <tr> rows     dispatches: SET_PAGE_INDEX
       dispatches: SET_GLOBAL_FILTER
              │
              ▼
    <QueryBuilderFilter />
      reads: state.query, fields
      dispatches: SET_QUERY
```

---

_This document was auto-generated to match the current codebase. Update it when adding new actions, filter operators, or config options._
