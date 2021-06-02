import { Controller } from "stimulus";

export default class extends Controller {
  closeModal() {
    this.element.classList.add('hidden');
  }

  openModal() {
    const element = document.getElementById('idc-modal-container');

    if (!!element) {
      element.classList.remove('hidden');
    }
  }

  /**
   * Check mouse clicks within the modal region so that we can close the modal if
   * the user clicks ouside of the modal, in the semi-transparent background that
   * obscures the app
   *
   * @param {MouseEvent} event
   */
  closeIfOutside(event) {
    event.stopPropagation();

    // Bounding box for the modal background
    // (semi-transparent background that blocks out the app)
    const bgRect = this.element.getBoundingClientRect();
    // Bounding box of the modal containing the form
    const formRect = this.element.querySelector('#rid-modal').getBoundingClientRect();

    const click = { x: event.clientX, y: event.clientY };
    if (this.isInRect(click, bgRect) && !this.isInRect(click, formRect)) {
      this.closeModal();
    }
  }

  /**
   * @param {object} click { x: # in px, y: # in px }
   * @param {DOMRect} targetRect { x, y, width, height, top, right, bottom, left }
   * @returns {boolean} true if the click was inside the defined DOM rectangle
   */
  isInRect(click, targetRect) {
    return click.x > targetRect.left && click.x < targetRect.right &&
      click.y > targetRect.top && click.y < targetRect.bottom;
  }
}
