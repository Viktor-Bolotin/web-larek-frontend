import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { EventEmitter, EventList } from "../basic/events";
import { setCategoryClass } from "../../utils/utils";
import { Component } from "../basic/component";

export class GalleryItemView extends Component<HTMLElement> {
  
  constructor(container: HTMLElement, product: IProduct, broker: EventEmitter) {
    super(container)
    if(product.price === null) {
      this.setText(this.container.querySelector('.card__price'), 'Бесценно' )
    }
    else {
      this.setText(this.container.querySelector('.card__price'), `${product.price} синапсов`)
    }
    
    this.setText(this.container.querySelector('.card__title'), product.title)
    this.setText(this.container.querySelector('.card__category'), product.category)
    this.container.querySelector('.card__category').classList.remove()
    this.container.querySelector('.card__category').classList.add('card__category', `card__category_${setCategoryClass(product.category)}`)
    this.setImage(this.container.querySelector('.card__image'), product.image, product.title)
    this.container.addEventListener('click', () => {
      broker.emit(EventList.ClickCard, ({cardSettings: product}))
    })
  }
}