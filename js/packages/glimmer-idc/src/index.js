import { renderComponent } from '@glimmer/core';

import App from './App';
import MyComponent from './MyComponent';

const containerElement = document.getElementById('glimmer-idc');
const containerElement2 = document.getElementById('app2');

renderComponent(App, containerElement);
renderComponent(MyComponent, containerElement2);
