import Component, { hbs, tracked } from '@glimmerx/component';
import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import { service } from '@glimmerx/service';
import SearchInfoService from './searchInfoService';
import { SearchField } from '../../interfaces';
import { XFilledIcon } from '../icons';

export interface QueryTerm {
  readonly id: string;
  /**
   * Whether this query term represents a proximity search or not.
   * If TRUE, use `term`, `proximity`, and `termB` to generate
   * the query, ignoring `field`
   * If FALSE, use `term` and `field` to generate the query, ignoring
   * `termB` and `proximity`
   */
  isProxy: boolean;
  /** Search term, used for all terms */
  term: string;
  /** Solr boolean operation, [AND|OR] */
  operation: string;
  /** The Solr field applicable to the term. Null or empty if term is applied to all fields */
  field?: string[];
  /** Term for proxy terms */
  termB?: string;
  /** Proxy range for proxy terms */
  proximity?: number;
  /**
   * Self-reported validity of this query term
   *
   * Standard term: MUST have a term, operation. May have field
   *    (If the user selects the "Keyword" field, the `field` property will be empty
   *     representing a search across all terms)
   *
   * Proximity term: MUST have an `operation`, a `term`, a `termB` and a `proximity`
   */
  valid: boolean;
  /**
   * Is this term considered "empty"?
   */
  empty: boolean;
}

interface Args {
  term: QueryTerm;
  validationErrors: string[];
  doSearch: () => {};
  updateTerm: (term: QueryTerm) => {};
  removeTerm: (term: QueryTerm) => {};
  showValidation: boolean;
}

export default class QueryTermInput extends Component<Args> {
  @service searchInfo: SearchInfoService;

  /** QueryTerm that drives this component because args.term tracking can be wonky */
  @tracked localTerm: QueryTerm = this.args.term;

  fields: SearchField[] = [];

