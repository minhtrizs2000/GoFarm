import { gsap } from "gsap";

export default flyToCart = function(node, placementNode){

  document.body.insertAdjacentElement('beforeend', node);

  let miniCart = Array.from(document.querySelectorAll('.js-mini-cart')).find(item=>item.getBoundingClientRect().width > 0);

  miniCart = miniCart || document.querySelector('.js-mini-cart');

  if(!miniCart) return;

  var n = placementNode.getBoundingClientRect().top
  , a = placementNode.getBoundingClientRect().left + placementNode.clientWidth / 2
  , o = miniCart.getBoundingClientRect().top + miniCart.clientHeight / 2 - node.clientHeight / 2
  , i = miniCart.getBoundingClientRect().left + miniCart.clientWidth / 2 - node.clientWidth / 2;

  o < 0 && (o = -node.clientHeight - 10);
  i < 0 && (i = window.innerWidth - 10);

  gsap.timeline({
    defaults: {
      ease: "back.out(1.4)"
    }

  }).fromTo(node, {
    autoAlpha: 1,
    y: n,
    x: a,
    scale: .8

  }, {
    autoAlpha: 1,
    y: o,
    x: i,
    duration: 1

  }).to(node, .5, {
    scale: 1,
    repeat: 1,
    yoyo: !0

  }, 0).to(miniCart, {
    scale: .8,
    repeat: 1,
    yoyo: !0,
    duration: .25,
    onComplete: function() {
      return node.remove();
    }
  })
}