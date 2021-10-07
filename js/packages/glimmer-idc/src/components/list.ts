import Component from '@glimmer/component';
import { setComponentTemplate, precompileTemplate } from '@glimmer/core';
import ListItem from './list-item';

interface Args {
  list: {}[]
}

export default class List extends Component<Args> {}
  setComponentTemplate(
    precompileTemplate(
    `
    <div class="bg-white" data-test-search-results>
      <div class="h-auto">
        {{#each @list as |listItem|}}
          <ListItem @listItem={{listItem}} />
        {{/each}}
      </div>
    </div>
    `,
    { strictMode: true }
    ),
    List
  );
