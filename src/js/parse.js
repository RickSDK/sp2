function userObjFromUser() {
	var spFlg = localStorage.spFlg || '';
	if (spFlg != 'Y') {
		localStorage.rank = 0;
		localStorage.userName = 'Guest';
		localStorage.spFlg = 'Y'; //make sure no one grandfathers in
	}

	var userObj = {};
	if (localStorage.userObj && localStorage.userObj.length > 0) {
		userObj = JSON.parse(localStorage.userObj);
	} else {
		console.log('creating new user');
		userObj.userName = localStorage.userName || 'Guest';
		userObj.rank = 0;
		userObj.code = '';
		userObj.password = '******';
		userObj.userGraphic = '';
		userObj.avatar = 'avatar5.jpg';
		userObj.ip = '';
		userObj.speedType = '';
		userObj.imgSrc = 'assets/graphics/avatars/' + userObj.avatar;
		//http://www.superpowersgame.com/graphics/avitars/avatar10.jpg
		userObj.userId = 0;
		userObj.empCount = 0;
		userObj.league_id = 0;
		saveUserObj(userObj);
	}
	return userObj;
}
function saveUserObj(userObj) {
	localStorage.userObj = JSON.stringify(userObj);
}
function logOutUser() {
	localStorage.userName = '';
	localStorage.rank = 2;
	localStorage.password = '';
	localStorage.userObj = '';
}
function parseServerDataIntoUserObj(data, saveFlg = false) {
	var userObj = userObjFromUser();

	var f = data.split('|');
	var x = 1;
	userObj.userName = f[x++];
	userObj.rank = numberVal(f[x++]);
	userObj.gold_member_flg = f[x++];
	userObj.forumCount = numberVal(f[x++]);
	userObj.mailCount = numberVal(f[x++]);
	userObj.urgentCount = numberVal(f[x++]);
	userObj.forum_last_login = f[x++];
	userObj.gamesTurn = numberVal(f[x++]);
	userObj.userId = numberVal(f[x++]);
	userObj.empCount = numberVal(f[x++]);
	userObj.games_max = numberVal(f[x++]);
	userObj.newlyStarted = numberVal(f[x++]);
	userObj.newlyCompleted = numberVal(f[x++]);
	userObj.ip = f[x++];
	userObj.userGraphic = f[x++];
	userObj.wins = numberVal(f[x++]);
	userObj.losses = numberVal(f[x++]);
	userObj.points = numberVal(f[x++]);
	userObj.mmWins = numberVal(f[x++]);
	userObj.mmLosses = numberVal(f[x++]);
	userObj.mmPoints = numberVal(f[x++]);
	userObj.code = this.btoa(localStorage.password);

	if (userObj.userName != localStorage.userName) {
		showAlertPopup('whoa usernames out of sync! Log out!', 1);
	}

	if (saveFlg)
		saveUserObj(userObj);

	return userObj;
}

