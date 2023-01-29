export default class ColumnChart {
    chartHeight = 50;
    constructor(obj) {
        Object.assign(this, obj);  
        this.transformData();
        this.element = document.createElement('div');
        this.render();
    }

    render() {

        this.element.innerHTML = `  
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          <a href="${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"> ${this.formatHeading(this.value)} </div>
          <div data-element="body" class="column-chart__chart"> ${this.createGraf()} </div>
        </div>
      </div>`;        
    }

    createGraf() {
        let graf = '';

        if ((typeof this.data === 'undefined') || (this.data.length === 0))  {
            this.element.classList.add('column-chart_loading');
            return "<object type='image/svg+xml' data='charts-skeleton.svg' id='object' class='icon'></object>";
        } 
        graf = this.data.map(item => {
            return `<div style="--value: ${item.value}" data-tooltip="${item.part}%"></div>`;            
          }).join('\n');
        return graf;
    }      
    update(data) {
        Object.assign(this, data); 
        this.transformData();
        this.render();
    }

    destroy() {

    }

    remove() {
        this.element.remove();
    }

    formatHeading(value) {
        return value;
    }

    transformData() {
        if ((typeof this.data === 'undefined') || (this.data.length === 0))  return;

        const maxValue = Math.max(...this.data);
        const coefTransform = maxValue/this.chartHeight;
        this.data = this.data.map(item => {
            return {value: Math.trunc(item/coefTransform), 
                    part: Math.round((item*100)/maxValue)}
                })
        }

 }
