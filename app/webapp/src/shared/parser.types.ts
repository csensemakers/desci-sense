export interface AppPostSemantics {
  triplets: string[];
}

export interface OntologyItem {
  URI: string;
  display_name: string;
  Name?: string;
  label?: string;
  prompt?: string;
  notes?: string;
  valid_subject_types?: string;
  valid_object_types?: string;
  versions?: string;
}

export interface KeywordsSupport {
  keyWordsOntology: OntologyItem;
}

export interface RefMeta {
  title: string;
  description: string;
  image: string;
}

export interface ReflabelsSupport {
  labelsOntology: OntologyItem[];
  refsMeta: Record<string, RefMeta>;
}

export interface ParsedSupport {
  keywords: KeywordsSupport;
  refLabels: ReflabelsSupport;
}

export interface ParserResult {
  semantics: AppPostSemantics;
  support: ParsedSupport;
}
