import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  isSortLocally = false;

  onClick = (event) => {    
    const headerElement = event.target.closest(".sortable-table__cell");

    if (!(headerElement && headerElement.dataset.sortable === "true")) return;

    this.orderValue = this.orderValue === "asc" ? "desc" : "asc";
    this.fieldValue = headerElement.dataset.id;

    this.sort();

  };

  constructor(headersConfig, {
    url = '',
    data = [],
    sorted = {id:'title', order:'asc'}
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.fieldValue = sorted.id;
    this.orderValue = sorted.order;
    this.url  = url,
    this.render();
    const {body} = this.subElements;
    console.log(body.children.length);
    //this.getData();
  }

  async render() {
    const wraper = document.createElement("div");
    wraper.innerHTML = this.getTableTemplate();
    this.element = wraper.firstElementChild;
    this.subElements = this.getSubElements();
    await this.getData();
    this.subElements.header.addEventListener("pointerdown", this.onClick);
  }

  getTableTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
        </div>

        <div data-element="body" class="sortable-table__body">
        </div>
        
        <div data-element="loading" class="loading-line sortable-table__loading-line">
        </div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  getHeaderTemplate() {
    return this.headersConfig
      .map((item) => {
        let order = "";
        let arrow = "";

        if (this.fieldValue === item.id) {
          order = this.orderValue;
          arrow = this.getSortArrow();
        }

        return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}">
          <span>${item.title}</span>
          ${arrow}
        </div>
        `;
      })
      .join("\n");
  }

  getBodyTemplate() {
    return this.data
      .map((item) => {
        return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.headersConfig
          .map((column) => {
            if ("template" in column) return column.template(item.images);
            return `<div class="sortable-table__cell">${item[column.id]}</div>`;
          })
          .join("\n")}
      </a>
      `;
      })
      .join("\n");
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  getSortArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  sortData() {
    this.data.sort((a, b) => {
      [a, b] = [a[this.fieldValue], b[this.fieldValue]];
      if (this.orderValue === "desc") {
        [b, a] = [a, b];
      }

      const sortType = this.headersConfig.find(
        (item) => item.id === this.fieldValue
      ).sortType;

      switch(sortType) {
        case 'string' : return a.localeCompare(b, ["ru", "en"], { caseFirst: "upper" });
        case 'date' : return new Date(a) - new Date(b);
        case 'number' : return a - b;
        default: return;
      }

    });
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.fieldValue, this.orderValue);
    } else {
      this.sortOnServer(this.fieldValue, this.orderValue);
    }
  }

  sortOnClient (id, order) {
    this.sortData();
    this.subElements.body.innerHTML = this.getBodyTemplate();
    this.subElements.header.innerHTML = this.getHeaderTemplate();
  }

  sortOnServer (id, order) {
    this.getData(id, order);
  }

  getData(sort ='', order='', start = '0', end = '30') {
    const url = new URL(BACKEND_URL);
    url.pathname = '/api/rest/products'
    url.searchParams.set('_sort', sort);
    url.searchParams.set('_order',order);
    url.searchParams.set('_start',start);
    url.searchParams.set('_end', end);       

    fetchJson(url).then(
      result => {
        this.data = result;
        this.subElements.body.innerHTML = this.getBodyTemplate();
        this.subElements.header.innerHTML = this.getHeaderTemplate();
      }
    ).catch(
      //this.data = [];
    );
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }


}
