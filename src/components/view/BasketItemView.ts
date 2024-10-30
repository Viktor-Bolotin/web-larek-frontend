import { IBasketItem } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter, EventList } from "../basic/events";

export class BasketItemView {
  basketCard: HTMLElement
  
  constructor(template: HTMLTemplateElement, product: IBasketItem, broker: EventEmitter) {
    this.basketCard = cloneTemplate(template)

    if(product.price === null) {
      this.basketCard.querySelector('.card__price').textContent = 'Бесценно'
    }
    else {
      this.basketCard.querySelector('.card__price').textContent = `${product.price} синапсов`
    }

    this.basketCard.querySelector('.card__title').textContent = product.title

    this.basketCard.querySelector('.basket__item-delete').addEventListener('mousedown', () => {
      broker.emit(EventList.DeleteBasketItem, ({id: product.id}))
    })
  }
}
