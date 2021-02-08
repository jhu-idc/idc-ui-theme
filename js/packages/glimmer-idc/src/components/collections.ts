import Component, { hbs, tracked } from '@glimmerx/component';
import FacetList from './facet-list';
import TitleBar from './title-bar';
import List from './list';
import ListItem from './list-item';
import ListSpinner from './list-spinner';
import PaginationControls from './pagination-controls';
import { SearchApiResponse, Pager } from '../interfaces';
import { action } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { Facet, FacetValue } from '../models/facet';
import { facetValueIncludes, removeSelectedItem } from '../utils/facet-utils';

interface Args {}
export default class Collections extends Component<Args> {
  @service results;
  @tracked title: string = 'All Collections';
  @tracked isLoading: boolean = false;
  @tracked list: {}[] = [];

  // Facet stuffs
  @tracked facets: Facet[] = [];
  @tracked hasFacets: boolean = false;

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    // TODO: this should read the page URL to check for correct page to load
    this.fetchCollections(0);
  }

  async fetchCollections(page: number) {
    this.isLoading = true;

    await this.results.fetchData(page);

    this.list = this.results.rows;

    this.isLoading = false;

    // Load facets after loading overall search results
    await this.results.fetchFacets();
    this.facets = this.results.facets;
    this.hasFacets = this.results.facets.length > 0;
  }

  @action
  goToPage(page: number) {
    this.results.pager.current_page = page;
    this.fetchCollections(page);
  }

  @action
  prevPage() {
    this.results.pager.current_page = --this.results.pager.current_page;
    this.fetchCollections(this.results.pager.current_page);
  }

  @action
  nextPage() {
    this.results.pager.current_page = ++this.results.pager.current_page;
    this.fetchCollections(this.results.pager.current_page);
  }

  /**
   * Toggle a facet. Add the selected facet to the search query, or if the facet is already
   * part of the search query, remove it
   *
   * @param item facet that the user selected
   */
  @action
  facetSelected(item: FacetValue) {
    if (facetValueIncludes(item, this.results.selectedFacets)) {
      this.results.selectedFacets = removeSelectedItem(item, this.results.selectedFacets);
    } else {
      this.results.selectedFacets.push(item);
    }

    this.fetchCollections(this.results.pager.current_page);
  }

  static template = hbs`
    <div class="grid sm:gap-4 grid-cols-1 sm:grid-cols-3 container mx-auto">
      <FacetList class="col-span-1"
        @facets={{this.facets}}
        @hasFacets={{this.hasFacets}}
        @facetSelected={{this.facetSelected}}
      />
      <div class="col-span-2">
        <div class="bg-white shadow mb-4">
          <TitleBar
            @title={{this.title}}
            @pager={{this.results.pager}}
            @goToPage={{this.goToPage}}
            @prevPage={{this.prevPage}}
            @nextPage={{this.nextPage}}
          />
          {{#if this.isLoading}}
            <ListSpinner />
          {{else}}
            <List @list={{this.list}} />
          {{/if}}
        </div>
        <div class="flex bg-white shadow p-4 items-center justify-center">
          <PaginationControls
            @pager={{this.results.pager}}
            @goToPage={{this.goToPage}}
            @prevPage={{this.prevPage}}
            @nextPage={{this.nextPage}}
          />
        </div>
      </div>
    </div>
  `;
}
