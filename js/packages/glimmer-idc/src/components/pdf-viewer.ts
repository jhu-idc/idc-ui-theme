import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';

interface Args {}

export default class PdfViewer extends Component<Args> {
  @tracked itemUuid: string = '';
  @tracked isOralHistory: boolean = false;
  @tracked pdfUrl: string = '';

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    const el = document.getElementById('pdf-viewer');
    this.itemUuid = el.dataset.itemUuid

    this.setupViewer();
  }

  async setupViewer() {
    let res = await fetch(`/jsonapi/media/audio?filter[media-filter][condition][value]=${this.itemUuid}&filter[media-filter][condition][operator]=IN&filter[media-filter][condition][path]=field_media_of.id`);
    const audioPayload = await res.json();

    res = await fetch(`/jsonapi/media/document?include=field_media_document&filter[media-filter][condition][value]=${this.itemUuid}&filter[media-filter][condition][operator]=IN&filter[media-filter][condition][path]=field_media_of.id&filter[pdf-filter][condition][value]=application/pdf&filter[pdf-filter][condition][operator]=IN&filter[pdf-filter][condition][path]=field_mime_type`);
    const pdfPayload = await res.json();

    if (audioPayload.data.length > 0 && pdfPayload.data.length > 0) {
      this.isOralHistory = true;

      this.pdfUrl = pdfPayload.included[0].attributes.uri.url;
    }
  }

  static template = hbs`
    {{#if this.isOralHistory}}
      <iframe class="w-full my-4 h-pdfjs-container" src={{this.pdfUrl}}>
      </iframe>
    {{/if}}
  `;
}
