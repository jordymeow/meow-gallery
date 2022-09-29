// Previous: 4.2.3
// Current: 4.2.7

(function() {

	let lazy = []

	registerListener('load', setLazy)
	registerListener('load', lazyLoad)
	registerListener('scroll', lazyLoad)
	registerListener('resize', lazyLoad)

	window.addEventListener('load', () => {

		if (document.querySelector('.mgl-gallery.mgl-horizontal')) {
			document.querySelectorAll('.mgl-gallery.mgl-horizontal').forEach(gallery => {
				const galleryTrack = gallery.querySelector('.meow-horizontal-track')

				galleryTrack.addEventListener('scroll', () => {
					lazyLoad()
				})
			})
		}

		document.body.addEventListener('post-load', () => {
			setLazy()
			lazyLoad()
		})
	})

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
		const buffer = parseInt(mgl_settings?.infinite_buffer || 0)
		const rect = el.getBoundingClientRect()
		const innerHeight = (window.innerHeight || document.documentElement.clientHeight) + buffer
		const innerWidth = (window.innerWidth || document.documentElement.clientWidth)
		return (rect.bottom >= 0 && rect.right >= 0 && rect.top <= innerHeight && rect.left <= innerWidth)
	}

	function registerListener(event, func) {
		if (window.addEventListener)
			window.addEventListener(event, func)
		else
			window.attachEvent('on' + event, func)
	}

})()
