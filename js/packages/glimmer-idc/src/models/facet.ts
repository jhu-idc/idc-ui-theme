import { FacetValue } from '../interfaces';

export class Facet {
  key: string;
  label: string;
  items: FacetValue[];
  isEmpty: boolean;
  empty: {};

  constructor(key: string, label: string, items: FacetValue[], isEmpty: boolean, empty?: any) {
    this.key = key;
    this.label = label;
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
