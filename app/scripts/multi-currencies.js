import localforage from "localforage";
import multiCurrency from './common/function/currencies';

const script = document.createElement('script');
script.src = theme.assets.currenciesRateUrl;
document.head.append(script);

script.onload = function(){


	class moneyElement extends HTMLElement {
		constructor() {
			super();

			this.defaultCurrency = theme.settings.currency;
			this.currency = this.defaultCurrency;
			this.content = this.lastElementChild || this;

			localforage.getItem("currency").then(c=>{
				const currency = c || this.currency;

				if(currency != this.currency){
					window.dispatchEvent(new CustomEvent("currenciesChange", {
						"detail": {
							item: this,
							currency: currency
						}
					}))
				}

				this.content.setAttribute('data-currencies-'+this.currency, this.content.innerHTML.trim());
			})
		}

		updateSelectorState(currency){
			document.querySelectorAll('.js-currencies-value, [name="country_code"]')?.forEach(item=>{
				if(item.tagName == 'INPUT'){
					item.value = currency;
				}
				else{
					item.innerHTML = currency;
				}
			});
			document.querySelectorAll('.js-currencies-'+currency)?.forEach(item=>{
				item.closest('.js-currencies-list')?.querySelectorAll('.active')?.forEach(i=>i.classList.remove('active'));
				item.closest('li').classList.add('active');
			});


		}

		format(to){
			let from = this.currency;
			let currencyFormat = this.dataset.format || theme.settings.currencyFormat || 'money_format';
			
			let f = multiCurrency.moneyFormats[from][currencyFormat] || "{{amount}}";
			let g = multiCurrency.moneyFormats[to][currencyFormat] || "{{amount}}";
			let price = parseInt(this.textContent.trim().replace(/[^0-9]/g, ""), 10);

			localforage.setItem("currency", to).then(currency =>{
				this.currency = currency;

				if(this.hasAttribute('data-currencies-'+currency)){
					this.content.innerHTML = this.content.getAttribute('data-currencies-'+currency);
				}
				else {	
					if (f.indexOf("amount_no_decimals") !== -1) {
						price = parseInt(this.textContent.trim().replace(/[^0-9]/g, ""), 10) * 100;
					}
					else if (to === "JOD" || to == "KWD" || to == "BHD") {
						price = parseInt(this.textContent.trim().replace(/[^0-9]/g, ""), 10) / 10;
					}

					let e = Currency.convert(price, from, to);
					this.content.innerHTML = multiCurrency.formatMoney(e, g);
					this.content.setAttribute('data-currencies-'+currency, this.content.innerHTML.trim());
				}
			});
		}

		set(value){
			let from = this.defaultCurrency;
			let to = this.currency;
			let currencyFormat = this.dataset.format || theme.settings.currencyFormat || 'money_format';

			let f = multiCurrency.moneyFormats[from][currencyFormat] || "{{amount}}";
			let g = multiCurrency.moneyFormats[to][currencyFormat] || "{{amount}}";
			let price = parseInt(value.toString().replace(/[^0-9]/g, ""), 10);


			if (f.indexOf("amount_no_decimals") !== -1) {
				price = parseInt(value.toString().replace(/[^0-9]/g, ""), 10) * 100;
			}
			else if (to === "JOD" || to == "KWD" || to == "BHD") {
				price = parseInt(value.toString().replace(/[^0-9]/g, ""), 10) / 10;
			}

			let e = Currency.convert(price, from, to);
			this.content.innerHTML = multiCurrency.formatMoney(e, g);
			this.content.setAttribute('data-currencies-'+this.currency, this.content.innerHTML.trim());
		}
	}
	customElements.define('price-item', moneyElement);

}

window.addEventListener('currenciesChange', e=>{
	const {item, currency} = e.detail;

	if(item){
		item.format(currency);
		item.updateSelectorState(currency);
	}
	else{
		document.querySelectorAll('price-item')?.forEach((item, index)=>{
			item.format(currency);
			index == 0 && item.updateSelectorState(currency);
		})
	}

	document.querySelectorAll('.js-currency-symbol')?.forEach(item=>{
		let str = multiCurrency.moneyFormats[currency]['money_format'];
		let removeContent = `{{${str.split('{{')[1].split('}}')[0]}}}`;
		let symbol = str.replace(removeContent, '').trim();

		item.innerHTML = symbol;
	});
})