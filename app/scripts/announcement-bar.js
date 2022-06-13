import './common/theme-section';
import $ from "jquery";

register("announcement", {
    onLoad: function () {
        $(".announcement-bar__close").click(function(){
              $(this).parent().css( "display", "none" );
        });
    }
  });
  
load('*');