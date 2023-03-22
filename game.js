"USE STRICT"
var units; //global variable so y'all can mess around with it (and so i dont have to link things together in unholy ways
var incrementers;
var containers = [];
var unitDisplay;
var leftovers = 0;
var updater;
document.onload = main();
/*
	notes since i dont have anywhere else for documentation (yet)
	
	template for incrementers
	no ids needed, will be kept track of in arrays/variables
	or styles, those will be decided on later
	<div>
		<p>Incrementer Level </p><p>N</p><br>
		<p>N</p><p> upgrades </p><p>(n% boost)</p><br>
		<button>Buy Incrementor for N</button><br>
		<button>Buy Upgrade for N</button>
	</div>
	
	incrementers will be stored in the array as [..., amount, upgrades, ...]
	
	prices and output shall be (where n is generator number and l is incrementer level and u is upgrades + 1)
	
	purchase incrementer = 2^(n*L)
	incrementer output = 2^(L-1) every 10 seconds, floored when combined with upgrade percentages, figure out calculation logic later
	purchase upgrade = 2^(u^(L+1)) (1 upgrade automatically for logic reasons)
	upgrade boost = u - 1 / u
*/

function main() {
	unitDisplay = document.getElementById("units");
	incrementers = [0,1];
	units = 0n;
	updater = setInterval(updateUnits, 100);
	document.getElementById("theButton").onclick = modifyUnits(1n);
	document.getElementById("nextLevel").onclick = newGenLevel();
}

function updateUnits() {
	var change = 0n;
	var changeTemp = 0;
	for (var i = 0; i < incrementers.length; i += 2) {
		var n = incrementers[i];
		var u = incrementers[i + 1];
		changeTemp = (n * (2 ** (i / 2) / 100)) * /*base formula*/ (1 + (u - 1) / u); //upgrades
		leftovers += changeTemp % 1;
		change += BigInt(Math.floor(changeTemp) + Math.floor(leftovers));
		leftovers = leftovers % 1;
	}
	modifyUnits(change);
}

function modifyUnits(change) {
	units = units + change; //change MUST be bigint type
	displayUnits();
}

function displayUnits() {
	unitDisplay.innerText = "Units: " + units.toString();
}

function newGenLevel() {
	var level = 0
	var amount = 0
	if (buyGen(level, amount)) {
		incrementerContainer = document.getElementById("incs");
		var newGenElement = document.createElement("div");
		//create elements inside
		var temp = []
		temp[0] = document.createElement("p"); //0
		temp[0].innerText = "Incrementer level " + level;
		
		temp[1] = document.createElement("br"); // 1
		
		temp[2] = document.createElement("p"); //2, empty until upgraded
		
		temp[3] = document.createElement("br"); // 3
		
		temp[4] = document.createElement("button"); //4
		temp[4].innerText = "Buy incrementer for: " + calcPrice(level, amount);
		
		temp[5] = document.createElement("br"); //5
		
		temp[6] = document.createElement("button"); //6
		temp[6].innerText = "Upgrade for: " + calcUpgradePrice();
		
		newGenElement.appendChild(temp); //todo: test if this works or if i have to convert it to a chunk of elements
	
		containers.push(incrementerContainer);
		incrementerContainer.appendChild(newGenElement);
	}
}

function buyGen(level, amount) {
	var cost = calcPrice(level, amount); //placeholders for now
	if (cost <= units) {
		modifyUnits(cost * -1n);
		incrementers[level * 2] = incrementers[level * 2] + 1;
		return true;
	}
	return false;
}

function calcPrice(level, amount) {
	return 2 ** (amount * level);
}

function calcUpgradePrice(level, amount); {
	return 	2 ** (amount ** (level + 1));
}
