export default class NotificationMessage {
    static activeElement = '';

    constructor(message = '', {duration = 0, type = ''} = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.render();
    }

    render() {
        let element = document.createElement('div');
        element.innerHTML = `
        <div class="notification ${this.type}" style="--value:${this.duration/1000}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
        `;

        this.element = element.firstElementChild;
    }

    destroy() {
        this.remove();
        this.element = '';
    }

    remove() {
        NotificationMessage.activeElement= '';
        this.element.remove();
    }

    show() {
        
        NotificationMessage.activeElement = '';
        document.body.append(this.element);
        setTimeout(() => this.remove(), this.duration);
    }

}
