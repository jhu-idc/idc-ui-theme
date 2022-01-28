import Component, { hbs } from '@glimmerx/component';

interface Args {}

/**
 * Component to show some help-text for advanced search in IDC.
 */
export default class SearchTips extends Component<Args> {
  static template = hbs`
    <div id="search-tips-container" class="" data-test-advanced-search-help><!-- Help-text -->
      <div class="p-4 my-2 bg-gray-200 text-gray-700">
        <div class="border-b border-gray-500 text-center pb-2 mb-2">
          <h3 class="text-lg font-bold">Search Tips</h3>
        </div>
        <div class="m-4 text-sm">
          <ul class="list-disc list-inside">
            <li class="my-1">Use double quotes (<code>"</code>) to search as a phrase</li>
            <li class="my-1">
              Use the <code>?</code> wildcard character to search for words with one alternate character. For example, <span class="italic">te?t</span> should match test and text
            </li>
            <li class="my-1">
              Use the <code>*</code> wildcard character to search for words with multiple alternate characters. Searching for <span class="italic">test*</span> should match test, tester, testing, etc
            </li>
            <li class="my-1">
              Use the proximity search syntax if you want to search for two terms within a certain number of words of each other or you can add a proximity search term on the Advanced Search page.
              The term <span class="italic">"farm goat"~10</span>, including the quotes, should match an item that has the words "farm" and "goat" within 10 words of each other
            </li>
            <li class="my-1">
              Use the <code>AND</code>, <code>OR</code>, <code>NOT</code> boolean operators in your searches, or combine search terms on the Advanced Search page. For example, in the global
              search, you can search for <span class="italic">farm AND goat</span> to look for items with both terms. If you manually enter these operators, make sure they are capitalized, as you see in this example
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
