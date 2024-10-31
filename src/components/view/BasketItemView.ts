import { IBasketItem } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter, EventList } from "../basic/events";

export class BasketItemView {
  basketCard: HTMLElement
  private static basketItemCounter: number = 0
  
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

    BasketItemView.basketItemCounter++
    this.basketCard.querySelector('.basket__item-index').textContent = String(BasketItemView.basketItemCounter)
  }

  static throwBasketItemCounter() {
    BasketItemView.basketItemCounter = 0
  }
}
