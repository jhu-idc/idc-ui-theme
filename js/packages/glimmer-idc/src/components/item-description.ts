import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';

interface Args {}

export default class ItemDescription extends Component<Args> {
  @tracked itemUuid: string = '';
  @tracked descriptions: {}[] = [{value: '', language: ''}];

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    const el = document.getElementById('item-description');
    this.itemUuid = el.dataset.itemUuid

    this.fetchItemDescription();
  }

  async fetchItemDescription() {
    const res = await fetch(`/jsonapi/node/islandora_object/${this.itemUuid}?include=field_description,field_alternative_title`);
    const payload = await res.json();

    this.descriptions = await this.processDescriptions(payload);
  }

  async processDescriptions(payload) {
    return payload.data.relationships.field_description.data.map((description) => {
      const taxonomyTerm = payload.included.find(term => term.id === description.id);

      return { value: description.meta.value, language: taxonomyTerm.attributes.name };
    });
  }

  static template = hbs`
    {{#if this.descriptions.length}}
      {{#each this.descriptions as |description|}}
        {{#if (is description 'language' 'English')}}
          <div class="flex mb-4 mr-4">
            {{description.value}} ({{description.language}})
          </div>
        {{/if}}
      {{/each}}
    {{else}}
      <div class="text-gray-500 mb-4">
        No description available
      </div>
    {{/if}}
  `;
}
