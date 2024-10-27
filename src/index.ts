import { ProductAPI } from './components/productApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { EventEmitter, EventList } from './components/basic/events';
import { Page } from './components/view/page';
import { addBasket, ChangeBasket, ClickCard, deleteProduct, GetProducts, IOrderSuccess } from './types';
import { Products } from './components/model/products';
import { ModalCard, ModalBasket, ModalContacts, ModalOrder, ModalSuccess } from "./components/Modal";
import { Basket } from './components/model/basket';
import { Order } from './components/model/order';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const BasketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket')

const broker = new EventEmitter()
const api = new ProductAPI(CDN_URL, API_URL)

const page = new Page(document.querySelector('.page'), broker)
const products = new Products(api, broker)
const basket = new Basket(broker)
const order = new Order(broker)

const modalBasket = new ModalBasket(document.querySelector('.basket').closest('.modal'), broker)
const modalCard = new ModalCard(document.querySelector('.card_full').closest('.modal'), broker)
const modalOrder = new ModalOrder(document.querySelector('.order_payment').closest('.modal'), broker)
const modalContacts = new ModalContacts(document.querySelector('.order_contacts').closest('.modal'), broker)
const modalSuccess = new ModalSuccess(document.querySelector('.order-success').closest('.modal'), broker)


products.getProducts()

broker.on<GetProducts>(EventList.GetProductList, ({ productsList }) => {
  page.renderGallery(productsList, cardTemplate)
})

broker.on<ClickCard>(EventList.ClickCard, ({cardSettings}) => {
  modalCard.setModal(cardSettings)
})

broker.on(EventList.OpenModal, () => {
  page.lockedPage(true)
})

broker.on(EventList.CloseModal, () => {
  page.lockedPage(false)
})

broker.on<addBasket>(EventList.ModalAddBasket, ({cardSettings}) => {
  products.toggleSelectProduct(cardSettings.id, true)
  modalBasket.addBasketElement(basket.addBasketItem(cardSettings), BasketItemTemplate)
})

broker.on(EventList.OpenModalBasket, () => {
  modalBasket.renderBasket(basket.calculateBasketSum());
  modalBasket.openModal()
})

broker.on<deleteProduct>(EventList.deleteBasketItem, ({id}) => {
  products.toggleSelectProduct(id, false)
  basket.removeBasketItem(id)
  modalBasket.removeBasketElement(id)
  modalBasket.renderBasket(basket.calculateBasketSum())
})

broker.on<ChangeBasket>(EventList.changeBasketItem, ({ newSize }) => {
  page.setBasketCounter(newSize)
})

broker.on(EventList.ContinueModalBasket, () => {
  modalOrder.openModal()
  modalBasket.closeModal()
  order.setOrderData(basket.getOrderData())
})

broker.on(EventList.ChoosePeymentAndAddress, () => {
  modalContacts.openModal()
  modalOrder.closeModal()
  order.setOrderData(modalOrder.getOrderData())
})

broker.on(EventList.PlaceAnOrder, () => {
  order.setOrderData(modalContacts.getOrderData())
  api.sentOrder(order.getOrderData())
  .then((data: IOrderSuccess) => {
    products.productsList.forEach((product) => {
      products.toggleSelectProduct(product.id, false)
    })
    basket.basketList.forEach((basketItem) =>{
      basket.removeBasketItem(basketItem.id)
    })
    modalBasket.modalCards.forEach((card) => {
      modalBasket.removeBasketElement(card.id)
    })

    modalSuccess.renderModal(data.total)
    modalContacts.closeModal()
  }) 
})