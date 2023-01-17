import { step, curry, tA, helpWithCoordinate} from './BrowserDb.cjs'
import Text from './Text.cjs'
import { setSelector, setControl, setForceUpdate, changeIndex, changeStreamCreateView,changeSongIncrement, changeCatView, changeAddSongView, changeCatListView, changeFavListView, changeStreamListView, changeResultListView, changeNightMode, changeSettingListView } from './aCreator.cjs'

function checkDbSupport(){
	return window.openDatabase || window.indexedDB || null;
}

function revertAction(action){
	let oldProcess = action.doProcess();
	let oldText = action.getText();
	let oldTitle = action.getTitle();
	let oldClearer = action.getClearer();

	let problematics = [()=>{
		action.addProcess(oldProcess);
		action.addText("");
		action.addText(oldText);
		action.addTitle(oldTitle);
		action.addClearer(oldClearer);
	}];
	action.addToStore({problematics});
}

function toOriginalState(initials){
	let state;
	while(state = initials.pop()){
		if(state.length == 3)
			state[0][state[1]] = state[2];
		else if(state.length == 4)
			state[0][state[1]][state[2]] = state[3];
		else
			throw Error("toOriginalState state: state length not anticipated");
	}
}

function actionHasReset(action,clear=true){
	if(action.getReset()){
		triggerCleaner(action,clear);
		action.reset(false);

		return true;
	}

	return false;
}

const originalBorder = function(){
	if(window.navigator.userAgent.indexOf('MSIE') != -1)
		return originalBackground;
	else{
		return (initial,nodes)=>{
			if(!nodes.pop || (typeof nodes.pop != "function"))
				nodes = [nodes];

			nodes.forEach((node)=>{
				initial.push([node,'style','border',getComputedStyle(node).border])
			})
			return initial[initial.length-1][3];
		}
	}
}();
/*
function originalBorder(initial,nodes){
	if(!nodes.pop || (typeof nodes.pop != "function"))
		nodes = [nodes];

	nodes.forEach((node)=> {
		initial.push([node,'style','border',getComputedStyle(node).border])
	})
	return initial[initial.length -1][3];
} */
function originalBackground(initial,nodes){
	if(!nodes.pop)
		nodes = [nodes];

	nodes.forEach((node)=> initial.push([node,'style','backgroundColor',getComputedStyle(node).backgroundColor]));

	return initial[initial.length -1][3];
}

function moveToBottom(div1,div2,action){
	return new Promise((resolve,reject)=>{
		let { coordi1, coordi2 } = helpWithCoordinate(div1,div2), trace = 0;

		let c2Height = coordi2.top + coordi2.height;

		if(coordi1.top < c2Height){
			action.addToStore({coordi1:{...coordi1},coordi2:{...coordi2}});
			
			let r1 = window.innerHeight - (c2Height);
			
			let c11 = setInterval(()=>{
				div1.style.top = ++coordi1.top + "%";

				if(coordi1.top >= c2Height){
					clearInterval(c11);
					trace--;

					if(!trace)
						resolve(true);
				}
			},10);
			trace++;

			if(coordi1.height > r1){
				let c22= setInterval(()=>{
					div1.style.top = --coordi1.height + "%";

					if(coordi1.height <= r1){
						clearInterval(c22);
						trace--;

						if(!trace)
							resolve(true);
					}
				},10)
				trace++;
			}
		}
		else
			resolve(true);
	})
}

function moveToOriginalPosition(div1,div2,coord){
	return new Promise((resolve,reject)=>{
		let { coordi1, coordi2 } = helpWithCoordinate(div1,div2), trace=0;

		if(coord.coordi1){
			let coord1 = coord.coordi1, pos = ["left","right","top","height"],i=0,trace=0;

			for(;i < pos.length; i++){
				let currentPos = pos[i];

				if(coord1[currentPos] != coordi1[currentPos]){
					let diff = (coordi1[currentPos] > coord1[currentPos])? -1:1;
					let c1 = setInterval(()=>{
						coordi1[currentPos] = coordi1[currentPos] + diff;
						div1.style[currentPos] = coordi1[currentPos] + "%";

						if(coordi1[currentPos] == coord1[currentPos]){
							clearInterval(c1);
							trace--;

							if(!trace)
								resolve(true);
						}
					})

					trace++;
				}
			}
		}
		else
			resolve(true);
	})
}
function originalDisabled(initial,nodes){
	if(!nodes.pop)
		nodes = [nodes];

	nodes.forEach((node)=> initial.push([node,'disabled',false]))

	return initial[initial.length -1][3];
}
function originalValue(initial,nodes){
	if(!nodes.pop)
		nodes = [nodes];

	nodes.forEach((node)=> initial.push([node,'value','']))
}
function animateBackground(nodes,c){
	if(!nodes.pop)
		nodes = [nodes];
	let second = (nodes.length > 10)? 80: 40;
	nodes.slice(0,20).forEach((node)=>{
		let n = 0;
		animate(()=>{
			node.style.backgroundColor = `rgba(0,255,0,${Math.max(0.1, (n++ % 11)/ 10)})`
		},second,c);
		
	})
	return c;
}
const animateBorder = function(){
	if(window.navigator.userAgent.indexOf('MSIE') != -1){
		return animateBackground;
	}
	else
		return (nodes)=>{
			if(!nodes.pop)
				nodes = [nodes];
			let c = [];
			let second = (nodes.length > 10)? 80: 40;
			nodes.slice(0,20).forEach((node)=>{
				let n = 0;
				animate(()=>{
					node.style.border = `1px solid rgba(0,255,0,${Math.max(0.1,(n++ % 11)/ 10)})`
				},second,c);
			})

			return c;
		}
}();

const animate = function(){
	if(window.requestAnimationFrame){
		return function(t,s,counters){
			let last;
			let Frame = function(time){
				if(!last){
					last = time;
					t();
				}
				else{
					if(time - last > s){
						last = time;
						t();
					}
				}
				counters.push(requestAnimationFrame(Frame));
				counters.shift();
			}

			counters.push(requestAnimationFrame(Frame));
		}
	}
	else{
		return function(t,s,counters){
			counters.push(setInterval(t,s));
		}
	}
}()

function addListener(l,nodes,type,fn){
	if(!nodes.pop)
		nodes = [nodes];

	nodes.forEach((node)=>{
		node.addEventListener(type,node.fn = fn,false);
		l.push([node,type,node]);
	})

	return l.length;
}

const clearCounters = function(){
	if(window.requestAnimationFrame){
		return (counters)=>{
			let cnt;
			while(cnt = counters.pop()){
				cancelAnimationFrame(cnt);
			}
		}
	}
	else{
		return (counters)=>{
			let cnt;
			while(cnt = counters.pop())
				clearInterval(cnt);
		}
	}
}();
/*function clearCounters(counters){
	let cnt;
	
	while(cnt = counters.pop())
		clearInterval(cnt);

}*/
function removeListeners(listeners){
	let listener;

	while(listener = listeners.pop()){
		listener[0].removeEventListener(listener[1],listener[2].fn,false)
		delete listener[2].fn;
	}
}
function Unsubscriber(subscribers){
	let unsubscribe;

	while(unsubscribe = subscribers.pop())
		unsubscribe();
}
function clearProblems(problems){
	let problem;

	while(problem = problems.pop())
		problem();

}
function clearPreviousAction(actions){
	let action;
	while(action = actions.pop())
		action.getClearer()();
}
function dispatchReverser(actions){
	let action;
	while(action = actions.pop()){
		action[0].dispatch(action[1](action[2]));
	}
}
function triggerCleaner(action,clear=true){
	let { initialState, counters, listeners, actionsReverser, subscribers, problematics, previousActions } = action.getStore();
	softCleaner(initialState, counters, listeners, actionsReverser, subscribers, problematics, previousActions);

	if(clear)
		action.clearStore();
}
function softCleaner(initials, counters, listeners, actionsReverser, subscribers,  problematics, previousActions){
	if(initials)
		toOriginalState(initials)
	if(counters)
		clearCounters(counters)
	if(listeners)
		removeListeners(listeners)
	if(subscribers)
		Unsubscriber(subscribers);
	if(actionsReverser)
		dispatchReverser(actionsReverser);
	if(problematics)
		clearProblems(problematics);
	if(previousActions)
		clearPreviousAction(previousActions);
}
function meticulus(selector,payload){
	window.mountNotifier[selector] = [payload];
}

