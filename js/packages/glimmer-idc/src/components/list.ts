import Component, { hbs } from '@glimmerx/component';
import ListItem from './list-item';

interface Args {
  list: {}[]
}

export default class List extends Component<Args> {
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
