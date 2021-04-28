export interface SearchField {
  /** Human readable label, useful for a UI */
  label: string;
  /** Machine-readable name, useful for constructing queries */
  keys: string[];
}

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

}
