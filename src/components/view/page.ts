import { ClickCard, IProduct } from "../../types"
import { cloneTemplate } from "../../utils/utils"
import { EventEmitter, EventList, IEvents } from "../basic/events"
import { setCardElement, setCardGalleryElement } from "./helpFunctions"

export class Page {
  container: HTMLElement
  wrapper: HTMLElement
  buttonOpenBasket: HTMLElement
  gallery: HTMLElement
  broker: EventEmitter
  basketCounter: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
    this.wrapper = container.querySelector('.page__wrapper')
    this.buttonOpenBasket = container.querySelector('.header__basket')
    this.gallery = container.querySelector('.gallery')
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

  renderGallery(cardElements: HTMLElement[]) {
    cardElements.forEach((card) => {
      this.gallery.append(card)
    })
    }
  
  setBasketCounter(size: number) {
    this.basketCounter.textContent = `${size}`
  }

  }