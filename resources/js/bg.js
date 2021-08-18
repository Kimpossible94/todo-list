/**
 * 
 */

let getCoords = () =>{
	return new  Promise((resolve, reject) => { 
		navigator.geolocation.getCurrentPosition((position) =>{
			resolve(position.coords);
		});
	})
}

let getLocationWeather = async() =>{
	let coords = await getCoords();
	
	let queryString = createQueryString({
		lat : coords.latitude,
		lon : coords.longitude,
		units : 'metric',
		lang : 'kr',
		appid : '5395f09453084f39f2c1d9c48a8722a8'
	});
	
	let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
	let response = await fetch(url);
	let datas = await response.json();
	
	return{
		temp:datas.main.temp,
		location:datas.name
	}
}

let getBackgroundImg = async() =>{
	
	let prevLog = localStorage.getItem('bg-log');
	
	//getItem을 사용했을 때 없다면 null을 반환
	if(prevLog){
		//문자열로 변환한 것을 다시 객체로 변환
		prevLog = JSON.parse(prevLog);
		if(prevLog.expirationOn > Date.now()){
			//시간이 지나지 않았다면 로컬스토리지에 있던 bg를 리턴
			return prevLog.bg;
		}
	}
	
	let imgInfo = await requestBackgroundImage();
	
	registBackroundLog(imgInfo);
	
	return imgInfo;
}

let requestBackgroundImage = async()=>{
	
	let queryString = createQueryString({
		orientation:'landscape',
		query:'landscape'
	});
	
	let url = 'https://api.unsplash.com/photos/random?' + queryString;
	
	let response = await fetch(url,{
		headers:{
			Authorization:'Client-ID BN5MfpjLqndYdJy6PwzrWFBtDnegCwU9p29ss--ZN-c'
		}
	})
	
	let datas = await response.json();
	
	return {
		url : datas.urls.full,
		desc : datas.description
	};
}

let registBackroundLog = imgInfo =>{
	
	let expirationDate = new Date();
	//테스트를 위해 데이터 만료시간을 1분 뒤로 설정
	expirationDate = expirationDate.setDate(expirationDate.getDate()+1);
	
	let bgLog = {
		expirationOn : expirationDate,
		bg : imgInfo
	}
	
	//setItem으로 저장할 때 매개변수를 DOMString으로 넣어야해서 bgLog가 객체여서 저장이 안되므로, JSON.stringify를 통해 문자열로 바꿔준다.
	localStorage.setItem('bg-log',JSON.stringify(bgLog));
}

let renderBackground = async() =>{
	//위치와 날씨정보를 받아온다.
	let locationWeather = await getLocationWeather();
	//배경에 넣을 이미지를 받아온다.
	let backgroundImg = await getBackgroundImg();
	
	//화면에 위치와 날씨 정보를 그린다.
	document.querySelector('.txt_location').innerHTML = `${locationWeather.temp}º @ ${locationWeather.location}`;
	
	//배경에 이미지와 이미지 정보를 넣어준다.
	document.querySelector('body').style.backgroundImage = `url(${backgroundImg.url})`
	if(backgroundImg.desc){
		document.querySelector('.txt_bg').innerHTML = `${backgroundImg.desc}`
	}
}

renderBackground();



