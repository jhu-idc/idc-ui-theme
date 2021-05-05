import { fn } from '@glimmerx/helper';
import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { CollectionSuggestion, LanguageValue } from '../../interfaces';
import { uuidv4 } from '../../utils/utils';
import CollectionSuggester from './collection-suggester';
import SearchInfoService from './searchInfoService';
import { CarrotDown, CarrotUp } from '../icons/icons';
import { ResultsService } from '../../utils/results';
import LangFilterItem from './lang-filter-item';

interface Args {
  doSearch: () => {};
}

export default class AdvancedSearchFilters extends Component<Args> {
  @service searchInfo: SearchInfoService;
  @service results: ResultsService;

  id: string = uuidv4();

  @tracked languages: LanguageValue[];
  @tracked langOpen: boolean = true;

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
  toggleLang() {
    this.langOpen = !this.langOpen;
    const el = document.getElementById(this.id);

    if (this.langOpen) {
      el.style['max-height'] = `${el.scrollHeight}px`;
    } else {
      el.style['max-height'] = '0';
    }
  }

  static template = hbs`
    <div class="bg-white shadow my-4 p-4">
      <h3 class="text-lg text-gray-500">Collections</h3>
      <CollectionSuggester @doSearch={{@doSearch}} />
    </div>
    <div class="bg-white shadow my-4">
      <button
        class="flex w-full justify-between py-2 px-4 border-b text-gray-500 hover:bg-gray-100 focus:bg-gray-100"
        {{on "click" this.toggleLang}}
      >
        <h3 class="text-lg">Languages</h3>
        {{#if this.langOpen}}
          <CarrotUp @styles="h-6 w-6"/>
        {{else}}
          <CarrotDown @styles="h-6 w-6" />
        {{/if}}
      </button>
      <ul id={{this.id}} class="flex flex-col px-8 overflow-hidden transition-all ease-in-out duration-500">
        {{#each this.languages as |language|}}
          <li>
            <LangFilterItem
              @language={{language}}
              @onClick={{this.handleLanguageFilter}}
            />
          </li>
        {{/each}}
      </ul>
    </div>
  `;
}
