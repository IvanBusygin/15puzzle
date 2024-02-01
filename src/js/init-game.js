import createElement from './lib/create-element';
import startGame from './start-game';
import MenuSizes from '../components/menu-sizes';
import Select from '../components/select-difficult';

const menuSize = new MenuSizes().elem;

const body = document.querySelector('body');
body.addEventListener('selectstart', (event) => {
  event.preventDefault();
});

const bodyOfGame = createElement(`
<div class="container">
  <div class="menu">
  <div class="menu__btn ">
    <button class="menu__results">Рез</button>
    <button class="menu__mute">Sound</button>
    <button class="menu__save">Сохранить</button>
    <button class="menu__load">Восстановить</button>
  </div>
    <button class="menu__start">Новая игра</button>
  </div>
  <div class="game-block"></div>
  <div class="menu__difficult"> </div>
</div>
`);

bodyOfGame.append(menuSize);
body.append(bodyOfGame);

const menuSel = document.querySelector('.menu__difficult');
menuSel.append(new Select().elem);

if (localStorage.getItem('sizeGrid')) {
  startGame(localStorage.getItem('sizeGrid'));
} else {
  startGame();
}

const btn = document.querySelector('.menu__start');
btn.onclick = () => {
  if (localStorage.getItem('sizeGrid')) {
    startGame(localStorage.getItem('sizeGrid'));
  } else {
    startGame();
  }
};
