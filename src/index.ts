import { ProductAPI } from './components/productApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { EventEmitter, EventList } from './components/basic/events';
import { Page } from './components/view/page';
import { addBasket, ChangeBasket, ClickCard, deleteProduct, ReceiveProducts, IOrderSuccess, PaymantAndAddress, PhoneAndEmail, IGetProductApi } from './types';
import { Products } from './components/model/products';
import { Basket } from './components/model/basket';
import { Order } from './components/model/order';
import { GalleryItemView } from './components/view/GalleryItemView';
import { BasketItemView } from './components/view/BasketItemView';
import { ModalBasket } from './components/view/ModalBasket';
import { ModalCard } from './components/view/ModalCard';
import { ModalOrder } from './components/view/ModalOrder';
import { ModalContacts } from './components/view/ModalContacts';
import { ModalSuccess } from './components/view/ModalSuccess';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const BasketElementTemplate = ensureElement<HTMLTemplateElement>('#card-basket')

const broker = new EventEmitter()
const api = new ProductAPI(CDN_URL, API_URL)

const page = new Page(document.querySelector('.page'))
const products = new Products()
const basket = new Basket(broker)
const order = new Order()

const modalBasket = new ModalBasket(document.querySelector('.basket').closest('.modal'), broker)
const modalCard = new ModalCard(document.querySelector('.card_full').closest('.modal'), broker)
const modalOrder = new ModalOrder(document.querySelector('.order_payment').closest('.modal'), broker)
const modalContacts = new ModalContacts(document.querySelector('.order_contacts').closest('.modal'), broker)
const modalSuccess = new ModalSuccess(document.querySelector('.order-success').closest('.modal'), broker)

api.getProductList()
  .then((res: IGetProductApi[]) => {
    products.productsList = res
    products.setSelectedProducts()
    page.galleryElements = products.productsList.map((product) => new GalleryItemView(cardTemplate, product, broker).galleryCard)
    page.renderGallery()
  })
  .catch((err) => console.log(err))

page.buttonOpenBasket.addEventListener('click', () => {
  modalBasket.setBasket(basket.calculateBasketSum())
  broker.emit(EventList.OpenModalBasket)
})

// Подключение функциональности кнопок основного события модальных окон
modalCard.modalButton.addEventListener('click', () => {
  broker.emit<ClickCard>(EventList.ModalAddBasket, ({cardSettings: modalCard.modalSettings}))
  modalCard.modalButton.textContent = 'Добавлено в корзину'
  modalCard.modalButton.disabled = true
})

modalBasket.modalButton.addEventListener('click', () => {
  broker.emit(EventList.ContinueModalBasket)
})

modalOrder.modalButton.addEventListener(('click'), (e) => {
  e.preventDefault()
  modalOrder.broker.emit(EventList.ChoosePeymentAndAddress, ({
    payment: modalOrder.payment,
    address: modalOrder.addressInput.value
  }))
})

modalContacts.modalButton.addEventListener(('click'), (e) => {
  e.preventDefault()
  modalContacts.broker.emit<PhoneAndEmail>(EventList.PlaceAnOrder, ({
    phone: modalContacts.phoneInput.value,
    email: modalContacts.emailInput.value
  }))
})

modalSuccess.modalButton.addEventListener(('click'), () => {
  modalSuccess.closeModal()
})


// Отслеживание событий брокера
broker.on<ClickCard>(EventList.ClickCard, ({cardSettings}) => {
  modalCard.setModal(cardSettings)
  modalCard.openModal()
})

broker.on(EventList.OpenModal, () => {
  page.lockedPage(true)
})

broker.on(EventList.CloseModal, () => {
  page.lockedPage(false)
})

broker.on<addBasket>(EventList.ModalAddBasket, ({cardSettings}) => {
  products.toggleSelectProduct(cardSettings.id, true)
  basket.addBasketItem(cardSettings)
})

broker.on(EventList.OpenModalBasket, () => {
  modalBasket.openModal()
})

broker.on<deleteProduct>(EventList.DeleteBasketItem, (id) => {
  products.toggleSelectProduct(id.id, false)
  basket.removeBasketItem(id.id)
})

broker.on(EventList.UpdateBasket, () => {
  modalBasket.basketElementList = basket.basketItemList.map((basketItem) => new BasketItemView(BasketElementTemplate, basketItem, broker).basketCard)
  modalBasket.setBasket(basket.calculateBasketSum())
  page.setBasketCounter(basket.basketItemList.length)
})

broker.on(EventList.ContinueModalBasket, () => {
  modalOrder.openModal()
  modalBasket.closeModal()
  order.setOrderData(basket.getOrderData())
})

broker.on<PaymantAndAddress>(EventList.ChoosePeymentAndAddress, (information) => {
  modalContacts.openModal()
  modalOrder.closeModal()
  order.setOrderData(information)
})

broker.on<PhoneAndEmail>(EventList.PlaceAnOrder, (information) => {
  order.setOrderData(information)

  api.sentOrder(order.getOrderData())
  .then((data: IOrderSuccess) => {
    products.productsList.forEach((product) => {
      products.toggleSelectProduct(product.id, false)
    })
    basket.basketItemList.forEach((basketItem) =>{
      basket.removeBasketItem(basketItem.id)
    })

    modalSuccess.renderModal(data.total)
    modalSuccess.openModal()
    modalContacts.closeModal()
  })

  .catch((err) => console.log(err))
})