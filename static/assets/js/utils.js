let jwt = sessionStorage.getItem("jwt");
let var_loading = [];

let _uso_terra = false;
let _valoracao = false;
let _registral = false;
let _socio_ambiental = false;
let _produtividade = false;
let _payload = null;

if(window.location.pathname == "/index.html" || window.location.pathname == "/registro.html" || window.location.pathname  == '/'){

}else{
		
		buildLeftPane();
		buildHeader();
}

function jump(h){
    var top = document.getElementById(h).offsetTop; //Getting Y of target element
    window.scrollTo(0, top);                        //Go there directly or some transition
}

function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}


function parseJwt (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	return JSON.parse(window.atob(base64));
}

function buildHeader(){
	document.getElementById("header").innerHTML = `<div class="top-left">
		<div class="navbar-header">
		<a class="navbar-brand" href="#"><img src="images/logo.png"
		alt="Logo"></a> <a class="navbar-brand hidden" href="./"><img
		src="images/logo.png" alt="Logo"></a> <a id="menuToggle"
		class="menutoggle"><i class="fa fa-bars"></i></a>
		</div>
		</div>
		<div class="top-right">
		<div class="header-menu">
		<h6 style="margin-top:16px;" ><span id="navBarAlert" class="badge badge-light"></span></h6>
		<div class="header-left">
		<!--button class="search-trigger">
		<i class="fa fa-search"></i>
		</button>
		<div class="form-inline">
		<form class="search-form">
		<input class="form-control mr-sm-2" type="text"
		placeholder="Busca ..." aria-label="Search">
		<button class="search-close" type="submit">
		<i class="fa fa-close"></i>
		</button>
		</form>
		</div-->

		<!--div class="dropdown for-notification">
		<button class="btn btn-secondary dropdown-toggle" type="button"
		id="notification" data-toggle="dropdown" aria-haspopup="true"
		aria-expanded="false">
		<i class="fa fa-bell"></i> <span class="count bg-danger">3</span>
		</button>
		<div class="dropdown-menu" aria-labelledby="notification">
		<p class="red">You have 3 Notification</p>
		<a class="dropdown-item media" href="#"> <i
		class="fa fa-check"></i>
		<p>Server #1 overloaded.</p>
		</a> <a class="dropdown-item media" href="#"> <i
		class="fa fa-info"></i>
		<p>Server #2 overloaded.</p>
		</a> <a class="dropdown-item media" href="#"> <i
		class="fa fa-warning"></i>
		<p>Server #3 overloaded.</p>
		</a>
		</div>
		</div -->


		</div>

		<div class="user-area dropdown float-right">
		

		<div class="user-menu dropdown-menu">
		<!-- <a class="nav-link" href="#"><i class="fa fa- user"></i>Perfil</a>

		<a class="nav-link" href="#"><i class="fa fa- user"></i>NotificaÃ§Ãµes
		<span class="count">13</span></a> <a class="nav-link" href="#"><i
		class="fa fa -cog"></i>ConfiguraÃ§Ãµes</a> -->
		<a class="nav-link"
		href="index.html"><i class="fa fa-power -off"></i>Sair</a>
		</div>
		</div>

		</div>
		</div>`;

}

function buildLeftPane(){
	document.getElementById("left-panel").innerHTML = `<nav class="navbar navbar-expand-sm navbar-default">
		<div id="main-menu" class="main-menu collapse navbar-collapse">
		<ul class="nav navbar-nav">

		<li class="active"><a href="home.html"><i
		class="menu-icon fa fa-home"></i>Home </a></li>

		<li class="active"><a href="portfolios.html"><i
		class="menu-icon far fa-clipboard"></i>PortfÃ³lio</a></li>

		<li class="active"><a href="consumo.html"><i
		class="menu-icon far fa-chart-bar"></i>Consumo</a></li>

		<!-- /.menu-title -->
		<!--li class="menu-title">Extras</li-->
		<!-- /.menu-title -->
		<!--li class="menu-item-has-children dropdown"><a href="#"
		class="dropdown-toggle" data-toggle="dropdown"
		aria-haspopup="true" aria-expanded="false"> <i
		class="menu-icon fa fa-glass"></i>Pages
		</a>
		<ul class="sub-menu children dropdown-menu">
		<li><i class="menu-icon fa fa-sign-in"></i><a
		href="page-login.html">Login</a></li>
		<li><i class="menu-icon fa fa-sign-in"></i><a
		href="page-register.html">Register</a></li>
		<li><i class="menu-icon fa fa-paper-plane"></i><a
		href="pages-forget.html">Forget Pass</a></li>

		</ul></li-->
		</ul>
		</div>
		<!-- /.navbar-collapse -->
		</nav>`;

}


function formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e)
	}
};



function showLoading(loading) {
	var_loading.push(loading);
	jQuery('#lista-loading').html('');
	if(var_loading.length > 0){
		for(let i = 0; i < var_loading.length; i++){
			let html = "<li>" + var_loading[i] +"</li>"
			jQuery('#lista-loading').append(html);
		}
	}
	jQuery('#preloader .inner').fadeIn();
	jQuery('#preloader').show();
}

function handleError(error,text){

	if(error.status){
		if(error.status == 403){
			Swal.fire({
				title: 'Sua sessÃ£o expirou!',
				text: "Ã‰ necessÃ¡rio relogar para continuar usando.",
				type: 'warning',
				showCancelButton: false,
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Relogar!'
			}).then((result) => {
				if (result.value) {
					window.location.href = "index.html";
				}
			});
		}else if(error.status == 401){
			Swal.fire({
				title: 'Sua sessÃ£o expirou!',
				text: "Ã‰ necessÃ¡rio relogar para continuar usando.",
				type: 'warning',
				showCancelButton: false,
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Relogar!'
			}).then((result) => {
				if (result.value) {
					window.location.href = "index.html";
				}
			});
		}
	}else{
		if(text){
			Swal.fire({
				type: 'error',
				title: 'Ops',
				text: text
			});
		}
	}
}
function hideLoading(loading) {
	var_loading.find(function(value, index) {
		if(value == loading){
			var_loading.splice(index, 1);
			//delete var_loading[index];
		}
	});
	jQuery('#lista-loading').html('');
	if(var_loading.length > 0){
		for(let i = 0; i < var_loading.length; i++){
			let html = "<li>" + var_loading[i] +"</li>"
			jQuery('#lista-loading').append(html);
		}
	}
	setTimeout(() => {
		if(var_loading.length == 0){
			jQuery('#preloader .inner').fadeOut();
			jQuery('#preloader').delay(100).fadeOut('slow');
		}
	}, 1000);

}

function showError(title,message){
	Swal.fire({
		type: 'error',
		title: 'Ops',
		text: message
	})
}

function showMsg(title,message){
	Swal.fire({
		type: 'success',
		title: title,
		text: message
	})
}

function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}

function sweetConsume(){
	return Swal.fire({
		title: 'Essa consulta irÃ¡ consumir sua franquia. Deseja continuar?',
		html:'<a href="consumo.html" target="_blank">Consulte sua franquia atual aqui</a>',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sim',
		cancelButtonText: 'NÃ£o'
	});
}

function base64DecodeUrl(str){
	  if(str!=null){
	    str = (str + '===').slice(0, str.length + (str.length % 4));
	    return str.replace(/-/g, '+').replace(/_/g, '/').replace(/(\r)/g,'').replace('==','');
	  }else return null;
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
  console.log(byteArrays);
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
function sweetCancel(){
	return Swal.fire({
		title: 'VocÃª tem certeza que deseja excluir esse registro?',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sim',
		cancelButtonText: 'NÃ£o'
	});
}

if(typeof L == 'undefined'){

}else{
let porteiraIcon = L.icon({
    iconUrl: 'assets/icons/porteira.png',
    iconSize: [48, 48],
    iconAnchor: [24, 48]
});
let fazendaIcon = L.icon({
    iconUrl: 'assets/icons/fazenda.png',
    iconSize: [48, 48],
    iconAnchor: [24, 48]
});
let incendioIcon = L.icon({
    iconUrl: 'assets/icons/incendio.png',
    iconSize: [48, 48],
    iconAnchor: [24, 48]
});
let nascenteIcon = L.icon({
    iconUrl: 'assets/icons/nascente.png',
    iconSize: [48, 48],
    iconAnchor: [24, 48]
});
}


function extractSentinelDate(identifier){

	//extractSentinelDate('S2A_MSIL1C_20180317T134211_N0206_R124_T21KZV_20180317T170228');

    var spId = identifier.split("_");
    identifier = spId[2];
    spId = identifier.split("T");
    identifier = spId[0];
    identifier = identifier[6]+""+identifier[7]+"/"+identifier[4]+""+identifier[5]+"/"+identifier[0]+""+identifier[1]+""+identifier[2]+""+identifier[3];

    return identifier;

}
