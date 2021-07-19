import Component, { hbs, tracked } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { is } from '../utils/helpers';
import videojs from 'video.js'

interface Args {}

export default class VideoViewer extends Component<Args> {
  @tracked itemUuid: string = '';
  @tracked isVideo: boolean = false;
  @tracked videoUrl: string = '';

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    const el = document.getElementById('video-viewer');
    this.itemUuid = el.dataset.itemUuid

    this.setupViewer();
  }

  async setupViewer() {
    const res = await fetch(`/jsonapi/media/video?include=field_media_video_file&filter[media-filter][condition][value]=${this.itemUuid}&filter[media-filter][condition][operator]=IN&filter[media-filter][condition][path]=field_media_of.id&filter[pdf-filter][condition][value]=video/mp4&filter[pdf-filter][condition][operator]=IN&filter[pdf-filter][condition][path]=field_mime_type`);
    const videoPayload = await res.json();

    if (videoPayload.data.length > 0) {
      this.isVideo = true;

      this.videoUrl = videoPayload.included[0].attributes.uri.url;
    }
  }

  static template = hbs`
    {{#if this.isVideo}}
      <video id="videojs-player" class="video-js vjs-theme-city w-full h-videojs-container" controls data-setup='{}' data-test-video-viewer>
        <source src={{this.videoUrl}} type="video/mp4">
      </video>
    {{/if}}
  `;
}
