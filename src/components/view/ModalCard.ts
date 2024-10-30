import { IProduct } from "../../types"
import { EventEmitter } from "../basic/events"
import { setCategoryClass } from "./helpFunctions"
import { Modal } from "./Modal"

export class ModalCard extends Modal<HTMLElement> {
  modalTitle: HTMLElement
  modalDescription: HTMLElement
  modalPrice: HTMLElement
  modalCategory: HTMLElement
  modalImage: HTMLImageElement
  modalSettings?: IProduct
  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    
    this.modalTitle = this.modal.querySelector('.card__title')
    this.modalDescription = this.modal.querySelector('.card__text')
    this.modalPrice = this.modal.querySelector('.card__price')
    this.modalCategory = this.modal.querySelector('.card__category')
    this.modalImage = this.modal.querySelector('.card__image')
  }

  setModal(cardSettings: IProduct) {
    this.modalSettings = cardSettings
    this.setText(this.modalTitle, cardSettings.title)
    this.setText(this.modalDescription, cardSettings.description)

    if(cardSettings.selected) {
      this.setText(this.modalButton, 'Добавлено в корзину')
      this.setDisabled(this.modalButton, true)
    }
    else {
      this.setText(this.modalButton, 'Купить')
      this.setDisabled(this.modalButton, false)
    }

    if(cardSettings.price === null) {
      this.setText(this.modalPrice, 'Бесценно')
    }
    else{
      this.setText(this.modalPrice, `${cardSettings.price} синапсов`)
    }

    this.setImage(this.modalImage, cardSettings.image, cardSettings.title )
    this.setText(this.modalCategory, cardSettings.category)
    this.toggleClass(this.modalCategory, 'card__category_other', false)
    this.toggleClass(this.modalCategory, `card__category_${setCategoryClass(cardSettings.category)}`, true)
  }
}