import { renderComponent } from '@glimmerx/core';
import CollectionDetailsList, { ELEMENT_ID as collectionElementId } from './components/collection';
import CollectionsList from './components/collections';
import AboutCollectionDrawer from './components/about-collection-drawer';
import AboutCollectionButtonGroup from './components/about-collection-button-group';
import { ITEM_TYPES, ResultsService } from './utils/results';

const collectionsListTarget = document.getElementById('collections-list');
const collectionDetailsListTarget = document.getElementById(collectionElementId);
const aboutCollectionDrawerTarget = document.getElementById('about-collection-drawer');
const aboutCollectionButtonGroupTarget = document.getElementById('about-collection-button-group');

if (collectionsListTarget) {
  renderComponent(CollectionsList, {
    element: collectionsListTarget,
    services: {
      results: new ResultsService(ITEM_TYPES.COLLECTIONS),
    },
  });
} else if (collectionDetailsListTarget && aboutCollectionDrawerTarget && aboutCollectionButtonGroupTarget) {
  renderComponent(CollectionDetailsList, {
    element: collectionDetailsListTarget,
    services: {
      results: new ResultsService(ITEM_TYPES.COLLECTION),
    },
  });

  renderComponent(AboutCollectionDrawer, aboutCollectionDrawerTarget);
  renderComponent(AboutCollectionButtonGroup, aboutCollectionButtonGroupTarget);
}
