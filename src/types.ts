export interface CreditJSON {
  name: string;
  url: string;
  license: string;
  /** @since 1.0.1 */
  version: string;
}

export type CreditsMap = Map<string, CreditJSON>;
