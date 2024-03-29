import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';
import AnimatedButton from './animated-button';
import { ClipboardIcon, ClipboardCheckIcon, MailIcon } from './icons';
import { JsonApiUserResponse } from '../interfaces';

interface Args {}

export default class AboutCollectionButtonGroup extends Component<Args> {
  @tracked copied: boolean = false;
  @tracked citableUrl: string = '';
  @tracked hasContact: boolean = false;
  @tracked isAuthenticated: boolean = false;
  @tracked collectionId: string = '';
  @tracked exportMetadataUrl: string = '';

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    let el = document.getElementById('about-collection-button-group');
    this.citableUrl = el.dataset.collectionUrl;
    this.hasContact = !!el.dataset.contactEmail;

    this.fetchUser();
  }

  async fetchUser() {
    let res: Response = await fetch('/jsonapi');
    let data: JsonApiUserResponse = await res.json();

    if (data && data.meta && data.meta.links && data.meta.links.me && data.meta.links.me.meta && data.meta.links.me.meta.id) {
      this.isAuthenticated = !!data.meta.links.me.meta.id;
    }

    const el = document.getElementById('idc-search');
    this.collectionId = el.dataset.collectionId;
    this.exportMetadataUrl = `/export_collections?query=(its_nid:${this.collectionId})`;
  }

  @action
  copyCitableUrl() {
    this.copied = true;
    navigator.clipboard.writeText(this.citableUrl);
  }

  @action
  toggleContactModal() {
    const modal = document.getElementById('idc-modal-container');
    if (!modal) {
      console.error('Contact modal not found on page.');
      return;
    }

    /**
     * Note this button will likely only be used to un-hide the modal.
     * Other code will be used to hide the modal, because it will render
     * on top of this button :)
     */
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  static template = hbs`
    {{#if this.hasContact}}
      <button class="flex items-center place-content-center p-4 bg-blue-spirit hover:bg-gray-200 hover:shadow-xl text-black mb-4 w-full"
        {{on "click" this.toggleContactModal}}
        data-test-collection-contact-toggle
      >
        Ask the collection admin
        <MailIcon @styles="h-5 w-5 ml-1" />
      </button>
    {{/if}}
    {{#if this.isAuthenticated}}
      <a
        class="flex items-center place-content-center p-4 bg-blue-spirit hover:bg-gray-200 hover:shadow-xl text-black w-full mb-4"
        href={{this.exportMetadataUrl}}
      >
        Export Collection Metadata
      </a>
    {{/if}}
    <AnimatedButton
      id="copy-url-button"
      {{on "click" this.copyCitableUrl}}
      data-test-copy-citable-url
    >
      Copy the citable url
      {{#if this.copied}}
        <ClipboardCheckIcon class="m-10" @styles="h-5 w-5 ml-1" />
      {{else}}
        <ClipboardIcon @styles="h-5 w-5 ml-1" />
      {{/if}}
    </AnimatedButton>
  `;
}
