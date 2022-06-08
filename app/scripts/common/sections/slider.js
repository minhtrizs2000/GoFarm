export default SectionSlider = {
  onLoad: function(){
    this.slideArray = [];
    this.container.querySelectorAll('slider-component')?.forEach(slide=>{
      slide.load();
      this.slideArray.push(slide);
    })
  }
  ,onUnload: function(){
  }
  ,onSelect: function(){
  }
  ,onDeselect: function(){
  }
  ,onBlockSelect: function(e){
  }
  ,onBlockDeselect: function(e){
  }
};