import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { CollectionSuggestion, LanguageValue } from '../../interfaces';
import { uuidv4 } from '../../utils/utils';
import CollectionSuggester from './collection-suggester';
import SearchInfoService from './searchInfoService';
import { ResultsService } from '../../utils/results';
import LangFilterItem from './lang-filter-item';
import Drawer from '../drawer';

interface Args {
  doSearch: () => {};
}

export default class AdvancedSearchFilters extends Component<Args> {
  @service searchInfo: SearchInfoService;
  @service results: ResultsService;

  readonly id: string = uuidv4();
  readonly dateId1: string = uuidv4();
  readonly dateId2: string = uuidv4();

  readonly yearMatcher = /^\d{4}$/;

  @tracked languages: LanguageValue[];

  @tracked date1: number;
  @tracked date2: number;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.getLangauges();
  }

  async getLangauges() {
    this.languages = await this.searchInfo.getLanguages();
  }

  isSelected(lang: LanguageValue) {
    return this.results.langFilters.includes(lang);
  }

  @action
  handleLanguageFilter(lang: LanguageValue) {
    if (this.results.langFilters.includes(lang)) {
      this.results.langFilters = this.results.langFilters.filter(val => val != lang);
    } else {
      this.results.langFilters = this.results.langFilters.concat(lang);
    }

    this.args.doSearch();
  }

  @action
  handleDateInput(e: Event) {
    const input = (e.target as HTMLInputElement);
    const value = input.value;

    input.classList.remove('invalid');
    if (!!value && !value.match(this.yearMatcher)) {
      input.classList.add('invalid');
      return;
    }

    this.updateDateFilter();
  }

  updateDateFilter() {
    const date1 = (document.getElementById(this.dateId1) as HTMLInputElement).value;
    const date2 = (document.getElementById(this.dateId2) as HTMLInputElement).value;

    const dates = [];

    if (!!date1 && date1.match(this.yearMatcher)) {
      dates.push(Number(date1));
    }
    if (!!date2 && date2.match(this.yearMatcher)) {
      dates.push(Number(date2));
    }

    this.results.dateFilters = dates;

    this.args.doSearch();
  }

  static template = hbs`
    <div class="bg-white shadow my-4 p-4">
      <h3 class="text-lg text-gray-500">Collections</h3>
      <CollectionSuggester @doSearch={{@doSearch}} />
    </div>
    <Drawer @label="Language" @isOpen=true>
      <ul id={{this.id}} class="flex flex-wrap px-8 overflow-hidden transition-all ease-in-out duration-500">
        {{#each this.languages as |language|}}
          <li>
            <LangFilterItem
              @language={{language}}
              @onClick={{this.handleLanguageFilter}}
            />
          </li>
        {{/each}}
      </ul>
    </Drawer>
    <Drawer @label="Date" @isOpen=true>
      <div class="flex flex-col p-4">
        <p class="w-full mb-2 leading-snug text-gray-500">
          Filter by date range. Enter a single year to filter by that date.
        </p>
        <div class="flex">
          <label for={{this.dateId1}} class="sr-only">Start date</label>
          <label for={{this.dateId2}} class="sr-only">End date</label>
        </div>
        <div class="flex items-center">
          <input
            id={{this.dateId1}}
            type="text"
            placeholder="yyyy"
            {{on "change" this.handleDateInput}} />
          <span class="mx-4">-</span>
          <input
            id={{this.dateId2}}
            type="text"
            placeholder="yyyy"
            {{on "change" this.handleDateInput}} />
        </div>
      </div>
    </Drawer>
  `;
}
