import { renderComponent } from '@glimmerx/core';
import CollectionsList from './components/collections';

const collectionsListTarget = document.getElementById('collections-list');

if (collectionsListTarget) {
  renderComponent(CollectionsList, collectionsListTarget);
}
