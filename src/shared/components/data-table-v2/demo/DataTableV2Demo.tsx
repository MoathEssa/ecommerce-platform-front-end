/**
 * DataTableV2 Comprehensive Demo Component
 * Tests all features, operators, and configurations using the new Context-based implementation
 */

import { useState, useMemo, useCallback } from "react";
import type { RuleGroupType } from "react-querybuilder";
import type { ColumnDef } from "@tanstack/react-table";
import { formatQuery } from "react-querybuilder";
import { Download, RefreshCw } from "lucide-react";

// New Context-based Components
import { DataTableV2WithContext } from "../DataTableV2WithContext";
import {
  DataTableProvider,
  useDataTableContext,
  useDataTableState,
  useDataTableDispatch,
} from "../context";
import { DataTableCore } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Toolbar, EmptyState } from "../components";
import { QueryBuilderFilter } from "../filters/QueryBuilderFilter";
import { SimpleFilter } from "../filters/SimpleFilter/SimpleFilter";

// Sample data
import {
  sampleData,
  generateSampleData,
  type SampleDataRow,
} from "./sampleData";
import {
  sampleColumns,
  minimalColumns,
  dateColumns,
  numericColumns,
} from "./sampleColumns";

// Types and utilities
import type { FilterMode } from "../types";
import {
  toJsonLogic,
  toSql,
  toMongoDB,
  toSpEL,
  toCEL,
} from "../engine/converters";
import { allOperators } from "../filters/operatorConfig";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";

// ============================================================================
// Feature Toggles
// ============================================================================

interface FeatureToggles {
  enableAdvancedFilter: boolean;
  enableRowSelection: boolean;
  enableSorting: boolean;
  enablePagination: boolean;
  enableColumnVisibility: boolean;
  filterMode: FilterMode;
  showToolbar: boolean;
  showQuickSearch: boolean;
  showFilterPanel: boolean;
  showExportButtons: boolean;
  dataSize: number;
  columnSet: "full" | "minimal" | "dates" | "numbers";
}

const defaultToggles: FeatureToggles = {
  enableAdvancedFilter: true,
  enableRowSelection: true,
  enableSorting: true,
  enablePagination: true,
  enableColumnVisibility: true,
  filterMode: "client",
  showToolbar: true,
  showQuickSearch: true,
  showFilterPanel: true,
  showExportButtons: true,
  dataSize: 100,
  columnSet: "full",
};

// ============================================================================
// Custom Toolbar Component (demonstrates Context composability)
// ============================================================================

function CustomToolbarWithContext() {
  const { state, computed } = useDataTableContext<SampleDataRow>();
  const dispatch = useDataTableDispatch();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Global Filter:</span>{" "}
          <code className="bg-muted px-1 rounded">
            {state.globalFilter || "(none)"}
          </code>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Active Filters:</span>{" "}
          <Badge variant="secondary">{computed.activeFilterCount}</Badge>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Processed Rows:</span>{" "}
          <Badge variant="outline">{computed.processedData.length}</Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => dispatch({ type: "RESET_FILTERS" })}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => console.log("Export:", state)}
        >
          <Download className="h-4 w-4 mr-2" />
          Export State
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Composable Table Demo (shows DataTableProvider usage)
// ============================================================================

function ComposableTableDemo({
  data,
  columns,
}: {
  data: SampleDataRow[];
  columns: ColumnDef<SampleDataRow, unknown>[];
}) {
  return (
    <DataTableProvider
      data={data}
      columns={columns}
      config={{
        enableAdvancedFilter: true,
        defaultPageSize: 5,
      }}
      enableRowSelection={true}
    >
      <ComposableTableContent />
    </DataTableProvider>
  );
}

