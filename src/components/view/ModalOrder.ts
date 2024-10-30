import { EventEmitter } from "../basic/events"
import { Modal } from "./Modal"

export class ModalOrder extends Modal<HTMLElement>{
  paymentButtons: HTMLElement[]
  addressInput: HTMLInputElement
  payment: string

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)

    this.addressInput = this.modal.querySelector('input[name = address]')
    this.addressInput.addEventListener(('input'), () => {
      this.isValidModal()
    })

    this.payment = ''

    this.paymentButtons = Array.from(this.modal.querySelector('.order__buttons').querySelectorAll('.button'))
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.getAttribute('name')
        this.isValidModal()
      })
    })

    this.modalButton = this.modal.querySelector('.modal__actions').querySelector('.button')
  }

  isValidModal(): void {
   if(this.addressInput.value !== '' && this.payment !== ''){
    this.setDisabled(this.modalButton, false)
   } 

   else {
    this.setDisabled(this.modalButton, true)
   }
  }
}
