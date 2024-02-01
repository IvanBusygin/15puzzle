import './size-block.scss';
import startGame from '../../js/start-game';

export default class MenuSizes {
  constructor() {
    this.elem = this.render();
  }

  render() {
    const block = document.createElement('div');
    block.classList.add('size-block');

    block.addEventListener('click', ({ target }) => {
      if (target.dataset.size) {
        localStorage.setItem('sizeGrid', target.dataset.size);
        startGame(target.dataset.size);
      }
    });

    block.innerHTML = `
      <button class="size-block__btn" data-size="3">3x3</button>
      <button class="size-block__btn" data-size="4">4x4</button>
      <button class="size-block__btn" data-size="5">5x5</button>
      <button class="size-block__btn" data-size="6">6x6</button>
      <button class="size-block__btn" data-size="7">7x7</button>
      <button class="size-block__btn" data-size="8">8x8</button>
      `;

    return block;
  }
}
