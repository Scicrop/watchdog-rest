$.noConflict();

jQuery(document).ready(function($) {
	readAlerts();
	reload();
});

function reload(){
	setTimeout(function(){ readAlerts(); }, 30000);
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
    document.getElementById("clock").innerHTML = strDateTime;
}


function readAlerts(){

	getAltertsOut(function(data) {callbackGetAltertsOut(data);})

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

function callbackGetAltertsOut(data){
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
	}
	document.getElementById("alert-list").innerHTML = listHtml;
	document.getElementById("alert-card").innerHTML = cardHtml;
}

function parseCard(name, description, level){
	let levelType = 'bg-primary';
	if(level == 1) levelType = 'bg-danger';
	let cardHtml = '<div class="card text-white '+levelType+' mb-3"><div class="card-header">'+name+'</div><div class="card-body"><h1 class="card-title">'+description+'</h1></div></div>';
	return cardHtml;
}
