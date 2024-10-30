import { Component } from "../basic/component"
import { EventEmitter, EventList } from "../basic/events"

// Здесь наследовал от Component абстрактный класс модального окна, чтобы сохранить общие для всех модальных окон атрибуты и методы, при этом добавить функциональность класса Component
export abstract class Modal<T> extends Component<T> {
  modal: HTMLElement
  modalContent: HTMLElement
  broker: EventEmitter
  modalButton: HTMLButtonElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container)
    this.modal = container
    this.modalContent = this.modal.querySelector(".modal__content")
    this.broker = broker
    this.modalButton = this.modal.querySelector('.button')
  }

  openModal() {
    this.toggleClass(this.modal, 'modal_active', true)
    this.broker.emit(EventList.OpenModal)
    this.modal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if(!(target.classList.contains('modal__content') || target.closest('.modal__content'))) {
        this.closeModal()
      }
    })
  }

  closeModal() {
    this.toggleClass(this.modal, 'modal_active', false)
    this.modal.removeEventListener('click', null)
    this.broker.emit(EventList.CloseModal)
  }
}