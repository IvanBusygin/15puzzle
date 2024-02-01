import './style.scss';

export default class {
  constructor() {
    this.elem = this.render();
  }

  render() {
    const block = document.createElement('div');
    block.classList.add('difficult');
    block.innerHTML = '<span class="difficult__title">Выберите сложность</span>';
    const sel = document.createElement('select');
    sel.id = 'select';
    sel.classList.add('difficult__select');

    const arrDiff = ['20', '40', '80', '200', '500', '555555'];

    block.append(sel);
    sel.append(new Option('Очень Легко', arrDiff[0]));
    sel.append(new Option('Легко', arrDiff[1]));
    sel.append(new Option('Не сложно', arrDiff[2]));
    sel.append(new Option('Нормально', arrDiff[3]));
    sel.append(new Option('Сложно', arrDiff[4]));
    sel.append(new Option('Профи', arrDiff[5]));

    sel.onchange = () => {
      const difficult = document.querySelector('#select').value;
      localStorage.setItem('difficult', difficult);
    };

    const dif = localStorage.getItem('difficult');
    if (dif === arrDiff[0]) { sel.options[0].selected = true; }
    if (dif === arrDiff[1]) { sel.options[1].selected = true; }
    if (dif === arrDiff[2]) { sel.options[2].selected = true; }
    if (dif === arrDiff[3]) { sel.options[3].selected = true; }
    if (dif === arrDiff[4]) { sel.options[4].selected = true; }
    if (dif === arrDiff[5]) { sel.options[5].selected = true; }

    return block;
  }
}
