import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { service } from '@glimmerx/service';
import { LanguageValue } from '../../interfaces';
import { ResultsService } from '../../utils/results';
import { XIcon } from '../icons';

interface Args {
  language: LanguageValue;
  onClick: (lang: LanguageValue) => {}
}

export default class LangFilterItem extends Component<Args> {
  @service results: ResultsService;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
  }

  get selected() {
    return this.results.langFilters.includes(this.args.language);
  }

  @action
  select() {
    this.args.onClick(this.args.language);
  }

  static template = hbs`
    <button
      class="my-1 py-1 px-3 flex items-center rounded-full text-left text-black hover:bg-gray-200 {{if this.selected "bg-blue-spirit"}}"
      data-lang-id={{@language.id}}
      {{on "click" this.select}}
      data-test-language-filter-item
    >
      {{@language.label}}
      {{#if this.selected}}
        <XIcon @styles="h-5 w-5" />
      {{/if}}
    </button>
  `;
}
