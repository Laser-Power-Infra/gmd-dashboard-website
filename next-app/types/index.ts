export interface Valve {
  id: string;
  name: string;
  category: string;
  iconName: string;
  image: string;
  size: string;
  standards: string[];
  moc: string[];
  pressure: string[];
  operation: string[];
  endConnection: string;
  application: string;
  description: string;
  features: string[];
}

export interface ValveApplication {
  num: number;
  title: string;
  description: string;
}

export interface ValveDetailCard {
  title: string;
  image: string;
  description: string;
}

export interface ValveDetailSection {
  title: string;
  gridClass: string;
  cards: ValveDetailCard[];
}

export interface ValveDetail {
  introduction: string;
  applications: ValveApplication[];
  sections: ValveDetailSection[];
}

export interface OtherProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  usage: string[];
}

export interface DetailValve {
  id: string;
  name: string;
  category: string;
  image: string;
  size: string;
  standards: string[];
  moc: string[];
  pressure: string[];
  operation: string[];
  endConnection: string;
  application: string;
  description: string;
  features: string[];
  usage?: string[];
}

export type ManualBlock =
  | { type: 'subtitle'; text: string }
  | { type: 'text'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface ManualSection {
  title: string;
  blocks: ManualBlock[];
}

export interface Manual {
  isModern: boolean;
  title: string;
  sections: ManualSection[];
}

export interface IndustryRow {
  image?: string;
  data: string[];
}

export interface IndustrySection {
  category: string;
  headers: string[];
  rows: IndustryRow[];
  isImageCards?: boolean;
}
