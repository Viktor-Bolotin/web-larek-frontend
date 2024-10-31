import { Component } from "../basic/component"

export class ModalSuccessContent extends Component<number>{
  modalButton: HTMLTemplateElement

  constructor(container: HTMLElement) {
    super(container)
    this.modalButton = this.container.querySelector('.button')
  }

  render(total: number) {
    super.render()
    this.setText(this.container.querySelector('.order-success__description'), `Списано ${total} синапсов`)
    return this.container
  }
}