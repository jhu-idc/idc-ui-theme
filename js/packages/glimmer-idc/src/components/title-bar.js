import Component, { hbs } from '@glimmerx/component';

export default class TitleBar extends Component {
  static template = hbs`
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h2 class="text-xl font-bold leading-6">
        {{@title}}
      </h2>
    </div>
  `;
}