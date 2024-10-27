import { IBasketItem, IOrderProduct } from "../../types"
import { EventEmitter, EventList } from "../basic/events"

export class Basket {
  basketList: IBasketItem[]
  basketSum: number
  broker:EventEmitter

  constructor(broker: EventEmitter) {
    this.basketList = []
    this.basketSum = 0
    this.broker = broker
  }

  addBasketItem(element: IBasketItem) {
        const newBasketElement: IBasketItem = {
          title: element.title,
          price: element.price,
          id: element.id
        }
        this.basketList.push(newBasketElement)
        this.setBasketSize()
        return newBasketElement

      }

  removeBasketItem(id: string) {
    this.basketList = this.basketList.filter((basketProduct) => basketProduct.id !== id)
    this.setBasketSize()
  }

  calculateBasketSum() {
    this.basketSum = 0
    this.basketList.forEach((product: IBasketItem) => {
      if(product.price === null) {
        this.basketSum = this.basketSum + 0
      }
      else {
      this.basketSum = this.basketSum + product.price
      }
    })
    return this.basketSum
  }

  setBasketSize() {
    this.broker.emit(EventList.changeBasketItem, {newSize: this.basketList.length})
  }

  getOrderData() {
    const basketProducts: Partial<IOrderProduct> = {
      items: [],
      total: this.calculateBasketSum() 
    }
    this.basketList.forEach((basketItem) => {
      basketProducts.items.push(basketItem.id)
    })
    return basketProducts
  }
}