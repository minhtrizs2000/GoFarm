import { tns } from 'tiny-slider';

register("featured-products", {
    onLoad: function () {
        var slider = tns({
            container: '.featured__slider',
            items: 1,
            slideBy: 'page',
            autoplay: true
          });
    }
});
  
load('*');