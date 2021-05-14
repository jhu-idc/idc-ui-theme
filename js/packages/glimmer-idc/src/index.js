import { renderComponent } from '@glimmerx/core';
import { ITEM_TYPES, ResultsService } from './utils/results';
import IDCSearch, { ELEMENT_ID } from './components/idc-search';
import AboutCollectionDrawer from './components/about-collection-drawer';
import AboutCollectionButtonGroup from './components/about-collection-button-group';
import SearchInfoService from './components/advanced-search/searchInfoService';

const searchTarget = document.getElementById(ELEMENT_ID);
const aboutCollectionDrawerTarget = document.getElementById('about-collection-drawer');
const aboutCollectionButtonGroupTarget = document.getElementById('about-collection-button-group');

if (searchTarget) {
  const type = searchTarget.dataset.type;

  if (type) {
    renderComponent(IDCSearch, {
      element: searchTarget,
      services: {
        results: new ResultsService(ITEM_TYPES[type.toUpperCase()]),
        searchInfo: new SearchInfoService(),
      }
    });
  }
}

if (aboutCollectionDrawerTarget && aboutCollectionButtonGroupTarget) {
  renderComponent(AboutCollectionDrawer, aboutCollectionDrawerTarget);
  renderComponent(AboutCollectionButtonGroup, aboutCollectionButtonGroupTarget);
}
