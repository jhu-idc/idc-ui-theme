import Component from '@glimmer/component';
import { setComponentTemplate, precompileTemplate } from '@glimmer/core'

export default class ListSpinner extends Component {}
  setComponentTemplate(
    precompileTemplate(
    `
    <div class="bg-white shadow">
      <div class="flex h-auto p-4 items-center justify-center">
        <div class="sk-pulse bg-blue-heritage"></div>
      </div>
    </div>
    `,
    { strictMode: true }
    ),
    ListSpinner,
  );
