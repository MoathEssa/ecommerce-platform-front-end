/**
 * Filter Engine exports
 */

// Filter application (client-side)
export {
  queryToJsonLogic,
  applyJsonLogic,
  filterWithJsonLogic,
  applyFilter,
  rowMatchesFilter,
  createTableFilterFn,
  type FilterEngineOptions,
} from "./filterEngine";

// Query converters (all formats)
export {
  exportQuery,
  toJsonLogic,
  toSql,
  toParameterizedSql,
  toMongoDB,
  toCEL,
  toSpEL,
  toElasticSearch,
  toNaturalLanguage,
  registerJsonLogicOperators,
  jsonLogicRuleProcessor,
  sqlRuleProcessor,
  mongoDbRuleProcessor,
  type ExportFormat,
  type ExportOptions,
} from "./converters";
