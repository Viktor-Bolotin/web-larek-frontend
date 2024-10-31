import { Component } from "../basic/component"
import { EventEmitter } from "../basic/events"

export class ModalBasketContent extends Component<number>{
  modalList: HTMLElement
  basketElementList: HTMLElement[]
  modalButton: HTMLButtonElement

  constructor(container: HTMLElement) {
    super(container)
    this.modalList = this.container.querySelector('.basket__list')
    this.modalButton = this.container.querySelector('.button')
    this.basketElementList = []
  }

  render(sumBasket: number) {
    while(this.modalList.firstChild) {
      this.modalList.removeChild(this.modalList.firstChild)
    }
    
    if(this.basketElementList.length > 0) {
      this.basketElementList.forEach((card) => {
        this.modalList.append(card)
      })
      this.setDisabled(this.modalButton, false)
    }

    else {
      this.setDisabled(this.modalButton, true)
    }

    this.setText(this.container.querySelector('.basket__price'), `${sumBasket} синапсов`)
    return this.container
  }
}