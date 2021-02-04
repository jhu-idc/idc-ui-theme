import Component, { hbs } from '@glimmerx/component';
import { fn } from '@glimmerx/helper';
import { on } from '@glimmerx/modifier';
import Facet from '../models/facet';

interface Args {
  facet: Facet;
}

export default class Facets extends Component<Args> {
  static template = hbs`
    <a href="javascript:;" class="" {{on "click" (fn @onClick @facet)}}>
      {{@facet.values.value}}&nbsp;
      <span class="">({{@facet.values.count}})</span>
    </a>
  `;
}
