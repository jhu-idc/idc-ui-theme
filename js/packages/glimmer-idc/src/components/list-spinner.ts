import Component, { hbs } from '@glimmerx/component';

export default class ListSpinner extends Component {
  static template = hbs`
    <div class="bg-white shadow">
      <div class="flex h-auto p-4 items-center justify-center">
        <div class="sk-pulse bg-blue-heritage"></div>
      </div>
    </div>
  `;
}
