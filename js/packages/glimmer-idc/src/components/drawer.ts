import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { uuidv4 } from '../utils/utils';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface Args {
  label: string;
  isOpen?: boolean;
  heightOffset?: number;
}

export default class Drawer extends Component<Args> {
  readonly id: string = uuidv4();

  @tracked isOpen: boolean = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    if (!!this.args.isOpen) {
      this.isOpen = this.args.isOpen;
    }
  }

  get heightOffset() {
    return this.args.heightOffset || 0;
  }

  @action
  toggleOpen() {
    this.isOpen = !this.isOpen;
    const element = document.getElementById(this.id);

    if (this.isOpen) {
      element.style['max-height'] = `${element.scrollHeight + this.heightOffset}px`;
    } else {
      element.style['max-height'] = 0;
    }
  }

  static template = hbs`
    <div class="bg-white shadow my-4">
      <button
        class="flex w-full justify-between py-2 px-4 border-b text-gray-500 hover:bg-gray-100 focus:bg-gray-100"
        {{on "click" this.toggleOpen}}
      >
        <h3 class="text-lg">{{@label}}</h3>
        {{#if this.isOpen}}
          <ChevronUpIcon />
        {{else}}
          <ChevronDownIcon />
        {{/if}}
      </button>
      <div id={{this.id}} class="overflow-hidden transition-all ease-in-out duration-500">
        {{yield}}
      </div>
    </div>
  `;

}
