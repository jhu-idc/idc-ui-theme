import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { uuidv4 } from '../../utils/utils';
import QueryTermInput, { QueryTerm } from './query-term';
import SearchInfoService from './searchInfoService';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, QuestionMarkIcon, ResetIcon, SearchIcon } from '../icons';
import SearchTips from './search-tips';

interface Args {
  applySearchTerms: (searchTerms?: string) => {};
  searchTerms: string;
}

/**
 * Component that holds advanced search query inputs, allowing a user to
 * input arbitrary search terms, specifying boolean operations between
 * those terms. Supports proximity searches.
 */
export default class AdvancedQueryInput extends Component<Args> {
  @service searchInfo: SearchInfoService;

  readonly helpId: string = uuidv4();

  @tracked terms: QueryTerm[] = [];
  @tracked disableSearch: boolean = false;

  @tracked helpOpen: boolean = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    // Initialize this with an empty query term to get the ball rolling
    this.addTerm();
  }

  /**
   * The search button should be disabled when:
   *   - There are no search terms present
   *   - Any of the search terms are reported as not valid
   *
   * @returns {boolean} whether the search button should be disabled
   */
  shouldDisableSearch() {
    return this.terms.length === 0 || this.terms.some(term => !term.valid);
  }

  @action
  addTerm(options?:unknown) {
    /**
     * Some reason, running `this.terms.push(...)` doesn't seem to trigger the template
     * to re-render. Changing to the below - reassigning `this.terms = this.terms.concat(...)`
     * seems to work, though
     */
    // this.terms.push({
    //   id: uuidv4(),
    //   isProxy: false,
    //   term: '',
    //   operation: 'AND'
    // });
    this.terms = this.terms.concat({
      id: uuidv4(),
      isProxy: false,
      term: '',
      operation: 'AND',
      valid: false
    });
    this.disableSearch = this.shouldDisableSearch();
  }

  /**
   * Update an advanced search term, according to the ID of the term.
   * This does rely on ID being unique across query terms in the list.
   *
   * @param term {QueryTerm} updated term that should be updated in the terms list
   */
  @action
  updateTerm(term: QueryTerm) {
    const index = this.terms.map(t => t.id).findIndex(id => id === term.id);

    if (index < 0) {
      console.error(`Couldn't find advanced search term: ${JSON.stringify(term, null, 2)}`);
      return;
    }

    this.terms[index] = term;
    // Disable search if any term is invalid
    this.disableSearch = this.shouldDisableSearch();
  }

  @action
  removeTerm(term: QueryTerm) {
    this.terms = this.terms.filter(t => t.id !== term.id);
    this.disableSearch = this.shouldDisableSearch();
  }

  /**
   * Reset terms by clearing all terms and adding a blank term to kick off the UI
   */
  @action
  clearSearch() {
    this.terms = [];
    this.addTerm();
    // Reset search results
    this.args.applySearchTerms();
  }

  @action
  doSearch() {
    this.args.applySearchTerms(
      this.query2string()
    );
  }

  @action
  toggleHelp() {
    this.helpOpen = !this.helpOpen;
    const element = document.getElementById(this.helpId);

    if (this.helpOpen) {
      element.style['max-height'] = `${element.scrollHeight}px`;
    } else {
      element.style['max-height'] = '0';
    }
  }

  /**
   * Translate the query terms present in this component to a single Solr query string
   */
  query2string() {
    const parts = this.terms
      .filter(term => term.valid)
      .map((term, index) => {
        let part = '';

        if (index > 0) {
          part += ` ${term.operation} `;
        }

        if (term.isProxy) {
          if (!term.term || !term.termB || !term.proximity) {
            return;
          }
          part += `"${term.term} ${term.termB}"~${term.proximity}`
        } else if (!!term.field) {
          // Field will be falsy iff 'Keyword' is selected in the field dropdown
          part += `(${term.field.map(field => `${field}:${term.term}`).join(' OR ')})`;
        } else {
          part += term.term;
        }

        return part;
      });

    return parts.join('');
  }

  static template = hbs`
    <div id="idc-advanced-search-inputs" class="">
      <div class="flex justify-between">
        <div class="flex">
          <button
            class="button mr-4 border-blue-heritage text-blue-heritage hover:bg-blue-heritage hover:text-white"
            {{on "click" this.addTerm}}
          >
            <PlusIcon @styles="svg-icon mr-2" />
            Add term
          </button>
          <button
            class="button border-accent-7 text-accent-7 hover:bg-accent-7 hover:text-white"
            {{on "click" this.clearSearch}}
          >
            <ResetIcon @styles="svg-icon mr-2" />
            Clear
          </button>
        </div>
        <div class="flex">
        {{!--
          "Drawer" like component here can't use our stand-alone Drawer component
          because of the layout below, where the Search button appears between the
          drawer toggle button and the drawer content
        --}}
          <button
            aria-label="Toggle help with advanced search query syntax"
            class="button mx-2 text-gray-500 hover:text-black"
            title="Toggle help text"
            {{on "click" this.toggleHelp}}
          >
          {{#if this.helpOpen}}
            <ChevronUpIcon @styles="h-5 w-5" />
          {{else}}
            <ChevronDownIcon @styles="h-5 w-5" />
          {{/if}}
            <QuestionMarkIcon @styles="h-6 w-6" />
          </button>
          <button
            aria-label="Submit advanced search query"
            disabled={{this.disableSearch}}
            class="button button-primary inline-flex items-center"
            {{on "click" this.doSearch}}
          >
            Search
            <SearchIcon @styles="svg-icon ml-2" />
          </button>
        </div>
      </div>
      <div id={{this.helpId}} class="relative overflow-hidden transition-all ease-in-out duration-300 max-h-0">
        <SearchTips />
      </div>
      <ul id="idc-advanced-search-terms-list">
        {{#each this.terms as |term index|}}
          <li class="my-2">
            <QueryTermInput
              @index={{index}}
              @term={{term}}
              @updateTerm={{this.updateTerm}}
              @removeTerm={{this.removeTerm}}
            />
          </li>
        {{/each}}
      </ul>
    </div>
  `;

}
