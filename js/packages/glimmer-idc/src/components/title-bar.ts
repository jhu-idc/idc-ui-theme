import Component, { hbs } from '@glimmerx/component';
import PaginationControls from './pagination-controls';
import { Pager, Options } from '../interfaces';
import SearchOptions from './search-options';

interface Args {
  title: string,
  pager: Pager,
  goToPage: (page: number) => {},
  prevPage: () => {},
  nextPage: () => {},
  applySearchOptions: (options: Options) => {},
}

export default class TitleBar extends Component<Args> {
  static template = hbs`
    <div class="flex bg-white px-4 py-5 border-b border-gray-200 sm:px-6 justify-between items-center">
      <h2 class="text-xl font-bold leading-6">
        {{@title}}
      </h2>
      <div class="flex items-center">
        <PaginationControls
          @compact={{true}}
          @pager={{@pager}}
          @goToPage={{@goToPage}}
          @prevPage={{@prevPage}}
          @nextPage={{@nextPage}}
        />
        <SearchOptions
          @applySearchOptions={{@applySearchOptions}}
          @pager={{@pager}}
          @sortBy={{@sortBy}}
          @sortOrder={{@sortOrder}}
          @itemsPerPage={{@itemsPerPage}}
        />
      </div>
    </div>
  `;
}
