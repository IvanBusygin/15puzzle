import './style.scss';

import createElement from '../../lib/create-element';
import crossIcon from '../../../assets/cross-icon.svg';

export default class Modal {
  constructor() {
    this.render();

    this.elem.addEventListener('click', (event) => this.onClick(event));
  }

  render() {
    this.elem = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close" autofocus>
              <img src="${crossIcon}" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `);
  }

  sub(ref) {
    return this.elem.querySelector(`.modal__${ref}`);
  }

  open() {
    document.body.append(this.elem);
    document.body.classList.add('is-Modal-open');

    this._keydownEventListener = (event) => this.onDocumentKeyDown(event);
    document.addEventListener('keydown', this._keydownEventListener);

    if (this.elem.querySelector('[autofocus]')) {
      this.elem.querySelector('[autofocus]').focus();
    }
  }

  onClick(event) {
    if (event.target.closest('.modal__close')) {
      event.preventDefault();
      this.close();
    }
  }

  onDocumentKeyDown(event) {
    if (event.code === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  setTitle(title) {
    this.sub('title').textContent = title;
  }

  setBody(node) {
    this.sub('body').innerHTML = '';
    this.sub('body').append(node);
  }

  close() {
    document.removeEventListener('keydown', this._keydownEventListener);
    document.body.classList.remove('is-Modal-open');
    this.elem.remove();
  }
}
