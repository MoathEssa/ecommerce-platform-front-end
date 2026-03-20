/**
 * Shadcn Control Elements Configuration
 * Separated from components for Fast Refresh compatibility
 * Now imports from split component files for better maintainability
 */

import {
  CombinatorSelector,
  FieldSelector,
  OperatorSelector,
  ValueSelector,
  ValueEditor,
  AddRuleAction,
  AddGroupAction,
  RemoveRuleAction,
  RemoveGroupAction,
  CloneRuleAction,
  CloneGroupAction,
} from "./components";

/**
 * Control elements configuration for react-querybuilder
 * Uses shadcn/ui styled components
 */
export const shadcnControlElements = {
  combinatorSelector: CombinatorSelector,
  fieldSelector: FieldSelector,
  operatorSelector: OperatorSelector,
  valueSelector: ValueSelector,
  valueEditor: ValueEditor,
  addRuleAction: AddRuleAction,
  addGroupAction: AddGroupAction,
  removeRuleAction: RemoveRuleAction,
  removeGroupAction: RemoveGroupAction,
  cloneRuleAction: CloneRuleAction,
  cloneGroupAction: CloneGroupAction,
};

// Legacy exports for backward compatibility
// These map to the old names used in the original ShadcnQueryBuilderComponents.tsx
export {
  CombinatorSelector as ShadcnCombinatorSelector,
  FieldSelector as ShadcnFieldSelector,
  OperatorSelector as ShadcnOperatorSelector,
  ValueSelector as ShadcnValueSelector,
  ValueEditor as ShadcnValueEditor,
  AddRuleAction as ShadcnAddRuleAction,
  AddGroupAction as ShadcnAddGroupAction,
  RemoveRuleAction as ShadcnRemoveRuleAction,
  RemoveGroupAction as ShadcnRemoveGroupAction,
  CloneRuleAction as ShadcnCloneRuleAction,
  CloneGroupAction as ShadcnCloneGroupAction,
} from "./components";
