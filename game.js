"USE STRICT"
var units; //global variable so y'all can mess around with it (and so i dont have to link things together in unholy ways
var incrementers;
var containers = [];
var unitDisplay;
var leftovers = 0;
var updater;
var maxLevel = 0;
var incrementerContainer
var upgradeButton
window.onload = function(){main()};
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
	
	so minor problem with the old upgrade logic (above), it turns out that the max bignumber limit is ~157,000 digits
	
	so it will be the same as incrementer pricing, with n being replaced by u
*/

function main() {
	unitDisplay = document.getElementById("units");
	incrementerContainer = document.getElementById("incs");
	incrementers = [0,1];
	units = 0n;
	updater = setInterval(updateUnits, 100);
	document.getElementById("theButton").onclick = function() {modifyUnits(1n)};
	upgradeButton = document.getElementById("nextLevel")
	upgradeButton.onclick = function() {newGenLevel(maxLevel)};
}

function updateUnits() {
	try {
	var change = 0n;
	var changeTemp = 0;
	for (var i = 0; i < incrementers.length; i += 2) {
		var n = incrementers[i];
		var u = incrementers[i + 1];
		changeTemp = (n * (2 ** (i / 2) / 100)) * /*base formula*/ (1 + (u - 1) / u); //upgrades
		leftovers += changeTemp % 1;
		//console.log(leftovers + " " + changeTemp)
		change += BigInt(Math.floor(changeTemp) + Math.floor(leftovers));
		leftovers = leftovers % 1;
	}
	modifyUnits(change);
	} catch (e) {
		document.write("congratulations, you did it. you \"beat\" the game. you broke it. you did something that caused the page to break. im saying you won because you probably went past your browser's memory safeguards on the larger number type (from my experience its around 150,000 digits). now that you've won, go outside, talk to people, do something in your life other than watching this number pointlessly increase. <br>-Zyllable, creator of this god forsaken \"game\"")
		clearInterval(updater);
	}
}

function modifyUnits(change) {
	units = units + change; //change MUST be bigint type
	displayUnits();
}

function displayUnits() {
	unitDisplay.innerText = "Units: " + units.toString();
}

function newGenLevel(level) {
	var amount = 1
	if (buyGen(level, amount)) {
		console.log(incrementerContainer)
		var newGenElement = document.createElement("div");
		//create elements inside
		var temp = new DocumentFragment();
		temp.appendChild(document.createElement("p")); //0
		temp.childNodes[0].innerText = "Incrementer level " + level;
		
		temp.appendChild(document.createElement("p")); //1, empty until upgraded
		
		temp.appendChild(document.createElement("button")); //2 (line break moment)
		temp.childNodes[2].innerText = "Buy incrementer for: " + calcPrice(level, 2);
		//temp.childNodes[2].setAttribute("data-level", level); //want to keep for later in case i need it
		temp.childNodes[2].onclick = function() {buyGenButton(level)};
		
		temp.appendChild(document.createElement("br")); //3
		
		temp.appendChild(document.createElement("button")); //4
		temp.childNodes[4].innerText = "Upgrade for: " + calcUpgradePrice(level, 1);
		//temp.childNodes[4].setAttribute("data-level", level);
		temp.childNodes[4].onclick = function() {buyUpgrade(level)};
		
		console.log(temp)
		newGenElement.appendChild(temp);
	
		containers.push(incrementerContainer);
		incrementerContainer.appendChild(newGenElement);
		maxLevel++;
		upgradeButton.innerText = "Buy next incrementer level for: " + calcPrice(maxLevel, 1)
	}
}

function buyUpgrade(level) { //always on a button
	var cost = calcUpgradePrice(level, getAmounts(level)[1]); //placeholders for now
	if (cost <= units) {
		modifyUnits(cost * -1n);
		incrementers[level * 2 + 1] = incrementers[level * 2 + 1] + 1;
		incrementerContainer.childNodes[level + 1].childNodes[4].innerText = "Buy upgrade for: " + calcUpgradePrice(level, getAmounts(level)[1]);
	}
}
function buyGenButton(level) {
	if (buyGen(level, getAmounts(level)[0])) {
		console.log(level)
		incrementerContainer.childNodes[level + 1].childNodes[2].innerText = "Buy incrementer for: " + calcPrice(level, getAmounts(level)[0]); //one hell of a line
	}
}

function buyGen(level, amount) {
	var cost = calcPrice(level, amount); //placeholders for now
	if (cost <= units) {
		if(!incrementers[level * 2]) {
			incrementers[level * 2] = 0;
			incrementers[level * 2 + 1] = 1;
		}
		
		modifyUnits(cost * -1n);
		incrementers[level * 2] = incrementers[level * 2] + 1;
		return true;
	}
	return false;
}

function calcPrice(level, amount) {
	return 2n ** BigInt(amount * level);
}

function calcUpgradePrice(level, amount) {
	return 	2n ** BigInt(amount * level);
}

function getAmounts(level) { //level starts at 0
	return [incrementers[level * 2], incrementers[level * 2 + 1]]
}