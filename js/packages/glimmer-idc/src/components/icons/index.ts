import Component from '@glimmer/component';
import { setComponentTemplate, precompileTemplate } from '@glimmer/core';

interface Args {
  styles: string;
}

class BaseIcon extends Component<Args> {
  get styles() {
    return this.args.styles || 'h-6 w-6 text-gray-500';
  }
}

export class ChevronDownIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
    `,
    { strictMode: true }
    ),
    ChevronDownIcon
  );

export class ChevronLeftIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    `,
    { strictMode: true }
    ),
    ChevronLeftIcon
  );

export class ChevronRightIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    `,
    { strictMode: true }
    ),
    ChevronRightIcon
  );

export class ChevronUpIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 15l7-7 7 7" />
    </svg>
    `,
    { strictMode: true }
    ),
    ChevronUpIcon
  );

export class XIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="{2}" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
    `,
    { strictMode: true }
    ),
    XIcon
  );

export class XFilledIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg xmlns="http://www.w3.org/2000/svg" class={{this.styles}} viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
    `,
    { strictMode: true }
    ),
    XFilledIcon
  );

export class XCircleIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg xmlns="http://www.w3.org/2000/svg" class={{this.styles}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    `,
    { strictMode: true }
    ),
    XCircleIcon
  );

export class PlusIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg xmlns="http://www.w3.org/2000/svg" class={{this.styles}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    `,
    { strictMode: true }
    ),
    PlusIcon
  );

export class ResetIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg xmlns="http://www.w3.org/2000/svg" class={{this.styles}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    `,
    { strictMode: true }
    ),
    ResetIcon
  );

export class SearchIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    `,
    { strictMode: true }
    ),
    SearchIcon
  );

export class MailIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    `,
    { strictMode: true }
    ),
    MailIcon
  );

export class ClipboardIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
    `,
    { strictMode: true }
    ),
    ClipboardIcon
  );

export class ClipboardCheckIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg class={{this.styles}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
    `,
    { strictMode: true }
    ),
    ClipboardCheckIcon
  );

export class QuestionMarkIcon extends BaseIcon {}
  setComponentTemplate(
    precompileTemplate(
    `
    <svg xmlns="http://www.w3.org/2000/svg" class={{this.styles}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    `,
    { strictMode: true }
    ),
    QuestionMarkIcon
  );
