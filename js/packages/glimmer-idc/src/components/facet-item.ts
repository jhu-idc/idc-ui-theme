import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { Facet, FacetValue } from '../models/facet';

interface Args {
  facet: Facet;
  item: FacetValue;
  onClick: (s: FacetValue) => void;
}

export default class FacetItem extends Component<Args> {
  @action
  selectFacet() {
    this.args.onClick(this.args.item);
  }

  static template = hbs`
    <a href="javascript:;" class="" {{on "click" this.selectFacet}}>
      {{@item.value}}&nbsp;
      <span class="">({{@item.count}})</span>
    </a>
  `;
}
