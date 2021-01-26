import { renderComponent } from '@glimmerx/core';
import CollectionsItemsList from './components/collections';

const collectionsItemsListTarget = document.getElementById('collections-items-list');

if (collectionsItemsListTarget) {
  renderComponent(CollectionsItemsList, collectionsItemsListTarget);
}
