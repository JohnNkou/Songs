exports.documentTree = {
		title: "Mictam",
		metas:[
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			},
			{
				name:'application-name',
				content:'Mictam'
			},
			{
				name:'author',
				content:'Abel Kashoba'
			},
			{
				name:'description',
				content:'Want to share your lyrics with people, or stream your lyrics so other people can see it in real time, Mictam allow you to do just that. You can create your songs, stream them and allow other user to download your lyrics. Dive right in to see'
			}
		],
		links:[
			{
				rel: "icon",
				href: "favicon.png",
				sizes: "16x16",
				type:"image/png"
			},
			{
				rel:'stylesheet',
				href:'/css/app.css',
				type:'text/css'
			},
			{
				rel:'stylesheet',
				href:'/css/font.css',
				type:'text/css'
			}
		],
		scripts:{
			head:
			[
				{
					type:'text/javascript',
					src: '/polyfill/Symbol.js'
				},
				/*{
					type:'text/javascript',
					src:'js/bluebird_mod.min.js'
				},*/
				{
					type:'text/javascript',
					data:`
					if(location.href.indexOf('manifest') == -1){
						
						if(!('serviceWorker' in navigator) && 'applicationCache' in window){
							location.href = '?manifest=true';
						}
					}

					(
						function(){
							if(!Array.isArray)
								Array.isArray = function(item){
									return Object.prototype.toString.call(item) == Object.prototype.toString.call([]);
								}
						}
					)();
					`
				}
			],
			tail:
			[
				{
					src:'/dist/bundle.js',
					type: 'text/javascript'
				}

			]
		}
	}