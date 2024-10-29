import { IBasketItem, IModalBasketCard, IOrderProduct } from "../../types"
import { EventEmitter, EventList } from "../basic/events"
import { setBasketElement } from "../view/helpFunctions"

export class Basket {
  basketItemList: IBasketItem[]
  basketSum: number
  broker:EventEmitter
  basketElementList: IModalBasketCard[]

  constructor(broker: EventEmitter) {
    this.basketItemList = []
    this.basketSum = 0
    this.broker = broker
    this.basketElementList = []
  }

  addBasketItem(element: IBasketItem, template: HTMLTemplateElement) {
        const newBasketItem: IBasketItem = {
          title: element.title,
          price: element.price,
          id: element.id
        }
        this.basketItemList.push(newBasketItem)
        this.setBasketSize()
        this.addBasketElement(newBasketItem, template)
      }

  addBasketElement(basketItem: IBasketItem, template: HTMLTemplateElement) {
    if(!this.basketElementList.some(card => card.id === basketItem.id)) {
      this.basketElementList.push({
        id: basketItem.id, 
        element: setBasketElement(template, basketItem, this.broker)
      })
    }
  }

  removeBasketItem(id: string) {
    this.basketItemList = this.basketItemList.filter((basketProduct) => basketProduct.id !== id)
    this.setBasketSize()
    this.removeBasketElement(id)
  }

  removeBasketElement(id:string) {
    this.basketElementList = this.basketElementList.filter((basketElement) => basketElement.id !== id)
  }

  calculateBasketSum() {
    this.basketSum = 0
    this.basketItemList.forEach((product: IBasketItem) => {
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
    this.broker.emit(EventList.changeBasketItem, {newSize: this.basketItemList.length})
  }

  getOrderData() {
    const basketProducts: Partial<IOrderProduct> = {
      items: [],
      total: this.calculateBasketSum() 
    }
    console.log(this.basketItemList)
    this.basketItemList.forEach((basketItem) => {
      if(basketItem.price) {      
        basketProducts.items.push(basketItem.id)
      }
    })
    return basketProducts
  }
}