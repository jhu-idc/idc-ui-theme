import Component, { hbs } from '@glimmerx/component';
import { tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { fn } from '@glimmerx/helper';
import { SearchIcon } from './icons';

interface Args {
  applySearchTerms: (searchTerms?: string) => {};
  resetFilters: () => {};
  searchTerms: string;
  placeholder?: string;
}
export default class SearchInput extends Component<Args> {
  @tracked searchTerms: string = '';

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.searchTerms = args.searchTerms;
  }

  @action
  updateSearchTerms(e: Event) {
    this.searchTerms = (e.target as HTMLInputElement).value;
  }

  @action
  submitOnEnter(e: Event) {
    if ((<any>e).which === 13) {
      this.submit();
    }
  }

  @action
  submit() {
    this.args.resetFilters();
    this.args.applySearchTerms(this.searchTerms);
  }

  static template = hbs`
    <div
      class="flex flex-col flex-shrink-0"
      data-test-search-input
      {{on "keyup" this.submitOnEnter}}
    >
      <div class="flex flex-row">
        <input
          aria-label="Search"
          type="text"
          value=""
          size="30"
          maxlength="128"
          class="form-text h-10 border-gray-500 bg-gray-100 border-2 px-2"
          placeholder={{@placeholder}}
          value={{this.searchTerms}}
          {{on "keyup" this.updateSearchTerms}}
        />
        <button
          type="button"
          class="inline-flex items-center px-3 py-2 h-10 border border-transparent text-sm leading-4 font-medium text-white bg-blue-heritage hover:bg-blue-800"
          aria-label="submit search"
          {{on "click" (fn @applySearchTerms this.searchTerms)}}
        >
          <SearchIcon @styles="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  `;
}
