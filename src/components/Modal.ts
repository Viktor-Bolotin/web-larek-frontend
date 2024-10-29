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
  modalSettings?: IProduct
  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    
    this.modalTitle = this.modal.querySelector('.card__title')
    this.modalDescription = this.modal.querySelector('.card__text')
    this.modalPrice = this.modal.querySelector('.card__price')
    this.modalCategory = this.modal.querySelector('.card__category')
    this.modalImage = this.modal.querySelector('.card__image')
  }

  setModal(cardSettings: IProduct) {
    this.modalSettings = cardSettings
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
  }
}

export class ModalBasket extends Modal {
  modalList:HTMLElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.modalList = this.modal.querySelector('.basket__list')
  }

  renderBasket(basketElements: IModalBasketCard[], sumBasket: number) {
    while(this.modalList.firstChild) {
      this.modalList.removeChild(this.modalList.firstChild)
    }

    if(basketElements.length > 0) {
    basketElements.forEach((card) => {
      card.element.querySelector('.basket__item-index').textContent = `${basketElements.indexOf(basketElements.find((element) => element.id === card.id)) + 1}`
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

export class ModalOrder extends Modal {
  paymentButtons: HTMLElement[]
  addressInput: HTMLInputElement
  payment: string

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)

    this.addressInput = this.modal.querySelector('input[name = address]')
    this.addressInput.addEventListener(('input'), () => {
      this.isValidModal()
    })

    this.payment = ''

    this.paymentButtons = Array.from(this.modal.querySelector('.order__buttons').querySelectorAll('.button'))
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.getAttribute('name')
        this.isValidModal()
      })
    })

    this.modalButton = this.modal.querySelector('.modal__actions').querySelector('.button')
  }

  isValidModal(): void {
   if(this.addressInput.value !== '' && this.payment !== ''){
    this.modalButton.disabled = false
   } 

   else {
    this.modalButton.disabled = true
   }
  }
}

export class ModalContacts extends Modal {
  modalInputs: HTMLInputElement[]
  emailInput: HTMLInputElement
  phoneInput: HTMLInputElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)

    this.modalInputs = Array.from(this.modal.querySelectorAll('input'))
    this.modalInputs.forEach((input) => {
      input.addEventListener(('input'), () => {
        this.isValidModal()
      })
    })

    this.emailInput = this.modalInputs.find((input) => input.name === 'email')
    this.phoneInput = this.modalInputs.find((input) => input.name === 'phone')

    this.modalButton = this.modal.querySelector('.modal__actions').querySelector('.button')
  }

  isValidModal(): void {
    if(this.emailInput.value !=='' && this.phoneInput.value !== '') {
      this.modalButton.disabled = false
    }

    else{
      this.modalButton.disabled = true
    }
  }
}

export class ModalSuccess extends Modal {
  total: HTMLElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    super(container, broker)
    this.total = container.querySelector('.order-success__description')
  }

  renderModal(sumOrder: number) {
    this.total.textContent = `Списано ${sumOrder} синапсов`
  }
}