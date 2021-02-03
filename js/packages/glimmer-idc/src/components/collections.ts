import Component, { hbs, tracked } from '@glimmerx/component';
import TitleBar from './title-bar';
import List from './list';
import ListItem from './list-item';
import ListSpinner from './list-spinner';
import PaginationControls from './pagination-controls';
import { SearchApiResponse, Pager } from '../interfaces'
import { action } from '@glimmerx/modifier';

interface Args {}
export default class Collections extends Component<Args> {
  @tracked title: string = 'All Collections';
  @tracked isLoading: boolean = false;
  @tracked list: {}[] = [];
  @tracked pager: Pager = {
    current_page: 0,
    total_items: 0,
    total_pages: 0,
    items_per_page: 0
  };

  constructor(owner: unknown, args: Args) {
    super(...arguments);

    this.fetchCollections();
  }

  async fetchCollections() {
    this.isLoading = true;
    let url =
      '/search_rest_endpoint?query=ss_type:collection_object';

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      this.list = data.rows;
      this.pager = data.pager;
      this.pager.current_page = ++this.pager.current_page
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async updateResults(page) {
    this.isLoading = true;

    let url =
      `/search_rest_endpoint?query=ss_type:collection_object&page=${--page}`;

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      this.list = data.rows;
      this.pager = data.pager;
      this.pager.current_page = ++this.pager.current_page
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  @action
  goToPage(page: number) {
    this.pager.current_page = page;
    this.updateResults(page);
  }

  @action
  prevPage() {
    this.pager.current_page = --this.pager.current_page;
    this.updateResults(this.pager.current_page);
  }

  @action
  nextPage() {
    this.pager.current_page = ++this.pager.current_page;
    this.updateResults(this.pager.current_page);
  }

  static template = hbs`
    <div class="bg-white shadow mb-4">
      <TitleBar
        @title={{this.title}}
        @pager={{this.pager}}
        @goToPage={{this.goToPage}}
        @prevPage={{this.prevPage}}
        @nextPage={{this.nextPage}}
      />
      {{#if this.isLoading}}
        <ListSpinner />
      {{else}}
        <List @list={{this.list}} />
      {{/if}}
    </div>
    <div class="flex bg-white shadow p-4 items-center justify-center">
      <PaginationControls
        @pager={{this.pager}}
        @goToPage={{this.goToPage}}
        @prevPage={{this.prevPage}}
        @nextPage={{this.nextPage}}
      />
    </div>
  `;
}
