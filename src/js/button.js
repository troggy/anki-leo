import buttonHtml from './button.html.js'
import { format } from './util.js'

export default class Button {
  constructor (locale, handlers) {
    this.locale = locale
    this.handlers = handlers
  }

  createButtonElement () {
    const buttonEl = document.createElement('div')
    buttonEl.innerHTML = format(
      buttonHtml,
      {
        export: this.locale.t('web_btn_export'),
        all: this.locale.t('web_btn_all'),
        learning: this.locale.t('web_btn_learning'),
        selected: this.locale.t('web_btn_selected')
      }
    )
    return buttonEl.firstChild
  }

  hideMenu (e) {
    if (!document.getElementById('ankileo-btn') || !document.getElementById('ankileo-btn').hasAttribute('open')) return
    document.getElementById('ankileo-btn').removeAttribute('open')
  }

  getDomElement () {
    const fragment = document.createDocumentFragment()
    fragment.appendChild(this.createButtonElement())
    const menuElements = fragment.querySelectorAll('#ankileo-btn ul a')

    for (const menuItem of menuElements) {
      menuItem.addEventListener('click', this.hideMenuHandler)
    }

    fragment.getElementById('ankileo-btn-all')
      .addEventListener('click', this.handlers.all)
    fragment.getElementById('ankileo-btn-new')
      .addEventListener('click', this.handlers.new)
    fragment.getElementById('ankileo-btn-selected')
      .addEventListener('click', this.handlers.selected)

    document.getElementsByTagName('body')[0].addEventListener(
      'click',
      this.hideMenu
    )

    return fragment
  }
}
