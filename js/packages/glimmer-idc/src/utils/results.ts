import { SearchApiResponse, Pager } from '../interfaces';
import { Facet, FacetValue } from '../models/facet';
import { tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';
import { parseFacet } from './facet-utils';

const typeMap = {
  collections: {
    types: ['collection_object'],
  },
  items: {
    types: ['islandora_object'],
  },
  mixed: {
    types: ['collection_object', 'islandora_object'],
  },
};

export class ResultsService {
  types: string[] = [];
  @tracked rows: {}[] = [];
  @tracked pager: Pager = {
    current_page: 0,
    total_items: 0,
    total_pages: 0,
    items_per_page: 0,
  };
  @tracked sortBy: string | null = null;
  @tracked sortOrder: string | null = null;
  @tracked itemsPerPage: number | null = null;

  @tracked facets: Facet[];
  @tracked selectedFacets: FacetValue[] = [];

  constructor(type: string) {
    this.types = typeMap[type].types;
  }

  searchParams(): string {
    const typeQ: string = 'query=' + this.types.map((type) => `ss_type:${type}`).join(' OR ');
    // const typeQ: string = 'query=*:*';
    const pageParam: string = this.pager.current_page ? `&page=${this.pager.current_page}` : '';
    const sortByParam: string = !!this.sortBy ? this.sortBy : '';
    const orderByParam: string = !!this.sortOrder ? this.sortOrder : '';
    const itemsPerPageParam: string = !!this.itemsPerPage
      ? `&items_per_page=${this.itemsPerPage}`
      : '';

    const facetQ: string = this.selectedFacets
      .map((facet, index) => `f[${index}]=${facet.key}:${facet.value}`)
      .join('&');

    const queryParams: string =
      typeQ + pageParam + sortByParam + orderByParam + itemsPerPageParam + facetQ;

    return queryParams;
  }

  async fetchData() {
    const baseUrl = '/search_rest_endpoint?';

    const params = this.searchParams();

    let url: string = baseUrl + params;

    // console.log(url);

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      this.rows = data.rows;
      this.pager = data.pager;
      this.pager.current_page = this.pager.current_page;
    } catch (e) {
      console.log(e);
    }
  }

  async fetchFacets() {
    const baseUrl = '/search_facet_endpoint';
    const url: string = `${baseUrl}?${this.searchParams()}`;

    try {
      let res: Response = await fetch(url);
      let data = await res.json();

      this.facets = this.parseFacets(data.facets);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Parse facet data from search endpoint, ignore emtpies for now
   *
   * @param facets raw facets data from the facets endpoint
   */
  parseFacets(facets: []): Facet[] {
    let result: Facet[] = [];

    facets.forEach((data) => {
      result.push(parseFacet(data[0]));
    });

    return result.filter((facet) => !facet.isEmpty);
  }
}
