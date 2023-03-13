self.oninstall = (event)=>{
	console.log("Hey,I'm installing");
	event.waitUntil(
		caches.open("shell-v1").then(cache=>{
			console.log("Caching");
			return cache.addAll([
				"/",
				"/dist/bundle.js",
				"/store",
				"css/font.css",
				"css/app.css",
				"polyfill/Symbol.js",
				"js/bluebird_mod.min.js",
				"img/Adder.png",
				"img/settings.png",
				"img/ToggleRight.png",
				"img/streamStart.png",
				"img/stream.png",
				"img/love.png",
				"img/favorite.png",
				"img/download.png",
				"img/cat.png",
				"img/next.png",
				"img/prev.png"
				]).catch((e)=>{
					console.log("Something went wrong",e);
				})
		})
	)
}

self.onactive = (event)=>{
	console.log("I'm now active");
}

self.onfetch = (e)=>{
	e.respondWith(
		caches.match(e.request).then((response)=>{
			return response || fetch(e.request);
		})
	)
}