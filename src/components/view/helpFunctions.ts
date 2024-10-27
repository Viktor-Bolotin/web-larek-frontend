import { IBasketItem, IProduct } from "../../types"
import { cloneTemplate } from "../../utils/utils"
import { EventEmitter, EventList } from "../basic/events"

export function setCardElement<T extends IProduct | IBasketItem> (template: HTMLTemplateElement, cardSettings: T) {
  const baseElement = cloneTemplate(template)

  if(cardSettings.price === null) {
    baseElement.querySelector('.card__price').textContent = 'Бесценно'
  }
  else {
    baseElement.querySelector('.card__price').textContent = `${cardSettings.price} синапсов`
  }

  baseElement.querySelector('.card__title').textContent = cardSettings.title
  return baseElement
}

export function setBasketElement (template:HTMLTemplateElement, basketItemSettings: IBasketItem, broker: EventEmitter) {
  const basketElement = setCardElement(template, basketItemSettings)
  basketElement.querySelector('.basket__item-delete').addEventListener('mousedown', () => {
    broker.emit(EventList.deleteBasketItem, ({id: basketItemSettings.id}))
  })
  return basketElement
}

export function setCardGalleryElement (template: HTMLTemplateElement, galleryItemSettings: IProduct, broker: EventEmitter) {
  const productElement = setCardElement(template, galleryItemSettings)
  productElement.querySelector('.card__category').textContent = galleryItemSettings.category
  productElement.querySelector('.card__category').classList.remove()
  productElement.querySelector('.card__category'). classList.add('card__category', `card__category_${galleryItemSettings.categoryClass}`)
  productElement.querySelector('.card__image').setAttribute('src', galleryItemSettings.image)
  productElement.querySelector('.card__image').setAttribute('alt', galleryItemSettings.title)
  productElement.addEventListener('click', () => {
    broker.emit(EventList.ClickCard, ({cardSettings: galleryItemSettings}))
  })

  return productElement
}