import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { uuidv4 } from '../utils/utils';

interface Args {
  showLabel: string;
  hideLabel: string;
}

export default class Drawer extends Component<Args> {

  id: string = uuidv4();
  @tracked isOpen: boolean = false;

  animationTimer: number;

  @action
  toggleDrawer() {
    this.isOpen = !this.isOpen;

    const drawer = document.getElementById(this.id);
    // Using the newly updated status
    if (this.isOpen) {
      drawer.style['max-height'] = `${drawer.scrollHeight * 2}px`;

      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
      }
      this.animationTimer = setTimeout(() => {
        drawer.style['max-height'] = 'max-content';
      }, 700);
    } else {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
      }
      drawer.style['max-height'] = '0';
    }
  }

  static template = hbs`
    <div class="flex flex-col place-content-center">
      <div class="flex items-center mx-auto">
        <button
          class="flex items-center place-content-center hover:bg-gray-200 focus:bg-gray-200 p-4 z-50 mb-2"
          {{on "click" this.toggleDrawer}}
        >
          {{#if this.drawerIsOpen}}
            <div class="text-blue-heritage">
              {{@hideLabel}}
            </div>
            <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 15l7-7 7 7" />
            </svg>
          {{else}}
            <div class="text-blue-heritage">
              {{@showLabel}}
            </div>
            <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          {{/if}}
        </button>
      </div>
      <div
        id={{this.id}}
        class="flex flex-col place-content-center relative overflow-hidden transition-all ease-in-out duration-700 max-h-0"
      >
        {{yield}}
      </div>
    </div>
  `;
}
