import multiCurrency from './currencies';

class moneyElement extends HTMLElement {
	constructor() {
		super();

		this.currency = theme.settings.currency;
		this.content = this.lastElementChild || this;
	}

	set(value){
		let currencyFormat = this.dataset.format || theme.settings.currencyFormat || 'money_format';
		let f = multiCurrency.moneyFormats[this.currency][currencyFormat] || "{{amount}}";
		this.content.innerHTML = multiCurrency.formatMoney(value, f);
	}
}
customElements.define('price-item', moneyElement);