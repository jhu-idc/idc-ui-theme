import Component, { hbs, tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';
import Facet from '../models/facet';
import FacetItem from './facet-item';

interface Args {
  facets: Facet[];
  hasFacets: boolean;
}

export default class Facets extends Component<Args> {
  @tracked selectedFacets: Facet[];

  /**
   * Get a string query representing the currently selected facets
   */
  facetsToQuery(): string {
    return '';
  }

  @action
  clickFacet(facet: Facet) {
    debugger;
  }

  static template = hbs`
    <div class="">
      {{#each @facets as |facet|}}
        <div class="border bg-white shadow my-4 p-4">
          <h3 class="text-lg font-bold">
            {{facet.key}}
          </h3>
          <ul class="my-2 mx-4">
            {{#each facet.items as |item|}}
              <li class="">
                <FacetItem @facet={{item}} @onClick={{this.clickFacet}} />
              </li>
            {{/each}}
          </ul>
        </div>
      {{/each}}
    </div>
  `;
}
