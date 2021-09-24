import { enter, leave } from 'el-transition';
import { Controller } from 'stimulus';

export default class extends Controller {
  openModal() {
    const element = document.getElementById('idc-modal-container');

    element.classList.remove('hidden');
    enter(element);
  }

  closeModal() {
    const element = document.getElementById('idc-modal-container');

    leave(element);
  }

  closeIfOutside(event) {
    if (!event.target.closest('#page-modal-body')) {
      const element = document.getElementById('idc-modal-container');

      leave(element);
    }
  }

  toggleChildMedia(event) {
    let child = event.target.closest('.child-wrapper').querySelector('.child-node');

    if (child.style['max-height'] === '0px') {
      child.style['max-height'] = child.scrollHeight + 'px';
    } else if (child.style['max-height'] !== '0px') {
      child.style['max-height'] = '0px';
    }
  }
}
