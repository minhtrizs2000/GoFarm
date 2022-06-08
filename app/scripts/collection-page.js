import './common/function/collection-filter';
import './common/function/collection-view';
import './common/function/infinite-loading';
import collectionPaginate from './common/function/collection-paginate';

register('collection-page', {
  onLoad: function(){

    const arrayItems = ['.js-filter-btn', '.js-collection-sort', '.js-select-sort'];

    arrayItems.forEach(selector=>{

      this.container.querySelector(selector)?.addEventListener('click', e=>{
        selector == '.js-filter-btn' && e.preventDefault();

        let template = document.querySelector('template#collectionFilter');
        if(template){
          template.replaceWith(template.content.firstElementChild);
        }

        if(selector == '.js-filter-btn'){
          document.querySelector('collection-filter')?.toggle();
        }
      })
      
    })

    this.container.querySelector('.js-sidebar-close')?.addEventListener('click', e=>{
      const sidebar = e.target.closest('#sidebar.active');
      sidebar?.classList.remove('active');
    })
    
    var paginate = document.querySelector('.js-collection-paginate');
    if(paginate){
      this.paginate = new collectionPaginate(paginate);
    }
  }

  ,onUnload: function(){
    this.container.querySelector('collection-view')?.setAttribute(null);
    this.paginate?.setAttribute(null);
  }
});

load('*');