import { SearchApiResponse, Pager } from '../interfaces';
import { tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';
import { Facet } from '../models/facet';
import { FacetValue } from '../interfaces';
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

export const ITEM_TYPES = {
  COLLECTIONS: 'collections',
  COLLECTION: 'mixed',
  ITEM: 'items',
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
  @tracked searchTerms: string | null = null;
  @tracked facets: Facet[];
  @tracked selectedFacets: FacetValue[] = [];

  constructor(type: string) {
    this.types = typeMap[type].types;
  }

  /**
   * TODO: we may need to be careful of `searchTermsParam` + `typeQ` combination.
   *
   * searchTerm AND ss_type:collection_object OR ss_type:islandora_object
   *  vs
   * searchTerm AND (ss_type:collection_object OR ss_type:islandora_object)
   *
   * These two constructions may produce different results, warrants some investigation
   *
   *
   * Solr field:
   *    its_field_member_of - "Member Of" field showing parent node(s)
   *
   * If an node ID is provided, we should restrict the search to return results that are
   * children of the provided node. This can be done by querying the provided ID against
   * the "member_of" field. Child nodes have this field to point to their parent node.
   *
   * @param nodeId {string} entity ID of the current node
   */
  searchParams(nodeId?: string): string {
    const searchTermsParam: string = !!this.searchTerms ? `${this.searchTerms} AND ` : '';
    const nodeFilter: string = !!nodeId ? `its_field_member_of:${nodeId} AND ` : '';
    const typeQ: string = `(${this.types.map((type) => `ss_type:${type}`).join(' OR ')})`;
    const pageParam: string = this.pager.current_page ? `&page=${--this.pager.current_page}` : '';
    const sortByParam: string = !!this.sortBy ? this.sortBy : '';
    const orderByParam: string = !!this.sortOrder ? this.sortOrder : '';
    const itemsPerPageParam: string = !!this.itemsPerPage
      ? `&items_per_page=${this.itemsPerPage}`
      : '';
    const facetParam: string =
      this.selectedFacets.length > 0
        ? '&' + this.selectedFacets.map((facet, index) => `f[${index}]=${facet.frag}`).join('&')
        : '';

    const queryParams: string =
      searchTermsParam +
      nodeFilter +
      typeQ +
      pageParam +
      sortByParam +
      orderByParam +
      itemsPerPageParam +
      facetParam;

    return queryParams;
  }

  async fetchData(nodeId?: string) {
    const baseUrl = '/search_rest_endpoint?query=';

    const params = this.searchParams(nodeId);

    let url: string = baseUrl + params;

    console.log(url);

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      this.rows = data.rows;
      this.pager = data.pager;
      this.pager.current_page = ++this.pager.current_page;
      this.facets = this.parseFacets(data.facets, data.facets_metadata);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Parse facet data from search endpoint, ignore empties for now
   *
   * @param facets raw facets data from the facets endpoint
   */
   parseFacets(facets: Facet[], meta: {}): Facet[] {
    let result: Facet[] = [];

    facets.forEach((data, index) => {
      result.push(parseFacet(data[0], meta));
    });

    return result.filter((facet) => !facet.isEmpty);
  }
}
