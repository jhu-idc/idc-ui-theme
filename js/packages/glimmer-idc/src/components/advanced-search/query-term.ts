import Component, { hbs, tracked } from '@glimmerx/component';
import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import { service } from '@glimmerx/service';
import SearchInfoService, { SearchField } from './searchInfoService';

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
  field?: string;
  /** Term for proxy terms */
  termB?: string;
  /** Proxy range for proxy terms */
  proximity?: number;
}

interface Args {
  term: QueryTerm;
  updateTerm: (term: QueryTerm) => {}
  removeTerm: (term: QueryTerm) => {}
}

export default class QueryTermInput extends Component<Args> {
  @service searchInfo: SearchInfoService;

  @tracked localTerm = this.args.term;

  fields: SearchField[] = [];

  id: string = this.args.term.id;
  // UI element IDs
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
    this.updateTerm({ field: (e.target as HTMLSelectElement).value });
  }

  @action
  updateSearchTerm(e: Event) {
    this.updateTerm({ term: (e.target as HTMLInputElement).value });
  }

  @action
  updateProxyTermB(e: Event) {
    this.updateTerm({ termB: (e.target as HTMLInputElement).value });
  }

  @action
  updateProximity(e: Event) {
    const value: string = (e.target as HTMLInputElement).value;

    try {
      const proximity: number = parseInt(value);
      if (!isNaN(proximity)) {
        this.updateTerm({ proximity });
      }
    } catch (ex) {
      console.log(`Invalid "proximity" input: "${value}"`);
    }
  }

  updateTerm(options) {
    const updated = Object.assign(this.args.term, options);

    this.localTerm = updated;
    this.args.updateTerm(updated);
  }

  static template = hbs`
    <div class="flex flex-row">
      <div class="w-48 self-center">
        <input
          id={{this.proxyId}}
          class="cursor-pointer"
          type="checkbox"
          value={{this.localTerm.isProxy}}
          {{on "change" this.toggleProxy}}
        />
        <label for={{this.proxyId}} class="py-2 cursor-pointer">Proximity search?</label>
      </div>
      {{#if this.localTerm.isProxy}}
        <!-- Proxy search -->
        <div class="">
          <label for={{this.proxyTermAId}} class="">Search for term</label>
          <input
            id={{this.proxyTermAId}}
            class="idc-advanced-text-input"
            placeholder="Enter a term"
            type="text"
            value={{this.localTerm.term}}
            {{on "change" this.updateSearchTerm}}
          />
        </div>
        <div class="mx-8">
          <label for={{this.proxyRangeId}} class="">Within a range of</label>
          <input
            id={{this.proxyRangeId}}
            class="idc-advanced-text-input"
            placeholder="Enter a number"
            type="text"
            value={{this.localTerm.proximity}}
            {{on "change" this.updateProximity}}
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
            {{on "change" this.updateProxyTermB}}
          />
        </div>
      {{else}}
        <!-- Standard search -->
        <div class="">
          <label for={{this.fieldId}} class="sr-only">Select search term field</label>
          <select
            id={{this.fieldId}}
            class="idc-dropdown h-full "
            name={{this.fieldId}}
            {{on "change" this.updateField}}
          >
            {{#each this.fields as |field|}}
              <option value={{field.key}}>{{field.label}}</option>
            {{/each}}
          </select>
        </div>
        <div class="">
          <label for={{this.termInputId}} class="sr-only">Enter a word or phrase to search for</label>
          <input
            id={{this.termInputId}}
            aria-label="Enter a word or phrase to search for"
            class="idc-advanced-text-input h-full"
            placeholder="Enter search term"
            size="30"
            type="text"
            value={{this.localTerm.term}}
            {{on "change" this.updateSearchTerm}}
          />
        </div>
      {{/if}}
      <div class="ml-auto self-center">
        <button
          class="border border-accent-7 text-2xl leading-none font-bold text-accent-7 px-2 pb-1 ml-4 hover:bg-accent-7 hover:text-white"
          title="Remove this term"
          {{on "click" (fn @removeTerm @term)}}
        >
          &times;
        </button>
      </div>
    </div>
  `;

}
