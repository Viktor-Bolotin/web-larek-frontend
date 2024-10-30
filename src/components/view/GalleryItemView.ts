import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter, EventList } from "../basic/events";
import { setCategoryClass } from "../view/helpFunctions";

export class GalleryItemView {
  galleryCard: HTMLElement
  
  constructor(cardTemplate: HTMLTemplateElement, product: IProduct, broker: EventEmitter) {
    this.galleryCard = cloneTemplate(cardTemplate)
    if(product.price === null) {
      this.galleryCard.querySelector('.card__price').textContent = 'Бесценно'
    }
    else {
      this.galleryCard.querySelector('.card__price').textContent = `${product.price} синапсов`
    }
  
    this.galleryCard.querySelector('.card__title').textContent = product.title

    this.galleryCard.querySelector('.card__category').textContent = product.category
    this.galleryCard.querySelector('.card__category').classList.remove()
    this.galleryCard.querySelector('.card__category'). classList.add('card__category', `card__category_${setCategoryClass(product.category)}`)
    this.galleryCard.querySelector('.card__image').setAttribute('src', product.image)
    this.galleryCard.querySelector('.card__image').setAttribute('alt', product.title)
    this.galleryCard.addEventListener('click', () => {
      broker.emit(EventList.ClickCard, ({cardSettings: product}))
    })
  }
}