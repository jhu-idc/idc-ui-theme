import Component, { hbs, tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { Options } from '../interfaces';
import { ResultsService } from '../utils/results';
import Facets from './facets';
import List from './list';
import ListSpinner from './list-spinner';
import PaginationControls from './pagination-controls';
import SearchOptions from './search-options';
import TitleBar from './title-bar';

interface Args {}

export default class Collection extends Component<Args> {
  @service results: ResultsService;

  @tracked isLoading: boolean = false;
  @tracked list: {}[] = [];

  title: string = '(Moo)';

  constructor(owner: unknown, args: Args) {
    super(...arguments);
    debugger;
    this.fetchCollection();
  }

  async fetchCollection() {
    this.isLoading = true;
    await this.results.fetchData();

    this.list = this.results.rows;
    this.isLoading = false;
  }

  @action
  goToPage(page: number) {
    this.results.pager.current_page = page;
    this.fetchCollection();
  }

  @action
  prevPage() {
    this.results.pager.current_page = --this.results.pager.current_page;
    this.fetchCollection();
  }

  @action
  nextPage() {
    this.results.pager.current_page = ++this.results.pager.current_page;
    this.fetchCollection();
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

    this.fetchCollection();
  }

  @action
  applySearchTerms(searchTerms?: string) {
    this.results.searchTerms = searchTerms;

    this.fetchCollection();
  }

  static template = hbs`
    <div class="grid sm:gap-4 grid-cols-1 sm:grid-cols-4 container mx-auto">
      <div class="col-span-1">
        <SearchOptions
          @pager={{this.results.pager}}
          @sortBy={{this.results.sortBy}}
          @sortOrder={{this.results.sortOrder}}
          @itemsPerPage={{this.results.itemsPerPage}}
          @changeSearchOptions={{this.changeSearchOptions}}
        />
        <Facets />
      </div>
      <div class="col-span-3">
        <div class="bg-white shadow mb-4">
          <TitleBar
            @title={{this.title}}
            @pager={{this.results.pager}}
            @goToPage={{this.goToPage}}
            @prevPage={{this.prevPage}}
            @nextPage={{this.nextPage}}
            @applySearchTerms={{this.applySearchTerms}}
            @searchInputPlaceholder={{'Search collections ...'}}
            @paginationItemLabel={{'collections'}}
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
            @itemLabel={{'collections'}}
          />
        </div>
      </div>
    </div>
  `;
}
