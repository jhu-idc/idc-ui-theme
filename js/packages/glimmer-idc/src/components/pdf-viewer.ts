import Component, { hbs, tracked } from '@glimmerx/component';

interface Args {}

export default class PdfViewer extends Component<Args> {
  @tracked itemUuid: string = '';
  @tracked isPdf: boolean = false;
  @tracked pdfUrl: string = '';

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    const el = document.getElementById('pdf-viewer');
    this.itemUuid = el.dataset.itemUuid

    this.setupViewer();
  }

  async setupViewer() {
   let res = await fetch(`/jsonapi/media/document?include=field_media_document&filter[media-filter][condition][value]=${this.itemUuid}&filter[media-filter][condition][operator]=IN&filter[media-filter][condition][path]=field_media_of.id&filter[pdf-filter][condition][value]=application/pdf&filter[pdf-filter][condition][operator]=IN&filter[pdf-filter][condition][path]=field_mime_type`);
    const pdfPayload = await res.json();

    if (pdfPayload.data.length > 0) {
      this.isPdf = true;

      this.pdfUrl = `/themes/contrib/idc-ui-theme/js/packages/pdf.js/web/viewer.html?file=${pdfPayload.included[0].attributes.uri.url}`;
    }
  }

  static template = hbs`
    {{#if this.isPdf}}
      <iframe class="w-full my-4 h-pdfjs-container" src={{this.pdfUrl}}>
      </iframe>
    {{/if}}
  `;
}
