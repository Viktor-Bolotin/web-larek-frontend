import { IOrderProduct } from "../../types";

export class Order {
  orderInformation: Partial<IOrderProduct>

  constructor() {
    this.orderInformation = {}
  }

  setOrderData(data: Partial<IOrderProduct>) {
    if(data.address) {this.orderInformation.address = data.address}
    if(data.email) {this.orderInformation.email = data.email}
    if(data.payment) {this.orderInformation.payment = data.payment}
    if(data.items){this.orderInformation.items = data.items}
    if(data.phone){this.orderInformation.phone = data.phone}
    if(data.total){this.orderInformation.total = data.total}
  }

  getOrderData() {
    return this.orderInformation as IOrderProduct
  }
  
}