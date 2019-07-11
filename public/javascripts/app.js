function goto () {
  this.closest('form').style.display = 'none' ;
  document.querySelector(this.getAttribute('href')).style.display = '';
}

function submitForm(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  let els = this.querySelectorAll('input, select, textarea') ;
  let datas = {} ;
  for (var i in els) {
    if(!els[i].type ||!els[i].name)
      continue ;
    if (!!els[i].value)
      datas[els[i].name] = els[i].value ;
  }
  fetch(this.action, {
    method : this.getAttribute('method'),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'same-origin',
    body:JSON.stringify(datas) })
    .then(r => r.text())
    .then(response => {
      if(response === 'OK') {
        document.getElementById('loginArea').style.display = 'none' ;
        document.getElementById('tableArea').style.display = '' ;
        document.getElementById('logout').style.display = '' ;
        document.getElementById('text-index').style.display = 'none' ;
        document.getElementById('save').style.display = '' ;
        document.getElementById('username').innerText = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        return loadTables() ;
      }
      if(response === 'ADDED') {
        return this.reset();
      }
      alert('Veuillez vérifier le formulaire');
  })
}

function loadTables () {
  fetch('/tables', {method:"GET", credentials:'same-origin'}).then(r => r.text()).then(response => {
    document.getElementById('tableList').innerHTML = response;
    document.getElementById('loginArea').style.display = 'none' ;
    document.getElementById('tableArea').style.display = '' ;
    document.getElementById('logout').style.display = '' ;
    document.getElementById('text-index').style.display = 'none' ;
    document.getElementById('save').style.display = '' ;
  });
}

function loadTablesSave (event) {
  event.stopPropagation();
  event.preventDefault();
  fetch(event.target.href, {method:"GET", credentials:'same-origin'}).then(r => r.text()).then(response => {
   $("#tableList").html(response);
   document.getElementById('createTable').style.display = '' ;
   document.getElementById('save').style.display = 'none' ;
  });
}

var socket ;

document.body.onload = evt => {
  let userName = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if(userName) {
//    document.getElementById('username').innerText = userName ;
    loadTables () ;
  }
  socket = io('http://localhost:8000');

  socket.on('table', function (data) {
    console.log(data);
    if(data)
    fetch('/tables/'+data, {credentials:'same-origin'}).then(r => r.json()).then(response => {
      document.getElementById('tableList').innerHTML = response.response + document.getElementById('tableList').innerHTML;
    });
  });
}


function logout (event) {
  event.stopPropagation();
  event.preventDefault();
  fetch(event.target.href, {method:'DELETE',credentials:'same-origin'})
    .then(r=>r.text())
    .then(r=>{
      document.getElementById('loginArea').style.display = '' ;
      document.getElementById('tableArea').style.display = 'none' ;
      document.getElementById('logout').style.display = 'none' ;
      document.getElementById('save').style.display = 'none' ;
      document.getElementById('username').innerText = 'userName' ;
      document.getElementById('text-index').style.display = '' ;
    })
} ;

function deleteTable (event) {
  event.stopPropagation();
  event.preventDefault();
  fetch('/tables/:id', {method:'DELETE',credentials:'same-origin'})
    .then(r=>r.text())
    .then(r=>{
      document.getElementById('loginArea').style.display = '' ;
      document.getElementById('tableArea').style.display = 'none' ;
      document.getElementById('logout').style.display = 'none' ;
      document.getElementById('save').style.display = 'none' ;
      document.getElementById('username').innerText = 'userName' ;
      document.getElementById('text-index').style.display = '' ;
    })
} ;

function deleteSave (event) {
  event.stopPropagation();
  event.preventDefault();
  fetch('/saves/:id', {method:'DELETE',credentials:'same-origin'})
    .then(r=>r.text())
    .then(r=>{
      document.getElementById('loginArea').style.display = '' ;
      document.getElementById('tableArea').style.display = 'none' ;
      document.getElementById('logout').style.display = 'none' ;
      document.getElementById('save').style.display = 'none' ;
      document.getElementById('username').innerText = 'userName' ;
      document.getElementById('text-index').style.display = '' ;
    })
} ;
