import { EventEmitter } from "../basic/events"
import { Modal } from "./Modal"

export class ModalContacts extends Modal<HTMLElement>{
  modalInputs: HTMLInputElement[]
  emailInput: HTMLInputElement
  phoneInput: HTMLInputElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)

    this.modalInputs = Array.from(this.modal.querySelectorAll('input'))
    this.modalInputs.forEach((input) => {
      input.addEventListener(('input'), () => {
        this.isValidModal()
      })
    })

    this.emailInput = this.modalInputs.find((input) => input.name === 'email')
    this.phoneInput = this.modalInputs.find((input) => input.name === 'phone')

    this.modalButton = this.modal.querySelector('.modal__actions').querySelector('.button')
  }

  isValidModal(): void {
    if(this.emailInput.value !=='' && this.phoneInput.value !== '') {
      this.setDisabled(this.modalButton, false)
    }

    else{
      this.setDisabled(this.modalButton, true)
    }
  }
}
