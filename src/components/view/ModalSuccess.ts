import { EventEmitter } from "../basic/events"
import { Modal } from "./Modal"

export class ModalSuccess extends Modal<HTMLElement>{
  total: HTMLElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.total = container.querySelector('.order-success__description')
  }

  renderModal(sumOrder: number) {
    this.setText(this.total, `Списано ${sumOrder} синапсов`)
  }
}