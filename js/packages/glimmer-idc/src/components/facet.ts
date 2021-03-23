import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { Facet as FacetModel } from '../models/facet';
import { FacetValue  } from '../interfaces';
import FacetItem from './facet-item';

interface Args {
  facet: FacetModel;
  facetSelected: (s: FacetValue) => void;
  selectedFacets: FacetValue[];
}

export default class Facet extends Component<Args> {
  @tracked isOpen: boolean = true;
  @tracked guid: number = Math.random();

  @action
  toggleList() {
    if (!this.isOpen) {
      this.isOpen = !this.isOpen;

      const facet = document.getElementById(this.guid);

      facet.style['max-height'] = `${facet.scrollHeight}px`
    } else {
      this.isOpen = !this.isOpen;

      const facet = document.getElementById(this.guid);

      facet.style['max-height'] = '0';
    }
  }

  static template = hbs`
    <div class="bg-white shadow my-4">
      <button
        class="flex w-full justify-between py-2 px-4 border-b hover:bg-gray-100 focus:bg-gray-100"
        {{on "click" this.toggleList}}
      >
        <div class="text-lg text-gray-500">
          {{@facet.label}}
        </div>
        {{#if this.isOpen}}
          <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 15l7-7 7 7" />
          </svg>
        {{else}}
          <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        {{/if}}
      </button>
      <ul id={{this.guid}} class="flex flex-col px-8 overflow-hidden transition-all ease-in-out duration-500">
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
  `;
}
