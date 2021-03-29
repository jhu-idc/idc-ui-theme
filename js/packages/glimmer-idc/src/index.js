import { renderComponent } from '@glimmerx/core';
import { ITEM_TYPES, ResultsService } from './utils/results';
import IDCSearch, { ELEMENT_ID } from './components/idc-search';

const searchTarget = document.getElementById(ELEMENT_ID)

if (searchTarget) {
  const type = searchTarget.dataset.type;

  if (type) {
    renderComponent(IDCSearch, {
      element: searchTarget,
      services: {
        results: new ResultsService(ITEM_TYPES[type.toUpperCase()])
      }
    });
  }
}
