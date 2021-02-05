import Component, { hbs, tracked } from '@glimmerx/component';
import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmerx/modifier';
import Facet, { Item } from '../models/facet';
import SelectedFacet, { SelectedFacetImpl } from '../models/selected-facet';

interface Args {
  facet: Facet;
  item: Item;
  onClick: (s: SelectedFacet) => void;
}

export default class FacetItem extends Component<Args> {
  @action
  selectFacet() {
    this.args.onClick(
      new SelectedFacetImpl(this.args.facet.key, this.args.item.values.value, this.args.item.url)
    );
  }

  static template = hbs`
    <a href="javascript:;" class="" {{on "click" this.selectFacet}}>
      {{@item.values.value}}&nbsp;
      <span class="">({{@item.values.count}})</span>
    </a>
  `;
}
