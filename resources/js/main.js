
// 현재시간 실시간으로 출력
let renderCurrentTime = () => {
   
   	let now = new Date();
   	let hour = now.getHours();
   	let minutes = now.getMinutes();
   	let seconds = now.getSeconds();
   
   	hour = hour < 10?"0"+hour:hour;
   	minutes = minutes < 10?"0"+minutes:minutes;
   	seconds = seconds < 10?"0"+seconds:seconds;
   	document.querySelector('.txt_clock').innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

// 
let renderUser = (event) => {
	event.preventDefault();
	
   	let input = document.querySelector('.inp_username').value;
   	localStorage.setItem('username', input);   
   	convertMainDiv(input);
}

let registSchedule = (event) => {
	event.preventDefault();
	
   	let prevTodo = localStorage.getItem('todo');
   	let input = document.querySelector('.inp_todo').value;
   	let todoList = [];
   
   	if(prevTodo){
      	todoList = JSON.parse(prevTodo);
		let idx = Number(localStorage.getItem('lastIdx')) + 1;
		localStorage.setItem('lastIdx',idx);
      	todoList.unshift({work:input, idx:idx});
   	}else{
		localStorage.setItem('lastIdx',0);
      	todoList.unshift({work:input, idx:0});
   	}
   
   	localStorage.setItem('todo', JSON.stringify(todoList));
   	renderSchedule(todoList.slice(0,8));
}

let removeSchedule = event =>{
	let curPage = Number(document.querySelector('#currentPage').textContent);
	let todoList = JSON.parse(localStorage.getItem('todo'));
	let removeList = todoList.filter(e=>{
		return event.target.dataset.idx != e.idx;
	});
	
	localStorage.setItem('todo',JSON.stringify(removeList));
	
	let end = curPage*8;
	let begin = end-8;
	
	renderSchedule(removeList.slice(begin,end));
	
}

let renderSchedule = (todoList) => {
   	document.querySelectorAll('.todo_list>div').forEach(e => {e.remove()});
   	document.querySelector('.inp_todo').value='';

   	todoList.forEach(e => {
      	let workDiv = document.createElement('div');
      	workDiv.innerHTML = `${e.work} <i class="fas fa-trash" data-idx="${e.idx}"></i>`;
      	document.querySelector('.todo_list').append(workDiv);
   	});
	
	document.querySelectorAll('.todo_list>div>i').forEach(e=>{
		e.addEventListener('click', removeSchedule)
	})

}

let renderNextPage = () => {
   	let curPage = Number(document.querySelector('#currentPage').textContent);
   	let lastPage;
   
   	let todoList = localStorage.getItem('todo');
   	if(todoList){
      	todoList = JSON.parse(todoList);
      	let todoCnt = todoList.length;
      	lastPage = Math.ceil(todoCnt/8);
   	} else {
		alert('todo list를 작성해주세요.')
		return;
	}
   
   	if(curPage == lastPage){
      	alert('마지막 페이지 입니다.');
      	return;
   	}
   
   	let renderPage = curPage+1;
   	let end = renderPage * 8
   	let begin = end-8;
   
   	renderSchedule(todoList.slice(begin,end));
   	document.querySelector('#currentPage').textContent = renderPage;
}

let renderPrevPage = () => {
   	let curPage = Number(document.querySelector('#currentPage').textContent);
	
	if(curPage == 1){
      	alert('처음 페이지 입니다.');
      	return;
   	}

	let todoList = localStorage.getItem('todo');
	
	if(todoList){
      	todoList = JSON.parse(todoList);
   	}

	let renderPage = curPage-1;
   	let end = renderPage * 8
   	let begin = end-8;
   
   	renderSchedule(todoList.slice(begin,end));
   	document.querySelector('#currentPage').textContent = renderPage;
}

let convertMainDiv = (username) => {
   	document.querySelector('.username').innerHTML = username;
   	document.querySelector('.inp_username').placeholder = 'Enter your schedule';
   	document.querySelector('.inp_username').value = '';
   
   	document.querySelector('.wrap_username').className = 'box_todo';
   	document.querySelector('.frm_username').className = 'frm_todo';
   	document.querySelector('.inp_username').className = 'inp_todo';
   
   	document.querySelector('.main').style.justifyContent = 'space-between';
   	document.querySelector('.wrap_todo').style.marginRight = '25vw';
   	document.querySelector('.todo_list').style.display = 'block';
   
	document.querySelector('.frm_todo').removeEventListener('submit',renderUser);
   	document.querySelector('.frm_todo').addEventListener('submit',registSchedule);
   	document.querySelector('#leftArrow').addEventListener('click',renderPrevPage);
   	document.querySelector('#rightArrow').addEventListener('click',renderNextPage);
}



(() => {
   	let username = localStorage.getItem('username');
   	let todoList = localStorage.getItem('todo');
   
   	if(username){ //사용자가 등록을 진행했다면,
      	convertMainDiv(username);
      	if(todoList){
         	todoList = JSON.parse(todoList);
         	renderSchedule(todoList.slice(0,8));
      	}
   	}else{
		localStorage.removeItem('lastIdx');
		localStorage.removeItem('todo');
      	document.querySelector('.frm_username').addEventListener('submit', renderUser);
   	}   
   
   	setInterval(renderCurrentTime,1000);   
})();
