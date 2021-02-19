import { renderComponent } from '@glimmerx/core';
import CollectionDetailsList, { ELEMENT_ID as collectionElementId } from './components/collection';
import CollectionsList from './components/collections';
import { ITEM_TYPES, ResultsService } from './utils/results';

const collectionsListTarget = document.getElementById('collections-list');
const collectionDetailsListTarget = document.getElementById(collectionElementId);

if (collectionsListTarget) {
  renderComponent(CollectionsList, {
    element: collectionsListTarget,
    services: {
      results: new ResultsService(ITEM_TYPES.COLLECTIONS),
    },
  });
} else if (collectionDetailsListTarget) {
  renderComponent(CollectionDetailsList, {
    element: collectionDetailsListTarget,
    services: {
      results: new ResultsService(ITEM_TYPES.COLLECTION),
    },
  });
}
