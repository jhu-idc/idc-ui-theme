import { SearchApiResponse, Pager } from '../interfaces';
import { tracked } from '@glimmerx/component';
import { action } from '@glimmerx/modifier';

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

    const queryParams: string =
      searchTermsParam +
      nodeFilter +
      typeQ +
      pageParam +
      sortByParam +
      orderByParam +
      itemsPerPageParam;

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
    } catch (e) {
      console.log(e);
    }
  }
}
