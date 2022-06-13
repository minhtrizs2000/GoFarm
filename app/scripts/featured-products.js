import { tns } from 'tiny-slider';

register("featured__products", {
    onLoad: function () {
        var slider = tns({
            container: '#featured__slider',
            items: 6,
            slideBy: '1',
            autoplay: true,
            controls: false,
            autoplayButtonOutput: false,
            navPosition: 'bottom',
          });
    }
});
  
load('*');