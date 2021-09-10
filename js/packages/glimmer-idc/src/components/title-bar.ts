import Component, { hbs, tracked } from '@glimmerx/component';
import PaginationControls from './pagination-controls';
import { Pager, Options, JsonApiUserResponse } from '../interfaces';
import SearchInput from './search-input';
import AdvancedQueryInput from './advanced-search/advanced-query-input';

interface Args {
  title: string;
  pager: Pager;
  goToPage: (page: number) => {};
  prevPage: () => {};
  nextPage: () => {};
  applySearchTerms: (searchTerms?: string) => {};
  searchTerms: string;
  searchInputPlaceholder: string | null;
  paginationItemLabel: string;
  hasAdvancedSearch: boolean;
  query: string;
  searchType: string;
}

export default class TitleBar extends Component<Args> {
  @tracked isAuthenticated: boolean = false;

  get itemsExportUrl() {
    return `/export_items?${this.args.query}`;
  }

  get collectionsExportUrl() {
    return `/export_collections?${this.args.query}`;
  }

  get isCollections() {
    return this.args.searchType === 'collections';
  }

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.fetchUser();
  }

  async fetchUser() {
    let res: Response = await fetch('/jsonapi');
    let data: JsonApiUserResponse = await res.json();

    if (data && data.meta && data.meta.links && data.meta.links.me && data.meta.links.me.meta && data.meta.links.me.meta.id) {
      this.isAuthenticated = !!data.meta.links.me.meta.id;
    }
  }

  static template = hbs`
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      {{#if @hasAdvancedSearch}}
        <div class="">
          <AdvancedQueryInput
            @applySearchTerms={{@applySearchTerms}}
            @searchTerms={{@searchTerms}}
          />
        </div>
      {{else}}
        <div
          class="flex flex-col 2xl:flex-row justify-between items-center space-y-2"
          data-test-search-title-bar
        >
          <div class="flex flex-col 2xl:flex-row items-center lg:mr-6 mb-4 lg:mb-0 w-full justify-between">
            <h2 class="text-xl font-bold leading-6 mb-2 2xl:mb-0 mr-4">
              {{#if @title}}
                {{@title}}
              {{else}}
                Search Results
              {{/if}}
            </h2>
            <SearchInput
              @placeholder={{@searchInputPlaceholder}}
              @applySearchTerms={{@applySearchTerms}}
              @searchTerms={{@searchTerms}}
            />
          </div>
          <div class="flex flex-col 2xl:flex-row items-center flex-shrink-0">
            <div class="mb-2 2xl:mb-0">
              <PaginationControls
                @compact={{true}}
                @pager={{@pager}}
                @goToPage={{@goToPage}}
                @prevPage={{@prevPage}}
                @nextPage={{@nextPage}}
                @itemLabel={{@paginationItemLabel}}
              />
            </div>
          </div>
        </div>
      {{/if}}
      {{#if this.isAuthenticated}}
        <div class="flex space-x-4 justify-center 2xl:justify-start">
          {{#unless this.isCollections}}
            <a href={{this.itemsExportUrl}}>Export Item Metadata</a>
          {{/unless}}
          <a href={{this.collectionsExportUrl}}>Export Collection Metadata</a>
        </div>
      {{/if}}
    </div>
  `;
}
