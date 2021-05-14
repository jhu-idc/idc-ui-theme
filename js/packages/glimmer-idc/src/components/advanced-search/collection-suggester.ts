import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { CollectionSuggestion } from '../../interfaces';
import SearchInfoService from './searchInfoService';
import { uuidv4 } from '../../utils/utils';
import { ResultsService } from '../../utils/results';
import { XIcon, XCircleIcon } from '../icons';

interface Args {
  /**
   * The field name in which the user input is matched against in order
   * to provide collection suggestions.
   *
   * MUST be the machine-readable field (property) on a collection
   *
   * If no value is provided, the `title` field will be used.
   */
  field?: string;
  /**
   * The method by which matches are found in the collection field. MUST be
   * one of the following:
   *
   * '=', '<>', '>', '>=', '<', '<=', 'STARTS_WITH', 'CONTAINS', 'ENDS_WITH',
   * 'IN', 'NOT IN', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL',
   *
   * If no operator is provided, the component will default to use 'CONTAINS'
   */
  operator?: string;
  doSearch: () => {};
}

/**
 * This component can suggest Collections based on user input. By default,
 * the component will suggest collections that contain a match of the user
 * input value anywhere within the collection's title. The field in which
 * to match and the method of matching can be configured -- see `Args`
 */
export default class CollectionSuggester extends Component<Args> {
  @service searchInfo: SearchInfoService;
  @service results: ResultsService;

  id: string = uuidv4();
  inputId: string = `${this.id}-searcher`;

  @tracked field: string;
  @tracked operator: string;

  @tracked query: string = '';
  @tracked suggestions: CollectionSuggestion[] = [];

  @tracked selected: CollectionSuggestion[] = [];

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.field = this.args.field || 'title';
    this.operator = this.args.operator || 'CONTAINS'
  }

  get showClearBtn(): boolean {
    return !!this.query || this.suggestions.length > 0;
  }

  @action
  async getSuggestion(e: Event) {
    // TODO: throttle/debounce
    // TODO: Limit suggestions to 10 at a time?
    const query: string = (e.target as HTMLInputElement).value;
    this.query = query;

    const suggestions = await this.searchInfo.suggestCollection(query, this.field, this.operator);
    this.suggestions = suggestions;
  }

  @action
  doSelect(suggestion: CollectionSuggestion) {
    if (!this.suggestionsInclude(this.results.nodeFilters, suggestion)) {
      // Re-assign instead of .push() because push may not trigger tracking :(
      this.results.nodeFilters = this.results.nodeFilters.concat(suggestion);
      this.args.doSearch();
    }
  }

  @action
  unselect(suggestion: CollectionSuggestion) {
    this.results.nodeFilters = this.results.nodeFilters
      .filter(col => !this.suggestionEquals(col, suggestion));
    this.args.doSearch();
  }

  /**
   * Do some cleanup to hide the suggestions list and ensure that the next input will be
   * requested for a suggestion.
   */
  @action
  cleanup() {
    this.suggestions = [];
    this.query = '';
  }

  /**
   * @param array array of values to check
   * @param suggestion the CollectionSuggestion to look for
   * @returns Whether or not the `suggestion` was found in the `array`
   */
  suggestionsInclude(array: CollectionSuggestion[], suggestion: CollectionSuggestion) {
    return array.some(el => this.suggestionEquals(el, suggestion));
  }

  suggestionEquals(s1: CollectionSuggestion, s2: CollectionSuggestion) {
    if ((!!s1 && !s2) || (!s1 && !!s2)) {
      return false;
    }

    return s1.id === s2.id && s1.title === s2.title;
  }

  static template = hbs`
    <div id={{this.id}} class="mt-2">
      {{#if this.results.nodeFilters}}
        <ul class="autocomplete-selected mb-4">
          {{#each this.results.nodeFilters as |collection|}}
            <li class="flex items-center my-2">
              <button
                class="flex items-center rounded-full px-4 py-1 bg-blue-spirit text-black max-w-full"
                title="Remove this selection"
                type="button"
                {{on "click" (fn this.unselect collection)}}
              >
                <span class="truncate">{{collection.title}}</span>
                <XIcon @styles="inline-flex ml-3 h-5 w-5" />
              </button>
            </li>
          {{/each}}
        </ul>
      {{/if}}
      <div class="relative w-full">
        <label for={{this.inputId}} class="sr-only">
          Look for collections to limit your search results
        </label>
        <input
          id={{this.inputId}}
          class=""
          placeholder="Start typing to look for collections"
          type="text"
          {{on "keyup" this.getSuggestion}}
          value={{this.query}}
        />
        {{#if this.showClearBtn}}
          <button
            class="absolute top-0 right-0 px-2 h-full text-accent-7"
            title="Clear"
            type="button"
            {{on "click" this.cleanup}}
          >
            <XCircleIcon @styles="h-6 w-6" />
          </button>
        {{/if}}
      </div>
      {{#if this.suggestions}}
        <div class="border pt-2">
          <ul class="autocomplete-suggestions overflow-x-auto px-2">
            {{#each this.suggestions as |suggestion|}}
              <li class="">
                <button
                  class="rounded-full cursor-pointer py-1 px-4 mb-1 hover:bg-gray-200"
                  title="Search within this collection"
                  type="button"
                  {{on "click" (fn this.doSelect suggestion)}}
                >
                  {{suggestion.title}}
                </button>
              </li>
            {{/each}}
          </ul>
        </div>
      {{/if}}
    </div>
  `;
}
