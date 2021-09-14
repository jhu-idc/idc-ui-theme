import Component, { hbs, tracked } from '@glimmerx/component';
import { CitationsResponse } from '../interfaces';

export default class Citations extends Component {
  @tracked citations: CitationsResponse | void[];
  @tracked nodeId: string = '';

  constructor(owner: unknown, args) {
    super(owner, args);

    const el = document.getElementById('item-container');

    this.nodeId = el.dataset.nodeId;

    this.fetchCitations();
  }

  async fetchCitations() {
    let res: Response = await fetch(`/citation?nid=${this.nodeId}`);
    let data: CitationsResponse = await res.json();

    this.citations = data;
  }

  static template = hbs`
    <div class="flex flex-col space-y-8 p-8">
      {{#if this.citations}}
        {{#each this.citations as |citation|}}
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col space-y-1">
              <div class="text-gray-600">APA Citation</div>
              <div>{{{citation.citation_apa}}}</div>
            </div>
            <div class="flex flex-col space-y-1">
              <div class="text-gray-600">Chicago Citation</div>
              <div>{{{citation.citation_chicago}}}</div>
            </div>
            <div class="flex flex-col space-y-1">
              <div class="text-gray-600">MLA Citation</div>
              <div>{{{citation.citation_mla}}}</div>
            </div>
          </div>
        {{/each}}
      {{else}}
        <div class="text-gray-600">
          There are no citations for this item.
        </div>
      {{/if}}
    </div>
  `;
}
