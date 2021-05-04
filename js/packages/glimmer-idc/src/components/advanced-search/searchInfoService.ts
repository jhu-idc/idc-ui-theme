import { CollectionSuggestion, SearchField } from '../../interfaces';

/**
 * Drupal JSONAPI filtering docs:
 * https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/filtering
 */
export default class SearchInfoService {

  /**
   * Get a list of search fields that can be used in an advanced search query.
   * TODO: any good way to make this dynamic?
   */
  searchFields(): SearchField[] {
    return [
      { keys: [], label: 'Keywords' },
      { keys: ['tm_X3b_en_title'], label: 'Title' },
      { keys: ['ss_author', 'sm_field_creator'], label: 'Author / creator' },
      { keys: ['sm_field_subject'], label: 'Subject' },
      { keys: ['sm_field_publisher'], label: 'Publisher' },
    ];
  }

  readonly suggestOperators: string[] = [
    '=', '<>', '>', '>=', '<', '<=', 'STARTS_WITH', 'CONTAINS', 'ENDS_WITH',
    'IN', 'NOT IN', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL'
  ];

  /**
   * Collection autocomplete using JSON:API
   *
   * Example request:
   *    /jsonapi?
   *      filter[title-suggester][condition][path]=title &
   *      filter[title-suggester][condition][operator]=CONTAINS &
   *      filter[title-suggester][condition][value]=??
   *
   * This filter should work as an autocomplete/suggester, filtering collections by
   * those that contain the user-input anywhere in their title. This filter _should_
   * be case insensitive!
   *
   * We can then use the drupal ID of the selected collection to search for `its_field_member_of:<ID>`
   * to restrict results to be within the given collection
   *
   * @param query {string} value that the suggestions are based off
   * @param field {string} field to filter by
   * @param op {string} operator used to control suggestions. Can be one of the following
   * @returns {array} list of CollectionSuggetion objects, including the collection id and title
   */
  async suggestCollection(query: string, field: string, op: string): Promise<CollectionSuggestion[]> {
    if (!this.suggestOperators.includes(op)) {
      console.error(`Unknown JSONAPI filter: "${op}. Must use one of: ${JSON.stringify(this.suggestOperators)}`);
      return [];
    }

    const path = `filter[title-suggest][condition][path]=${field}`;
    const operator = `filter[title-suggest][condition][operator]=${op}`;
    const value = `filter[title-suggest][condition][value]=${query}`;

    const url = `/jsonapi/node/collection_object?${path}&${operator}&${value}`;

    const results = await fetch(url);
    const json = await results.json();

    return json.data.map(collection => ({
      id: collection.attributes['drupal_internal__nid'],
      title: collection.attributes.title
    }));;
  }

}
