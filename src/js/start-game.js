import Grid from './classes/Grid';
import ResultList from './classes/Result-list';
import Modal from './classes/Modal';

let grid;
let funTimeValue;

function removeGame() {
  document.querySelector('.game-content')?.remove();
  grid?.removeEventListener('time', funTimeValue);
  document.removeEventListener('keydown', grid?.click);
  clearInterval(grid?.timer);
}

// старт игры
export default function startGame(size = 4, diff = 20) {
  removeGame();

  let sizeGrid = size;
  if (localStorage.getItem('sizeGrid')) {
    sizeGrid = localStorage.getItem('sizeGrid');
  }

  let difficult = diff;
  if (localStorage.getItem('difficult')) {
    difficult = localStorage.getItem('difficult');
  }

  localStorage.setItem('sizeGrid', sizeGrid);
  localStorage.setItem('difficult', difficult);

  const gameBlock = document.querySelector('.game-block');
  grid = new Grid(sizeGrid, difficult).elem;
  gameBlock.append(grid);

  function setFontSize() {
    const gridItem = document.querySelectorAll('.grid__item');
    const grid2 = document.querySelector('.grid');
    if (document.documentElement.clientHeight < document.documentElement.clientWidth * 1.2) {
      grid2.style.width = '60vh';
      grid2.style.height = '60vh';
    } else {
      grid2.style.width = '97vw';
      grid2.style.height = '97vw';
    }
    gridItem.forEach((elem) => {
      const width = Math.floor(grid2.offsetWidth / sizeGrid);
      elem.style.width = `${width}px`;
      elem.style.height = `${width}px`;
    });
    const gridItemWidth = gridItem[0].offsetWidth;
    grid2.style.fontSize = `${gridItemWidth / 2.4}px`;
  }

  const menuSave = document.querySelector('.menu__save');
  menuSave.onclick = () => {
    grid.saveGame();
  };

  const menuLoad = document.querySelector('.menu__load');
  menuLoad.onclick = () => {
    removeGame();
    const savedGame = localStorage.getItem('savedGame');
    sizeGrid = localStorage.getItem('savedSize');
    const steps = localStorage.getItem('savedSteps');
    const totalTime = localStorage.getItem('savedTime');

    grid = new Grid(sizeGrid, difficult, {
      savedGame, sizeGrid, steps, totalTime,
    }).elem;
    gameBlock.append(grid);
    setFontSize();
  };

  let muteState = false;

  const menuMute = document.querySelector('.menu__mute');
  const muteStateLocal = JSON.parse(localStorage.getItem('muteState'));
  if (muteStateLocal) {
    muteState = muteStateLocal;
    menuMute.classList.add('menu__mute--mute');
    menuMute.textContent = 'Mute';
  }

  menuMute.onclick = () => {
    muteState = !muteState;
    menuMute.classList.toggle('menu__mute--mute');
    menuMute.textContent = `${muteState ? 'Mute' : 'Sound'}`;
    localStorage.setItem('muteState', JSON.stringify(muteState));
  };

  const menuResults = document.querySelector('.menu__results');
  menuResults.onclick = () => {
    const resTab = new ResultList();
    window.openModal = () => {
      const modal = new Modal();
      modal.setTitle('Результаты');
      modal.setBody(resTab.elem);
      modal.open();
    };
    window.openModal();
  };

  setFontSize();
  window.onresize = setFontSize;
}
