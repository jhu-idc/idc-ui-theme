import { renderComponent } from '@glimmerx/core';
import CollectionsList from './components/collections';
import { ResultsService } from './utils/results';

const collectionsListTarget = document.getElementById('collections-list');

if (collectionsListTarget) {
  renderComponent(CollectionsList, {
    element: collectionsListTarget,
    services: {
      results: new ResultsService('collections')
    }
  });
}
