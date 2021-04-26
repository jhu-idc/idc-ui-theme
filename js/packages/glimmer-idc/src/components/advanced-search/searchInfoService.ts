export interface SearchField {
  /** Human readable label, useful for a UI */
  label: string;
  /** Machine-readable name, useful for constructing queries */
  key: string;
}

export default class SearchInfoService {

  /**
   * Get a list of search fields that can be used in an advanced search query
   */
  searchFields(): SearchField[] {
    return [
      { key: '', label: 'Keywords' },
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author / creator' },
      { key: 'subject', label: 'Subject' },
      { key: 'publisher', label: 'Publisher' },
    ];
  }

}
