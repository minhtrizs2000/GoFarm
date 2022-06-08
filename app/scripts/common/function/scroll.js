import zenscroll from 'zenscroll';

export default function(selector, duration, offset){
	var duration = duration || 500;
	var offset = offset || 0;
	zenscroll.center(selector, duration, offset);
}
