import { SearchApiResponse, Pager } from '../interfaces';
import { Facet } from '../models/facet';
import { tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';
// import SelectedFacet from '../models/selected-facet';

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
  // selectedFacets: SelectedFacet[] = [];

  constructor(type: string) {
    this.types = typeMap[type].types;
  }

  searchParams(page?: number): string {
    let urlQuery: string = '';

    const typeQ: string = this.types.map((type) => `ss_type:${type}`).join(' OR ');
    const pageParam: string = `page=${--page}`;
    // const facetQ: string = this.selectedFacets
    //   .map((facet, index) => `f[${index}]=${facet.field}:${facet.key}`)
    //   .join('&');

    // const queryParam: string = `${typeQ}${!!facetQ ? `&${facetQ}` : ''}`;
    const queryParam: string = `${typeQ}`;

    urlQuery = `${queryParam}${!!page ? `&${pageParam}` : ''}`;
    console.log(`SearchParams: ${urlQuery}`);
    return '*:*';
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
    const baseUrl = '/search_facet_endpoint?query=';
    const url: string = `${baseUrl}${this.searchParams()}`;

    try {
      let res: Response = await fetch(url);
      let data = await res.json();

      this.facets = this.parseFacets(data.facets);
    } catch (e) {
      console.log(e);
    }
  }

  parseFacets(facets: []): Facet[] {
    let result: Facet[] = [];

    facets.forEach((data) => {
      result.push(new Facet(data[0]));
    });

    return result.filter((facet) => !facet.isEmpty);
  }
}
