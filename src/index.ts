import { ProductAPI } from './components/productApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, EventList } from './components/basic/events';
import { Page } from './components/view/Page';
import { addBasket, ClickCard, deleteProduct, IOrderSuccess, PaymantAndAddress, PhoneAndEmail, IGetProductApi } from './types';
import { Products } from './components/model/products';
import { Basket } from './components/model/basket';
import { Order } from './components/model/order';
import { GalleryItemView } from './components/view/GalleryItemView';
import { BasketItemView } from './components/view/BasketItemView';
import { ModalCardContent } from './components/view/ModalCardContent';
import { MainModal } from './components/view/MainModal';
import { ModalBasketContent } from './components/view/ModalBasketContent';
import { ModalOrderContent } from './components/view/ModalOrderContent';
import { ModalContactsContent } from './components/view/ModalContactsContent';
import { ModalSuccessContent } from './components/view/ModalSuccessContent';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const BasketElementTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const modalCardContentTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const modalBasketContentTemplate = ensureElement<HTMLTemplateElement>('#basket')
const modalOrderContentTemplate = ensureElement<HTMLTemplateElement>('#order')
const modalContactsContentTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const modalSuccessContentTemplate = ensureElement<HTMLTemplateElement>('#success')

const broker = new EventEmitter()
const api = new ProductAPI(CDN_URL, API_URL)

const page = new Page(document.querySelector('.page'))
const products = new Products()
const basket = new Basket(broker)
const order = new Order()

const mainModal = new MainModal(document.querySelector('#modal-container'), broker)
const modalCardContent = new ModalCardContent(cloneTemplate(modalCardContentTemplate))
const modalBasketContent = new ModalBasketContent(cloneTemplate(modalBasketContentTemplate))
const modalOrderContent = new ModalOrderContent(cloneTemplate(modalOrderContentTemplate))
const modalContactsContent = new ModalContactsContent(cloneTemplate(modalContactsContentTemplate))
const modalSuccessContent = new ModalSuccessContent(cloneTemplate(modalSuccessContentTemplate))

api.getProductList()
  .then((res: IGetProductApi[]) => {
    products.productsList = res
    products.setSelectedProducts()
    page.galleryElements = products.productsList.map((product) => new GalleryItemView(cardTemplate, product, broker).galleryCard)
    page.renderGallery()
  })
  .catch((err) => console.log(err))

page.buttonOpenBasket.addEventListener('click', () => {
  broker.emit(EventList.OpenModalBasket)
})

// Подключение функциональности кнопок основного события модальных окон
modalCardContent.modalButton.addEventListener('click', () => {
  broker.emit<ClickCard>(EventList.AddBasket, ({cardSettings: modalCardContent.modalSettings}))
  modalCardContent.modalButton.textContent = 'Добавлено в корзину'
  modalCardContent.modalButton.disabled = true
})

modalBasketContent.modalButton.addEventListener('mousedown', () => {
  broker.emit(EventList.ContinueModalBasket)
})

modalOrderContent.modalButton.addEventListener(('mousedown'), () => {
  broker.emit(EventList.ChoosePeymentAndAddress)
})

modalContactsContent.modalButton.addEventListener(('click'), (e) => {
  e.preventDefault()
  broker.emit<PhoneAndEmail>(EventList.PlaceAnOrder)
})

modalSuccessContent.modalButton.addEventListener(('click'), () => {
  mainModal.closeModal()
})


// Отслеживание событий брокера
broker.on<ClickCard>(EventList.ClickCard, ({cardSettings}) => {
  mainModal.render({content: modalCardContent.render(cardSettings)})
  mainModal.openModal()
})

broker.on(EventList.OpenModal, () => {
  page.lockedPage(true)
})

broker.on(EventList.CloseModal, () => {
  page.lockedPage(false)
})

broker.on<addBasket>(EventList.AddBasket, ({cardSettings}) => {
  products.toggleSelectProduct(cardSettings.id, true)
  basket.addBasketItem(cardSettings)
})

broker.on(EventList.OpenModalBasket, () => {
  mainModal.render({ content: modalBasketContent.render(basket.calculateBasketSum())})
  mainModal.openModal()
})

broker.on<deleteProduct>(EventList.DeleteBasketItem, (id) => {
  products.toggleSelectProduct(id.id, false)
  basket.removeBasketItem(id.id)
  mainModal.render({content: modalBasketContent.render(basket.calculateBasketSum())})
})

broker.on(EventList.UpdateBasket, () => {
  BasketItemView.throwBasketItemCounter()
  modalBasketContent.basketElementList = basket.basketItemList.map((basketItem) => new BasketItemView(BasketElementTemplate, basketItem, broker).basketCard)
  page.setBasketCounter(basket.basketItemList.length)
})

broker.on(EventList.ContinueModalBasket, () => {
  mainModal.render({content: modalOrderContent.render()})
})

broker.on(EventList.ChoosePeymentAndAddress, () => {
  mainModal.render({content: modalContactsContent.render()})
})

broker.on(EventList.PlaceAnOrder, () => {
  order.setOrderData(basket.getOrderData())
  order.setOrderData({
    payment: modalOrderContent.payment,
    address: modalOrderContent.addressInput.value,
    phone: modalContactsContent.phoneInput.value,
    email: modalContactsContent.emailInput.value
  })

  api.sentOrder(order.getOrderData())
  .then((data: IOrderSuccess) => {
    products.productsList.forEach((product) => {
      products.toggleSelectProduct(product.id, false)
    })
    basket.basketItemList.forEach((basketItem) => {
      basket.removeBasketItem(basketItem.id)
    })

    mainModal.render({content: modalSuccessContent.render(data.total)})
  })

  .catch((err) => console.log(err))
})
