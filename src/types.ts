export enum CreditTypes {
  Dependency = 'DEPENDENCY',
  ManualCredit = 'MANUAL_CREDIT',
}

export interface BaseCredit {
  name: string;
  url: string;
  type: CreditTypes;
}

export interface ManualCredit extends BaseCredit {
  type: CreditTypes.ManualCredit;
  author: string;
}

export interface Dependency extends BaseCredit {
  type: CreditTypes.Dependency;
  license: string;
  version: string;
}

export type CreditJSON = Dependency | ManualCredit;

export type CreditsMap = Map<string, CreditJSON>;
