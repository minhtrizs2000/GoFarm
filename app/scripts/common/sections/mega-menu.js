export default megaMenu = {
  onLoad: function(){

  }
  ,onDeselect: function(){
    document.querySelectorAll('mega-dropdown')?.forEach(megaDropdown=>{
      const trigger = megaDropdown.closest('details') ? megaDropdown.closest('details') : megaDropdown.closest('li');
      trigger.dispatchEvent(new CustomEvent('trigger:removeMegaMenu'));
    })
  }
  ,onBlockSelect: function(e){
    setTimeout(()=>{
      const currentBlock = e.target;
      const megaSection = currentBlock.closest(`[data-mega-trigger]`);
      const ID = megaSection.dataset.megaTrigger;
      const megaDropdown = document.querySelector(`mega-dropdown[data-id="${ID}"]`);

      if(!megaDropdown) return;

      const trigger = megaDropdown.closest('details') ? megaDropdown.closest('details') : megaDropdown.closest('li');

      if(currentBlock?.closest('.mega-tab-section') && currentBlock.closest('[data-tab-id]')){
        megaSection.querySelector(`.js-mega-tab-title[data-tab-id="${currentBlock.closest('[data-tab-id]').dataset.tabId}"]`)?.dispatchEvent(new CustomEvent('trigger:change'));
      }

      trigger.dispatchEvent(new CustomEvent('trigger:getMegaMenu', {detail: {eventType: e.type, megaBlock: currentBlock.className}}));
    }, 100)
  }


  ,onBlockDeselect: function(e){
    this.container.querySelectorAll('.blink')?.forEach(i=>i.classList.remove('blink'));
  }
};

class MegaMenu extends HTMLElement {
  constructor() {
    super();

    this.trigger = this.dataset.id;
    this.element = this.closest('details') ? this.closest('details') : this.closest('li');

    const template = document.querySelector('[data-section-type="mega-menu"]');
    if(!template || !this.element) return;

    this.designMode = template.tagName != 'TEMPLATE';
    this.insertTarget = this.closest('summary') ? this.closest('summary') : this;

    this.element.addEventListener('mouseenter', this.getSection.bind(this), {once: true});
    this.closest('details') && this.element.addEventListener('click', this.getSection.bind(this), {once: true});


    if(this.designMode){
      this.element.addEventListener('trigger:getMegaMenu', this.getSection.bind(this));
      this.element.addEventListener('trigger:removeMegaMenu', this.removeBlocks.bind(this));
    }
  }

  getMegaBlock(){
    const arrayMega = [];

    document.querySelectorAll('[data-section-type="mega-menu"]')?.forEach(item=>{
      const template = (this.designMode ? item : item.content);
      template.querySelectorAll(`[data-mega-trigger]`)?.forEach(i=>arrayMega.push(i));
    })

    return arrayMega.find(i=>i.dataset.megaTrigger == this.trigger);
  }

  getSubMenu(){
    let nextNode = this.insertTarget.nextSibling;
    if(!nextNode || nextNode?.tagName != 'TEMPLATE' || this.designMode) return;

    nextNode.replaceWith(nextNode.content?.firstElementChild || '');
  }

  getSection(event){
    const megaBlock = this.getMegaBlock();

    if(!megaBlock){
      this.getSubMenu();
      return
    };

    this.removeBlocks(event);

    /*If haven't any mega block*/
    const currentMega = this.element.querySelector(`[data-mega-trigger="${this.trigger}"]`);


    if(currentMega){
      currentMega.innerHTML != megaBlock.innerHTML && (currentMega.innerHTML = megaBlock.innerHTML);
    }
    else{
      this.insertTarget.insertAdjacentHTML('afterend', megaBlock.outerHTML)
    }

    this.element.tagName == 'LI' && this.element.classList.add('has-dropdown');

    if(!this.designMode){
      megaBlock?.remove();
      document.querySelectorAll('template[data-section-type="mega-menu"]')?.forEach(item=>{
        !item.content.firstElementChild && item.closest('.shopify-section').remove();
      })
    }
    else if(event.type.includes('trigger')){
      document.querySelectorAll('.is-editing')?.forEach(i=>{
        i !== this.element && i.classList.remove('is-editing');
        i !== this.element && i.hasAttribute('open') && i.removeAttribute('open');
      });
      this.element.classList.add('is-editing');
      this.element.tagName == 'DETAILS' && this.element.setAttribute('open', 'open');
    }
    this.designMode && this.element.querySelector(`[class="${event.detail?.megaBlock}"]`)?.classList.add('blink');
  }

  removeBlocks(event){
    let nextNode = this.insertTarget.nextSibling;

    while(nextNode){
      let currentNode = nextNode;
      nextNode = nextNode?.nextSibling;

      if(currentNode instanceof Element){
        if(!this.designMode){
          !currentNode.classList.contains('mega-section') && currentNode.remove();
        }
        else if(event.detail?.eventType != 'shopify:block:select'){
          currentNode.remove();
        }
      }
    }
  }

  megaTabEvents(){
    this.querySelectorAll('.js-mega-tab-title')?.forEach(i=>{
      i.addEventListener('mouseenter', e=>{
        this.activeTab(e.target);
      })
    })
  }

  activeTab(selector){
    const tabID = selector?.dataset.tabId || '';
    const tabEl = document.querySelector(`.mega-tab-content[data-tab-id="${tabID}"]`);
    if(!tabEl) return;

    selector.closest('ul').querySelectorAll('.active')?.forEach(active=>active.classList.remove('active'))
    tabEl.closest('ul').querySelectorAll('.active')?.forEach(active=>active.classList.remove('active'))

    selector.classList.add('active');
    tabEl.classList.add('active');
  }
}

customElements.define('mega-dropdown', MegaMenu);

/*
-------------------------------
MEGA MENU TAB
-------------------------------
*/
class MegaTab extends HTMLElement {
  constructor() {
    super();

    this.querySelectorAll('.js-mega-tab-title')?.forEach(item=>{
      item.addEventListener('mouseenter', this.changeTab.bind(this));
      item.addEventListener('trigger:change', this.changeTab.bind(this));
    })


    this.closest('li')?.addEventListener('mouseleave', e=>{
      this.removeActiveTab();
      this.querySelector('.js-mega-tab-title')?.dispatchEvent(new CustomEvent('trigger:change'));
    });
  }
  changeTab(e){
    const element = e.target;
    this.removeActiveTab();

    element.classList.add('active', 'highlight');
    this.querySelector(`.js-mega-tab-content[data-tab-id="${element.dataset.tabId}"]`)?.classList.add('active');
  }

  removeActiveTab(){
    this.querySelectorAll('[data-tab-id].active')?.forEach(i=>i.classList.remove('active', 'highlight'));
  }
}

customElements.define('mega-tab', MegaTab);

