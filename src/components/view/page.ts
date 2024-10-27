import { ClickCard, IProduct } from "../../types"
import { cloneTemplate } from "../../utils/utils"
import { EventEmitter, EventList, IEvents } from "../basic/events"
import { setCardElement, setCardGalleryElement } from "./helpFunctions"

export class Page {
  container: HTMLElement
  wrapper: HTMLElement
  buttonOpenBasket: HTMLElement
  gallery: HTMLElement
  galleryElements: HTMLElement[]
  broker: EventEmitter
  basketCounter: HTMLElement

  constructor(container: HTMLElement, broker: EventEmitter) {
    this.container = container
    this.wrapper = container.querySelector('.page__wrapper')
    this.buttonOpenBasket = container.querySelector('.header__basket')
    this.buttonOpenBasket.addEventListener('click', () => {
      broker.emit(EventList.OpenModalBasket)
    })
    this.gallery = container.querySelector('.gallery')
    this.galleryElements = []
    this.broker = broker
    this.basketCounter = this.container.querySelector('.header__basket-counter')
  }

  lockedPage(value: boolean) {
    if(value) {
      this.wrapper.classList.add('page__wrapper_locked')
    }
    else {
      this.wrapper.classList.remove('page__wrapper_locked')
    }
  }

  renderGallery(items: IProduct[], cardTemplate: HTMLTemplateElement) {
    items.forEach((item) => {
      const cardElement = setCardGalleryElement(cardTemplate, item, this.broker)
      this.galleryElements.push(cardElement)
      this.gallery.append(cardElement)
    })
    }
  
  setBasketCounter(size: number) {
    this.basketCounter.textContent = `${size}`
  }

  }