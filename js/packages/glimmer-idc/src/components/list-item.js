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
    <a href="/node/{{@listItem.nid}}" type="button" class="flex items-center justify-between w-full min-h-12 p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
      <div class="flex items-center">
        <img src={{this.imageUrl}} class="mr-20" />
        <div class="flex flex-col text-align-left">
          {{@listItem.title}}
          <div class="text-gray-600">Some descriptive text to be replaced when description field is available.</div>
        </div>
      </div>
      <div>
        <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  `;
}
