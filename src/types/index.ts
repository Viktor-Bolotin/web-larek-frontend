// Типы событий
export type ClickCard = {cardSettings: IProduct}
export type IModalBasketCard = {
  id: string
  element: HTMLElement
}
export type deleteProduct = {id: string}
export type GetProducts = {productsList: IProduct[]}
export type ClickEvent<T> = {event: MouseEvent, item: T}
export type addBasket = {cardSettings: IBasketItem}
export type ChangeBasket = {newSize: number}
export type PaymantAndAddress = {payment: string, address: string}

// Типы данных для обработки товаров
export interface IProduct {
  id: string;
  description: string;
  image: string;
  alt: string;
  title: string;
  category: string;
  price: price
  selected: boolean;
  categoryClass: string
}

export interface IBasketItem {
  id: string
  title: string
  price: price
}

export interface IOrderProduct {
  payment: payment
  email: string
  phone: string
  address: string
  total: number
  items: string[]
}

// Типы данных АПИ
export interface IProductAPI {
  cdn: string,
  getProductList(): Promise<IGetProductApi[]>
}

export interface IGetProductApi {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: price
}

export interface IOrderSuccess {
  id: string
  total: number
}

type price = number | null

export type payment = 'card' | 'cash'  