function getMultObjFromLine(line) {
	var obj = new Object;
	var c = line.split('|');
	obj.netRank = numberVal(c[4]);
	obj.chatMsg = c[5];
	obj.updateNeededCount = numberVal(c[6]);
	obj.userGraphic=userGraphicFromLine(c[7]);
	obj.lastestUser = c[8];
	obj.mailCount = numberVal(c[9]);
	obj.urgentCount = numberVal(c[10]);
	obj.newGame = c[11];
	obj.oldGame = c[12];
	obj.gameResult = c[13];
	obj.minutes = c[14];
	obj.myEMPCount = c[15];
	obj.wins = c[16];
	obj.losses = c[17];
	obj.points = c[18];
	obj.mmWins = c[19];
	obj.mmLosses = c[20];
	obj.mmPoints = c[21];
	obj.newsMsg = c[22];
	obj.league_id = numberVal(c[23]);
	obj.confirmEmailFlg = c[24];
	obj.confirmTextFlg = c[25];
	obj.email_flg = c[26];
	obj.textFlg = c[27];
	return obj;
}
function userFromLine(line) {
	var sections = line.split('<br>');
	if (sections.length < 4) {
		console.log('Invalid user line!');
		return;
	}
	var c = sections[1].split('|');
	var awards = sections[2].split('|');
	var lad = sections[3].split('|');
	var currentGames = sections[4].split('<a>');
	var obj = new Object;
	var x = 0;
	obj.user_id = c[x++];
	obj.name = c[x++];
	obj.first_name = c[x++];
	obj.email = c[x++];
	obj.city = c[x++];
	obj.state = c[x++];
	obj.created = c[x++];
	obj.phone = c[x++];
	obj.text_msg = c[x++];
	obj.rank = numberVal(c[x++]);
	if (obj.rank.length == 0)
		obj.rank = '0';
	obj.graphic = userGraphicFromLine(c[x++]);
	obj.chat_color = c[x++];
	obj.activity_level = c[x++];
	obj.chat_color = c[x++];
	obj.total_num_turns = c[x++];
	obj.total_num_mins = c[x++];
	obj.message = c[x++];
	obj.year_born = c[x++];
	obj.game_count = c[x++];
	obj.new_mail_flg = c[x++];
	obj.away_flg = c[x++];
	obj.away_msg = c[x++];
	obj.email_flg = c[x++];
	obj.wins = c[x++];
	obj.losses = c[x++];
	obj.streak = streakFromNumber(c[x++]);
	obj.last10 = last10FromLine(c[x++]);
	obj.points = c[x++];
	obj.ranking = c[x++];
	obj.games = c[x++];
	obj.winning_streak = streakFromNumber(c[x++]);
	obj.losing_streak = streakFromNumber(c[x++]);
	obj.rating = c[x++];
	obj.place = c[x++];
	obj.winsThisYear = c[x++];
	obj.updateNeededCount = c[x++];
	obj.country = c[x++];
	obj.confirmEmailFlg = c[x++];
	obj.confirmTextFlg = c[x++];
	obj.phone = c[x++];
	obj.text_msg = c[x++];
	obj.providerNum = c[x++];
	obj.textFlg = c[x++];
	obj.email_flg = c[x++];
	obj.lastLogin = c[x++];
	obj.gold_member_flg = c[x++];
	obj.last10Games = c[x++];
	obj.chat_font = c[x++];

	obj.flag = flagOfCountry(obj.country);
	obj.age = '';
	if (obj.year_born > 1900)
		obj.age = 2018 - obj.year_born;
	var minutes = 0;
	if (obj.total_num_turns > 0)
		minutes = obj.total_num_mins / obj.total_num_turns;
	obj.turnSpeed = parseInt(minutes / 60);
	obj.speedType = speedTypeFromMin(minutes);
	var seconds = getDateFromString(obj.lastLogin);
	if (seconds < 0)
		seconds = 11;
	obj.last_login_time = parseInt(seconds / 3600);



	obj.awards = awardsListFromAwards(awards);

	var ladder = new Object;
	var x = 0;
	ladder.ladder = lad[x++];
	ladder.pool = lad[x++];
	ladder.points = lad[x++];
	ladder.rank = lad[x++];
	ladder.active_flg = lad[x++];
	ladder.regular_points = lad[x++];
	ladder.wins = lad[x++];
	ladder.losses = lad[x++];
	ladder.streak = streakFromNumber(lad[x++]);
	ladder.winning_streak = streakFromNumber(lad[x++]);
	ladder.losing_streak = streakFromNumber(lad[x++]);
	ladder.last10 = last10FromLine(lad[x++]);
	ladder.games_playing = lad[x++];
	ladder.games_max = lad[x++];
	ladder.status = lad[x++];
	ladder.last_streak = lad[x++];
	ladder.previous_rank = lad[x++];
	ladder.league_rank = lad[x++];
	obj.last_game_time = lad[x++];
	obj.ladder = ladder;

	//-----------currentGames
	obj.currentGames = [];
	currentGames.forEach(function (line) {
		var game = currentGameFromLine(line);
		if (game.id > 0)
			obj.currentGames.push(game);
	});

	//-----------last20 games
	var last10Games = sections[5].split('<a>');
	obj.last10Games = [];
	last10Games.forEach(function (line) {
		var game = currentGameFromLine(line);
		if (game.id > 0)
			obj.last10Games.push(game);
	});
	if (numberVal(obj.ladder.ladder) > 0 && numberVal(obj.ladder.games_max) > 0)
		obj.league_id = numberVal(obj.ladder.ladder);

	//-----------saved games
	if (sections.length > 6) {
		var savedGames = sections[6].split('<a>');
		obj.savedGames = [];
		savedGames.forEach(function (line) {
			if (line.length > 4) {
				var game = currentGameFromLine(line);
				if (game.id > 0)
					obj.savedGames.push(game);
			}
		});
	}

	return obj;
}
function currentGameFromLine(line) {
	var c = line.split('|');
	var obj = { id: c[0], name: c[1], nation: c[2], round: c[3], result: c[4] }
	return obj;
}
function awardsListFromAwards(awards) {
	var aList = [];
	awards.forEach(function (awardStr) {
		var pieces = awardStr.split('+');
		var year = pieces[1];
		if (year > 0)
			aList.push({ awardId: pieces[0], year: pieces[1] });
	});
	return aList;
}
function messageFromLine(line) {
	var c = line.split("|");
	var obj = new Object;
	var x = 0;
	obj.round = c[x++];
	obj.nation = c[x++];
	if (obj.nation == '')
		obj.nation = '0';
	obj.name = c[x++];
	obj.fontcolor = c[x++];
	obj.message = c[x++];
	obj.created = c[x++];
	obj.newFlg = c[x++];
	obj.delFlg = c[x++];
	obj.rowId = c[x++];
	obj.fontface = c[x++];
	if (!obj.fontface || obj.fontface.length == 0)
		obj.fontface = 'verdana';
	return obj;
}
function gameFromLine(line, userName) {
	//	console.log(line);
	var c = line.split("|");
	var obj = new Object;
	var x = 0;
	obj.gameId = c[x++];
	obj.name = c[x++];
	obj.turn = c[x++];
	obj.round = c[x++];
	obj.attack = c[x++];
	obj.timeLeft = c[x++];
	obj.height = c[x++];
	obj.playerList = c[x++];
	obj.myNation = c[x++];
	obj.highlight = c[x++];
	obj.status = c[x++];
	obj.gameType = c[x++];
	obj.size = c[x++];
	obj.autoStart = (c[x++] == 'Y');
	obj.autoSkip = (c[x++] == 'Y');
	obj.fogofwar = (c[x++] == 'Y');
	obj.version = c[x++];
	obj.lastLogin = c[x++];
	obj.playerList2 = c[x++];
	obj.hostId = c[x++];
	obj.host = c[x++];
	obj.inGame = (c[x++] == 'Y');
	obj.auto_assign_flg = (c[x++] == 'Y');
	obj.restrict_units_flg = (c[x++] == 'Y');
	obj.no_stats_flg = (c[x++] == 'Y');
	obj.topPlayer1 = c[x++];
	obj.topPlayer2 = c[x++];
	obj.nationsPicked = c[x++];
	obj.needToChooseNation = (c[x++] == 'Y');
	obj.top1 = c[x++];
	obj.top2 = c[x++];
	obj.secondsElapsed = c[x++];
	obj.newEngineFlg = (c[x++] == 'Y');
	var userInfo = c[x++];
	obj.lastUpdDate = new Date(c[x++]);
	obj.prevLoginDate = new Date(c[x++]);
	obj.chatFlg = (c[x++] == 'Y');
	obj.bugFlg = (c[x++] == 'Y');
	obj.minRank = c[x++] || 0;
	obj.maxRank = c[x++] || 0;
	obj.ladder_id = c[x++] || 0;
	obj.password = c[x++] || '';
	obj.hardFog = (c[x++] == 'Y');
	obj.turboFlg = (c[x++] == 'Y');


	obj.mmFlg = (obj.ladder_id && obj.ladder_id > 0);

	var dif = obj.prevLoginDate.getTime() - obj.lastUpdDate.getTime();
	obj.seconds = parseInt(dif / 1000);
	obj.newActionFlg = (obj.seconds < 0);

	obj.turnObj = getUserObjFromLine(userInfo);
	obj.turnObj.timeLeft = obj.timeLeft;
	//	console.log(obj.turnObj);
	if (obj.status == 'Open' || obj.status == 'Picking Nations')
		obj.turn = '-';
	if (obj.status == 'Picking Nations' && obj.needToChooseNation == 'Y')
		obj.turn = userName;
	obj.players = [];
	var players = obj.playerList2.split(',');
	for (var i = 1; i <= players.length; i++) {
		var playerStr = players[i - 1];
		var c = playerStr.split('+');
		var nation = c[2];
		if (nation.length == 0)
			nation = '0';
		var top = (c[4] == 'Y');
		var minutesReduced = numberVal(c[7]);
		var clock = (24 - Math.round(minutesReduced / 60));
		var turnFlg = c[0] == obj.turnObj.name;
		obj.players.push({ id: c[1], name: c[0], nation: nation, turnFlg: turnFlg, income: c[3], top: top, team: c[5], futureTeam: c[6], minutesReduced: c[7], rank: c[8], clock: clock });
	}
	obj.joinGameFlg = (obj.status == 'Open' && !obj.inGame);
	obj.numPlayers = obj.players.length;
	obj.type = gameTypeNameForType(obj.gameType);
	//	console.log(obj.name, obj.seconds);
	return obj;
}
function entrantFromLine(line) {
	var c = line.split("|");
	var obj = new Object;
	var x = 0;
	obj.id = c[x++];
	obj.userId = c[x++];
	obj.name = c[x++];
	obj.city = c[x++];
	return obj;
}
function leaderFromLine(line) {
	var c = line.split("|");
	var obj = new Object;
	var x = 0;
	obj.name = c[x++];
	obj.id = c[x++];
	obj.junkId = c[x++];
	obj.rank = numberVal(c[x++]);
	obj.points = numberVal(c[x++]);
	obj.wins = numberVal(c[x++]);
	obj.losses = numberVal(c[x++]);
	obj.games = numberVal(obj.wins) + numberVal(obj.losses);
	obj.games_playing = numberVal(c[x++]);
	obj.games_max = numberVal(c[x++]);
	obj.stk = numberVal(c[x++]);
	obj.streak = streakFromNumber(obj.stk);
	obj.last10 = c[x++];
	obj.l10 = last10FromLine(obj.last10);
	obj.activity = c[x++];
	obj.minPerTurn = c[x++];
	obj.gold_member_flg = c[x++];
	obj.winning_streak = streakFromNumber(c[x++]);
	obj.losing_streak = streakFromNumber(c[x++]);
	obj.last_game_time = c[x++];
	obj.ip = c[x++];
	obj.country = c[x++];
	obj.city = c[x++];
	obj.email = c[x++];
	obj.graphic = userGraphicFromLine(c[x++]);
	obj.mygames_last_login = c[x++];
	obj.days_old = numberVal(c[x++]);
	obj.league_id = numberVal(c[x++]);

	if (obj.league_id == 0)
		obj.league_id = 1;
	obj.flag = flagOfCountry(obj.country);

	obj.hoursSinceLogin = getHoursSinceLogin(obj.mygames_last_login);

	var seconds = getDateFromString(obj.last_game_time);
	obj.hoursWaiting = parseInt(seconds / 3600);
	obj.turnSpeed = parseInt(obj.minPerTurn / 60);
	obj.speedType = speedTypeFromMin(obj.minPerTurn);

	//	console.log(obj.name, obj.minPerTurn, obj.turnSpeed, obj.speedType)
	if (obj.rank < 2)
		obj.rank = 2;
	return obj;
}
function flagOfCountry(country) {
	if (!country || country == 'null')
		return 'World.jpg';

	var cName = country.replace(" ", "_");
	var fileName = cName + '.png';

	return fileName;
	/*
	if(imageExist('graphics/flags/'+fileName))
		return fileName;
	else
		return 'World.jpg'*/
}
function imageExist(url) {
	var img = new Image();
	img.src = url;
	return img.height != 0;
}
function awardFromLine(line) {
	var c = line.split("|");
	var obj = new Object;
	var x = 0;
	obj.name = c[x++];
	obj.rank = c[x++];
	obj.numAwards = c[x++];
	return obj;
}
function userGraphicFromLine(line) {
	if (!line || line.length == 0)
		return 'soldier.JPG';
	else
		return line;
}
function speedTypeFromMin(minutes) {
	var turnSpeed = parseInt(minutes / 60);
	var speedType = 2;
	if (turnSpeed < 5)
		speedType = 1;
	if (turnSpeed >= 7)
		speedType = 3;
	return speedType;
}
function getUserObjFromLine(line) { //userFromLine
	var c = line.split('+');
	graphic = userGraphicFromLine(c[2]);
	var minutes = c[5];
	var turnSpeed = parseInt(minutes / 60);
	var speedType = speedTypeFromMin(minutes);

	var seconds = getDateFromString(c[3]);
	if (seconds < 0)
		seconds = 11;
	var last_login_time = parseInt(seconds / 3600);

	if (last_login_time <= 0)
		last_login_time = 0;
	return { id: c[0], seconds: seconds, name: c[1], graphic: graphic, last_login: c[3], last_login_time: last_login_time, activity: c[4], minutes: c[5], rank: numberVal(c[6]), turnSpeed: turnSpeed, speedType: speedType, nation: c[7], textFlg: c[8] }
}
