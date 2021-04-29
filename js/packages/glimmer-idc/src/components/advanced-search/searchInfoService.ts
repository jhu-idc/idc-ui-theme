export interface SearchField {
  /** Human readable label, useful for a UI */
  label: string;
  /** Machine-readable name, useful for constructing queries */
  keys: string[];
}

/**
 * Drupal JSONAPI filtering docs:
 * https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/filtering
 */
export default class SearchInfoService {

  /**
   * Get a list of search fields that can be used in an advanced search query
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

  /**
   * Collection autocomplete using JSON:API
   *
   * Example request:
   *    /jsonapi?
   *      filter[title-suggester][condition][path]=title &
   *      filter[title-suggester][condition][operator]=CONTAINS &
   *      filter[title-suggester][condition][value]=<??>
   *
   * This filter should work as an autocomplete/suggester, filtering collections by
   * those that contain the user-input anywhere in their title. This filter _should_
   * be case insensitive!
   *
   * We can then use the drupal ID of the selected collection to search for `its_field_member_of:<ID>`
   * to restrict results to be within the given collection
   */
  suggestCollection(field: string, op: string) {
    
  }

}
