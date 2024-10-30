import { IProduct } from "../../types"

export class Products {
  productsList: IProduct[]

  constructor() {
    this.productsList = []
  }

  setSelectedProducts() {
    this.productsList.forEach((product) => {
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
}