export function stepManager(store,Text){
	
	function forceUpdate(node,value){
		store.dispatch(setForceUpdate({node,value}));
	}
	function updateSelector(selector,value){
		store.dispatch(setSelector({selector,value}))
	}
	function withVerseShowing(){
		return store.getState().selector.withVerse;
	}

	const Ms = new step().addStep().addStep().addStep().addStep().addStep();
	Ms.addTitle((lang="en")=>{
		return (lang.toLowerCase() == "en")? "Welcome":"Bienvenu";
	});

	const Ms_s1 = Ms.section;
	Ms_s1.addTitle((lang="En")=>{
		return "Presentation";
	});
	Ms_s1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "This tutoriel will guide across some of the fonctionnalities of the app. And Believe me, there are many.":"Ce tutoriel vous aidera à decouvrir toute les fonctionnalités presenté par l'application, et croyez moi il y en a plusieur",
		(lang="en")=> (lang.toLowerCase() == "en")? "Each tutorial is made of step, and each step of sections.": "Chaque tutoriel est constitué des etapes, et chaque etapes est constitués de sections",
		(lang="en")=> (lang.toLowerCase() == "en")? "In the bottom, you'll find step navigation which will allow you to go to the next or previous step" : "Les navigations d'etapes situé en bas de la fenetre du tutoriel vous permettrons d'aller vers l'etapes suivante ou precedentes",
		(lang="en")=> (lang.toLowerCase() == "en")? "In each step with many section in it, you'll find navigations link. They will be located at the top": "Pour chaque etapes contenant plusieurs sections, des liens de navigations des etapes seront pourvu en haut du tutoriel"
	]);	

	const Ms2 = Ms.nextStep;
	Ms2.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? 'Category':'Categorie'
	);

	const Ms2_s1 = Ms2.section.addSection().addSection();
	Ms2_s1.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Listing" : "Affichage"
		);

	Ms2_s1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "All of the songs in the app are grouped in categories":"Les differentes chansons de l'application sont regroupé par categorie."
		]);

	const Ms2_s1_a1 = Ms2_s1.action.addAction();
	Ms2_s1_a1.addText(
		(lang="en")=> (lang.toLowerCase() == "en")? "To see all of the available categories, click in the blinking section at the top of the app":"Pour afficher les categories disponible veuillez cliquer la section clignotante en haut à gauche de la page"
		);
	Ms2_s1_a1.addAnchor([".head .c1"]);
	Ms2_s1_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms2_s1_a1;
				let catCliquer = document.querySelector(anchor[0]).firstElementChild;
				let counters = [];
				let listeners = [];
				let initialState = [];

				animateBackground(catCliquer,counters);
				originalBackground(initialState,catCliquer);
				addListener(listeners,catCliquer,'click',(event)=>{
					event.preventDefault();
					action.getClearer()();
					meticulus("catNames",()=> resolve(true));
				});

				action.addToStore({ initialState, counters, listeners});
			}
			if(store.getState().ui.show.catList){
				store.dispatch(changeCatListView(false));
				meticulus("catNames",settings);
			}
			else
				settings();
		})
	})
	Ms2_s1_a1.addClearer((anchor)=>{
		let action = Ms2_s1_a1;
		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms2_s1_a2 = Ms2_s1_a1.nextAction;
	Ms2_s1_a2.addAnchor([".catNames"])
	Ms2_s1_a2.addTitle("");
	Ms2_s1_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll see a list of the available categories":"Vous verez apparaitre la liste des categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can also add your own category" :"Vous avez egalement la possibilité d'ajouter une categorie"
		]);
	Ms2_s1_a2.addClearer((anchor)=>{
		if(store.getState().ui.show.catList)
			store.dispatch(changeCatListView(false));

		return Promise.resolve(true);
	})

	const Ms2_s2 = Ms2_s1.nextSection;
	Ms2_s2.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Add a Category":"Ajouter une Categorie"
		);
	Ms2_s2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You can also add your own categorie":"Vous avez egalement la possibilité d'ajouter vos propres categorie"
		]);

	const Ms2_s2_a1 = Ms2_s2.action.addAction().addAction();
	Ms2_s2_a1.addAnchor([".catNames","addCatButton"]);
	Ms2_s2_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To add a categorie, click on the blinking section":"Pour ajouter une categorie veuillez cliquer sur la section clignotante"
		]);
	Ms2_s2_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms2_s2_a1;
			let settings = ()=>{
				let catLists = document.querySelector(anchor[0]);
				let clicker = document.getElementById(anchor[1]).querySelector("a");
				let counters = []; //= [];
				let listeners = [];
				let initialState = [];
				let actionsReverser = [[store,changeCatListView,false]];

				originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				addListener(listeners,clicker,'click',()=>{
					action.getClearer()();
					meticulus('addCatDiv',()=> resolve(true));
				})

				action.addToStore({initialState, counters, listeners, actionsReverser});
			}

			if(!store.getState().ui.show.catList){
				store.dispatch(changeCatListView(true));
				meticulus('catNames',settings);
			}
			else
				settings();
		})
	})
	Ms2_s2_a1.addClearer((anchor)=>{
		let action = Ms2_s2_a1;
		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms2_s2_a2 = Ms2_s2_a1.nextAction;
	Ms2_s2_a2.addTitle("");
	Ms2_s2_a2.addAnchor(["main","addCat",".message span", ".popUp"]);
	Ms2_s2_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll see the create category form appear":"Vous verez apparaitre le  formulaire de creation de categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "Enter the categorie name in the blinking input":"Entrer un le nom de la categorie que vous vouler créer dans le champs de texte clignotant",
		(lang="en")=> (lang.toLowerCase() == "en")? "Then click on Add":"Ensuite cliquer sur ajouter"
		]);
	Ms2_s2_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let addCatDiv = document.getElementById(anchor[1]);
			let mainDiv = document.getElementById(anchor[0]);
			let input = addCatDiv.querySelector("input");
			let add = addCatDiv.querySelector(".add");
			let close = addCatDiv.querySelector(".close");
			let message = addCatDiv.querySelector(anchor[2]);
			let popUpDiv = document.querySelector(anchor[3]);
			let action = Ms2_s2_a2;
			let counters = [];
			let initialState = [];
			let listeners = [];
			let actionsReverser = [[store,changeCatView,false]];

			action.addToStore({ counters, initialState, actionsReverser});

			function disableButton(){
				add.disabled = true;
				close.disabled = true;
			}
			disableButton();

			originalDisabled(initialState,[close,add]);
			let inputBorder = originalBackground(initialState,input);
			let addBorder = originalBackground(initialState,add);
			popUpDiv.className = popUpDiv.className.split(" ").filter((x)=> x != "blur").join(" ");

			function originalGame(){
				let i = initialState.filter((x)=> (x[1] == 'disabled')? false:true);
				toOriginalState(i);
				inputBorder = originalBackground(initialState,input);
				addBorder = originalBackground(initialState,add);

			}

			function handleInput(){
				animateBackground(input,counters);
				input.oninput = function(event){
					event.preventDefault();
					if(input.value.length){
						clearCounters(counters);
						originalGame();
						handleAdder();
					}
				}
			}
			function handleAdder(){
				add.disabled = false;
				input.oninput = null;
				animateBackground(add,counters);
				add.onclick = function(event){
					event.preventDefault();
					clearCounters(counters);
					originalGame();
					if(input.value.length){
						let lang = store.getState().language;
						meticulus('addCatDiv',()=>{
							if(message.textContent.trim() != Text.addCatDiv.message.success(lang)){
								handleInput();
								disableButton();
							}
							else{
								add.onclick = null;
								if(!store.getState().ui.show.catList)
									store.dispatch(changeCatListView(true));

								action.addToStore({actionsReverser:[[{dispatch:()=>{}},()=>{},null]]});
								triggerCleaner(action,false);
								action.addToStore({actionsReverser});
								meticulus('catNames',()=>{
									action.nextAction.addToStore({catName:input.value.trim().toLowerCase()});
									resolve(true);
								})
							}
						})
					}
					else{
						disableButton();
						handleInput();
					}
				}
			}

			if(!store.getState().ui.show.addCatDiv){
				store.dispatch(changeCatView(true));
				meticulus('addCatDiv',()=>{
					handleInput();
				})
			}
			else
				handleInput();

			let { coordi1, coordi2 } = helpWithCoordinate(mainDiv,popUpDiv);

			if((coordi1.left <= coordi2.left && (coordi1.left + coordi1.width) > coordi2.left) || (coordi1.left > coordi2.left && coordi1.left < (coordi2.left + coordi2.width))){

				action.addToStore({coordi1:{...coordi1}, coordi2:{...coordi2}});

				let r1 = 100 - coordi1.left - coordi1.width ;
				let r2 = 100 - coordi2.left - coordi2.width;

				let c1 = setInterval(()=>{
					mainDiv.style.left = ++coordi1.left + "%";
					if((coordi1.left + coordi1.width) == 100)
						mainDiv.style.width = --coordi1.width + "%";
					
					if(coordi1.left >= (coordi2.left + coordi2.width+1))
						clearInterval(c1);	
				},10)
				if(r2 < 40){
					if((r2 + coordi2.left) >= 40){
						let c = setInterval(()=>{
							popUpDiv.style.left = --coordi2.left + "%";
							r2++;
							if(r2 == 40)
								clearInterval(c);
						},10)
					}
					else{
						let c = setInterval(()=>{
							popUpdDiv.style.left = --coordi2.left + "%";
							popUpdDiv.style.width = --coordi2.width + "%";
							r2 = r2 + 2;
							if(r2 >= 40)
								clearInterval(c);
						},10)
					}
				}
			}
		})
	})

	Ms2_s2_a2.addClearer((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms2_s2_a2;
			let mainDiv = document.getElementById(anchor[0]);
			let popUpDiv = document.querySelector(anchor[3]);

			if(actionHasReset(action,false)){
				return Promise.resolve(true);
			}

			let { coordi1, coordi2 } = action.getStore();
			triggerCleaner(action);

			let coord = helpWithCoordinate(mainDiv,popUpDiv);

			let l1 = (coordi1.left > coord.coordi1.left)? 1:-1;
			let w1 = (coordi1.width > coord.coordi1.width)? 1:-1;
			let l2 = (coordi2.left > coord.coordi2.left)? 1:-1;
			let w2 = (coordi2.width > coord.coordi2.width)? 1:-1;

			let counter = 0;

			if(coordi1.left != coord.coordi1.left){
				counter++;
				let c1 = setInterval(()=>{
					coord.coordi1.left = coord.coordi1.left + l1;
					mainDiv.style.left = coord.coordi1.left + "%";
					if(coordi1.left == coord.coordi1.left){
						clearInterval(c1);
						if(!(--counter))
							resolve(true);
					}
				},10)
			}
			if(coordi1.width != coord.coordi1.width){
				counter++;
				let c1 = setInterval(()=>{
					coord.coordi1.width = coord.coordi1.width + w1;
					mainDiv.style.width = coord.coordi1.width + "%";
					if(coordi1.width == coord.coordi1.width){
						clearInterval(c1);
						if(!(--counter))
							resolve(true);
					}
				},10)
			}
			if(coordi2.left != coord.coordi2.left){
				counter++;
				let c1 = setInterval(()=>{
					coord.coordi2.left = coord.coordi2.left + l2;
					popUpDiv.style.left = coord.coordi2.left + "%";
					if(coordi2.left == coord.coordi2.left){
						clearInterval(c1);
						if(!(--counter))
							resolve(true);
					}
				},10)
			}
			if(coordi2.width != coord.coordi2.width){
				counter++;
				let c1 = setInterval(()=>{
					coord.coordi2.width = coord.coordi2.width + w2;
					popUpDiv.style.width = coord.coordi2.width + "%";
					if(coordi2.width == coord.coordi2.width){
						clearInterval(c1);
						if(!(--counter))
							resolve(true)
					}
				},10)
			}
		})
	})

	const Ms2_s2_a3 =  Ms2_s2_a2.nextAction;
	Ms2_s2_a3.addTitle("");
	Ms2_s2_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You have created your own category":"Felicitation, vous avez reussit à creer une categorie.",
		(lang="en")=> (lang.toLowerCase() == "en")? "Your created category will be seen in the categories listing":"La categorie que vous avez crée sera afficher dans la liste de categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can proceed to the next section":"Vous pouvez passer à la section suivante"
		]);
	Ms2_s2_a3.addAnchor([".catNames"]);
	Ms2_s2_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms2_s2_a3;
				let catList = document.querySelector(anchor[0]);
				let lastElement = document.querySelector(`${anchor[0]} .${action.getStore().catName}`);
				let counters = [];// = [];
				let initialState = [];

				originalBackground(initialState,lastElement);
				animateBackground(lastElement,counters);

				action.addToStore({initialState, counters});

			}

			if(!store.getState().ui.show.catList){
				store.dispatch(changeCatListView(true))
				meticulus('catNames',settings);
			}
			else
				settings();
		})
	})
	Ms2_s2_a3.addClearer((anchor)=>{
		let action = Ms2_s2_a3;

		if(actionHasReset(action,false))
			return Promise.resolve(true);

		triggerCleaner(action);
		return action.prevAction.getClearer()()
	})

	const Ms2_s3 = Ms2_s2.nextSection;
	Ms2_s3.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Save a category":"Enregistrer une categorie"
	);
	Ms2_s3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You can also save your categories in you computer. That will allow you to access your songs even without an internet connection":"Vous avez egalement la possibilité d'enregistrer vos categories sur votre machine. Cela vous permettra d'avoir accès à vos chansons sans que vous ayez une connexion internet"
		]);

	const Ms2_s3_a1 = Ms2_s3.action.addAction();
	Ms2_s3_a1.addAnchor([".head .downloader",".head .downloader img"]);
	Ms2_s3_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To do an offline saving of your category, click on the blinking image just near every category":"Pour enregistrer localement votre categorie, veuillez cliquer sur l'image clignante juste à coté de chaque categorie"
		]);
	Ms2_s3_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms2_s3_a1;
				let clickers = tA(document.querySelectorAll(anchor[0]),"forEach","map","slice");
				let imgs = document.querySelectorAll(anchor[1]);
				let initialState = [];
				let counters = []; //= [];
				let listeners = [];
				let actionsReverser = [[store,changeCatListView,false]];

				if(!checkDbSupport()){
					revertAction(action);
					action.addTitle("");
					action.addText([
						(lang="en")=> (lang.toLowerCase() == "en")? "We're sorry to inform you that your browser can't do offline saving":"Nous somme desolé de vous informer que votre navigateur ne dispose pas des fonctionnalités pour enregistrer localement vos categorie", 
						(lang="en")=> (lang.toLowerCase() == "en")? "Please, Go to the next section":"Veuillez passer à la section suivante"]);
					action.addProcess(()=>{
						return new Promise((resolve,reject)=>{

						})
					});

					return resolve({updateText:true});
				}

				if(imgs.length){
					try{
						originalBackground(initialState,clickers);
						animateBackground(clickers,counters);
						addListener(listeners,clickers,'click',(event)=>{
							event.preventDefault();
							action.getClearer()();
							resolve(true);
						});

						action.addToStore({initialState,counters, listeners});
					}
					catch(e){
						alert(e);
					}
				}
				else{
					let { updateText } = action.getStore();
					if(!updateText){
						revertAction(action);
						action.addText("");
						action.addText([
							(lang="en")=> (lang.toLowerCase() == "en")? "Oh, It seem's you've already save all the category":"Oh, il semble que vous avez dejà enregistré toute les categorie",
							(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next step":"Veuillez donc passer à l'etape suivant"]);
						action.addTitle(
							(lang="en")=> (lang.toLowerCase() == "en")? "Category already saved":"Categorie dejà enregistré"
							);
						action.addToStore({updateText:true});
						resolve({updateText:true});
					}
				}
			}

			if(store.getState().ui.show.catList)
				settings();
			else{
				store.dispatch(changeCatListView(true));
				meticulus('catNames',settings);
			}
		})
	})
	Ms2_s3_a1.addClearer((anchor)=>{
		let action = Ms2_s3_a1;
		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms2_s3_a2 = Ms2_s3_a1.nextAction;
	Ms2_s3_a2.addTitle("");
	Ms2_s3_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've succed in saving a category":"Felicitation, vous avez reussit à enregistrer localement une categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can access it even without an internet connection":"Vous pourez ainsi y acceder quand vous n'aurez pas de connection",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next step":"Veuillez passer à l'etape suivante"]);

	const Ms3 = Ms2.nextStep;
	Ms3.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Songs":"Chansons"
		);

	const Ms3_s1 = Ms3.section.addSection().addSection().addSection();
	Ms3_s1.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Listing":"Affichage"
		);

	const Ms3_s1_a1 = Ms3_s1.action.addAction().addAction();
	Ms3_s1_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To see the available songs, you'll have to choose a category":"Pour afficher les chants disponibles veuillez selectionner une la categorie clignotante"
		]);
	Ms3_s1_a1.addAnchor([".catNames"]);
	Ms3_s1_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms3_s1_a1,
				cantiqueDiv,
				{ Categories, onlineSongs,offlineSongs } = store.getState(),
				i = 0, onSongs, offSongs, catName;

				while(catName = Categories[i]){
					onSongs = onlineSongs[i];
					offSongs = offlineSongs[i++];
					if((onSongs && onSongs.length) || (offSongs && offSongs.length)){
						cantiqueDiv = document.querySelector(`${anchor[0]} .${catName}`);
						break;
					}

				}

				if(!cantiqueDiv){
					revertAction(action);
					action.addTitle("");
					action.addText([
						(lang="en")=> (lang.toLowerCase() == "en")?"This category has no song":"Cette categorie n'a aucune chanson"
						]);
					action.addProcess(()=>{
						return new Promise((resolve,reject)=>{})
					})
					return resolve({updateText:true});
				}
				//let cantiqueDiv = catList[1];
				let clicker = cantiqueDiv.querySelector("a");
				let counters = []; //= [];
				let initialState = [];
				let listeners = [];
				let actionsReverser = [[store,changeCatListView,false]];
				let oldCurrentCatName = store.getState().currentCat.name;

				originalBackground(initialState,cantiqueDiv);
				//counters.push(...animateBackground(cantiqueDiv));
				animateBackground(cantiqueDiv,counters);
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();
					action.getClearer()();
					if(oldCurrentCatName != store.getState().currentCat.name){
						meticulus('songList',()=> resolve(true));
					}
					else
						resolve(true);
				})

				action.addToStore({counters, initialState, listeners, actionsReverser});
			}

			if(store.getState().ui.show.catList)
				settings();
			else{
				store.dispatch(changeCatListView(true));
				meticulus('catNames',settings);
			}
		})
	})
	Ms3_s1_a1.addClearer((anchor)=>{
		let action = Ms3_s1_a1;
		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms3_s1_a2 = Ms3_s1_a1.nextAction;
	Ms3_s1_a2.addTitle("");
	Ms3_s1_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Each category songs are grouped in panel":"Les chansons de chaque categorie sont groupé en deux volet:",
		(lang="en")=> (lang.toLowerCase() == "en")? "Online et offline": "En ligne et Hors ligne",
		(lang="en")=> (lang.toLowerCase() == "en")? "The online pannel has not locally saved songs and the offline panel has saved songs":"Le vollet online contient les chansons que vous n'avez pas encore enregistré localement, et le volet offline contient les chants enregistrés localement",
		(lang="en")=> (lang.toLowerCase() == "en")? "Next to each panel, there is a number representing the number of song":"A coté de chaque volet, il y a un nombre qui indique le nombre de chanson",
		(lang="en")=> (lang.toLowerCase() == "en")? "Click on the blinking panel to display it songs":"Cliquer sur le volet clignotant pour afficher les chansons"
		]);
	Ms3_s1_a2.addAnchor(["online","onLink","#online .list","offline","offLink","#offline .list"]);
	Ms3_s1_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s1_a2;

			let state = store.getState(),
			Categories = state.Categories,
			onSongs = state.onlineSongs,
			offSongs = state.offlineSongs,
			onlineSongs,
			offlineSongs,
			nodeToWait,
			i = 0;

			while(Categories[i]){
				if(onSongs[i] && onSongs[i].length){
					onlineSongs = true;
					break;
				}
				if(offSongs[i] && offSongs[i].length){
					offlineSongs = true;
					break;
				}
				i++;
			}

			if(!onlineSongs && !offlineSongs){

				let previousActions = [];

				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "This category has no song":"Cette categorie ne dispose d'aucune chanson",
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, choose another category":"veuillez selectionner une autre categorie"]);
				action.addProcess(()=>{
					return action.prevAction.doProcess()().then((r)=>{
						return action.getClearer()().then(()=> action.doProcess()())
					})
				})
				
				previousActions.push(action.prevAction);
				action.addToStore({previousActions});

				return resolve({updateText:true});

			}

			if(offlineSongs)
				anchor = anchor.slice(3);

			nodeToWait = anchor[0];

			let onlineDiv = document.getElementById(anchor[0]);
			let onlineLink = document.getElementById(anchor[1]);
			let songList = document.querySelector(anchor[2]);
			let counters = []; //= [];
			let initialState = [];
			let listeners = [];

			if(songList){
				action.nextAction.addToStore({location:`#${anchor[0]}`});
				resolve(true);
			}
			else{
				originalBackground(initialState,onlineLink);
				//counters.push(...animateBackground(onlineLink))
				animateBackground(onlineLink,counters);
				addListener(listeners,onlineLink,'click',(event)=>{
					event.preventDefault();
					action.getClearer()();
					action.nextAction.addToStore({location:`#${anchor[0]}`});
					meticulus(nodeToWait,()=> resolve(true));
				});
				action.addToStore({initialState, counters, listeners, location});
			}
		})
	}) 
	Ms3_s1_a2.addClearer((anchor)=>{
		let action = Ms3_s1_a2;

		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms3_s1_a3 = Ms3_s1_a2.nextAction;
	Ms3_s1_a3.addAnchor([".list","main"]);
	Ms3_s1_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To show a song content, click on one of the blinking song":"Pour afficher le contenu d'une chanson, cliquer sur une chanson clignotante"
		]);
	Ms3_s1_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s1_a3;
			let { location } = action.getStore();
			let songs;
			let songListDiv = document.querySelector(`${location} ${anchor[0]}`); 
			if(songListDiv){
				songs = tA(songListDiv.children,'slice','forEach').slice((/^#off/i.test(location)? 1:0),10);
			}
			if(!songs){
				let previousActions = [];
				revertAction(action);
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, choose a song":"Veuillez selectionner une chanson"
					]);
				action.addProcess(()=>{
					function doUntil(){
						return action.prevAction.doProcess()().then((r)=>{
							if(r.updateText)
								return doUntil();
							else
								return true;
						})
					}

					return doUntil().then((r)=>{
						triggerCleaner(action,false);
						return action.doProcess()();
					})
				})
				previousActions.push(action.prevAction);
				action.addToStore({previousActions});

				return resolve({updateText:true});
				
			}
			else{
				let oldCurrentSongName = store.getState().currentSong.name;
				let oldCurrentCatName = store.getState().currentCat.name;
				let counters = []; //= [];
				let listeners = [];
				let initialState = [];
				let problematics = [()=> forceUpdate('content',false)];
				let mainDiv = document.getElementById(anchor[1]);

				originalBackground(initialState,songs);
				//counters.push(...animateBackground(songs,true));
				animateBackground(songs,counters);

				addListener(listeners,songListDiv,'click',(event)=>{
					try{
						action.getClearer()().then(resolve);
						meticulus('content',()=>{
							action.getClearer()().then(resolve);
						})
						forceUpdate('content',true);
					}
					catch(e){
						alert("Bob");
					}
				})

				let { coordi1, coordi2 } = helpWithCoordinate(mainDiv,songListDiv);

				action.addToStore({counters, initialState,listeners, problematics, coordi1:{...coordi1}, coordi2:{...coordi2} });

				if(coordi1.left < (coordi2.left + coordi2.width)){
					let r = (coordi2.left + coordi2.width) - coordi1.left;

					let c = setInterval(()=>{
						mainDiv.style.left = ++coordi1.left + "%";
						if(!(--r))
							clearInterval(c);
					},10)
				}
			}
		})
	})
	Ms3_s1_a3.addClearer((anchor)=>{
		let action = Ms3_s1_a3;
		let mainDiv = document.getElementById(anchor[1]);
		let { coordi1 } = action.getStore();
		let coord = helpWithCoordinate(mainDiv).coordi1;


		triggerCleaner(action,false);

		return new Promise((resolve,reject)=>{
			if(!coordi1)
				return resolve(true);
			let count = 2;

			if(coordi1.left != coord.left){
				let s1 = (coord.left > coordi1.left)? -1:1;
				let c1 = setInterval(()=>{
					coord.left = coord.left + s1;
					mainDiv.style.left = coord.left + "%";

					if(coord.left == coordi1.left){
						clearInterval(c1);
						if(!(--count))
							resolve(true);
					}
				},10)
			}
			else{
				--count;
			}

			if(coordi1.width != coord.width){
				let s2 = (coord.width > coordi1.width)? -1:1;
				let c2 = setInterval(()=>{
					coord.width = coord.width + s2;
					mainDiv.style.width = coord.width + "%";

					if(coord.width == coordi1.width){
						clearInterval(c2);
						if(!(--count))
							resolve(true);
					}
				},10)
			}
			else
				--count;

			if(!count)
				resolve(true);
		});
	})

	const Ms3_s2 = Ms3_s1.nextSection;
	Ms3_s2.addTitle(()=>"Navigation");
	Ms3_s2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Once the song content is displayed, many navigations options are offered to you, that will allow you to go to verses":"Le contenu de la chanson etant affiché, plusieurs options de navigations s'offrent à vous pour vous rendre vers diffenretes strophes",
		(lang="en")=> (lang.toLowerCase() == "en")? "We'll beging with arrow navigation":"Nous allons commencer par la navigation de chant avec les boutons fleches"]);

	const Ms3_s2_a1 = Ms3_s2.action.addAction().addAction();
	Ms3_s2_a1.addAnchor([".nextSong","second","main"]);
	Ms3_s2_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Please, click the blinking button, in the bottom of the verses to go to the next Verse":"Veuillez cliquer sur le button clignotant juste en bas de la strophe affiché pour aller vers la strophe suivante"
		]);
	Ms3_s2_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = (nextArrow)=>{
				let action = Ms3_s2_a1;
				let counters = []; //= [];
				let listeners = [];
				let initialState = [];
				let secondDiv = document.getElementById(anchor[1]);
				let mainDiv = document.getElementById(anchor[2]);

				originalBackground(initialState,nextArrow);
				//counters.push(...animateBackground(nextArrow));
				animateBackground(nextArrow,counters);
				addListener(listeners,nextArrow,'click',(event)=>{
					event.preventDefault();
					triggerCleaner(action,false);
					meticulus('content',()=> resolve(true));
				})


				let {coordi1, coordi2 } = helpWithCoordinate(mainDiv,secondDiv);

				action.addToStore({counters, listeners, initialState, coordi1:{...coordi1}, coordi2:{...coordi2}});

				if((coordi1.left <= coordi2.left && (coordi1.left + coordi1.width) > coordi2.left) ||  (coordi1.left > coordi2.left && coordi1.left < (coordi2.left + coordi2.width))){
					let r1 = 100 - coordi2.width;

					let c1 = setInterval(()=>{
						mainDiv.style.left = --coordi1.left + "%";
						if(!coordi1.left)
							clearInterval(c1);
					},10)

					if(r1 < coordi1.width){
						let c2 = setInterval(()=>{
							mainDiv.style.width = --coordi1.width + "%";

							if(coordi1.width == r1)
								clearInterval(c2);
						},10)
					}
				}
			}
			function testIfNextArrowNull(){
				let { currentSong, ui } = store.getState();
				if(!currentSong.name){
					let prevAction = Ms3_s1_a3;
					revertAction(action);
					action.addTitle("");
					action.addText(prevAction.getText());
					action.addProcess(()=>{
						function doUntil(){
							return Ms3_s1_a3.doProcess()().then((r)=>{
								if(r.updateText)
									return doUntil();
								else
									return {success:true}
							})
						}

						return doUntil().then((r)=>{
							action.getClearer()();
							return {updateText:true};
						})

					})
					let previousActions = [prevAction];
					action.addToStore({previousActions});

					return resolve({updateText:true});
				}
				if(currentSong.Verses && currentSong.Verses.length > 1){
					let nextArrow = document.querySelector(anchor[0]);
					let Lenon = "Marka";
					if(ui.navigation.VerseIndex != currentSong.Verses.length -1)
						/*return*/ settings(nextArrow);
					else{
						store.dispatch(changeIndex(0));
						meticulus('content',()=> {
							nextArrow = document.querySelector(anchor[0]);
							settings(nextArrow)
						});
						//return;
					}
				}
				else{
					let previousActions = [];

					revertAction(action);
					action.addTitle("");
					action.addText([
						(lang="en")=> (lang.toLowerCase() == "en")? "This song a one verse":"Cette chanson n'a qu'une seule trophe", 
						(lang="en")=> (lang.toLowerCase() == "en")? "Please, choose another song":"veuillez choisir une autre chanson"]);


					action.addProcess(()=>{

						function doUntil(){
							return Ms3_s1_a3.doProcess()().then((r)=>{
								if(r.updateText)
									return doUntil();
								else
									return {success:true};
							})
						}
						return doUntil().then((r)=>{
							action.getClearer()();
							return {updateText:true};
						})
					})

					previousActions.push(Ms3_s1_a3);
					action.addToStore({previousActions});

					return resolve({updateText:true});
				}
				
			}

			testIfNextArrowNull();
		})
	})
	Ms3_s2_a1.addClearer((anchor)=>{
		let action = Ms3_s2_a1;

		if(actionHasReset(action)){
			return Promise.resolve(true);
		}

		return Ms3_s1_a3.getClearer()().then((r)=>{
			let { coordi1 } = action.getStore();
			let mainDiv = document.getElementById(anchor[2]);
			let coord = helpWithCoordinate(mainDiv).coordi1;
			let c = 0;

			triggerCleaner(action);

			return new Promise((resolve,reject)=>{
				if(coordi1.left != coord.left){
					let diff = (coord.left > coordi1.left)? -1:1;
					c++;

					let counter = setInterval(()=>{
						coord.left = coord.left + diff;
						mainDiv.style.left = `${coord.left}%`;

						if(coord.left == coordi1.left){
							clearInterval(counter);
							c--;

							if(!c)
								resolve(true);
						}
					},10);
				}

				if(coordi1.width != coord.width){
					let diff = (coord.width > coordi1.width)? -1:1;
					c++;

					let counter = setInterval(()=>{
						coord.width = coord.width + diff;
						mainDiv.style.width = `${coord.width}%`;

						if(coord.width == coordi1.width){
							clearInterval(counter);
							c--;

							if(!c)
								resolve(true);
						}
					},10);
				}

				if(!c)
					resolve(true);
			})
		})
	})

	const Ms3_s2_a2 = Ms3_s2_a1.nextAction;
	Ms3_s2_a2.addAnchor([".prevSong"]);
	Ms3_s2_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To go to the previous verse, click on the blinking back arrow button":"Pour aller vers une strophe precedente, veuillez cliquer sur le button de retour clignotant, juste en bas de la strophe courante"
		]);
	Ms3_s2_a2.addTitle("");
	Ms3_s2_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s2_a2;
			let prevArrow = document.querySelector(anchor[0]);
			let counters = [];  //= [];
			let initialState = [];
			let listeners = [];

			originalBackground(initialState,prevArrow)
			animateBackground(prevArrow,counters);
			addListener(listeners,prevArrow,'click',(event)=>{
				event.preventDefault();
				triggerCleaner(action);
				meticulus('content',()=> resolve(true));
			})

			action.addToStore({ listeners,counters, initialState });
		})
	})
	Ms3_s2_a2.addClearer((anchor)=>{
		let action = Ms3_s2_a2;

		if(actionHasReset(action))
			return Promise.resolve(true);

		return action.prevAction.getClearer()().then((r)=>{
			triggerCleaner(action);
			return true;
		})
	})

	const Ms3_s2_a3 = Ms3_s2_a2.nextAction;
	Ms3_s2_a3.addAnchor(["#navHelper div"]);
	Ms3_s2_a3.addTitle("");
	Ms3_s2_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "The app also allow you to go to the verse of your choice, but using the numbered navigation":"L'application met egalement à votre disposition une navigation numeroté, pour vous rendre directement vers la strophe souhaité",
		(lang="en")=> (lang.toLowerCase() == "en")? "To go to the verse of your choice, click on the blinking number at the extrem right of the display":"Pour aller vers n'importe quel strophe veuillez cliquer sur les numeros clignotant à l'extreme droite de l'application"]);
	Ms3_s2_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s2_a3;
			let navNumber = tA(document.querySelectorAll(anchor[0]),"filter","forEach").filter((n)=> n.className.indexOf('bHighlight') == -1);
			let counters = []; //= [];
			let listeners = [];
			let initialState = [];
			let problematics = [()=>{
				navNumber.forEach((div)=>{
					div.style.backgroundColor = "";
				})
			}];

			originalBackground(initialState,navNumber);
			animateBackground(navNumber,counters);
			addListener(listeners,navNumber,'click',(event)=>{
				event.preventDefault();
				action.getClearer()();
				meticulus('content',()=> resolve(true));
			})

			action.addToStore({counters,initialState,listeners, problematics});
		})
	})
	Ms3_s2_a3.addClearer((anchor)=>{
		let action = Ms3_s2_a3;

		if(actionHasReset(action))
			return Promise.resolve(true);

		return action.prevAction.getClearer()().then((r)=>{
			triggerCleaner(action);
			return true;
		})
	})

	const Ms3_s3 = Ms3_s2.nextSection;
	Ms3_s3.addTitle((lang)=>"Favoris");
	Ms3_s3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Sometime, It'll happen that you'll have a need to access a loved song quickly":"Parfois il arrive que vous aimer une chanson, vous avez donc besoin d'y acceder rapidement.",
		(lang="en")=> (lang.toLowerCase() == "en")? "To access quickly a loved song you can put the song in the favorite section":	"Pour acceder rapidement à certaine chanson vous pouvez tagger votre application comme favori",
		(lang="en")=> (lang.toLowerCase() == "en")? "All the songs in the favorites section can be quickly access by clicking in the favorite section":	"Les chansons taggé comme favoris seront facilement accessible en cliquant sur l'icone de favoris", 
		(lang="en")=> (lang.toLowerCase() == "en")? "When a song is not in the favorite section, a heart like icon just near the song name will have a brown color":"Lorsque une chanson n'est pas taggé comme favoris, l'icone de coeur juste à coté du titre de la chanson aura une coleur jaune",
		(lang="en")=> (lang.toLowerCase() == "en")? "When a song is put in the favorie section, a heart like icon just near the song name will a have a blue color":	"Lorsque une chanson est taggé comme favoris, l'icone deviendra bleu"]);

	const Ms3_s3_a1 = Ms3_s3.action.addAction().addAction().addAction();
	Ms3_s3_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To put a song in the favorites sections, click in the heart like icon near the song name":	"Pour mettre une chanson sous favoris veuillez cliquer sur la petite icone de coeur clignotante juste à coté du nom de la chanson.(Soyez sur que la chansons n'est pas encore taggé comme favoris)"
		])
	Ms3_s3_a1.addAnchor([".imFavorite","#online .list","#offline .list"]);
	Ms3_s3_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let state = store.getState();
			let {currentCat, currentSong, favorites, Categories,ui, onlineSongs, offlineSongs} = state,
			to = ui.navigation.to,
			catId = currentCat.id,
			catOnSongs,
			catOffSongs,
			catName = currentCat.name,
			songName = currentSong.name;

			function goBack(){
				let previousActions = [];

				let onlineSongLength = document.querySelector(anchor[1]) && document.querySelector(anchor[1]).children.length;
				if(onlineSongLength){
					action.addProcess(()=>{
						let location = anchor[1].split(" ")[0];
						Ms3_s1_a3.addToStore({location});
						return Ms3_s1_a3.doProcess()().then((r)=>{
							triggerCleaner(action);
							return {updateText:true};
						})
					})
					previousActions.push(Ms3_s1_a3);

					action.addToStore({previousActions});

					resolve({updateText:true});
					return;
				}
				else{
					let offlineSongLength = document.querySelector(anchor[2]) && document.querySelector(anchor[2]).children.length;

					if(offlineSongLength){
						action.addProcess(()=>{
							let location = anchor[2].split(" ")[0];
							Ms3_s1_a3.addToStore({location});
							
							return Ms3_s1_a3.doProcess()().then((r)=>{
								triggerCleaner(action);
								return {updateText:true};
							})
						})
						previousActions.push(Ms3_s1_a3);

						action.addToStore({previousActions});

						resolve({updateText:true})
						return true;
					}
					else{
						catOnSongs = onlineSongs[catId];
						catOffSongs = offlineSongs[catId];

						let catHasSongs = Categories[catId] && ((catOnSongs && catOnSongs.length) || (catOffSongs && catOffSongs.length));
						if(catHasSongs){
							action.addProcess(()=>{
								return Ms3_s1_a2.doProcess()().then((r)=>{
									triggerCleaner(action);
									return {updateText:true};
								})
							})

							previousActions.push(Ms3_s1_a2);
							action.addToStore({previousActions});
							resolve({updateText:true});
							return true;
						}
						else{
							action.addProcess(()=>{
								return Ms3_s1_a1.doProcess()().then((r)=>{
									return Ms3_s1_a2.doProcess()().then((r)=>{
										return Ms3_s1_a3.doProcess()().then((r)=>{
											triggerCleaner(action);
											return {updateText:true};
										})
									})
										})
							})

							previousActions.push(Ms3_s1_a1);

							action.addToStore({previousActions});

							resolve({updateText:true});
							return true;

						}

					}
				}

			}
			if(favorites[catName] && favorites[catName][songName]){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "This song is already in the favorites section":	"Cette chanson est dejà enregistré sous favoris",
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, choose another song":	"Veuillez selectionner une autre chanson"
					]);

				return goBack();

			}
			else if(!songName){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, choose a song":"Veuillez selectionner une chanson"
					]);
				return goBack();
			}
			else{

				let action = Ms3_s3_a1;
				let clicker = document.querySelector(anchor[0]);
				let counters = []; //= [];
				let initialState = [];
				let listeners = [];

				originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();
					action.getClearer()();
					meticulus('content',()=> resolve(true));
				})

				action.addToStore({counters, initialState, listeners});
			}
		})
	})
	Ms3_s3_a1.addClearer((anchor)=>{
		let action = Ms3_s3_a1;
		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms3_s3_a2 = Ms3_s3_a1.nextAction;
	Ms3_s3_a2.addAnchor(["favLink"]);
	Ms3_s3_a2.addTitle("");
	Ms3_s3_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, you've put a song in the favorites section":"Felicitation, vous avez ajouter une chanson dans les favoris",
		(lang="en")=> (lang.toLowerCase() == "en")? "To acces the favorites section, click in the blinking start icon just above the page":"Pour y acceder à vos favoris cliquer sur la grande icone favoris clignotante en haut de la page"
		]);
	Ms3_s3_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s3_a2;
			let favLink = document.getElementById(anchor[0]);
			let counters = [];//= [];
			let listeners = [];
			let initialState = [];

			originalBackground(initialState,favLink);
			animateBackground(favLink,counters);
			addListener(listeners,favLink,'click',(event)=>{
				event.preventDefault();
				action.getClearer()();
				meticulus('favorite', ()=> resolve(true));
			})

			action.addToStore({counters,listeners,initialState});
		})
	})
	Ms3_s3_a2.addClearer((anchor)=>{
		let action = Ms3_s3_a2;
		triggerCleaner(action);

		return Promise.resolve(true);
	})

	const Ms3_s3_a3 = Ms3_s3_a2.nextAction;
	Ms3_s3_a3.addAnchor([".imFavorite"]);
	Ms3_s3_a3.addTitle("");
	Ms3_s3_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll see a list of your favorites song appear":"Vous verez apparaitre la liste de vos favoris",
		(lang="en")=> (lang.toLowerCase() == "en")? "To remove a song in the favorite section, click on the blinking heart like icon just near the song name":"Pour enlever une chansons de la liste de favoris, cliquer sur l'icone de coeur bleu clignotante juste à coté du nom de la chanon"
		]);
	Ms3_s3_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s3_a3;
			let clicker = document.querySelector(anchor[0]);
			let counters = []; //= [];
			let listeners = [];
			let initialState = [];

			originalBackground(initialState,clicker);
			animateBackground(clicker,counters);
			addListener(listeners,clicker,'click',(event)=>{
				event.preventDefault();
				action.getClearer()();
				meticulus('favorite',()=> resolve(true));
			})
			action.addToStore({counters, listeners, initialState });
			
		})
	})
	Ms3_s3_a3.addClearer((anchor)=>{
		let action = Ms3_s3_a3;
		triggerCleaner(action);

		return Promise.resolve(true);
	})

	const Ms3_s3_a4 = Ms3_s3_a3.nextAction;
	Ms3_s3_a4.addTitle("");
	Ms3_s3_a4.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've finish the favorite tutorial":"Felicitation, vous avez finit le tutoriel sur les favoris",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next Section":"Veuillez passer à la section suivante"
		]);
	Ms3_s3_a4.addClearer((anchor)=>{
		return Promise.resolve(true);
	})

	const Ms3_s4 = Ms3_s3.nextSection;
	Ms3_s4.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Save a song":"Enregistrer une chanson"
		);
	Ms3_s4.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "The app give you the possibility to save your song on your computer":"L'application vous donne egalement la possibilité d'enregistrer vos chansons localement"
		])

	const Ms3_s4_a1= Ms3_s4.action.addAction().addAction();
	Ms3_s4_a1.addAnchor(["#online .list .downloader","#online .list","main"]);
	Ms3_s4_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To save your song locally, click in one the blinking icons":"Pour enregistrer vos chansons localement veuillez cliquer sur l'une des icones clignotante"
		]);
	Ms3_s4_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s4_a1;
			let { currentCat,Categories, onlineSongs, offlineSongs } = store.getState(),
			catId = currentCat,id,
			onCatSongs = onlineSongs[catId],
			offCatSongs = offlineSongs[catId],
			songList =  document.querySelector(anchor[1]),
			i = 0,
			catName;

			if(!checkDbSupport()){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "We're sorry to inform you that your browser can't do offline saving ":"Nous somme desolé de vous informer que votre navigation ne dispose pas des fonctionnalités pour nous permettre d'enregistrer localement vos chansons"," Veuillez passer à l'etape suivante"
					]);
				action.addProcess(()=> new Promise((resolve)=> {}));

				return resolve({updateText:true});
			}

			if(!songList){
				revertAction(action);
				let previousActions = [];
				action.addTitle("");
				if(onCatSongs && onCatSongs.length){
					action.addText([
						(lang="en")=> (lang.toLowerCase() == "en")? "Click, in the blinking section to see song that can be saved locally":"Veuillez cliquer sur la section clignotante pour afficher les chants sauvegardables"
						]);
					action.addProcess(()=>{
						function doUntil(){
							return Ms3_s1_a2.doProcess()().then((r)=>{
								if(r.updateText)
									return doUntil();
								return true;
							})
						}

						return doUntil().then((r)=>{
							action.getClearer()();
							return action.doProcess()();
						})
					})

					previousActions.push(Ms3_s1_a2);

					action.addToStore({previousActions});

					return resolve({updateText:true});
					
				}
				else{
					if(offCatSongs && offCatSongs.length){
						action.addText([
							(lang="en")=> (lang.toLowerCase() == "en")? "Oh, You've alreay saved all the song of this category":"Vous avez dejà sauvegardé tout le chant de cette categorie",
							(lang="en")=> (lang.toLowerCase() == "en")? "You can, go to the next step":"Veuillez passer à l'etape suivante"]);
						action.addProcess(()=>{
							return new Promise((resolve,reject)=>{
								action.getClearer()();
							})
						})
						resolve({updateText:true});
					}
					else{

						let hasDownloadAll = true;

						while(Categories[i]){
							if(onlineSongs[i++].length){
								hasDownloadAll = false;
								break;
							}
						}
						

						if(hasDownloadAll){
							action.addText([
								(lang="en")=> (lang.toLowerCase() == "en")? "Oh, We see that you've already saved all the songs of this category":"Oh, nous constatons que vous avez dejà sauvegardé tous les chans de toutes les categories",
								(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next step":"Veuillez donc passer à l'étape suivante"]);
							action.addProcess(()=>{
								return new Promise((resolve,reject)=>{
									action.getClearer()();
								})
							})

							return resolve({updateText:true});
						}
						else{
							action.addText([
								(lang="en")=> (lang.toLowerCase() == "en")? "This category has no song that can be saved locally":"Cette categorie ne dispose pas de chant sauvegardables",
								(lang="en")=> (lang.toLowerCase() == "en")? "Please, choose another category":"Veuillez choisir une autre categorie"]);

							action.addProcess(()=>{
								function doUntil(){
									return Ms3_s1_a1.doProcess()().then((r)=>{
										if(r.updateText)
											return doUntil();
										return true;
									})
								}

								return doUntil().then((r)=>{
									let previousActions = [];
									action.getClearer()();
									revertAction(action);
									action.addTitle("");
									action.addText([
										(lang="en")=> (lang.toLowerCase() == "en")? "Choosing online":"Selectionner En line"
										]);
									action.addProcess(()=>{
										function doUntil(){
											return Ms3_s1_a2.doProcess()().then((r)=>{
												if(r.updateText)
													return doUntil();
												return true;
											})
										}

										return doUntil().then((r)=>{
											action.getClearer()();

											return {updateText:true};
										})
									})

									previousActions.push(Ms3_s1_a2);

									action.addToStore({previousActions});

									return {updateText:true};
								})
							})

							previousActions.push(Ms2_s1_a1);

							action.addToStore({previousActions});

							resolve({updateText:true});
						}

					}
				}
			}
			else{
				let clickers = tA(document.querySelectorAll(anchor[0]),"slice","forEach").slice(0,10);
				let listeners = [];
				let counters = []; //= [];
				let initialState = [];
				let mainDiv = document.getElementById(anchor[2]);

				if(clickers.length){
					originalBackground(initialState,clickers);
					animateBackground(clickers,counters);
					addListener(listeners,clickers,'click',(event)=>{
						event.preventDefault();
						action.getClearer()();
						resolve(true);
					})

					let { coordi1, coordi2 } = helpWithCoordinate(mainDiv, songList);

					action.addToStore({counters, listeners, initialState, coordi1: {...coordi1}, coordi2:{...coordi2}});

					if(coordi1.left < (coordi2.left + coordi2.width)){
						let r = (coordi2.left + coordi2.width) - coordi1.left;

						let c = setInterval(()=>{
							mainDiv.style.left = ++coordi1.left + "%";
							if(!(--r))
								clearInterval(c);
						},10)
					}
				}
				else
					resolve(true);
			}
		})
	})
	Ms3_s4_a1.addClearer((anchor)=>{
		let action = Ms3_s4_a1;
		let mainDiv = document.getElementById(anchor[2]);
		let { coordi1 } = action.getStore();
		let coord = helpWithCoordinate(mainDiv).coordi1;

		triggerCleaner(action);
		
		return new Promise((resolve)=>{
			if(!coordi1)
				return resolve(true);

			if(coordi1.left != coord.left){
				let dif = (coord.left > coordi1.left)? -1:1
				let c = setInterval(()=>{
					coord.left = coord.left + dif;
					mainDiv.style.left = coord.left + "%";

					if(coord.left == coordi1.left)
						clearInterval(c);
				},10)
			}
			else
				resolve(true);
		})

	})

	const Ms3_s4_a2 = Ms3_s4_a1.nextAction;
	Ms3_s4_a2.addTitle("");
	Ms3_s4_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've locally saved a song":"Felicitation, vous avez enregistré une chanson",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can also save all the song of a category. To do that you'll just have to click in the blinking downloading icon just near the online panel":"Vous avez egalement la possibilité d'enregistrer toute les chansons d'une categorie. Pour cela il vous suffira de cliquer sur l'icone de telechargement clignotante juste à coté de En ligne",
		(lang="en")=> (lang.toLowerCase() == "en")? "If you don't want to download all the song, you can go to the next step":"Vous pouvez egalement passer à l'etape suivante si vous ne souhaiter pas telecharger toute les categorie."])
	Ms3_s4_a2.addAnchor([".onlineHead .downloader"])
	Ms3_s4_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms3_s4_a2;
			let clicker = document.querySelector(anchor[0]);
			if(clicker){
				let listeners = [];
				let counters = []; //= [];
				let initialState = [];

				originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();
					resolve(true);
				})

				action.addToStore({counters, listeners, initialState });
			}
			else{
				resolve(true);
			}
		})
	})
	Ms3_s4_a2.addClearer((anchor)=>{
		let action = Ms3_s4_a2;
		triggerCleaner(action);

		return Promise.resolve(true);
	})

	const Ms3_s4_a3 = Ms3_s4_a2.nextAction;
	Ms3_s4_a3.addTitle("");
	Ms3_s4_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You have saved all the song of this category":"Felicitation vous avez enregistré toute les chansons de cette categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next step":"Vous pouvez passer à l'etape suivante"]);
	Ms3_s4_a3.addClearer(()=>{
		return Promise.resolve(true);
	})

	const Ms4 = Ms3.nextStep;
	Ms4.addTitle(
		(lang)=> "Stream"
		);

	const Ms4_s1 = Ms4.section.addSection().addSection();
	Ms4_s1.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Create a stream":"Créer un stream"
		);
	Ms4_s1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "A stream allow other user the possibility":"Un stream est une fonctionnalités qui donne aux autres utilisateur la possibilité et bref"
		]);

	const Ms4_s1_a1 = Ms4_s1.action.addAction().addAction().addAction();
	Ms4_s1_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To create your stream, you can click in the blinking section at the top of the page":"Pour creer votre stream veuillez cliquer sur la section clignotante"
		]);
	Ms4_s1_a1.addAnchor([".streamCreation a",".streamCreation img"]);;
	Ms4_s1_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let createStreamImg = document.querySelector(anchor[1]);
			let settings = ()=>{
				let action = Ms4_s1_a1;
				let clicker = document.querySelector(anchor[0]);
				let counters = []; //= [];
				let initialState = [];
				let listeners = [];

				originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();
					action.getClearer()();

					meticulus('createStream',()=> resolve(true));
				})

				action.addToStore({counters, listeners, initialState});

			}

			if((createStreamImg.src.indexOf(store.getState().images.streamCreate.stop)) != -1){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "Oh, it look like there is already a stream going on":"Oh, il semble que vous avez dejà un stream en cours",
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, go to the next step":"Veuillez passer à la section suivante"]);
				action.addProcess(()=>{
					return new Promise((resolve,reject)=>{

					})
				});

				resolve({updateText:true});
			}
			else
				settings();
		})
	})
	Ms4_s1_a1.addClearer((anchor)=>{
		let action = Ms4_s1_a1;

		triggerCleaner(action);

		return Promise.resolve(true);
	})

	const Ms4_s1_a2 = Ms4_s1_a1.nextAction;
	Ms4_s1_a2.addTitle("");
	Ms4_s1_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Enter a name in the input section, then click on create":"Entrer un nom dans le champ de texte, ensuite cliquer sur creer"
		]);
	Ms4_s1_a2.addAnchor([".createStream input",".createStream .add",".createStream .close",".createStream .message","main",".createStream"]);
	Ms4_s1_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms4_s1_a2;
			let input = document.querySelector(anchor[0]);
			let addButton = document.querySelector(anchor[1]);
			let closeButton = document.querySelector(anchor[2]);
			let mainDiv = document.getElementById(anchor[4]);
			let createStreamDiv = document.querySelector(anchor[5]);
			let counters = []; // = [];
			let initialState = [];
			let listeners = [];
			let actionsReverser = [[store,changeStreamCreateView,false]];
			let problematics = [()=>{
				let close = document.querySelector(anchor[2]);
				if(close)
					close.click();
			}]

			let inputBorder = originalBackground(initialState,input);
			let addButtonBorder = originalBackground(initialState,addButton);

			function disable(){
				addButton.disabled = true;
				closeButton.disabled = true;
			}

			function originalGame(){
				if(initialState.length){
					let i = initialState;
					i = i.filter((x)=> (x.length == 3 && x[1] == 'disabled')? false:true);
					toOriginalState(i);
					/*inputBorder = originalBackground(initialState,input);
					addButtonBorder = originalBackground(initialState,addButton); */
				}

			}

			function handleInput(){
				disable();
				originalGame();
				animateBackground(input,counters);
				action.addToStore({counters});

				input.oninput = (event)=>{
					event.preventDefault();
					if(input.value.length){
						clearCounters(counters);
						originalGame();
						handleCreate();
					}
				}
			}

			function handleCreate(){
				addButton.disabled = false;
				animateBackground(addButton,counters);
				action.addToStore({counters});

				addButton.onclick = (event)=>{
					event.preventDefault();
					meticulus('createStream',()=>{
						let message = document.querySelector(anchor[3]);
						let { language } = store.getState();

						if(message.textContent){
							if(message.textContent.trim() != Text.createStreamDiv.message.streamCreated(language)){
								clearCounters(counters);
								originalGame();
								handleInput();
							}
							else{

								action.getClearer()();
								resolve(true);
							}
						}
					})
				}
			}

			let settings = ()=>{

				if(!store.getState().ui.show.createStreamDiv){
					meticulus('createStream',settings);
					store.dispatch(changeStreamCreateView(true));
				}
				else{
					originalDisabled(initialState,[addButton,closeButton]);

					handleInput();
					let { coordi1, coordi2 } = helpWithCoordinate(mainDiv, createStreamDiv);

					action.addToStore({ counters, listeners, initialState,actionsReverser, problematics });

					if((coordi1.top <= coordi2.top && (coordi1.top + coordi1.height > coordi2.top)) || (coordi1.top > coordi2.top && (coordi1.top < coordi2.top + coordi2.height))){
						action.addToStore({coordi1:{...coordi1}, coordi2:{...coordi2}})

						let h1 = 100 - coordi2.height;

						if(h1 >= 40){
							if(coordi1.height > h1){
								let c1 = setInterval(()=>{
									mainDiv.style.height = --coordi1.height + "%";

									if(coordi1.height == h1)
										clearInterval(c1);
								},10)
							}

							if(coordi1.top < coordi2.top + coordi2.height){
								let c1 = setInterval(()=>{
									mainDiv.style.top = ++coordi1.top + "%";

									if(coordi1.top > coordi2.top + coordi2.height)
										clearInterval(c1);
								},10)
							}
						}
					}
				}

			}

			if(!input && closeButton){
				closeButton.click();
				meticulus('createStream',settings);
			}
			else
				settings();

		})
	})
	Ms4_s1_a2.addClearer((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms4_s1_a2;

			if(actionHasReset(action,false))
				return resolve(true);

			let mainDiv = document.getElementById(anchor[4]);
			let coord = helpWithCoordinate(mainDiv).coordi1;
			let { coordi1 } = action.getStore();

			triggerCleaner(action);

			let count = 2;
			let dif1 = coord.top > coordi1.top ? -1:1
			let dif2 = coord.height > coordi1.height ? -1:1

			if(coord.top != coordi1.top){
				let c1 = setInterval(()=>{
					coord.top = coord.top + dif1;
					mainDiv.style.top = coord.top + "%";

					if(coord.top == coordi1.top){
						clearInterval(c1);
						if(!(--count))
							resolve(true);
					}
				},10)
			}
			else
				--count;

			if(coord.height != coordi1.height){
				let c2 = setInterval(()=>{
					coord.height = coord.height + dif1;
					mainDiv.style.height = coord.height + "%";

					if(coord.height == coordi1.height){
						clearInterval(c2);
						if(!(--count))
							resolve(true);
					}
				},10)
			}
			else
				--count;

			if(!count)
				resolve(true);
		})
	})

	const Ms4_s1_a3 = Ms4_s1_a2.nextAction;
	Ms4_s1_a3.addTitle("");
	Ms4_s1_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've created a stream":"Felecitation vous avez crée un stream",
		(lang="en")=> (lang.toLowerCase() == "en")? "To stop a stream, click in the same link that you use before":"Pour arreter votre stream veuillez cliquer sur le meme lien que vous avez cliquer pour afficher le formulaire de creation du stream"
		]);
	Ms4_s1_a3.addAnchor([".streamCreation a"]);
	Ms4_s1_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms4_s1_a3;
			let clicker = document.querySelector(anchor[0]);
			let counters = []; // = [];
			let initialState = [];
			let listeners = [];

			originalBackground(initialState,clicker);
			animateBackground(clicker,counters);
			addListener(listeners,clicker,'click',(event)=>{
				event.preventDefault();

				meticulus('streamCreation',()=>{
					action.getClearer()();
					resolve(true);
				})
			})

			action.addToStore({counters, listeners, initialState});
		})
	})
	Ms4_s1_a3.addClearer(()=>{
		let action = Ms4_s1_a3;
		triggerCleaner(action);

		return Promise.resolve(true);
	})

	const Ms4_s1_a4 = Ms4_s1_a3.nextAction;
	Ms4_s1_a4.addTitle("");
	Ms4_s1_a4.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You're done with the tutorial about the stream":"Felecitation, vous avez finit le tutoriel sur le stream.",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next section":"Veuillez passer à la section suivante"]);
	Ms4_s1_a4.addClearer((anchor)=>{
		return action.prevAction.getClearer()().then(()=> true);
	})

	const Ms4_s2 = Ms4_s1.nextSection;
	Ms4_s2.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "List of streams":'Afficher la liste des streams'
		);
	Ms4_s2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Once a stream is created, the stream will appear in the on going stream list":"Lorsque vous créer un stream, le stream sera affiché dans la liste des streams en cours",
		(lang="en")=> (lang.toLowerCase() == "en")? "However, the creator of the stream will not see it stream in the list of streams":"Toutefois, le createur du stream ne pourra pas voir son stream dans la liste"]);

	const Ms4_s2_a1 = Ms4_s2.action.addAction();
	Ms4_s2_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To display the list of stream, you'll have to click in the blinking section at the head of the page":"Pour afficher la liste des streams il vous suffira de cliquer sur la section clignotante en haut de la page"
		]);
	Ms4_s2_a1.addAnchor([".streamList .streamListLink",".streamList .counter"]);
	Ms4_s2_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms4_s2_a1;
				let clicker = document.querySelector(anchor[0]);
				let counters = []; //= [];
				let listeners = [];
				let initialState = [];

				let clickerB = originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();
					meticulus('streamList',()=>{
						action.getClearer()();
						let streamCount = document.querySelector(anchor[1]).textContent;
						if(parseInt(streamCount)){
							resolve(true);
						}
						else{
							revertAction(action);
							action.addTitle("");
							action.addText([
								(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You have succed in displaying the list of streams":"Felicitation, vous avez pu afficher la liste des streams",
								(lang="en")=> (lang.toLowerCase() == "en")? "Althoug, there is no ongoing stream we'll show you next how to subsribe to a stream":"Bien qu'il n'y a aucun stream disponible nous vous montrerons dans la suite comment souscrire à un stream",
								(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next section":"Veuillez passer à la section suivante"]);
							action.addProcess(()=>{
								return new Promise((resolve,reject)=>{

								})
							})
							resolve({updateText:true});
						}
					})

				})

				action.addToStore({counters,listeners,initialState});
			}

			if(store.getState().ui.show.streamList){
				store.dispatch(changeStreamListView(false))
				meticulus('streamList',settings);
			}
			else
				settings();
		})
	})

	Ms4_s2_a1.addClearer((anchor)=>{
		let action = Ms4_s2_a1;

		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms4_s2_a2 = Ms4_s2_a1.nextAction;
	Ms4_s2_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've succeded in displaying the list of streams":"Felicitation, vous avez pu afficher la liste des streams",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next section":"Veuillez passer à la section suivante"])
	Ms4_s2_a2.addClearer(()=>{
		return Promise.resolve(true);
	})

	const Ms4_s3 = Ms4_s2.nextSection;
	Ms4_s3.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Subscribe to a stream":"Souscrire à un stream"
		);

	const Ms4_s3_a1 = Ms4_s3.action.addAction().addAction().addAction();
	Ms4_s3_a1.addAnchor([".streamList .streamListLink",".streamList .counter"])
	Ms4_s3_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll have to be carefull in this section. You'll need two tab or two open browser":"Cette section requiert un peu plus de delicatesse. Pour correctement suivre les procedures du tutoriels vous devez créer une autre fenetre de navigation, ou soit vous pouvez vous connecter à l'application avec un autre dispositif"
		]);
	Ms4_s3_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms4_s3_a1;

			if(store.getState().isStreaming){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "To subscribe to a stream you'll have to stop your on going stream":"Pour souscrire à un stream vous devez stopper votre propre stream en cours",
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, click in the blinking section to stop your stream":"Veuillez cliquer sur la section clignotante pour stopper votre stream"]);
				action.addProcess(()=>{
					return Ms4_s1_a3.doProcess()().then((r)=>{
						return action.getClearer()().then((r)=>{
							return {updateText:true};
						});
						
					})
				});
				return resolve({updateText:true});
			}

			let streamCount = document.querySelector(anchor[1]).textContent;

			if(!parseInt(streamCount)){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "To subscribe to a stream you'll have to create a stream in another browser":"Pour souscrire à un stream veuillez créer un stream dans la fenetre de navigation qui vous avez créer ou dans le dispositif connecté à l'application"
					])
				action.addProcess(()=>{
					return new Promise((resolve,reject)=>{
						let { problematics } = action.getStore();
						function doUntil(){
							return new Promise((resolve,reject)=>{
								if(doUntil.stop)
									return resolve(false);

								meticulus('streamList',()=>{
									let count = document.querySelector(anchor[1]).textContent;
									if(doUntil.stop)
										return resolve(false);
									if(parseInt(count))
										return resolve(true);
									return doUntil().then(resolve);
								})
							})
						}
						doUntil().then((r)=>{
							if(r){
								action.getClearer()();
								resolve(true);
							}
						})
						problematics.push(()=>{
							doUntil.stop = true;
						});

						action.addToStore({problematics});
					})
				})

				resolve({updateText:true});
			}
			else{
				resolve(true);
			}
		})
	})
	Ms4_s3_a1.addClearer((anchor)=>{
		let action = Ms4_s3_a1;
		triggerCleaner(action);
		return Ms4_s1_a3.getClearer()().then(()=> true)
		//return Promise.resolve(true);
	})

	const Ms4_s3_a2 = Ms4_s3_a1.nextAction;
	Ms4_s3_a2.addTitle("");
	Ms4_s3_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To subscribe to a stream, you'll have to display the list of stream by clicking in the blinking link at the top":"Pour souscrire à un stream veuillez afficher la liste des strems en cliquant sur le lien clignotant en haut"
		]);
	Ms4_s3_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{

			if(store.getState().ui.show.streamList)
				resolve(true);
			else{
				Ms4_s2_a1.doProcess()().then((r)=>{
					resolve(true);
				})
			}
			//action.addToStore
		})
	})
	Ms4_s3_a2.addClearer((anchor)=>{

		return Ms4_s2_a1.getClearer()().then(()=> true);
	})

	const Ms4_s3_a3 = Ms4_s3_a2.nextAction;
	Ms4_s3_a3.addTitle("");
	Ms4_s3_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Click in one of the blinking stream to subsribe":"Selectionner un des streams clignotant pour vous y souscrire"
		]);
	Ms4_s3_a3.addAnchor([".listStream .f1 a"]);
	Ms4_s3_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms4_s3_a3;
			let clickers = tA(document.querySelectorAll(anchor[0]),"forEach","map","slice");
			let counters = []; //= []
			let listeners = [];
			let initialState = [];

			originalBackground(initialState,clickers);
			animateBackground(clickers,counters);
			addListener(listeners,clickers,'click',(event)=>{
				event.preventDefault();
				action.getClearer()();
				resolve(true);
			})

			action.addToStore({counters,listeners,initialState});
		})
	})
	Ms4_s3_a3.addClearer((anchor)=>{
		let action = Ms4_s3_a3;

		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms4_s3_a4 = Ms4_s3_a3.nextAction;
	Ms4_s3_a4.addTitle('');
	Ms4_s3_a4.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You have subscribe to a stream":"Felecition, vous avez pu vous souscribe à un stream",
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll see the song currently in stream appear":"Vous verez apparaitre le chant actuellement en stream",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next section":"Vous pouvez passer à l'etape suivante"]);
	Ms4_s3_a4.addClearer(()=>{
		return Promise.resolve(true);
	})

	const Ms5 = Ms4.nextStep;
	Ms5.addTitle((lang)=>"Configuration");

	const Ms5_s1 = Ms5.section.addSection().addSection().addSection();
	Ms5_s1.addTitle((lang="en")=> "Configurations");
	Ms5_s1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Configurations will allows you to customize the app":"Les configurations vous permettrons de personnaliser l'application",
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll have the ability to change the langage, activate the dark mode, activer the control touch":"Vous pourrez changer des langues, activer le mode nuit et activer la touche control"
		]);

	const Ms5_s1_a1 = Ms5_s1.action;
	Ms5_s1_a1.addTitle("");
	Ms5_s1_a1.addAnchor([" #settings .settingsToggler"]);
	Ms5_s1_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To show the available configuations, click in the blinking section at the top":"Pour afficher les configurations disponible, veuillez cliquer sur la section clignotante en haut "
		]);
	Ms5_s1_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms5_s1_a1;
				let settingToggler = document.querySelector(anchor[0]);
				let initialState = [];
				let counters = [];
				let actionsReverser = [[store,changeSettingListView,false]];
				let listeners = [];

				if(!settingToggler)
					throw Error("Ms5_s1_a1: #settings .settingsToggler selector Not found");

				originalBackground(initialState,settingToggler);
				animateBackground(settingToggler,counters);
				addListener(listeners,settingToggler,'click',(event)=>{
					action.getClearer()();
					meticulus('settings',()=> resolve(true));
				})

				action.addToStore({counters, actionsReverser, initialState,listeners});
			}

			if(store.getState().ui.show.settingList)
				resolve(true);
			else
				settings();


		})
	})
	Ms5_s1_a1.addClearer((anchor)=>{
		let action = Ms5_s1_a1;

		triggerCleaner(action);
		return Promise.resolve(true);
	})

	const Ms5_s2 = Ms5_s1.nextSection;
	Ms5_s2.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Dark Mode":'Mode nuit'
		);
	Ms5_s2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "The dark Mode will allow you to read when there is low light condition":"Le mode nuit est un mode qui vous permettra d'utiliser l'application dans un environnement de faible lumiere"
		]);

	const Ms5_s2_a1 = Ms5_s2.action.addAction().addAction();
	Ms5_s2_a1.addTitle("");
	Ms5_s2_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To toggle dark mode, click in the blinking section of the configuration":"Pour activer le mode nuit, veuillez cliquer la partie clignotante en bas de la page"
		]);
	Ms5_s2_a1.addAnchor([".dayMode .modeShift","main",".settings .list"]);
	Ms5_s2_a1.addProcess((anchor)=>{

		let mainDiv = document.getElementById(anchor[1]);
		let settingList = document.querySelector(anchor[2]);
		let action = Ms5_s2_a1;
		let settings = ()=>{
				let clicker = document.querySelector(anchor[0]);
				let counters = []; //= [];
				let initialState = [];
				let listeners = [];

				originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				return new Promise((resolve,reject)=>{
					addListener(listeners,clicker,'click',(event)=>{
						event.preventDefault();

						meticulus('settings',()=>{
							triggerCleaner(action,false);
							resolve(true);
						})
					})

					action.addToStore({counters,initialState,listeners});
				})
		}

		if(!mainDiv || !settingList)
			throw Error("mainDiv or settingList undefined");

		if(settingList.className.indexOf("whoosh") != -1){
			revertAction(action);
			action.addTitle("");
			action.addText(
				(lang="en")=> (lang.toLowerCase() == "en")? "Please, click in the blinking section at the top to show the configurations list":"Veuillez cliquer sur la section clignotante en haut pour afficher la liste des configuration"
				);
			action.addProcess(()=>{
				let settingAction = Ms5_s1_a1;
				return settingAction.doProcess()().then((r)=>{
					return action.getClearer()().then(()=>{
						return {updateText:true};
					})
				})
			})

			return Promise.resolve({updateText:true})
		}

		return moveToBottom(mainDiv,settingList,action).then((r)=>{
			if(store.getState().ui.show.nightMode){
				resolve(true);
			}
			else{
				return settings();
			}
		})
	})
	Ms5_s2_a1.addClearer((anchor)=>{
		let action = Ms5_s2_a1;
		let mainDiv = document.getElementById(anchor[1]);
		let settingList = document.querySelector(anchor[2]);
		let settingAction = Ms5_s1_a1;

		if(actionHasReset(action,false))
			return Promise.resolve(true);

		let { coordi1, coordi2 } = action.getStore();

		triggerCleaner(action);
		settingAction.getClearer()();

		return moveToOriginalPosition(mainDiv,settingList,{coordi1,coordi2});
	})

	const Ms5_s2_a2 = Ms5_s2_a1.nextAction;
	Ms5_s2_a2.addAnchor([".dayMode .modeShift"])
	Ms5_s2_a2.addTitle("");
	Ms5_s2_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Bravo, as you can see, the colors are more dark allowing you to read easily in low light condition":"Bravo, Comme vous pouvez le voir, les couleurs sont plus sombre permettant ainsi une lecture agreable dans un environnement de faible lumiere",
		(lang="en")=> (lang.toLowerCase() == "en")? "to go back to the preceding mode, click again in the blinking section":"Pour revenir au mode precedent cliquer de nouveau sur la section clignotante"]);
	Ms5_s2_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let clicker = document.querySelector(anchor[0]);
			let counters = []; //= [];
			let listeners = [];
			let initialState = [];

			originalBackground(initialState,clicker);
			animateBackground(clicker,counters);
			addListener(listeners,clicker,'click',(event)=>{
				event.preventDefault();

				meticulus('settings',()=>{
					triggerCleaner(action,false);
					resolve(true);
				})
			})

			action.addToStore({counters, listeners, initialState});
		})
	})
	Ms5_s2_a2.addClearer((anchor)=>{
		let action = Ms5_s2_a2;

		if(actionHasReset(action,false))
			return Promise.resolve(true);

		triggerCleaner(action);
		return action.prevAction.getClearer()();
	})

	const Ms5_s2_a3 = Ms5_s2_a2.nextAction;
	Ms5_s2_a3.addTitle("");
	Ms5_s2_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've finish the dark mode tutorial":"Felicitation, vous avez finit le tutoriel sur le mode nuit",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next section":"Vous pouvez passer au tutoriel suivant"]);
	Ms5_s2_a3.addClearer(()=>{
		let action = Ms5_s2_a3;

		return action.prevAction.getClearer()();
	})

	const Ms5_s3 = Ms5_s2.nextSection;
	Ms5_s3.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Changing langage":"Change la langue"
		);
	Ms5_s3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You can also change you langage":"Vous avez egalement la possibilité de change la langue"
		])

	const Ms5_s3_a1 = Ms5_s3.action.addAction().addAction();
	Ms5_s3_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "To change the langage, please click in the blinking section":"Pour changer la langue, veuillez cliquer sur la section clignotante"
		])
	Ms5_s3_a1.addAnchor([".language .langShift","main",".settings .list", ".language .list"]);
	Ms5_s3_a1.addProcess((anchor)=>{
		let action = Ms5_s3_a1;
		let mainDiv = document.getElementById(anchor[1]);
		let settingList = document.querySelector(anchor[2]);
		let languageList = document.querySelector(anchor[3]);

		if(settingList.className.indexOf("whoosh") != -1){
			revertAction(action);

			action.addTitle("");
			action.addText([
				(lang="en")=> (lang.toLowerCase() == "en")? "Please click in the blinking section at the top to show the configuration list":"Veuillez cliquer sur la section clignotante en haut pour afficher les configurations disponible"
				]);
			action.addProcess(()=>{
				let settingAction = Ms5_s1_a1;
				return settingAction.doProcess()().then((r)=>{
					return action.getClearer()().then(()=>{
						return {updateText:true};
					})
				})
			})

			return Promise.resolve({updateText:true});
		}
		
		if(languageList.className.indexOf("whoosh") == -1){
			document.querySelector(anchor[0]).click();
		}

		return moveToBottom(mainDiv,settingList,action).then((r)=>{
			let clicker = document.querySelector(anchor[0]);
			let counters = []; //= [];
			let initialState = [];
			let listeners = [];

			originalBackground(initialState,clicker);
			animateBackground(clicker,counters);
			
			return new Promise((resolve,reject)=>{
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();
					meticulus('language',()=>{
						triggerCleaner(action,false);
						resolve(true);
					})
				})

				action.addToStore({counters, initialState, listeners});
			})	
		})
	})
	Ms5_s3_a1.addClearer((anchor)=>{
		let action = Ms5_s3_a1;
		let settingAction = Ms5_s1_a1;
		let mainDiv = document.getElementById(anchor[1]);
		let settingList = document.querySelector(anchor[2]);
		let { coordi1, coordi2 } = action.getStore();

		settingAction.getClearer()();
		triggerCleaner(action);

		return moveToOriginalPosition(mainDiv,settingList,{coordi1,coordi2});
	})

	const Ms5_s3_a2 = Ms5_s3_a1.nextAction;

	Ms5_s3_a2.addTitle("");
	Ms5_s3_a2.addText(
		(lang="en")=> (lang.toLowerCase() == "en")? "Choose a langage among the blinking ones":"Veuillez choisir l'une des langues dans la section clignotante"
		);
	Ms5_s3_a2.addAnchor([".language .list",".langShift"]);
	Ms5_s3_a2.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let settings = ()=>{
				let action = Ms5_s3_a2;
				let languageList = document.querySelector(anchor[0]);
				let clickers = tA(languageList.querySelectorAll("a"),"forEach","map","slice");
				let counters = []; //= [];
				let listeners = [];
				let initialState = [];
				let problematics = [()=> forceUpdate('settings',false),()=>{
					if(document.querySelector(anchor[0])){
						let langShifter = document.querySelector(anchor[1]);
						langShifter.click();
					}
				}];
				originalBackground(initialState,clickers);
				animateBackground(clickers,counters);
				addListener(listeners,clickers,'click',(event)=>{
					event.preventDefault();
					triggerCleaner(action,false);

					let updateForceSettings = store.getState().updateForced.settings;

					meticulus('settings',()=> resolve(true));
					forceUpdate('settings',!updateForceSettings);
				})

				action.addToStore({counters, listeners, initialState, problematics});
			}

			let languageList = document.querySelector(anchor[0]);
			if(languageList.className.indexOf('whoosh') != -1){
				let langShift = document.querySelector(anchor[1]);
				meticulus('settings',settings);
				langShift.click();
			}
			else
				settings();


		})
	})
	Ms5_s3_a2.addClearer((anchor)=>{
		let action = Ms5_s3_a2;
		triggerCleaner(action);

		return action.prevAction.getClearer()();
	})

	const Ms5_s3_a3 = Ms5_s3_a2.nextAction;
	Ms5_s3_a3.addTitle("");
	Ms5_s3_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Congratulation, You've finish the tutorial about the langage changement. You can go to the next section":"Felicitation, vous avez finit ce tutoriel sur le changement de langue, Veuillez passer à la section  suivante"
		]);
	Ms5_s3_a3.addClearer((anchor)=>{
		let action = Ms5_s3_a3;

		return action.prevAction.getClearer()();
	})

	const Ms5_s4 = Ms5_s3.nextSection;
	Ms5_s4.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "Control key trigger":"Activer la touche de control"
		);

	const Ms5_s4_a1 = Ms5_s4.action.addAction().addAction();
	Ms5_s4_a1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "The control key allow you to display hidden functionnality. In triggered the key, you'll see modifications and deletion link for songs and categories ":"La touche de control vous permet d'afficher des fonctionnalité cachés, en appuyant sur la touche de control vous verez les liens de modifications et de suppressions s'afficher pour chaque chansons et categorie"
		]);
	Ms5_s4_a1.addAnchor(['.control .controlShift',"main",".settings .list"]);
	Ms5_s4_a1.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			let action = Ms5_s4_a1;
			let mainDiv = document.getElementById(anchor[1]);
			let settingList = document.querySelector(anchor[2]);

			if(settingList.className.indexOf("whoosh") != -1){
				revertAction(action);
				action.addTitle("");
				action.addText(
					(lang="en")=> (lang.toLowerCase() == "en")? "Please, click in the blinking section at the top":"Veuillez cliquer sur la section clignotante en haut"
					);
				action.addProcess(()=>{
					let settingAction = Ms5_s1_a1;
					return settingAction.doProcess()().then((r)=>{
						return action.getClearer()().then(()=>{
							return {updateText:true};
						})
					})
				})

				return resolve({updateText:true});
			}

			if(store.getState().keys.alt){
				revertAction(action);
				action.addTitle("");
				action.addText([
					(lang="en")=> (lang.toLowerCase() == "en")? "Oh, we see that you've already triggered the control key. You can go to the next section":"Oh, nous voyons que vous savez dejà activer la touche control, Veuillez passer à l'etape suivante"
					])
				action.addProcess(()=>{
					return new Promise((resolve,reject)=>{

					})
				});

				return resolve({updateText:true});
			}

			moveToBottom(mainDiv,settingList,action).then((r)=>{
				let clicker = document.querySelector(anchor[0]);
				let counters = []; //= [];
				let initialState = [];
				let listeners = [];

				originalBackground(initialState,clicker);
				animateBackground(clicker,counters);
				addListener(listeners,clicker,'click',(event)=>{
					event.preventDefault();

					meticulus('settings',()=>{
						triggerCleaner(action,false);
						resolve(true);
					})
				})

				action.addToStore({counters, initialState, listeners});
			})
		})
	})
	Ms5_s4_a1.addClearer((anchor)=>{
		let action = Ms5_s4_a1;
		let settingAction = Ms5_s1_a1;
		let mainDiv = document.getElementById(anchor[1]);
		let settingList = document.querySelector(anchor[2]);
		let {coordi1,coordi2} = action.getStore();

		settingAction.getClearer()();

		triggerCleaner(action);
		return moveToOriginalPosition(mainDiv,settingList,{coordi1,coordi2});
	})

	const Ms5_s4_a2 = Ms5_s4_a1.nextAction;
	Ms5_s4_a2.addTitle("");
	Ms5_s4_a2.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Display the categories list to see the new controls that have appeared":"Afficher la liste des categories pour voir les nouveaux controls qui vont apparaitre"
		]);
	Ms5_s4_a2.addProcess(()=>{
		return Ms2_s1_a1.doProcess()().then((r)=> r);
	})
	Ms5_s4_a2.addClearer(()=>{
		Ms5_s4_a2.prevAction.getClearer()();
		return Ms2_s1_a1.getClearer()().then((r)=> r);
	})

	const Ms5_s4_a3 = Ms5_s4_a2.nextAction;
	Ms5_s4_a3.addTitle("");
	Ms5_s4_a3.addAnchor([".wipe",".modif"]);
	Ms5_s4_a3.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "You'll see appear modification et deletion link":"Vous verez apparaitre les controls de modifications(M) et de suppersions(S)",
		(lang="en")=> (lang.toLowerCase() == "en")? "The modification link allow you to modify a song or a category":"Le controls de modifications(M) vous permettre de modifier une chansons ou une categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "The deletion link allow you to delete a song or a categorie":"Le control de suppersions vous permettra de supprimer une chanson ou categorie",
		(lang="en")=> (lang.toLowerCase() == "en")? "You can go to the next step":"Vous pouvez passer à l'etape suivante"]);
	Ms5_s4_a3.addProcess((anchor)=>{
		return new Promise((resolve,reject)=>{
			try{
				let action = Ms5_s4_a3;
				let controls = [];
				let c1 = document.querySelectorAll(anchor[0]);
				let c2 = document.querySelectorAll(anchor[1]);
				for(var i=0; i < c2.length && i < c1.length; i++){
					c1[i] && controls.push(c1[i]);
					c2[i] && controls.push(c2[i]);
				}
				c1 = null;
				c2 = null;
				let counters = []; //= [];
				let initialState = [];
				let actionsReverser = [[store,setControl,false]];

				originalBackground(initialState,controls);
				animateBackground(controls,counters);

				action.addToStore({ initialState, counters, actionsReverser });	
			}
			catch(e){
				alert(e);
			}

		})
	})
	Ms5_s4_a3.addClearer((anchor)=>{
		let action = Ms5_s4_a3;
		triggerCleaner(action);

		action.prevAction.getClearer()();
		return Promise.resolve(true);
	})

	const Ms6 = Ms5.nextStep;
	Ms6.addTitle(
		(lang="en")=> (lang.toLowerCase() == "en")? "End":"Fin"
		);

	const Ms6_s1 = Ms6.section;
	Ms6_s1.addText([
		(lang="en")=> (lang.toLowerCase() == "en")? "Here we are at the end":"Vous voilà, arrivé à la fin de ce tutoriel",
		(lang="en")=> (lang.toLowerCase() == "en")? "We hope this tutorial will have give you a clear oversight of the functionnality of the app":"Nous esperons que ce tutoriel vous a donné un apperçu global des capacité de l'application"]);

	return Ms;
}

