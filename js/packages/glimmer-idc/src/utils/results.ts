import { SearchApiResponse, Pager, CollectionSuggestion, LanguageValue } from '../interfaces';
import { tracked } from '@glimmerx/component';
import { Facet } from '../models/facet';
import { FacetValue } from '../interfaces';
import { facetValueIncludes, parseFacet } from './facet-utils';
import { FIELD_MEMBER_OF, FIELD_LANGUAGE, FIELD_TYPE, FIELD_YEARS } from './solr-fields';

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
  /** Filter results using these collection IDs */
  @tracked nodeFilters: CollectionSuggestion[] = [];
  @tracked langFilters: LanguageValue[] = [];
  /** Only pay attention to the Years */
  @tracked dateFilters: Date[] = [null, null];

  @tracked baseNode: string;

  @tracked query: string = '';

  /**
   * Init mode should only be set to TRUE when initializing this service from a URL.
   * Its intent is to mark facets in the URL as selected _after_ the initial search has
   * been complete and we have the full facet data. It will also prevent new searches
   * from being requested when facets are selected.
   */
  @tracked initMode: boolean = false;

  constructor(type: string) {
    this.types = typeMap[type].types;
  }

  /**
   * Init this service according to a URL. Basically reverse of #searchParams.
   *
   * Parsing searchTerms, nodeFilter, and typeQ, are mashed together in the SOLR query
   * making them a bit more tricky to tease apart
   *
   * Example: /search_rest_endpoint?query=this is a moo AND itm_field_member_of:33 AND (ss_type:collection_object OR ss_type:islandora_object)&page=0&f[0]=date_created:2000-01-01
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

    this.searchTerms = queryParams.get('query');

    if (queryParams.has('page')) {
      this.pager.current_page = parseInt(queryParams.get('page')) + 1;
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

    // TODO: Can we simply inspect the URL path for `/node/<node_id>`?
    if (queryParams.has('nodeId')) {
      this.baseNode = queryParams.get('nodeId');
    }

    // TODO: temporarily just use the ID as the title for simplicity
    if (queryParams.has('collections')) {
      this.nodeFilters = queryParams.get('collections')
        .split(',')
        .map((id) => ({ id: id, title: id}) );
    }

    /**
     * Mark facets found in the URL as "selected"
     *
     * These "selected" facets will not be fully populated with the full facet
     * data that would normally be returned in search requests, since we are limited
     * by the data available in the URL. Thus we can only rely on the facet `frag`
     * property, and potentially the facet `value` property.
     *
     * Once the initial search request returns, we will try matching initially
     * selected facets to real facets by matching the facet frag and replace
     * the initial data with the real facet data.
     */
    let queryStr = decodeURIComponent(url.search);
    if (queryStr.includes('f[')) {
      this.initMode = true;

      if (queryStr.startsWith('?')) {
        queryStr = queryStr.slice(1);
      }

      const facetParams = queryStr.split('&').filter(param => param.startsWith('f['));

      facetParams.forEach((param) => {
        const frag = param.slice(param.indexOf('=') + 1); // Fragment without the f[#] piece
        const parts = frag.split(':');

        this.selectedFacets.push({
          key: parts[0],
          value: parts[1],
          frag: decodeURI(frag),
          count: 0,
          url: ''
        });
      });
    }
  }

  /**
   * We need to be careful of `searchTermsParam` + `typeQ` combination.
   *
   * searchTerm AND ss_type:collection_object OR ss_type:islandora_object
   *  vs
   * searchTerm AND (ss_type:collection_object OR ss_type:islandora_object)
   *  vs
   * (searchTerm) AND ss_type:collection_object OR ss_type:islandora_object
   *  etc
   *
   * Solr field:
   *    itm_field_member_of - "Member Of" field showing parent node(s)
   *    ss_type - "Type" field showing object model type (collection_object OR islandora_object)
   *
   * If an node ID is provided, we should restrict the search to return results that are
   * children of the provided node. This can be done by querying the provided ID against
   * the "member_of" field. Child nodes have this field to point to their parent node.
   *
   * @param nodeId {string} entity ID of the current node
   */
  searchParams(): string {
    const searchTermsParam: string = !!this.searchTerms ? `(${this.searchTerms})` : '';

    /**
     * NodeFilter and collectionFilter represent the same kind of query, but
     * come from different sources, so they are kept separate
     */
    let nodeFilter: string = '';
    let nodeParam: string = '';
    if (!!this.baseNode) {
      nodeFilter = `${FIELD_MEMBER_OF}:${this.baseNode}`;
      nodeParam = `&nodeId=${this.baseNode}`;
    }

    let collectionFilter: string = '';
    let collectionsParam: string = '';
    if (this.nodeFilters.length > 0) {
      collectionFilter = '(' + this.nodeFilters
        .map(col => `${FIELD_MEMBER_OF}:${col.id}`)
        .join(' OR ') + ')';
      collectionsParam = `&collections=${this.nodeFilters.map(col => col.id).join(',')}`;
    }

    const dateFilter = this.dateRangeQuery();
    const typeQ: string = (!!this.types && this.types.length > 0) ?
        `(${this.types.map((type) => `${FIELD_TYPE}:${type}`).join(' OR ')})` : '';
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

    const langParam: string = this.langFilters.length > 0 ?
      '(' + this.langFilters
        .map(lang => `${FIELD_LANGUAGE}:${lang.id}`)
        .join(' OR ') + ')'
      : '';

    const solrParts: string[] = [
      searchTermsParam,
      nodeFilter,
      collectionFilter,
      `${langParam}`,
      dateFilter,
      typeQ
    ].filter(part => !!part);

    let queryParams = solrParts.join(' AND ');

    queryParams = queryParams
      .concat(nodeParam)
      .concat(collectionsParam)
      .concat(pageParam)
      .concat(sortByParam)
      .concat(orderByParam)
      .concat(itemsPerPageParam)
      .concat(facetParam);

    let query = `query=${queryParams}`;

    this.query = query;

    return query;
  }

  async fetchData() {
    const baseUrl = '/search_rest_endpoint';
    const params = this.searchParams();

    let url: string = `${baseUrl}?${params}`;

    try {
      let res: Response = await fetch(url);
      let data: SearchApiResponse = await res.json();

      // Update the URL after successful response
      this.updateClientUrl(params);

      this.rows = data.rows;
      this.pager = data.pager;
      this.pager.current_page = ++this.pager.current_page;
      this.facets = this.parseFacets(data.facets, data.facets_metadata);

      if (this.initMode) {
        // Select facets here only when in init mode. Otherwise, rely on the
        // user to select facets in the UI
        const initFacets = [...this.selectedFacets]; // Clone the array
        this.selectedFacets = this.facets
          .map(facet => facet.items)
          .flat()
          // facet.frag is the only value we can rely on as being consistent between
          // the URL fragment and facet data from a search request
          .filter(item => initFacets.some(val => val.frag === item.frag));

        this.initMode = false;
      }
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

  /**
   * Update the client URL query fragment to (mostly) match the search request
   * query fragment.
   *
   * We need to slightly rebuild in order to ignore the `typeQ` and `nodeFilter`
   * pieces of the query.
   *
   * @param searchParams query parameters used when submitting a search request
   */
  updateClientUrl(searchRequest: string) {
    let url = new URL(window.location.href);

    const queriless = searchRequest
      .split('&')
      .filter(part => !!part && !part.startsWith('query'));

    let updatedQueryParts = [];
    if (!!this.searchTerms) {
      updatedQueryParts = updatedQueryParts.concat(`query=${this.searchTerms}`);
    }

    updatedQueryParts = updatedQueryParts.concat(queriless);

    url.search = updatedQueryParts.join('&');
    history.replaceState({}, '', url.toString());
  }

  dateRangeQuery(): string {
    if (!this.dateFilters || this.dateFilters.length === 0) {
      return '';
    }

    const dates: Date[] = this.dateFilters.filter(date => !!date);
    let query: string = '';

    if (dates.length === 1) {
      query = `${FIELD_YEARS}:${dates[0].getFullYear()}`;
    } else if (dates.length === 2) {
      query = `${FIELD_YEARS}:[${dates.map(year => year.getFullYear()).join(' TO ')}]`;
    }

    return query;
  }
}
