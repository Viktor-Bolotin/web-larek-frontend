import { IBasketItem, IOrderProduct } from "../../types"
import { EventEmitter, EventList } from "../basic/events"

export class Basket {
  basketItemList: IBasketItem[]
  broker: EventEmitter

  constructor(broker: EventEmitter) {
    this.basketItemList = []
    this.broker = broker
  }

  addBasketItem(element: IBasketItem) {
        const newBasketItem: IBasketItem = {
          title: element.title,
          price: element.price,
          id: element.id
        }
        this.basketItemList.push(newBasketItem)
        this.broker.emit(EventList.UpdateBasket)
      }

  removeBasketItem(id: string) {
    this.basketItemList = this.basketItemList.filter((basketProduct) => basketProduct.id !== id)
    this.broker.emit(EventList.UpdateBasket)
  }

  calculateBasketSum() {
    let basketSum = 0
    this.basketItemList.forEach((product: IBasketItem) => {
      if(product.price === null) {
        basketSum = basketSum + 0
      }
      else {
      basketSum = basketSum + product.price
      }
    })
    return basketSum
  }

  getOrderData() {
    const basketProducts: Partial<IOrderProduct> = {
      items: [],
      total: this.calculateBasketSum() 
    }
    this.basketItemList.forEach((basketItem) => {
      if(basketItem.price) {      
        basketProducts.items.push(basketItem.id)
      }
    })
    return basketProducts
  }
}