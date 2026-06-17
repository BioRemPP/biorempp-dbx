/**
 * @packageDocumentation
 *
 * Minimal option contracts returned by shared metadata endpoints.
 */
/**
 * Pathway option exposed by grouped metadata selector endpoints.
 */
export interface PathwayOption {
  /** Pathway name or identifier returned to the client. */
  pathway: string;
  /** Source catalog that owns the pathway value. */
  source: string;
}
