import Component, { hbs, tracked } from '@glimmerx/component';
import TitleBar from './title-bar';
import List from './list';
import ListItem from './list-item';
import ListSpinner from './list-spinner';

export default class CollectionsItemsList extends Component {
  @tracked title = 'All Collections';
  @tracked isLoading = false;
  @tracked list = [];

  constructor() {
    super(...arguments);

    this.fetchCollections();
  }

  async fetchCollections() {
    this.isLoading = true;
    let url =
      'https://islandora-idc.traefik.me/search_rest_endpoint?query=ss_type:collection_object';

    try {
      let res = await fetch(url);
      let data = await res.json();

      this.list = data.rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  static template = hbs`
    <TitleBar @title={{this.title}} />
    {{#if this.isLoading}}
      <ListSpinner />
    {{else}}
      <List @list={{this.list}} />
    {{/if}}
  `;
}
