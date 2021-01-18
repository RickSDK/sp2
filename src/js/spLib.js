function spVersion() {
	return 'v4.77';
}
function googleAds() {
	window.onload = function () {
		(adsbygoogle = window.adsbygoogle || []).push({});
	}
}
function getScriptV() {
	return 'v3.5';
}
function ngUnitSrc(piece, nation = 0) {
	if (!piece || piece == 0) {
		return "assets/graphics/units/piece1.png";
	}
	if (piece == 11 && nation > 0)
		return "assets/graphics/units/leader" + nation + ".png";
	if (piece < 100)
		return "assets/graphics/units/piece" + piece + "u.png";
	else
		return "assets/graphics/units/piece" + piece + ".gif";
}
function unitOfId(id, nation, pieceId, terrId, pieces, allowMovesFlg) {
	var movesLeft = 0;
	if (allowMovesFlg || pieceId == 6 || pieceId == 13)
		movesLeft = 2;
	var unit = pieces[pieceId];
	var moveAtt = unit.move;
	if (unit.type == 2) {
		moveAtt = unit.move / 2;
	}
	if (unit.id == 14) {
		moveAtt = 2;
	}
	var unit = {
		id: id,
		nation: nation,
		owner: nation,
		piece: pieceId,
		movesLeft: movesLeft,
		type: unit.type,
		att: unit.att,
		att2: unit.att,
		numAtt: unit.numAtt,
		numAtt2: unit.numAtt,
		def: unit.def,
		def2: unit.def,
		mv: unit.move,
		mv2: unit.move,
		moveAtt: moveAtt,
		moveAtt2: moveAtt,
		terr: terrId,
		adLimit: 2,
		move: 0,
		moveFlg: false,
		cas: unit.cas,
		returnFlg: unit.returnFlg || false,
		target: unit.target || 'default',
		type: unit.type,
		subType: unit.subType,
		cargoSpace: cargoSpaceForPiece(unit),
		cargoUnits: cargoUnitsForUnit(unit),
		hp: 100
	};
	if (pieceId == 10) {
		if (nation == 2) {
			unit.att = 3;
			unit.att2 = 3;
		}
		if (nation == 3) {
			unit.att = 3;
			unit.att2 = 3;
		}
		if (nation == 5) {
			unit.att = 2;
			unit.att2 = 2;
			unit.numAtt = 5;
			unit.numAtt2 = 5;
		}
		if (nation == 6) {
			unit.att = 6;
			unit.att2 = 6;
		}
		if (nation == 7) {
			unit.att = 3;
			unit.att2 = 3;
			unit.numAtt = 3;
			unit.numAtt2 = 3;
		}
		if (nation == 8) {
			unit.att = 2;
			unit.att2 = 2;
			unit.def = 5;
			unit.def2 = 5;
			unit.numDef = 3;
		}
	}
	return unit;
}
function getInitialTerritories(player) {
	var gTerritories = [];
	var terrs = getGameTerritories();
	terrs.forEach(function (terr) {
		var unitCount = 0;

		var flag = 'flag' + terr.owner + '.gif';
		if (terr.nation > 0 && terr.owner == 0)
			flag = 'flagn' + terr.nation + '.gif';
		var factoryCount = 0;
		var piece = 0;
		var attStrength = 0;
		var defStrength = 0;
		if (terr.capital) {
			if (terr.nation == 99) {
				unitCount = 2;
				piece = 5;
				attStrength = 2;
				defStrength = 3;
			} else {
				factoryCount = 1;
				unitCount = 8;
				piece = 101;
				flag = 'flagl' + terr.nation + '.gif';
				attStrength = 17;
				defStrength = 24;
			}
		}
		if (terr.nation < 99 && terr.owner == 0) {
			unitCount = 3;
			piece = 2;
			attStrength = 3;
			defStrength = 6;
		}
		var displayUnitCount = '?';
		//		var displayUnitCount = displayCountFromCount(unitCount, terr.owner, player);
		if (terr.nation == 99 && terr.owner == 0)
			flag = 'flag99.gif';

		terr['unitCount'] = unitCount;
		terr['flag'] = flag;
		terr['factoryCount'] = factoryCount;
		terr['piece'] = piece;
		terr['displayUnitCount'] = displayUnitCount;
		terr['bomberCount'] = 0;
		terr['attStrength'] = attStrength;
		terr['defStrength'] = defStrength;
		gTerritories.push(terr);
	});
	return gTerritories;
}
function promoteThisUsertoRank(rank, code) {
	if (rank > 2 && code != 'x1b')
		rank = 2;
	if (rank <= 18) {
		var ranks = getAllRanks();
		setInnerHTMLFromElement('promotionRank', ranks[rank].name);

		document.getElementById('promotionRankImg').src = 'graphics/ranks/rank' + rank + '.png';
		setInnerHTMLFromElement('promotionRankNum', rank);

		displayFixedPopup('promotionPopup');
		localStorage.rank = rank;
	}
}
function getIPInfo(userName, pwd) {
	var code = btoa(pwd);
	$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
		console.log('geoplugin', JSON.stringify(data, null, 2));
		console.log(data, userName, pwd);
		localStorage.ip = data.geoplugin_request;
		var url = getHostname() + "/webCheckForum.php";
		$.post(url,
			{
				user_login: userName || 'test',
				code: code,
				ip: data.geoplugin_request,
				city: data.geoplugin_city,
				region: data.geoplugin_region,
				state: data.geoplugin_regionCode,
				country: data.geoplugin_countryName,
				lat: data.geoplugin_latitude,
				lng: data.geoplugin_longitude,
				action: 'uploadStats'
			},
			function (data, status) {
				console.log(data);
			});
	});
}
function getIPInfo2(userName, pwd) {
	showAlertPopup('ip Request!!', 1);
	var code = btoa(pwd);
	var option = 3;
	if (option == 1)
		$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function (data) {
			console.log('geobytes', JSON.stringify(data, null, 2));
		});
	if (option == 2)
		$.getJSON('https://json.geoiplookup.io/api?callback=?', function (data) {
			console.log('geoiplookup', JSON.stringify(data, null, 2));
		});
	if (option == 3)
		$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
			console.log('geoplugin', JSON.stringify(data, null, 2));
			console.log(data);
			localStorage.ip = data.geoplugin_request;
			var url = getHostname() + "/webCheckForum.php";
			$.post(url,
				{
					user_login: userName || 'test',
					code: code,
					ip: data.geoplugin_request,
					city: data.geoplugin_city,
					region: data.geoplugin_region,
					state: data.geoplugin_regionCode,
					country: data.geoplugin_countryName,
					lat: data.geoplugin_latitude,
					lng: data.geoplugin_longitude,
					action: 'uploadStats'
				},
				function (data, status) {
					console.log(data);
				});
		});
	if (option == 4)
		$.getJSON('http://ip-api.com/json?callback=?', function (data) {
			console.log('ip-api', JSON.stringify(data, null, 2));
		});
	if (option == 5)
		$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function (data) {
			console.log('ipify', JSON.stringify(data, null, 2));
		});
}
function getDisplayUnitCount(terr, gameObj) {
	if (terr.treatyStatus >= 3 || !gameObj.fogOfWar || gameObj.gameOver)
		return terr.unitCount.toString();
	if (gameObj.hardFog && !terr.illuminateFlg) {
		return '?';
	}
	return countToFog(terr.unitCount);
}
function countToFog(count) {
	var unitCount = numberVal(count);
	if (unitCount <= 3)
		return unitCount.toString();
	if (unitCount < 9)
		return '4+';
	if (unitCount < 25)
		return '9+';
	if (unitCount < 50)
		return '25';
	if (unitCount < 99)
		return '50';
	if (unitCount < 200)
		return '100+';
	if (unitCount < 300)
		return '200+';
	if (unitCount < 400)
		return '300+';
	if (unitCount < 500)
		return '400+';
	if (unitCount < 600)
		return '500+';

	return '600+';
}
function displayCountFromCount(unitCount, nation, player, fogOfWar, status, longFormFlg, hardFog, illuminateFlg) {
	var displayUnitCount = unitCount.toString();
	if (displayUnitCount > 99)
		displayUnitCount = 99;
	if (!fogOfWar || status >= 3)
		return unitCount.toString();
	if (fogOfWar && unitCount > 3) {
		displayUnitCount = '4+';
		if (unitCount >= 9)
			displayUnitCount = '9+';
		if (unitCount >= 25)
			displayUnitCount = '25';
		if (unitCount >= 50)
			displayUnitCount = '50';
		if (unitCount >= 99)
			displayUnitCount = '99';
		if (unitCount > 199)
			displayUnitCount = '2h';
		if (unitCount > 299)
			displayUnitCount = '3h';
		if (unitCount > 399)
			displayUnitCount = '4h';
		if (unitCount > 499)
			displayUnitCount = '5h';
		if (longFormFlg && unitCount >= 25) {
			displayUnitCount = '25+';
			if (unitCount >= 50)
				displayUnitCount = '50+';
			if (unitCount > 99)
				displayUnitCount = '100+';
			if (unitCount > 199)
				displayUnitCount = '200+';
			if (unitCount > 299)
				displayUnitCount = '300+';
			if (unitCount > 399)
				displayUnitCount = '400+';
			if (unitCount > 499)
				displayUnitCount = '500+';
		}
	}
	if (hardFog) {
		if (!illuminateFlg)
			displayUnitCount = '?';
	}
	return displayUnitCount;
}
function militaryUnitsFromLine(units, pieces) {
	var unitHash = {};
	units.forEach(function (unit) {
		var count = unitHash[unit.piece] || 0;
		count++;
		unitHash[unit.piece] = count;
	});
	var results = [];
	var keys = Object.keys(unitHash);
	for (x = 0; x < keys.length; x++) {
		var piece = keys[x];
		var name = pieces[piece].name;
		results.push(unitHash[piece] + ': ' + name);
	}
	return results;
}
function randomPlaneRoute() {
	var locs = capitalLocs();
	var num1 = Math.floor((Math.random() * 8));
	var num2 = Math.floor((Math.random() * 8));
	var startLoc = locs[num1];
	var endLoc = locs[num2];
	return { startX: startLoc.x, startY: startLoc.y, endX: endLoc.x, endY: endLoc.y }
}
function capitalLocs() {
	return [{ x: 305, y: 346 }, { x: 632, y: 238 }, { x: 856, y: 173 }, { x: 1183, y: 306 }
		, { x: 990, y: 476 }, { x: 782, y: 474 }, { x: 664, y: 566 }, { x: 381, y: 536 }];
}
function capitalXY(num) {
	var centerXs = [0, 307, 635, 856, 1184, 993, 783, 664, 384];
	var centerYs = [0, 314, 208, 142, 275, 450, 445, 535, 507];
	var obj = {};
	obj.x = centerXs[num];
	obj.y = centerYs[num];
	return obj;
}
function promoteSuperpowersUser(user) {
	displayFixedPopup('promotionPopup');
	playSound('tada.mp3');
}
function scrollToCapital(num) {
	var e = document.getElementById('target');
	if (e) {
		e.style.display = 'block';
		e.className = 'targetFadeOut';
	}
	var x = window.pageXOffset;
	var y = window.pageYOffset;
	var centerXs = [0, 307, 635, 856, 1184, 993, 783, 664, 384];
	var centerYs = [0, 314, 208, 142, 275, 450, 445, 535, 507];
	var centerX = centerXs[num] + 2;
	var centerY = centerYs[num] - 2;
	var count = 0;

	var xFinal = centerX - window.innerWidth / 2;
	var yFinal = centerY - window.innerHeight / 2;
	window.scrollTo(xFinal, yFinal);
	pingNation(centerX, centerY);
}
function smoothScrollToCapital(num) {
	document.getElementById('target').className = 'targetFadeOut';
	var x = window.pageXOffset;
	var y = window.pageYOffset;
	var centerXs = [0, 307, 635, 856, 1184, 993, 783, 664, 384];
	var centerYs = [0, 314, 208, 142, 275, 450, 445, 535, 507];
	var centerX = centerXs[num] + 2;
	var centerY = centerYs[num] - 2;
	var count = 0;

	var xFinal = centerX - window.innerWidth / 2;
	var yFinal = centerY - window.innerHeight / 2;
	window.requestAnimationFrame(annimateScroll);

	function annimateScroll() {
		window.scrollTo(x + (xFinal - x) * count / 100, y + (yFinal - y) * count / 100);
		if (count++ < 100)
			window.requestAnimationFrame(annimateScroll);
		else {
			window.scrollTo(xFinal, yFinal);
			pingNation(centerX, centerY);
		}
	}
}
function pingNation(x, y) {
	playSound('zap.mp3');
	var e2 = document.getElementById('target');
	if (e2) {
		e2.style.left = (x - 103).toString() + 'px';
		e2.style.top = (y + 27).toString() + 'px';
	}
	changeClass('target', 'targetSign fadeOut');
	setTimeout(function () { changeClass('target', 'targetFadeIn'); }, 100);
	setTimeout(function () { changeClass('target', 'targetSign fadeOut'); }, 2000);
	setTimeout(function () { changeClass('target', 'offAndOut'); }, 2500);
}
function locationOfCapital(nation) {
	var locs = capitalLocs();
	return locs[nation - 1];
}
function popupNationMessage(nation1, msg, nation2, x, y, diploFlg) {
	playSound('drip.mp3');
	var boxId = (diploFlg) ? 'popupDiplomacyBox' : 'popupMsgBox';
	setInnerHTMLFromElement((diploFlg) ? 'popupMsgb' : 'popupMsg', msg);
	var e = document.getElementById(boxId);
	e.style.left = x + 'px';
	e.style.top = y + 'px';
	e.className = 'popupMsg fadeOut';
	document.getElementById((diploFlg) ? 'popupFlag1b' : 'popupFlag1').src = 'assets/graphics/images/flag' + nation1 + '.gif';
	document.getElementById((diploFlg) ? 'popupFlag2b' : 'popupFlag2').src = 'assets/graphics/images/flag' + nation2 + '.gif';
	setTimeout(function () { popupMessageFadeIn(boxId); }, 100);
	setTimeout(function () { popupMessageFadeOut(boxId); }, 3000);
	setTimeout(function () { popupMessageOff(boxId); }, 4000);
}
function popupBattleReport(reportObj, boxId='battlePopup') {
	playSound('drip.mp3');
	var e = document.getElementById(boxId);
	if (e) {
		e.style.left = reportObj.terrX + 'px';
		e.style.top = reportObj.terrY + 'px';
		e.className = 'popupMsg fadeOut';
	}
	setTimeout(function () { popupMessageFadeIn(boxId); }, 100);
	setTimeout(function () { popupMessageFadeOut(boxId); }, 3000);
	setTimeout(function () { popupMessageOff(boxId); }, 4000);
}
function popupHistoryMessage(nation1, msg, x, y, type) {
	playSound('drip.mp3');
	var boxId = 'popupHistoryBox' + nation1;
	var e = document.getElementById(boxId);
	e.style.left = x + 'px';
	e.style.top = y + 'px';
	e.className = 'popupMsg fadeOut';
	setTimeout(function () { popupMessageFadeIn(boxId); }, 100);
	setTimeout(function () { popupMessageFadeOut(boxId); }, 3000);
	setTimeout(function () { popupMessageOff(boxId); }, 4000);
}
function awardsForYear(year, awards) {
	var yearAwards = [];
	awards.forEach(function (award) {
		award.title = awardNameForNum(award.awardId)
		if (award.year == year)
			yearAwards.push(award);
	});
	return yearAwards;
}
function ngStyleRank(num1, num2) {
	if (num1 == num2)
		return { 'background-color': 'yellow' };
	if (num1 == 4 || num1 == 7 || num1 == 10 || num1 == 14)
		return { 'background-color': '#ace' };
	else
		return { 'background-color': 'white' };
}
function militaryAdvisorPopup(message, voiceOverId, muteSound) {
	if (voiceOverId > 0)
		playVoiceSound(voiceOverId);

	setTimeout(function () { militaryAdvisorPopup2(message); }, 2000);
}
function militaryAdvisorPopup2(message) {
	playSound('clearThroat.mp3');
	displayFixedPopup("advisorPopup");
	setInnerHTMLFromElement("advisorMessage", message);
}
function showTreatyConfirmationPopup(message, msgId, nation) {
	localStorage.confirmationOption = msgId;
	setInnerHTMLFromElement("treatyConfirmationMessage", message);
	//document.getElementById("treatyConfirmationMessage").innerHTML = message;
	document.getElementById("treatyFlag").src = "assets/graphics/images/flag" + nation + ".gif";
	displayFixedPopup("treatyConfirmationPopup");
}
function displayTerrPopup(name, terr, moveFlg) {
	var e = document.getElementById(name);
	if (e) {
		e.style.display = 'block';
		var w = window.innerWidth;
		var rect = e.getBoundingClientRect();
		var left = window.pageXOffset + (w - rect.width) / 2;
		if (w > 800) {
			left = terr.x;
			if (moveFlg) {
				left = rect.x + 200;
				if (left > 850)
					left = rect.x - 300;
			}
			if (left > 900)
				left = 900;
		}
		e.style.left = left.toString() + 'px';
		var top = terr.y - 60;
		if (top < 100)
			top = 100;
		if (top > 200)
			top = 200;
		e.style.top = top.toString() + 'px';
	}
}
function clearCurrentGameId() {
	localStorage.removeItem('currentGameId');
	localStorage.removeItem('startingNation');
	localStorage.currentGameId = 0;
}
function computerAnnouncement(user, msg) {
	console.log('computerAnnouncement', msg);
	const url = getHostname() + "/webSuperpowers.php";
	var body = JSON.stringify({ user_login: user.userName, code: user.code, action: 'computerAnnouncement', msg: msg });

	const postData = {
		method: 'POST',
		headers: new Headers(),
		body: body
	};
	fetch(url, postData).then((resp) => resp.text())
		.then((data) => {
			console.log(data);
		})
		.catch(error => {
		});
}

