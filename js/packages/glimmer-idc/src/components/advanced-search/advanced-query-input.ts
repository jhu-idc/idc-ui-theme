import { action } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { service } from '@glimmerx/service';
import { uuidv4 } from '../../utils/utils';
import QueryTermInput, { QueryTerm } from './query-term';
import SearchInfoService from './searchInfoService';

interface Args {
  applySearchTerms: (searchTerms?: string) => {};
  searchTerms: string;
}

export default class AdvancedQueryInput extends Component<Args> {
  @service searchInfo:SearchInfoService;

  @tracked terms: QueryTerm[] = [];

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    // Initialize this with an empty query term to get the ball rolling
    this.addTerm();
  }

  @action
  addTerm() {
    this.terms.push({
      id: uuidv4(),
      isProxy: false,
      term: '',
      operation: 'AND'
    });
  }

  /**
   * Update an advanced search term, according to the ID of the term.
   * This does rely on ID being unique across query terms in the list.
   *
   * @param term {QueryTerm} updated term that should be updated in the terms list
   */
  @action
  updateTerm(term: QueryTerm) {
    console.log(`Updating term: ${JSON.stringify(term)}`);
    const index = this.terms.map(t => t.id).findIndex(id => id === term.id);

    if (index < 0) {
      console.error(`Couldn't find advanced search term: ${JSON.stringify(term, null, 2)}`);
      return;
    }

    this.terms[index] = term;
  }

  @action
  removeTerm(term: QueryTerm) {
    // TODO: implement
    console.log(`### Remove term : ${JSON.stringify(term)} ###`);
  }

  static template = hbs`
    <div>
      <ul>
        {{#each this.terms as |term|}}
          <li>
            <QueryTermInput
              @term={{term}}
              @updateTerm={{this.updateTerm}}
            />
          </li>
        {{/each}}
      </ul>
    </div>
  `;

}
