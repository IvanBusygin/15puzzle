import createElement from '../lib/create-element';

export default class Cell {
  constructor(num) {
    this.num = num;
    this.elem = this.render();
  }

  render() {
    return createElement(`
    <div class="grid__item${this.num > 0 ? '' : ' grid__item--empty'}">
      <div>${this.num}</div>
    </div>
    `);
  }
}
