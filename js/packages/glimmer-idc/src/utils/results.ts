import { SearchApiResponse, Pager } from '../interfaces'
import { tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';

const typeMap = {
  collections: {
    types: [
      'collection_object'
    ]
  },
  items: {
    types: [
      'islandora_object'
    ]
  },
  mixed: {
    types: [
      'collection_object',
      'islandora_object'
    ]
  }
}

export class ResultsService {
  types: string[] = [];
  @tracked rows: {}[] = [];
  @tracked pager: Pager = {
    current_page: 0,
    total_items: 0,
    total_pages: 0,
    items_per_page: 0
  };
  @tracked sortBy: string | null = null;
  @tracked sortOrder: string | null = null;
  @tracked itemsPerPage: number | null = null;

  constructor(type: string) {
    this.types = typeMap[type].types;
  }

  searchParams(): string {
    const typeQ: string = this.types.map((type) => `ss_type:${type}`).join(' OR ');
    const pageParam: string = this.pager.current_page ? `&page=${--this.pager.current_page}` : '';
    const sortByParam: string = !!this.sortBy ? this.sortBy : '';
    const orderByParam: string = !!this.sortOrder ? this.sortOrder : '';
    const itemsPerPageParam: string = !!this.itemsPerPage ? `&items_per_page=${this.itemsPerPage}` : '';

    const queryParams: string = typeQ + pageParam + sortByParam + orderByParam + itemsPerPageParam;

    return queryParams;
  }

  async fetchData() {
    const baseUrl = '/search_rest_endpoint?query='

    const params = this.searchParams();

    let url: string = baseUrl + params;

    console.log(url)

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      this.rows = data.rows;
      this.pager = data.pager;
      this.pager.current_page = ++this.pager.current_page
    } catch (e) {
      console.log(e);
    }
  }
}
