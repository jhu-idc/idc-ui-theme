import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { CollectionSuggestion } from '../../interfaces';
import SearchInfoService from './searchInfoService';
import { uuidv4 } from '../../utils/utils';
import { ResultsService } from '../../utils/results';

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
  /** Action to call when a collection is selected or deselected */
  collectionSelected: (collections: CollectionSuggestion[]) => {};
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

  @action
  async getSuggestion(e: Event) {
    // TODO: throttle
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
      this.args.collectionSelected(this.results.nodeFilters);
    }
  }

  @action
  unselect(suggestion: CollectionSuggestion) {
    this.results.nodeFilters = this.results.nodeFilters
      .filter(col => !this.suggestionEquals(col, suggestion));
    this.args.collectionSelected(this.results.nodeFilters);
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
    <div id={{this.id}} class="p-2 bg-white">
      {{#if this.results.nodeFilters}}
        <ul class="autocomplete-selected mb-4">
          {{#each this.results.nodeFilters as |collection|}}
            <li class="flex items-center my-2">
              <button
                class="rounded-full px-4 py-1 bg-blue-spirit text-black"
                title="Remove this selection"
                type="button"
                {{on "click" (fn this.unselect collection)}}
              >
                {{collection.title}}
              </button>
            </li>
          {{/each}}
        </ul>
      {{/if}}
      <div class="relative w-full">
        <input
          class=""
          type="text"
          {{on "keyup" this.getSuggestion}}
          value={{this.query}}
        />
        <button
          class="absolute right-0 px-2 h-full text-accent-7"
          title="Clear"
          type="button"
          {{on "click" this.cleanup}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      {{#if this.suggestions}}
        <div class="border p-2">
          <ul class="autocomplete-suggestions overflow-x-auto">
            {{#each this.suggestions as |suggestion|}}
              <li
                class="cursor-pointer py-1 px-4 mb-1 hover:bg-gray-200"
                title="Search within this collection"
                {{on "click" (fn this.doSelect suggestion)}}
              >
                {{suggestion.title}}
              </li>
            {{/each}}
          </ul>
        </div>
      {{/if}}
    </div>
  `;
}
