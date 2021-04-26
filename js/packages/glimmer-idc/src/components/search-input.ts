import Component, { hbs } from '@glimmerx/component';
import { tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { fn } from '@glimmerx/helper';

interface Args {
  applySearchTerms: (searchTerms?: string) => {},
  searchTerms: string,
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
      this.args.applySearchTerms(this.searchTerms);
    }
  }

  static template = hbs`
    <div
      class="flex flex-col"
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
          <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  `;
}
