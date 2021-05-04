import { action, on } from '@glimmer/modifier';
import Component, { hbs, tracked } from '@glimmerx/component';
import { CollectionSuggestion } from '../../interfaces';
import CollectionSuggester from './collection-suggester';

interface Args {
  selectedCollections: CollectionSuggestion[];
  collectionFilterSelected: (collections: CollectionSuggestion[]) => {};
}

export default class AdvancedSearchFilters extends Component<Args> {
  static template = hbs`
    <div class="bg-white shadow my-4 p-4">
      <h3 class="text-lg text-gray-500">Filter by collection</h3>
      <CollectionSuggester
        @collectionSelected={{@collectionFilterSelected}}
        @selected={{@selectedCollections}}
      />
    </div>
  `;
}
