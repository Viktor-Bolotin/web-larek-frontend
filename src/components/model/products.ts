import { ReceiveProducts, IBasketItem, IGetProductApi, IProduct, IProductAPI } from "../../types"
import { EventEmitter, EventList } from "../basic/events"
import { setCardGalleryElement } from "../view/helpFunctions"
import { setCategoryClass } from "./helpFunctions"

export class Products {
  productsList: IProduct[]
  api: IProductAPI
  broker: EventEmitter
  cardElementList: HTMLElement[]

  constructor(api:IProductAPI, broker: EventEmitter) {
    this.productsList = []
    this.api = api
    this.broker = broker
    this.cardElementList = []
  }

  receiveProducts(template: HTMLTemplateElement) {
    this.api.getProductList()
    .then((res: IGetProductApi[]) => {
      this.productsList = res
      this.setProducts()
      this.setCards(template)
    })
  }

  setProducts() {
    this.productsList.forEach((product) => {
      product.alt = product.title
      product.categoryClass = setCategoryClass(product.category)
      product.selected = false
    })
  }

  getProduct(cardSettings: IProduct) {
    this.productsList.forEach((product) => {
      if(product.id === cardSettings.id) {
        cardSettings.selected = product.selected
        return cardSettings
      }
    })
    return cardSettings
  }

  toggleSelectProduct(id: string, selected: boolean) {
    this.productsList.forEach((product) => {
      if(product.id === id) {
        product.selected = selected
      }
    })
  }

  setCards(cardTemplate: HTMLTemplateElement) {
    this.productsList.forEach((product) => {
      const cardElement = setCardGalleryElement(cardTemplate, product, this.broker)
      this.cardElementList.push(cardElement)
    })
    this.broker.emit<ReceiveProducts>(EventList.GetProductList)
  }
}