import { renderComponent } from '@glimmerx/core';
import { ITEM_TYPES, ResultsService } from './utils/results';
import IDCSearch, { ELEMENT_ID } from './components/idc-search';
import AboutCollectionDrawer from './components/about-collection-drawer';
import AboutCollectionButtonGroup from './components/about-collection-button-group';
import SearchInfoService from './components/advanced-search/searchInfoService';
import ItemDescription from './components/item-description';
import PdfViewer from './components/pdf-viewer';
import VideoViewer from './components/video-viewer';
import Citations from './components/citations';

const searchTarget = document.getElementById(ELEMENT_ID);
const aboutCollectionDrawerTarget = document.getElementById('about-collection-drawer');
const aboutCollectionButtonGroupTarget = document.getElementById('about-collection-button-group');
const itemDescriptionTarget = document.getElementById('item-description');
const pdfViewerTarget = document.getElementById('pdf-viewer');
const videoViewerTarget = document.getElementById('video-viewer');
const citationsTarget = document.getElementById('citations-modal-content');

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

if (itemDescriptionTarget) {
  renderComponent(ItemDescription, itemDescriptionTarget);
}

if (pdfViewerTarget) {
  renderComponent(PdfViewer, pdfViewerTarget);
}

if (videoViewerTarget) {
  renderComponent(VideoViewer, videoViewerTarget);
}

if (citationsTarget) {
  renderComponent(Citations, citationsTarget);
}
