import Component, { hbs, tracked } from '@glimmerx/component';
import { Pager } from '../interfaces';
import PageItem from './page-item';

interface Args {
  compact: boolean;
  pager: Pager;
  goToPage: (page: number) => {};
  prevPage: () => {};
  nextPage: () => {};
  itemLabel: string;
}

export default class PaginationControls extends Component<Args> {
  @tracked compact: boolean = this.args.compact || false;

  get lastItemOnPage() {
    const end = this.offset + Number(this.args.pager.items_per_page) - 1;

    if (end > this.args.pager.total_items) {
      return this.args.pager.total_items;
    }

    return end;
  }

  get offset() {
    return (this.args.pager.current_page - 1) * Number(this.args.pager.items_per_page) + 1;
  }

  get paginatedItems() {
    let page = this.args.pager.current_page;
    let boundaryCount = this.compact ? 1 : 3;
    let siblingCount = this.compact ? 1 : 3;
    let count = this.args.pager.total_pages;
    let disabled = false;
    let hideNextButton = false;
    let hidePrevButton = false;
    let showFirstButton = false;
    let showLastButton = false;

    const range = (start: number, end: number): any[] => {
      const length = end - start + 1;
      return Array.from({ length }, (_, i) => start + i);
    };

    const startPages = range(1, Math.min(boundaryCount, count));
    const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

    const siblingsStart = Math.max(
      Math.min(
        // Natural start
        page - siblingCount,
        // Lower boundary when page is high
        count - boundaryCount - siblingCount * 2 - 1
      ),
      // Greater than startPages
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(
        // Natural end
        page + siblingCount,
        // Upper boundary when page is low
        boundaryCount + siblingCount * 2 + 2
      ),
      // Less than endPages
      endPages.length > 0 ? endPages[0] - 2 : count - 1
    );

    // Basic list of items to render
    // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
    const itemList = [
      ...(showFirstButton ? ['first'] : []),
      ...(hidePrevButton ? [] : ['previous']),
      ...startPages,

      // Start ellipsis
      // eslint-disable-next-line no-nested-ternary
      ...(siblingsStart > boundaryCount + 2
        ? ['start-ellipsis']
        : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

      // Sibling pages
      ...range(siblingsStart, siblingsEnd),

      // End ellipsis
      // eslint-disable-next-line no-nested-ternary
      ...(siblingsEnd < count - boundaryCount - 1
        ? ['end-ellipsis']
        : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

      ...endPages,
      ...(hideNextButton ? [] : ['next']),
      ...(showLastButton ? ['last'] : []),
    ];

    // Map the button type to its page number
    const buttonPage = (type) => {
      switch (type) {
        case 'first':
          return 1;
        case 'previous':
          return page - 1;
        case 'next':
          return page + 1;
        case 'last':
          return count;
        default:
          return null;
      }
    };

    // Convert the basic item list to PaginationItem
    const items = itemList.map((item) => {
      return typeof item === 'number'
        ? {
            type: 'page',
            page: item,
            selected: item === page,
            disabled,
            'aria-current': item === page ? 'true' : undefined,
          }
        : {
            type: item,
            page: buttonPage(item),
            selected: false,
            disabled:
              disabled ||
              (item.indexOf('ellipsis') === -1 &&
                (item === 'next' || item === 'last' ? page >= count : page <= 1)),
          };
    });

    return items;
  }

  static template = hbs`
    {{#if this.compact}}
      <div class="flex flex-col items-center">
        <div class="flex items-center">
          {{#each this.paginatedItems as |item|}}
            <PageItem
              @item={{item}}
              @goToPage={{@goToPage}}
              @prevPage={{@prevPage}}
              @nextPage={{@nextPage}}
            />
          {{/each}}
        </div>
        <div class="text-gray-500 text-sm">
          {{this.offset}} – {{this.lastItemOnPage}} of {{@pager.total_items}} {{@itemLabel}}
        </div>
      </div>
    {{else}}
      <div class="flex items-center">
        <div class="flex items-center mr-6">
          {{#each this.paginatedItems as |item|}}
            <PageItem
              @item={{item}}
              @goToPage={{@goToPage}}
              @prevPage={{@prevPage}}
              @nextPage={{@nextPage}}
            />
          {{/each}}
        </div>
        <div class="text-gray-500">
          Showing {{this.offset}} – {{this.lastItemOnPage}} of {{@pager.total_items}} {{@itemLabel}}
        </div>
      </div>
    {{/if}}
  `;
}
