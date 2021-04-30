import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmer/modifier';
import { Pager, Options } from '../interfaces';
import PaginationControls from './pagination-controls';
import SearchInput from './search-input';
import AdvancedQueryInput from './advanced-search/advanced-query-input';
// import Drawer from './.ignore.drawer';
import { uuidv4 } from '../utils/utils';

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

  id: string = uuidv4();
  topId: string = `${this.id}-top`;
  bottomId: string = `${this.id}-bottom`;

  @tracked isOpen: boolean = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    // const top = document.getElementById(this.topId);

    // top.style['max-height'] = `${top.scrollHeight}px`;
  }

  @action
  toggleDrawer() {
    this.isOpen = !this.isOpen;

    const topDrawer = document.getElementById(this.topId);
    const bottomDrawer = document.getElementById(this.bottomId);

    if (this.isOpen) {
      topDrawer.style['max-height'] = '0px';
      bottomDrawer.style['max-height'] = `${bottomDrawer.scrollHeight * 2}px`;
    } else {
      topDrawer.style['max-height'] = `${topDrawer.scrollHeight * 2}px`;
      bottomDrawer.style['max-height'] = '0px';
    }
  }

  static template = hbs`
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div class="flex flex-col place-content-center">
        <div
          id={{this.topId}}
          class="flex flex-col lg:flex-row justify-between items-center overflow-hidden transition-all ease-in-out duration-300"
        >
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
        {{#if @hasAdvancedSearch}}
          <div class="flex items-center mx-auto">
            <button
              class="flex items-center place-content-center hover:bg-gray-200 focus:bg-gray-200 p-4 z-50 mb-2"
              {{on "click" this.toggleDrawer}}
            >
              {{#if this.isOpen}}
                <div class="text-blue-heritage">
                  Basic search
                </div>
                <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 15l7-7 7 7" />
                </svg>
              {{else}}
                <div class="text-blue-heritage">
                  Advanced search
                </div>
                <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              {{/if}}
            </button>
          </div>
          <div
            id={{this.bottomId}}
            class="flex flex-col place-content-center relative overflow-hidden transition-all ease-in-out duration-300 max-h-0"
          >
            <AdvancedQueryInput
              @applySearchTerms={{@applySearchTerms}}
              @searchTerms={{@searchTerms}}
            />
          </div>
        {{/if}}
      </div>
    </div>
  `;
}
