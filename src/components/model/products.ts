import { GetProducts, IBasketItem, IGetProductApi, IProduct, IProductAPI } from "../../types"
import { EventEmitter, EventList } from "../basic/events"
import { setCategoryClass } from "./helpFunctions"

export class Products {
  productsList: IProduct[]
  api: IProductAPI
  broker: EventEmitter

  constructor(api:IProductAPI, broker: EventEmitter) {
    this.productsList = []
    this.api = api
    this.broker = broker
  }

  getProducts() {
    this.api.getProductList()
    .then((res: IGetProductApi[] | IGetProductApi) => {
      if(!Array.isArray(res)) {
        this.addProduct(res)
      } 
      else{
        res.forEach((product) => {
          this.addProduct(product)
        })
      }
      this.broker.emit<GetProducts>(EventList.GetProductList, this)
    })
  }

  addProduct(item: IGetProductApi) {
    const newProduct: IProduct = {
    id: item.id,
    category: item.category,
    description: item.description,
    image: item.image,
    title: item.title,
    selected: false,
    alt: item.title,
    price: item.price,
    categoryClass: setCategoryClass(item.category)
    }
    
    this.productsList.push(newProduct)
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
}