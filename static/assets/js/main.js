var full_time_count = 0;
var source_content = "";
var FULL_SETTING = 2;
var is_full_enabled = false;

$.noConflict();

jQuery(document).ready(function($) {
	readAlerts();
	reload();
});

function reload(){
	setInterval(function(){ readAlerts(); }, 30000);
}


function addZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

function getDateTime(){
	var now = new Date();
    var strDateTime = [[addZero(now.getDate()),
        addZero(now.getMonth() + 1),
        now.getFullYear()].join("/"),
        [addZero(now.getHours()),
        addZero(now.getMinutes())].join(":"),
        now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    document.getElementById("navBarAlert").innerHTML = strDateTime;
}


function readAlerts(){
	if(is_full_enabled == false && full_time_count < FULL_SETTING) getDateTime();
	getAltertsOut(function(data) {callbackGetAltertsOut(data);})
	full_time_count++;
}


function getAltertsOut(callback){

	jQuery.ajax({
		url:'services_out.json',
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'GET',
		dataType: 'json',
		success: function (data) {

			callback(data);

		}
	});
}

function setFullIframe(url){
	source_content = document.getElementById('content').innerHTML;
	document.getElementById('content').innerHTML = "";
	document.getElementById('full_iframe').style.width="100%";
	document.getElementById('full_iframe').style.height="1000px";
	document.getElementById('full_iframe').src = url;
}

function backSourceContent(){
	document.getElementById('full_iframe').style.width="1px";
	document.getElementById('full_iframe').style.height="1px";
	document.getElementById('full_iframe').src = "#";
	document.getElementById('content').innerHTML = source_content;
}

function callbackGetAltertsOut(data){
	console.log(full_time_count);
	console.log(data);
	let description = '';
	let listHtml = '';
	let cardHtml = '';
	for (var i = 0; i < data.length; i++) {
		let levelType = 'list-group-item-primary';
		if(data[i].level == 1) levelType = 'list-group-item-danger';
		if(data[i].response.description != null) description = ' ['+data[i].response.description+']';
		else description = '';
		if(data[i].style == 'list') listHtml= listHtml + '<a href="#" class="list-group-item list-group-item-action '+levelType+'"><i class="fa fa-check" aria-hidden="true"></i> &nbsp;'+data[i].serviceName+': '+data[i].response.value+description+'</a>\n';
		else if(data[i].style == 'card') cardHtml = cardHtml + parseCard(data[i].serviceName, data[i].response.value+description, data[i].level);
		else if(data[i].style == 'full' && full_time_count == FULL_SETTING){
			 setFullIframe(data[i].response.value);
			 is_full_enabled = true
		}
	}
	if(is_full_enabled && full_time_count > FULL_SETTING){
		full_time_count = 0;
		is_full_enabled = false;
		backSourceContent();
	}else if(is_full_enabled == false && full_time_count < FULL_SETTING){
		document.getElementById("alert-list").innerHTML = listHtml;
		document.getElementById("alert-card").innerHTML = cardHtml;
	}
}

function parseCard(name, description, level){
	let levelType = 'bg-primary';
	if(level == 1) levelType = 'bg-danger';
	let cardHtml = '<div class="card text-white '+levelType+' mb-3"><div class="card-header">'+name+'</div><div class="card-body"><h1 class="card-title">'+description+'</h1></div></div>';
	return cardHtml;
}
