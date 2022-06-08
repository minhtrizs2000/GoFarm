theme.addEvent('click', '.js-multi-shop', function(e){
	const element = e.target;
	const type = element.className.includes('languages') ? 'languages': 'currencies';
	const input = document.querySelector(type == 'languages' ? '[name="language_code"]' : '[name="country_code"]');
	const switcher = element.closest('.multi-shop');

	if(!input) return;

	input.value = element.dataset.code || element.dataset.value;

	document.querySelectorAll(`[class="${switcher.className}"] .active`)?.forEach(item=>item.classList.remove('active'));
	document.querySelectorAll(`[class="${element.className}"]`)?.forEach(item=>{
		item.closest('li').classList.add('active');
		let switcher = item.closest('.multi-shop');
		switcher.querySelector('.js-multi-shop--value') && (switcher.querySelector('.js-multi-shop--value').textContent = type == 'currencies' ? element.dataset.value : element.dataset.code);
	});

	if(type == 'currencies' && theme.settings.currencyType == 'arena') {
		window.dispatchEvent(new CustomEvent("currenciesChange", {
			"detail": {
				item: null,
				currency: input.value
			}
		}));

		element.closest('details[open]') && element.closest('details[open]').removeAttribute('open');
	}
	else{
		input.closest('form').submit();
	}
})
