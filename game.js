"USE STRICT"
document.onload = main();
var units; //global variable so y'all can mess around with it

/*
	template for incrementers
	no ids needed, will be kept track of in arrays/variables
	or styles, those will be decided on later
	<div>
		<p>Incrementer Level </p><p>N</p><br>
		<p>N</p><p> upgrades </p><p>(n% boost)</p><br>
		<button>Buy Incrementor for N</button><br>
		<button>Buy Upgrade for N</button>
	</div>
*/

function main() {
	generators = [];
	units = 0n;
	var unitDisplay = document.getElementById("units");
}

function updateUnits() {
	
}

function displayUnits(display) {
	display.innerHTML = "Units: " + units.toString();
}

function makeUnit() {
	
}