import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { Facet } from '../models/facet';
import { FacetValue  } from '../interfaces';

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
    <button {{on "click" this.selectFacet}} class="py-1 px-3 flex items-center {{if this.isSelected "bg-blue-spirit rounded-full text-black hover:bg-gray-200"}}">
      {{@item.value}}&nbsp;
      <span class="mr-3">({{@item.count}})</span>
      {{#if this.isSelected}}
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      {{/if}}
    </button>
  `;
}
