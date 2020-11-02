import { renderComponent } from '@glimmer/core';
import App from './App';
import MyComponent from './MyComponent';

const containerElement = document.getElementById('app1');
const containerElement2 = document.getElementById('app2');

renderComponent(App, containerElement);
renderComponent(MyComponent, containerElement2);
