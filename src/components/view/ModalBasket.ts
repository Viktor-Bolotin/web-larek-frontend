import { EventEmitter } from "../basic/events"
import { Modal } from "./Modal"

export class ModalBasket extends Modal<HTMLElement>{
  modalList: HTMLElement
  basketElementList: HTMLElement[]

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.modalList = this.modal.querySelector('.basket__list')
    this.basketElementList = []
    while(this.modalList.firstChild) {
      this.modalList.removeChild(this.modalList.firstChild)
    }
  }

  setBasket(sumBasket: number) {
    while(this.modalList.firstChild) {
      this.modalList.removeChild(this.modalList.firstChild)
    }

    if(this.basketElementList.length > 0) {
      let index = 0
      this.basketElementList.forEach((card) => {
        index++
        this.setText(card.querySelector('.basket__item-index'), String(index))
        this.modalList.append(card)
      })
      this.setText(this.modal.querySelector('.basket__price'), `${sumBasket} синапсов`)
      this.setDisabled(this.modalButton, false)
    }

    else {
      this.setDisabled(this.modalButton, true)
    }
  }
}