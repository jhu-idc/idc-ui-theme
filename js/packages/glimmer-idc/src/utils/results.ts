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
  none: {
    types: []
  }
};

export const ITEM_TYPES = {
  COLLECTIONS: 'collections',
  COLLECTION: 'mixed',
  ITEM: 'items',
  NONE: 'none'
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
   * Init this service according to a URL. Basically reverse of #searchParams.
   *
   * Parsing searchTerms, nodeFilter, and typeQ, are mashed together in the SOLR query
   * making them a bit more tricky to tease apart
   *
   * Example: /search_rest_endpoint?query=this is a moo AND its_field_member_of:33 AND (ss_type:collection_object OR ss_type:islandora_object)&page=0&f[0]=date_created:2000-01-01
   *
   * We shouldn't allow query parameters here to disrupt some functionality, such
   * as limiting the search to a certain type.
   *
   * @param currentUrl URL you wish to parse
   */
  initFromUrl(currentUrl: string) {
    const url = new URL(currentUrl);

    if (!url.search) {
      return;
    }

    const queryParams = url.searchParams;

    this.parseSolrQuery(queryParams.get('query'));

    if (queryParams.has('page')) {
      this.pager.current_page = parseInt(queryParams.get('page'));
    }

    if (queryParams.has('items_per_page')) {
      const ipp = parseInt(queryParams.get('items_per_page'));
      this.pager.items_per_page = ipp;
      this.itemsPerPage = ipp;
    }

    /**
     * Note for `sort_by` and `sort_order`, we re-create how the data is added
     * to the results service from the UI
     */
    if (queryParams.has('sort_by')) {
      this.sortBy = `&sort_by=${queryParams.get('sort_by')}`;
    }

    if (queryParams.has('sort_order')) {
      this.sortOrder = `&sort_order=${queryParams.get('sort_order')}`;
    }

    /**
     * TODO: How do we handle facets? Facets in this service contain quite a lot of
     * information simply not available in the URL. We'd have to initiate the search
     * then programmatically select the relevent facets?
     * That would be super janky, since selecting each facet currently kicks off its
     * own search...
     *
     * For now, let's get the rest working without facets
     */

  }

  /**
   * Break apart the SOLR query to get
   *
   *  - searchTerms
   *  - nodeFilter
   *  - type query (Do not override pre-defined type queries!)
   *
   * Example: query=this is a moo AND its_field_member_of:33 AND (ss_type:collection_object OR ss_type:islandora_object)
   *
   * @param query SOLR query, to be parsed
   */
  parseSolrQuery(query: string) {
    if (!query) {
      // NULL or undefined query can happen when loading the component with no URL params
      return;
    }

    /**
     * Get only the search term from the URL.
     * We'll explicitly ignore `nodeFilter` and `type query` parts, since those
     * will always be configured per component instance, thus shouldn't appear
     * in the URL.
     */
    const parts: Array<string> = query.split(' AND ');
    this.searchTerms = parts.find(qPart => !qPart.includes('ss_type') && !qPart.includes('field_memeber_of'));
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
    const searchTermsParam: string = !!this.searchTerms ? `${this.searchTerms}` : '';
    const nodeFilter: string = !!nodeId ? `its_field_member_of:${nodeId}` : '';
    const typeQ: string = (!!this.types && this.types.length > 0) ?
        `(${this.types.map((type) => `ss_type:${type}`).join(' OR ')})` : '';
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
      searchTermsParam + ((!!searchTermsParam && (!!nodeFilter || !!typeQ)) ? ' AND ' : '') +
      nodeFilter + ((!!nodeFilter && !!typeQ) ? ' AND ' : '') +
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
