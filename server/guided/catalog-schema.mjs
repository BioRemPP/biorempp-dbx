import Ajv from 'ajv';

const NON_EMPTY_STRING_PATTERN = '\\S';
const MIN_INTERPRETATION_STATEMENT_LENGTH = 20;

const nonEmptyStringSchema = {
  type: 'string',
  minLength: 1,
  pattern: NON_EMPTY_STRING_PATTERN,
};

const numberSchema = {
  type: 'number',
};

const permissiveObjectSchema = {
  type: 'object',
};

const categorySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'label'],
  properties: {
    id: nonEmptyStringSchema,
    label: nonEmptyStringSchema,
  },
};

const providerOptionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['value', 'label'],
  properties: {
    value: nonEmptyStringSchema,
    label: nonEmptyStringSchema,
  },
};

const providerSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['type'],
  properties: {
    type: {
      type: 'string',
      enum: ['meta_endpoint', 'static', 'query_derived'],
    },
    endpoint: nonEmptyStringSchema,
    source: nonEmptyStringSchema,
    include_mean_option: {
      type: 'boolean',
    },
    mean_option_label: nonEmptyStringSchema,
    options: {
      type: 'array',
      minItems: 1,
      items: providerOptionSchema,
    },
  },
  allOf: [
    {
      if: {
        properties: {
          type: {
            const: 'meta_endpoint',
          },
        },
        required: ['type'],
      },
      then: {
        required: ['endpoint'],
      },
    },
    {
      if: {
        properties: {
          type: {
            const: 'query_derived',
          },
        },
        required: ['type'],
      },
      then: {
        required: ['source'],
      },
    },
    {
      if: {
        properties: {
          type: {
            const: 'static',
          },
        },
        required: ['type'],
      },
      then: {
        required: ['options'],
      },
    },
  ],
};

const filterSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'type', 'label'],
  properties: {
    id: nonEmptyStringSchema,
    type: {
      type: 'string',
      enum: ['select', 'number_range', 'search', 'dependent_select', 'toggle'],
    },
    label: nonEmptyStringSchema,
    placeholder: nonEmptyStringSchema,
    min_placeholder: nonEmptyStringSchema,
    max_placeholder: nonEmptyStringSchema,
    depends_on: nonEmptyStringSchema,
    min: numberSchema,
    max: numberSchema,
    step: numberSchema,
    provider: providerSchema,
  },
};

const summaryCardSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'label', 'value_key'],
  properties: {
    id: nonEmptyStringSchema,
    label: nonEmptyStringSchema,
    value_key: nonEmptyStringSchema,
    hint: nonEmptyStringSchema,
  },
};

const visualizationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'type', 'title', 'data_key'],
  properties: {
    id: nonEmptyStringSchema,
    type: {
      type: 'string',
      enum: ['horizontal_bar', 'scatter_quadrant', 'heatmap_matrix', 'boxplot', 'table'],
    },
    title: nonEmptyStringSchema,
    subtitle: nonEmptyStringSchema,
    data_key: nonEmptyStringSchema,
  },
};

const tableColumnSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'label'],
  properties: {
    id: nonEmptyStringSchema,
    label: nonEmptyStringSchema,
    type: {
      type: 'string',
      enum: ['text', 'number', 'compound_link'],
    },
  },
};

const tableSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'columns'],
  properties: {
    id: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    subtitle: nonEmptyStringSchema,
    row_click_field: nonEmptyStringSchema,
    empty_message: nonEmptyStringSchema,
    columns: {
      type: 'array',
      minItems: 1,
      items: tableColumnSchema,
    },
  },
};

const visualElementSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['label', 'description'],
  properties: {
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
  },
};

const useCaseDescriptionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['scientific_question', 'description', 'interpretation_guidelines', 'limitations'],
  properties: {
    scientific_question: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    visual_elements: {
      type: 'array',
      items: visualElementSchema,
    },
    interpretation_guidelines: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
        minLength: MIN_INTERPRETATION_STATEMENT_LENGTH,
        pattern: NON_EMPTY_STRING_PATTERN,
      },
    },
    limitations: {
      type: 'array',
      minItems: 1,
      items: nonEmptyStringSchema,
    },
    color_scheme: nonEmptyStringSchema,
  },
};

const methodsStepSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'description'],
  properties: {
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    bullets: {
      type: 'array',
      items: nonEmptyStringSchema,
    },
  },
};

const methodsModalSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['button_label', 'title', 'introduction', 'steps'],
  properties: {
    button_label: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    introduction: nonEmptyStringSchema,
    steps: {
      type: 'array',
      minItems: 1,
      items: methodsStepSchema,
    },
    footer_note: nonEmptyStringSchema,
  },
};

const querySourceSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'id',
    'category',
    'title',
    'question',
    'description',
    'dataset',
    'executor',
    'use_case_description',
    'methods_modal',
  ],
  properties: {
    id: nonEmptyStringSchema,
    category: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    question: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    dataset: nonEmptyStringSchema,
    executor: nonEmptyStringSchema,
    defaults: permissiveObjectSchema,
    executor_config: permissiveObjectSchema,
    filters: {
      type: 'array',
      items: filterSchema,
    },
    use_case_description: useCaseDescriptionSchema,
    methods_modal: methodsModalSchema,
    summary_cards: {
      type: 'array',
      items: summaryCardSchema,
    },
    visualizations: {
      type: 'array',
      items: visualizationSchema,
    },
    table: tableSchema,
  },
};

const queryCompiledSchema = {
  ...querySourceSchema,
  required: [
    'id',
    'category',
    'title',
    'question',
    'description',
    'dataset',
    'executor',
    'defaults',
    'executor_config',
    'filters',
    'use_case_description',
    'methods_modal',
    'summary_cards',
    'visualizations',
    'table',
  ],
  properties: {
    ...querySourceSchema.properties,
    defaults: permissiveObjectSchema,
    executor_config: permissiveObjectSchema,
    filters: {
      type: 'array',
      items: filterSchema,
    },
    summary_cards: {
      type: 'array',
      items: summaryCardSchema,
    },
    visualizations: {
      type: 'array',
      items: visualizationSchema,
    },
    table: {
      anyOf: [tableSchema, { type: 'null' }],
    },
  },
};

export const guidedCatalogSourceSchema = {
  $id: 'guidedCatalogSource',
  type: 'object',
  additionalProperties: false,
  required: ['version', 'title', 'categories', 'query_order'],
  properties: {
    version: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    categories: {
      type: 'array',
      minItems: 1,
      items: categorySchema,
    },
    query_order: {
      type: 'array',
      minItems: 1,
      items: nonEmptyStringSchema,
    },
  },
};

export const guidedQuerySourceSchema = {
  $id: 'guidedQuerySource',
  ...querySourceSchema,
};

export const guidedCatalogCompiledSchema = {
  $id: 'guidedCatalogCompiled',
  type: 'object',
  additionalProperties: false,
  required: ['version', 'title', 'categories', 'queries', 'generated_at'],
  properties: {
    version: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    categories: {
      type: 'array',
      minItems: 1,
      items: categorySchema,
    },
    queries: {
      type: 'array',
      minItems: 1,
      items: queryCompiledSchema,
    },
    generated_at: nonEmptyStringSchema,
  },
};

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});

const validateGuidedCatalogSource = ajv.compile(guidedCatalogSourceSchema);
const validateGuidedQuerySource = ajv.compile(guidedQuerySourceSchema);
const validateGuidedCatalogCompiled = ajv.compile(guidedCatalogCompiledSchema);

function formatInstancePath(instancePath) {
  if (!instancePath) {
    return '(root)';
  }

  const dotPath = instancePath
    .slice(1)
    .split('/')
    .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
    .map((segment) => (segment.match(/^\d+$/) ? `[${segment}]` : segment))
    .join('.')
    .replace(/\.\[/g, '[');

  return dotPath || '(root)';
}

function formatValidationErrors(errors) {
  return (errors || [])
    .map((error) => {
      const path = formatInstancePath(error.instancePath);
      if (error.keyword === 'required' && typeof error.params?.missingProperty === 'string') {
        const target =
          path === '(root)' ? error.params.missingProperty : `${path}.${error.params.missingProperty}`;
        return `${target} is required`;
      }
      if (error.keyword === 'additionalProperties' && typeof error.params?.additionalProperty === 'string') {
        const target =
          path === '(root)' ? error.params.additionalProperty : `${path}.${error.params.additionalProperty}`;
        return `${target} is not allowed`;
      }
      return `${path} ${error.message}`.trim();
    })
    .join('; ');
}

function assertValid(validator, value, label) {
  const valid = validator(value);
  if (valid) {
    return value;
  }

  throw new Error(`${label} failed schema validation: ${formatValidationErrors(validator.errors)}`);
}

export function assertValidGuidedCatalogSource(value, label = 'catalog.yaml') {
  return assertValid(validateGuidedCatalogSource, value, label);
}

export function assertValidGuidedQuerySource(value, label) {
  return assertValid(validateGuidedQuerySource, value, label);
}

export function assertValidCompiledGuidedCatalog(value, label = 'server/generated/guided/catalog.json') {
  return assertValid(validateGuidedCatalogCompiled, value, label);
}
