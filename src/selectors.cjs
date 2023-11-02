 exports.languageSelector =  function (state){
	return state.language
}

exports.uiSelector = function(state){
	return state.ui;
}

exports.catListViewSelector = function(state){
	return state.ui.show.catList;
}

exports.imageSelector = function(state){
	return state.images;
}

exports.resultListSelector = function(state){
	return state.ui.show.resultList;
}