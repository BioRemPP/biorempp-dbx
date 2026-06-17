/**
 * @packageDocumentation
 *
 * Loader and validator for the Scope and Limitations editorial catalog consumed by
 * the home page summary card and its detailed interpretation modal.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertNonEmptyStringArray, assertObject } from '../shared/guards';
import type {
  LimitationsEditorialCatalog,
  LimitationsHomeComponent,
  LimitationsModalContent,
  LimitationsModalFooter,
  LimitationsModalHeader,
  LimitationsModalTopic,
  LimitationsSignalCard,
  LimitationsTone,
  LimitationsTopicCard,
  LimitationsTopicComparison,
  LimitationsTopicExample,
} from '../../types/limitations';
import rawLimitationsCatalog from '../editorial/pages/limitations.page.yaml?raw';

const ALLOWED_LIMITATION_TONES = new Set<LimitationsTone>(['neutral', 'warning', 'success', 'info']);
const FIXED_LIMITATION_TOPIC_IDS = [
  'scientific-boundaries',
  'database-coverage-and-prediction-scope',
  'common-misinterpretations',
  'regulatory-and-use-restrictions',
  'reproducibility-and-reporting',
] as const;

function assertArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid limitations config at ${path}: expected array`);
  }
  return value;
}

function assertTone(value: unknown, path: string): LimitationsTone {
  const tone = assertNonEmptyString(value, path);
  if (!ALLOWED_LIMITATION_TONES.has(tone as LimitationsTone)) {
    throw new Error(
      `Invalid limitations config at ${path}: expected one of ${[...ALLOWED_LIMITATION_TONES].join('|')}`
    );
  }
  return tone as LimitationsTone;
}

function assertUniqueIds(items: Array<{ id: string }>, path: string) {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      throw new Error(`Invalid limitations config at ${path}[${index}].id: duplicated "${item.id}"`);
    }
    seen.add(item.id);
  });
}

function normalizeSignalCard(raw: unknown, path: string): LimitationsSignalCard {
  const card = assertObject(raw, path);
  return {
    id: assertNonEmptyString(card.id, `${path}.id`),
    title: assertNonEmptyString(card.title, `${path}.title`),
    body: assertNonEmptyString(card.body, `${path}.body`),
    tone: assertTone(card.tone, `${path}.tone`),
  };
}

function normalizeTopicCard(raw: unknown, path: string): LimitationsTopicCard {
  const card = assertObject(raw, path);
  return {
    title: assertNonEmptyString(card.title, `${path}.title`),
    body: assertNonEmptyString(card.body, `${path}.body`),
    tone: assertTone(card.tone, `${path}.tone`),
  };
}

function normalizeTopicComparison(raw: unknown, path: string): LimitationsTopicComparison {
  const comparison = assertObject(raw, path);
  return {
    left_label: assertNonEmptyString(comparison.left_label, `${path}.left_label`),
    left_items: assertNonEmptyStringArray(comparison.left_items, `${path}.left_items`),
    right_label: assertNonEmptyString(comparison.right_label, `${path}.right_label`),
    right_items: assertNonEmptyStringArray(comparison.right_items, `${path}.right_items`),
  };
}

function normalizeTopicExample(raw: unknown, path: string): LimitationsTopicExample {
  const example = assertObject(raw, path);
  return {
    incorrect: assertNonEmptyString(example.incorrect, `${path}.incorrect`),
    correct: assertNonEmptyString(example.correct, `${path}.correct`),
    rationale: assertNonEmptyString(example.rationale, `${path}.rationale`),
  };
}

function normalizeHomeComponent(raw: unknown): LimitationsHomeComponent {
  const section = assertObject(raw, 'home_component');
  const cardsRaw = assertArray(section.summary_cards, 'home_component.summary_cards');
  if (cardsRaw.length !== 3) {
    throw new Error('Invalid limitations config at home_component.summary_cards: expected exactly 3 cards');
  }

  const summaryCards = cardsRaw.map((card, index) =>
    normalizeSignalCard(card, `home_component.summary_cards[${index}]`)
  );
  assertUniqueIds(summaryCards, 'home_component.summary_cards');

  return {
    eyebrow: section.eyebrow === undefined ? undefined : assertNonEmptyString(section.eyebrow, 'home_component.eyebrow'),
    title: assertNonEmptyString(section.title, 'home_component.title'),
    subtitle: assertNonEmptyString(section.subtitle, 'home_component.subtitle'),
    intro: assertNonEmptyString(section.intro, 'home_component.intro'),
    summary_cards: summaryCards,
    cta_label: assertNonEmptyString(section.cta_label, 'home_component.cta_label'),
  };
}

function normalizeModalHeader(raw: unknown): LimitationsModalHeader {
  const header = assertObject(raw, 'modal.header');
  return {
    title: assertNonEmptyString(header.title, 'modal.header.title'),
    subtitle: assertNonEmptyString(header.subtitle, 'modal.header.subtitle'),
    notice: assertNonEmptyString(header.notice, 'modal.header.notice'),
  };
}

function normalizeModalFooter(raw: unknown): LimitationsModalFooter {
  const footer = assertObject(raw, 'modal.footer');
  return {
    text: assertNonEmptyString(footer.text, 'modal.footer.text'),
    terms_cta_label: assertNonEmptyString(footer.terms_cta_label, 'modal.footer.terms_cta_label'),
  };
}

function normalizeModalTopic(raw: unknown, index: number): LimitationsModalTopic {
  const topic = assertObject(raw, `modal.topics[${index}]`);
  const cardsRaw = assertArray(topic.cards, `modal.topics[${index}].cards`);
  if (cardsRaw.length === 0) {
    throw new Error(`Invalid limitations config at modal.topics[${index}].cards: expected non-empty array`);
  }

  const examplesRaw = topic.examples === undefined ? undefined : assertArray(topic.examples, `modal.topics[${index}].examples`);
  if (examplesRaw && examplesRaw.length === 0) {
    throw new Error(`Invalid limitations config at modal.topics[${index}].examples: expected non-empty array`);
  }

  return {
    id: assertNonEmptyString(topic.id, `modal.topics[${index}].id`),
    title: assertNonEmptyString(topic.title, `modal.topics[${index}].title`),
    summary: assertNonEmptyString(topic.summary, `modal.topics[${index}].summary`),
    cards: cardsRaw.map((card, cardIndex) =>
      normalizeTopicCard(card, `modal.topics[${index}].cards[${cardIndex}]`)
    ),
    comparison:
      topic.comparison === undefined
        ? undefined
        : normalizeTopicComparison(topic.comparison, `modal.topics[${index}].comparison`),
    examples: examplesRaw?.map((example, exampleIndex) =>
      normalizeTopicExample(example, `modal.topics[${index}].examples[${exampleIndex}]`)
    ),
  };
}

function assertFixedTopicOrder(topics: LimitationsModalTopic[]) {
  if (topics.length !== FIXED_LIMITATION_TOPIC_IDS.length) {
    throw new Error(
      `Invalid limitations config at modal.topics: expected exactly ${FIXED_LIMITATION_TOPIC_IDS.length} topics`
    );
  }

  topics.forEach((topic, index) => {
    const expectedId = FIXED_LIMITATION_TOPIC_IDS[index];
    if (topic.id !== expectedId) {
      throw new Error(
        `Invalid limitations config at modal.topics[${index}].id: expected "${expectedId}" in this position`
      );
    }
  });
}

function normalizeModal(raw: unknown): LimitationsModalContent {
  const modal = assertObject(raw, 'modal');

  const quickFactsRaw = assertArray(modal.quick_facts, 'modal.quick_facts');
  if (quickFactsRaw.length !== 4) {
    throw new Error('Invalid limitations config at modal.quick_facts: expected exactly 4 quick facts');
  }
  const quickFacts = quickFactsRaw.map((card, index) => normalizeSignalCard(card, `modal.quick_facts[${index}]`));
  assertUniqueIds(quickFacts, 'modal.quick_facts');

  const topicsRaw = assertArray(modal.topics, 'modal.topics');
  if (topicsRaw.length === 0) {
    throw new Error('Invalid limitations config at modal.topics: expected non-empty array');
  }
  const topics = topicsRaw.map((topic, index) => normalizeModalTopic(topic, index));
  assertUniqueIds(topics, 'modal.topics');
  assertFixedTopicOrder(topics);

  return {
    header: normalizeModalHeader(modal.header),
    quick_facts: quickFacts,
    topics,
    footer: normalizeModalFooter(modal.footer),
  };
}

export function parseLimitationsEditorialCatalog(rawYaml: string): LimitationsEditorialCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid limitations config YAML syntax: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const root = assertObject(parsed, 'root');
  return {
    version: assertNonEmptyString(root.version, 'version'),
    home_component: normalizeHomeComponent(root.home_component),
    modal: normalizeModal(root.modal),
  };
}

export function loadLimitationsEditorialCatalog(): LimitationsEditorialCatalog {
  return parseLimitationsEditorialCatalog(rawLimitationsCatalog);
}

export const LIMITATIONS_EDITORIAL_CATALOG = loadLimitationsEditorialCatalog();
