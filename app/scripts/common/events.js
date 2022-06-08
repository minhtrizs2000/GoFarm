import Popup from './function/popup';
import localforage from "localforage";

const events = {
	addEvent: function(evt, selector, handler){
		evt.split(' ').forEach(event=>{
			document.addEventListener(event, function(event) {
				if (event.target.matches(selector + ', ' + selector + ' *')) {
					handler.apply(event.target.closest(selector), arguments);
				}
			}, false);
		})
	}

	,toggleSticky: function(hide = true){
	  if(hide){
	    document.querySelector('sticky-header')?.classList.add('tnone')
	    return
	  }
	  document.querySelector('sticky-header')?.classList.remove('tnone');
	}

	,request: (method = 'POST', type = 'json')=>{
		return {
			method: method,
			credentials: 'same-origin',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': `application/${type};`
			}
		}
	}

	,debounce(fn, wait) {
		let t;
		return (...args) => {
			clearTimeout(t);
			t = setTimeout(() => fn.apply(this, args), wait);
		};
	}

	,serializeForm(form){
		const obj = {};
		const formData = new FormData(form);
		for (const key of formData.keys()) {
			obj[key] = formData.get(key);
		}
		return JSON.stringify(obj);
	}

	,Popup(e){
		return new Popup(e);
	}

	,localforage(){
		return localforage;
	}

	,scrollBarWidth(){
		let t = document.body.getBoundingClientRect();
		if (t.left + t.right < window.innerWidth)
			return window.innerWidth - (t.left + t.right);
		return 0;
	},

	async get(key){

		const data = await theme.localforage().getItem(key);

		if(!data)
			return data;

		const { expire, value } = data;

		if(expire < Date.now()){
			theme.localforage().removeItem(key);
			return null;
		}

		return value;

	},

	set(key, value, expire = false, callback = false){
		return theme.localforage().setItem(key, { value, expire }, expire && callback);
	}
}

window.theme = Object.assign(window.theme || {}, events);
