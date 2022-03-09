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

  equals(obj: unknown) {
    if (!(obj instanceof Facet)) {
      return false;
    }

    const value: Facet = obj as Facet;
    if (this.key !== value.key) return false;
    if (this.label !== value.label) return false;
    if (this.isEmpty !== value.isEmpty) return false;
    if (this.empty !== value.empty) return false;

    if (!!this.items && !value.items ) return false;
    if (this.items.length !== value.items.length) return false;

    const items1 = this.items.map(item => item.frag);
    const items2 = value.items.map(item => item.frag);

    if (!items1.every(item => items2.includes(item))) return false;

    return true;
  }
}
