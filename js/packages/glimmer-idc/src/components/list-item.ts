import Component, { hbs, tracked } from '@glimmerx/component';
import MissingAsset from './missing-asset';
import { ChevronRightIcon } from './icons';

interface Args {
  listItem: ListItemObject,
}

interface ListItemObject {
  uuid: string,
  nid: number,
  title: string,
  field_description: string,
}

interface JsonApiResponse {
  data: {}[],
  included: {
    attributes: {
      uri: {
        url: string
      }
    }
  }[]
}

export default class ListItem extends Component<Args> {
  @tracked imageUrl: string = null;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    this.fetchThumbnail();
  }

  async fetchThumbnail() {
    let url = `/jsonapi/media/image?include=thumbnail&filter[media-filter][condition][value]=${this.args.listItem.uuid}&filter[media-filter][condition][operator]=IN&filter[media-filter][condition][path]=field_media_of.id&filter[thumb-filter][condition][value]=Thumbnail Image&filter[thumb-filter][condition][operator]=IN&filter[thumb-filter][condition][path]=field_media_use.name`;

    try {
      let res: Response = await fetch(url);
      let data: JsonApiResponse = await res.json();

      if (data.data.length > 0) {
        this.imageUrl = data.included[0].attributes.uri.url;
      }
    } catch (e) {
      console.log(e);
    }
  }

  static template = hbs`
    <a
      href="/node/{{@listItem.nid}}"
      type="button"
      class="flex items-center justify-between w-full min-h-12 p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
      data-test-search-results-item
    >
      <div class="flex items-center">
        {{#if this.imageUrl}}
          <img src={{this.imageUrl}} alt="collection or item image" class="h-24 w-24 mr-2 sm:mr-20 flex-shrink-0" />
        {{else}}
          <MissingAsset />
        {{/if}}
        <ul class="flex flex-col text-align-left w-3/5 text-gray-600">
          <li>
            <h3 class="text-xl mb-2">{{@listItem.title}}</h3>
          </li>
          {{#if @listItem.uid}}
            <li>
              <div class="">
                <span class="italic">Author:&nbsp;</span>
                <span>{{{@listItem.uid}}}</span>
              </div>
            </li>
          {{/if}}
          {{#if @listItem.field_date_created}}
            <li>
              <div class="">
                <span class="italic">Created on:&nbsp;</span>
                <span>{{@listItem.field_date_created}}</span>
              </div>
            </li>
          {{/if}}
          {{#if @listItem.field_date_published}}
            <li>
              <div>
                <span class="italic">Published on:&nbsp;</span>
                <span>{{@listItem.field_date_published}}</span>
              </div>
            </li>
          {{/if}}
          {{#if @listItem.field_description}}
            <li>
              <div class="text-gray-600 line-clamp-2">
                {{@listItem.field_description}}
              </div>
            </li>
          {{/if}}
        </ul>
      </div>
      <div>
        <ChevronRightIcon @styles="h-6 w-6 text-gray-500" />
      </div>
    </a>
  `;
}
