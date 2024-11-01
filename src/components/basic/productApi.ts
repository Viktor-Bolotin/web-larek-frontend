import { IGetProductApi, IOrderProduct, IOrderSuccess, IProductAPI } from "../../types";
import { Api, ApiListResponse } from"./api";

export class ProductAPI extends Api implements IProductAPI {
  cdn: string;
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
}

getProductList(): Promise<IGetProductApi[]> {
  return this.get('/product')
  .then((data: ApiListResponse<IGetProductApi>) =>
    data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
    })));
}

sentOrder(order: IOrderProduct) {
 return this.post('/order', order)
.then((data: IOrderSuccess) => {
  return data
})

}

}

