import Component, { hbs } from '@glimmerx/component';
import { fn } from '@glimmerx/helper';
import { Facet } from '../models/facet';
import { getFieldLabel } from '../utils/facet-utils';
import FacetItem from './facet-item';

interface Args {
  facets: Facet[];
  hasFacets: boolean;
}

export default class FacetList extends Component<Args> {
  static template = hbs`
    <div class="">
      {{#each @facets as |facet|}}
        <div class="border bg-white shadow my-4 p-4">
          <h3 class="text-lg font-bold">
            {{facet.label}}
          </h3>
          <ul class="my-2 mx-4">
            {{#each facet.items as |item|}}
              <li class="">
                <FacetItem @facet={{facet}} @item={{item}} @onClick={{@facetSelected}} />
              </li>
            {{/each}}
          </ul>
        </div>
      {{/each}}
    </div>
  `;
}
