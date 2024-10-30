export function setCategoryClass(category: string) {
  switch (category) {
    case 'софт-скил':
      return 'soft';
    case 'другое':
      return 'other'
    case 'кнопка': 
      return 'button'
    case 'дополнительное':
      return 'additional'
    case 'хард-скил':
      return 'hard'
    default:
      return 'soft'
  }
}
