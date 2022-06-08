import './common/function/fomo-notify';

register('fomo-section', {
	onLoad: function(){
	}
	,onUnload: function(){

		this.container.querySelectorAll('.js-fomo')?.forEach(item=>{
			item.close();
		})
	}
	,onSelect: function(){
	}
	,onDeselect: function(){
	}
	,onBlockSelect: function(e){
		e.target.show();
		this.container.querySelectorAll('.js-fomo')?.forEach(item=>{
			item != e.target && item.close();
		})
	}
	,onBlockDeselect: function(e){

		this.container.querySelectorAll('.js-fomo')?.forEach(item=>{
			item.close();
		})
	}
});

load('*');