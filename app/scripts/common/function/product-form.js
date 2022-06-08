class productForm extends HTMLElement {

  constructor() {
    super();
    this.JSON = window.theme.product;

    this.linkOptions();
    this.addEventListener('change', this.onChange.bind(this));
    this.template = document.getElementById('productTemplate')?.content || null;
  }

  onChange(event){
    const target = event.target;

    if(!target.classList.contains('js-variant-change')) return;

    let index = +target.name.replace(/[^\d]/g,'');

    if(index == 1){
      this.updateOptionsInSelector(2);
      this.updateOptionsInSelector(3);
    }

    if(index == 2){
      this.updateOptionsInSelector(3);
    }

    if(!this.getVariant()) return;

    this.updateMedia();
    this.updateURL();

    if(this.currentVariant){
      this.updateId();
      this.updateContent();
    }else{
      this.setUnavailable();
    }

    this.closest('[data-section-id]').classList.toggle('variant-soldout', !this.currentVariant?.available || false);

  }
  updateId(){
    if(this.currentVariant && this.currentVariant.available){
      this.querySelector('[name="id"]').value = this.currentVariant.id;
    }
  }

  getCurrentOptions(){
    let currentOptions = [];
    this.JSON.options.forEach((option, index)=>{
      let optionName = `[name="option${index+1}"]`;

      if(this.querySelector(optionName).tagName == 'INPUT'){
        currentOptions.push(this.querySelector(optionName+':checked')?.value);
      }else{
        currentOptions.push(this.querySelector(optionName)?.value);
      }
    });

    return currentOptions;
  }

  getVariant(){
    const options = this.getCurrentOptions();

    this.currentVariant = this.JSON.variants.find((variant) => {
      return !variant.options.map((option, index) => {
        return options[index] === option;
      }).includes(false);
    });

    if(!this.currentVariant){
      let selectOptions = Array.from(document.querySelectorAll('select[name*=option], input[name*=option]:checked')).filter(i=>i != null)

      if(this.JSON.options.length != selectOptions.length)
        return false;
    }

    return true;
  }


  updateURL() {
    if (!this.currentVariant) return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateContent(){

    const template = this.template.querySelector(`[data-variant-id="${this.currentVariant?.id}"]`);

    Array.from(document.querySelectorAll('.js-variant-update')).forEach(node=>{
      const target = template?.querySelector(`.js-variant-update[data-index="${node.dataset.index}"]`);
      node.innerHTML = target?.innerHTML || '';

      target && (node.className = target.className);
    })


    // document.querySelectorAll('.js-dynamic-checkout button')?.forEach(button=>button.toggleAttribute('disabled', !this.currentVariant.available));
  }

  updateMedia(){
    if(!this.currentVariant || !this.currentVariant.featured_media) return;
    const index = this.currentVariant.featured_media.position - 1;
    document.querySelector('product-slider-component.js-slider-main')?.goTo(index);
  }

  setUnavailable(){
    this.querySelectorAll('.add-to-cart')?.forEach(item=>{
      item.innerHTML = theme.string.unavailable;
    })

    this.querySelectorAll('.js-variant-update[data-index="price"]')?.forEach(item=>{
      item.innerHTML = `<span class="price">${theme.string.unavailable}</span>`;
    })

  }

  linkOptions(){
    this.optionsMap = {};
    this.availableOptions = {};

    for (var i=0; i<this.JSON.variants.length; i++) {
      let variant = this.JSON.variants[i];

      this.optionsMap['root'] = this.optionsMap['root'] || [];
      this.optionsMap['root'].push(variant.option1);
      this.optionsMap['root'] = [...new Set(this.optionsMap['root'])];

      if (this.JSON.options.length > 1) {
        var key = variant.option1;
        this.optionsMap[key] = this.optionsMap[key] || [];
        this.optionsMap[key].push(variant.option2);
        this.optionsMap[key] = [...new Set(this.optionsMap[key])];
      }

      if (this.JSON.options.length === 3) {
        var key = variant.option1 + ' / ' + variant.option2;
        this.optionsMap[key] = this.optionsMap[key] || [];
        this.optionsMap[key].push(variant.option3);
        this.optionsMap[key] = [...new Set(this.optionsMap[key])];
      }

      if (variant.available) {
        this.availableOptions['root'] = this.availableOptions['root'] || [];
        this.availableOptions['root'].push(variant.option1);
        this.availableOptions['root'] = [...new Set(this.availableOptions['root'])];

        if (this.JSON.options.length > 1) {
          var key = variant.option1;
          this.availableOptions[key] = this.availableOptions[key] || [];
          this.availableOptions[key].push(variant.option2);
          this.availableOptions[key] = [...new Set(this.availableOptions[key])];
        }

        if (this.JSON.options.length === 3) {
          var key = variant.option1 + ' / ' + variant.option2;
          this.availableOptions[key] = this.availableOptions[key] || [];
          this.availableOptions[key].push(variant.option3);
          this.availableOptions[key] = [...new Set(this.availableOptions[key])];
        }
      }
    }

    if(!Array.from(document.querySelectorAll('select[name*=option], input[name*=option]:checked')).filter(i=>i != null).length) return;

    this.updateOptionsInSelector(1);
    (this.JSON.options.length > 1) && this.updateOptionsInSelector(2);
    (this.JSON.options.length === 3) && this.updateOptionsInSelector(3);
  }

  updateOptionsInSelector(index){
    let key;
    let selector;

    const optionEl = {
      option1: Array.from(document.querySelectorAll('select[name=option1], input[name=option1]:checked')).find(i=>i != null),
      option2: Array.from(document.querySelectorAll('select[name=option2], input[name=option2]:checked')).find(i=>i != null),
      option3: Array.from(document.querySelectorAll('select[name=option3], input[name=option3]:checked')).find(i=>i != null)
    }

    switch (index) {
      case 1:
      key = 'root'
      selector = optionEl.option1;
      break;

      case 2:
      key = optionEl.option1?.value
      selector = optionEl.option2;
      break;

      default:
      key = optionEl.option1?.value
      selector = optionEl.option3;
      key += ' / ' + optionEl.option2?.value;
      index = 3;
    }


    if(!selector){
      selector = Array.from(document.querySelectorAll(`select[name=option${index}], input[name=option${index}]`)).find(i=>i != null)
    };

    const availableOptions = this.optionsMap[key] || [];
    const optionsValid = this.availableOptions[key] || [];
    const initialValue = selector?.value || 'null';;

    if(!selector) return;

    if (selector.tagName == 'SELECT') {
      Array.from(selector.querySelectorAll('option')).forEach(option=>{
        availableOptions.includes(option.value) ? option.removeAttribute('hidden') : option.setAttribute('hidden', '');
      })

      if(availableOptions.length && !availableOptions.includes(initialValue)){
        selector.value = availableOptions[0];
      }
    }

    else{

      Array.from(this.querySelectorAll(`[name=${selector.name}]`)).forEach(input=>{
        input.classList.toggle('disabled', !optionsValid.includes(input.value));        
      })

      if(availableOptions.length && !availableOptions.includes(initialValue)){
        const tempInput = document.createElement('input');
        tempInput.type = 'text';
        tempInput.value = availableOptions[0];

        const findAvailableInput = Array.from(this.querySelectorAll(`[name=${selector.name}]`)).find(input=>input.value == tempInput.value)
        findAvailableInput && (findAvailableInput.checked = true);
      }
    }

  }

}

customElements.define('product-form', productForm);