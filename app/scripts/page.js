import './common/function/map';


register('map-section', {
  onLoad: function(){
    this.container.querySelector('map-section')?.init();
  }
});

load('*');