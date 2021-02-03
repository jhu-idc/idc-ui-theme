import Component, { hbs } from '@glimmerx/component';
import { action, on } from '@glimmerx/modifier';
import { fn } from '@glimmerx/helper';
import { is } from '../utils/helpers';

interface Args {
  item: any,
  goToPage: (page: number) => {},
  prevPage: () => {},
  nextPage: () => {}
}

export default class PageItem extends Component<Args> {
  static template = hbs`
    {{#if (is @item 'type' 'page')}}
      <button aria-label="page number {{@item.page}}" class="mr-2 hover:bg-gray-200 rounded-full p-2 {{if @item.selected "bg-blue-spirit"}}" {{on "click" (fn @goToPage @item.page)}}>
        {{@item.page}}
      </button>
    {{else if (is @item 'type' 'start-ellipsis')}}
      <div aria-label="start ellipsis" class="mr-2">...</div>
    {{else if (is @item 'type' 'end-ellipsis')}}
      <div aria-label="end ellipsis" class="mr-2">...</div>
    {{else if (is @item 'type' 'previous')}}
      <button
        aria-label="previous page"
        class="border rounded-full mr-4 p-2 shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={{@item.disabled}}
        {{on "click" @prevPage}}
      >
        <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    {{else if (is @item 'type' 'next')}}
      <button
        aria-label="next page"
        class="border rounded-full ml-2 p-2 shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={{@item.disabled}}
        {{on "click" @nextPage}}
      >
        <svg class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    {{/if}}
  `;
}
