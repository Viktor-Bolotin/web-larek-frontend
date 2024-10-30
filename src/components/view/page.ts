export class Page {
  container: HTMLElement
  wrapper: HTMLElement
  buttonOpenBasket: HTMLElement
  gallery: HTMLElement
  galleryElements: HTMLElement[]
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

  renderGallery() {
    this.galleryElements.forEach((element) => this.gallery.append(element))
    }
  
  setBasketCounter(size: number) {
    this.basketCounter.textContent = `${size}`
  }

  }