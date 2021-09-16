import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';

interface Args {}

export default class AnimatedButton extends Component<Args> {
  @tracked effect: boolean = false;
  @tracked clicked: boolean = false;

  @action
  animate() {
    this.effect = true;
    this.clicked = true;
  }

  @action
  reset() {
    this.effect = false;
  }

  static template = hbs`
    <button
      class="flex items-center place-content-center p-4 bg-blue-spirit hover:bg-gray-200 hover:shadow-xl text-black w-full {{if this.effect "animate-wiggle"}}"
      {{on "click" this.animate}}
      {{on "animationend" this.reset}}
      ...attributes
    >
      {{yield}}
    </button>
  `;
}
