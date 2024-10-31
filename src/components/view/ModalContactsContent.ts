import { Component } from "../basic/component"

export class ModalContactsContent extends Component<HTMLElement>{
  modalInputs: HTMLInputElement[]
  emailInput: HTMLInputElement
  phoneInput: HTMLInputElement
  modalButton: HTMLButtonElement

  constructor(container: HTMLElement) {
    super(container)
    this.modalInputs = Array.from(this.container.querySelectorAll('input'))
    this.modalInputs.forEach((input) => {
      input.addEventListener(('input'), () => {
        this.isValidModal()
      })
    })

    this.emailInput = this.modalInputs.find((input) => input.name === 'email')
    this.phoneInput = this.modalInputs.find((input) => input.name === 'phone')

    this.modalButton = this.container.querySelector('.modal__actions').querySelector('.button')
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