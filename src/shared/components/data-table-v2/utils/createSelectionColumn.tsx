/**
 * Selection Column Factory
 * Creates a checkbox column for row selection in DataTableV2
 */

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";

export interface SelectionColumnOptions {
  /** Column ID */
  id?: string;
  /** Header checkbox: enable select all */
  enableSelectAll?: boolean;
  /** Additional class for the checkbox */
  className?: string;
}

/**
 * Creates a selection column with checkboxes for row selection
 *
 * @example
 * ```tsx
 * const columns = [
 *   createSelectionColumn(),
 *   // ...other columns
 * ];
 * ```
 */
export function createSelectionColumn<TData>(
  options: SelectionColumnOptions = {},
): ColumnDef<TData, unknown> {
  const { id = "select", enableSelectAll = true, className } = options;

  return {
    id,
    header: ({ table }) =>
      enableSelectAll ? (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className={className}
          />
        </div>
      ) : null,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className={className}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    meta: {
      label: "Select",
      filterable: false,
      sortable: false,
    },
  };
}

export default createSelectionColumn;
