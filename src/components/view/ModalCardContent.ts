import { IProduct } from "../../types"
import { setCategoryClass } from "../../utils/utils"
import { Component } from "../basic/component"

export class ModalCardContent extends Component<HTMLElement> {
  modalButton: HTMLButtonElement
  modalSettings?: IProduct
  title: string
  description: string
  price: string
  selected: boolean
  category: string
  image: string

  constructor(container: HTMLElement) {
    super(container)
    this.modalButton = this.container.querySelector('.button')
  }

  render(data: IProduct) {
    super.render(data)
    this.modalSettings = data
    this.setText(this.container.querySelector('.card__title'), this.title)
    this.setText(this.container.querySelector('.card__text'), this.description)
    this.setImage(this.container.querySelector('.card__image'), this.image, this.title )
    this.setText(this.container.querySelector('.card__category'), this.category)
    this.container.querySelector('.card__category').classList.forEach((className) => {
      if(className !== 'card__category') {
        this.toggleClass(this.container.querySelector('.card__category'), className, false)
      }
    })
    this.toggleClass(this.container.querySelector('.card__category'), `card__category_${setCategoryClass(this.category)}`, true)

    if(this.selected) {
      this.setText(this.modalButton, 'Добавлено в корзину')
      this.setDisabled(this.modalButton, true)
    }
    else {
      this.setText(this.modalButton, 'Купить')
      this.setDisabled(this.modalButton, false)
    }

    if(this.price === null) {
      this.setText(this.container.querySelector('.card__price'), 'Бесценно')
    }
    else{
      this.setText(this.container.querySelector('.card__price'), `${this.price} синапсов`)
    }

    return this.container
  }
}