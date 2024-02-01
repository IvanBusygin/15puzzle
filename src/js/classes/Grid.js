import createElement from '../lib/create-element';
import Cell from './Cell';
import Modal from './Modal';
import audioFile1 from '../../assets/audio.mp3';
import audioFile2 from '../../assets/audio2.mp3';

const audio = new Audio(audioFile1);
const audioWin = new Audio(audioFile2);

export default class Grid {
  constructor(size, movements, saved) {
    this.width = 500;
    this.movements = movements;
    this.size = saved?.savedSize || size;
    this.numberOfSteps = saved?.steps || 0;
    this.timePassed = saved?.totalTime || 0;
    this.quantity = size ** 2;
    this.isFinish = false;
    this.finishState = this.getFinishState();
    this.mixedArr = saved?.savedGame ? JSON.parse(saved?.savedGame) : this.mix();
    this.elements = this.newElements();
    this.elem = this.render();
  }

  getFinishState() {
    const arr = [];
    for (let i = 1; i < this.quantity; i++) {
      arr.push(i);
    }
    arr.push(0);
    return arr;
  }

  newElements() {
    return this.mixedArr.map((item) => item.map((cellValue) => new Cell(cellValue).elem));
  }

  mix() {
    const { size, movements, finishState } = this;
    const matrix = [];
    let counter = 0;
    for (let row = 0; row < size; row++) {
      const col = [];
      for (let column = 0; column < size; column++) {
        col.push(finishState[counter]);
        counter++;
      }
      matrix.push(col);
    }

    function getEmpty() {
      for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
          if (matrix[row][column] === 0) {
            return { x: column, y: row };
          }
        }
      }
    }

    function randomInteger(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    }

    function mixing(motions) {
      for (let i = 0; i < motions; i++) {
        const e0 = getEmpty();
        const random = randomInteger(1, 4);
        const toUp = random === 1;
        const toRight = random === 2;
        const toDown = random === 3;
        const toLeft = random === 4;
        if (toUp && e0.y > 0) {
          [matrix[e0.y][e0.x], matrix[e0.y - 1][e0.x]] = [matrix[e0.y - 1][e0.x], matrix[e0.y][e0.x]];
        }
        if (toDown && e0.y < size - 1) {
          [matrix[e0.y][e0.x], matrix[e0.y + 1][e0.x]] = [matrix[e0.y + 1][e0.x], matrix[e0.y][e0.x]];
        }
        if (toRight && e0.x < size - 1) {
          [matrix[e0.y][e0.x], matrix[e0.y][e0.x + 1]] = [matrix[e0.y][e0.x + 1], matrix[e0.y][e0.x]];
        }
        if (toLeft && e0.x > 0) {
          [matrix[e0.y][e0.x], matrix[e0.y][e0.x - 1]] = [matrix[e0.y][e0.x - 1], matrix[e0.y][e0.x]];
        }
      }

      const initState = finishState.join(' ');
      const currentState = matrix.flat().join(' ');

      if (initState === currentState) {
        mixing(motions);
      }
    }

    mixing(movements);
    return matrix;
  }

  timeStamp(t) {
    const s = t % 60;
    const m = ((t - s) / 60) % 60;
    const h = (t - (m * 60) - s) / 3600;
    return `${h < 1 ? '' : `${h}:`} ${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }

  render() {
    const gridWidth = this.width;

    const game = document.createElement('div');
    game.classList.add('game-content');

    const grid = document.createElement('div');
    grid.addEventListener('click', this.cellClick.bind(this));
    grid.classList.add('grid');

    const cellWidth = Math.round(gridWidth / this.size);
    this.elements.forEach((item, y) => {
      item.forEach((cell, x) => {
        cell.style.width = `${cellWidth}px`;
        cell.style.height = `${cellWidth}px`;
        cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
        grid.append(cell);
      });
    });

    game.saveGame = () => {
      localStorage.setItem('savedGame', JSON.stringify(this.currentState()));
      localStorage.setItem('savedSize', this.size);
      localStorage.setItem('savedSteps', this.numberOfSteps);

      localStorage.setItem('savedTime', this.timePassed);
    };
    game.append(grid);

    game.timer = setInterval(() => {
      document.querySelector('.statistics__time-value').textContent = `${this.timeStamp(++this.timePassed)}`;
    }, 1000);

    const statistics = document.createElement('div');
    statistics.classList.add('statistics');
    statistics.innerHTML = `
      <div class="statistics__time">
        <div class="statistics__time-value">${this.timeStamp(this.timePassed)}</div>
      </div>
      <div class="statistics__moves">
        <div class="statistics__moves-title">Ходов:</div>
        <div class="statistics__moves-value">${this.numberOfSteps}</div>
      </div>
      `;
    game.append(statistics);

    game.click = this.cellClick.bind(this);

    document.addEventListener('keydown', game.click);

    return game;
  }

  cellClick({ target, code }) {
    const { size, isFinish } = this;
    if (isFinish) {
      return;
    }

    const updateSteps = () => {
      document.querySelector('.statistics__moves-value').textContent = `${++this.numberOfSteps}`;
    };

    const audioPlay = () => {
      const mute = JSON.parse(localStorage.getItem('muteState'));
      if (!mute) {
        audio.play();
      }
    };

    const targetCell = target.closest('.grid__item');
    const targetValue = targetCell?.firstElementChild.textContent;
    const findIndex = (elem) => {
      let res = {};
      this.elements.forEach((item, y) => {
        item.forEach((cell, x) => {
          if (cell.firstElementChild.textContent === elem?.toString()) {
            res = { x, y };
          }
        });
      });
      return res;
    };

    const indexTarget = findIndex(targetValue);
    const indexE = findIndex(0);

    const move = (Ex, Ey, Tx, Ty) => {
      [this.elements[Ey][Ex], this.elements[Ty][Tx]] = [this.elements[Ty][Tx], this.elements[Ey][Ex]];
      // const gridWidth = document.querySelector('.grid');
      // const cellWidth = gridWidth / this.size;
      this.elements.forEach((item, y) => {
        item.forEach((cell, x) => {
          // cell.style.width = `${cellWidth}px`;
          // cell.style.height = `${cellWidth}px`;
          cell.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
        });
      });
      updateSteps();
      audioPlay();
    };

    if (indexE.x === indexTarget.x && indexE.y === indexTarget.y + 1) {
      move(indexE.x, indexE.y, indexTarget.x, indexTarget.y);
    }
    if (indexE.x === indexTarget.x && indexE.y === indexTarget.y - 1) {
      move(indexE.x, indexE.y, indexTarget.x, indexTarget.y);
    }
    if (indexE.x === indexTarget.x + 1 && indexE.y === indexTarget.y) {
      move(indexE.x, indexE.y, indexTarget.x, indexTarget.y);
    }
    if (indexE.x === indexTarget.x - 1 && indexE.y === indexTarget.y) {
      move(indexE.x, indexE.y, indexTarget.x, indexTarget.y);
    }

    if (code === 'ArrowUp' && indexE.y !== size - 1) {
      move(indexE.x, indexE.y, indexE.x, indexE.y + 1);
    }
    if (code === 'ArrowRight' && indexE.x !== 0) {
      move(indexE.x, indexE.y, indexE.x - 1, indexE.y);
    }
    if (code === 'ArrowDown' && indexE.y !== 0) {
      move(indexE.x, indexE.y, indexE.x, indexE.y - 1);
    }
    if (code === 'ArrowLeft' && indexE.x !== size - 1) {
      move(indexE.x, indexE.y, indexE.x + 1, indexE.y);
    }

    this.checkEnd();
  }

  currentState() {
    return this.elements.map((i) => i.map((t) => t.firstElementChild.textContent));
  }

  checkEnd() {
    const { finishState } = this;
    const initState = finishState.join(' ');
    const currentState = this.currentState().flat().join(' ');

    if (initState === currentState) {
      this.isFinish = true;
      clearInterval(this.elem.timer);
      this.saveResult();

      window.openModal = () => {
        const modal = new Modal();
        modal.setTitle('Hooray!');
        modal.setBody(createElement(`
          <div class="modal__you-win">
            You solved the puzzle in ${this.timeStamp(this.timePassed)} and ${this.numberOfSteps} moves!
          </div>`));
        modal.open();
      };

      setTimeout(() => {
        const mute = JSON.parse(localStorage.getItem('muteState'));
        if (!mute) audioWin.play();
        window.openModal();
      }, 300);
    }
  }

  saveResult() {
    const oneRes = {
      size: this.size,
      timePassed: this.timePassed,
      numberOfSteps: this.numberOfSteps,
      date: new Date().toLocaleString().slice(0, 17).replace(/T/, ' '),
    };

    const sevedResultList = localStorage.getItem('sevedResultList');

    if (sevedResultList) {
      const resArr = JSON.parse(sevedResultList);
      resArr.unshift(oneRes);

      localStorage.setItem('sevedResultList', JSON.stringify(resArr.slice(0, 10)));
    } else {
      localStorage.setItem('sevedResultList', JSON.stringify([oneRes]));
    }
  }
}