function ComposableTableContent() {
  const { table, state, dispatch, fields, computed } =
    useDataTableContext<SampleDataRow>();
  const tableState = useDataTableState();

  return (
    <div className="space-y-4">
      {/* Custom header showing context state */}
      <CustomToolbarWithContext />

      {/* Built-in toolbar */}
      <Toolbar
        table={table}
        globalFilter={state.globalFilter}
        onGlobalFilterChange={(value) =>
          dispatch({ type: "SET_GLOBAL_FILTER", payload: value })
        }
        isFilterPanelOpen={state.isFilterPanelOpen}
        onToggleFilterPanel={() => dispatch({ type: "TOGGLE_FILTER_PANEL" })}
        isFiltering={computed.isFiltering}
        activeFilterCount={computed.activeFilterCount}
        onClearFilters={() => dispatch({ type: "RESET_FILTERS" })}
        showQuickSearch={true}
        showAdvancedFilter={true}
        showColumnVisibility={true}
      />

      {/* Filter panel */}
      {state.isFilterPanelOpen && (
        <div className="rounded-lg border bg-card p-4">
          <QueryBuilderFilter
            fields={
              fields as Parameters<typeof QueryBuilderFilter>[0]["fields"]
            }
            query={state.query}
            onQueryChange={(query) =>
              dispatch({ type: "SET_QUERY", payload: query })
            }
          />
        </div>
      )}

      {/* Table */}
      <DataTableCore
        table={table}
        isLoading={false}
        emptyStateComponent={
          <EmptyState
            title="No results found"
            description="Try adjusting your filters"
          />
        }
      />

      {/* Pagination */}
      <Pagination table={table} />

      {/* State debug panel */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Debug: Current State
        </summary>
        <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-40">
          {JSON.stringify(
            {
              globalFilter: tableState.globalFilter,
              sorting: tableState.sorting,
              pagination: tableState.pagination,
              rulesCount: tableState.query.rules.length,
              isFilterPanelOpen: tableState.isFilterPanelOpen,
            },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  );
}

// ============================================================================
// Main Demo Component
// ============================================================================

export function DataTableV2Demo() {
  const [toggles, setToggles] = useState<FeatureToggles>(defaultToggles);
  const [standaloneQuery, setStandaloneQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });
  const [simpleQuery, setSimpleQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });

  // Generated data based on size
  const data = useMemo(() => {
    if (toggles.dataSize <= 100) return sampleData.slice(0, toggles.dataSize);
    return generateSampleData(toggles.dataSize);
  }, [toggles.dataSize]);

  // Columns based on selection
  const columns = useMemo(() => {
    switch (toggles.columnSet) {
      case "minimal":
        return minimalColumns;
      case "dates":
        return dateColumns;
      case "numbers":
        return numericColumns;
      default:
        return sampleColumns;
    }
  }, [toggles.columnSet]);

  // Update toggle helper
  const updateToggle = useCallback(
    <K extends keyof FeatureToggles>(key: K, value: FeatureToggles[K]) => {
      setToggles((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Export handler
  const handleExportJSON = useCallback(() => {
    const json = JSON.stringify(data.slice(0, 10), null, 2);
    console.log("Export JSON (first 10 rows):", json);
    alert("Check console for JSON export (first 10 rows)");
  }, [data]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">DataTableV2 Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demo using the new <strong>Context-based</strong>{" "}
          implementation
        </p>
        <div className="flex gap-2">
          <Badge>React Context + useReducer</Badge>
          <Badge variant="outline">TanStack Table</Badge>
          <Badge variant="secondary">react-querybuilder</Badge>
        </div>
      </div>

      <Tabs defaultValue="simple" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="simple">Simple Usage</TabsTrigger>
          <TabsTrigger value="composable">Composable</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="converters">Converters</TabsTrigger>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        {/* Simple Usage Tab - DataTableV2WithContext */}
        <TabsContent value="simple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DataTableV2WithContext</CardTitle>
              <CardDescription>
                Simple drop-in usage with all features included. Uses Context
                internally.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Controls Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>Enable/disable features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Core Features */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Core Features</h4>
                  <ToggleSwitch
                    id="enableAdvancedFilter"
                    label="Advanced Filter"
                    checked={toggles.enableAdvancedFilter}
                    onCheckedChange={(v) =>
                      updateToggle("enableAdvancedFilter", v)
                    }
                  />
                  <ToggleSwitch
                    id="enableRowSelection"
                    label="Row Selection"
                    checked={toggles.enableRowSelection}
                    onCheckedChange={(v) =>
                      updateToggle("enableRowSelection", v)
                    }
                  />
                  <ToggleSwitch
                    id="enablePagination"
                    label="Pagination"
                    checked={toggles.enablePagination}
                    onCheckedChange={(v) => updateToggle("enablePagination", v)}
                  />
                  <ToggleSwitch
                    id="enableColumnVisibility"
                    label="Column Visibility"
                    checked={toggles.enableColumnVisibility}
                    onCheckedChange={(v) =>
                      updateToggle("enableColumnVisibility", v)
                    }
                  />
                </div>

                <Separator />

                {/* UI Options */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">UI Options</h4>
                  <ToggleSwitch
                    id="showToolbar"
                    label="Show Toolbar"
                    checked={toggles.showToolbar}
                    onCheckedChange={(v) => updateToggle("showToolbar", v)}
                  />
                  <ToggleSwitch
                    id="showQuickSearch"
                    label="Quick Search"
                    checked={toggles.showQuickSearch}
                    onCheckedChange={(v) => updateToggle("showQuickSearch", v)}
                  />
                </div>

                <Separator />

                {/* Data Options */}
                <div className="space-y-2">
                  <Label>Data Size</Label>
                  <Select
                    value={String(toggles.dataSize)}
                    onValueChange={(v) => updateToggle("dataSize", parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 rows</SelectItem>
                      <SelectItem value="50">50 rows</SelectItem>
                      <SelectItem value="100">100 rows</SelectItem>
                      <SelectItem value="500">500 rows</SelectItem>
                      <SelectItem value="1000">1,000 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Column Set</Label>
                  <Select
                    value={toggles.columnSet}
                    onValueChange={(v) =>
                      updateToggle(
                        "columnSet",
                        v as FeatureToggles["columnSet"],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full (All variants)</SelectItem>
                      <SelectItem value="minimal">
                        Minimal (Text + Select)
                      </SelectItem>
                      <SelectItem value="dates">Date-focused</SelectItem>
                      <SelectItem value="numbers">Number-focused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <div className="lg:col-span-3">
              <DataTableV2WithContext<SampleDataRow>
                data={data}
                columns={columns as ColumnDef<SampleDataRow, unknown>[]}
                config={{
                  enableAdvancedFilter: toggles.enableAdvancedFilter,
                  filterMode:
                    toggles.filterMode === "none"
                      ? "client"
                      : toggles.filterMode,
                }}
                enableRowSelection={toggles.enableRowSelection}
                showToolbar={toggles.showToolbar}
                showQuickSearch={toggles.showQuickSearch}
                showPagination={toggles.enablePagination}
                showColumnVisibility={toggles.enableColumnVisibility}
                showAdvancedFilter={toggles.enableAdvancedFilter}
                onFilterChange={(query) => {
                  console.log("Filter changed:", query);
                  if (toggles.filterMode === "server") {
                    console.log("Server query (SQL):", toSql(query));
                  }
                }}
                onSortingChange={(sorting) => {
                  console.log("Sorting changed:", sorting);
                }}
                onPaginationChange={(pagination) => {
                  console.log("Pagination changed:", pagination);
                }}
                onRowClick={(row) => {
                  console.log("Row clicked:", row);
                }}
              />
            </div>
          </div>
        </TabsContent>

        {/* Composable Tab - DataTableProvider */}
        <TabsContent value="composable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Composable with DataTableProvider</CardTitle>
              <CardDescription>
                Build custom layouts by composing individual components with the
                Context provider. Access state via{" "}
                <code>useDataTableContext</code> hook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {`<DataTableProvider data={data} columns={columns} config={...}>
  <CustomToolbar />           {/* Access state via useDataTableContext */}
  <Toolbar table={table} />   {/* Built-in toolbar */}
  <QueryBuilderFilter />      {/* Filter panel */}
  <DataTableCore table={table} />
  <Pagination table={table} />
</DataTableProvider>`}
              </pre>
            </CardContent>
          </Card>

          <ComposableTableDemo
            data={data.slice(0, 20)}
            columns={columns as ColumnDef<SampleDataRow, unknown>[]}
          />
        </TabsContent>

        {/* Filter Demo Tab */}
        <TabsContent value="filters" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* QueryBuilder Filter */}
            <Card>
              <CardHeader>
                <CardTitle>QueryBuilder Filter</CardTitle>
                <CardDescription>
                  Advanced filter with react-querybuilder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <QueryBuilderFilter<SampleDataRow>
                  columns={columns as ColumnDef<SampleDataRow, unknown>[]}
                  query={standaloneQuery}
                  onQueryChange={setStandaloneQuery}
                />
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Query has {standaloneQuery.rules.length} rule(s)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Simple Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Simple Filter</CardTitle>
                <CardDescription>Single-field filter component</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SimpleFilter<SampleDataRow>
                  columns={
                    minimalColumns as ColumnDef<SampleDataRow, unknown>[]
                  }
                  query={simpleQuery}
                  onQueryChange={setSimpleQuery}
                  placeholder="Type to filter..."
                />
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Simple filter query: {JSON.stringify(simpleQuery.rules)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Query Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Query Preview</CardTitle>
              <CardDescription>
                Current query state from QueryBuilder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <pre className="text-xs">
                  {JSON.stringify(standaloneQuery, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Converters Tab */}
        <TabsContent value="converters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Query Converters</CardTitle>
              <CardDescription>
                Test formatQuery output for different formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <QueryBuilderFilter<SampleDataRow>
                  columns={columns as ColumnDef<SampleDataRow, unknown>[]}
                  query={standaloneQuery}
                  onQueryChange={setStandaloneQuery}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConverterOutput
                  title="JSON Logic"
                  value={JSON.stringify(toJsonLogic(standaloneQuery), null, 2)}
                />
                <ConverterOutput title="SQL" value={toSql(standaloneQuery)} />
                <ConverterOutput
                  title="MongoDB"
                  value={JSON.stringify(toMongoDB(standaloneQuery), null, 2)}
                />
                <ConverterOutput title="SpEL" value={toSpEL(standaloneQuery)} />
                <ConverterOutput title="CEL" value={toCEL(standaloneQuery)} />
                <ConverterOutput
                  title="Native formatQuery (json)"
                  value={formatQuery(standaloneQuery, "json")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operators Tab */}
        <TabsContent value="operators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Operators</CardTitle>
              <CardDescription>
                All operators supported by DataTableV2
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {allOperators.map((op) => (
                  <div key={op.name} className="p-2 border rounded text-sm">
                    <code className="font-mono text-xs">{op.name}</code>
                    <p className="text-muted-foreground text-xs mt-1">
                      {op.label}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h4 className="font-medium">Operators by Field Variant</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <VariantOperators
                    variant="text"
                    operators={[
                      "=",
                      "!=",
                      "contains",
                      "beginsWith",
                      "endsWith",
                      "doesNotContain",
                      "doesNotBeginWith",
                      "doesNotEndWith",
                      "null",
                      "notNull",
                    ]}
                  />
                  <VariantOperators
                    variant="number"
                    operators={[
                      "=",
                      "!=",
                      "<",
                      ">",
                      "<=",
                      ">=",
                      "between",
                      "notBetween",
                      "null",
                      "notNull",
                    ]}
                  />
                  <VariantOperators
                    variant="date"
                    operators={[
                      "=",
                      "!=",
                      "<",
                      ">",
                      "<=",
                      ">=",
                      "between",
                      "notBetween",
                      "isRelativeToToday",
                      "null",
                      "notNull",
                    ]}
                  />
                  <VariantOperators
                    variant="select"
                    operators={["=", "!=", "in", "notIn", "null", "notNull"]}
                  />
                  <VariantOperators
                    variant="multiSelect"
                    operators={["in", "notIn", "contains", "doesNotContain"]}
                  />
                  <VariantOperators variant="boolean" operators={["=", "!="]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exports Tab */}
        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export data in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleExportJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON (Console)
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Data Preview (First 5 rows)</h4>
                <ScrollArea className="h-64 border rounded p-2">
                  <pre className="text-xs">
                    {JSON.stringify(
                      data.slice(0, 5).map((row) => ({
                        id: row.id,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email,
                        status: row.status,
                      })),
                      null,
                      2,
                    )}
                  </pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function ToggleSwitch({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ConverterOutput({ title, value }: { title: string; value: string }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{title}</h4>
      <ScrollArea className="h-32 border rounded p-2">
        <pre className="text-xs whitespace-pre-wrap">{value || "(empty)"}</pre>
      </ScrollArea>
    </div>
  );
}

function VariantOperators({
  variant,
  operators,
}: {
  variant: string;
  operators: string[];
}) {
  return (
    <div className="border rounded p-3">
      <h5 className="font-medium text-sm mb-2 capitalize">{variant}</h5>
      <div className="flex flex-wrap gap-1">
        {operators.map((op) => (
          <span
            key={op}
            className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono"
          >
            {op}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DataTableV2Demo;
