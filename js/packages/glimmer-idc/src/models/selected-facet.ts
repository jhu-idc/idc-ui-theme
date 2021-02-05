import Facet from './facet';

/**
 * A facet that has an item selected
 */
export default interface SelectedFacet {
  /** Facet field. I.e. facet_subject */
  field: string;
  /** Drupal may provide a URL to continue the current search with this facet appended */
  url: string;
  /** Search key used for search queries */
  key: string;

  equals: (obj) => boolean;
}

export class SelectedFacetImpl implements SelectedFacet {
  field: string;
  key: string;
  url: string;

  constructor(field: string, key: string, url?: string) {
    this.field = field;
    this.key = key;
    this.url = url;
  }

  equals(object): boolean {
    return typeof object === 'object' && this.field === object.field && this.key === object.key;
  }
}
