export type SearchApiResponse = {
  rows: {}[],
  pager: Pager
}

export type Pager = {
  current_page: number,
  total_items: number,
  total_pages: number,
  items_per_page: number
}
