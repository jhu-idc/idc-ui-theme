import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';
import AnimatedButton from './animated-button';

interface Args {}

export default class AboutCollectionButtonGroup extends Component<Args> {
  @tracked copied: boolean = false;
  @tracked citableUrl: string = '';

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    let el = document.getElementById('about-collection-button-group');
    this.citableUrl = el.dataset.collectionUrl;
  }

  @action
  copyCitableUrl() {
    this.copied = true;
    navigator.clipboard.writeText(this.citableUrl);
  }


  static template = hbs`
    <button class="flex items-center place-content-center p-4 bg-blue-spirit hover:bg-gray-200 hover:shadow-xl text-black mb-4 w-full">
      Ask the collection admin
      <svg class="h-5 w-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </button>
    <AnimatedButton
      id="copy-url-button"
      {{on "click" this.copyCitableUrl}}
    >
      Copy the citable url
      {{#if this.copied}}
        <svg class="h-5 w-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      {{else}}
        <svg class="h-5 w-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      {{/if}}
    </AnimatedButton>
  `;
}
