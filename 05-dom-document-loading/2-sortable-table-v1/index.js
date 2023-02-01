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
  }


  getHeaderTemplate() {
    return this.headerConfig.map( item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${(item.order) ? item.order : 'asc'}">
          <span>${item.title}</span>
        </div>
        `
      } ).join('\n');
  }

  getBodyTemplate() {
    return this.data.map( item => {
        return `
        <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="http://magazilla.ru/jpg_zoom1/246743.jpg">
          </div>
          <div class="sortable-table__cell">${item.title}</div>

          <div class="sortable-table__cell">${item.quantity}</div>
          <div class="sortable-table__cell">91</div>
          <div class="sortable-table__cell">6</div>
        </a>
        `
      }) 
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

  getSubElements() {
    const result = {}
    const elements = this.element.querySelectorAll("data-element");

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

  }
}

