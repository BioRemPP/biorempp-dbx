/**
 * @packageDocumentation
 *
 * Static guided-query recipe loaders and validators used by reproducibility and example workflows.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertObject } from '../../../content/shared/guards';
import type {
  GuidedQueryRecipe,
  GuidedQueryRecipeCatalog,
  GuidedQueryRecipeItem,
} from '../../../types/frontConfig';

const rawIndividualRecipes = import.meta.glob('./yaml/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const GUIDED_RECIPE_LANGUAGES = new Set<GuidedQueryRecipeItem['language']>([
  'sql',
  'python',
  'r',
]);
const GUIDED_RECIPE_RUNTIMES = new Set<GuidedQueryRecipeItem['runtime']>(['sqlite', 'csv']);
const GUIDED_QUERY_RECIPES_VERSION = 'v1';
const GUIDED_QUERY_RECIPES_NOTE =
  'Query recipes are static full-scope reproducibility examples and do not automatically reflect active UI filters.';

function normalizeOptionalStringArray(value: unknown, path: string): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(`Invalid config at ${path}: expected array`);
  }
  return value.map((entry, index) => assertNonEmptyString(entry, `${path}[${index}]`));
}

function normalizeRecipeLanguage(value: unknown, path: string): GuidedQueryRecipeItem['language'] {
  const language = assertNonEmptyString(value, path) as GuidedQueryRecipeItem['language'];
  if (!GUIDED_RECIPE_LANGUAGES.has(language)) {
    throw new Error(`Invalid config at ${path}: expected one of sql, python, r`);
  }
  return language;
}

function normalizeRecipeRuntime(value: unknown, path: string): GuidedQueryRecipeItem['runtime'] {
  const runtime = assertNonEmptyString(value, path) as GuidedQueryRecipeItem['runtime'];
  if (!GUIDED_RECIPE_RUNTIMES.has(runtime)) {
    throw new Error(`Invalid config at ${path}: expected one of sqlite, csv`);
  }
  return runtime;
}

function normalizeRecipeItem(rawRecipe: unknown, pathPrefix: string): GuidedQueryRecipeItem {
  const recipe = assertObject(rawRecipe, pathPrefix);
  return {
    id: assertNonEmptyString(recipe.id, `${pathPrefix}.id`),
    label: assertNonEmptyString(recipe.label, `${pathPrefix}.label`),
    description: assertNonEmptyString(recipe.description, `${pathPrefix}.description`),
    language: normalizeRecipeLanguage(recipe.language, `${pathPrefix}.language`),
    runtime: normalizeRecipeRuntime(recipe.runtime, `${pathPrefix}.runtime`),
    code: assertNonEmptyString(recipe.code, `${pathPrefix}.code`),
    requirements: normalizeOptionalStringArray(recipe.requirements, `${pathPrefix}.requirements`),
    input_files: normalizeOptionalStringArray(recipe.input_files, `${pathPrefix}.input_files`),
  };
}

function normalizeRecipe(rawRecipe: unknown, pathPrefix: string): GuidedQueryRecipe {
  const recipe = assertObject(rawRecipe, pathPrefix);
  const notesRaw = recipe.notes;
  const notes =
    Array.isArray(notesRaw) && notesRaw.length > 0
      ? notesRaw.map((value, idx) => assertNonEmptyString(value, `${pathPrefix}.notes[${idx}]`))
      : undefined;

  if (!Array.isArray(recipe.recipes) || recipe.recipes.length === 0) {
    throw new Error(`Invalid config at ${pathPrefix}.recipes: expected non-empty array`);
  }

  const seenIds = new Set<string>();
  const recipes = recipe.recipes.map((entry, idx) => {
    const normalized = normalizeRecipeItem(entry, `${pathPrefix}.recipes[${idx}]`);
    if (seenIds.has(normalized.id)) {
      throw new Error(`Invalid config at ${pathPrefix}.recipes[${idx}].id: duplicated id`);
    }
    seenIds.add(normalized.id);
    return normalized;
  });

  return {
    button_label: assertNonEmptyString(recipe.button_label, `${pathPrefix}.button_label`),
    title: assertNonEmptyString(recipe.title, `${pathPrefix}.title`),
    introduction: assertNonEmptyString(recipe.introduction, `${pathPrefix}.introduction`),
    recipes,
    notes,
  };
}

/**
 * Parses and validates one guided-query recipe file.
 *
 * @param rawYaml Raw YAML text loaded from a recipe file.
 * @param queryId Query identifier associated with the recipe file.
 * @returns A normalized guided-query recipe payload.
 * @throws Error when the YAML payload is missing required fields or contains invalid enum values.
 */
export function parseGuidedQueryRecipe(rawYaml: string, queryId: string): GuidedQueryRecipe {
  const raw = parseYaml(rawYaml);
  return normalizeRecipe(raw, `recipe files.${queryId}`);
}

/**
 * Parses a set of guided-query recipe files indexed by file path.
 *
 * @param rawYamlByPath Raw YAML content keyed by import path.
 * @returns Guided recipes keyed by inferred query id.
 * @throws Error when a file path does not expose a `.yaml` or `.yml` basename, or when a recipe is invalid.
 */
export function parseGuidedQueryRecipeFiles(
  rawYamlByPath: Record<string, string>
): Record<string, GuidedQueryRecipe> {
  const recipes: Record<string, GuidedQueryRecipe> = {};

  for (const [filePath, rawYaml] of Object.entries(rawYamlByPath)) {
    const match = filePath.match(/\/([^/]+)\.ya?ml$/);
    if (!match) {
      throw new Error(`Invalid guided query recipe file path: ${filePath}`);
    }

    const queryId = match[1];
    recipes[queryId] = parseGuidedQueryRecipe(rawYaml, queryId);
  }

  return recipes;
}

/**
 * Loads the full guided-query recipe catalog from the statically bundled YAML files.
 *
 * @returns A validated recipe catalog keyed by guided-query id.
 */
export function loadGuidedQueryRecipesCatalog(): GuidedQueryRecipeCatalog {
  return {
    version: GUIDED_QUERY_RECIPES_VERSION,
    note: GUIDED_QUERY_RECIPES_NOTE,
    queries: parseGuidedQueryRecipeFiles(rawIndividualRecipes),
  };
}

/**
 * Eagerly loaded guided-query recipe catalog used by the frontend.
 */
export const GUIDED_QUERY_RECIPES_CATALOG = loadGuidedQueryRecipesCatalog();

/**
 * Resolves the recipe definition associated with a guided-query id.
 *
 * @param queryId Guided-query identifier.
 * @returns The configured recipe definition, or `undefined` when no recipe exists for the query.
 */
export function getGuidedQueryRecipe(queryId: string): GuidedQueryRecipe | undefined {
  return GUIDED_QUERY_RECIPES_CATALOG.queries[queryId];
}
