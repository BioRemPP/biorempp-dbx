import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

const ALLOWED_TONES = new Set(['neutral', 'warning', 'success', 'info']);
const FIXED_TOPIC_IDS = [
  'scientific-boundaries',
  'database-coverage-and-prediction-scope',
  'common-misinterpretations',
  'regulatory-and-use-restrictions',
  'reproducibility-and-reporting',
];

function fail(message) {
  throw new Error(`limitations-config: ${message}`);
}

function assertObject(value, context) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${context} must be an object`);
  }
}

function assertString(value, context) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${context} must be a non-empty string`);
  }
  return value.trim();
}

function assertArray(value, context) {
  if (!Array.isArray(value)) {
    fail(`${context} must be an array`);
  }
}

function assertStringArray(value, context) {
  assertArray(value, context);
  if (value.length === 0) {
    fail(`${context} must contain at least one item`);
  }
  value.forEach((entry, index) => assertString(entry, `${context}[${index}]`));
}

function assertTone(value, context) {
  const tone = assertString(value, context);
  if (!ALLOWED_TONES.has(tone)) {
    fail(`${context} must be one of ${[...ALLOWED_TONES].join('|')}`);
  }
  return tone;
}

function assertUniqueIds(items, context) {
  const seen = new Set();
  items.forEach((item, index) => {
    assertObject(item, `${context}[${index}]`);
    const id = assertString(item.id, `${context}[${index}].id`);
    if (seen.has(id)) {
      fail(`${context} has duplicated id "${id}"`);
    }
    seen.add(id);
  });
}

function readYaml(filePath, projectRoot = defaultProjectRoot) {
  if (!fs.existsSync(filePath)) {
    fail(`missing file: ${path.relative(projectRoot, filePath)}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return parseYaml(raw);
  } catch (error) {
    fail(`invalid yaml in ${path.relative(projectRoot, filePath)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function validateSignalCard(card, context) {
  assertObject(card, context);
  assertString(card.id, `${context}.id`);
  assertString(card.title, `${context}.title`);
  assertString(card.body, `${context}.body`);
  assertTone(card.tone, `${context}.tone`);
}

function validateTopicCard(card, context) {
  assertObject(card, context);
  assertString(card.title, `${context}.title`);
  assertString(card.body, `${context}.body`);
  assertTone(card.tone, `${context}.tone`);
}

function validateComparison(comparison, context) {
  assertObject(comparison, context);
  assertString(comparison.left_label, `${context}.left_label`);
  assertStringArray(comparison.left_items, `${context}.left_items`);
  assertString(comparison.right_label, `${context}.right_label`);
  assertStringArray(comparison.right_items, `${context}.right_items`);
}

function validateExample(example, context) {
  assertObject(example, context);
  assertString(example.incorrect, `${context}.incorrect`);
  assertString(example.correct, `${context}.correct`);
  assertString(example.rationale, `${context}.rationale`);
}

export function validateLimitationsConfig({
  projectRoot = defaultProjectRoot,
} = {}) {
  const configPath = path.join(
    projectRoot,
    'src',
    'content',
    'editorial',
    'pages',
    'limitations.page.yaml'
  );

  const root = readYaml(configPath, projectRoot);
  assertObject(root, 'limitations.page.yaml');
  assertString(root.version, 'limitations.page.yaml version');

  const home = root.home_component;
  const modal = root.modal;
  assertObject(home, 'limitations.page.yaml home_component');
  assertObject(modal, 'limitations.page.yaml modal');

  assertString(home.title, 'limitations.page.yaml home_component.title');
  assertString(home.subtitle, 'limitations.page.yaml home_component.subtitle');
  assertString(home.intro, 'limitations.page.yaml home_component.intro');
  assertString(home.cta_label, 'limitations.page.yaml home_component.cta_label');
  assertArray(home.summary_cards, 'limitations.page.yaml home_component.summary_cards');
  if (home.summary_cards.length !== 3) {
    fail('limitations.page.yaml home_component.summary_cards must contain exactly 3 items');
  }
  assertUniqueIds(home.summary_cards, 'limitations.page.yaml home_component.summary_cards');
  home.summary_cards.forEach((card, index) =>
    validateSignalCard(card, `limitations.page.yaml home_component.summary_cards[${index}]`)
  );

  assertObject(modal.header, 'limitations.page.yaml modal.header');
  assertString(modal.header.title, 'limitations.page.yaml modal.header.title');
  assertString(modal.header.subtitle, 'limitations.page.yaml modal.header.subtitle');
  assertString(modal.header.notice, 'limitations.page.yaml modal.header.notice');

  assertArray(modal.quick_facts, 'limitations.page.yaml modal.quick_facts');
  if (modal.quick_facts.length !== 4) {
    fail('limitations.page.yaml modal.quick_facts must contain exactly 4 items');
  }
  assertUniqueIds(modal.quick_facts, 'limitations.page.yaml modal.quick_facts');
  modal.quick_facts.forEach((fact, index) =>
    validateSignalCard(fact, `limitations.page.yaml modal.quick_facts[${index}]`)
  );

  assertArray(modal.topics, 'limitations.page.yaml modal.topics');
  if (modal.topics.length !== FIXED_TOPIC_IDS.length) {
    fail(`limitations.page.yaml modal.topics must contain exactly ${FIXED_TOPIC_IDS.length} items`);
  }
  assertUniqueIds(modal.topics, 'limitations.page.yaml modal.topics');
  modal.topics.forEach((topic, index) => {
    const context = `limitations.page.yaml modal.topics[${index}]`;
    assertObject(topic, context);
    const topicId = assertString(topic.id, `${context}.id`);
    if (topicId !== FIXED_TOPIC_IDS[index]) {
      fail(`${context}.id must be "${FIXED_TOPIC_IDS[index]}" in this position`);
    }
    assertString(topic.title, `${context}.title`);
    assertString(topic.summary, `${context}.summary`);
    assertArray(topic.cards, `${context}.cards`);
    if (topic.cards.length === 0) {
      fail(`${context}.cards must contain at least one item`);
    }
    topic.cards.forEach((card, cardIndex) =>
      validateTopicCard(card, `${context}.cards[${cardIndex}]`)
    );
    if (topic.comparison !== undefined) {
      validateComparison(topic.comparison, `${context}.comparison`);
    }
    if (topic.examples !== undefined) {
      assertArray(topic.examples, `${context}.examples`);
      if (topic.examples.length === 0) {
        fail(`${context}.examples must contain at least one item`);
      }
      topic.examples.forEach((example, exampleIndex) =>
        validateExample(example, `${context}.examples[${exampleIndex}]`)
      );
    }
  });

  assertObject(modal.footer, 'limitations.page.yaml modal.footer');
  assertString(modal.footer.text, 'limitations.page.yaml modal.footer.text');
  assertString(modal.footer.terms_cta_label, 'limitations.page.yaml modal.footer.terms_cta_label');

  return {
    path: configPath,
    homeSummaryCardCount: home.summary_cards.length,
    quickFactCount: modal.quick_facts.length,
    topicCount: modal.topics.length,
    exampleCount: modal.topics.reduce((total, topic) => total + (Array.isArray(topic.examples) ? topic.examples.length : 0), 0),
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedPath === __filename) {
  try {
    const result = validateLimitationsConfig();
    console.log(
      `limitations-config: validated ${result.homeSummaryCardCount} summary cards, ${result.quickFactCount} quick facts, and ${result.topicCount} topics in ${path.relative(defaultProjectRoot, result.path)}`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
