import Component, { hbs } from '@glimmerx/component';

interface Args {
  styles: string;
}

export class CarrotDown extends Component<Args> {
  static template = hbs`
    <svg class={{@styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  `;
}

export class CarrotUp extends Component<Args> {
  static template = hbs`
    <svg class={{@styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 15l7-7 7 7" />
    </svg>
  `;
}

