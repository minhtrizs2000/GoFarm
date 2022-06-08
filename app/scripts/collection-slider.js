import "./common/theme-section";
import { tns } from "../../node_modules/tiny-slider/src/tiny-slider";
import $ from "jquery";

register("collection-tiny-slider", {
    onLoad: function () {
      var slider = tns({
        container: ".collection-slider",
        items: 4,
        mouseDrag: true,
        gutter: 20,
        controlsContainer: ".tiny-slider-control",
        prevButton: ".tiny-slider-btn-prev",
        nextButton: ".tiny-slider-btn-next",
        responsive: {
          1600: {
            items: 4,
          },
          1200: {
            items: 3,
          },
          768:  {
            items: 2,
          },
          576:  {
            items: 1,
            controls: true,
            nav: false,
          },
          300: {
            items: 1,
            controls: false,
          } 
        }
      })
  
      document.addEventListener("DOMContentLoaded", function() {
        (function addIconBeforeDesc(){
          $(".card-slider__content p").prepend('<i class="fa-solid fa-check"></i>');
        })();
      });
  
      // window.addEventListener('resize', function(){
      //   var maxWidth = window.innerWidth - 196;
      //   if (window.innerWidth > 992 && window.innerWidth < 1200) {
      //     maxWidth = window.innerWidth - 236;
      //   } else if (window.innerWidth > 576 && window.innerWidth < 768) {
      //     maxWidth = window.innerWidth - 276;
      //   }
      //   $(".collection-container").css('max-width', maxWidth + 'px');
      // });
    }
  });
  
  load('*');