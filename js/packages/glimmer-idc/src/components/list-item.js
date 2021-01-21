import Component, { hbs, tracked } from '@glimmerx/component';

export default class ListItem extends Component {
  @tracked imageUrl = null;

  constructor() {
    super(...arguments);

    this.fetchThumbnail();
  }

  async fetchThumbnail() {
    let url = `https://islandora-idc.traefik.me/jsonapi/media/image?include=thumbnail&filter[media-filter][condition][value]=${this.args.listItem.uuid}&filter[media-filter][condition][operator]=IN&filter[media-filter][condition][path]=field_media_of.id&filter[thumb-filter][condition][value]=Thumbnail Image&filter[thumb-filter][condition][operator]=IN&filter[thumb-filter][condition][path]=field_media_use.name`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      this.imageUrl = data.included[0].attributes.uri.url;
    } catch (e) {
      console.log(e);
    }
  }

  static template = hbs`
    <div class='min-h-12 p-4 border-b border-gray-200'>
      <img src={{this.imageUrl}} />
      {{@listItem.title}}
    </div>
  `;
}
