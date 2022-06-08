class Newsletter{
	constructor(container){
		this.form = container;
		this.subscriptionType = this.form.dataset.type || 'shopify';

		switch (this.subscriptionType) {
			case 'mailchimp':
				this.form?.addEventListener('submit', e=>{
					if(this.form.checkValidity()){
						e.preventDefault();
						this.mailchimpResp();
					}
				})
				break;

			case 'klaviyo':
				this.klaviyoScript();
				if(this.form.checkValidity()){
					e.preventDefault();
				}
				break;

			default:
				// statements_def
				break;
		}
	}

	mailchimpResp(){
		let form = this.form;
		let url = form.getAttribute('action')
		let email = form.querySelector('input[type="email"]')
		let ud = `&EMAIL=${encodeURIComponent(email.value)}`;

		if(url == ''){
			alert(`Could not connect to the registration server. Please try again later.`);
			return;
		}

		let script = document.createElement('script');
		script.src = url + ud;
		document.body.appendChild(script);

		let callback = 'mailchimpCallback';
		window[callback] = function(data) {
			delete window[callback];
			document.body.removeChild(script);

			const result = form.querySelector('.form-subscribe-notify');

			result.querySelector('.form-message--'+data.result+' .text').innerHTML = data.msg;
			result.setAttribute('data-result', data.result);
			result.classList.remove('hide');

			email.value = '';
		};
	}

	klaviyoScript(){

		if(document.getElementById('klaviyoScript')) {
			this.klaviyoInit();
			return;
		}

		const script = document.createElement('script');
		script.id = 'klaviyoScript';
		script.src = theme.assets.klaviyoScript;
		script.type = "text/javascript";
		script.onload = ()=>{
			this.klaviyoInit();
			console.log('klaviyoScript loaded');
		}

		document.body.appendChild(script);
	}

	klaviyoInit(){
		if('undefined' != typeof KlaviyoSubscribe){
			KlaviyoSubscribe.attachToForms(this.form, {
				custom_success_message: true,
				success: function ($form) {
					let email = $form.find('input[type="email"]')
					email.val('');

					const form = $form[0];
					const result = form.querySelector('.form-subscribe-notify');

					result.setAttribute('data-result', 'success');
					result.classList.remove('hide');
				}
			});
		}
	}
}

export default Newsletter;