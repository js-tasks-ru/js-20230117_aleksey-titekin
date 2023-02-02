export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getHeaderTemplate()}
        </div>

        <div data-element="body" class="sortable-table__body">
        ${this.getBodyTemplate()}
        </div>
        
        <div data-element="loading" class="loading-line sortable-table__loading-line">
        ${this.getLoadingTemplate()}
        </div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        ${this.getEmptyPlaceholderTemplate()}
        </div>
      </div>
    </div>
    `;    
  }

  render() {
    let root = document.createElement('div');
    root.innerHTML = this.template;
    this.element = root.firstElementChild;

    this.subElements = this.getSubElements();
  }


  getHeaderTemplate(fieldValue ='', orderValue = '') {
    return this.headerConfig.map( item => {

      let order = '';
      let arrow = '';

      if (fieldValue === item.id) {
        order = orderValue;
        arrow = this.getSortArrow();
      }

      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
          <span>${item.title}</span>
          ${arrow}
        </div>
        `
      } ).join('\n');
  }

  getBodyTemplate() {
    return this.data.map( item => {
        return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.headerConfig.map(column => {
            if ("template" in column)  
              return column.template(item.images);
            return `<div class="sortable-table__cell">${item[column.id]}</div>`
          }).join('\n')}
        </a>
        `
      }).join('\n'); 
  }

  getLoadingTemplate() {
    return;
  }

  getEmptyPlaceholderTemplate() {
    return `
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    `
  }

  getSortArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `
  }

  getSubElements() {
    const result = {}
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }


  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  sort(fieldValue, orderValue) {
    this.data.sort((a,b) => {
      [a,b] = [a[fieldValue],b[fieldValue]]
      if (orderValue === 'desc') [b,a] = [a,b];

      const sortType = this.headerConfig.find(item => item.id === fieldValue).sortType;

      if (sortType === 'string')
        return a.localeCompare(b, ['ru','en'], {caseFirst: 'upper'});

      if (sortType === 'date')  
        return new Date(a.date) - new Date(b.date);

      return a-b;  
    });

    this.subElements.body.innerHTML = this.getBodyTemplate();
    this.subElements.header.innerHTML = this.getHeaderTemplate(fieldValue, orderValue);
  }
}

