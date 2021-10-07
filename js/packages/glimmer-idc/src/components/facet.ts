
import Component from '@glimmer/component';
import { tracked } from '@glimmerx/component';
import { setComponentTemplate, precompileTemplate } from '@glimmer/core';
import { action, on } from '@glimmer/modifier';
import { Facet as FacetModel } from '../models/facet';
import { FacetValue  } from '../interfaces';
import FacetItem from './facet-item';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface Args {
  facet: FacetModel;
  facetSelected: (s: FacetValue) => void;
  selectedFacets: FacetValue[];
  startOpened: boolean;
}

export default class Facet extends Component<Args> {
  @tracked isOpen: boolean = true;
  @tracked guid: number = Math.random();

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.isOpen = this.args.startOpened;
  }

  @action
  toggleList() {
    this.isOpen = !this.isOpen;
  }
};

setComponentTemplate(
  precompileTemplate(
  `
  <div class="bg-white shadow my-4" data-test-facets-category>
    <button
      class="flex w-full justify-between py-2 px-4 border-b hover:bg-gray-100 focus:bg-gray-100"
      {{on "click" this.toggleList}}
    >
      <div class="text-lg text-gray-500">
        {{@facet.label}}
      </div>
      {{#if this.isOpen}}
        <ChevronUpIcon @styles="h-6 w-6 text-gray-500" />
      {{else}}
        <ChevronDownIcon @styles="h-6 w-6 text-gray-500" />
      {{/if}}
    </button>
    <ul
      id={{this.guid}}
      class="flex flex-col px-8 overflow-x-hidden overflow-y-auto transition-all ease-in-out duration-500 {{if this.isOpen "max-h-80" "max-h-0"}}"
    >
      <div class="py-2 space-y-1">
      {{#each @facet.items as |item|}}
        <li>
          <FacetItem
            @facet={{@facet}}
            @item={{item}}
            @onClick={{@facetSelected}}
            @selectedFacets={{@selectedFacets}}
          />
        </li>
      {{/each}}
      </div>
    </ul>
  </div>
  `,
  { strictMode: true }
  ),
  Facet
)
