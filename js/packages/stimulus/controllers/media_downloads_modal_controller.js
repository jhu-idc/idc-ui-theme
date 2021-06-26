import { enter, leave } from 'el-transition';
import { Controller } from 'stimulus';

export default class extends Controller {
  openModal() {
    const element = document.getElementById('media-downloads-modal-container');

    element.classList.remove('hidden');
    enter(element);
  }

  closeModal() {
    const element = document.getElementById('media-downloads-modal-container');

    leave(element);
  }

  closeIfOutside(event) {
    if (!event.target.closest('#media-downloads-modal-body')) {
      const element = document.getElementById('media-downloads-modal-container');

      leave(element);
    }
  }
}
