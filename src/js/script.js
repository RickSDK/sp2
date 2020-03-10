//This lib contains angularJs assisting functions
function fadeInDivAndPlace(id, className, x, y, miliseconds) {
	var e2 = document.getElementById(id);
	if (e2) {
		e2.style.left = (x).toString() + 'px';
		e2.style.top = (y).toString() + 'px';
	}
	changeClass(id, className + ' fadeOut');
	setTimeout(function () { changeClass(id, className + ' fadeIn'); }, 100);
	setTimeout(function () { fadeOutDiv(id, className); }, miliseconds);
}
function fadeInDiv(id, className) {
	changeClass(id, className + ' fadeOut');
	setTimeout(function () { changeClass(id, className + ' fadeIn'); }, 100);
}
function fadeOutDiv(id, className) {
	var e2 = document.getElementById(id);
	if (e2) {
		if (1 || e2.className == className + ' fadeIn') {
			changeClass(id, className + ' fadeOut');
			setTimeout(function () { turnOffDiv(id, className); }, 1000);
		}
	}
}
function turnOffDiv(id, className) {
	var e2 = document.getElementById(id);
	if (e2) {
		if (e2.className == className + ' fadeOut') {
			changeClass(id, className + ' off');
		}
	}
}
function popupMessage(player, msg, player2, diploFlg) {
	var x = window.pageXOffset;
	var y = window.pageYOffset;
	var centerXs = [0, 307, 635, 856, 1184, 993, 783, 664, 384];
	var centerYs = [0, 314, 208, 142, 275, 450, 445, 535, 507];
	var centerX = centerXs[player.nation];
	var centerY = centerYs[player.nation];
	popupNationMessage(player.nation, msg, player2.nation, centerX, centerY, diploFlg);
}
function fadeOutPopup(id) {
	popupMessageFadeOut(id);
	setTimeout(function () { popupMessageOff(id); }, 1000);
}
function fadeInPopup(id, x, y) {
	var e = document.getElementById(id);
	e.style.left = x + 'px';
	e.style.top = y + 'px';
	e.className = 'popupMsg fadeOut';
	setTimeout(function () { popupMessageFadeIn(id); }, 100);
}
function popupMessageFadeIn(id) {
	document.getElementById(id).style.display = 'block';
	document.getElementById(id).className = 'popupMsg fadeIn';
}
function popupMessageFadeOut(id) {
	document.getElementById(id).className = 'popupMsg fadeOut';
}
function popupMessageOff(id) {
	document.getElementById(id).style.display = 'none';
	document.getElementById(id).className = 'popupMsg off';
}

function selectTextValue() {
	selectedValue = document.getElementById("textField").value;
	e = document.getElementById(selectedID);
	if (e)
		e.innerHTML = selectedValue;

	closeThisPopup('popupTextEntry');
}
function updateButtonFilters(number) {
	updateButtonFiltersForId('buttonFilterX', number);
	updateButtonFiltersForId('buttonFilter', number);
	updateButtonFiltersForId('buttonFilterY', number);
}
function updateButtonFiltersForId(id, num, hideId) {
	for (var i = 1; i <= 7; i++) {
		var e = document.getElementById(id + i);
		if (e)
			e.className = (i == hideId) ? 'btn btn-default hidden-xxs roundButton tight' : 'btn btn-default roundButton tight';
	}
	var e = document.getElementById(id + (num + 1));
	if (e)
		e.className = 'btn btn-primary roundButton tight';
}
function updateTabFiltersForId(id, num, hideId) {
	for (var i = 1; i <= 6; i++) {
		var e = document.getElementById(id + i);
		if (e)
			e.className = (i == hideId) ? 'grayTab hidden-xxs' : 'grayTab';
	}
	var e = document.getElementById(id + (num + 1));
	if (e)
		e.className = 'blueTab';
}
function closeThisPopup(id) {
	var e = document.getElementById("saveButton");
	if (e)
		e.disabled = false;

	var e2 = document.getElementById(id);
	if (e2)
		e2.style.display = 'none';
}
function disableButton(id, disableFlg) {
	var e = document.getElementById(id);
	if (e)
		e.disabled = disableFlg;
}
function verifyServerResponse(status, data) {
	if (status == 'success') {
		if (data.substring(0, 7) == 'Success')
			return true;
		else {
			if (data.length == 0)
				showAlertPopup('Didnt get success text in response');
			else if (data.length < 150)
				showAlertPopup(data);
			else
				showAlertPopup('Unknown Network Error - Server may be down. Try again later.');
		}
	} else
		showAlertPopup('Network Error ' + status);

	console.log('***API ERROR*** status: ', status, data);

	return false;
}
function startSpinner(title, top, submitButton) {
	if (submitButton && submitButton.length > 0)
		disableButton(submitButton, true);
	updateProgressBar(0);
	displayFixedPopup('popupSaving');
	document.getElementById("popupMessage").innerHTML = title;

}
function stopSpinner(submitButton) {
	updateProgressBar(100);
	if (submitButton) {
		var e = document.getElementById(submitButton);
		if (e)
			e.disabled = false;
	}
	setTimeout(function () { turnOffSpinner(); }, 1000);
}
function turnOffSpinner() {
	document.getElementById("popupSaving").style.display = 'none';
}

