/**
 * A facet value, should be selectable by the user.
 * Should also contain enough information for the UI to act on to
 * mutate the current search query.
 */
export type FacetValue = {
  key: string;
  value: any;
  count: number;
  url: string;
};

/**
 * TODO: How do we get a label for this facet?
 */
export class Facet {
  key: string;
  items: FacetValue[];
  isEmpty: boolean;
  empty: {};

  constructor(facet: {}) {
    this.parseFacet(facet);
  }

  parseFacet(facet: {}) {
    const objkeys = Object.keys(facet);

    if (objkeys.length === 0) {
      throw new Error(`No facet field found. ${facet}`);
    }

    // Check the shape of this "facet" data to see if it's empty
    if (facet.hasOwnProperty('#attributes') && facet['#attributes'].class.includes('facet-empty')) {
      this.parseEmptyFacet(facet);
      return;
    }

    const key: string = objkeys[0];
    this.isEmpty = false;

    this.key = key;

    this.items = facet[key].map((data) => ({
      key,
      value: data.values.value,
      count: data.values.count,
      url: data.url,
    }));

    // For convenience of parsing when a user selects a facet value, let's add the facet field
    // on all items now
    this.items.forEach((item) => (item.key = key));
  }

  /**
   * This construct is Drupal returning info for rendering an HTML element
   * and indicates a facet with no results that should be hidden in the UI
   *
   * {
      "0": [],
      "#type": "container",
      "#attributes": {
        "data-drupal-facet-id": "facet_access_rights",
        "class": [ "facet-empty", "facet-hidden" ]
      }
    }
   *
   * @param facet raw facet JSON of an empty facet
   */
  parseEmptyFacet(facet: {}) {
    this.isEmpty = true;
    this.empty = facet;
    this.key = facet['#attributes']['data-drupal-facet-id'];
  }

  item(index: number) {
    return this.items[index];
  }

  length() {
    return this.items.length;
  }
}
