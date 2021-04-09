import Component, { hbs } from '@glimmerx/component';
import { on } from '@glimmerx/modifier';
import { Facet as FacetModel } from '../models/facet';
import { FacetValue } from '../interfaces';
import Facet from './facet';

interface Args {
  facets: FacetModel[];
  facetSelected: {};
  selectedFacets: FacetValue[];
  resetFacets: () => {};
}

export default class FacetList extends Component<Args> {
  static template = hbs`
    <div>
      <div class="flex my-4 px-4 justify-between text-black">
        <h3 class="text-lg">Filters</h3>
        <button class="" {{on "click" @resetFacets}}>Clear</button>
      </div>
      {{#each @facets as |facet|}}
        <Facet
          @facet={{facet}}
          @facetSelected={{@facetSelected}}
          @selectedFacets={{@selectedFacets}}
        />
      {{/each}}
    </div>
  `;
}