function showAlertPopup(message, soundFlg) {
	if (soundFlg)
		playSound('error.mp3');
	var e = document.getElementById('alertPopup');
	if (e) {
		displayFixedPopup("alertPopup");
		document.getElementById("alertMessage").innerHTML = message;
	} else {
		displayFixedPopup("alertPopupMain");
		document.getElementById("alertMessageMain").innerHTML = message;
	}
}
function showAlertPopup2(message, index) {
	displayFixedPopup("alertPopup2", index);
	document.getElementById("infoMessage").innerHTML = message;
}
function showAdvancedPopup(message, nation, message2) {
	setTimeout(function () { showAdvancedPopup2(message, nation, message2); }, 2000);
}
function showAdvancedPopup2(message, nation, message2) {
	displayFixedPopup("advancedPopup");
	var superpowers = ['Neutral', 'United States', 'European Union', 'Russian Republic', 'Imperial Japan', 'Communist China', 'Middle-East Federation', 'African Coalition', 'Latin Alliance'];
	setInnerHTMLFromElement("advancedLeader", superpowers[nation]);
	setInnerHTMLFromElement("advancedMessage1", message);
	setInnerHTMLFromElement("advancedMessage2", message2);
	var img = document.getElementById("leaderImg");
	if (img)
		img.src = 'graphics/advisors/leader' + nation + '.jpg';
}
function showConfirmationPopup(message, msgId, index) {
	localStorage.confirmationOption = msgId;
	setInnerHTMLFromElement("confirmationMessage", message)
	displayFixedPopup("confirmationPopup");
}
function showConfirmationPopup2(message, msgId, index) {
	localStorage.confirmationOption = msgId;
	document.getElementById("confirmationMessage2").innerHTML = message;
	displayFixedPopup("confirmationPopup2", index);
}
function displayPopup(name, index) {
	displayThisPopup(name, index);
	var sb = document.getElementById("saveButton");
	if (sb)
		sb.disabled = true;
}
function displayThisPopup(name, index) {
	var e = document.getElementById(name);
	if (e) {
		e.style.display = 'block';
		e.style.top = (window.pageYOffset + 100).toString() + 'px';
		e.style.left = (window.pageXOffset).toString() + 'px';
	}
}
function displayFixedPopup(name, absoluteFlg, topVal) {
	var e = document.getElementById(name);
	if (e) {
		e.style.display = 'block';
		var w = window.innerWidth;
		var rect = e.getBoundingClientRect();
		var left = (w - rect.width) / 2;
		var top = window.pageYOffset;
		if (topVal && topVal > 0)
			top = topVal - 1;

		if (!absoluteFlg)
			top = 10;
		if (left < 0)
			left = 0;
		e.style.left = left.toString() + 'px';
		e.style.top = top.toString() + 'px';
		if (absoluteFlg) {
			e.style.position = 'absolute';
			window.scrollTo(left, top);
		}
	}
}
function confirmResponse(data, message) {
	if (data.substring(0, 7) == 'Success') {
		showAlertPopup(message);
		return true;
	} else {
		showAlertPopup(data);
		return false;
	}
}
function closePopup(id) {
	closeThisPopup(id);
}
function innerHTMLFromElement(id) {
	var e = document.getElementById(id);
	return (e) ? e.innerHTML : "";
}
function setInnerHTMLFromElement(id, val) {
	var e = document.getElementById(id);
	if (e)
		e.innerHTML = val;
}
function toggleElement(id) {
	console.log('toggle!');
	var e = document.getElementById(id);
	if (e.style.display == 'block') {
		e.style.display = 'none';
	} else {
		e.style.display = 'block';
	}
}
function updateProgressBar(num) {
	var e = document.getElementById('progressBar');
	if (e)
		e.style.width = num + '%';
}



