export default class ResultList {
  constructor() {
    this.resulArr = JSON.parse(localStorage.getItem('sevedResultList'));
    this.elem = this.render();
  }

  render() {
    const tab = document.createElement('table');
    tab.classList.add('modal__results-tab');
    const headArr = ['Дата', 'Ходов', 'Время', 'Размер'];
    const trHead = document.createElement('tr');
    let trInner = '';
    headArr.forEach((item) => {
      trInner += `<th>${item}</th>`;
    });
    trHead.innerHTML = trInner;

    const thead = document.createElement('thead');
    thead.append(trHead);
    tab.append(thead);

    const tbody = document.createElement('tbody');
    let tbodyInner = '';
    this.resulArr?.forEach((item) => {
      tbodyInner += `
        <tr class="modal__results-tr">
          <td>${item.date}</td>
          <td>${item.numberOfSteps}</td>
          <td>${item.timePassed}</td>
          <td>${item.size}</td>
       </tr>`;
    });
    tbody.innerHTML = tbodyInner;
    tab.append(tbody);

    return tab;
  }
}
