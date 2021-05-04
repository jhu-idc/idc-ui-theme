import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { CollectionSuggestion } from '../../interfaces';
import SearchInfoService from './searchInfoService';
import { uuidv4 } from '../../utils/utils';

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
  selected: CollectionSuggestion[];
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

  id: string = uuidv4();

  @tracked field: string;
  @tracked operator: string;

  @tracked query: string = '';
  @tracked results: CollectionSuggestion[] = [];

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

    const results = await this.searchInfo.suggestCollection(query, this.field, this.operator);
    this.results = results;

    if (results.length === 0) {
      this.cleanup();
    }
  }

  @action
  doSelect(suggestion: CollectionSuggestion) {
    if (!this.suggestionsInclude(this.args.selected, suggestion)) {
      // Re-assign instead of .push() because push may not trigger tracking :(
      this.selected = this.selected.concat(suggestion);
      this.args.collectionSelected(this.selected);
    }
  }

  @action
  unselect(suggestion: CollectionSuggestion) {
    this.selected = this.selected.filter(col => !this.suggestionEquals(col, suggestion));
    this.args.collectionSelected(this.selected);
  }

  /**
   * Do some cleanup to hide the suggestions list and ensure that the next input will be
   * requested for a suggestion.
   */
  @action
  cleanup() {
    this.results = [];
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
    <div id={{this.id}} class="p-2 bg-white overflow-x-auto">
      {{#if this.selected}}
        <ul class="autocomplete-selected">
          {{#each this.selected as |collection|}}
            <li class="flex items-center my-2">
              <button
                class="rounded-full px-4 py-1 bg-blue-spirit text-black"
                title="Remove this selection"
                {{on "click" (fn this.unselect collection)}}
              >
                {{collection.title}}
              </button>
            </li>
          {{/each}}
        </ul>
      {{/if}}
      <div class="flex">
        <input
          class=""
          type="text"
          {{on "keyup" this.getSuggestion}}
          value={{this.query}}
        />
        <button class="px-2" {{on "click" this.cleanup}}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      {{#if this.results}}
        <div class="p-1">
          <ul class="autocomplete-results">
            {{#each this.results as |suggestion|}}
              <li
                class="cursor-pointer hover:bg-gray-200"
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
