import { Facet } from './models/facet';

export type SearchApiResponse = {
  rows: {}[];
  pager: Pager;
  facets: Facet[];
  facets_metadata: {};
};

export type Pager = {
  current_page: number;
  total_items: number;
  total_pages: number;
  items_per_page: number;
};

export type Options = {
  sortBy?: string | null;
  sortOrder?: string | null;
  itemsPerPage?: number | null;
  currentPage?: number | null;
};

/**
 * A facet value, should be selectable by the user.
 * Should also contain enough information for the UI to act on to
 * mutate the current search query.
 */
 export type FacetValue = {
  key: string;
  value: any;
  count: number;
  frag: string;
  url: string;
};

export type FacetMetaValue = {
  label: string;
  weight: number;
  field_id: string;
  url_alias: string;
};

export type FacetMeta = {
  [key: string]: FacetMetaValue;
}

/**
 * Search field selectable by the user to narrow a query term
 */
export type SearchField = {
  /** Human readable label, useful for a UI */
  label: string;
  /** Machine-readable name, useful for constructing queries */
  keys: string[];
}

export type CollectionSuggestion = {
  id: string;
  title: string;
}

export type LanguageValue = {
  id: string;
  label: string;
  langCode: string;
}
