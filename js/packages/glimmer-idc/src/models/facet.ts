export type ItemValue = {
  value: any;
  count: number;
};

export type Item = {
  url: string;
  values: ItemValue;
};

/**
 * TODO: How do we get a label for this facet?
 */
export default class Facet {
  key: string;
  items: Item[];
  isEmpty: boolean;
  empty: {};

  constructor(facet: {}) {
    this.parseFacet(facet);
  }

  parseFacet(facet: {}) {
    const objkeys = Object.keys(facet);

    if (objkeys.length === 0) {
      throw new Error(`No facet key found. ${facet}`);
    }

    // Check the shape of this "facet" data to see if it's empty
    if (facet.hasOwnProperty('#attributes') && facet['#attributes'].class.includes('facet-empty')) {
      this.parseEmptyFacet(facet);
      return;
    }

    const key = objkeys[0];
    this.isEmpty = false;

    this.key = key;
    this.items = facet[key];
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
