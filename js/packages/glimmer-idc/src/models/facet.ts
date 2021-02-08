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

  constructor(key: string, items: FacetValue[], isEmpty: boolean, empty?: any) {
    this.key = key;
    this.items = items;
    this.isEmpty = isEmpty;
    this.empty = empty;
  }

  item(index: number) {
    return this.items[index];
  }

  length() {
    return this.items.length;
  }
}
