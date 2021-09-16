import Component, { hbs } from '@glimmerx/component';
import { on } from '@glimmerx/modifier';
import { Facet as FacetModel } from '../models/facet';
import { FacetValue } from '../interfaces';
import Facet from './facet';

interface Args {
  facets: FacetModel[];
  facetSelected: {};
  selectedFacets: FacetValue[];
}

export default class FacetList extends Component<Args> {

  static template = hbs`
    <div data-test-facets-container>
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
