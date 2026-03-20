/**
 * Sample Columns for DataTableV2 Demo
 * Demonstrates all field variants and operators
 */

import { createColumnHelper, type Column } from "@tanstack/react-table";
import type { SampleDataRow } from "./sampleData";
import {
  statusOptions,
  departmentOptions,
  roleOptions,
  skillsOptions,
  tagsOptions,
} from "./sampleData";
import type { FieldVariant } from "../types";
import { ColumnHeader } from "../ui/ColumnHeader";
import { createSelectionColumn } from "../utils/createSelectionColumn";

const columnHelper = createColumnHelper<SampleDataRow>();

// Helper to create header with ColumnHeader component
function createHeader<T>(title: string) {
  return ({ column }: { column: Column<T, unknown> }) => (
    <ColumnHeader column={column} title={title} />
  );
}

/**
 * Complete column definitions testing all field variants
 */
export const sampleColumns = [
  // Selection column for row selection
  createSelectionColumn<SampleDataRow>(),

  // ID column - text variant
  columnHelper.accessor("id", {
    id: "id",
    header: createHeader<SampleDataRow>("ID"),
    meta: {
      label: "ID",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  // Text variant columns
  columnHelper.accessor("firstName", {
    id: "firstName",
    header: createHeader<SampleDataRow>("First Name"),
    meta: {
      label: "First Name",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
      // Text supports: =, !=, contains, beginsWith, endsWith, doesNotContain, null, notNull
    },
  }),

  columnHelper.accessor("lastName", {
    id: "lastName",
    header: createHeader<SampleDataRow>("Last Name"),
    meta: {
      label: "Last Name",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("email", {
    id: "email",
    header: createHeader<SampleDataRow>("Email"),
    cell: ({ getValue }) => (
      <a
        href={`mailto:${getValue()}`}
        className="text-blue-600 hover:underline"
      >
        {getValue()}
      </a>
    ),
    meta: {
      label: "Email",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("description", {
    id: "description",
    header: createHeader<SampleDataRow>("Description"),
    cell: ({ getValue }) => (
      <span className="max-w-xs truncate block" title={getValue()}>
        {getValue()}
      </span>
    ),
    meta: {
      label: "Description",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: false, // Long text usually not sorted
    },
    enableSorting: false,
  }),

  // Number variant columns
  columnHelper.accessor("age", {
    id: "age",
    header: createHeader<SampleDataRow>("Age"),
    meta: {
      label: "Age",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
      // Number supports: =, !=, <, >, <=, >=, between, notBetween, null, notNull
    },
  }),

  columnHelper.accessor("salary", {
    id: "salary",
    header: createHeader<SampleDataRow>("Salary"),
    cell: ({ getValue }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(getValue()),
    meta: {
      label: "Salary",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("rating", {
    id: "rating",
    header: createHeader<SampleDataRow>("Rating"),
    cell: ({ getValue }) => {
      const rating = getValue();
      return (
        <div className="flex items-center gap-1">
          <span>{rating}</span>
          <span className="text-yellow-500">★</span>
        </div>
      );
    },
    meta: {
      label: "Rating",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("score", {
    id: "score",
    header: createHeader<SampleDataRow>("Score"),
    cell: ({ getValue }) => {
      const score = getValue();
      const color =
        score >= 80
          ? "text-green-600"
          : score >= 50
            ? "text-yellow-600"
            : "text-red-600";
      return <span className={color}>{score}%</span>;
    },
    meta: {
      label: "Score",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  // Range variant (progress bar)
  columnHelper.accessor("progress", {
    id: "progress",
    header: createHeader<SampleDataRow>("Progress"),
    cell: ({ getValue }) => {
      const progress = getValue();
      return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    },
    meta: {
      label: "Progress",
      variant: "range" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  // Date variant columns
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: createHeader<SampleDataRow>("Created At"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Created At",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
      // Date supports: =, !=, <, >, <=, >=, between, notBetween, isRelativeToToday, null, notNull
    },
  }),

  columnHelper.accessor("updatedAt", {
    id: "updatedAt",
    header: createHeader<SampleDataRow>("Updated At"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Updated At",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("birthDate", {
    id: "birthDate",
    header: createHeader<SampleDataRow>("Birth Date"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Birth Date",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("hireDate", {
    id: "hireDate",
    header: createHeader<SampleDataRow>("Hire Date"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Hire Date",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  // Select variant columns
  columnHelper.accessor("status", {
    id: "status",
    header: createHeader<SampleDataRow>("Status"),
    cell: ({ getValue }) => {
      const status = getValue();
      const colors: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        pending: "bg-yellow-100 text-yellow-800",
        suspended: "bg-red-100 text-red-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || ""}`}
        >
          {status}
        </span>
      );
    },
    meta: {
      label: "Status",
      variant: "select" as FieldVariant,
      filterable: true,
      sortable: true,
      filterOptions: statusOptions,
      // Select supports: =, !=, in, notIn, null, notNull
    },
  }),

  columnHelper.accessor("department", {
    id: "department",
    header: createHeader<SampleDataRow>("Department"),
    cell: ({ getValue }) => {
      const dept = getValue();
      return <span className="capitalize">{dept}</span>;
    },
    meta: {
      label: "Department",
      variant: "select" as FieldVariant,
      filterable: true,
      sortable: true,
      filterOptions: departmentOptions,
    },
  }),

  columnHelper.accessor("role", {
    id: "role",
    header: createHeader<SampleDataRow>("Role"),
    cell: ({ getValue }) => {
      const role = getValue();
      const icons: Record<string, string> = {
        admin: "👑",
        manager: "👔",
        employee: "👤",
        intern: "🎓",
      };
      return (
        <span>
          {icons[role]} {role}
        </span>
      );
    },
    meta: {
      label: "Role",
      variant: "select" as FieldVariant,
      filterable: true,
      sortable: true,
      filterOptions: roleOptions,
    },
  }),

  // Multi-select variant columns
  columnHelper.accessor("skills", {
    id: "skills",
    header: createHeader<SampleDataRow>("Skills"),
    cell: ({ getValue }) => {
      const skills = getValue();
      return (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-gray-500 text-xs">+{skills.length - 3}</span>
          )}
        </div>
      );
    },
    meta: {
      label: "Skills",
      variant: "multiSelect" as FieldVariant,
      filterable: true,
      sortable: false, // Arrays usually not sorted directly
      filterOptions: skillsOptions,
      // MultiSelect supports: in, notIn, contains, doesNotContain
    },
    enableSorting: false,
  }),

  columnHelper.accessor("tags", {
    id: "tags",
    header: createHeader<SampleDataRow>("Tags"),
    cell: ({ getValue }) => {
      const tags = getValue();
      if (tags.length === 0)
        return <span className="text-gray-400">No tags</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      );
    },
    meta: {
      label: "Tags",
      variant: "multiSelect" as FieldVariant,
      filterable: true,
      sortable: false,
      filterOptions: tagsOptions,
    },
    enableSorting: false,
  }),

  // Boolean variant columns
  columnHelper.accessor("isVerified", {
    id: "isVerified",
    header: createHeader<SampleDataRow>("Verified"),
    cell: ({ getValue }) => {
      const verified = getValue();
      return verified ? (
        <span className="text-green-600">✓ Verified</span>
      ) : (
        <span className="text-gray-400">✗ Unverified</span>
      );
    },
    meta: {
      label: "Verified",
      variant: "boolean" as FieldVariant,
      filterable: true,
      sortable: true,
      // Boolean supports: =, != (true/false)
    },
  }),

  columnHelper.accessor("isActive", {
    id: "isActive",
    header: createHeader<SampleDataRow>("Active"),
    cell: ({ getValue }) => {
      const active = getValue();
      return (
        <span
          className={`inline-block w-3 h-3 rounded-full ${active ? "bg-green-500" : "bg-gray-300"}`}
          title={active ? "Active" : "Inactive"}
        />
      );
    },
    meta: {
      label: "Active",
      variant: "boolean" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),

  columnHelper.accessor("hasSubscription", {
    id: "hasSubscription",
    header: createHeader<SampleDataRow>("Subscription"),
    cell: ({ getValue }) => {
      const hasSub = getValue();
      return hasSub ? (
        <span className="text-green-600 font-medium">PRO</span>
      ) : (
        <span className="text-gray-400">Free</span>
      );
    },
    meta: {
      label: "Has Subscription",
      variant: "boolean" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
];

/**
 * Minimal columns for basic demo
 */
export const minimalColumns = [
  createSelectionColumn<SampleDataRow>(),
  columnHelper.accessor("id", {
    id: "id",
    header: createHeader<SampleDataRow>("ID"),
    meta: {
      label: "ID",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("firstName", {
    id: "firstName",
    header: createHeader<SampleDataRow>("First Name"),
    meta: {
      label: "First Name",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("lastName", {
    id: "lastName",
    header: createHeader<SampleDataRow>("Last Name"),
    meta: {
      label: "Last Name",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("email", {
    id: "email",
    header: createHeader<SampleDataRow>("Email"),
    meta: {
      label: "Email",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: createHeader<SampleDataRow>("Status"),
    meta: {
      label: "Status",
      variant: "select" as FieldVariant,
      filterable: true,
      sortable: true,
      filterOptions: statusOptions,
    },
  }),
];

/**
 * Date-focused columns for testing date operators
 */
export const dateColumns = [
  createSelectionColumn<SampleDataRow>(),
  columnHelper.accessor("id", {
    id: "id",
    header: createHeader<SampleDataRow>("ID"),
    meta: {
      label: "ID",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("firstName", {
    id: "firstName",
    header: createHeader<SampleDataRow>("First Name"),
    meta: {
      label: "First Name",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: createHeader<SampleDataRow>("Created At"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Created At",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("updatedAt", {
    id: "updatedAt",
    header: createHeader<SampleDataRow>("Updated At"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Updated At",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("hireDate", {
    id: "hireDate",
    header: createHeader<SampleDataRow>("Hire Date"),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    meta: {
      label: "Hire Date",
      variant: "date" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
];

/**
 * Numeric-focused columns for testing number operators
 */
export const numericColumns = [
  createSelectionColumn<SampleDataRow>(),
  columnHelper.accessor("id", {
    id: "id",
    header: createHeader<SampleDataRow>("ID"),
    meta: {
      label: "ID",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("firstName", {
    id: "firstName",
    header: createHeader<SampleDataRow>("First Name"),
    meta: {
      label: "First Name",
      variant: "text" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("age", {
    id: "age",
    header: createHeader<SampleDataRow>("Age"),
    meta: {
      label: "Age",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("salary", {
    id: "salary",
    header: createHeader<SampleDataRow>("Salary"),
    cell: ({ getValue }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(getValue()),
    meta: {
      label: "Salary",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("rating", {
    id: "rating",
    header: createHeader<SampleDataRow>("Rating"),
    meta: {
      label: "Rating",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
  columnHelper.accessor("score", {
    id: "score",
    header: createHeader<SampleDataRow>("Score"),
    meta: {
      label: "Score",
      variant: "number" as FieldVariant,
      filterable: true,
      sortable: true,
    },
  }),
];
