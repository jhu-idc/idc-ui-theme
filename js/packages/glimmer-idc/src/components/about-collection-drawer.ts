import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface Args {}

export default class AboutCollectionDrawer extends Component<Args> {
  @tracked drawerIsOpen: boolean = false;
  @tracked collectionUuid: string = '';
  @tracked descriptions: {}[] = [{value: '', language: ''}];
  @tracked alternativeTitles: {}[] = [{value: '', language: ''}];
  @tracked collectionAttrs: {} = null;

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    const el = document.getElementById('about-collection-drawer');
    this.collectionUuid = el.dataset.collectionUuid

    this.fetchCollectionData();
  }

  async fetchCollectionData() {
    const res = await fetch(`/jsonapi/node/collection_object/${this.collectionUuid}?include=field_description,field_alternative_title`);
    const payload = await res.json();

    this.descriptions = await this.processDescriptions(payload);
    this.alternativeTitles = await this.processAlternativeTitles(payload);
    this.collectionAttrs = payload.data.attributes
  }

  async processDescriptions(payload) {
    return payload.data.relationships.field_description.data.map((description) => {
      const taxonomyTerm = payload.included.find(term => term.id === description.id);

      return { value: description.meta.value, language: taxonomyTerm.attributes.name };
    });
  }

  async processAlternativeTitles(payload) {
    return payload.data.relationships.field_alternative_title.data.map((description) => {
      const taxonomyTerm = payload.included.find(term => term.id === description.id);

      return { value: description.meta.value, language: taxonomyTerm.attributes.name };
    });
  }

  @action
  toggleDrawer() {
    if (!this.drawerIsOpen) {
      this.drawerIsOpen = !this.drawerIsOpen;

      const drawer = document.getElementById('drawer-content');

      drawer.style['max-height'] = `${drawer.scrollHeight + 1000}px`
    } else {
      this.drawerIsOpen = !this.drawerIsOpen;

      const drawer = document.getElementById('drawer-content');

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
              Hide Full Collection Record
            </div>
            <ChevronUpIcon @styles="h-6 w-6 text-gray-500" />
          {{else}}
            <div class="text-blue-heritage">
            Show Full Collection Record
            </div>
            <ChevronDownIcon @styles="h-6 w-6 text-gray-500" />
          {{/if}}
        </button>
      </div>
      <div id="drawer-content" class="flex flex-col place-content-center relative overflow-hidden transition-all ease-in-out duration-700 max-h-0">
        <hr class="mt-4 mb-6 w-3/4 self-center" />
        <div class="mb-4">
          <div class="text-black mb-2">Translated Descriptions</div>
          {{#if this.descriptions.length}}
            {{#each this.descriptions as |description|}}
              {{#unless (is description 'language' 'English')}}
                <div class="flex mb-2 text-gray-500">
                  {{description.value}} ({{description.language}})
                </div>
              {{/unless}}
            {{/each}}
          {{else}}
            <div class="text-gray-500">
              No translated descriptions available
            </div>
          {{/if}}
        </div>
        <div class="mb-4">
          <div class="text-black mb-2">Alternative Titles</div>
          {{#if this.alternativeTitles.length}}
            {{#each this.alternativeTitles as |title|}}
              <div class="flex mb-2 text-gray-800">
                {{title.value}} ({{title.language}})
              </div>
            {{/each}}
          {{else}}
            <div class="text-gray-500">
              No alternative titles available
            </div>
          {{/if}}
        </div>
        <div class="flex mb-4">
          <div class="flex flex-col mr-8">
            <div class="text-black mb-2">Collection Contact Name</div>
            {{#if this.collectionAttrs.field_collection_contact_name}}
              <div class="flex text-gray-800">
                {{this.collectionAttrs.field_collection_contact_name}}
              </div>
            {{else}}
              <div class="text-gray-500">
                No collection contact name available
              </div>
            {{/if}}
          </div>
          <div class="flex flex-col">
            <div class="text-black mb-2">Collection Contact Email</div>
            {{#if this.collectionAttrs.field_collection_contact_email}}
              <div class="flex text-gray-800">
                {{this.collectionAttrs.field_collection_contact_email}}
              </div>
            {{else}}
              <div class="text-gray-500">
                No collection contact email available
              </div>
            {{/if}}
          </div>
        </div>
        <div class="mb-4">
          <div class="text-black mb-2">Collection Numbers</div>
          {{#if this.collectionAttrs.field_collection_number.length}}
            {{#each this.collectionAttrs.field_collection_number as |number|}}
              <div class="flex mb-2 text-gray-800">
                {{number}}
              </div>
            {{/each}}
          {{else}}
            <div class="text-gray-500">
              No collection numbers available
            </div>
          {{/if}}
        </div>
        <div class="mb-4">
          <div class="text-black mb-2">Citable URL</div>
          {{#if this.collectionAttrs.field_citable_url.uri}}
            <div class="flex mb-2 text-gray-800">
              <a target="_blank" href={{this.collectionAttrs.field_citable_url.uri}}>{{this.collectionAttrs.field_citable_url.uri}}</a>
            </div>
          {{else}}
            <div class="text-gray-500">
              No citable URL available
            </div>
          {{/if}}
        </div>
        <div class="mb-4">
          <div class="text-black mb-2">Finding Aids</div>
          {{#if this.collectionAttrs.field_finding_aid.length}}
            {{#each this.collectionAttrs.field_finding_aid as |aid|}}
              <div class="flex mb-2 text-gray-800">
                <a target="_blank" href={{aid.uri}}>{{aid.title}}</a>
              </div>
            {{/each}}
          {{else}}
            <div class="text-gray-500">
              No finding aids available
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  `;
}
