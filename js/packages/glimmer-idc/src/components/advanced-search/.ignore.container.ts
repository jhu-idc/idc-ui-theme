import Component, { hbs, tracked } from '@glimmerx/component';
import AdvancedSearchOptions from './.ignore.search-options';

interface Args {}

export default class IDCAdvancedSearch extends Component<Args> {

  static template = hbs`
    <div class="">
      <div class="grid gap-4 xl:grid-cols-5">
        <div class=""><!-- Search filters area -->
          <AdvancedSearchOptions />
        </div>
        <div class="xl:col-span-3 p-4 border"><!-- Main search term input area -->
        </div>
        <div class=""><!-- Help text box -->
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
      </div>
    </div>
  `;
}
