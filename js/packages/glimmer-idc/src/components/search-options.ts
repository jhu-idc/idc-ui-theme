import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { Pager } from '../interfaces';
import { is } from '../utils/helpers';

interface Args {
  changeSearchOptions: (options: {}) => {};
  pager: Pager;
  sortBy: string | null;
  sortOrder: string | null;
  itemsPerPage: string | null;
  resetOptions: () => {};
}

export default class SearchOptions extends Component<Args> {
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
    {
      value: '&sort_by=field_years',
      displayValue: 'Date',
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
    const length = this.args.pager.total_pages;
    const pages = Array.from({ length }, (_, i) => 1 + i);

    return pages;
  }

  @action
  updateMenuDisplay() {
    this.displayMenu = !this.displayMenu;
  }

  @action
  handleSortByChange(e: Event) {
    this.args.changeSearchOptions({ sortBy: (e.target as HTMLInputElement).value });
  }

  @action
  handleSortOrderChange(e: Event) {
    this.args.changeSearchOptions({ sortOrder: (e.target as HTMLInputElement).value });
  }

  @action
  handleCurrentPageChange(e: Event) {
    this.args.changeSearchOptions({ currentPage: Number((e.target as HTMLInputElement).value) });
  }

  @action
  handleItemsPerPageChange(e: Event) {
    this.args.changeSearchOptions({ itemsPerPage: Number((e.target as HTMLInputElement).value) });
  }

  static template = hbs`
    <div class="text-left ml-0" data-test-search-options>
      <div class="flex my-4 px-4 justify-between text-black">
        <h3 class="text-lg">List Options</h3>
        <button class="" {{on "click" @resetOptions}}>Clear</button>
      </div>
      <div class="bg-white shadow divide-y divide-gray-100 px-10 py-2 outline-none">
        <div class="flex flex-col h-full justify-between my-4">
          <div class="my-2">
            <label class="block text-sm text-gray-700 hidden" for="sort-by">
              Sort by
            </label>
            <select
              id="sort-by"
              class="idc-dropdown"
              name="sort-by"
              {{on "change" this.handleSortByChange}}
            >
              <option value="" disabled={{this.args.sortBy}} selected>Sort by</option>
              {{#each this.sortByOptions as |selectOption|}}
                <option value={{selectOption.value}} selected={{is this.args "sortBy" selectOption.value}}>Sort by: {{selectOption.displayValue}}</option>
              {{/each}}
            </select>
            <label class="block text-sm text-gray-700 hidden" for="sort-order">
              Sort Order
            </label>
            <select
              id="sort-order"
              class="idc-dropdown"
              name="sort-order"
              {{on "change" this.handleSortOrderChange}}
            >
              <option value="" disabled={{this.args.sortOrder}} selected>Sort order</option>
              {{#each this.sortOrderOptions as |selectOption|}}
                <option value={{selectOption.value}} selected={{is this.args "sortOrder" selectOption.value}}>Sort order: {{selectOption.displayValue}}</option>
              {{/each}}
            </select>
            <label class="block text-sm text-gray-700 hidden" for="items-per-page">
              Items Per Page
            </label>
            <select
              id="items-per-page"
              class="idc-dropdown"
              name="items-per-page"
              {{on "change" this.handleItemsPerPageChange}}
            >
              <option value="" disabled={{this.args.itemsPerPage}} selected>Items per page</option>
              {{#each this.itemsPerPage as |numItems|}}
                <option value={{numItems}} selected={{is this.args "itemsPerPage" numItems}}>Items per page: {{numItems}}</option>
              {{/each}}
            </select>
            <label class="block text-sm text-gray-700 hidden" for="current-page">
              Go to page
            </label>
            <select
              id="current-page"
              class="idc-dropdown"
              name="current-page"
              {{on "change" this.handleCurrentPageChange}}
            >
              <option value="" disabled selected>Go to page</option>
              {{#each this.pages as |page|}}
                <option value={{page}} selected={{is this.args.pager "current_page" page}}>Go to page: {{page}}</option>
              {{/each}}
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}
