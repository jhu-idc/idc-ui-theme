import Component from '@glimmer/component';
import { setComponentTemplate, precompileTemplate } from '@glimmer/core';
import { on } from '@glimmerx/modifier';
import { Facet as FacetModel } from '../models/facet';
import { FacetValue } from '../interfaces';
import Facet from './facet';

interface Args {
  facets: FacetModel[];
  facetSelected: {};
  selectedFacets: FacetValue[];
  startOpened: boolean;
}

export default class FacetList extends Component<Args> {}

setComponentTemplate(
  precompileTemplate(
  `
    <div data-test-facets-container>
      {{#each @facets as |facet|}}
        <Facet
          @facet={{facet}}
          @facetSelected={{@facetSelected}}
          @selectedFacets={{@selectedFacets}}
          @startOpened={{@startOpened}}
        />
      {{/each}}
    </div>
  `,
  { strictMode: true }
  ),
  FacetList,
);

