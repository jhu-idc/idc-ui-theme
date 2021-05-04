import Component, { hbs } from '@glimmerx/component';

interface Args {}

/**
 * Component to show some help-text for advanced search in IDC.
 */
export default class SearchTips extends Component<Args> {
  static template = hbs`
    <div class=""><!-- Help-text -->
      <div class="bg-gray-200 p-4 text-gray-700">
        <div class="border-b border-blue-spirit text-center pb-2 mb-2">
          <h3 class="text-lg font-bold">Need some help?</h3>
        </div>
        <div class="m-4 text-sm">
          <ul class="list-disc list-inside">
            <li class="my-2">Use quotation marks to search as a phrase</li>
            <li class="my-2">
              Use the <span class="text-lg font-bold">%</span> wildcard character to search for words with one alternate character
            </li>
            <li class="my-2">
              Use the <span class="text-lg font-bold">?</span> wildcard character to search for words with multiple alternate characters
            </li>
            <li class="my-2">Add as many search term inputs as you need</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
