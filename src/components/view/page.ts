import { Component } from "../basic/component"

export class Page extends Component<HTMLElement> {
  container: HTMLElement
  wrapper: HTMLElement
  buttonOpenBasket: HTMLElement
  gallery: HTMLElement
  galleryElements: HTMLElement[]
  basketCounter: HTMLElement

  constructor(container: HTMLElement) {
    super(container)
    this.container = container
    this.wrapper = container.querySelector('.page__wrapper')
    this.buttonOpenBasket = container.querySelector('.header__basket')
    this.gallery = container.querySelector('.gallery')
    this.basketCounter = this.container.querySelector('.header__basket-counter')
  }

  lockedPage(value: boolean) {
    this.toggleClass(this.wrapper, 'page__wrapper_locked', value)
  }

  renderGallery() {
    this.galleryElements.forEach((element) => this.gallery.append(element))
    }
  
  setBasketCounter(size: number) {
    this.setText(this.basketCounter, `${size}`)
  }
}