//----------------------------------------movement------------------------------
//this.optionType, this.gameObj, this.currentPlayer, this.totalMoveTerrs, this.selectedTerritory
//function showUnitsForMovementBG(type, units, currentPlayer, territories, selectedTerritory, goButton, round, currentPlayer, optionType, svgs) {
function showUnitsForMovementBG(optionType, gameObj, currentPlayer, territories, selectedTerritory) {
	// in combination with: 
	//	showSelectableBox 
	//	$scope.checkMovement = function;
	// 	$scope.checkSendButtonStatus = function
	var obj = {};
	var showConsole = false;
	gameObj.units.sort(function (a, b) { return a.terr - b.terr; });
	obj.moveTerr = [];
	var tUnits = [];
	var terId = 0;
	var maxDist = 2;
	var distObj = {};
	var allyHash = getAllyHash(currentPlayer, selectedTerritory);
	var totalUnitsThatCanMove = 0;
	for (var x = 0; x < gameObj.units.length; x++) {
		var unit = gameObj.units[x];
		if (unit.owner == currentPlayer.nation && unit.mv > 0 && (unit.movesLeft > 0 || unit.terr >= 79)) {

			var movement = (optionType == 'attack' || optionType == 'nuke') ? unit.moveAtt : unit.mv;

			if (optionType == 'cruise')
				movement = 1;
			if (movement >= maxDist)
				maxDist = movement + 1;

			if (unit.terr == terId) {
				if (showConsole)
					console.log('unit for showUnitsForMovement: ', unit.piece, movement, unit.terr);
				if (showSelectableBox(unit, gameObj.territories[terId - 1], selectedTerritory, optionType, 'Go', gameObj.round, currentPlayer)) {
					tUnits.push(unit);
				}
			} else {
				if (terId > 0) {
					var unitTerr = gameObj.territories[terId - 1];
					distObj = distanceBetweenTerrs(unitTerr, selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
					if (showConsole)
						console.log('xxx', maxDist, unitTerr.name, distObj, tUnits);
					if (includeThisTerritoryForDisplay(optionType, unitTerr, selectedTerritory, distObj)) {
						var nUnits = numberOfUnitsThatCanReach(distObj, tUnits, optionType);
						if (nUnits > 0) {
							totalUnitsThatCanMove += nUnits;
							obj.moveTerr.push({ id: terId, nation: unitTerr.nation, name: unitTerr.name, distObj: distObj, units: tUnits, svg: 'svgs[terId-1]', nUnits: nUnits });
							unitHash = {};
						}
					}
				}
				terId = unit.terr;
				tUnits = [];
				maxDist = movement + 1;
				if (showConsole)
					console.log('xxx', unit.piece, movement, unit.terr);
				if (showSelectableBox(unit, gameObj.territories[terId - 1], selectedTerritory, optionType, 'Go', gameObj.round, currentPlayer)) {
					tUnits.push(unit);
				}
			}
		}
	}
	if (tUnits.length > 0) {
		distObj = distanceBetweenTerrs(gameObj.territories[terId - 1], selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
		var unitTerr = territories[terId - 1];
		if (includeThisTerritoryForDisplay(optionType, unitTerr, selectedTerritory, distObj)) {
			var nUnits = numberOfUnitsThatCanReach(distObj, tUnits, optionType);
			if (nUnits > 0) {
				totalUnitsThatCanMove += nUnits;
				obj.moveTerr.push({ id: gameObj.territories[terId - 1].id, nation: gameObj.territories[terId - 1].nation, name: gameObj.territories[terId - 1].name, distObj: distObj, units: tUnits });
			}
		}
	}
	obj.totalUnitsThatCanMove = totalUnitsThatCanMove;
	return obj;
}
function getAllyHash(player, selectedTerritory) {
	var limit = 3;
	if (selectedTerritory && selectedTerritory.id && selectedTerritory.id > 79)
		limit = 2;
	var allyHash = {};
	allyHash[player.nation] = 1;
	var nation = 0;
	player.treaties.forEach(function (treaty) {
		nation++;
		if (treaty >= limit)
			allyHash[nation] = 1;
	});
	return allyHash;
};
function showSelectableBox(unit, fromTerr, toTerr, type, goButton, round, currentPlayer) {
	//	return true; //<-- shows all piece clickable
	if (!fromTerr)
		return false;
	if (type == 'move' && toTerr.id >= 79 && fromTerr.id < 79 && fromTerr.id != toTerr.id && unit.mv2 > 0 && unit.movesLeft > 0) {
		if (unit.piece == 13 && toTerr.cargoSpace > 0 && terrDoesBorder(fromTerr, toTerr))
			return true;
		if (unit.type == 1 && toTerr.transportSpace > 0 && terrDoesBorder(fromTerr, toTerr)) {
			return true;
		}
		if (unit.subType == 'hero' && toTerr.unitCount > 0)
			return true;
		if (unit.subType == 'fighter' && toTerr.carrierSpace > 0)
			return true;
	}
	if (type == 'move' && toTerr.id >= 79 && fromTerr.id >= 79 && fromTerr.id != toTerr.id && unit.cargoOf > 0)
		return false;

	if (unit.type == 3 && unit.cruiseRound == round)
		return false;
	if (type == 'move' && toTerr.id >= 79 && unit.subType == 'fighter' && unit.movesLeft > 0) {
		if (goButton == 'Load These Units' && numberVal(unit.cargoOf) > 0) {
			return false;
		} else
			return true;
	}
	if (type == 'move' && toTerr.id >= 79 && fromTerr.id >= 79 && unit.type == 3 && goButton == 'Load These Units')
		return false;
	if (type == 'loadUnits' && unit.type == 3)
		return true;
	if (type == 'loadPlanes') {
		if (fromTerr.id == toTerr.id && (unit.piece == 2 || unit.piece == 7 || unit.piece == 10 || unit.piece == 11))
			return true;
		else
			return false;
	}
	if (type == 'cruise') {
		if (unit.cruiseRound && unit.cruiseRound == round)
			return false;
		if (unit.piece == 39)
			return true;
		if (!currentPlayer.tech[7])
			return false;
		if (unit.piece == 5 || unit.piece == 9 || unit.piece == 12 || unit.piece == 39)
			return true;
		else
			return false;
	}
	if (type == 'attack' && unit.subType == 'vehicle' && toTerr.id >= 79 && unit.returnFlg)
		return true;
	if (type == 'attack' && unit.piece == 43 && toTerr.id >= 79)
		return false;

	if (fromTerr.nation == 99 && unit.type == 1)
		unit.movesLeft = 1;
	if (unit.movesLeft <= 0)
		return false;
	if (type == 'nuke' && unit.subType != 'missile')
		return false;
	if (type == 'attack' && unit.subType == 'missile')
		return false;
	if (type == 'bomb' && unit.piece != 7)
		return false;
	if (unit.moving)
		return false;
	if (unit.piece == 15 || unit.piece == 19)
		return false;
	if (type == 'loadUnits') {
		/*
		if(unit.subType=='hero' || unit.piece==13)
			return true;
		else
			return false;*/

		if (fromTerr.nation == 99 && unit.type == 1)
			return false;
		if (unit.piece == 7)
			return false;
		return true;
	}
	if (toTerr.nation < 99 && unit.type == 3)
		return false;
	if (toTerr.nation == 99 && unit.type == 1 && unit.subType != 'missile')
		return false;
	if (toTerr.nation == 99 && unit.type == 2 && type == 'move')
		return false;
	if (toTerr.id == fromTerr.id && type != 'attack')
		return false;

	return true;
}
function terrDoesBorder(t1, t2) {
	var borders = t1.borders.split('+');
	for (var x = 0; x < borders.length; x++) {
		var id = borders[x];
		if (id == t2.id)
			return true;
	}
	return false;
}
function distanceBetweenTerrs(terr1, terr2, max, land, air, sea, allyHash, territories) {
	if (terr1.id == terr2.id)
		return { land: land, air: air, sea: sea };

	land++;
	air++;
	sea++;
	var maxLand = 9;
	var maxAir = 9;
	var maxSea = 9;

	//------
	if (terr2.nation < 99)
		sea = 9;
	if ((terr1.id == 99 && terr2.id == 86) || (terr1.id == 86 && terr2.id == 99)) {
		//panama
		if(territories[51].treatyStatus<3)
			sea = 9;
	}
	if ((terr1.id == 115 && terr2.id == 118) || (terr1.id == 118 && terr2.id == 115)) {
		//suez cannal
		if(territories[36].treatyStatus<3 && territories[39].treatyStatus<3)
			sea = 9;
	}

	//------
	//		if(air>=max || (terr1.defeatedByNation>0 && terr1.nation<99))
	//			return {land: maxLand, air: maxAir, sea: maxSea};
	//return {land: 1, air: 1, sea: 1};
	if (air >= max)
		return { land: maxLand, air: maxAir, sea: maxSea };

	if (land > 1 && (terr1.defeatedByNation > 0 || terr1.attackedByNation > 0))
		land = 9;

	//		console.log('here', terr1.id, terr2.id, land);
	var neighbors = terr1.borders.split('+');
	for (var x = 0; x < neighbors.length; x++) {
		var id = neighbors[x];
		//			console.log(id, terr2.id, land);
		if (id == terr2.id) {
			return { land: land, air: air, sea: sea };
		}
		var terr = territories[id - 1];
		var nextLand = land;
		var nextSea = sea;
		if (terr.nation < 99) {
			nextSea = 9;
			if (isTerritoryBlocked(terr1.owner, terr, allyHash))
				nextLand = 9;
		}
		if (terr.nation == 99) {
			nextLand = 9;
			if (isTerritoryBlocked(terr1.owner, terr, allyHash))
				nextSea = 9;
		}

		var obj = distanceBetweenTerrs(terr, terr2, max, nextLand, air, nextSea, allyHash, territories);
		if (obj.land < maxLand)
			maxLand = obj.land;
		if (obj.air < maxAir)
			maxAir = obj.air;
		if (obj.sea < maxSea)
			maxSea = obj.sea;
	}
	return { land: maxLand, air: maxAir, sea: maxSea };
}
function isTerritoryBlocked(fromNation, terr, allyHash) {
	if (terr.owner == fromNation || terr.unitCount == 0)
		return false;
	if (allyHash[terr.owner] == 1)
		return false;
	return true;
}
function includeThisTerritoryForDisplay(type, unitTerr, selectedTerr, distObj, pieceType) {
	if (type == "loadPlanes") {
		if (unitTerr.id == selectedTerr.id)
			return true;
		else
			return false;
	}
	if (type == "loadUnits") {
		if (unitTerr.id == selectedTerr.id)
			return true;
		if (distObj.air == 1 && unitTerr.nation < 99)
			return true;
		return false;
	}
	return true;
}
function numberOfUnitsThatCanReach(distObj, tUnits, optionType) {
	var num = 0;
	tUnits.forEach(function (unit) {
		if (checkMovement(distObj, unit, optionType))
			num++;
	});
	return num;
}
function checkMovement(distObj, unit, optionType) {
	if (optionType == 'loadPlanes') {
		if (unit.type == 1 && (!unit.cargoOf || unit.cargoOf == 0))
			return true;
		else
			return false;
	}
	if (optionType == 'cruise') {
		if (distObj.air == 1)
			return true;
	}
	if (optionType == 'loadUnits') {
		if (distObj.air == 0)
			return true;
	}
	if (unit.type == 1 && unit.terr >= 79) {
		if (distObj.air == 1)
			return true;
		else
			return false;
	}
	var movement = (optionType == 'attack' || optionType == 'bomb' || optionType == 'nuke') ? unit.moveAtt : unit.mv;
	if (unit.type == 1 && distObj.land <= movement)
		return true;
	if ((unit.type == 2 || unit.type == 4 || unit.subType == 'missile') && distObj.air <= movement)
		return true;
	if (unit.type == 3 && distObj.sea <= movement - numberVal(unit.movesTaken))
		return true;
	return false;
}


