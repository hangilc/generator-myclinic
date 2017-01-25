let params = window["params"];

let e = document.getElementById("params");
if( e !== null ){
	e.appendChild(document.createTextNode(JSON.stringify(params, null, 2)));
}

