import { IOrderProduct } from "../../types";
import { EventEmitter } from "../basic/events";

export class Order {
  broker: EventEmitter
  orderInf: Partial<IOrderProduct>

  constructor(broker: EventEmitter) {
    this.broker = broker
    this.orderInf = {}
  }

  setOrderData(data: Partial<IOrderProduct>) {
    if(data.address) {this.orderInf.address = data.address}
    if(data.email) {this.orderInf.email = data.email}
    if(data.payment) {this.orderInf.payment = data.payment}
    if(data.items){this.orderInf.items = data.items}
    if(data.phone){this.orderInf.phone = data.phone}
    if(data.total){this.orderInf.total = data.total}
  }

  getOrderData() {
    return this.orderInf as IOrderProduct
  }
  
}