  id: string = this.args.term.id;
  // UI element IDs
  opGroupId: string = `${this.id}-operation-group`;
  proxyId: string = `${this.id}-proxy-toggle`;
  fieldId: string = `${this.id}-field-select`;
  termInputId: string = `${this.id}-term-input`;
  proxyTermAId: string = `${this.id}-proxy-term-a`;
  proxyTermBId: string = `${this.id}-proxy-term-b`;
  proxyRangeId: string = `${this.id}-proxy-range`;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.fields = this.searchInfo.searchFields();
  }

  @action
  toggleProxy() {
    this.updateTerm({ isProxy: !this.args.term.isProxy });
  }

  @action
  updateField(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    if (!value) {
      this.updateTerm({ field: undefined });
    } else {
      this.updateTerm({ field: value.split(',') });
    }
  }

  @action
  updateSearchTerm(e: Event) {
    if (this.submitIfEnter(e)) {
      return;
    }
    this.updateTerm({ term: (e.target as HTMLInputElement).value });
  }

  @action
  updateProxyTermB(e: Event) {
    if (this.submitIfEnter(e)) {
      return;
    }
    this.updateTerm({ termB: (e.target as HTMLInputElement).value });
  }

  @action
  updateProximity(e: Event) {
    if (this.submitIfEnter(e)) {
      return;
    }

    const value: string = (e.target as HTMLInputElement).value;

    try {
      const proximity: number = parseInt(value);
      this.updateTerm({ proximity });
    } catch (ex) {
      console.log(`Invalid "proximity" input: "${value}"`);
    }
  }

  /**
   * Skip validation if the term is "emtpy"
   * @param term If a QueryTerm is provided, validate that term.
   *             If NO QueryTerm is provided, use `this.args.term`
   * @returns TRUE if this term validates successfully
   */
  validateTerm(term?: QueryTerm) {
    this.resetValidation();

    if (!term) {
      term = this.args.term;
    }

    let result = true;

    if (term.isProxy) {
      if (!term.term && !term.termB && !term.proximity) {
        return true;
      }
      if (!term.term) {
        this.toggleInputValid(this.proxyTermAId, false);
        result = false;
      }
      if (!term.termB) {
        this.toggleInputValid(this.proxyTermBId, false);
        result = false;
      }
      if (!term.proximity || isNaN(term.proximity)) {
        this.toggleInputValid(this.proxyRangeId, false);
        result = false;
      }
    } else {
      if (!term.term) {
        // this.toggleInputValid(this.termInputId, false);
        result = false;
      }
    }

    return result;
  }

  isEmpty(term: QueryTerm) {
    return term.isProxy ?
      !term.term && !term.termB && !term.proximity :
      !term.term;
  }

  resetValidation() {
    const ids = [
      this.termInputId,
      this.proxyTermAId,
      this.proxyTermBId,
      this.proxyRangeId,
    ];

    ids.forEach(id => this.toggleInputValid(id, true));
  }

  updateTerm(options) {
    let updated = Object.assign(
      this.args.term,
      options
    );

    updated = Object.assign(updated, {
      valid: this.validateTerm(updated),
      empty: this.isEmpty(updated)
    });

    this.localTerm = updated;
    this.args.updateTerm(updated);
  }

  /**
   * @param id input element ID
   * @param valid {boolean} whether the element should be marked as valid or not
   *                        FALSE will mark the element as invalid
   *                        TRUE will clear invalid mark
   */
  toggleInputValid(id, valid) {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    if (valid) {
      element.classList.remove('invalid');
    } else {
      element.classList.add('invalid');
    }
  }

  @action
  changeOperation(operation: string, e: Event) {
    const buttons = document.getElementById(this.opGroupId).children;
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).classList.remove('selected');
    }

    (e.target as HTMLElement).classList.add('selected');

    this.updateTerm({ operation });
  }

  /**
   * @param e {Event} DOM event
   * @returns TRUE user used the Enter key, FALSE otherwise
   */
  @action
  submitIfEnter(e: Event): boolean {
    if ((e as KeyboardEvent).key === "Enter") {
      this.args.doSearch();
      return true;
    }
    return false;
  }

  static template = hbs`
    <div id={{this.id}} data-test-advanced-search-query-term>
      <div id={{this.opGroupId}} class="flex flex-row ops-button-group" data-test-advanced-search-query-operations>
        <button
          class="button selected"
          name="AND"
          {{on "click" (fn this.changeOperation "AND")}}
          data-test-advanced-search-operation-and
        >
          AND
        </button>
        <button
          class="button"
          name="OR"
          {{on "click" (fn this.changeOperation "OR")}}
          data-test-advanced-search-operation-or
        >
          OR
        </button>
        <button
          class="button"
          name="NOT"
          {{on "click" (fn this.changeOperation "NOT")}}
          data-test-advanced-search-operation-not
        >
          NOT
        </button>
      </div>
      <div class="flex flex-row">
        <div class="w-48 self-center">
          <input
            id={{this.proxyId}}
            class="cursor-pointer"
            type="checkbox"
            value={{this.localTerm.isProxy}}
            {{on "change" this.toggleProxy}}
            data-test-advanced-search-proxy
          />
          <label for={{this.proxyId}} class="py-2 cursor-pointer">Proximity search</label>
        </div>
        {{#if this.localTerm.isProxy}}
          <!-- Proxy search -->
          <div class="" data-test-advanced-search-proxy-term>
            <label for={{this.proxyTermAId}} class="">Search for term</label>
            <input
              id={{this.proxyTermAId}}
              class="idc-advanced-text-input"
              placeholder="Enter a term"
              type="text"
              value={{this.localTerm.term}}
              {{on "keyup" this.updateSearchTerm}}
              data-test-advanced-search-proxy-terma
            />
          </div>
          <div class="mx-8">
            <label for={{this.proxyRangeId}} class="">Within a range of</label>
            <input
              id={{this.proxyRangeId}}
              class="idc-advanced-text-input"
              placeholder="Enter a number"
              type="number"
              value={{this.localTerm.proximity}}
              {{on "keyup" this.updateProximity}}
              data-test-advanced-search-proxy-range
            />
          </div>
          <div class="">
            <label for={{this.proxyTermBId}} class="">The following term</label>
            <input
              id={{this.proxyTermBId}}
              class="idc-advanced-text-input"
              placeholder="Enter a term"
              type="text"
              value={{this.localTerm.termB}}
              {{on "keyup" this.updateProxyTermB}}
              data-test-advanced-search-proxy-termb
            />
          </div>
        {{else}}
          <!-- Standard search -->
          <div class="" data-test-advanced-search-nonproxy-search>
            <label for={{this.fieldId}} class="sr-only">Select search term field</label>
            <select
              id={{this.fieldId}}
              class="idc-dropdown "
              name={{this.fieldId}}
              {{on "keyup" this.updateField}}
              data-test-advanced-search-field
            >
              {{#each this.fields as |field|}}
                <option value={{field.keys}}>{{field.label}}</option>
              {{/each}}
            </select>
          </div>
          <div class="">
            <label for={{this.termInputId}} class="sr-only">Enter a word or phrase to search for</label>
            <input
              id={{this.termInputId}}
              aria-label="Enter a word or phrase to search for"
              class="idc-advanced-text-input"
              placeholder="Enter search term"
              size="30"
              type="text"
              value={{this.localTerm.term}}
              {{on "keyup" this.updateSearchTerm}}
              data-test-advanced-search-query-input
            />
          </div>
        {{/if}}
        <div class="ml-auto self-center">
          <button
            class="rounded-full text-2xl leading-none font-bold text-accent-7 px-2 p-1 ml-4 hover:bg-accent-7 hover:text-white"
            title="Remove this term"
            {{on "click" (fn @removeTerm @term)}}
            data-test-advanced-search-remove
          >
            <XFilledIcon @styles="h-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  `;

}
