interface IProductApi {
  getAllProducts: () => Promise<IProduct[]>;
  getProduct: (id: string) => Promise<IProduct>
  PayBasket: (data: Order) => Promise<Order>
}

type ApiError = {
  error: string;
}

type price = number | null

interface IProduct {
  id: string;
  description: string;
  image: string
  title: string;
  category: string;
  price: price;
  selected?: boolean;
}

interface ProductCatalog {
  id: string;
  image: string;
  title: string;
  category: string;
  price: price
}

type GaleryProducts = ProductCatalog[];

type payment = "online" | "receipt"  

interface basketProduct {
  id: string;
  title: string;
  price: number | null
}

interface Order {
  payment: payment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

interface Contacts {
  email: string;
  phone: string;
}

interface IProducts {
  createProducts: () => IProduct[]
  renderModalCard: () => string;
  toggleChoose(): void
}

interface IGalery {
  renderCardGalery: () => string[];
}

interface IModalProduct {
  renderModalProduct: () => string[];
}

interface IBasket {
  quantityBasket: () => number;
  sumBasket: () => number;
}

interface IModalOrder {
  isValid:() => void;
  nextModal:() => void;
}

interface IModalBasket extends IModalOrder {
  renderBasket: () => string[];
}

interface IModalAddress extends IModalOrder{
  get address(): () => string;
  get paymentMethod(): () => payment;
}

interface IModalContacts extends IModalOrder{
  get Contacts(): () => Contacts;
}

interface IOrder {
  prepareToSentOrder: () => Order;
  sentOrder: () => void
}

interface IGaleryView {
  viewGalery:() => void;
}

interface IModalView {
  openModal:() => void;
  closeModal:() => void;
  errorValidView?:() => void;
  toggleActiveButton?:() => void;
  nextModal:() => void
}

interface IModalProductView extends IModalView {
  productDetailView:() => void;
}

interface BusketView {
  renderBusket:() => void;
  rerenderBusket:() => void;
  quantityBusket:() => void;
}
