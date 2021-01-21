import Component, { hbs } from '@glimmerx/component';
import ListItem from './list-item';

export default class List extends Component {
  static template = hbs`
    <div class="bg-white shadow">
      <div class="h-auto">
        {{#each @list as |listItem|}}
          <ListItem @listItem={{listItem}} />
        {{/each}}
      </div>
    </div>
  `;
}
