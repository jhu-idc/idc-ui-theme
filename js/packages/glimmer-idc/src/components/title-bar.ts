import Component, { hbs } from '@glimmerx/component';
import PaginationControls from './pagination-controls';
import { Pager, Options } from '../interfaces';
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
}

export default class TitleBar extends Component<Args> {
  static template = hbs`
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      {{#if this.hasAdvancedSearch}}
        <div class="flex flex-col lg:flex-row justify-between items-center">
          <div class="flex flex-col 2xl:flex-row items-center lg:mr-6 mb-4 lg:mb-0 w-full justify-between">
            <h2 class="text-xl font-bold leading-6 mb-2 2xl:mb-0 mr-4">
              {{@title}}
            </h2>
            <SearchInput
              @placeholder={{@searchInputPlaceholder}}
              @applySearchTerms={{@applySearchTerms}}
              @searchTerms={{@searchTerms}}
            />
          </div>
          <div class="flex flex-col 2xl:flex-row items-center flex-shrink-0 items-center">
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
      {{else}}
        <div class="">
          <AdvancedQueryInput
            @applySearchTerms={{@applySearchTerms}}
            @searchTerms={{@searchTerms}}
          />
        </div>
      {{/if}}
    </div>
  `;
}
