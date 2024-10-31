import { Component } from "../basic/component"

export class ModalOrderContent extends Component<HTMLElement>{
  modalButton: HTMLButtonElement
  paymentButtons: HTMLElement[]
  addressInput: HTMLInputElement
  payment: string

  constructor(container: HTMLElement) {
    super(container)
    this.addressInput = this.container.querySelector('input[name = address]')
    this.addressInput.addEventListener(('input'), () => {
      this.isValidModal()
    })

    this.payment = ''

    this.paymentButtons = Array.from(this.container.querySelector('.order__buttons').querySelectorAll('.button'))
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.getAttribute('name')
        this.isValidModal()
      })
    })

    this.modalButton = this.container.querySelector('.modal__actions').querySelector('.button')
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