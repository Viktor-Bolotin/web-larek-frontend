import { ClickCard, IBasketItem, IModalBasketCard, IProduct, payment } from "../types/index"
import { EventEmitter, EventList } from "../../src/components/basic/events"
import { setBasketElement, setCardElement } from "../components/view/helpFunctions"

export abstract class Modal {
  modal: HTMLElement
  modalContent: HTMLElement
  broker: EventEmitter
  modalButton: HTMLButtonElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    this.modal = container
    this.modalContent = this.modal.querySelector(".modal__content")
    this.broker = broker
    this.modalButton = this.modal.querySelector('.button')
  }

  openModal() {
    this.modal.classList.add('modal_active')
    this.broker.emit(EventList.OpenModal)
    this.modal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if(!(target.classList.contains('modal__content') || target.closest('.modal__content'))) {
        this.closeModal()
      }
    })
  }

  closeModal() {
    this.modal.classList.remove('modal_active')
    this.modal.removeEventListener('click', null)
    this.broker.emit(EventList.CloseModal)
  }
}

export class ModalCard extends Modal {
  modalTitle: HTMLElement
  modalDescription: HTMLElement
  modalPrice: HTMLElement
  modalCategory: HTMLElement
  modalImage: HTMLImageElement
  modalCard?: IProduct
  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    
    this.modalTitle = this.modal.querySelector('.card__title')
    this.modalDescription = this.modal.querySelector('.card__text')
    this.modalPrice = this.modal.querySelector('.card__price')
    this.modalCategory = this.modal.querySelector('.card__category')
    this.modalImage = this.modal.querySelector('.card__image')
    this.modalButton.addEventListener('click', () => {
      broker.emit<ClickCard>(EventList.ModalAddBasket, ({cardSettings: this.modalCard}))
      this.modalButton.textContent = 'Добавлено в корзину'
      this.modalButton.disabled = true
    })
  }

  setModal(cardSettings: IProduct) {
    this.modalCard = cardSettings
    this.modalTitle.textContent = cardSettings.title
    this.modalDescription.textContent = cardSettings.description

    if(cardSettings.selected) {
      this.modalButton.textContent = 'Добавлено в корзину'
      this.modalButton.disabled = true
    }
    else {
      this.modalButton.textContent = 'Купить'
      this.modalButton.disabled = false
    }

    if(cardSettings.price === null) {
      this.modalPrice.textContent = 'Бесценно'
    }
    else{
      this.modalPrice.textContent = `${cardSettings.price} синапсов`
    }

    this.modalImage.setAttribute('src', cardSettings.image)
    this.modalImage.setAttribute('alt', cardSettings.alt)
    this.modalCategory.textContent = cardSettings.category
    this.modalCategory.classList.remove('card__category_other')
    this.modalCategory.classList.add(`card__category_${cardSettings.categoryClass}`)

    this.openModal()
  }
}

export class ModalBasket extends Modal {
  modalList:HTMLElement
  modalCards: IModalBasketCard[]

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.modalList = this.modal.querySelector('.basket__list')
    this.modalCards = []
    this.modalButton.addEventListener('click', () => {
      broker.emit(EventList.ContinueModalBasket)
    })
  }

  addBasketElement(basketItem: IBasketItem, template: HTMLTemplateElement) {
    if(!this.modalCards.some(card => card.id === basketItem.id)) {
      this.modalCards.push({
        id: basketItem.id, 
        element: setBasketElement(template, basketItem, this.broker)
        })
    }
  }

  removeBasketElement(id: string) {
    this.modalCards = this.modalCards.filter((basketElement) => basketElement.id !== id)
  }

  renderBasket(sumBasket: number) {
    while(this.modalList.firstChild) {
      this.modalList.removeChild(this.modalList.firstChild)
    }

    if(this.modalCards.length > 0) {
    this.modalCards.forEach((card) => {
      card.element.querySelector('.basket__item-index').textContent = `${this.modalCards.indexOf(this.modalCards.find((element) => element.id === card.id)) + 1}`
      this.modalList.append(card.element)
    })
    this.modalButton.disabled = false
    }
    else {
      this.modalButton.disabled = true
    }

    this.modal.querySelector('.basket__price').textContent = `${sumBasket} синапсов`
  }
}

abstract class ModalClientData extends Modal {
modalInputs: HTMLInputElement[]

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.modalButton = this.modal.querySelector('.modal__actions').querySelector('.button')
    this.modalInputs = Array.from(this.modal.querySelectorAll('input'))
    this.modalInputs.forEach((input) => {
      input.value = ''
      input.addEventListener('input',() => {
        this.isValidModal()
      })
    })
  }

  isValidInput() {
      if(this.modalInputs.every((input) => input.value !== '')) {
        return true
      }
      else {
        return false
      }
  }

  isValidModal() {}
}

export class ModalOrder extends ModalClientData {
  paymentButtons: HTMLElement[]
  payment: string
  addressInput: HTMLInputElement
  address: string

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.payment = ''
    this.address = ''

    this.paymentButtons = Array.from(this.modal.querySelector('.order__buttons').querySelectorAll('.button'))
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.getAttribute('name')
        this.isValidModal()
      })
    })

    this.addressInput = this.modalInputs.find((input) => input.name === 'address')

    this.modalButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.address = this.addressInput.value
      this.broker.emit(EventList.ChoosePeymentAndAddress)
    })
  }

  isValidModal(): void {
   if(this.isValidInput() && this.payment !== ''){
    this.modalButton.disabled = false
   } 

   else {
    this.modalButton.disabled = true
   }
  }

  getOrderData() {
    return {
      payment: this.payment as payment,
      address: this.address
    }
  }
}

export class ModalContacts extends ModalClientData {
  emailInput: HTMLInputElement
  email: string
  phoneInput: HTMLInputElement
  phone: string

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)

    this.emailInput = this.modalInputs.find((input) => input.name === 'email')
    this.phoneInput = this.modalInputs.find((input) => input.name === 'phone')

    this.modalButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.email = this.emailInput.value
      this.phone = this.phoneInput.value
      this.broker.emit(EventList.PlaceAnOrder)
    })
  }

  isValidModal(): void {
    if(this.isValidInput()) {
      this.modalButton.disabled = false
    }

    else{
      this.modalButton.disabled = true
    }
  }

  getOrderData() {
    return {
      email: this.email,
      phone: this.phone
    }
  }
}

export class ModalSuccess extends Modal {
  total: HTMLElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.total = container.querySelector('.order-success__description')
    this.modalButton.addEventListener('click', () => {
      this.closeModal()
    })
  }

  renderModal(sumOrder: number) {
    this.total.textContent = `Списано ${sumOrder} синапсов`
    this.openModal()
  }
}