import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { CollectionSuggestion, Options } from '../interfaces';
import { ResultsService } from '../utils/results';
import AdvancedSearchFilters from './advanced-search/advanced-search-filters';
import FacetList from './facet-list';
import List from './list';
import ListSpinner from './list-spinner';
import PaginationControls from './pagination-controls';
import SearchOptions from './search-options';
import TitleBar from './title-bar';
import { Facet } from '../models/facet';
import { FacetValue } from '../interfaces';
import { facetValueIncludes, removeSelectedItem } from '../utils/facet-utils';

interface Args {}

export const ELEMENT_ID: string = 'idc-search';

export default class IDCSearch extends Component<Args> {
  @service results: ResultsService;

  hasAdvancedSearch: boolean = false;

  @tracked isLoading: boolean = false;
  @tracked list: {}[] = [];
  @tracked facets: Facet[] = [];
  @tracked hasFacets: boolean = false;

  // These properties should be populated through data attributes
  /** Attribute data-title */
  @tracked title: string = '';
  /** Attribute data-collection-id */
  @tracked collectionId: string = '';
  /** Attribute data-search-placeholder */
  @tracked searchInputPlaceholder: string = '';
  /** Attribute data-pagination-label */
  @tracked paginationItemLabel: string = '';

  @tracked activeCollectionFilter: boolean = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    const el = document.getElementById(ELEMENT_ID);

    this.collectionId = el.dataset.collectionId;
    this.title = el.dataset.title;
    this.searchInputPlaceholder = el.dataset.searchPlaceholder;
    this.paginationItemLabel = el.dataset.paginationLabel;
    this.hasAdvancedSearch = !!el.dataset.enableAdvancedSearch;

    this.results.initFromUrl(document.location.href);
    this.doSearch();
  }

  async doSearch() {
    this.isLoading = true;
    await this.results.fetchData();

    this.list = this.results.rows;
    this.isLoading = false;

    this.facets = this.results.facets;
    this.hasFacets = this.results.facets.length > 0;
  }

  @action
  goToPage(page: number) {
    this.results.pager.current_page = page;
    this.doSearch();
  }

  @action
  prevPage() {
    this.results.pager.current_page = --this.results.pager.current_page;
    this.doSearch();
  }

  @action
  nextPage() {
    this.results.pager.current_page = ++this.results.pager.current_page;
    this.doSearch();
  }

  @action
  changeSearchOptions(options: Options) {
    Object.entries(options).map(([key, value]: [string, string | number | null], i) => {
      if (key === 'currentPage') {
        this.results.pager.current_page = Number(value) === 1 ? 0 : Number(value);
      } else {
        this.results[key] = value;
      }
    });

    this.doSearch();
  }

  @action
  applySearchTerms(searchTerms?: string) {
    this.results.searchTerms = searchTerms;
    this.doSearch();
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

    this.doSearch();
  }

  @action
  resetOptions() {
    this.changeSearchOptions({
      sortBy: null,
      sortOrder: null,
      itemsPerPage: 0,
      currentPage: 0
    });
  }

  @action
  resetFilters() {
    this.results.selectedFacets = [];
    this.results.nodeFilters = [];

    this.doSearch();
  }

  /**
   * @param collections list of CollectionSuggestions selected by the user
   */
  @action
  collectionFilterSelected(collections: CollectionSuggestion[]) {
    this.results.nodeFilters = collections;
    this.doSearch();
  }

  hasActiveFilters() {
    return this.results.selectedFacets.length > 0 || this.activeCollectionFilter;
  }

  static template = hbs`
    <div class="grid md:gap-4 grid-cols-1 md:grid-cols-4 container mx-auto">
      <div class="col-span-1">
        <SearchOptions
          @pager={{this.results.pager}}
          @sortBy={{this.results.sortBy}}
          @sortOrder={{this.results.sortOrder}}
          @itemsPerPage={{this.results.itemsPerPage}}
          @changeSearchOptions={{this.changeSearchOptions}}
          @resetOptions={{this.resetOptions}}
        />
        <div>
          <div class="flex my-4 px-4 justify-between text-black">
            <h3 class="text-lg">Filters</h3>
            {{#if this.hasActiveFilters}}
              <button class="" {{on "click" this.resetFilters}}>Clear</button>
            {{/if}}
          </div>
          {{#if hasAdvancedSearch}}
            <AdvancedSearchFilters
              @collectionFilterSelected={{this.collectionFilterSelected}}
            />
          {{/if}}
          <FacetList
            @facets={{this.facets}}
            @hasFacets={{this.hasFacets}}
            @facetSelected={{this.facetSelected}}
            @selectedFacets={{this.results.selectedFacets}}
          />
        </div>
      </div>
      <div class="col-span-3">
        <div class="bg-white shadow mb-4">
          <TitleBar
            @title={{this.title}}
            @pager={{this.results.pager}}
            @goToPage={{this.goToPage}}
            @prevPage={{this.prevPage}}
            @nextPage={{this.nextPage}}
            @searchTerms={{this.results.searchTerms}}
            @applySearchTerms={{this.applySearchTerms}}
            @searchInputPlaceholder={{this.searchInputPlaceholder}}
            @paginationItemLabel={{this.paginationItemLabel}}
            @hasAdvancedSearch={{this.hasAdvancedSearch}}
          />
          {{#if this.isLoading}}
            <ListSpinner />
          {{else}}
            <List @list={{this.list}} />
          {{/if}}
        </div>
        <div class="flex bg-white shadow p-4 items-center justify-center">
          <PaginationControls
            @compact={{true}}
            @pager={{this.results.pager}}
            @goToPage={{this.goToPage}}
            @prevPage={{this.prevPage}}
            @nextPage={{this.nextPage}}
            @itemLabel={{this.paginationItemLabel}}
          />
        </div>
      </div>
    </div>
  `;
}
