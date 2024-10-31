import { Component } from "../basic/component";
import { EventEmitter, EventList } from "../basic/events";

export class MainModal extends Component<{content: HTMLElement}> {
  modalContent: Partial<HTMLElement>
  content:HTMLElement
  broker: EventEmitter

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container)
    this.broker = broker
    this.modalContent = container.querySelector('.modal__content')
    }

  openModal() {
    this.toggleClass(this.container, 'modal_active', true)
    this.broker.emit(EventList.OpenModal)
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if(!(target.classList.contains('modal__content') || target.closest('.modal__content'))) {
        this.closeModal()
      }
    })
  }

  closeModal() {
    this.toggleClass(this.container, 'modal_active', false)
    this.container.removeEventListener('click', null)
    this.broker.emit(EventList.CloseModal)
  }

  render(data?: {content: HTMLElement}): HTMLElement {
    super.render(data)
    this.modalContent.removeChild(this.modalContent.firstChild)
    this.modalContent.appendChild(this.content)
    return this.container
  }
}