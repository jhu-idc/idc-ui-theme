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
  facets: Facet[];
  selectedFacets: FacetValue[] = [];

  constructor(type: string) {
    this.types = typeMap[type].types;
  }

  searchParams(page?: number): string {
    const typeQ: string = this.types.map((type) => `ss_type:${type}`).join(' OR ');
    const pageParam: string = `page=${page > 0 ? --page : 0}`;
    const facetQ: string = this.selectedFacets
      .map((facet, index) => `f[${index}]=${facet.key}:${facet.value}`)
      .join('&');

    const queryParam: string = `${typeQ}`;
    // Explicitly set search q to find everything for debugging
    // const queryParam: string = '*:*';

    let urlQuery: string = `query=${queryParam}${!!page ? `&${pageParam}` : ''}${
      !!facetQ ? `&${facetQ}` : ''
    }`;
    // console.log(`SearchParams: ${urlQuery}`);
    return urlQuery;
  }

  async fetchData(page: number) {
    const baseUrl = '/search_rest_endpoint?query=';
    const typeParams: string = this.types.map((type) => `ss_type:${type}`).join(' OR ');
    const pageParam = `&page=${--page}`;

    let url: string = baseUrl + typeParams;

    if (page) {
      url = url + pageParam;
    }

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      this.rows = data.rows;
      this.pager = data.pager;
      this.pager.current_page = ++this.pager.current_page;
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
