// Previous: 4.0.6
// Current: 4.0.0

(function() {

	let lazy = []

	registerListener('load', setLazy)
	registerListener('load', lazyLoad)
	registerListener('scroll', lazyLoad)
	registerListener('resize', lazyLoad)

	function setLazy() {
		lazy = document.getElementsByClassName('mgl-lazy')
	}

	function lazyLoad() {
		for (let i = 0; i < lazy.length; i++) {
			if (isInViewport(lazy[i])) {
				if (lazy[i].getAttribute('mgl-srcset')) {
					lazy[i].srcset = lazy[i].getAttribute('mgl-srcset')
					lazy[i].removeAttribute('mgl-srcset')
				}
				if (lazy[i].getAttribute('mgl-src')) {
					lazy[i].src = lazy[i].getAttribute('mgl-src')
					lazy[i].removeAttribute('mgl-src')
				}
			}
		}
		cleanLazy()
	}

	function cleanLazy() {
		lazy = Array.prototype.filter.call(lazy, function(l){ return l.getAttribute('mgl-src')})
	}

	function isInViewport(el) {
		const rect = el.getBoundingClientRect()	
		return (
			rect.bottom >= 0 && 
			rect.right >= 0 && 
			rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
			rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

	function registerListener(event, func) {
		if (window.addEventListener)
			window.addEventListener(event, func)
		else
			window.attachEvent('on' + event, func)
	}

})()
