/// <reference types="vite/client" />

/**
 * @packageDocumentation
 *
 * Ambient declarations for raw YAML imports consumed by the editorial content loaders.
 */

/**
 * Allows importing `.yaml` files as raw text for runtime parsing.
 */
declare module '*.yaml?raw' {
  const content: string;
  export default content;
}

/**
 * Allows importing `.yml` files as raw text for runtime parsing.
 */
declare module '*.yml?raw' {
  const content: string;
  export default content;
}
