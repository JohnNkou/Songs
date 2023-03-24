module.exports = {
	formError:{
		badCharacter:(name)=>{
			return (lang="En")=> (lang.toLowerCase() == "en")? `${name} must only contains alphabenumeric character`: `${name} ne doit contenir que des caracteres alphanumerique`;
		},
		inputToLong:(name,threshold)=>{
			return (lang="En")=> (lang.toLowerCase() == "en")? `${name} should have character length less than or Equal to ${threshold}`:`${name} devrait avoir une nombre de character inferieur ou egale à ${threshold}`;
		},
		required: (name)=> (lang="En")=> (lang.toLowerCase() == "en")? `${name} must be filled`: `le champ ${name} doit etre complété`,
		notAlphaNumeric: (name)=> (lang="en")=> (lang == "en")? `${name} should only contain alphanumerique character.`:`${name} ne doit contenir que des charactere alpha numeric`
	},
 	catDiv:{
		addCatDiv:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Add Categorie":"Ajouter une Categorie"
		}
	},
	songList:{
		list:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Add song":"Ajouter une chanson";	
		} 
	},
	addCatDiv:{
		nameHolder:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Name":"Nom"
		},
		addButtonText:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Add":"Ajouter"
		},
		modiButtonText:(lang="En")=>{ 
			return (lang.toLowerCase() == "en")? "Modify":"Modifier"
		},
		closeButtonText:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Close":"Fermer";
		},
		message:{
			nameRequired:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Please Enter the categorie Name":"Veuillez entrer le nom de la Categorie";
			},
			alreadyExist:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "This Categorie already Exist":" Cette Categorie Exist deja"
			},
			updated:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Categorie updated":"La categorie a été modifiée"
			},
			success:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Categorie Added":"La categorie a été ajoutée"
			},
			insertFailure:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "We wasn't able to insert the category":"Nous n'avaons pas pu inserer la categorie"
			},
			updateFailure:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "We wasn't able to update the category. Please try again":"Nous n'avons pas pu modifier la categorie. Reessayer encore"
			},
			Error:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "An error happened while trying to update the category. Plese try again":"Une erreur est survenu lors de la modification de la categorie. Reassayer de nouveau"
			}
		}
	},
	addSongDiv:{
		nameHolder:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Name":"Nom"
		},
		verseNameHolder:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Verse":"Verset";
		},
		verseNumberHolder:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Verse Number": "Nombre de Verset"
		},
		changeVerseButtonText:(lang="Eng")=>{
			return (lang.toLowerCase() == "en")? "change":"Changer"
		},
		addButtonText:(lang="En")=> {
			return (lang.toLowerCase() == "en")? "Add":"Ajouter"
		},
		modiButtonText:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Modify":"Modifier"
		},
		closeButtonText:(lang="En")=> {
			return (lang.toLowerCase() == "en")? "close":"Fermer"
		},
		message:{
			nameRequired:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The name required":"Le nom de la chanson est obligatoire";
			},
			verseRequired:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The song must at least have one verse and It must not be null":"La chanson doit avoir au moins un verset et il ne doit pas etre nulle"
			},
			verseValueRequired:(lang="En",number)=>{
				return (lang.toLowerCase() == "en")? `Verse ${number} has no value`:`Le verset ${number} n'as aucune valeur`
			},
			verseNumberNotInteger:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The verse number must be a number":"Le nombre de verset doit etre un nombre"
			},
			verseNumberBadNumber:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Please provide a verse number that is more than zero":"Veuillez entrer un nombre de verset superieur à zero"
			},
			verseNumberToBig:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The verse Number is to big. A song can't have that many Verse. Are you a HACKER?":"Le nombre de verset est trop grand. Un chant ne peut pas avoir autant de verset. Etes vous un hacker?"
			}
		}
	},
	createStreamDiv:{
		nameHolder:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Stream Name":"Nom du stream"
		},
		create:(lang="En")=> (lang.toLowerCase() == "en")? "Create":"Creer",
		close: (lang="En")=> (lang.toLowerCase() == "en")? "Close":"Fermer",
		message:{
			nameRequired:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The stream name is empty, please provide a name": "Le nom du stream est vide. Veuillez entre un nom valide"
			},
			streamCreated:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Stream created with success": "Le stream a ete crée avec success";
			},
			BadCharacter:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The stream name must only contains number and alphabetic caracter": "Le nom du stream ne doit contenir que des caracteres alphanumerique";
			},
			isAlreadyStreaming:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "You have already a stream running. Please stop that stream to create another One":"Vous avez deja un stream en cour. Pour creer un autre ruiseaux veuiller arrete le stream courant"
			},
			streamStopped:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The stream was stopped": "Le stream a ete arreté";
			},
			creationError:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Sorry couldn't create the stream. Please try again": "Desolé, nous n'avons pas pu creer le stream. Veuillez reessayer de nouveau";
			},
			nameDuplication:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "A stream with that name Exist, please provide another name":"Un autre stream possede deja ce nom, Veuillez modifier le nom de votre stream";
			},
			UnsubscribeFirst:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "You are subscribed to a stream. You have to unsubscribe first. You can do that by clicking on a song":"Vous etes souscrit a un stream. Vous devez vous desouscrire avant de creer votre propre stream. Clique sur une chanson pour vous desouscrire"
			},
			networkProblem:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "Sorry, but We can't connect to the server. Please check your connection":"Desolé, Nous ne pouvons pas nous connecter sur le serveur, veuillez verifier votre connexion internet"
			},
			stringToLong:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "The provided stream name must be less than or equal to 50": "Le nom du stream doit etre d'une longuer inferieur ou egale à 50"
			}
		}
	},
	Favorite:{
		added:(lang="En",name)=>{
			return (lang.toLowerCase() == "en")? `song ${name} added to Favorite`: `La chanson ${name} a été ajouté aux favoris`
		},
		deleted:(lang="En",name)=>{
			return (lang.toLowerCase() == "en")? `song ${name} deleted from favorite`:`La chanson ${name} a été supprimé des favoris`
		}
	},
	Stream:{
		started:(lang="En",name="")=>{
			return (lang.toLowerCase() == "en")? `stream ${name} started`: `Le stream ${name} a été créer`
		},
		stopped: (lang="En",name="")=>{
			return (lang.toLowerCase() == "en")? `stream ${name} stopped`: `Le stream ${name} a été arreté`
		},
		stopping: (lang="En",name,dot)=>{
			return (lang.toLowerCase() == "en")? `Stopping stream ${name} ${dot}`:`Arret du stream ${name} ${dot}`
		},
		stopError: (lang="En",name)=>{
			return (lang.toLowerCase() == "en")? `Error while trying to stop stream ${name}`: `Une Erreur est survenue lors de l'arrete du stream ${name}`
		},
		creationError:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `We couldn't create the stream, Please try again`:`Le stream n'a pas pu etre crée, veuillez reessayer`
		},
		Error:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `An Error happened while creating the stream. Please try again`:`Une Erreur est survenu lors de la creation du stream. Veuillez reessayer`
		},
		download:{
			start: (lang="En",songName)=>{
				return (lang.toLowerCase() == "en")? ` Downloading song ${songName}`:`Telechargement de la chanson ${songName}`;
			},
			success: (lang="En",songName)=>{
				return (lang.toLowerCase() == "en")?`The songName ${songName} has been successfully downloaded`:`La chanson ${songName} a été correctement telechargé`
			},
			error: (lang="En",songName)=>{
				return (lang.toLowerCase() == "en")? `Sorry, we couldn't download the song ${songName}. The song is not in stream`:`Desolé nous n'avons pas pu telecharger la chanson ${songName}, car elle n'est plus en stream`
			}
		},
		subscription: {
			success:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `Successfully subscribed to stream ${name}`: `Votre soubscription au stream ${name} a reussit`
			},
			failed:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `An Error occured while trying to subscribe to stream ${name}`: `Une Erreur est survenu lors de la souscription au reuisseaux ${name}`
			},
			end:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `The stream ${name} ended`: `Le stream ${name} est arreté`
			},
			error:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `An Error occured. Couln't connect to stream ${name}`: `Une Erreur est survenu. Impossible de se connecter au stream ${name}`
			},
			alreadyStreaming:(lang="En")=>{
				return (lang.toLowerCase() == "en")? "You can't stream an subscribe to a stream at the same time": "Vous ne pouvez pas effectuer un stream et etre souscrit à un stream en meme temps"
			},
			dontHaveSong:(lang="En",catName,songName)=>{
				return (lang.toLowerCase() == "en")? `The streammed song is not available in the current song you have. streamed songName: ${songName}, categorieName: ${catName}`: `La chanson en stream n'est pas disponible sur votre system. Chanson en stream: ${songName}, Categorie: ${catName} `
			},
			changed:(lang="En",songName)=>{
				return (lang.toLowerCase() == "en")? `Sorry, we download the song ${songName} because the streamer is no longer streaming this song`:`Desolé, nous n'avons pas pu telecharger la chanson ${songName} parce que le streamer ne stream plus ce chant`
			},
			nothing:(lang = "En", name)=>{
				return (lang.toLowerCase() == "en")? `The stream ${name} stoped`:`Le stream s'est arreté`
			}
		}
	},
	Song:{
		insertion:{
			success:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `song ${name} saved localy successfully`:`La chanson ${name} a été localement enregistré avec success`
			},
			failed:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `Couldn't localy save the song ${name}`: `Nous n'avons pas pu enregistré localement la chanson ${name}`
			},
			duplicate:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `The song ${name} was already Inserted`: `La chanson ${name} a dejà été enregistré`
			},
			allDone:(lang="En")=>{
				return (lang.toLowerCase() == "en")? `All the song in this categorie have been localy saved`: `Toute les chanson de cette categorie sont localement enregistré`
			},
			allNotDone:(lang="En",number,total)=>{
				return (lang.toLowerCase() == "en")? `${number} out of ${total} songs where inserted`: `${number} sur ${total} ont été inseré`
			},
			error:(lang="En")=>{
				return (lang.toLowerCase() == "en")? `An error  occured while trying adding the Song. Please try again`:`Une erreur s'est produit pendant l'ajout de la chanson. Veuillez reéssayer`
			}
		},
		updating:{
			success:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `The song ${name} was successfully updated`:`La chanson ${name} a été modifiée`
			},
			failed:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `We coudln't update the song. Please try again.`:`Nous n'avaons pas pu modifié la chanson. Veuillez reeassayer de nouveau`
			},
			duplicate:(lang="En")=>{
				return (lang.toLowerCase() == "en")? `A song already have that name, please provide another name`:`Une chanson avec ce nom est dejà enregistré, veuillez entrer un autre nom`
			},
			error:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `An error happened while modifying the song. Please try again`:'Une erreur est survenu lors de la modification de la chanson. Veuillez reessayer.'
			}
		},
		wiping:{
			success:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `The song ${name} has been deleted`: `La chanson ${name} a été supprimé`
			},
			failed:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `Couldn't delete the song. Please try again.`:`La chanson n'a pas pu etre modifié veuillez reessayer`
			},
			error:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `An error happened while deleting song ${name}`:`Une erreur est survenue lors de la suppresion de la chanson ${name}`
			}
		},
		adder:(lang="En")=>{
			return (lang.toLowerCase() == "en")? "Add song":"Ajouter une chanson";	
		} 
	},
	Categorie:{
		insertion:{
			success:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `Categorie ${name} saved localy successfully`: `La Categorie ${name} a été localement enregistré`
			},
			failed:(lang="En",name)=>{
				return (lang.toLowerCase() == "en")? `Couldn't localy save the categorie ${name}`: `Nous n'avons pas enregistrer localement la categorie ${name}`
			}
		}
	},
	streamList:{
		songDeleted:(lang="En",songName)=>{
			return (lang.toLowerCase() == "en")? `The song ${songName} that you wanted to download has been deleted frmo the streamer`: `La chanson ${songName} que vous vouliez telecharger a été supprimé par le streamer`
		},
		categorieInserted:(lang="En",catName)=>{
			return (lang.toLowerCase() == "en")? ` The Categorie ${catName} has been inserted to categorie list`: `La categorie ${catName} a été ajouté à la liste de categorie`
		},
		songInserted:(lang="En",catName,songName)=>{
			return (lang.toLowerCase() == "en")? `The song ${songName} has been inserted to the online songs of categorie ${catName}`: `La chanson ${songName} a été inserée dans la liste des chants en ligne de la categorie ${catName}`
		},
		downloadError:(lang="En",songName)=>{
			return (lang.toLowerCase() == "en")? `Sorry, an error occured while trying to download song ${songName}`: `Desolé, Une erreur c'est produite lors du telechargement de la chanson ${songName}`
		},
		updateStreamError:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `Couldn't connect to the server. Check if your connection is live`: `Nous n'avons pas pu nous connecter au serveur. Veuillez verifier votre connectivité aux reseaux`
		}
	},
	caching:{
		active:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `The App is running from cache`:`L'application est executé à partir de votre cache`
		},
		starting:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `App caching is starting`:`La sauvegarder de l'application commence`
		},
		installing:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `App caching is installing on your computer`:`Une sauvegarde de l'application est en installation sur votre maching`
		},
		installed:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `The app is successfully installed on your computer`:`L'application est installée avec succès sur votre machine`
		},
		newUpdate:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `A new version off the app is ready. Reload the browser to see it`: `Une nouvelle version de l'application est disponible. Actualiser la page pour la voir`
		},
		error:(lang="En")=>{
			return (lang.toLowerCase() == "en")? `An error occured while attempting to cache the application`: `Une erreur est survenue lors de la sauvegarde de l'application`
		}

	}
}