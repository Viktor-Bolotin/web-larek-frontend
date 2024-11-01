import { IBasketItem } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Component } from "../basic/component";
import { EventEmitter, EventList } from "../basic/events";

export class BasketItemView extends Component<HTMLElement> {
  
  constructor(container: HTMLElement, product: IBasketItem, broker: EventEmitter, index: number) {
    super(container)

    if(product.price === null) {
      this.setText(this.container.querySelector('.card__price'), 'Бесценно')
    }
    else {
      this.setText(this.container.querySelector('.card__price'), `${product.price} синапсов`)
    }

    this.setText(this.container.querySelector('.card__title'), product.title)

    this.container.querySelector('.basket__item-delete').addEventListener('mousedown', () => {
      broker.emit(EventList.DeleteBasketItem, ({id: product.id}))
    })

    this.setText( this.container.querySelector('.basket__item-index'), String(index))
  }
}
