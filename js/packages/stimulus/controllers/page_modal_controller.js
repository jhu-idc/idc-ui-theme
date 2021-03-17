import { Controller } from "stimulus";

export default class extends Controller {
  closeModal() {
    this.element.classList.add('hidden');
  }
}
