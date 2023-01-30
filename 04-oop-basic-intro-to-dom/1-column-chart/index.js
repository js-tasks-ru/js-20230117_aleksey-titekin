export default class ColumnChart {
    chartHeight = 50;
    constructor(obj) {
        Object.assign(this, obj);  
        this.transformData();
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add('column-chart');
        this.element.style = `--chart-height: ${this.chartHeight}`;
        this.element.innerHTML = this.getTemplate();      
    }

    getTemplate() {
        let template = `  
        <div class="column-chart__title">
            ${this.label}
            <a href="${this.link}" class="column-chart__link" ${!(this.link) ? 'hidden' : ''}>View all</a>
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header"> ${this.formatHeading(this.value)} </div>
            <div data-element="body" class="column-chart__chart"> ${this.getChart()} </div>
        </div>
        `;
        return template;
    }

    getChart() {
        let chart = '';

        if ((typeof this.data === 'undefined') || (this.data.length === 0))  {
            this.element.classList.add('column-chart_loading');
            return "<object type='image/svg+xml' data='charts-skeleton.svg' id='object' class='icon'></object>";
        } 
        chart = this.data.map(item => {
            return `<div style="--value: ${item.value}" data-tooltip="${item.part}%"></div>`;            
          }).join('\n');
        return chart;
    }      

    update(data) {
        this.data = [...data];
        this.transformData();
        this.element.innerHTML = this.getTemplate(); 
    }

    destroy() {
        this.remove();
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
