import Component from '@glimmer/component';
import { setComponentTemplate, createTemplate } from '@glimmer/core';

import logo from './logo.svg';
import './App.css';

export default class App extends Component {
  logo = logo;
}

setComponentTemplate(
  createTemplate(`
    <div id="intro">
      <img src={{this.logo}}/>

      <h1 class="text-3xl text-blue-500">hello, glimmer 1 i'm being watched by lerna!</h1>
      <h3>
        you can get started by editing <code>src/App.js</code>,
        and run tests by visiting <a href="./tests">/tests</a>
      </h3>
    </div>
  `),
  App
);
