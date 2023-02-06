export default class DoubleSlider {
  element = null;
  constructor({
    min = 30,
    max = 100,
    formatValue = (value) => value,
    selected = {from : min, to: max},
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
  }

  getTemplate() {
    return `
        <div class="range-slider">
            <span>${this.formatValue(this.min)}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress" style="left: ${this.getProgressLeftPosition()}%; right: ${this.getProgressRightPosition()}%"></span>
                <span class="range-slider__thumb-left" style="left: ${this.getProgressLeftPosition()}%"></span>
                <span class="range-slider__thumb-right" style="right: ${this.getProgressRightPosition()}%"></span>
            </div>
            <span>${this.formatValue(this.max)}</span>
        </div>
        `;
  }

  getProgressLeftPosition() {
    return this.getProgressPosition(this.selected.from,this.min);
  }

  getProgressRightPosition() {
    return this.getProgressPosition(this.max, this.selected.to);
  }

  getProgressPosition(a,b) {
    return (a - b) * 100 /(this.max - this.min)
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.remove();
  }
}
