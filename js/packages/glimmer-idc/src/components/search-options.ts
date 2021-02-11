import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { Options, Pager } from '../interfaces';
import { is } from '../utils/helpers';

interface Args {
  applySearchOptions: () => {};
  changeSearchOptions: (options: {}) => {};
  pager: Pager;
  sortBy: string | null;
  sortOrder: string | null;
  itemsPerPage: string | null;
}

export default class SearchOptions extends Component<Args> {
  @service results;

  @tracked options: Options = {
    sortBy: this.args.sortBy,
    sortOrder: this.args.sortOrder,
    itemsPerPage: null,
    currentPage: this.args.pager.current_page,
  };
  @tracked displayMenu: boolean = false;

  sortByOptions: {}[] = [
    {
      value: '&sort_by=search_api_relevance',
      displayValue: 'Relevance',
    },
    {
      value: '&sort_by=title',
      displayValue: 'Title',
    },
  ];

  sortOrderOptions: {}[] = [
    {
      value: '&sort_order=ASC',
      displayValue: 'Ascending',
    },
    {
      value: '&sort_order=DESC',
      displayValue: 'Descending',
    },
  ];

  itemsPerPage: number[] = [5, 10, 25, 50];

  get pages() {
    const length = this.results.pager.total_pages;
    const pages = Array.from({ length }, (_, i) => 1 + i);

    return pages;
  }

  @action
  updateMenuDisplay() {
    this.displayMenu = !this.displayMenu;
  }

  @action
  handleSortByChange(e: Event) {
    // this.options.sortBy = (<HTMLInputElement>e.target).value;
    this.args.changeSearchOptions({ sortBy: (<HTMLInputElement>e.target).value });
  }

  @action
  handleSortOrderChange(e: Event) {
    // this.options.sortOrder = (<HTMLInputElement>e.target).value;
    this.args.changeSearchOptions({ sortOrder: (<HTMLInputElement>e.target).value });
  }

  @action
  handleCurrentPageChange(e: Event) {
    // this.options.currentPage = Number((<HTMLInputElement>e.target).value);
    this.args.changeSearchOptions({ currentPage: Number((<HTMLInputElement>e.target).value) });
  }

  @action
  handleItemsPerPageChange(e: Event) {
    // this.options.itemsPerPage = Number((<HTMLInputElement>e.target).value);
    this.args.changeSearchOptions({ itemsPerPage: Number((<HTMLInputElement>e.target).value) });
  }

  @action
  handleApplySearchOptions() {
    this.displayMenu = !this.displayMenu;

    // debugger;
    // this.args.applySearchOptions(this.options);
    this.args.applySearchOptions();
  }

  static template = hbs`
    <div class="relative inline-block text-left ml-0 2xl:ml-6 z-50">
      <span class="rounded-md shadow-sm">
        <button
          class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 hover:text-gray-700 hover:bg-gray-200 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
          {{on "click" this.updateMenuDisplay}}
        >
          <span>Options</span>
          <svg
            class="w-5 h-5 ml-2 -mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </span>
      {{#if this.displayMenu}}
        <div
          class="absolute right-0 w-screen max-w-sm mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 p-4 shadow-lg outline-none"
        >
          <div class="flex flex-col h-full justify-between">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="sort-by">
            Sort by
            </label>
            <select
              class="mb-2 inline-flex hover:bg-gray-200 justify-center w-full px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
              name="sort-by"
              {{on "change" this.handleSortByChange}}
            >
              <option value="" disabled selected>Please make a selection ...</option>
              {{#each this.sortByOptions as |selectOption|}}
                <option value={{selectOption.value}} selected={{is this.args "sortBy" selectOption.value}}>{{selectOption.displayValue}}</option>
              {{/each}}
            </select>
            <label class="block text-sm font-medium text-gray-700" for="sort-order">
              Sort Order
            </label>
            <select
              class="mb-2 inline-flex hover:bg-gray-200 justify-center w-full px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
              name="sort-order"
              {{on "change" this.handleSortOrderChange}}
            >
              <option value="" disabled selected>Please make a selection ...</option>
              {{#each this.sortOrderOptions as |selectOption|}}
                <option value={{selectOption.value}} selected={{is this.args "sortOrder" selectOption.value}}>{{selectOption.displayValue}}</option>
              {{/each}}
            </select>
            <label class="block text-sm font-medium text-gray-700" for="items-per-page">
              Items Per Page
            </label>
            <select
              class="mb-2 inline-flex hover:bg-gray-200 justify-center w-full px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
              name="items-per-page"
              {{on "change" this.handleItemsPerPageChange}}
            >
              <option value="" disabled selected>Please make a selection ...</option>
              {{#each this.itemsPerPage as |numItems|}}
                <option value={{numItems}} selected={{is this.args "itemsPerPage" numItems}}>{{numItems}}</option>
              {{/each}}
            </select>
            <label class="block text-sm font-medium text-gray-700" for="current-page">
              Current Page
            </label>
            <select
              class="mb-4 inline-flex hover:bg-gray-200 justify-center w-full px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
              name="current-page"
              {{on "change" this.handleCurrentPageChange}}
            >
              <option value="" disabled selected>Please make a selection ...</option>
              {{#each this.pages as |page|}}
                <option value={{page}} selected={{is this.args.pager "current_page" page}}>{{page}}</option>
              {{/each}}
            </select>
          </div>
            <div class="flex bg-gray-100 p-4 -mx-4 -mb-4 justify-between">
              <button
                class="inline-flex items-center px-3 py-2 h-10 border border-transparent text-sm leading-4 font-medium bg-white border-gray-300 hover:text-gray-500 hover:bg-gray-200"
                {{on "click" this.updateMenuDisplay}}
              >
                Cancel
              </button>
              <button
                {{on "click" this.handleApplySearchOptions}}
                class="inline-flex items-center px-3 py-2 h-10 border border-transparent text-sm leading-4 font-medium text-white bg-blue-heritage hover:bg-blue-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      {{/if}}
    </div>
  `;
}
