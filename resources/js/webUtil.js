/**
 * 
 */
let createPopUp = (popUpInfo) =>{
	let left = (window.innerWidth/2) - popUpInfo.width/2;
	let top = (window.innerHeight/2) - popUpInfo.height/2;
		   
	let popUp = open(popUpInfo.url, popUpInfo.name, `width=${popUpInfo.width}, height=${popUpInfo.height}, left=${left}, top=${top}`);		   
}

let createQueryString = params =>{
	let arr = [];
	for(key in params){
		arr.push(key + '=' + params[key])
	}
	return arr.join('&');
	
}