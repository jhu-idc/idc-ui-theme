import Component, { hbs, tracked } from '@glimmerx/component';
import Facets from './facets';
import TitleBar from './title-bar';
import List from './list';
import ListItem from './list-item';
import ListSpinner from './list-spinner';
import PaginationControls from './pagination-controls';
import { SearchApiResponse, Pager } from '../interfaces'
import { action } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { Options } from '../interfaces';

interface Args {}
export default class Collections extends Component<Args> {
  @service results;
  @tracked title: string = 'All Collections';
  @tracked isLoading: boolean = false;
  @tracked list: {}[] = [];

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    this.fetchCollections();
  }

  async fetchCollections() {
    this.isLoading = true;

    await this.results.fetchData();

    this.list = this.results.rows;

    this.isLoading = false;
  }

  @action
  goToPage(page: number) {
    this.results.pager.current_page = page;
    this.fetchCollections();
  }

  @action
  prevPage() {
    this.results.pager.current_page = --this.results.pager.current_page;
    this.fetchCollections();
  }

  @action
  nextPage() {
    this.results.pager.current_page = ++this.results.pager.current_page;
    this.fetchCollections();
  }

  @action
  applySearchOptions(options: Options) {
    Object.entries(options).map(([key, value]: [string, string | number | null], i) => {
      if (key === 'currentPage') {
        this.results.pager.current_page = Number(value) === 1 ? 0 : Number(value) ;
      } else {
        this.results[key] = value;
      }
    });

    this.fetchCollections();
  }

  @action
  applySearchTerms(searchTerms?: string) {
    this.results.searchTerms = searchTerms;

    this.fetchCollections();
  }

  static template = hbs`
    <div class="grid sm:gap-4 grid-cols-1 sm:grid-cols-3 container mx-auto">
      <Facets class="col-span-1" />
      <div class="col-span-2">
        <div class="bg-white shadow mb-4">
          <TitleBar
            @title={{this.title}}
            @pager={{this.results.pager}}
            @goToPage={{this.goToPage}}
            @prevPage={{this.prevPage}}
            @nextPage={{this.nextPage}}
            @applySearchOptions={{this.applySearchOptions}}
            @sortBy={{this.results.sortBy}}
            @sortOrder={{this.results.sortOrder}}
            @itemsPerPage={{this.results.itemsPerPage}}
            @applySearchTerms={{this.applySearchTerms}}
            @searchInputPlaceholder='Search collections ...'
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
          />
        </div>
      </div>
    </div>
  `;
}
