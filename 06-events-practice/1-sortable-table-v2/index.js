export default class SortableTable {
  element = {};
  subElements = {};

  onClick = (event) => {

    
    const headerElement = event.target.closest(".sortable-table__cell");

    if (!(headerElement && headerElement.dataset.sortable === "true")) return;

    this.orderValue = this.orderValue === "asc" ? "desc" : "asc";
    this.fieldValue = headerElement.dataset.id;

    this.sort();

  };

  constructor(
    headersConfig,
    { data = [], sorted = {} } = {},
    isSortLocally = true,
  ) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.fieldValue = sorted.id;
    this.orderValue = sorted.order;
    this.isSortLocally = isSortLocally;

    this.sortData();
    this.render();
  }

  render() {
    const wraper = document.createElement("div");
    wraper.innerHTML = this.getTableTemplate();
    this.element = wraper.firstElementChild;
    this.subElements = this.getSubElements();

    this.subElements.header.addEventListener("pointerdown", this.onClick);
  }

  getTableTemplate() {
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

  sortOnClient() {
    this.sortData();
    this.subElements.body.innerHTML = this.getBodyTemplate();
    this.subElements.header.innerHTML = this.getHeaderTemplate();
  }

  sortInServer() {
    return;
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();

    //this.element = {};
  }
}
