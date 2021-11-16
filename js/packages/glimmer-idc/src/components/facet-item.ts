import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { Facet } from '../models/facet';
import { FacetValue  } from '../interfaces';
import { XIcon } from './icons';

interface Args {
  facet: Facet;
  item: FacetValue;
  onClick: (s: FacetValue) => void;
  selectedFacets: FacetValue[];
}

export default class FacetItem extends Component<Args> {
  @tracked selectedFacets = this.args.selectedFacets || [];

  get isSelected() {
    let isSelected = false;

    isSelected = this.args.selectedFacets.filter(selectedFacet => {
      return selectedFacet.key === this.args.item.key && selectedFacet.value === this.args.item.value;
    }).length > 0;

    return isSelected;
  }

  @action
  selectFacet() {
    this.args.onClick(this.args.item);
  }

  static template = hbs`
    <button
      {{on "click" this.selectFacet}}
      class="py-1 px-3 flex items-center rounded-full text-left text-black hover:bg-gray-200 {{if this.isSelected "bg-blue-spirit"}}"
      data-test-facet-value
    >
      <div class="line-clamp-2">
        {{@item.value}}&nbsp;
      </div>
      <span class="mr-3">({{@item.count}})</span>
      {{#if this.isSelected}}
        <XIcon @styles="h-5 w-5" />
      {{/if}}
    </button>
  `;
}
