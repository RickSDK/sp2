(function(angular) {
  'use strict';
var app = angular.module('ptpApp', ["ngRoute"]);
  app.controller('Controller', ['$scope', '$location', function($scope, $location) {
	//global variables------------------------
	//showUnitsForMovement
	//#dark blue: #007
	//#medium blue: #337ab7
	//#light blue: #ace
	//#btn btn-primary roundButton
	// change order of play
	// update SP_GAME set turn = '47068' where row_id = 10822
	$scope.adminMode=false; //fixBoard
	$scope.showCPUMoves=false;
	$scope.androidVer=false;
	var versionNum = '2.5.3';
	$scope.version='Web '+versionNum; //$scope.appVersion
	if($scope.androidVer)
		$scope.version='Android '+versionNum; //$scope.appVersion
	$scope.mfVersion = 'v1.4';
	$scope.currentDBVersion = 'v0.18'; //<-- do not edit!
	$scope.gUnits = populateUnits();
	var PTPDB = {};
	$scope.introAudio = new Audio('music/ground_squad.mp3');
	$scope.introAudio.loop = true;
	$scope.introAudio.volume=0.3;
	$scope.gameMusic = new Audio('music/menu.mp3'); //audio.
	$scope.gameMusic.loop = true;
	$scope.gameMusic.volume=0.3;
	$scope.nations = ['Random','USA','Germany','Russia','Japan','Indo-China','Saudi Arabia','Congo','Brazil'];
	$scope.firstAttack = ['Random','Quebec','Ukrain','Ukrain','Mongolia','India','Algeria','Angola','Bolivia'];
	$scope.superpowers = ['Neutral','United States','European Union','Russian Republic','Imperial Japan','Communist China','Middle-East Federation','African Coalition','Latin Alliance'];
	$scope.technology = getTechs();
	$scope.gTerritories = getGameTerritories();
	$scope.gameObj = {};
	$scope.battle={};
	$scope.isMobile=isMobile();
	$scope.militaryRanks=getAllRanks();
	$scope.gold_member_flg = localStorage.gold_member_flg;
	var adsbygoogle = window.adsbygoogle || [];
	//	$scope.gameInProgressFlg = (localStorage.currentGameId && localStorage.currentGameId>0);
	//global variables------------------------

	//execute code----------------------------
	$scope.displaySPPopup=function(name) {
		playClick($scope.muteSound);
		console.log(name);
		displayFixedPopup(name, true);
	}
	$scope.closeSPPopup=function(id) {
		playClick($scope.muteSound);
		closePopup(id);
	}
	$scope.gotoSPPage=function(page) {
		window.location = "index.html#!/"+page;
	}
	$scope.spMessage=function(msg) {
		showAlertPopup(msg);
	}
	$scope.uploadStrategyPressed=function(selectedUnit) {
		$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
		console.log(selectedUnit);
		var strategyText = $('#strategyText').val();
		if(strategyText.length==0) {
			showAlertPopup('no text',1);
			return;
		}
		startSpinner('Uploading...', '150px', 'uploadStrategyButton');
		var url = getHostname()+"/webSuperpowers.php";
		    $.post(url,
		    {
		        action: 'uploadStrategy',
		        user_login: $scope.user.userName,
		        code: $scope.user.code,
		        strategyText: strategyText,
		        unitId: selectedUnit.id
		    },
		    function(data, status){
		    	console.log(data);
		    	disableButton('uploadStrategyButton', false);
		    	stopSpinner();
		    	if(verifyServerResponse(status, data)) {
			    	changeClass('unitsPopup', 'popupScreenClosed');
			    	showAlertPopup('Message Posted');
		    	}
		    });
	}
	$scope.showRanks=function(rank) {
		$scope.highlightedRank=rank;
		displayFixedPopup('ranks', true);
	}
	$scope.ngStyleRank=function(num1, num2) {
		if($scope.highlightedRank && $scope.highlightedRank>0 && num1==$scope.highlightedRank)
			return {'background-color':'yellow'};
		return ngStyleRank(num1, num2);
	}
	$scope.ngStyleActivity=function(activity) {
		if(activity==3)
			return {'background-color': '#0f0'};
		if(activity==2)
			return {'background-color': 'yellow'};
		if(activity==1)
			return {'background-color': 'red'};
		return {'background-color': 'black'};
	}
	$scope.ngStyleSpeed=function(num) {
		if(num==2)
			return {'background-color': 'yellow'}
		if(num==3)
			return {'background-color': 'orange'}
		return {'background-color': '#CFC'}
	}
	$scope.ngStyleLogs=function(nation) {
		var colors=['#ffc','#ccf','#ccc','#db6','#fcc','#cfc','#ffc','#fcf','#cff','#666'];
		var color=colors[nation];
		return {'background-color': color};
	}
	$scope.ngStyleGameRow=function(num) {
		if(num%2==0)
			return {'background-color':'white', 'border-bottom': '1px solid gray'}; //, 'background-image': 'url("graphics/misc/texture1.jpg")'
		else
			return {'background-color':'#ddd', 'border-bottom': '1px solid gray'};
	}
	$scope.ngClassShadowedImg=function(type) {
		if(isMobile())
			return type;
		else
			return type+' shadowed';
	}
	$scope.ngClassShadowedWhiteImg=function(type) {
		if(isMobile())
			return type;
		else
			return type+' shadowedWhite4';
	}
	$scope.uploadMultiplayerStats=function(nation) {
		$scope.uploadMultiplayerFlg=true;
		$scope.uploadStatus='working';
		$scope.uploadNation=nation;
		var e = document.getElementById("statusImg");
		if(e)
			e.src="graphics/misc/yellow.png";
		startSpinner('Uploading Game Data...', 0, 'spinnerOKButton');
		setInnerHTMLFromElement('statusMessage', 'Uploading Game Data...');
//		setTimeout(function() { $scope.checkForTimeout(nation); }, 20000);	
	}
	$scope.updateUploadNation=function(nation) {
		$scope.uploadNation=nation;
	}
	$scope.checkForTimeout=function(nation) {
		console.log('ZZZ checkForTimeout', nation, $scope.uploadNation);
		if($scope.uploadStatus=='working') {
			if(nation==$scope.uploadNation)
				updateStatusMessage('Error! Timed Out.', false);
			else
				setTimeout(function() { $scope.checkForTimeout($scope.uploadNation); }, 20000);	
		}
	}
	$scope.uploadMultiplayerStatus=function(status) {
		var e = document.getElementById("statusImg");
		if(e) {
			if(status=='Success')
				e.src="graphics/misc/green.png";
			else
				e.src="graphics/misc/red.png";
				
			updateProgressBar(100);
			//disableButton('spinnerOKButton', false);
			$scope.uploadStatus=status;
			$scope.$apply();
		}
	}
	$scope.closeMultiplayerStatus=function(status) {
		$scope.uploadMultiplayerFlg=false;
		closePopup('popupSaving');
	}
	$scope.ngClassGameType=function(gameType) {
		return ngClassGameTypeMain(gameType);
	}
	$scope.ngUnitSrc=function(piece, nation) {
		if(!piece || piece==0) {
			return "graphics/units/piece1.png";
		}
		if(piece==11 && nation>0)
			return "graphics/units/leader"+nation+".png";
		if(piece<100)
			return "graphics/units/piece"+piece+"u.png";
		else
			return "graphics/units/piece"+piece+".gif";
	}
	$scope.goBack = function() {
		if(localStorage.homePage && localStorage.homePage=='multiplayerHome')
			window.location = "index.html#!/multiplayer";
		else
			window.location = "index.html#!/";
		/*
		var historyObj = window.history;
		console.log(historyObj);
		if(historyObj.length>1)
			window.history.back();
		else
			window.location = "index.html#!/";*/
	}
	$scope.gotoUser=function(leader, flg) {
		if(flg)
			closePopup('userBox');
		var name = '';
		if(leader && leader.name && leader.name.length>0)
			name=leader.name;
		if(leader && leader.userName && leader.userName.length>0)
			name=leader.userName;
		if(name && name.length>0) {
			localStorage.displayUser=name;
			window.location = "index.html#!/user";
		} else {
			showAlertPopup('Create an Account!',1);
			window.location = "index.html#!/login";
		}
	}
	$scope.showUser=function(user) {
		startSpinner('Loading Data...', '150px');
		displayFixedPopup('userBox',true);
		var url = getHostname()+"/webUserInfo.php";
	    $.post(url,
	    {
	        user_login: localStorage.username,
	        userName: user.name,
	        Password: localStorage.password,
	        action: '',
	        data: ''
	    },
	    function(data, status){
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
			$scope.userObj = userFromLine(data);
//			console.log(data);
//			console.log($scope.userObj);
			$scope.personInfo = [];
			$scope.personInfo.push({name: 'Username', value: $scope.userObj.name});
			$scope.personInfo.push({name: 'Created', value: $scope.userObj.created});
			if($scope.userObj.first_name.length>0)
				$scope.personInfo.push({name: 'First Name', value: $scope.userObj.first_name});
			if($scope.userObj.city.length>0)
				$scope.personInfo.push({name: 'City', value: $scope.userObj.city});
			if($scope.userObj.state.length>0)
				$scope.personInfo.push({name: 'State', value: $scope.userObj.state});
			if($scope.userObj.country && $scope.userObj.country.length>0)
				$scope.personInfo.push({name: 'Country', value: $scope.userObj.country});
			if($scope.userObj.age.length>0)
				$scope.personInfo.push({name: 'Age', value: $scope.userObj.age});

			$scope.personInfo.push({name: 'Last Login', value: $scope.userObj.last_login_time+' hours ago'});
			$scope.personInfo.push({name: 'last_game_time', value: $scope.userObj.last_game_time});
			
			$scope.userStats = [];
			$scope.userStats.push({name: 'Games', value: $scope.userObj.games});
			$scope.userStats.push({name: 'Wins', value: $scope.userObj.wins});
			$scope.userStats.push({name: 'Losses', value: $scope.userObj.losses});
			$scope.userStats.push({name: 'Last-10', value: $scope.userObj.last10});
			$scope.userStats.push({name: 'Rank', value: $scope.userObj.rank});
			$scope.userStats.push({name: 'Points', value: $scope.userObj.rating});
			$scope.userStats.push({name: 'Streak', value: $scope.userObj.streak});
			$scope.userStats.push({name: 'Longest Win Streak', value: $scope.userObj.winning_streak});
			$scope.userStats.push({name: 'Longest Losing Streak', value: $scope.userObj.losing_streak});
			$scope.userStats.push({name: 'Wins This Year', value: $scope.userObj.winsThisYear});

			$scope.ladderStats = [];
			$scope.ladderStats.push({name: 'Points', value: $scope.userObj.ladder.points});
			$scope.ladderStats.push({name: 'Place', value: $scope.userObj.ladder.rank});
			$scope.ladderStats.push({name: 'Wins', value: $scope.userObj.ladder.wins});
			$scope.ladderStats.push({name: 'Losses', value: $scope.userObj.ladder.losses});
			$scope.ladderStats.push({name: 'Last-10', value: $scope.userObj.ladder.last10});
			$scope.ladderStats.push({name: 'Streak', value: $scope.userObj.ladder.streak});
			$scope.ladderStats.push({name: 'Games Max', value: $scope.userObj.ladder.games_max});
			$scope.ladderStats.push({name: 'Games Playing', value: $scope.userObj.ladder.games_playing});
			
			$scope.awards=awardsForYear(nowYear(), $scope.userObj.awards);
//			console.log($scope.userObj);
			$scope.$apply();
		}
	    });
	}
	$scope.showInfo=function() {
		playClick($scope.muteSound);
		$scope.showInfoFlg=!$scope.showInfoFlg;
	}
	$scope.acceptOption = function() {
		var option = localStorage.confirmationOption;
		closePopup('confirmationPopup');
		if(option=='chooseNation') {
			window.location = "index.html#!/board";
		}
	}
	$scope.cancelButtonClicked = function() {
		closePopup('confirmationPopup');
	}
  	$scope.set_color = function(id) {
	    if(id%2 == 0)
	        return {"background-color": "white"};
	    else
	        return {"background-color": "#F0F0F0"};
	};
	$scope.changeFilter = function(num) {
		console.log('hey');
		updateButtonFilters(num);
	}

  }]);
  app.directive('ptpHeader', function() {
    return {
    scope: {
        goBack: '&',
        plusButtonClicked: '&',
        refresh: '&',
        leftIcon: '=',
        rightIcon: '=',
        menuTitle: '@'
    },
    template: templateFunc(),
        link: link

    };
    function link(scope, el, ettrs) {
  	scope.refresh();
    }
    function templateFunc() { 
    	return '<div style="background-color: black; height: 20px;"></div>'+
     			'<section class="gradient"><table style="background-color: transparent;"><td width=30>'+
 			'<a href=""><button onClick="toggleElement(\'mainPopup\')" ng-if="leftIcon==1" type="button" class="btn icon-button"><i class="fa fa-info-circle"></i></button></a>'+
			'<button ng-click="goBack()" ng-if="leftIcon==2" type="button" class="btn icon-button"><i class="fa fa-arrow-left"></i></button>'+
			'<a href="#/"><button ng-if="leftIcon==3" type="button" class="btn icon-button"><i class="fa fa-home"></i></button></a>'+
			'</td><td width=100%><center>'+
			'<img src=\'graphics/superpowers.png\' id="topLogo" alt=\'Superpowers\' title=\'Superpowers\' style=\'margin: -45px; margin-bottom: -30px;\'>'+
			'<div class="menuTitle">{{menuTitle}}</div></td><td width=30>'+
			'<a href="#!options"><button ng-if="rightIcon==1" type="button" class="btn icon-button"><i class="fa fa-cog"></i></button></a>'+
			'<button ng-click="plusButtonClicked()" ng-if="rightIcon==2" type="button" class="btn icon-button"><i class="fa fa-plus icon"></i></button>'+
			'<button ng-click="plusButtonClicked()" ng-if="rightIcon==6" type="button" class="btn icon-button"><i class="fa fa-bullseye icon"></i></button>'+
			'<button ng-click="plusButtonClicked()" ng-if="rightIcon==7" type="button" class="btn icon-button"><i class="fa fa-info-circle icon"></i></button>'+
			'<a href="#!gameEdit" ng-if="rightIcon==3" ng-click="loadEditGames()"><i class="fa fa-pencil-square-o icon"></i></a>'+
			'<a href="#!multiplayer" ng-if="rightIcon==4"><img src="graphics/buttons/multiButton.png" height="45"></a>'+
			'<a href="#/!" ng-if="rightIcon==5"><i class="fa fa-home icon"></i></a>'+
			'</td></table></section>'; 
			//<a href="#/!"></a>
    	}
  }).directive('ptpTableRow', function() {
    return {
    scope: {
        item: '='
    },
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<table width=100%><td style="padding: 3px; text-align: right; width: 50%; color: #080;"><b>{{item.name}}</b></td>'+
  		'<td style="padding: 3px; text-align: left; width: 50%; color: gray;">{{item.value}}</td></table>'; 
    	}
  }).directive('gameTypeBar', function() {
    return {
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<section style="background-color: #ccc; padding-top: 10px; padding-bottom: 10px;"><center>'+
	'<div class="btn-group">'+
	'<button id="buttonTypeAll" ng-click="changeGameType(0)" type="button" class="btn yellow-segment segment33">All</button>'+
	'<button id="buttonTypeCash" ng-click="changeGameType(1)" type="button" class="btn btn-success segment33">Cash</button>'+
	'<button id="buttonTypeTourny" ng-click="changeGameType(2)" type="button" class="btn btn-success segment33">Tournaments</button>'+
	'</div></section>'; 
    	}
  }).directive('gameFilterBar', function() {
    return {
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<section style="background-color: #ccc; padding-top: 10px; padding-bottom: 10px;"><center>'+
	'<div class="btn-group">'+
	'<button id="buttonFilter1" ng-click="changeFilter(0)" type="button" class="btn yellow-segment "><i class="fa fa-ban"></i></button>'+
	'<button id="buttonFilter2" ng-click="changeFilter(1)" type="button" class="btn btn-success green-segment">{{filterList[1].name}}</button>'+
	'<button id="buttonFilter3" ng-click="changeFilter(2)" type="button" class="btn btn-success green-segment">{{filterList[2].name}}</button>'+
	'<button id="buttonFilter4" ng-click="changeFilter(3)" type="button" class="btn btn-success green-segment">{{filterList[3].name}}</button>'+
	'</div></section>'; 
    	}
  }).directive('gameDetails', function() {
    return {
    templateUrl: "pages/gameDet.htm",
    };
  }).directive('gameStats', function() {
    return {
    templateUrl: "pages/gameStats.htm",
    };
  }).directive('adsense2', function() {
    return {
    	    restrict: 'A',
    transclude: true,
    replace: true,
    templateUrl: "pages/adsense.htm",
    link: function ($scope, element, attrs) {}
    };
  }).directive('gameYearBar', function() {
    return {
    template: templateFunc(),
    link: link
	};
    function link(scope, el, ettrs) {
    	scope.filterGamesList();
//  	scope.changeYear(0);
    }
    function templateFunc() { 
    	return '<section class="gradient" style="background-color: #fff; padding: 5px;"><center>'+
			'<table><td><button id="yearDownButton" ng-click="changeYear(-1)" type="button" class="btn btn-default ptp-yellow">2016</button></td>'+
			'<td width=100%><center><div><font size=5 color=white><label id="displayYear">2012</label></font></div></td>'+
			'<td><button id="yearUpButton" ng-click="changeYear(1)" type="button" class="btn btn-default ptp-yellow">All</button></td></table>'+
			'</section>'; 
    	}
  }).directive('gameReviewSection', function() {
    return {
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<section class="green-bg"><center>'+
	'<table><td><a href="#!icons"><img ng-src=\'graphics/playerType{{gameStatsObj.playerTypeNumber}}.png\' title=\'{{gameStatsObj.playerTypeName}}\' height=100></a></td>'+
	'<td width=100%>'+
	'<div class="whiteBoldLabel hidden-xxs">Games: {{gameStatsObj.gameString}}</div>'+
	'<div class="whiteBoldLabel visible-xxs">Games</div>'+
	'<div class="whiteBoldLabel visible-xxs">{{gameStatsObj.gameString}}</div>'+
	'<div class="whiteBoldLabel hidden-xxs">Return on Investment (ROI)</div>'+
	'<div class="whiteBoldLabel visible-xxs">ROI</div>'+
	'</td>'+
	'<td align=right nowrap><div ng-style="moneyColorStyle(gameStatsObj.profit, true)"><font size=5>{{gameStatsObj.profitStr}}&nbsp;</font></div><div ng-style="moneyColorStyle(gameStatsObj.profit, true)"><font size=3>{{gameStatsObj.roi}}%&nbsp;</font></div></td></table>'+
	'</section>'; 
    	}
  }).directive('gameCell', function() {
    return {
    scope: {
        game: '=',
        sign: '='
    },
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<table width=100% ng-style="{\'background-color\': game.status==\'In Progress\' ? \'yellow\':\'\'}"><td><div style="padding: 0; background-color: yellow; width: 50px; text-align: center; border: 1px solid black; height: 50px;"><div style="color: white;" class="green-bg">ROI</div>{{game.roi}}%</div></td>'+
    	'<td width=100% style="padding-left: 5px;" class="gameCellLabel"><div class="gameCellLabel" ng-show="game.status==\'In Progress\'">Now Playing!</div>'+
    	'<div class="gameCellLabel" ng-hide="game.status==\'In Progress\'"><b><i ng-if="game.type==\'Cash\'" class="fa fa-money"></i><i ng-if="game.type==\'Tournament\'" class="fa fa-trophy"> </i><i ng-if="game.hudHeroLine" class="fa fa-user-secret" style="color: purple; padding-left: 5px;"></i> {{game.name}}</b></div>'+
    	'<div class="gameCellLabel"><table width=100%><td width=60%><font color=green><i class="fa fa-calendar"></i> {{game.startDay}}</font></td>'+
    	'<td align=left><span style="background-color: #fe0; color: green; padding-left: 8px; padding-right: 8px; border-radius: 25px;"><i class="fa fa-clock-o"></i> {{game.hours}}</span></td></table></div></td>'+
    	'<td style="padding-right: 5px;" class="gameCellLabel" align=right><div class="gameCellLabel"><font color=green>{{game.location}}</font></div><div style="color: red;" ng-show="game.profit<0"><label>{{sign}}{{game.profit}}</label></div><div style="color: green;" ng-show="game.profit>=0"><label>{{sign}}{{game.profit}}</label></div></td></table></div>'; 
    	}
  }).directive('reportCell', function() {
    return {
    scope: {
        report: '=',
        data: '='
    },
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<div><table style="width: 95%; color: #080;"><td><b>{{report.name}}</b></td><td align=right>{{report.profitType}}</td></table></div><div ng-repeat="item in report.data"><table width=100%><td width=50% align=right><font color=gray>{{item.name}}: &nbsp;</font></td><td align=left>'+
    	' <b><font color=#080 ng-if="item.amount>0">{{item.value}}</font><font color=#000 ng-if="item.amount==0">{{item.value}}</font><font color=#f00 ng-if="item.amount<0">{{item.value}}</font></b>'+
    	'</td></table></div>'; 
    	}
  }).directive('ptpCell', function() {
    return {
    scope: {
        item: '=',
        data: '='
    },
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<table width=100%><td><img ng-if="item.img" class="cellPhotos" ng-src=graphics/{{item.img}} height=50></td><td width=100%><div class="ptpCellLabel"><table style="width: 100%; color: black;"><td style="color: black; font-size: 20px;"><b>{{item.name}}</b></td><td align=right>{{item.topRight}}</td></table></div>'+
    	'<div class="ptpCellLabel"><table style="width: 100%; color: #080;"><td>{{item.botLeft}}</td><td align=right><font color=gray>{{item.botRight}}</font></td></table></div>'+
    	'</td></table>';
    	}
  }).directive('gameEditCell', function() {
    return {
    scope: {
        item: '=',
        sign: '='
    },
    template: templateFunc(),
    };
    function templateFunc() { 
    	return '<table width=100%><td><div class="editName"><i ng-if="item.icon" class="fa {{item.icon}}"></i> {{item.name}}</div></td><td align=right><div class="editValue" id="{{item.id}}">{{item.value}}</div></td></table>'; 
    	}
  });
   app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "pages/main.htm",
         controller : "mainCtrl"
    })
    .when("/board", {
        templateUrl : "pages/board.html",
         controller : "boardCtrl"
    })
    .when("/chooseNation", {
        templateUrl : "pages/chooseNation.html",
         controller : "chooseNationCtrl"
    })
    .when("/chooseNationIOS", {
        templateUrl : "pages/chooseNationIOS.html",
         controller : "chooseNationIOSCtrl"
    })
    .when("/tech", {
        templateUrl : "pages/tech.html",
         controller : "techCtrl"
    })
    .when("/ruleChanges", {
        templateUrl : "pages/ruleChanges.html"
    })
    .when("/email", {
        templateUrl : "pages/email.html",
         controller : "emailCtrl"
    })
    .when("/scoreboard", {
        templateUrl : "pages/scoreboard.html",
         controller : "scoreboardCtrl"
    })
    .when("/multiplayer", {
        templateUrl : "pages/multiplayer.html",
         controller : "multiplayerCtrl"
    })
    .when("/login", {
        templateUrl : "pages/login.html",
         controller : "loginCtrl"
    })
    .when("/createGame", {
        templateUrl : "pages/createGame.html",
         controller : "createGameCtrl"
    })
    .when("/userStats", {
        templateUrl : "pages/userStats.html",
         controller : "userStatsCtrl"
    })
    .when("/profile", {
        templateUrl : "pages/profile.html",
         controller : "profileCtrl"
    })
    .when("/info", {
        templateUrl : "pages/info.html",
         controller : "infoCtrl"
    })
    .when("/ranks", {
        templateUrl : "pages/ranks.html",
         controller : "ranksCtrl"
    })
    .when("/matchMaking", {
        templateUrl : "pages/matchMaking.html",
         controller : "matchMakingCtrl"
    })
    .when("/tournament", {
        templateUrl : "pages/tournament.html",
         controller : "tournamentCtrl"
    })
    .when("/user", {
        templateUrl : "pages/user.html",
         controller : "userCtrl"
    })
    .when("/units", {
        templateUrl : "pages/unitsPage.html",
         controller : "unitsPageCtrl"
    })
    .when("/mail", {
        templateUrl : "pages/mail.html",
         controller : "mailCtrl"
    })
    .when("/leaders", {
        templateUrl : "pages/leaders.html",
         controller : "leadersCtrl"
    })
    .when("/forum", {
        templateUrl : "pages/forum.html",
         controller : "forumCtrl"
    })
    .when("/chatRoom", {
        templateUrl : "pages/chatRoom.html",
         controller : "chatRoomCtrl"
    })
    .when("/news", {
        templateUrl : "pages/news.html",
         controller : "newsCtrl"
    })
    .when("/purchase", {
        templateUrl : "pages/purchase.html",
         controller : "purchaseCtrl"
    })
    .when("/nations", {
        templateUrl : "pages/nations.html",
         controller : "nationsCtrl"
    });
});
app.controller("chatRoomCtrl", function ($scope) {
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	updateChatMessages();
	function updateChatMessages() {
		$scope.chatMessages=[];
		startSpinner('Loading...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        game_id: 1
	    },
	    function(data, status){
//	    	console.log(data);
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
			var items = data.split("<b>");
			var messages=items[1].split("<br>");
			messages.forEach(function(msg) {
				$scope.chatMessages.push(messageFromLine(msg));
			});
			$scope.usersOnlineTop = items[2].split("|");
			moveToBottom('chatPopup');
			$scope.viewingChatFlg=true;
			$scope.chatRefreshTimer=5000;
			resizeChatRoom(0);
			refreshChatRoom();
	    		$scope.$apply();
		}
	    });
	}
	function moveToBottom(id) {
		var e = document.getElementById(id);
		if(e) {
			e.style.top='';
			e.style.bottom='0';
		}
	}
	$scope.deletePost=function(chat) {
		startSpinner('Working...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'deleteMessage',
	        chatId: chat.rowId,
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			updateChatMessages('N');
		}
	    });
	}
	$scope.toggleEditMode=function() {
		$scope.editMode=!$scope.editMode;
	}
	$scope.postChat=function(gameId) {
		var message = databaseSafe(document.getElementById("msgField").value);
		if(message.length==0) {
			showAlertPopup('no message', 1);
			return;
		}
		console.log('posting message', message);
		disableButton('chatSendButton', true);
		document.getElementById("msgField").value = '';
		startSpinner('Posting...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'postMessage',
	        message: message,
	        recipient: 'All',
	        game_id: 1
	    },
	    function(data, status){
	    	stopSpinner();
		disableButton('chatSendButton', false);
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			updateChatMessages('N');
		}
	    });
	}
	$scope.adjustChatSizeChat=function(num) {
		console.log(num);
		playClick($scope.muteSound);
		$scope.showChatAmount=num;
		resizeChatRoom(num);
	}
	function resizeChatRoom(num) {
		var e = document.getElementById("chatPopup");
		var b = document.getElementById("chatRoomButton");
		if(e) {
			if(num==0) {
				e.style.display='none';
//				b.style.display='block';
			} else {
//				b.style.display='none';
				e.style.display='block';
				if(!$scope.viewingChatFlg)
					$scope.viewChatPressed();
			}
		}
	}
	$scope.viewChatPressed=function() {
		$scope.viewingChatFlg=true;
		$scope.chatRefreshTimer=5000;
		refreshChatRoom();
	}
	$scope.postChatMessage=function() {
		var message = databaseSafe(document.getElementById("msgField2").value);
		if(message.length==0) {
			showAlertPopup('no message', 1);
			return;
		}
		$scope.chatRefreshTimer=5000;
		disableButton('sendButton2', true);
		document.getElementById("msgField2").value = '';
		var url = getHostname()+"/chatRoom.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'postMessage',
	        message: message
	    },
	    function(data, status){
		disableButton('sendButton2', false);
	    	console.log(data);
	    	var obj = JSON.parse(data);
		if(verifyServerResponse(status, obj.status)) {
			$scope.chatRoomMessages = obj.messages;
			$scope.$apply();
		}
	    });
	}
	function refreshChatRoom() {
		var e = document.getElementById("msgField2");
		if(!e) {
			$scope.viewingChatFlg=false;
			return;
		}
		var url = getHostname()+"/chatRoom.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'readChat'
	    },
	    function(data, status){
	    	var obj = JSON.parse(data);
	    	console.log('data', data, obj);
		if(verifyServerResponse(status, obj.status)) {
			$scope.chatRoomMessages = obj.messages;
			if($scope.chatRoomMessages.length>0)
				resizeChatRoom(1);
			$scope.$apply();
			$scope.chatRefreshTimer+=2000;
			var e = document.getElementById("msgField2");
			if(e && $scope.chatRefreshTimer>1000)
				setTimeout(function() { refreshChatRoom(); }, $scope.chatRefreshTimer);	
			else
				$scope.viewingChatFlg=false;
		}
	    });
	}
}); //chatRoomCtrl
app.controller("newsCtrl", function ($scope) {
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	getTheNews();
	
	$scope.postNews=function() {
		var title = databaseSafe(document.getElementById("title").value);
		if(title.length==0) {
			showAlertPopup('no title', 1);
			return;
		}
		var body = databaseSafe(document.getElementById("body").value);
		if(body.length==0) {
			showAlertPopup('no body', 1);
			return;
		}
		getTheNews('postNews', title, body)
	}
	$scope.postResponse=function(obj) {
		var msgField = databaseSafe(document.getElementById("msgField").value);
		if(msgField.length==0) {
			showAlertPopup('no msgField', 1);
			return;
		}
		disableButton('sendButton', true);
		getTheNews('postResponse', '', msgField, obj.id)
		console.log('msgField', msgField, obj);
	}
	function getTheNews(action, title, body, newsId) {
		$scope.newsItems=[];
		startSpinner('Working...', '150px');
		var url = getHostname()+"/webNews.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: action,
	        title: title,
	        body: body,
	        newsId: newsId
	    },
	    function(data, status){
	    	stopSpinner();
		disableButton('newsSendButton', false);
	    	console.log(data);
	    	var obj = JSON.parse(data);
	    	
		if(verifyServerResponse(status, obj.status)) {
			disableButton('sendButton', false);
			$scope.newsItems=obj.messages;
			console.log($scope.newsItems);
			$scope.$apply();
			if(action && action.length>0)
				showAlertPopup('Success');
		}
	    });
	}
}); //newsCtrl
app.controller("userStatsCtrl", function ($scope) {
	displayFixedPopup('mainPopup');
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	var now = new Date();
  	var monthIndex = pad(now.getMonth()+1);
  	var year = now.getFullYear();
	$scope.updateDate=year+'-'+monthIndex;
	getStats();

	$scope.updateAdsenseAmount=function() {
		var val = $('#amount').val();
		var updateDate = $('#updateDate').val();
		if(numberVal(val)==0) {
			showAlertPopup('no value',1);
			return;
		}
		var amount = convertNumberToMoney(val);
		startSpinner('Updating...', '150px', 'updateButton');
		console.log('amount', amount, updateDate);
		var url = getHostname()+"/webSuperpowers.php";
		    $.post(url,
		    {
		        action: 'updateAdsense',
		        user_login: $scope.user.userName,
		        code: $scope.user.code,
		        updateDate: updateDate,
		        amount: amount
		    },
		    function(data, status){
		    	console.log(data);
		    	stopSpinner();
		    });
	}
	function getStats() {
		$scope.mailMessages=[];
		startSpinner('Loading...', '150px');
		var url = getHostname()+"/webSuperpowers.php";
	    $.post(url,
	    {
	        action: 'getStats2',
	        user_login: $scope.user.userName,
	        code: $scope.user.code
	    },
	    function(data, status){
//	    	console.log(data);
	    	$scope.ipRecords=[];
	    	$scope.spTesters=[];
	    	
	    	var groups = data.split("<br>");
	    	if(groups.length>0) {
		    	var items = groups[0].split("<b>");
		    	items.forEach(function(line) {
		    		if(line.length>20) {
			    		var ipObj=ipObjFromLine(line);
			    		$scope.ipRecords.push(ipObj);
			    		$scope.todayStats=ipObj;
				}
			});
		}
	    	if(groups.length>1) {
		    	var adsenseItems = groups[1].split("<b>");
		    	$scope.adsenseRecords=[];
		    	adsenseItems.forEach(function(line) {
		    		if(line.length>4) {
				    	var c = line.split("|");
			    		$scope.adsenseRecords.push({id: c[0],date: c[1],amount: c[2],lastUpd: c[3]});
				}
			});
		}
	    	if(groups.length>2) {
		    	var lines = groups[2].split("<li>");
		    	lines.forEach(function(line) {
		    		if(line.length>30) {
		    			var user=leaderFromLine(line);
		    			if(user.activity==3)
			    			$scope.spTesters.push(user);
				}
			});
		}
		
	    	stopSpinner();
	    	$scope.$apply();
	    });
	}
	function ipObjFromLine(line) {
	    	var items = line.split("<a>");
	    	var obj = {};
	    	obj.date = items[0];
	    	obj.values = ipValuesFromLine(items[1]);
	    	return obj;
	}
	function ipValuesFromLine(line) {
	    	var items = line.split("|");
	    	var valueObj = {};
	    	var total=0;
	    	var numberViewing=0;
	    	var numberPlay=0;
	    	var numberBT=0;
	    	var numberSP=0;
	    	items.forEach(function(values) {
		    	var pairs = values.split(":");
		    	var amount=numberVal(pairs[1]);
		    	var k = pairs[0];
		    	if(k==-4)
		    		numberViewing+=amount;
		    	if(k==-1 || k==1 || k==99 || k==199)
		    		numberPlay+=amount;
		    	if(k==99 || k==199)
		    		numberBT+=amount;
		    	if(k==199)
		    		numberSP+=amount;
		    	if(k.length>0) {
		    		valueObj[k]=amount;
	    			total+=amount;
	    		}
		});
		valueObj.total=total;
		if(total>0) {
			valueObj.infoPercent=Math.round(numberViewing*100/total)+'%';
			valueObj.playPercent=Math.round(numberPlay*100/total)+'%';
			valueObj.play=numberPlay;
			valueObj.bt=numberBT;
			valueObj.sp=numberSP;
		}
	    	return valueObj;
	}
}); //userStatsCtrl
app.controller("mailCtrl", function ($scope) {
	displayFixedPopup('mainPopup');
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.checkInbox=function() {
		$scope.viewedMessage=0;
		$scope.showAll=false;
		playClick($scope.muteSound);
		readMailbox('inbox');
	}
	$scope.checkInbox();
	$scope.checkSentMessages=function() {
		$scope.viewedMessage=0;
		$scope.showAll=false;
		playClick($scope.muteSound);
		readMailbox('sentBox');
	}
	$scope.ngStyleRow=function(num) {
		console.log(num);
		if(num%2==0)
			return {'background-color':'white', 'border-bottom': '1px solid gray'};
		else
			return {'background-color':'#ddd', 'border-bottom': '1px solid gray'};
	}
	function readMailbox(type) {
		$scope.mailMessages=[];
		startSpinner('Loading...', '150px');
		var url = getHostname()+"/spSendMail.php";
	    $.post(url,
	    {
	        action: 'readBox',
	        type: type,
	        user: $scope.user.userName,
	        code: $scope.user.code
	    },
	    function(data, status){
	    	var items = data.split("<a>");
	    	items.forEach(function(line) {
	    		var message=mailFromLine(line);
	    		if(message && message.row_id>0)
		    		$scope.mailMessages.push(message);
		    	console.log(message);
		});
	    	stopSpinner();
	    	$scope.$apply();
	    });
	}
	function mailFromLine(line) {
	        var obj = new Object();
		var c = line.split("|");
		var x=0;
		if(c.length>5) {
			obj.row_id=c[x++];
			obj.title=c[x++];
			obj.body=c[x++];
			obj.sender=c[x++];
			obj.senderName=c[x++];
			obj.read_flg=(c[x++]=='Y');
			obj.urgent_flg=(c[x++]=='Y');
			obj.num_replies=c[x++];
			obj.msgDate=c[x++];
			obj.parent_mail_id=c[x++];
			obj.recipient=c[x++];
			obj.recipientName=c[x++];
			
			var d = new Date(obj.msgDate);
			obj.formattedDate = convertDateToString(d);
		}
		return obj;
	}
	$scope.clickMessage=function(message) {
		if($scope.showAll)
			return;
		playClick($scope.muteSound);
		if($scope.viewedMessage==message.row_id)
			$scope.viewedMessage=0;
		else {
			$scope.viewedMessage=message.row_id;
			if(message.num_replies>0 || !message.read_flg)
				readPostMessage(message);
		}
	}
	$scope.replyToMessage=function(message) {
		playClick($scope.muteSound);
		displayFixedPopup('sendMessagePopup');
		$scope.selectedPost=message;
		$scope.toUser=message.senderName;
		$('#title').val(message.title);
		$('#message').val('');
	}
	function readPostMessage(message) {
		$scope.mailMessages=[];
		startSpinner('Loading...', '150px');
		var url = getHostname()+"/spSendMail.php";
	    $.post(url,
	    {
	        action: 'readPost',
	        user: $scope.user.userName,
	        code: $scope.user.code,
	        row_id: message.row_id
	    },
	    function(data, status){
		    	console.log('data', data);
	    	var items = data.split("<a>");
	    	items.forEach(function(line) {
	    		var message=mailFromLine(line);
	    		if(message && message.row_id>0)
		    		$scope.mailMessages.push(message);
		    	console.log(message);
		});
	    	stopSpinner();
	    	$scope.showAll=true;
	    	$scope.$apply();
	    });
	}
	$scope.postMessage=function() {
		playClick($scope.muteSound);
		if(document.getElementById("message").value.length==0) {
			showAlertPopup('No Message!', 1);
			return;
		}
		var title=databaseSafe(document.getElementById("title").value);
		var message=databaseSafe(document.getElementById("message").value);
		var urgent=document.getElementById("urgent").checked?'Y':'';
		console.log('data', title,message,urgent,$scope.selectedPost);
		closePopup('sendMessagePopup');
		sendMessageToUser(title,message,urgent,$scope.selectedPost.row_id);
	}
	function sendMessageToUser(title,message,urgent,row_id) {
		startSpinner('Sending...', '150px');
		var url = getHostname()+"/spSendMail.php";
	    $.post(url,
	    {
	        to: $scope.toUser,
	        title: title,
	        message: message,
	        urgent: urgent,
	        action: 'send',
	        user: $scope.user.userName,
	        code: $scope.user.code,
	        row_id: row_id,
	    },
	    function(data, status){
	    	console.log(data);
	    	stopSpinner();
	    	if(data=="Success")
			showAlertPopup('Message Sent');
		else
			showAlertPopup('Error '+data);
	    });
	}
	$scope.deleteMessage=function(message) {
		playClick($scope.muteSound);
	    	console.log(message);
		startSpinner('Sending...', '150px');
		var url = getHostname()+"/spSendMail.php";
	    $.post(url,
	    {
	        action: 'delete',
	        user: $scope.user.userName,
	        code: $scope.user.code,
	        row_id: message.row_id,
	    },
	    function(data, status){
	    	console.log(data);
	    	stopSpinner();
	    	if(data=="Success") {
			showAlertPopup('Message Deleted');
			$scope.checkInbox();
		} else
			showAlertPopup('Error '+data);
	    });
	}
}); //mailCtrl
app.controller("forumCtrl", function ($scope) {
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	loadForum();
	function loadForum() {
		startSpinner('Loading...', '150px');
		var url = getHostname()+"/webForum.php";
		console.log('localStorage.lastForumLogin', localStorage.lastForumLogin);
		var lastForumLogin = convertStringToDate(localStorage.lastForumLogin);
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        lastForumLogin: localStorage.lastForumLogin,
	        type: '1'
	    },
	    function(data, status){
	    	$scope.category=0;
	    	$scope.forumPost=0;
		var items = data.split("<a>");
		$scope.forumTopics = [];
		$scope.forumPosts = [];
		$scope.forumMessages = [];
		items.forEach(function(item) {
			var c = item.split("|");
			console.log(c);
			if(c.length>5) {
				var dateStamp = convertStringToDate(c[6]);
				$scope.dateStampText = c[6];
				$scope.dateStamp = lastForumLogin;
				var dif = lastForumLogin.getTime() - dateStamp.getTime();
				var newFlg = (dif>=0)?'N':'Y';
				$scope.forumTopics.push({category: c[0], name: c[1], topic_count: c[2], post_count: c[3], user: c[4], userId: c[5], dateStamp: c[6], newFlg: newFlg});
			}
		});
	    	stopSpinner();
	    	$scope.$apply();
	    });
	}
	$scope.gotoForumTop=function() {
		loadForum();
	}
	$scope.gotoForum=function(option) {
		var lastForumLogin = new Date(localStorage.lastForumLogin);
		$scope.selectedTopic=option;
		$scope.category=option.category;
	    	$scope.forumPost=0;
	    	$scope.forumPostId=0;
		$scope.categoryName=option.name;
		console.log('gotoForum', $scope.category);
		$scope.forumTopics = [];
		$scope.forumPosts = [];
		$scope.forumMessages = [];
		loadTopic(option.category);
		function loadTopic(category) {
			startSpinner('Loading...', '150px');
			var url = getHostname()+"/webForum.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        category: category
		    },
		    function(data, status){
//		    	console.log('xxx', data);
			var items = data.split("<a>");
			$scope.forumPosts = [];
			items.forEach(function(item) {
				var c = item.split("|");
				var body = '';
				if(c.length>7) {
					var regex = /(<([^>]+)>)/ig
					body = c[8].replace(regex, "");
				}
				if(c.length>5) {
					var dateStamp = new Date(c[6]);
					var dif = lastForumLogin.getTime() - dateStamp.getTime();
					var newFlg = (dif>=0)?'N':'Y';
					console.log('forumPosts newFlg', newFlg);
					$scope.forumPosts.push({id: c[0], name: c[1], topic_count: c[2], post_count: c[3], user: c[4], userId: c[5], dateStamp: c[6], newFlg: newFlg, body: body, category: c[9]});
				}
			});
		    	stopSpinner();
		    	$scope.$apply();
		    });
		}
	}
	$scope.gotoForumPost=function(forumPost) {
		var lastForumLogin = new Date(localStorage.lastForumLogin);
		$scope.selectedForumPost=forumPost;
		$scope.forumPost=forumPost.id;
		console.log('gotoForumPost $scope.forumPostId: ', $scope.forumPostId, $scope.category);
		if(forumPost && forumPost.id && forumPost.id>0 && $scope.forumPostId==0) {
			$scope.forumPostId = numberVal(forumPost.id);
			$scope.postName=forumPost.name;
			$scope.forumTopics = [];
			$scope.forumPosts = [];
			$scope.forumMessages = [];
			loadForumPost(forumPost);
		}
		function loadForumPost(forumPost) {
			startSpinner('Loading...', '150px');
			var url = getHostname()+"/webForum.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        category: forumPost.category,
		        forumPost: forumPost.id
		    },
		    function(data, status){
		    	console.log('data', data);
			var items = data.split("<a>");
			items.forEach(function(item) {
				var c = item.split("|");
				var body = '';
				if(c.length>7) {
					var regex = /(<([^>]+)>)/ig
					body = c[8].replace(regex, "");
				}
				if(c.length>5) {
					var dateStamp = new Date(c[6]);
					var dif = lastForumLogin.getTime() - dateStamp.getTime();
					var newFlg = (dif>=0)?'N':'Y';
					console.log('forumMessages newFlg', newFlg);
					$scope.forumMessages.push({id: c[0], name: c[1], topic_count: c[2], post_count: c[3], user: c[4], userId: c[5], dateStamp: c[6], newFlg: newFlg, body: body, category: c[9]});
				}
			});
		    	stopSpinner();
		    	$scope.$apply();
		    });
		}
	}
	$scope.newThread=function() {
		if(!$scope.user || !$scope.user.userName || $scope.user.userName.length==0) {
			showAlertPopup('Log in first.', 1);
			return;
		}
		$('#title').val('');
		$('#body').val('');
		displayFixedPopup('forumPopup');
	}
	$scope.forumReply=function() {
		console.log('selectedTopic', $scope.selectedTopic);
		console.log('selectedForumPost', $scope.selectedForumPost);
		$('#title').val('Re: '+$scope.selectedForumPost.name);
		$('#body').val('');
		displayFixedPopup('forumPopup');
	}
	$scope.postMessage=function() {
		var postId=numberVal($scope.forumPostId);
//		if($scope.selectedForumPost && $scope.selectedForumPost.id>0)
//			postId = $scope.selectedForumPost.id
		var title = $('#title').val();
		var body = $('#body').val();
		if(title.length==0) {
			showAlertPopup('Add a title', 1);
			return;
		}
		if(body.length==0) {
			showAlertPopup('Add a body', 1);
			return;
		}
			closePopup('forumPopup');
			startSpinner('Sending...', '150px');
			var url = getHostname()+"/webForum.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        title: title,
		        body: body,
		        action: 'newPost',
		        forumPost: postId,
		        category: $scope.selectedTopic.category
		    },
		    function(data, status){
		    	console.log('xxx', data);
		    	showAlertPopup('Message Posted');
		    	loadForum();
		    });
	}
}); //forumCtrl
app.controller("purchaseCtrl", function ($scope) {
}); //purchaseCtrl
app.controller("emailCtrl", function ($scope) {
	playClick($scope.muteSound);
	$scope.submitForm=function() {
		playClick($scope.muteSound);
		document.getElementById('area1').style.display='none';
		var text = $("#area1").val();     
		console.log(text);
		disableButton('submitButton', true);
		sendMessage(text);
	}
	function sendMessage(text) {
		startSpinner('Sending...', '150px');
		var url = getHostname()+"/spMail.php";
	    $.post(url,
	    {
	        user_login: localStorage.username || 'Guest',
	        toUser: 'Rick',
	        title: 'Superpowers Message',
	        body: text,
	        action: 'send'
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			$scope.messageSent=true;
			$scope.$apply();
		}
	    });
	}
}); //emailCtrl
app.controller("unitsPageCtrl", function ($scope) {
	playClick($scope.muteSound);
}); //unitsPageCtrl
app.controller("leadersCtrl", function ($scope) {
	displayFixedPopup('mainPopup');
	playClick($scope.muteSound);
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.awardsYear = nowYear();
	loadLeaders();
	function loadLeaders() {
		startSpinner('Loading...', '150px');
		$scope.fullLeaderList=[];
		$scope.fullAwardList=[];
		$scope.streakWinList=[];
		$scope.streakLossList=[];
		var url = getHostname()+"/webLeaders.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        type: '1'
	    },
	    function(data, status){
	    	stopSpinner();
//	    	console.log(data);
		var items = data.split("<br>");
		var leaders=items[2].split('<li>');
		for(var x=0; x<leaders.length; x++) {
			var line=leaders[x];
			var user = leaderFromLine(line);
			if(user.name && user.name.length>0)
				$scope.fullLeaderList.push(user);
		}
		var awards=items[3].split('+');
		for(var x=0; x<awards.length; x++) {
			var line=awards[x];
			var user = leaderFromLine(line);
			if(user.name && user.name.length>0)
				$scope.fullAwardList.push(awardFromLine(line));
		}
		var winStreaks=items[4].split('+');
		for(var x=0; x<winStreaks.length; x++) {
			var line=winStreaks[x];
			var user = leaderFromLine(line);
			if(user.name && user.name.length>0)
				$scope.streakWinList.push(awardFromLine(line));
		}
		var lossStreaks=items[5].split('+');
		for(var x=0; x<lossStreaks.length; x++) {
			var line=lossStreaks[x];
			var user = leaderFromLine(line);
			if(user.name && user.name.length>0)
				$scope.streakLossList.push(awardFromLine(line));
		}
	    	$scope.$apply();
	    });
	}
	$scope.showPlayerDetails=function() {
		displayFixedPopup('playerDetail', true);
	}
}); //leadersCtrl
app.controller("userCtrl", function ($scope) {
	displayFixedPopup('mainPopup');
	playClick($scope.muteSound);
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.awardsYear = nowYear();
	$scope.myAccount=(localStorage.username==localStorage.displayUser);
	$scope.textProviderNum=0;
	$scope.loadImageNum=0;
	$scope.completedGamesLimit=20;
	loadUserDataForUser(localStorage.displayUser, '', '');
	$scope.chatColors=[
		{id: 1, color: "#FF8888", name: "red"},
		{id: 2, color: "#FFCC00", name: "orange"},
		{id: 3, color: "#FFFF00", name: "yellow"},
		{id: 4, color: "#88FF88", name: "green"},
		{id: 5, color: "#00FFFF", name: "cyan"},
		{id: 6, color: "#8888FF", name: "blue"},
		{id: 7, color: "#FF00FF", name: "magenta"},
		{id: 8, color: "#FFFFFF", name: "white"},
		{id: 99, color: "#00FF00", name: "neon"}
		];
	$scope.chatFonts=[
		{id: 1, face: "Arial"},
		{id: 2, face: "Helvetica"},
		{id: 3, face: "Times New Roman"},
		{id: 4, face: "Times"},
		{id: 5, face: "Courier New"},
		{id: 6, face: "Courier"},
		{id: 7, face: "Verdana"},
		{id: 8, face: "Georgia"},
		{id: 9, face: "Palatino"},
		{id: 10, face: "Garamond"},
		{id: 11, face: "Bookman"},
		{id: 12, face: "Comic Sans MS"},
		{id: 13, face: "Trebuchet MS"},
		{id: 14, face: "Arial Black"},
		{id: 15, face: "Impact"},
		];
	
	$scope.logout=function() {
		playClick($scope.muteSound);
		var highestRank = numberVal(localStorage.highestRank);
		if(localStorage.rank>highestRank)
			localStorage.highestRank = localStorage.rank;
		localStorage.removeItem('username');
		localStorage.removeItem('gold_member_flg');
		localStorage.userId=0;
		localStorage.removeItem('userId');
		$scope.gold_member_flg='';
		if(localStorage.rank>2)
			localStorage.rank=2;
		window.location = "#!/";
	}
	$scope.showUserInfo=function() {
		$scope.showAdminFlg=!$scope.showAdminFlg;
		displayPersonInfo($scope.showAdminFlg);
	}
	$scope.viewMoreGames=function() {
		$scope.completedGamesLimit+=30;
		loadUserDataForUser(localStorage.displayUser, '', '', 50);
	}
	$scope.savePopupGame=function(game, deleteFlg) {
		console.log(game);
		var action=(deleteFlg)?'deleteGame':'saveGame';
		closePopup('gamePopup');
		loadUserDataForUser(localStorage.displayUser, action, '', 0, game.id);
	}
	$scope.editProfileButtonClicked=function() {
		if($scope.myAccount)
			displayFixedPopup('profileEditPopup', true);
	}
	function loadUserDataForUser(userName, action, data, completedGamesLimit, gameId) {
		if(!userName || userName.length==0) {
			showAlertPopup('Invalid user!', 1);
			return;
		}
		startSpinner('Loading Data...', '150px');
		var url = getHostname()+"/webUserInfo.php";
	    $.post(url,
	    {
	        user_login: localStorage.username,
	        userName: userName,
	        Password: localStorage.password,
	        code: $scope.user.code,
	        action: action,
	        data: data,
	        completedGamesLimit: $scope.completedGamesLimit,
	        gameId: gameId
	    },
	    function(data, status){
//	    	console.log(data);
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
			$scope.userObj = userFromLine(data);
			$scope.userObj.userLc = $scope.userObj.name.toLowerCase();
//			console.log($scope.userObj);
			document.getElementById("emailFlg").checked=$scope.userObj.email_flg=='Y';
			document.getElementById("textFlg").checked=$scope.userObj.textFlg=='Y';
			$scope.changeItem(numberVal($scope.userObj.providerNum));
			if($scope.myAccount && $scope.userObj.updateNeededCount>0 && action=='') {
				showAlertPopup('Items need updating. Press the "Edit Personal Info" button.');
				changeClass('editPersonalButton', 'glowButton');
			}
			
			displayPersonInfo();
			$scope.userStats = [];
			$scope.userStats.push({name: 'Games', value: $scope.userObj.games});
			$scope.userStats.push({name: 'Wins', value: $scope.userObj.wins});
			$scope.userStats.push({name: 'Losses', value: $scope.userObj.losses});
			$scope.userStats.push({name: 'Last-10', value: $scope.userObj.last10});
			$scope.userStats.push({name: 'Rank', value: $scope.userObj.rank});
			$scope.userStats.push({name: 'Points', value: $scope.userObj.rating});
			$scope.userStats.push({name: 'Streak', value: $scope.userObj.streak});
			$scope.userStats.push({name: 'Longest Win Streak', value: $scope.userObj.winning_streak});
			$scope.userStats.push({name: 'Longest Losing Streak', value: $scope.userObj.losing_streak});
			$scope.userStats.push({name: 'Currently Playing', value: $scope.userObj.currentGames.length});
			$scope.userStats.push({name: 'game_count', value: $scope.userObj.game_count});
//			$scope.userStats.push({name: 'Wins This Year', value: $scope.userObj.winsThisYear});

			$scope.ladderStats = [];
			$scope.ladderStats.push({name: 'Points', value: $scope.userObj.ladder.points});
			$scope.ladderStats.push({name: 'Place', value: $scope.userObj.ladder.rank});
			$scope.ladderStats.push({name: 'Wins', value: $scope.userObj.ladder.wins});
			$scope.ladderStats.push({name: 'Losses', value: $scope.userObj.ladder.losses});
			$scope.ladderStats.push({name: 'Last-10', value: $scope.userObj.ladder.last10});
			$scope.ladderStats.push({name: 'Streak', value: $scope.userObj.ladder.streak});
			$scope.ladderStats.push({name: 'Games Max', value: $scope.userObj.ladder.games_max});
			$scope.ladderStats.push({name: 'Games Playing', value: $scope.userObj.ladder.games_playing});
			
			$scope.profileInfo = [];
			$scope.profileInfo.push({name: 'chat_color', value: $scope.userObj.chat_color});
			$scope.profileInfo.push({name: 'chat_font', value: $scope.userObj.chat_font});
			$scope.profileInfo.push({name: 'away_flg', value: $scope.userObj.away_flg});
			$scope.profileInfo.push({name: 'away_msg', value: $scope.userObj.away_msg});
			$scope.profileInfo.push({name: 'graphic', value: $scope.userObj.graphic});
			$scope.profileInfo.push({name: 'message', value: $scope.userObj.message});
			
			$scope.awards=awardsForYear(nowYear(), $scope.userObj.awards);
			setColors($scope.userObj.chat_color);
			
			$scope.completedGamesTitle='All';
			if(!completedGamesLimit || completedGamesLimit<20)
				completedGamesLimit=20;
			if($scope.userObj.last10Games.length==$scope.completedGamesLimit)
				$scope.completedGamesTitle='Last '+completedGamesLimit;
//			console.log($scope.userObj);
			$scope.$apply();
		}
	    });
	}
	function setColors(col) {
		$scope.chatColors.forEach(function(c) {
			if(col==c.color)
				document.getElementById("color"+c.id).checked=true;
		});
		$scope.chatFonts.forEach(function(f) {
			if($scope.userObj.chat_font==f.face)
				document.getElementById("face"+f.id).checked=true;
		});
		if($scope.userObj.away_flg=='Y')
			document.getElementById("awayFlg").checked=true;
	}
	$scope.clearColors=function(color) {
		$scope.chatColors.forEach(function(c) {
			if(color!=c)
				document.getElementById("color"+c.id).checked=false;
		});
	}
	$scope.clearFaces=function(face) {
		$scope.chatFonts.forEach(function(f) {
			if(face!=f)
				document.getElementById("face"+f.id).checked=false;
		});
	}
	$scope.saveProfilePressed=function() {
		var values=[];
		values.push($('#profileMessage').val());
		var col='';
		$scope.chatColors.forEach(function(c) {
			if(document.getElementById("color"+c.id).checked)
			col=c.color;
		});
		if(col.length==0)
			col='#ff8888';
		values.push(col);
		var face='';
		$scope.chatFonts.forEach(function(f) {
			if(document.getElementById("face"+f.id).checked)
			face=f.face;
		});
		if(face.length==0)
			face='verdana';
		values.push(face);
		values.push(document.getElementById("awayFlg").checked?'Y':'');
		values.push($('#awayMessage').val());

		var data = values.join('|');
		console.log(data);
		loadUserDataForUser($scope.user.userName, 'updateProfile', data);
		playClick($scope.muteSound);
		closePopup('profileEditPopup');
	}
    $(function () {
        $(":file").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    });

    function imageIsLoaded(e) {
        $('#myImg').attr('src', e.target.result);
        	$scope.newImageScr=e.target.result;
		$scope.loadImageNum=2;
        	$scope.$apply();
	};
	$scope.changeImagePressed=function() {
		$scope.loadImageNum=1;
	}
	$scope.uploadImagePressed=function() {
		playClick($scope.muteSound);
		closePopup('profileEditPopup');
		loadUserDataForUser($scope.user.userName, 'uploadImage', $scope.newImageScr);
	}
	$scope.gamePopup=function(game, savedFlg) {
		$scope.gamePopupObj=game;
		$scope.gamePopupObj.savedFlg=savedFlg;
		displayFixedPopup('gamePopup');
	}
	$scope.gotoGame=function(game) {
		localStorage.loadGameId=game.id;
		window.location = "index.html#!/board";
	}
	$scope.ngStyleGameWL=function(game) {
		if(game.result=="Win")
			return {'background-color': '#cfc', 'font-size':'12px','color':'gray','border':'1px solid gray'};
		if(game.result=="Loss")
			return {'background-color': '#fcc', 'font-size':'12px','color':'gray','border':'1px solid gray'};
		return {'background-color': '#ffc', 'font-size':'12px','color':'gray','border':'1px solid gray'};
	}
	$scope.ngStyleUserInfo=function(info) {
		if(info.admin)
			return {'background-color': '#ffffc0', 'font-size':'12px','color':'gray','border':'1px solid gray'};
	}
	$scope.upgradeUserToNextLeague=function() {
		startSpinner('working...', 0 , 'upgradeButton');
		var url = getHostname()+"/web_join_game2.php";
	    $.post(url,
	    {
	        user_login: localStorage.username,
	        userName: localStorage.displayUser,
	        Password: localStorage.password,
	        user: $scope.user.userName,
	        code: $scope.user.code,
	        action: 'promoteUserLeague'
	    },
	    function(data, status){
	    	console.log(data);
		stopSpinner('upgradeButton')
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Success',1);
		}
	    });
	}
	$scope.upgradeUser=function(upgradeFlg) {
		var action = (upgradeFlg)?'upgradeUser':'downgradeUser';
		startSpinner('working...', 0 , 'upgradeButton');
		var url = getHostname()+"/web_join_game2.php";
		console.log($scope.user.userName, localStorage.password, $scope.user.code, localStorage.displayUser);
	    $.post(url,
	    {
	        user_login: localStorage.username,
	        userName: localStorage.displayUser,
	        Password: localStorage.password,
	        user: $scope.user.userName,
	        code: $scope.user.code,
	        action: action
	    },
	    function(data, status){
	    	console.log(data);
		stopSpinner('upgradeButton')
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Success',1);
		}
	    });
	}
	function displayPersonInfo(flag) {
		$scope.personInfo = [];
		$scope.personInfo.push({name: 'Username', value: $scope.userObj.name});
		$scope.personInfo.push({name: 'Created', value: $scope.userObj.created});
		if($scope.userObj.first_name.length>0)
			$scope.personInfo.push({name: 'First Name', value: $scope.userObj.first_name});
		if($scope.userObj.city.length>0)
			$scope.personInfo.push({name: 'City', value: $scope.userObj.city});
		if($scope.userObj.state.length>0)
			$scope.personInfo.push({name: 'State', value: $scope.userObj.state});
		if($scope.userObj.country && $scope.userObj.country.length>0)
			$scope.personInfo.push({name: 'Country', value: $scope.userObj.country});
		if($scope.userObj.age.length>0)
			$scope.personInfo.push({name: 'Age', value: $scope.userObj.age});

//		$scope.personInfo.push({name: 'Last Login', value: $scope.userObj.lastLogin});
		$scope.personInfo.push({name: 'Last Login', value: $scope.userObj.last_login_time+' hours ago'});
		
		if(flag) {
			$scope.personInfo.push({name: 'user_id', value: $scope.userObj.user_id, admin: true});
			$scope.personInfo.push({name: 'email', value: $scope.userObj.email, admin: true});
			$scope.personInfo.push({name: 'text_msg', value: $scope.userObj.text_msg, admin: true});
			$scope.personInfo.push({name: 'confirmEmail', value: $scope.userObj.confirmEmailFlg, admin: true});
			$scope.personInfo.push({name: 'confirmTxt', value: $scope.userObj.confirmTextFlg, admin: true});
			$scope.personInfo.push({name: 'textFlg', value: $scope.userObj.textFlg, admin: true});
			$scope.personInfo.push({name: 'email_flg', value: $scope.userObj.email_flg, admin: true});
		}
	}
	$scope.submitUpdates=function() {
		var values=[];
		values.push(''); //document.getElementById("firstName").value
		values.push(''); //document.getElementById("city").value
		values.push(''); //document.getElementById("state").value
		values.push(''); //document.getElementById("country").value
		values.push(''); //document.getElementById("year_born").value
		values.push(document.getElementById("email").value);
		values.push(document.getElementById("phone").value);
		values.push($scope.textProviderNum.toString());
		values.push(document.getElementById("emailFlg").checked?'Y':'');
		values.push(document.getElementById("textFlg").checked?'Y':'');
		var data = values.join('|');
		closePopup('editInfoPopup');
//		console.log('data', data);
		loadUserDataForUser(localStorage.displayUser, 'update', data);
	}
	$scope.changeItem=function(num) {
		$scope.textProviderNum=num;
		updateButtonFilters(num);
	}
	$scope.sendMsgButtonClicked=function() {
		playClick($scope.muteSound);
		document.getElementById("title").value='';
		document.getElementById("message").value='';
		displayFixedPopup('sendMessagePopup');
		window.scrollTo(0, 0);
	}
	$scope.postMessage=function() {
		playClick($scope.muteSound);
		if(document.getElementById("message").value.length==0) {
			showAlertPopup('No Message!', 1);
			return;
		}
		var title=databaseSafe(document.getElementById("title").value);
		var message=databaseSafe(document.getElementById("message").value);
		var urgent=document.getElementById("urgent").checked?'Y':'';
		console.log('data', title,message,urgent);
		closePopup('sendMessagePopup');
		sendMessageToUser(title,message,urgent,0);
	}
	function sendMessageToUser(title,message,urgent,reply_id) {
		startSpinner('Sending...', '150px');
		var url = getHostname()+"/spSendMail.php";
	    $.post(url,
	    {
	        to: $scope.userObj.name,
	        title: title,
	        message: message,
	        urgent: urgent,
	        action: 'send',
	        user: $scope.user.userName,
	        code: $scope.user.code,
	        reply_id: reply_id,
	    },
	    function(data, status){
	    	console.log(data);
	    	stopSpinner();
	    	if(data=="Success")
			showAlertPopup('Message Sent');
		else
			showAlertPopup('Error '+data, 1);
	    });
	}
	$scope.confirmEmailPressed=function(num) {
		closePopup('editInfoPopup');
		displayFixedPopup('confirmEmailPopup');
	}
	$scope.sendEmailCode=function() {
		var num=Math.floor((Math.random() * 1000));
		showAlertPopup('Code has been sent. Check email. May take up to 5 minutes to receive.', 1);
		var code=num+2000;
		sendEmailToUser($scope.userObj.email, code);
		loadUserDataForUser(localStorage.displayUser, 'generateEmailCode', num);
	}
	function sendEmailToUser(email, code) {
		startSpinner('Sending...', '150px');
		var url = 'http://www.appdigity.com/pages/emailSP.php';
	    $.post(url,
	    {
	        email: email,
	        code: code
	    },
	    function(data, status){
	    	console.log(data);
	    	stopSpinner();
	    });
	}
	$scope.sendTextCode=function() {
		var num=Math.floor((Math.random() * 1000));
		showAlertPopup('Code has been sent. Check Phone.', 1);
		var code=num+2000;
		sendEmailToUser($scope.userObj.text_msg, code);
		loadUserDataForUser(localStorage.displayUser, 'generateTextCode', num);
	}
	$scope.authorizeEmailCodePressed=function() {
		var emailCode=document.getElementById("emailCode").value;
		if(emailCode.length!=4) {
			showAlertPopup('Invalid code', 1);
			return;
		}
		closePopup('confirmEmailPopup');
		loadUserDataForUser(localStorage.displayUser, 'authorizeEmailCode', emailCode);
	}
	$scope.confirmTextPressed=function(num) {
		closePopup('editInfoPopup');
		displayFixedPopup('confirmTextPopup');
	}
	$scope.authorizeTextCodePressed=function() {
		var emailCode=document.getElementById("textCode").value;
		if(emailCode.length!=4) {
			showAlertPopup('Invalid code', 1);
			return;
		}
		closePopup('confirmTextPopup');
		loadUserDataForUser(localStorage.displayUser, 'authorizeTextCode', emailCode);
	}
	$scope.ngStyleCheck=function(name) {
		if(name && name.length>0)
			return {'color': 'green', 'font-size': '24px'};
		else
			return {'color': 'red', 'font-size': '24px'};
	}
	$scope.ngClassCheck=function(name) {
		if(name && name.length>0)
			return 'fa fa-check';
		else
			return 'fa fa-times';
	}
	$scope.editButtonClicked=function() {
		displayFixedPopup('editInfoPopup');
	}
}); //userCtrl
app.controller("infoCtrl", function ($scope) {
	displayFixedPopup('mainPopup');
	playClick($scope.muteSound);
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	if($scope.user.rank==0)
		registerIP(-4);
	$scope.showAllFlg=true;
	localStorage.videoWatched='Y';
	document.getElementById('musicBox').checked=isMusicOn();
	document.getElementById('soundBox').checked=isSoundOn();
	$scope.displayAudioSettings=function() {
		playClick($scope.muteSound);
		displayFixedPopup('audioPopup');
	}
	$scope.displayGameTypes=function() {
		playClick($scope.muteSound);
		$scope.gameTypes=getGameTypesObj(false, 1);
		$scope.gameTypes2=getGameTypesObj(false, 2);
		$scope.gameTypes3=getGameTypesObj(false, 3);
		displayFixedPopup('gameTypesPopup', true);
	}
	$scope.displayRulebook=function() {
		playClick($scope.muteSound);
		displayFixedPopup('rulebookPopup', true);
	}
	$scope.changeAudioSettings=function() {
		if(document.getElementById('musicBox').checked) {
			localStorage.removeItem('musicBox');
			$scope.introAudio.play();
		} else {
			localStorage.musicBox='N';
			$scope.introAudio.pause();
		}
		if(document.getElementById('soundBox').checked)
			localStorage.removeItem('soundBox');
		else
			localStorage.soundBox='N';
	}
	$scope.showCasualties=function() {
		if($scope.casList && $scope.casList.length>0) {
			$scope.casList=[];
			return;
		}
		$scope.casList=[];
		$scope.gUnits.forEach(function(unit) {
			if(unit.cas<99)
				$scope.casList.push({name: unit.name, cas: unit.cas, id: unit.id});
		});
	}
	$scope.openCloseSlider=function(id) {
		$scope.openCloseSliderInfo(id);
	}
	$scope.openCloseSliderInfo=function(id) {
		playSound('open.mp3', 0, $scope.muteSound);
		$scope.showPanelDetails=true;
		var popupId = id+'Popup';
		var buttonId = id+'Button';
		var className = document.getElementById(popupId).className;
		if(className=='popupScreenOpen') {
			changeClass(popupId, 'popupScreenClosed');
			changeClass(buttonId, 'btn btn-primary roundButton');
		} else {
			changeClass(popupId, 'popupScreenOpen');
			changeClass(buttonId, 'btn ptp-yellow roundButton');
			if(popupId=='logsPopup') {
				changeClass(popupId, 'popupScreenClosed');
				setTimeout(function() { turnOnSlider(popupId); }, 100);
			}
			if(id=='logs') {
				document.getElementById(popupId).style.display='block';
				$scope.logRound=$scope.gameObj.round;
				disableButton('leftArrow', $scope.logRound<=1);
				disableButton('rightArrow', $scope.logRound>=$scope.gameObj.round);
			}
			if(id=='chat') {
				$scope.recipient='All';
				$scope.recipientId=0;
				$scope.recipientNationId=0;
				$scope.recipientNation=0;
				updateChatMessages('N');
			}
		}
	}
}); //infoCtrl
app.controller("ranksCtrl", function ($scope) {
	playClick($scope.muteSound);
	$scope.ranks=getAllRanks();
	$scope.ngStyleRank=function(num1, num2) {
		return ngStyleRank(num1, num2);
	}
}); //ranksCtrl
app.controller("profileCtrl", function ($scope) {
	playClick($scope.muteSound);
	$scope.logout = function () {
		playClick($scope.muteSound);
		localStorage.removeItem('username');
		if(localStorage.rank>2)
			localStorage.rank=2;
		showAlertPopup('User logged out');
		window.location = "#!/";
	}
}); //profileCtrl
app.controller("tournamentCtrl", function ($scope) {
	playClick($scope.muteSound);
	displayFixedPopup('mainPopup');
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	console.log($scope.user);
	$scope.tourneyId=3;
	tournamentList('show', $scope.tourneyId);
	
	$scope.tourneySignup=function(tournyId) {
		if(!$scope.user || !$scope.user.userName || $scope.user.userName.length==0)
			window.location = "#!/login";
		else
			tournamentList('signup', tournyId);
	}
	$scope.tourneyBossSignup=function(num) {
		playClick($scope.muteSound);
		if(!$scope.user || !$scope.user.rank || $scope.user.rank<1) {
			showAlertPopup('Sorry, you must complete basic training before signing up.', 1);
			return;
		}
		if($scope.user.userId<2514) {
			showAlertPopup('Sorry, this tournament only available to new players.', 1);
			return;
		}
		if(num==1)
			displayFixedPopup('bossTournyPopup');
		if(num==2) {
			var ps = $('#tournyPassword').val();
			if(ps!='boss') {
				showAlertPopup('Invalid password.', 1);
				return;
			}
			tournamentList('signup', 2);
			closePopup('bossTournyPopup');
		}
	}
	function tournamentList(action, tournyId) {
		startSpinner('signing up...', '', 'signupButton');
		var url = getHostname()+"/tournament.php";
	    $.post(url,
	    {
	        user_login: localStorage.username,
	        userName: $scope.user.userName,
	        code: $scope.user.code,
	        tournament_id: tournyId,
	        action: action
	    },
	    function(data, status){
	    	stopSpinner('signupButton');
			console.log(data);
		if(verifyServerResponse(status, data)) {
			if(action=='signup')
				showAlertPopup('Success! Check back daily until tournament starts.');
			var items = data.split("<br>");
			$scope.entrants=[];
			$scope.userEntered=false;
			items.forEach(function(line) {
				var entrant = entrantFromLine(line);
				if(entrant.name && entrant.name.length>0) {
					if(entrant.name == $scope.user.userName) {
						$scope.userEntered=true;
					}
					$scope.entrants.push(entrant);
				}
			});
			$scope.$apply();
				console.log($scope.entrants);
		}
	    });
	}
}); //tournamentCtrl
app.controller("matchMakingCtrl", function ($scope) {
	playClick($scope.muteSound);
	displayFixedPopup('mainPopup');
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	console.log($scope.user);
	if(!localStorage.mmViewedFlg || localStorage.mmViewedFlg!='Y')
		localStorage.mmViewedFlg='Y';
		
	
	$scope.myEMPCount=localStorage.existingEMPCount;
	$scope.leagueId=$scope.user.league_id || 1;
	changeClass('buttonFilterX1', ($scope.leagueId==1)?'btn btn-primary':'btn btn-default'); 
	changeClass('buttonFilterX2', ($scope.leagueId==2)?'btn btn-primary':'btn btn-default'); 
	changeClass('buttonFilterX3', ($scope.leagueId==3)?'btn btn-primary':'btn btn-default'); 
	changeClass('buttonFilterX4', ($scope.leagueId==4)?'btn btn-primary':'btn btn-default'); 
	$scope.maxGames=0;
	$scope.topMenuNum=0;
	$scope.availablePlayers=0;
	loadLeaders('');
	$scope.changeTopMenu=function(num) {
		playClick($scope.muteSound);
		$scope.topMenuNum=num;
		updateButtonFilters(num);
	}
	$scope.showMMDetails=function() {
		$scope.showDetailsFlg=!$scope.showDetailsFlg;
		if($scope.showDetailsFlg)
			displayFixedPopup('mmPlayerDetail', true);
		else
			closePopup('mmPlayerDetail');
	}
	function loadLeaders(action) {
	    	disableButton('downButton', true);
	    	disableButton('upButton', true);
	    	disableButton('exitButton', true);
	    	disableButton('joinButton', true);
		startSpinner('Loading...', '150px');
		$scope.fullLeaderList=[];
		$scope.hotStreakList=[];
		$scope.coldStreakList=[];
		var url = getHostname()+"/webLeaders.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        action: action,
	        maxGames: $scope.maxGames,
	        type: '0',
	        ladder_id: $scope.leagueId
	    },
	    function(data, status){
//	    	console.log(data);
	    	stopSpinner();
	    	disableButton('exitButton', false);
	    	disableButton('joinButton', false);
//	    	console.log($scope.leagueId, data);
		var items = data.split("<br>");
		
		$scope.maxGames=numberVal(items[1]);
		var c = items[1].split('|');
		var leagueId=numberVal(c[1]);
		if(leagueId>0 && leagueId != $scope.leagueId) {
			localStorage.league_id = leagueId.toString();
			$scope.leagueId=leagueId;
			changeClass('buttonFilterX1', ($scope.leagueId==1)?'btn btn-primary':'btn btn-default'); 
			changeClass('buttonFilterX2', ($scope.leagueId==2)?'btn btn-primary':'btn btn-default'); 
			changeClass('buttonFilterX3', ($scope.leagueId==3)?'btn btn-primary':'btn btn-default'); 
			changeClass('buttonFilterX4', ($scope.leagueId==4)?'btn btn-primary':'btn btn-default'); 
		}
		var leaders=items[2].split('<li>');
		var maxWait=0;
		$scope.userWaiting = '';
		var ipHash= {};
		$scope.ipViolator='';
		$scope.maxPoints=0;
		$scope.availablePlayers=0;
		$scope.ipCheck='ok';
		var top8 = 1515;
		var bot8 = 1497;
		for(var x=0; x<leaders.length; x++) {
			var line=leaders[x];
			var player = leaderFromLine(line);
			if(player.points>$scope.maxPoints)
				$scope.maxPoints=player.points;
				
			player.mmPoints=player.points;
			if(player.mmPoints>top8)
				player.mmPoints=top8;
			if(player.mmPoints<bot8)
				player.mmPoints=bot8;
//			console.log(player.name, player);
			if(player.name.length>0) {
				if(ipHash[player.ip]) {
					$scope.ipCheck='ipViolation!!!';
					$scope.ipViolator=player.name;
					ipHash[player.ip]++;
				} else
					ipHash[player.ip]=1;
				if(player.games_max>player.games_playing && player.days_old<2) {
					$scope.availablePlayers++;
//					console.log('xxx', player.name, player);
					if(player.hoursWaiting>=maxWait) {
						maxWait=player.hoursWaiting;
						$scope.userWaiting=player; //
					}
				}
				if(player.stk>0)
					$scope.hotStreakList.push(player);
				if(player.stk<0)
					$scope.coldStreakList.push(player);
				if(player.days_old<=3)
					$scope.fullLeaderList.push(player);
			}
		}
		disableButton('startGamesButton', ($scope.availablePlayers<8));
//		console.log($scope.fullLeaderList);
//		console.log(ipHash);
	        checkMaxGamesButtons();
	    	$scope.$apply();
	    });
	}
	$scope.joinMatchmaking=function() {
		$scope.maxGames=2;
		loadLeaders('joinLeague');
	}
	$scope.exitMatchmaking=function() {
		$scope.maxGames=0;
		loadLeaders('exitLeague');
	}
	$scope.changeMaxGames=function(num) {
		var maxGamesAllowed=5;
		if($scope.user.speedType==2)
			maxGamesAllowed=4;
		if($scope.user.speedType==3)
			maxGamesAllowed=3;
			
		if(num==1 && $scope.maxGames+1>maxGamesAllowed) {
			showAlertPopup('Sorry, based on your avg game speed, you are only allowed to be in '+maxGamesAllowed+' games max right now. Having a faster response time for taking turns will allow you to bump this up to 5 games.');
			return;
		}
		$scope.maxGames+=num;
		checkMaxGamesButtons();
		loadLeaders('changeMax_games');
	}
	function checkMaxGamesButtons() {
		disableButton('downButton', $scope.maxGames<=1);
		disableButton('upButton', $scope.maxGames>=5);
	}
	$scope.changeLeague=function(num) {
		playClick($scope.muteSound);
		updateButtonFiltersForId('buttonFilterX', num-1);
		$scope.leagueId=num;
//		loadLeaders('');
	}
	$scope.startMatchmakingGames=function() {
		disableButton('startGamesButton', true);
		newStartMMGames($scope.userWaiting.points);
	}
	$scope.startBronzeMatchmakingGames=function() {
		disableButton('startGamesButton2', true);
		newStartMMGames(1500);
	}
	function newStartMMGames(pts) {
		var fifthPlace = 1520;
		if(pts>$scope.maxPoints-6)
			pts=$scope.maxPoints-6;
			
		if(pts>fifthPlace)
			pts = fifthPlace;
		var tollarance = 15;
		var readyList=[];
		var ipHash = {};
		$scope.fullLeaderList.forEach(function(player) {
			player.ptDiff = Math.abs(player.mmPoints-pts);
			if(player.games_max > player.games_playing && player.ptDiff <= tollarance && player.days_old<=1) {

				var num = numberVal(ipHash[player.ip]);
				if(num==0)
					ipHash[player.ip]=0;
				ipHash[player.ip]++;

				if(ipHash[player.ip]==1)
					readyList.push(player);
				else
					console.log('ip dupe!!', player.name, player.ip);
			}
		});
		console.log(readyList.length+' players within '+tollarance+' points of '+pts);
		readyList.sort(function(a, b) { return a.ptDiff - b.ptDiff; });
		var numPlayers = 8;
		var gameTypes = ["battlebots", "diplomacy", "autobalance", "freeforall", "firefight", "hungerGames", "barbarian", "co-op", "ffa-5", "ffa-6", "ffa-7"];
		var gameType = gameTypes[Math.floor((Math.random() * gameTypes.length))];
		if(gameType=='co-op')
			numPlayers=3;
		if(gameType=='battlebots')
			numPlayers=4;
		if(gameType=='ffa-5')
			numPlayers=5;
		if(gameType=='ffa-6')
			numPlayers=6;
		if(gameType=='ffa-7')
			numPlayers=7;
				
		if(readyList.length<numPlayers) {
			showAlertPopup('Not enough players found! tollarance: '+tollarance+', players found: '+readyList.length, 1);
			return;
		}
		var finalList = [];
		for(var x=0; x<numPlayers; x++) {
			finalList.push(readyList[x].id);
		}
		var fList = finalList.join('|');
		console.log(gameType, numPlayers, fList);
		startMMGames('start_games2', fList, gameType); //start_games
	}
	function startMMGames(action, pList, type) {
		startSpinner('Starting...', '150px');
		var url = getHostname()+"/webLadder.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: action,
	        pList: pList,
	        ladder_id: 1,
	        type: type
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
	    	if(verifyServerResponse(status, data))
	    		showAlertPopup('Game started');
	    });
	}
}); //matchMakingCtrl
app.controller("createGameCtrl", function ($scope) {
	playClick($scope.muteSound);
	displayFixedPopup('mainPopup');
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.gameTypes=getGameTypesObj();
	
	var gameTypeNum=0;
	showType();
	$scope.numberPlayers=8;
	$scope.selectedNation=0;
	$scope.autoAssignClicked=function() {
		$scope.autoAssign = document.getElementById('autoAssign').checked?'Y':'N';
		if($scope.autoAssign=="Y")
			$scope.selectedNation=0;
		else if($scope.selectedNation==0)
			$scope.selectedNation=1;
	}
	$scope.ngClassGameType=function(gameType) {
		return ngClassGameTypeMain(gameType);
	}
	$scope.privateClicked=function() {
		playClick($scope.muteSound);
		var value = document.getElementById('privateOpt').checked;
		$scope.privateOptChecked=value;
	}
	$scope.turboChecked=function() {
		playClick($scope.muteSound);
		var value = document.getElementById('turboFlg').checked;
		$scope.turboFlgChecked=value;
		if($scope.numberPlayers>4)
			$scope.numberPlayers=4;
	}
	$scope.fogOfWarClicked=function(flag) {
		if(flag) {
			document.getElementById('fogOfWar').checked=document.getElementById('fogOfWar2').checked;
		} else {
			document.getElementById('fogOfWar2').checked=false;
		}
	}
	$scope.autoSkipClicked=function() {
		if($scope.user.rank<7) {
			showAlertPopup('Games must be Auto Skip until you reach level of Warrant Officer.',1);
			document.getElementById('autoSkip').checked=true;
		}
		document.getElementById('officersOnly').checked=true;
	}
	$scope.officersOnlyClicked=function() {
		if(!document.getElementById('autoSkip').checked) {
			showAlertPopup('Lower ranked players only allowed in Auto Skip games. Turn on Auto Skip if you want all players allowed in this game.',1);
			document.getElementById('officersOnly').checked=true;
		}
	}
	$scope.spButtonClicked=function() {
		$scope.selectedNation++;
		if($scope.selectedNation>8)
			$scope.selectedNation=1;
	}
	$scope.infoButtonClicked=function(num) {
		playClick($scope.muteSound);
		if(num==1)
			$scope.showTypeInfo=!$scope.showTypeInfo;
	}
	$scope.changeType=function(num) {
		playClick($scope.muteSound);
		gameTypeNum++;
		if(gameTypeNum>=$scope.gameTypes.length)
			gameTypeNum=0;
		showType();
	}
	$scope.loadType=function(game) {
		playClick($scope.muteSound);
		gameTypeNum=game.id;
		showType();
	}
	function showType() {
		$scope.gameType=$scope.gameTypes[gameTypeNum];
		checkNumberOfPlayers();
		var numPlayersForGame = numPlayersPerType($scope.gameType.type);
		disableButton('numPlayersButton', (numPlayersForGame.min==numPlayersForGame.max));
	}
	function checkNumberOfPlayers() {
		var numPlayersForGame = numPlayersPerType($scope.gameType.type);
		if($scope.numberPlayers>numPlayersForGame.max)
			$scope.numberPlayers=numPlayersForGame.max;
		if($scope.numberPlayers<numPlayersForGame.min)
			$scope.numberPlayers=numPlayersForGame.min;
	}
	$scope.changeNumPlayers=function(num) {
		if($scope.gameType.type=='firefight' || $scope.gameType.type=='hungerGames' || $scope.gameType.type=='barbarian' || $scope.gameType.type=='co-op') {
			playSound('error.mp3', 0, $scope.muteSound);
			return;
		}
		playClick($scope.muteSound);
		$scope.numberPlayers++;
		var maxPlayers = ($scope.turboFlgChecked)?4:8;
		if($scope.numberPlayers>maxPlayers)
			$scope.numberPlayers=2;
		checkNumberOfPlayers();
	}
	$scope.create=function(num) {
		playClick($scope.muteSound);
		var nameField = databaseSafe(document.getElementById('nameField').value);
		if(nameField.length==0) {
			showAlertPopup('Name field is blank', 1);
			return;
		}
		var password = '';
		if(document.getElementById('privateOpt').checked) {
			password = databaseSafe(document.getElementById('passField').value);
			if(password.length==0) {
				showAlertPopup('Password field is blank', 1);
				return;
			}
		}
		var fogOfWar = document.getElementById('fogOfWar').checked?'Y':'N';
		var hardFog = document.getElementById('fogOfWar2').checked?'Y':'N';
		var autoAssign = document.getElementById('autoAssign').checked?'Y':'N';
		var autoStart = document.getElementById('autoStart').checked?'Y':'N';
		var autoSkip = document.getElementById('autoSkip').checked?'Y':'N';
		var noSpecs = document.getElementById('noSpecs').checked?'Y':'N';
		var noStats = document.getElementById('noStats').checked?'Y':'N';
		var officersOnly = document.getElementById('officersOnly').checked?'Y':'N';
		var noGenerals = document.getElementById('noGenerals').checked?'Y':'N';
		var sameRank = document.getElementById('sameRank').checked?'Y':'N';
		var turboFlg = document.getElementById('turboFlg').checked?'Y':'N';
		var hostRank = $scope.user.rank;
		var attackRound='6';
		var newEngineFlg='Y';
		var minRank=0;
		var maxRank=0;
		if(officersOnly=='Y')
			minRank=7;
		if(noGenerals=='Y')
			maxRank=13;
		if(sameRank=='Y') {
			minRank=$scope.user.rank;
			maxRank=$scope.user.rank;
		}
		if (nameField.indexOf("'") > -1) {
		  nameField = nameField.replace("'", "");
		}
			
		var components = [nameField, $scope.gameType.type, $scope.numberPlayers, attackRound, fogOfWar, autoAssign
		, autoStart, autoSkip, noSpecs, noStats, newEngineFlg, minRank, maxRank, hostRank, password, hardFog, turboFlg];
		var data = components.join('|');
		startSpinner('Creating Game...', '150px', 'createButton');
		createGame(data);
	}
	function createGame(dataLine) {
//		var url = getHostname()+"/iPhoneCreateMultiGame2.php";
		var url = getHostname()+"/web_join_game2.php";
	    $.post(url,
	    {
	        user_login: localStorage.username,
	        code: $scope.user.code,
	        data: dataLine,
	        action: 'createGame',
	        nation: $scope.selectedNation
	    },
	    function(data, status){
	    	stopSpinner('createButton');
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Success!');
			window.location = "#!/multiplayer";
		}
	    });
	}
}); //createGameCtrl
app.controller("loginCtrl", function ($scope) {
	playClick($scope.muteSound);
	displayFixedPopup('mainPopup');
	checkServer();
	$scope.login = function () {
		var email = databaseSafe(document.getElementById('emailField').value);
		var password = databaseSafe(document.getElementById('passwordField').value);
		if(email=='111' && password=='111') {
			email = 'Rick';
		}
		if(email=='222' && password=='222') {
			email = 'General Robb';
		}
		if(email.length==0) {
			showAlertPopup('Email field is blank', 1);
			return;
		}
		if(password.length==0) {
			showAlertPopup('Password field is blank', 1);
			return;
		}
		startSpinner('Logging in...', '150px', 'loginButton');
		loginToSystem(email, password);
	}
	$scope.createLogin = function (altFlg) {
		var email = databaseSafe(document.getElementById('emailField2').value);
		var firstName = databaseSafe(document.getElementById('firstName').value);
		var password1 = databaseSafe(document.getElementById('password1').value);
		var password2 = databaseSafe(document.getElementById('password2').value);
		if(email.length==0) {
			showAlertPopup('Email field is blank', 1);
			return;
		}
		if(firstName.length==0) {
			showAlertPopup('firstName field is blank', 1);
			return;
		}
		if(password1.length==0) {
			showAlertPopup('password1 field is blank', 1);
			return;
		}
		if(password2.length==0) {
			showAlertPopup('password2 field is blank', 1);
			return;
		}
		if(password1!=password2) {
			showAlertPopup('Password fields do not match', 1);
			return;
		}
		startSpinner('Creating Superpowers Account...', '150px', 'createButton');
		var rank = localStorage.rank || 1;
		var appVersion = $scope.version || 'none';
		if(altFlg)
			createAccount2(email, firstName, password1, password2, rank, appVersion);
		else
			createAccount(email, firstName, password1, password2, rank, appVersion);
	}
	function checkServer() {
		$scope.checkServerFlg=false;
		var url = getHostname()+"/webSuperpowers.php";
	    $.post(url,
	    {
	        action: 'checkServer'
	    },
	    function(data, status){
		$scope.checkServerFlg=true;
		$scope.$apply();
	    });
	}
	function createAccount2(email, firstName, password1, password2, rank, appVersion) {
		var url = getHostname()+"/webSuperpowers.php";
	    $.post(url,
	    {
	        Username: email,
	        Password: password1,
	        Firstname: firstName,
	        appName: appVersion,
	        rank: rank,
	        action: 'createAccount'
	    },
	    function(data, status){
	    	stopSpinner('createButton');
		if(verifyServerResponse(status, data)) {
	    		var components = data.split("|");
	    		console.log('data', data, firstName, password1);
	    		if(components[0]=='Success') {
				localStorage.username = firstName;
				localStorage.password = password1;
				getIPInfo(localStorage.username, localStorage.password);
				showAlertPopup('Success!');
				window.location = "index.html#!/";
				computerAnnouncement2('New player signup: '+firstName);
	    		}
		}
	    });
	}
	/*function checkLoginState() {
	  FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	  });
	}
	FB.login(function(response){
	  // Handle the response object, like in statusChangeCallback() in our demo
	  // code.
	});
	FB.login(function(response) {
	  if (response.status === 'connected') {
	    // Logged into your app and Facebook.
	  } else {
	    // The person is not logged into this app or we are unable to tell. 
	  }
	});
	FB.logout(function(response) {
	   // Person is now logged out
	});*/
	function createAccount(email, firstName, password1, password2, rank, appVersion) {
		var url = getHostname()+"/web_create_account.php";
	    $.post(url,
	    {
	        Username: email,
	        Password: password1,
	        Firstname: firstName,
	        appName: appVersion,
	        rank: rank
	    },
	    function(data, status){
	    	stopSpinner('createButton');
		if(verifyServerResponse(status, data)) {
	    		var components = data.split("|");
	    		console.log('data', data, firstName, password1);
	    		if(components[0]=='Success') {
				localStorage.username = firstName;
				localStorage.password = password1;
				getIPInfo(localStorage.username, localStorage.password);
				showAlertPopup('Success!');
				window.location = "index.html#!/";
				computerAnnouncement2('New player signup: '+firstName);
	    		}
		}
	    });
	}
	function computerAnnouncement2(msg) {
		var url = getHostname()+"/webSuperpowers.php";
		    $.post(url,
		    {
		        user_login: 'test',
		        code: 'test',
		        msg: msg,
		        action: 'computerAnnouncement'
		    },
		    function(data, status){
		    	console.log(data, status);
		    });
	}
	$scope.forgotPassword = function () {
		var email = databaseSafe(document.getElementById('emailField').value);
		if(email.length==0) {
			showAlertPopup('Enter your email address in the user field, then press this button.', 1);
			return;
		}
		startSpinner('Checking info...', '150px', 'forgotPasswordButton');
		forgotPasswordWebService(email);
	}
	$scope.showCreateForm = function () {
		if(numberVal(localStorage.rank)>=1) {
			$scope.showCreatForm = !$scope.showCreatForm;
		} else
			showAlertPopup('Sorry, you must first complete Basic Training before joining multi-player games.', 1);
	}
	function forgotPasswordWebService(email) {
	    $.post(getHostname()+"/web_forgot_my_password.php",
	    {
	        Username: email
	    },
	    function(data, status){
	    	stopSpinner('forgotPasswordButton');
	    	if(status=='success') {
	    		if(data.substring(0, 7)=='Success') {
				showAlertPopup('Password has been emailed.');
	    		}
	    		else
	    		    showAlertPopup(data);
	    	} else
	    		showAlertPopup('Network Error '+status);
	    });
	} //forgotPasswordWebService

	function loginToSystem(email, password) {
		var url = getHostname()+"/iPhoneLogin2.php";
	    $.post(url,
	    {
	        Username: email,
	        Password: password
	    },
	    function(data, status){
	    	console.log(data);
	    	stopSpinner('loginButton');
		if(verifyServerResponse(status, data)) {
	    		var components = data.split("|");
	    		if(components[0]=='Success') {
				localStorage.username = components[1];
				localStorage.password = password;
				var rank = numberVal(components[2]);
				if(rank<1)
					rank=1;
				localStorage.rank = rank;
				
				var gold_member_flg = components[3];
				if(gold_member_flg=='Y' && localStorage.gold_member_flg != 'Y') {
					localStorage.gold_member_flg = 'Y';
					$scope.gold_member_flg = 'Y';
				}
				window.location = "index.html#!/";
//				$scope.goBack();
	    		}
		}
	    });
	} //loginToSystem
}); //loginCtrl
app.controller("multiplayerCtrl", function ($scope) {
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.gameMusic.pause();
	$scope.uploadMultiplayerFlg=false;
	localStorage.homePage='multiplayerHome';
	$scope.showWelcome=($scope.user.rank<=3);
	localStorage.displayUser=$scope.user.userName;
	$scope.ranks=getAllRanks();
	if(!$scope.user || !$scope.user.userName || $scope.user.userName.length==0) {
		window.location = "index.html#!/login";
		return;
	}
    	var existingMaxGames = numberVal(localStorage.existingMaxGames);
	if($scope.user.rank>=3 && existingMaxGames==0 && !localStorage.mmPopupFlg) {
		localStorage.mmPopupFlg='Y';
		displayFixedPopup('mmJoinPopup');
	}
	$scope.topMenuNum=0;
	$scope.unitFilter=0;
	$scope.iosApp = localStorage.iosApp;
	disableButton('createGameButton', !localStorage.username || localStorage.username.length==0);
	disableButton('matchmakingButton', !localStorage.username || localStorage.username.length==0);
	playClick($scope.muteSound);
	loadGames();
	function loadGames() {
		disableButton('refreshGamesButton', true);
		startSpinner('Loading...', '150px');
		$scope.fullGameList=[];
		$scope.bugGameCount=0;
		$scope.gameId=0;
		var url = getHostname()+"/web_games3.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        version: $scope.version
	    },
	    function(data, status){
		disableButton('refreshGamesButton', false);
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
//			console.log(data);
			var items = data.split("<b>");
			var basics=items[0];
			var c=basics.split('|');
			$scope.multiPlayerObj = getMultObjFromLine(basics);
			console.log('basics', basics, $scope.multiPlayerObj);
//			if($scope.multiPlayerObj.confirmEmailFlg != 'Y' && $scope.multiPlayerObj.confirmTextFlg != 'Y') {
///				showAlertPopup('Welcome to multiplayer! Click on your profile button if you would like to have turn notices emailed to you.',1);
//				changeClass('profileButton', 'glowButton');
//			}
			if($scope.multiPlayerObj.league_id>$scope.user.league_id && $scope.multiPlayerObj.league_id>1 && $scope.user.league_id>0) {
				localStorage.league_id = $scope.multiPlayerObj.league_id.toString();
				playSound('tada.mp3', 0, $scope.muteSound);
				playSound('Cheer.mp3', 0, $scope.muteSound);
				var names = leagueNames();
				displayFixedPopup('newLeaguePopup');
			}
//			console.log($scope.multiPlayerObj);
			var netRank = numberVal(c[4]);
			$scope.chatMsg = c[5];
			$scope.updateNeededCount = numberVal(c[6]);
			$scope.updateNeededCount=0;
			$scope.userGraphic=userGraphicFromLine(c[7]);
			if(!localStorage.userGraphic || localStorage.userGraphic != $scope.userGraphic)
				localStorage.userGraphic=$scope.userGraphic;
			$scope.lastestUser=userGraphicFromLine(c[8]);
			$scope.mailCount=userGraphicFromLine(c[9]);
			var urgentCount=userGraphicFromLine(c[10]);
			var newGame = c[11];
			var oldGame = c[12];
			var gameResult = c[13];
			var minutes = c[14];
			var myEMPCount = c[15];
			$scope.myEMPCount=myEMPCount;
			if(numberVal(localStorage.existingEMPCount) != numberVal(myEMPCount))
				localStorage.existingEMPCount = myEMPCount;
			$scope.user.turnSpeed = parseInt(minutes/60);
			$scope.user.speedType=speedTypeFromMin(minutes);
			if(!localStorage.speedType || localStorage.speedType != $scope.user.speedType)
				localStorage.speedType=$scope.user.speedType;
			
			$scope.maxGamesAllowed=7;
			if($scope.user.speedType==2)
				$scope.maxGamesAllowed=5;
			if($scope.user.speedType==3)
				$scope.maxGamesAllowed=3;
			if(oldGame.length>0) {
				if(gameResult=='Win')
					playSound('Cheer.mp3', 0, $scope.muteSound);
				else
					playSound('CrowdBoo.mp3', 0, $scope.muteSound);
				displayFixedPopup('newGamePopup');
				$scope.newGame=false;
				$scope.gameName=oldGame;
				$scope.gameResult=gameResult;
			} else if(newGame.length>0) {
				playSound('tada.mp3', 0, $scope.muteSound);
				displayFixedPopup('newGamePopup');
				$scope.gameName=newGame;
				$scope.newGame=true;
			}
			console.log(newGame, oldGame, gameResult);
			if(urgentCount>0) {
				showAlertPopup('Urgent Message');
				window.location = "index.html#!/mail";
				return;
			}
			var currentRank=numberVal($scope.user.rank);
			if(netRank>currentRank)
				promoteThisUsertoRank(netRank, 'x1b');
			if($scope.user.rank>2 && netRank<$scope.user.rank) {
				localStorage.rank=2;
				showAlertPopup('illegal rank!');
			}
			var games=items[1].split("<a>");
			$scope.gamesPlayingCount=0;
			$scope.usersOnline=items[2];
			var gameToStart=false;
			$scope.gamesOpen=0;
			$scope.myGamesCount=0;
			$scope.myGamesPlayingCount=0;
			$scope.gamesRecentlyCompleted=0;
			$scope.playingNotMMCount=0;
			$scope.timedoutGameCount=0;
			$scope.mMGameCount=0;
			$scope.newActionFlg=false;
			$scope.newChatFlg=false;
			$scope.turnNowFlg==false;
			for(var x=0; x<games.length; x++) {
				var game=games[x];
				if(game.length>10) {
					var gameOb = gameFromLine(game, localStorage.username);
//					console.log(gameOb);
					if(gameOb.turn==$scope.user.userName && gameOb.status=='Playing')
						$scope.turnNowFlg=true;
					if(gameOb.bugFlg) {
						$scope.bugsFlg=true;
						$scope.bugGameCount++;
					}
					if(gameOb.newActionFlg)
						$scope.newActionFlg=true;
					if(gameOb.chatFlg)
						$scope.newChatFlg=true;
					if(gameOb.status=='Picking Nations') {
						console.log(gameOb);
						gameToStart=gameOb;
					}
					$scope.fullGameList.push(gameOb);
					if(gameOb.status=='Open')
						$scope.gamesOpen++;
					if(gameOb.status=='Playing') {
						$scope.gamesPlayingCount++;
						if(gameOb.turnObj.timeLeft=='-Times up-' || gameOb.turnObj.last_login_time>36)
							$scope.timedoutGameCount++;
					}
					if(gameOb.status=='Complete')
						$scope.gamesRecentlyCompleted++;
					if(gameOb.inGame && gameOb.status=='Playing') {
						$scope.myGamesPlayingCount++;
					}
					if(gameOb.inGame && gameOb.status=='Playing' && gameOb.ladder_id==0) 
						$scope.playingNotMMCount++;
					if(gameOb.status=='Playing' && gameOb.ladder_id>0) 
						$scope.mMGameCount++;
					if(gameOb.inGame) 
						$scope.myGamesCount++;
				}
			}

			if($scope.gamesOpen>0)
				changeClass('gameType3', 'openTab');
//			console.log('myGamesPlayingCount', $scope.myGamesPlayingCount, $scope.playingNotMMCount);
			filterGames();
			$scope.showWelcome = ($scope.myGamesCount==0);
			if($scope.gameList.length==0)
				$scope.changeGameType(2);
//			displayFixedPopup('chatPopup');
	    		$scope.$apply();
	    		if(gameToStart && gameToStart.gameId>0) {
				startSpinner('Starting Game...', '150px');
				setTimeout(function() { startThisMultiplayerGame(gameToStart); }, 500);	
	    		}
		}
	    });
	}
	$scope.refreshGames=function() {
		loadGames();
	}
	$scope.plusButtonClicked=function() {
		window.location = "index.html#!/createGame";
	}
	$scope.gotoTournament=function() {
		window.location = "index.html#!/tournament";
	}
	$scope.gotoRanks=function() {
		window.location = "index.html#!/ranks";
	}
	$scope.ngStyleGamesOpen=function() {
		if($scope.gamesOpen>0) {
			if($scope.unitFilter==2)
				return {'background-color': '#204d74', 'color': 'white'};
			else
				return {'background-color': '#cfc', 'color': 'black'};
		}
	}
	$scope.showDetailsPopup=function(game, id) {
		$scope.showDetailFlg=!$scope.showDetailFlg;
		disableButton('saveTeamsButton', true);
		$scope.game=game;
		$scope.showPlayerTeamsFlg=false;
		if($scope.showDetailFlg)
			displayFixedPopup('gameDetailPopup', true);
		else
			stopTurboViewer();
	}
	function startTurboViewer(game, id) {
		if($scope.turboViewingOn)
			return;
		$scope.turboViewingOn=true;
		setTimeout(function() { doTurboViewer(game, id); }, 50);
	}
	function doTurboViewer(game, id) {
		if(!$scope.turboViewingOn)
			return;

		var e = document.getElementById("msgField2");
		if(!e) {
			$scope.viewingChatFlg=false;
			return;
		}
		var url = getHostname()+"/chatRoom.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'readChat',
	        gameId: game.gameId
	    },
	    function(data, status){
	    	var obj = JSON.parse(data);
//	    	console.log('response obj: ', obj, game);
		if(verifyServerResponse(status, obj.status)) {
			$scope.chatRoomMessages = obj.messages;
			$scope.usersOnlineTop = obj.online;
			$scope.numPlayers = obj.numPlayers;
			if(obj.gameStatus=='Playing') {
				$scope.turboViewingOn=false;
				localStorage.secondsSinceLogin = game.turnObj.seconds;
				localStorage.turnObjName = game.turnObj.name;
				localStorage.loadGameId=game.gameId;
				localStorage.chatFlg=(game.chatFlg)?"Y":"N";
				window.location = "index.html#!/board";
			} else {
				$scope.$apply();
				var e = document.getElementById("msgField2");
				if(e)
					setTimeout(function() { doTurboViewer(game, id); }, 5000);	
				else
					$scope.turboViewingOn=false;
			}
		}
	    });

	}
	$scope.postChatMessage=function() {
		var message = databaseSafe(document.getElementById("msgField2").value);
		if(message.length==0) {
			showAlertPopup('no message', 1);
			return;
		}
		$scope.chatRefreshTimer=5000;
		disableButton('sendButton2', true);
		document.getElementById("msgField2").value = '';
		var url = getHostname()+"/chatRoom.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'postMessage',
	        message: message
	    },
	    function(data, status){
		disableButton('sendButton2', false);
	    	console.log(data);
	    	var obj = JSON.parse(data);
		if(verifyServerResponse(status, obj.status)) {
			$scope.chatRoomMessages = obj.messages;
			$scope.$apply();
		}
	    });
	}
	function stopTurboViewer() {
		$scope.turboViewingOn=false;
		closePopup('gameDetailPopup');
	}
	$scope.showChangePlayerTeams=function() {
		$scope.showPlayerTeamsFlg=!$scope.showPlayerTeamsFlg;
	}
	$scope.changePlayerTeam=function(game, player) {
		playClick($scope.muteSound);
		var team= numberVal(player.team);
		team++;
		if(team==5)
			team='R';
		player.team=team;
		disableButton('saveTeamsButton', false);
	}
	$scope.saveTeams=function(game) {
		playClick($scope.muteSound);
		$scope.showDetailFlg=!$scope.showDetailFlg;
		closePopup('gameDetailPopup');
		var data = '';
		game.players.forEach(function(player) {
			data += player.id+':'+player.team+'|';
		});
		console.log(data);
			startSpinner('Loading...', '150px');
			$scope.fullGameList=[];
			$scope.bugGameCount=0;
			$scope.gameId=0;
			var url = getHostname()+"/webSuperpowers.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        action: 'changeTeams',
		        data: data
		    },
		    function(data, status){
		    	stopSpinner();
			if(verifyServerResponse(status, data)) {
				showAlertPopup('Teams Updated');
			}
		    });
	}
	$scope.ngStyleRank=function(num1, num2) {
		return ngStyleRank(num1, num2);
	}
	$scope.ngStyleActivity=function(activity) {
		if(activity==3)
			return {'background-color': '#0c0'};
		if(activity==2)
			return {'background-color': 'yellow'};
		if(activity==1)
			return {'background-color': 'red'};
		return {'background-color': 'black'};
	}
	function numberOfRealPlayers(game) {
		var playerHash={};
		game.players.forEach(function(player) {
			if(player.name != 'Computer')
				playerHash[player.name]=1;
		});
		var keys = Object.keys(playerHash);
		return keys.length
	}
	function startThisMultiplayerGame(gameToStart) {
		$scope.selectedGame=gameToStart;
		console.log('gameToStart', gameToStart);
		if(numberOfRealPlayers(gameToStart)<2) {
			showAlertPopup('Illegal game trying to start. Must have at least 2 players. '+gameToStart.name,1);
			return;
		}
		var gameObj=createNewGameFromInitObj(gameToStart, $scope.gUnits);
		console.log('started this game:', gameObj);
//		var gameData=JSON.stringify(gameObj);
		var turn=gameObj.players[0].id;
		var gameData = objPiecesFrom(gameObj);
		console.log('Starting up the game!!!');
		joinGame('gameAFoot', gameData, turn);
	}
	function filterGames() {
		$scope.gameList=[];
		$scope.regularGameList=[];
		$scope.mmGameList=[];
		$scope.regularGameCount=0;
		for(var x=0; x<$scope.fullGameList.length; x++) {
			var game=$scope.fullGameList[x];
			if(game.inGame && numberVal(game.ladder_id)==0)
				$scope.regularGameCount++;
			if($scope.unitFilter==0 && game.inGame) {
				addGameToLists(game);
			}
			if($scope.unitFilter==1 && (game.status=='Playing' || game.status=='Picking Nations'))
				addGameToLists(game);
			if($scope.unitFilter==2 && game.status=='Open')
				addGameToLists(game);
			if($scope.unitFilter==3 && game.status=='Complete')
				addGameToLists(game);
			if($scope.unitFilter==4 && game.status=='Playing' && game.ladder_id>0)
				addGameToLists(game);
			if($scope.unitFilter==5 && game.bugFlg)
				addGameToLists(game);
			if($scope.unitFilter==6 && game.status=='Playing' && (game.turnObj.timeLeft=='-Times up-' || game.turnObj.last_login_time>36))
				addGameToLists(game);

		}
	}
	function addGameToLists(game) {
		$scope.gameList.push(game);
		if(game.mmFlg)
			$scope.mmGameList.push(game);
		else
			$scope.regularGameList.push(game);
	}
	$scope.changeTopMenu=function(num) {
		playClick($scope.muteSound);
		$scope.topMenuNum=num;
		updateButtonFilters(num);
		if(num==0)
			loadGames();
		if(num==1)
			window.location = "index.html#!/leaders";
		if(num==2)
			updateChatMessages();
		if(num==3) {
			localStorage.displayUser=$scope.user.userName;
			window.location = "index.html#!/user";
		}
	}
	$scope.ngStyleTimeLeft=function(secondsElapsed) {
		if(secondsElapsed>86400)
			return {'color': 'black', 'cursor': 'pointer'}
		if(secondsElapsed>57600)
			return {'color': 'red', 'cursor': 'pointer'}
		if(secondsElapsed>28800)
			return {'color': 'purple', 'cursor': 'pointer'}
		return {'color': 'green', 'cursor': 'pointer'}
	}
	$scope.changeGameType = function(num) {
		playClick($scope.muteSound);
		$scope.unitFilter=num;
		updateTabFiltersForId('gameType', num);
		filterGames();
	}
	$scope.showGameDetails = function(game) {
		console.log(game);
		$scope.selectedGame=game;
		playClick($scope.muteSound);
		if($scope.gameId && $scope.gameId==game.gameId)
			$scope.gameId=0;
		else
			$scope.gameId=game.gameId;
	}
	function buttonClicked(game, msg, id) {
		$scope.selectedGame=game;
		playClick($scope.muteSound);
		showConfirmationPopup(msg, id);
	}
	function displayMaxGameMessage() {
		if($scope.maxGamesAllowed==7)
			showAlertPopup('Sorry, maximum of 7 active games at one time, per player. Matchmaking games do not count towards your total. You can set your max Matchmaking games to 5.');
		else
			showAlertPopup('Sorry, maximum of '+$scope.maxGamesAllowed+' active games at one time, based on your avg turn speed. Getting your average down will allow you to play in up to 7 games. Also, Matchmaking games do not count towards your total.');
	}
	$scope.showListOfGames=function(type) { 
		if($scope.multiPlayerObj.confirmEmailFlg != 'Y' && $scope.multiPlayerObj.confirmTextFlg != 'Y') {
			showAlertPopup('Welcome to multiplayer! Click on your profile button to confirm your email address.',1);
			return;
		}
		$scope.showWelcome=false;
		$scope.changeGameType(type);
	}
	$scope.gotoCreateGame=function() {
		if($scope.multiPlayerObj.confirmEmailFlg != 'Y' && $scope.multiPlayerObj.confirmTextFlg != 'Y') {
			showAlertPopup('Welcome to multiplayer! Click on your profile button to confirm your email address.',1);
			return;
		}
		if($scope.playingNotMMCount>=$scope.maxGamesAllowed) {
			displayMaxGameMessage();
			return;
		}
		window.location = "index.html#!/createGame";
	}
	$scope.joinGame = function(game) {
		if(!localStorage.username || localStorage.username.length==0) {
			showAlertPopup('You must login before joining a game.', 1);
			return;
		}
		if(game.numPlayers>=game.size) {
			showAlertPopup('Sorry, game is full.', 1);
			return;
		}
//		if($scope.updateNeededCount>1) {
///			showAlertPopup('Sorry, you need to confirm your email address before joining a game. Press the user account button at the top of the page.', 1);
//			return;
//		}
		if($scope.playingNotMMCount>=$scope.maxGamesAllowed) {
			displayMaxGameMessage();
			return;
		}
		if(game.minRank>0 && game.minRank==game.maxRank && $scope.user.rank != game.maxRank) {
			showAlertPopup('Sorry, you must be a '+$scope.ranks[game.maxRank].name+' to join this game.', 1);
			return;
		}
		if(game.minRank>0 && $scope.user.rank<game.minRank) {
			showAlertPopup('Sorry, you must be a '+$scope.ranks[game.minRank].name+' or higher to join this game.', 1);
			return;
		}
		if(game.maxRank>0 && $scope.user.rank > game.maxRank) {
			showAlertPopup('Sorry, you must be a '+$scope.ranks[game.maxRank].name+' or lower to join this game.', 1);
			return;
		}
		
		$scope.selectedGame=game;
		playClick($scope.muteSound);
		localStorage.confirmationOption = 'joinGame';
		$scope.teamName='R';
		$scope.availableNations=populateAvailableNations(game);
		$scope.nationPointer=0;
		if(game.auto_assign_flg=='Y')
			$scope.selectedNation=0;
		else
			$scope.selectedNation=$scope.availableNations[$scope.nationPointer];
		setInnerHTMLFromElement("confirmationMessage2", 'Join: '+game.name+'?')
		displayFixedPopup("joinConfirmationPopup");
	}
	function populateAvailableNations(game) {
		var availableNations=[];
		for(var i=1; i<=8; i++) {
			if(nationIsAvailable(i, game))
				availableNations.push(i);
		}
		return availableNations;
	}
	function nationIsAvailable(nation, game) {
		for(var x=0; x<game.players.length; x++) {
			var player=game.players[x];
			if(player.nation==nation)
				return false;
		}
		return true;
	}
	$scope.spButtonClicked=function() {
		playClick($scope.muteSound);
		$scope.nationPointer++;
		if($scope.nationPointer>=$scope.availableNations.length)
			$scope.nationPointer=0;
		$scope.selectedNation=$scope.availableNations[$scope.nationPointer];
	}
	$scope.teamButtonClicked=function() {
		playClick($scope.muteSound);
		if($scope.teamName=='2')
			$scope.teamName='R';
		else if($scope.teamName=='1')
			$scope.teamName='2';
		else if($scope.teamName=='R')
			$scope.teamName='1';
	}
	$scope.assignNations=function(game) {
		buttonClicked(game, 'Assign nations to anyone who hasn\'t yet picked?', 'assignNations');
	}
	$scope.reopenGame=function(game) {
		buttonClicked(game, 'reopen Game?', 'reopenGame');
	}
	$scope.leaveGame = function(game) {
		buttonClicked(game, 'Leave: '+game.name+'?', 'leaveGame');
	}
	$scope.startGame = function(game) {
		if(game.numPlayers==1) {
			showAlertPopup('Must have at least 2 players to start!', 1);
			return;
		}
		var numRealPlayers=0;
		game.players.forEach(function(p) {
			if(p.name != 'Computer')
				numRealPlayers++;
		});
		if(numRealPlayers<2) {
			showAlertPopup('Must have at least 2 real players to start!', 1);
			return;
		}
		buttonClicked(game, 'Start: '+game.name+'?', 'startGame');
		closePopup('gameDetailPopup');
	}
	$scope.addCPU=function(game, team) {
		var numRealPlayers=0;
		game.players.forEach(function(p) {
			if(p.name != 'Computer')
				numRealPlayers++;
		});
		if(numRealPlayers<2 && game.autoStart=='Y' && game.numPlayers+1 >= numberVal(game.size)) {
			showAlertPopup('Must have at least 2 real players before adding a computer.', 1);
			return;
		}
		if(game.gameType=='ffa-5' || game.gameType=='ffa-6' || game.gameType=='ffa-7') {
			showAlertPopup('Computers will be added automatically',1);
			return;
		}
		$scope.teamName=team;
		buttonClicked(game, 'Add Computer: '+game.name+'?', 'addCPU');
	}
	$scope.cancelGame = function(game) {
		closePopup('gameDetailPopup');
		buttonClicked(game, 'Delete: '+game.name+'?', 'cancelGame');
	}
	$scope.ngMouseOverTurn=function(obj, index) {
		openUserPopup(obj, index);
	}
	$scope.userPopupOpen=function(obj, index, narrowFlg) {
		openUserPopup(obj, index, narrowFlg);
	}
	function openUserPopup(obj, index, narrowFlg) {
		$scope.userObj=obj;
		displayFixedPopup('userPopup');
		
/*		var e = document.getElementById('user'+index);
		var offset=90;
		if(narrowFlg) {
			e = document.getElementById('userX'+index);
			offset=190;
		}
		if(e) {
			var bounds = e.getBoundingClientRect();
			var e2 = document.getElementById('userPopup');
			var left=bounds.left-offset;
			var top=bounds.top-10;
			e2.style.top=top.toString()+'px';
			e2.style.left=left.toString()+'px';
		}*/
	}
	$scope.ngMouseOverMaintain=function() {
		var e = document.getElementById('userPopup');
		e.style.display='block';
	}
	$scope.ngMouseLeaveTurn=function(obj) {
		closePopup('userPopup');
	}
	$scope.enterGame=function(game, id) {
		if(game.newEngineFlg!='Y') {
			showAlertPopup('Invalid Engine!',1);
			return;
		}
		if(game.status=='Open' || game.status=='Picking Nations') {
			if(game.inGame) {
				if(game.turboFlg) {
					$scope.showDetailsPopup(game, id);
					startTurboViewer(game, id);
				} else
					showAlertPopup('This game will start once it has filled up. Click the Info button to see more details.',1);
				
			} else
				showAlertPopup('This game has not started. Click on the info button to see more details about this game, or click "Join" to join it.',1);
		} else {
			localStorage.secondsSinceLogin = game.turnObj.seconds;
			localStorage.turnObjName = game.turnObj.name;
			localStorage.loadGameId=game.gameId;
			localStorage.chatFlg=(game.chatFlg)?"Y":"N";
			window.location = "index.html#!/board";
		}
	}
	$scope.removePlayer = function(game) {
		$scope.selectedGame=game;
		playClick($scope.muteSound);
		displayFixedPopup('removePlayer');
	}
	$scope.removeThisPlayer=function(player) {
		$scope.selectedPlayer=player.name;
		closePopup('removePlayer');
		buttonClicked($scope.selectedGame, 'Remove: '+$scope.selectedPlayer+'?', 'removePlayer');
	}
	$scope.chooseNation=function(game) {
		$scope.selectedGame=game;
		displayFixedPopup('chooseNation');
		var nationHash={};
		for(var x=0; x<game.players.length; x++) {
			var player = game.players[x];
			if(player.nation>0)
				nationHash[player.nation]=player.name;
		}
		$scope.gameNations=[];
		for(var x=1; x<=8; x++)
			$scope.gameNations.push({id: x, player: nationHash[x]});
	}
	$scope.chooseThisNation=function(nation) {
		$scope.selectedNation=nation.id;
		closePopup('chooseNation');
		joinGame('chooseNation');
	}
	$scope.acceptOption = function(pass) {
		var option = localStorage.confirmationOption;
		if(option=='joinGame') {
			for(var x=0; x<$scope.selectedGame.players.length; x++) {
				var player = $scope.selectedGame.players[x];
				if(player==localStorage.username) {
					showAlertPopup('You are already in this game!', 1);
					return;
				}
			}
			if(pass.length>0) {
				var password = databaseSafe(document.getElementById('passField').value);
				if(password != pass) {
					showAlertPopup('Invalid password.', 1);
					return;
				}
			}
			joinGame('join');
		}
		startSpinner('Working...', '150px');
		closePopup('confirmationPopup');
		closePopup('joinConfirmationPopup');
		if(option=='leaveGame') {
			leaveGame($scope.user.userName);
		}
		if(option=='startGame') {
			joinGame('start');
		}
		if(option=='cancelGame') {
			cancelGame();
		}
		if(option=='removePlayer') {
			leaveGame($scope.selectedPlayer);
		}
		if(option=='addCPU') {
			joinGame('add_computer');
		}
		if(option=='assignNations') {
			joinGame('assignNations');
		}
		if(option=='reopenGame') {
			joinGame('reopenGame');
		}
	}
	$scope.ngStyleGame=function(game) {
		if(game.status=='Playing' && game.turn==$scope.user.userName)
			return {'background-color': '#FF0', 'color': 'black'};
		if(game.status=='Open')
			return {'background-color': '#080'};
		if(game.status=='Picking Nations')
			return {'background-color': '#a0f'};
		if(game.status=='Complete')
			return {'background-color': '#777'};
		if(game.newEngineFlg!='Y')
			return {'background-color': '#777'};
		if(game.status=='Playing' && game.mmFlg)
			return {'background-color': '#a05', 'color': 'white'};
	}
	function leaveGame(player) {
		var url = getHostname()+"/webLeaveGame.php";
	    $.post(url,
	    {
	        user_login: player,
	        game_id: $scope.selectedGame.gameId
	    },
	    function(data, status){
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Success!');
			loadGames();
		}
	    });
	}
	function cancelGame() {
		var url = getHostname()+"/webCancelGame.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName,
	        game_id: $scope.selectedGame.gameId
	    },
	    function(data, status){
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Success!');
			loadGames();
		}
	    });
	}
	function joinGame(action, gameData, turn) {
		var url = getHostname()+"/web_join_game2.php";
		var objMain = '';
		var logs = '';
		var players = '';
		var territories = '';
		var units = '';
		if(gameData) {
			objMain=JSON.stringify(gameData.objMain)
			logs=JSON.stringify(gameData.logs)
			players=JSON.stringify(gameData.players)
			territories=JSON.stringify(gameData.territories)
			units=JSON.stringify(gameData.units)
		}
	    $.post(url,
	    {
	        user_login: $scope.user.userName,
	        game_id: $scope.selectedGame.gameId,
	        pwd: $scope.user.password,
	        action: action,
	        nation: $scope.selectedNation,
	        objMain: objMain,
	        logs: logs,
	        players: players,
	        territories: territories,
	        units: units,
	        team: $scope.teamName || 'R',
	        turn: turn
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Success!');
			loadGames();
		}
	    });
	} //joinGame
	$scope.showSpeedInfo=function() {
		showAlertPopup('Average Turn Speed is based on how quickly you take your turn in multiplayer games. Having a faster speed allows you to play in more games. Note: Only games that are 3-players and more count towards this stat.');
	}
}); //multiplayerCtrl
app.controller("techCtrl", function ($scope) {
	playClick($scope.muteSound);
}); //techCtrl
app.controller("scoreboardCtrl", function ($scope) {
	playClick($scope.muteSound);
	$scope.gameScores=JSON.parse(localStorage.getItem("gameScores")) || [];
	$scope.deleteButtonPressed = function() {
		$scope.gameScores=[];
		localStorage.setItem("gameScores", JSON.stringify($scope.gameScores));
	}
}); //scoreboardCtrl
app.controller("statsCtrl", function ($scope) {
	$scope.players = [1,2,3,4,5,6,7,8];
	playClick($scope.muteSound);
}); //statsCtrl
app.controller("boardCtrl", function ($scope) {
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.playerRank=$scope.user.rank;
//	console.log('user', $scope.user);
	if(localStorage.muteSound && localStorage.muteSound=='Y')
		localStorage.muteSound='N';
	$scope.showTechDesc=true;
	if($scope.user.rank>4)
		$scope.showTechDesc=false;
		
	var moveSpritesCount=0;
	$scope.iosApp = localStorage.iosApp;
	var gStatusPurchase='Purchase';
	var gStatusAttack='Attack';
	var gStatusMovement='Movement';
	var gStatusPlaceUnits='Place Units';
	$scope.introAudio.pause();
	$scope.showMenuFlg=true;
	$scope.chatFlg=localStorage.chatFlg;
	$scope.ableToTakeThisTurn=false;
	playClick($scope.muteSound);
	var warAudio = new Audio('sounds/war1.mp3');
	warAudio.loop = true;
	var gClickMilliseconds = 300;
	var timeClicks=0;
	$scope.menuNum=0;
	var timeSecondsId;
	var marqueeId;
	var marqueeLeft=0;
	var marqueeMgs = [];
	var marqueeInAction = false;
	var spriteId;
	var gamePaused=false;
	var mouseX=0;
	var mouseY=0;
	var terrTop=0;
	var terrLeft=0;
	var actionAdvanceCount=0;
	var secondsSinceLastSave=0;
	$scope.newsMessage = ['War Declared!','You have been dropped from an alliance!','Peace Accepted','Alliance Accepted','Offer Rejected!'];
	$scope.gameInProgressFlg = (localStorage.currentGameId && localStorage.currentGameId>0);
	
	$scope.productionUnits = [$scope.gUnits[1],$scope.gUnits[2],$scope.gUnits[3],$scope.gUnits[19]];
	$scope.sprites = [];
	for(var x=0; x<30; x++)
		$scope.sprites.push({name: x.toString(), startX: 1, startY: 1, endX: 1, endY: 1, active: false, move: 0})
		
	$scope.svgs = loadSVGs();
	
	$scope.loadingFlg=true;
	startSpinner('Loading Game', '100px');
	setTimeout(function() { initBoard(); }, 50);
	setTimeout(function() { verifyLoad(); }, 18000);		
	
	function addListeners(){
	    document.getElementById('terrHeaderDiv').addEventListener('mousedown', mouseDown, false);
	    window.addEventListener('mouseup', mouseUp, false);
	
	}
	
	function mouseUp()
	{
	    window.removeEventListener('mousemove', divMove, true);
 		 var e = document.getElementById('territoryPopup');
 		 if(e) {
	  		 e.style.border = '1px solid black';
	  		 e.style.transition = 'all 1s ease';
 		 }
	}
	
	function mouseDown(e){
		mouseX = e.clientX + document.body.scrollLeft;
		mouseY = e.clientY + document.body.scrollTop;
		var e = document.getElementById('territoryPopup');
		if(e) {
			e.style.border = '2px solid white';
			e.style.transition='none';
			terrTop=numberVal(e.style.top.replace('px',''));
			terrLeft=numberVal(e.style.left.replace('px',''));
		}
		window.addEventListener('mousemove', divMove, true);
	}
	
	function divMove(e){
		var div = document.getElementById('territoryPopup');
		if(div) {
			var mouseX2 = e.clientX + document.body.scrollLeft;
			var mouseY2 = e.clientY + document.body.scrollTop;
			var deltaLeft = mouseX2-mouseX;
			var deltaTop = mouseY2-mouseY;
			var newLeft = terrLeft+deltaLeft;
			var newTop = terrTop+deltaTop;
			div.style.position = 'absolute';
			div.style.left = newLeft + 'px';
			div.style.top = newTop + 'px';
		}
	}
	function initBoard() {
		showProgress(20);
		closePopup('territoryPopup');
		if(localStorage.loadGameId && localStorage.loadGameId>0) {
			console.log('+++Loading multiplayer game....', localStorage.loadGameId);
			var url = getHostname()+"/web_join_game2.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        game_id: localStorage.loadGameId,
		        pwd: $scope.user.password,
		        action: 'loadGame'
		    },
		    function(data, status){
			showProgress(30);
			setTimeout(function() { loadTheMultGame(data); }, 250);
		    });
		} else {
			if($scope.gameInProgressFlg) {
				console.log('+++Loading Single Player game....');
				$scope.gameObj = loadSinglePlayerGame();
				console.log('+++$scope.gameObj', $scope.gameObj);
			} else {
				console.log('+++Starting new game...');
				var startingNation = numberVal(localStorage.startingNation);
				if(startingNation==0) {
					stopSpinner();
					showAlertPopup('Invalid Game',1);
					window.location = "index.html#!/";
					return;
				}
				var gameTypes=['diplomacy','freeforall'];
				var gType=numberVal(localStorage.gameType);
				var type=gameTypes[gType];
				var id=3;
				var numPlayers=4;
				var attack=6;
				var name = ($scope.user.rank==0)?'Basic Training':'Single Player Game';
				if($scope.user.rank==0)
					type="basicTraining";
					
				var pObj={};
				if(localStorage.customGame=='Y') {
					type=localStorage.customGameType;
					numPlayers=localStorage.customNumPlayers;
					pObj = JSON.parse(localStorage.customGamePlayers);
				}
				$scope.gameObj = createNewGame(id, type, numPlayers, name, attack, $scope.gUnits, parseInt(localStorage.startingNation), localStorage.fogOfWar, $scope.user.rank, localStorage.customGame, pObj, localStorage.hardFog);
				$scope.gameObj.difficultyNum=localStorage.difficultyNum;
				console.log($scope.gameObj);
				saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
				localStorage.currentGameId = $scope.gameObj.id;

			}
			scrubGameObj($scope.gameObj);
			launchGame()
		}
	}
	function loadTheMultGame(data) {
		showProgress(40);
	    	$scope.gameObj=loadMultiPlayerGame(data);
	    	localStorage.gameUpdDt=$scope.gameObj.gameUpdDt;
	    	console.log('+++gameUpdDt+++', localStorage.gameUpdDt);
		scrubGameObj($scope.gameObj);
		launchGame();
	}
	function launchGame() {
		showProgress(50);
		setTimeout(function() { showProgress(60); }, 250);	
		setTimeout(function() { loadBoard(); }, 1500);	
	}
	function showProgress(num) {
		updateProgressBar(num);
		applyChanges();
	}
	function highlightChatButton() {
		changeClass('chatButton', 'btn ptp-yellow roundButton');
		var e = document.getElementById('arrow');
		e.style.display='block';
		var chatButton = document.getElementById('chatButton');
		var top=50;
		var left=200;
		if(chatButton) {
			var elemRect = chatButton.getBoundingClientRect();
			top=elemRect.top;
			left=elemRect.left;
		}
		e.style.position='fixed';
		e.style.left=(left-10).toString()+'px';
		e.style.top=(top+35).toString()+'px';
		
		fadeInDiv('chatMessagesPopup', 'popupMsg');
		chatMessagesPopup.style.left=(left-55).toString()+'px';
		chatMessagesPopup.style.top=(top+135).toString()+'px';
		
	}
	function verifyLoad() {
		$scope.loadingFlg=false;
		var e = document.getElementById('terr1');
		var playerPanel = document.getElementById('playerPanel');
		if(playerPanel && !e) {
			stopSpinner();
			if(localStorage.loadGameId && localStorage.loadGameId>0)
				showAlertPopup('Error loading game. Try refreshing your browser.');
			else
				showAlertPopup('Error loading game. Try refreshing your browser. If that doesn\'t work, surrender this game and start over.');
		}	
	}
	function movePanelToRight() {
		var e = document.getElementById("sidelinePopup");
		if(e) {
			var left = window.innerWidth-55;
			if(left>1282) {
				e.style.left='1282px';
				var rect = e.getBoundingClientRect();
				var adviseTop = numberVal(rect.top+rect.height);
				if(adviseTop<100)
					adviseTop=100;
				setTopOfElement('advicePanel', adviseTop);
				setTopOfElement('menu1Button', 51);
			}
		}
	}
	function setTopOfElement(id, num) {
		var e = document.getElementById(id);
		if(e) {
			document.getElementById(id).style.top=num.toString()+'px';
		}
	}
	function loadBoard() {
		updateProgressBar(70);
		movePanelToRight();
		$scope.boardHasBeenUpdated=false;
//		$scope.playersPopupClicked();
		if($scope.gameObj.gameOver)
			$scope.gameObj.fogOfWar='N';
		var e = document.getElementById('terr1');
		if(e) {
			var lastSaved = new Date($scope.gameObj.lastSaved);
			var now = new Date();
			secondsSinceLastSave = (now.getTime() - lastSaved.getTime()) / 1000;
			if(isMusicOn())
				$scope.gameMusic.play();
			var e=document.getElementById("roundNumPopup");
			if(e) {
				var w = window.innerWidth;
				var left = (w/2)-80;
				e.style.left=left+'px';
			}
			var facCount=$scope.gameObj.factories.length;
			$scope.yourPlayer=getYourPlayer($scope.gameObj.players);
			$scope.myTreaties='';
			if($scope.yourPlayer && $scope.yourPlayer.treaties)
				$scope.myTreaties=$scope.yourPlayer.treaties.join('+');
				
			$scope.gameObj.territories.forEach(function(terr) {
				refreshTerritory(terr);
				if(facCount==0 && (terr.factoryCount>0 || terr.factoryCount==-1)) {
					$scope.gameObj.factories.push({id: terr.id, terr: terr.id, owner: terr.owner, x: terr.x, y: terr.y, prodUnit: 0, prodCounter: 0, prodQueue: []});
				}
			});
			if(!$scope.gameObj.unitPurchases)
				$scope.gameObj.unitPurchases=[];
			if($scope.gameObj && $scope.gameObj.turnId>0 && $scope.gameObj.players.length>=$scope.gameObj.turnId) {
				$scope.initialLoadNation=$scope.gameObj.players[$scope.gameObj.turnId-1].nation;
			}

			refreshBoard($scope.gameObj.territories);
			var alaskaWaters = $scope.gameObj.territories[78];
			var northPacific = $scope.gameObj.territories[80];
			if(alaskaWaters.unitCount>0 || northPacific.unitCount>0)
				changeClass('playerPanel', 'roundedPanelT');
			$scope.gameObj.numPlayers=getNumPlayers();
			$scope.showControls=true;
			$scope.showMenuControls=true;
			displayHelpMessages();
			if($scope.yourPlayer && !$scope.gameObj.gameOver) {
				var now = new Date();
				var lastSaved = new Date($scope.gameObj.lastSaved);
				var seconds = (now.getTime() - lastSaved.getTime())/1000;
			}
			if(!$scope.gameObj.teams || $scope.gameObj.teams.length==0) {
				console.log('xxxERRORxxx no teams!');
				$scope.gameObj.teams = loadTeams($scope.gameObj.players.length);
			}
				
			if($scope.chatFlg=='Y' && $scope.gameObj.multiPlayerFlg)
				setTimeout(function() { highlightChatButton(); }, 2000);
			
			$scope.loadingFlg=false;
			showProgress(80);
			gamePaused=true;
			if(screen.width>1200) {
				try {
					$('#accountSitPopup').draggable(); //<-- causes clicks not to work on some devices
					$('#treatyConfirmationPopup').draggable();
					addListeners();
				} catch(err) {
//					console.log('no draggable', err);
				}
			}
			

			window.addEventListener('orientationchange', doOnOrientationChange);
			doOnOrientationChange();
			if($scope.adminMode)
				fixBoard();
			setTimeout(function() { startTheAction(); }, 1000);	
		} else {
			showAlertPopup('Game load error. Function loadBoard() failed.');
		}
	}
	$scope.startTimerPressed=function() {
		$scope.displayTurnMessage=false;
		startTurboTimer(120);
		closePopup('turboStartPopup');
		playSound('AirHorn.mp3', 0, $scope.muteSound);
	}
	function startTurboTimer(bonusTime, secondsLeft) {
		$scope.bonusTime=bonusTime;
		$scope.secondsLeft=secondsLeft;
		console.log('startTurboTimer', $scope.currentPlayer.nation, $scope.timerRunningFlg);
		if(!$scope.timerRunningFlg) {
			$scope.timerRunningFlg=true;
			setTimeout(function() { displayTheClock($scope.currentPlayer.nation); }, 10);
		}
	}
	function displayTheClock(nation) {
		var e = document.getElementById('timerPopup');
		if(!e) {
			$scope.timerRunningFlg=false;
			return;
		}
		if(nation != $scope.currentPlayer.nation) {
			return;
		}
		$scope.bonusTimerText = secondsToClock($scope.bonusTime);
		$scope.playerTimerText = secondsToClock($scope.secondsLeft);
		$scope.$apply();
		var soundFile = '';
		if($scope.bonusTime==2 || $scope.bonusTime==3 || $scope.bonusTime==4 || $scope.bonusTime==5 || $scope.bonusTime==6)
			soundFile = 'blip.mp3'; 
		if($scope.secondsLeft==2 || $scope.secondsLeft==3 || $scope.secondsLeft==4 || $scope.secondsLeft==5 || $scope.secondsLeft==6)
			soundFile = 'blip.mp3'; 
		if($scope.bonusTime==1 || $scope.secondsLeft==1)
			soundFile = 'buzz.mp3'; 

		if(soundFile.length>0 && !$scope.muteSound)
			setTimeout(function() { playSound(soundFile, 0, $scope.muteSound); }, 1000);
			
		$scope.bonusTime--;
		if($scope.bonusTime<3)
			disableButton('completeTurnButton', true);
		
		if($scope.bonusTime>0)
			setTimeout(function() { displayTheClock(nation); }, 1000);
		else {
			$scope.bonusTime=0;
			console.log('computer taking turn...', $scope.bonusTime, $scope.secondsLeft);
			$scope.timerRunningFlg=false;
			if($scope.ableToTakeThisTurn) {
				showAlertPopup('Out of Time!', 1);
				if($scope.currentPlayer.status==gStatusPurchase)
					setTimeout(function() { computerGo(); }, 10);
				else
					setTimeout(function() { computerPlacementPhase($scope.currentPlayer); }, 10);
			}
		}
	}
	function secondsToClock(seconds) {
		var mins=Math.floor(seconds/60);
		var secs = seconds - (mins*60);
		return mins.toString()+':'+pad(secs, 2);
	}
	function doOnOrientationChange() {
		var hb = document.getElementById('helpButton');
		if(hb) {
			hb.style.bottom='0';
		}
		var left = window.innerWidth-55;
		if(left>=1282)
			movePanelToRight();
		else {
			var sp = document.getElementById('sidelinePopup');
			if(sp) {
				sp.style.left='0';
			}
		}

	}
	function startTheAction() {
		stopSpinner();
		resumeAction();
	}
	function getNumPlayers() {
		var pHash = {};
		$scope.gameObj.players.forEach(function(player) {
			if(!player.lastRoundsOfPeace || player.lastRoundsOfPeace.length<8)
				player.lastRoundsOfPeace=[1,1,1,1,1,1,1,1];
			if(!player.lastRoundsOfWar || player.lastRoundsOfWar.length<8)
				player.lastRoundsOfWar=[1,1,1,1,1,1,1,1];
			pHash[player.userName]=1;
		});
		var keys = Object.keys(pHash);
		return keys.length;
	}
	function userCanSkip(nation) {
		console.log('userCanSkip', nation, $scope.initialLoadNation);
		if($scope.initialLoadNation != nation)
			return false;
		if($scope.user && $scope.user.userName && $scope.user.userName=='Rick')
			return true;
		if($scope.yourPlayer && $scope.yourPlayer.alive && !$scope.yourPlayer.cpu)
			return true;
		else
			return false;
	}
	$scope.ngStyleAllies=function(player, c) {
		if(player.alive)
			return {'background-color': c};
		else
			return {'background-color': '#666'};
	}
	$scope.ngStyleUnitTop=function(type) {
		if(type=='production')
			return {'max-width': '40px', 'max-height': '30px'};
		else
			return {'max-width': '100px', 'max-height': '60px'};
	}
	$scope.ngStyleSVG=function(svg) {
		return {'width': svg.width, 'left': svg.left, 'top': svg.top, 'position': 'absolute' };
	}
	$scope.ngStyleSVG2=function(svg) {
		return {'max-width': '80px', 'height': '60px;' };
	}
	function isCargoUnitAlive(cUnit) {
		var alive=false;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.id==cUnit.id && unit.hp>0) {
				alive=true;
			}
		});
		return alive;
	}
	function checkCargoForUnit(unit) {
		var aliveCount=0;
		unit.cargo.forEach(function(cUnit) {
			var alive = isCargoUnitAlive(cUnit);
			if(alive)
				aliveCount++;
		});
		if(aliveCount==0) {
			showAlertPopup('cargo fixed!', 1);
			unit.cargo = [];
		}
	}
	function cleanupCargo() {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==$scope.currentPlayer.nation && unit.piece==8 && unit.cargo && unit.cargo.length>0) {
				checkCargoForUnit(unit);
			}
		});
	}
	function fixBoard() {
//		$scope.gameObj.restrict_units_flg="N";
		console.log('fixboard on!!', $scope.gameObj.turnId);
//		playerOfNation(7).money=38;
//		$scope.gameObj.turboFlg = true;
//		$scope.gameObj.allowAlliances=false;
//		$scope.gameObj.maxAllies=0;
//		$scope.gameObj.gameOver=false;
//		$scope.gameObj.turnId=3; // change turn
//		$scope.gameObj.top2='JMoney';
//		$scope.gameObj.top2Nation=6;
//		$scope.gameObj.topPlayer2='44225';
		showAlertPopup('fixboard on!!');
//		$scope.currentPlayer.attackFlg=false;
		if(0) {
			playerOfNation(1).cpu=false;
			playerOfNation(2).cpu=false;
			playerOfNation(3).cpu=false;
			playerOfNation(4).cpu=false;
			playerOfNation(5).cpu=false;
			playerOfNation(6).cpu=false;
			playerOfNation(7).cpu=false;
			playerOfNation(8).cpu=false;
		}
//		playerOfNation(1).money=65;
		$scope.gameObj.players.forEach(function(player) {
//			if(player.nation==8)
//				player.money=76;
//			if(player.cpu)
//				player.cpu=false;
//				player.treaties=[3,1,1,3,3,3,1,3];
//			console.log(player.cpu, player.treaties);
//			player.attackFlg=false;
//			player.defenseFlg=false;
		});
//			playerOfNation(1).treaties=[1,0,2,3,3,3,3,0];
//			playerOfNation(6).treaties=[3,3,1,0,0,1,3,0];
//			playerOfNation(8).treaties=[0,3,1,0,3,0,0,1];
//		$scope.currentPlayer.money=-10;
		if(0) { //teams
			playerOfNation(4).treaties=[1,1,1,1,0,3,1,1];
			playerOfNation(6).treaties=[0,1,1,3,0,1,1,1];
		}
		if(0) { //battlebots
			playerOfNation(1).treaties=[1,1,1,3,1,1,1,1];
			playerOfNation(2).treaties=[1,1,1,1,1,1,3,1];
			playerOfNation(3).treaties=[1,1,1,1,1,1,1,3];
			playerOfNation(4).treaties=[3,1,1,1,1,1,1,1];
			playerOfNation(5).treaties=[1,1,1,1,1,3,1,1];
			playerOfNation(6).treaties=[1,1,1,1,3,1,1,1];
			playerOfNation(7).treaties=[1,3,1,1,1,1,1,1];
			playerOfNation(8).treaties=[1,1,3,1,1,1,1,1];
		}
		if(0) { //co-op
			playerOfNation(1).treaties=[1,3,1,1,1,1,1,3];//human
			playerOfNation(2).treaties=[3,1,1,1,1,1,1,3];//human
			playerOfNation(3).treaties=[1,1,1,3,3,3,3,1];//bot
			playerOfNation(4).treaties=[1,1,3,1,3,3,3,1];//bot
			playerOfNation(5).treaties=[1,1,3,3,1,3,3,1];//bot
			playerOfNation(6).treaties=[1,1,3,3,3,1,3,1];//bot
			playerOfNation(7).treaties=[1,1,3,3,3,3,1,1];//bot
			playerOfNation(8).treaties=[3,3,1,1,1,1,1,1];//human
			
		}

		if(0) { //barbarian
			var p1 = playerOfNation(2);
			p1.treaties=[0,1,3,3,0,0,0,0];
			var p2 = playerOfNation(3);
			p2.treaties=[0,3,1,3,0,0,0,0];
			var p3 = playerOfNation(4);
			p3.treaties=[0,3,3,1,0,0,0,0];
			var toTerr1 = $scope.gameObj.territories[15-1];
			toTerr1.owner=3;
			var toTerr2 = $scope.gameObj.territories[16-1];
			toTerr2.owner=3;
		}
//		playerOfNation(7).cpu=false;
//		var p2 = playerOfNation(5);
//		p2.cpu=false;
//		p2.treaties=[1,3,1,3,1,1,1,1];
//		var p3 = playerOfNation(4);
//		p3.treaties=[1,3,3,1,1,1,1,1];
//		player.money=85;
		
//		console.log(player);
//			$scope.currentPlayer.status=gStatusPurchase;
//			$scope.gameObj.actionButtonMessage='Purchase Complete';
//			setTimeout(function() { resetMessageButton(); }, 1000);	
//			saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);


//		$scope.currentPlayer.money=50;
//		$scope.currentPlayer.cpu=true;
//		addunitsToTerr(1);
//		removeUnitsFromTerr(1)
//placeUnitsOnTerrId(106, [5,5,5,5,5,5,5,5,5,5,5]);
		var terrId = 104;
		var x=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terrId && (unit.piece==4) && x++<2) {
//				unit.hp=0;
//			        unit.dead=true;
//				unit.mv=2;
//				unit.mv2=2;
//				unit.moveAtt=2;
//				unit.owner=3;
//				if(unit.id==441 || unit.id==442 || unit.id==443 || unit.id==444)
//				unit.terr = 131;
//				unit.movesLeft=2;
//				unit.piece=13;
//				unit.bcHp=3;
//				unit.damage=2;
				console.log('fixboard piece: ', unit.piece, unit.id, unit);
			}
		});
		var toTerr = $scope.gameObj.territories[terrId-1];
//		toTerr.defeatedByRound=39;
//		toTerr.defeatedByNation=0;
//		toTerr.attackedRound=39;
//		toTerr.attackedByNation=1;
//		toTerr.facBombed=false;
//		toTerr.owner=7;
//		toTerr.nuked=false;
//		toTerr.owner=3;
		console.log(toTerr);
//		$scope.currentPlayer.money=56;
//		$scope.currentPlayer.income=55;
//		console.log('hey', $scope.currentPlayer);
//		placeUnitsOnTerrId(13, [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2])
//		placeUnitsOnTerrId(56, [3,3,3,3,3,3,3,3])
//		placeUnitsOnTerrId(63, [38,38,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
//		placeUnitsOnTerrId(36, [1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
//		placeUnitsOnTerrId(20, [1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]);
//		placeUnitsOnTerrId(18, [40,40,40,40,40,40,40,40,40,40,40,40]);
//		placeUnitsOnTerrId(1, [44,46,47,48,50,51,52]);
//		placeUnitsOnTerrId(106, [5,5,5,5,5,5,5,5,5], 1);
//		placeUnitsOnTerrId(51, [2,2,2,2,2], 8);
//		placeUnitsOnTerrId(98, [5,5], 2);
//		placeUnitsOnTerrId(113, [44], 1); //seal
//		placeUnitsOnTerrId(37, [6,6,6,6,6,6]);
//		placeUnitsOnTerrId(30, [10]); //general
//		placeUnitsOnTerrId(38, [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,6]);
//		placeUnitsOnTerrId(38, [13,13]);
//		annimateUnitOntoTerr(terr1, 11);
//		saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
		refreshTerritory(toTerr);
}
	
	function basicTrainingIntro(num) {
		$scope.startupSequence=num;
		$scope.startupSequence++;
		if($scope.startupSequence==1) {
			showAdvancedPopup('Welcome new recruit! We are expecting big things from you!', 2, 'We must conquer Russia and China! They will be defeated.');
			$scope.pingNation=2;
			scrollToCapital(2);
		}
		if($scope.startupSequence==2) {
			displayFixedPopup('battlePlanPopup');
			playVoiceSound(43, $scope.muteSound);
			$scope.showBattlePlanNum=0;
			setTimeout(function() { 
				$scope.showBattlePlanNum++;
				$scope.$apply();
				 }, 2000);	
			setTimeout(function() { 
				$scope.showBattlePlanNum++;
				$scope.$apply();
				 }, 4000);	
			setTimeout(function() { 
				$scope.showBattlePlanNum++;
				$scope.$apply();
				 }, 6000);	

		}
		if($scope.startupSequence==3) {
			playVoiceSound(44, $scope.muteSound);
			showAdvancedPopup('Your enemy in the game is Japan. They are trying to take over those two capitals before you do!', 4, 'You don\'t stand a chance!');
			$scope.pingNation=4;
			scrollToCapital(4);
		}
		if($scope.startupSequence==4) {
			playVoiceSound(45, $scope.muteSound);
			showUpArrowAtElement('playersButton');
			$scope.showLeftArrow=true;
			$scope.pingNation=2;
			scrollToCapital(localStorage.startingNation);
			$scope.currentPlayer = {nation: localStorage.startingNation};
			setTimeout(function() { militaryAdvisorPopup('You are starting as '+$scope.superpowers[localStorage.startingNation]+'. Click on the "Players" button on the top to see more info about your opponent.'); }, 500);	
		}
	}
	function isAlly(p1, p2) {
		if(!p1 || !p2)
			return;
		if(p1.nation==p2.nation)
			return false;
		if(p1.treaties[p2.nation-1]==3)
			return true;
		else
			return false;
	}
	function placeUnitsOnTerrId(id, units, own, activeFlg) {
		console.log('placing unit!');
		var terr1 = $scope.gameObj.territories[id-1];
		if(own && own>0)
			terr1.owner=own;
		for(var x=0; x<units.length; x++) {
			var unitId = units[x];
			annimateUnitOntoTerr(terr1, unitId, activeFlg, true);
		}
	}
	function addunitsToTerr(terrId) {
		var terr1 = $scope.gameObj.territories[terrId-1];
		annimateUnitOntoTerr(terr1, 6);
		annimateUnitOntoTerr(terr1, 6, false, true);
	}
	function removeUnitsFromTerr(terrId) {
		var units=[];
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terrId && unit.piece==6) {
				units.push(unit);
			}
		});
		deleteItem($scope.gameObj.units, units[0].id);
		deleteItem($scope.gameObj.units, units[1].id);
		var toTerr = $scope.gameObj.territories[terrId-1];
		refreshTerritory(toTerr);
	}
	function addShips(nation, terrId) {
		var terr1 = $scope.gameObj.territories[terrId];
		annimateUnitOntoTerr(terr1, 4);
		annimateUnitOntoTerr(terr1, 5, false, true);
	}
	function scrubGameObj(gameObj) {
		$scope.gameObj.players.forEach(function(player) {
			if(player.userName == $scope.gameObj.top1)
				$scope.gameObj.top1Nation=player.nation;
			if(player.userName == $scope.gameObj.top2)
				$scope.gameObj.top2Nation=player.nation;
			scrubUnitsOfPlayer(player);
		});
		$scope.gamePoints = gamePointsForType($scope.gameObj.type, $scope.gameObj.mmFlg);
	}
	function scrubUnitsOfPlayer(player) {
		var railway = player.tech[19];
		
		var stealth = player.tech[0];
		var mav = player.tech[1];
		var radar = player.tech[2];
		
		var rocket = player.tech[3];
		var chem = player.tech[4];
		var anthrax = player.tech[5];

		var torpedoes = player.tech[6];

		var heavy = player.tech[12];
		var smart = player.tech[13];
		var nukes = player.tech[14];

		var range = player.tech[15];
		var mobility = player.tech[17];

		player.cruiseButton = (player.nation==4 || player.tech[7]);
		var stratBombButton=false;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.nation==player.nation && unit.piece!=12) {
				unit.name=$scope.gUnits[unit.piece].name;
				unit.medicRound = numberVal(unit.medicRound);
				unit.dice=[];
				if(unit.piece==7)
					stratBombButton=true;
				unit.att=unit.att2;
				unit.numAtt=unit.numAtt2;
				unit.def=unit.def2;
				unit.mv=unit.mv2;
				unit.moveAtt=unit.moveAtt2;
				
				if(unit.piece==23) {
					unit.moveAtt2=2;
					unit.moveAtt=2;
				}
				if(unit.piece==28 && $scope.gameObj.round <= unit.medicRound+1)
					unit.movesLeft=0;
				if(unit.piece==44)
					unit.adLimit=0;
				if(player.tech[0]) {				//stealth
					if(unit.subType=='fighter') { 
						unit.def=unit.def2+1;
						unit.adLimit=0;
						if(unit.piece==23)
							unit.adLimit=1;
					}
					if(unit.subType=='chopper') {
						unit.adLimit=1;
					}
				}
				if(player.tech[1]) {				//AGM Maverick
					if(unit.piece==6 || unit.piece==35 || unit.piece==47 || unit.piece==48) { 
						unit.target='vehicles';
					}
				}
				if(player.tech[2]) {					//Radar
					if(unit.subType=='fighter' || unit.piece==47) {
						unit.target='planesTanks';
					}
					if(unit.subType=='bomber') {	
						unit.adLimit=1;
					}
				}
				if(unit.piece==14 && player.tech[3])	//rocketry
					unit.moveAtt=3;	
				if(unit.piece==14 && player.tech[4])	//chemical
					unit.moveAtt=4;
				if(player.tech[5]) {	//Antrax
					//anthrax
					if(unit.piece==14)
						unit.moveAtt=5;	
					if(unit.piece==34 || unit.piece==35 || unit.piece==36 || unit.piece==37 || unit.piece==40 || unit.piece==25 || unit.piece==46)
						unit.numAtt=unit.numAtt2+1;	
					if(unit.piece==42)
						unit.numAtt=unit.numAtt2+2;	
				}
									
				if(unit.subType=='vehicle' && unit.returnFlg && player.tech[3]) { //rocketry
					unit.numAtt=unit.numAtt2+1;				
				}	
				if(unit.subType=='vehicle' && unit.returnFlg && player.tech[4]) { //chemical
					unit.numAtt=unit.numAtt2+2;					
				}	
				if(unit.subType=='vehicle' && unit.returnFlg && player.tech[5]) { //Antrax
					unit.numAtt=unit.numAtt2+3;					
				}
				if(unit.piece==47)
					unit.numAtt=1; // laser
				if(player.tech[6]) {					//torpedoes
					if(unit.piece==5 || unit.piece==49) {	
						unit.att++;					
						unit.def++;					
					}
				}
				if(unit.subType=='bomber' && player.tech[12])	//heavy bombers
					unit.numAtt=2;					
				if(unit.subType=='fighter' && player.tech[13])	//smart bombers
					unit.att++;					
				if(unit.subType=='bomber' && player.tech[13])
					unit.att=5;
				if(player.tech[14]) {				//nuclear warheads
					if(unit.subType=='bomber' || unit.piece==48 || unit.piece==50)	
						unit.numAtt++;
				}				
				if(unit.type=='2' && player.tech[15]) {	// range
					unit.mv=unit.mv2+2;				
					unit.moveAtt=unit.moveAtt2+1;				
				}	
				if(unit.piece==36 && player.tech[15]) { //apache
					unit.mv=3;				
					unit.moveAtt=3;				
				}	
				if(unit.piece==3 && player.tech[17]) {	//mobility
					unit.moveAtt=3;				
				}	
				if(unit.piece==2 && player.tech[17]) {
					unit.moveAtt=2;				
				}	
				if(unit.type==1 && player.tech[19]) { // railway
					unit.mv=unit.mv2+1;				
				}
				//----- old

				if(unit.type==2 && mav)
					unit.target='vehicles';
				if(unit.piece==6 && radar)
					unit.target='planesTanks';
				if(unit.piece==23)
					unit.target='kamakazi';
				if(unit.piece==5 && torpedoes)
					unit.def=3;
				if(unit.piece==10 && unit.nation==2) { //EU
					unit.att=5;
					unit.mv=2;
					unit.mv2=2;
					unit.moveAtt=2;
					if(player.tech[19])
						unit.mv=3;
				}
				if(unit.piece==10 && unit.nation==3) {	//Russia
					unit.att=4;
				}
				if(unit.piece==10 && unit.nation==5) { //China
					unit.numAtt=5;
					unit.att=2;
					if(player.tech[3])
						unit.numAtt++;
					if(player.tech[4])
						unit.numAtt++;
					if(player.tech[5])
						unit.numAtt++;
				}
				if(unit.piece==10 && unit.nation==7) {  //Africa
					unit.numDef=3;
					unit.def=3;
					unit.att=3;
					unit.att2=3;
					unit.numAtt=3;
				}
				if(unit.piece==10 && unit.nation==8) { //LA
					unit.numDef=3;
					unit.def=5;
					unit.att=4;
					unit.att2=4;
				}					
			}
		});
		player.stratBombButton=stratBombButton;
	}
	function getYourPlayer(players) {
		var humanPlayer;
		for(var x=0; x<players.length; x++) {
			var player=players[x];
			if(!$scope.gameObj.multiPlayerFlg && !player.cpu) {
				humanPlayer=player;
				if($scope.gameObj.currentNation==player.nation)
					return player;
			}
			if($scope.gameObj.multiPlayerFlg && player.userName==$scope.user.userName)
				return player;
		}
		return humanPlayer;
	}
	function startPlay() {
		$scope.gameObj.territories.forEach(function(terr) {
			refreshTerritory(terr);
		});
		gamePaused=true;
		resumeAction();
	}
	function getInactiveSprite() {
		for(var x=0; x<$scope.sprites.length; x++) {
			var sprite = $scope.sprites[x];
			if(!sprite.active)
				return sprite;
		}
	}
	function cleanupSprites() {
		for(var x=0; x<$scope.sprites.length; x++) {
			var sprite = $scope.sprites[x];
			var e = document.getElementById('sprite'+sprite.name);
			if(e)
				e.style.display='none';
			sprite.active=false;
		}
		$scope.activeSpritesFlg=false;
	}
	function cleanupLoseSprites() {
		for(var x=0; x<$scope.sprites.length; x++) {
			var sprite = $scope.sprites[x];
			if(sprite.move>400) {
				console.log('Whoa! runaway sprite!', sprite);
				var e = document.getElementById('sprite'+sprite.name);
				if(e)
					e.style.display='none';
				sprite.move=0;
				sprite.active=false;
			}
		}
	}
	function getSprite(piece, size, startX, startY, endX, endY, range, battle) {
//		startY+=15;
//		endY+=15;
		var src = 'graphics/units/piece'+piece+'u.png';
		if(piece==0)
			src = 'graphics/anim/ex1.png';
		var battleId;
		if(battle) {
			battleId=battle.id;
			if(battle.warFlg)
				src = 'graphics/flag_ex'+battle.attacker+'.gif';
			if(battle.nukeFlg) {
				playSound('warning.mp3', 0, $scope.muteSound);
				src = 'graphics/units/piece14u.png';
			}
			if(battle.empFlg) {
				playSound('tornado.mp3', 0, $scope.muteSound);
				src = 'graphics/units/piece52.png';
			}
			if(battle.cruiseFlg) {
				playSound('bomb2.mp3', 0, $scope.muteSound);
				src = 'graphics/units/missile.png';
			}
			if(battle.type=='bomb') {
				playSound('bombers.mp3', 0, $scope.muteSound); //bomb3
				setTimeout(function() { playSound('bomb2.mp3', 0, $scope.muteSound); }, 1750);	
				src = 'graphics/units/piece7u.png';
			}
		}
		var num=Math.floor((Math.random() * $scope.sprites.length));
		var sprite = $scope.sprites[num];
		if(sprite.active)
			sprite = getInactiveSprite();
		if(!sprite) {
			console.log('ERROR!!! RAN Out of Sprites!!!');
			cleanupSprites();
			return false;
		}
			
		sprite.active=true;
		var e = document.getElementById('sprite'+sprite.name);
		if(e) {
			e.src = src;
			e.style.left = startX+'px';
			e.style.top = (startY).toString()+'px';
			e.style.display='block';
			if(piece==0) 
				e.style.display='none';
			e.style.width = size+'px';
			e.style.height = size+'px';
			e.className = 'sprite';
		} else
			console.log('no sprite!!!');
		sprite.startX = startX;
		sprite.startY = startY;
		sprite.endX = endX || startX;
		sprite.endY = endY || startY;
		sprite.move=0;
		sprite.range = range || 200;
		sprite.battleId = battleId || 0;
		moveSpritesCount=0;
		moveSprites();
		return sprite;
	}
	function startRandomSprite() {
		var type = Math.floor((Math.random() * 2)); //0=plane, 1 ship
		var route = randomPlaneRoute();
		if(type>0)
			route = randomShipRoute();
			
		var sprite = getSprite(1, 15, route.startX,route.startY,route.endX,route.endY);
		if(!sprite)
			return;
		var e = document.getElementById('sprite'+sprite.name);
		if(e) {
			if(type==0) {
				e.src = 'graphics/plane.png';
				if(Math.abs(sprite.startX-sprite.endX)<Math.abs(sprite.startY-sprite.endY))
					e.className = (sprite.startY<sprite.endY)?'sprite rotated':'sprite rotated270';
				else
					e.className = (sprite.startX>sprite.endX)?'flipH sprite':'sprite';
			} else 
				e.src = (sprite.startX<sprite.endX && sprite.startY>sprite.endY)?'graphics/ship.png':'graphics/sail.png';
		}
	}
	function moveSprites() {
		$scope.activeSpritesFlg=true;
		var activeSpritesFlg=false;
		var battleHash={};
		$scope.sprites.forEach(function(sprite) {
			if(sprite.active) {
				if(sprite.battleId>0) {
					if(battleHash[sprite.battleId]>0) {
						sprite.battleId=0;
					} else 
						battleHash[sprite.battleId]=1;
				}
				activeSpritesFlg=true;
				var e = document.getElementById('sprite'+sprite.name);
				if(e) {
					sprite.move+=4;
					var xAmount = (sprite.endX-sprite.startX)/sprite.range;
					var yAmount = (sprite.endY-sprite.startY)/sprite.range;
					var left = sprite.startX+xAmount*sprite.move;
					var top = sprite.startY+yAmount*sprite.move;
					e.style.left = left+'px';
					e.style.top = top+'px';
					if(sprite.move>=sprite.range) {
						if(sprite.battleId>0) {
							var battle = getItem($scope.gameObj.battles, sprite.battleId);
							if(!battle)
								return;
							var terr=$scope.gameObj.territories[battle.terr-1];
							startBattle(sprite.battleId, battle, terr);
							sprite.active=false;
							e.style.display='none';
						} else {
							sprite.active=false;
							e.style.display='none';
						}
					}
				} else
					sprite.active=false;
			}
		});
		$scope.activeSpritesFlg=activeSpritesFlg;
		if(activeSpritesFlg && moveSpritesCount++<1000)
			spriteId = window.requestAnimationFrame(moveSprites);
	}
	$scope.adminModeToggle=function() {
		playClick($scope.muteSound);
		$scope.adminMode=!$scope.adminMode;
	}
	$scope.adminBonusUnits=function() {
		playClick($scope.muteSound);
		placeUnitsOnTerrId($scope.selectedTerritory.id, [2,2,3]); // bonus units
	}
	$scope.allowMovementUnits=function() {
		playClick($scope.muteSound);
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==$scope.selectedTerritory.id) {
				console.log('fixed', unit.piece);
				unit.movesLeft=2;
			}
		});
	}
	$scope.moveAllUnits=function() {
		playClick($scope.muteSound);
		showAlertPopup('Click territory to move these units');
		closePopup('territoryPopup');
		$scope.moveAllUnitsTerr=$scope.selectedTerritory.id;
	}
	$scope.changeTurn=function() {
		playClick($scope.muteSound);
		$scope.showPlayersMenuFlg=true;
	}
	$scope.changeToTurn=function(player) {
		playClick($scope.muteSound);
		$scope.gameObj.turnId=player.turn;
		$scope.changePlayerMessage='update SP_GAME set turn = '+player.id+' where row_id = '+$scope.gameObj.id;
	}
	$scope.changeOwner=function(player) {
		transferControlOfTerr($scope.selectedTerritory, player.nation);
	}
	$scope.fixBsHp=function() {
		playClick($scope.muteSound);
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==$scope.selectedTerritory.id && unit.piece==12) {
				if(unit.damage==2)
					unit.damage=0;
				else
					unit.damage=2;
			}
		});
	}
	function moveAllUnitsGo(id) {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==$scope.moveAllUnitsTerr && (unit.type==1 || unit.type==2)) {
				unit.terr=id;
			}
		});
		$scope.moveAllUnitsTerr=0;
	}
	$scope.adminMoveGeneral=function() {
		playClick($scope.muteSound);
		$scope.currentGeneralTerr=$scope.selectedTerritory.id;
		showAlertPopup('Click on terr to move general into');
	}
	$scope.deleteStratButtonPressed=function(item) {
		playClick($scope.muteSound);
		console.log(item);
		deleteUserStrategy(item.row_id);
		startSpinner('Deleting...', '150px'); 
	}
	function deleteUserStrategy(id) {
		var url = getHostname()+"/webSuperpowers.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'deleteStrategy',
	        id: id
	    },
	    function(data, status){
	    	console.log('deleteUserStrategy', data);
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
			$scope.openCloseSlider('units');
			showAlertPopup('Item deleted');
		}
	    });
	}
	$scope.showCasualties=function() {
		if($scope.casList && $scope.casList.length>0) {
			$scope.casList=[];
			return;
		}
		$scope.casList=[];
		$scope.gUnits.forEach(function(unit) {
			if(unit.cas<99)
				$scope.casList.push({name: unit.name, cas: unit.cas, id: unit.id});
		});
	}
	function startBattle(battleId, battle, terr) {
		if(!battle) {
			console.log('error! not battle found: '+battleId);
			showAlertPopup('Error!');
			return;
		}
		if(battle.active) {
//			console.log('battle.active');
//			showAlertPopup('battle.active!', 1);
			return;
		}
		battle.active=true;
		$scope.fullRetreat=false;
		$scope.battle.incomingFlg=false;
		if(battle.attacker==terr.owner && !terr.enemyPiecesExist)
			battle.warFlg=false;
		
		var defendingUnits = [];
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id && !unit.moving) {
				var piece = $scope.gUnits[unit.piece];
				if(terr.leaderFlg && (unit.piece==2 || unit.piece==3))
					unit.def=unit.def2+1;
				if(unit.owner==battle.attacker)
					battle.units.push(unit);
				if(okToDefend(unit) && unit.owner!=battle.attacker) {
					defendingUnits.push(unit);
				}
				if(unit.piece==11)
					battle.leaderFlg=true;
			}
		});
		defendingUnits.sort(function(a, b) { return a.cas - b.cas; });
		
		battle.defendingUnits = defendingUnits;
		battle.units.sort(function(a, b) { return a.cas - b.cas; });
		
//		console.log('startBattle battle', battle);		
//		console.log('startBattle battle.units', battle.units);		
//		console.log('startBattle battle.defendingUnits', battle.defendingUnits);		
		
		if(battle.warFlg) {
			playCannon($scope.muteSound);
			if($scope.battle)
				$scope.battle.active=true;
			if(1) { //$scope.popupOpen && $scope.selectedTerritory && battle.terr==$scope.selectedTerritory.id
				$scope.selectedBattle = battle;
				$scope.defendingUnits = $scope.selectedBattle.defendingUnits;
				warAudio.currentTime=0;
				if(isSoundOn() && !$scope.muteSound)
					warAudio.play();
			}
			terr.flag = 'target3.png';
			terr.battleId = battleId; 
			applyChanges();
		}
		advanceActionIfNeeded();
//		scanBattles();
	}

	function displayTimeBar() {
		var maxClicks = 80;
		var numMonths = Math.floor(timeClicks/maxClicks);
		var numYears =  Math.floor(numMonths/12);
		var timeMonth = numMonths%12;
		var timeYear = 2018+numYears;
		var e = document.getElementById('timeBar');
		if(e) {
			e.style.width=(timeClicks%maxClicks).toString()+'px';
			var month = monthNameByNumber(timeMonth);
			setInnerHTMLFromElement('timeLabel', month.substring(0,3)+' '+timeYear);
		} else
			pauseAction();
		if(timeClicks%maxClicks==0) {
			playSound('clink.wav', 0, $scope.muteSound);
			for(var x=0; x<8; x++)
				$scope.gameObj.players[x].money += $scope.gameObj.players[x].income;
			applyChanges();
		}
	}
	function removeAlliancesForNation(nation) {
		$scope.gameObj.players.forEach(function(player) {
			if(player.treaties[nation-1]==3) {
				player.treaties[nation-1]=0;
			}
		});
	}
	function compPlayerPurchase(player) {
		if($scope.gameObj.round<=18)
			purchaseTechnology(0);
		if($scope.gameObj.round==10)
			purchaseTechnology(19);
		var compFactories = [];
		var islandFactories = [];
		var capitalId=0;
		var hotSpotFactory=0;
		var requestedHotSpot = getRequestedHotSpot(player);
		if(requestedHotSpot>0)
			player.hotSpotId=requestedHotSpot;
		
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.owner==player.nation && terr.factoryCount>0) {
				if(player.hotSpotId && player.hotSpotId==terr.id)
					hotSpotFactory=compFactories.length;
				if(terr.capital)
					capitalId=terr.id;
				if(terr.land.length>0)
					compFactories.push({terrId: terr.id});
				else
					islandFactories.push({terrId: terr.id});
			}
		});
		if(compFactories.length==0)
			compFactories=islandFactories;
		if(compFactories.length==0) {
			showAlertPopup($scope.superpowers[player.nation]+' eliminated!');
			removeAlliancesForNation(player.nation);
			player.alive=false;
			return;
		}
		var randomFactory1 = Math.floor((Math.random() * compFactories.length));
			
		if(player.hotSpotId && player.hotSpotId>0 && compFactories.length>hotSpotFactory)
			randomFactory1=hotSpotFactory;
		
		var primaryFactory=compFactories[randomFactory1];
		if(!primaryFactory)
			primaryFactory=compFactories[0];
		var randomFactory2 = Math.floor((Math.random() * compFactories.length));
		var num=Math.floor((Math.random() * 8));
		player.money+=5;
		if(player.money>$scope.gameObj.round)
			player.money-=$scope.gameObj.round; // make game easier as you go (avoid long, long games);
			
		var placedInf=numberVal(player.placedInf);
		if(placedInf<3) {
			for(var x=placedInf; x<3; x++) {
				var terr = $scope.gameObj.territories[compFactories[0].terrId-1];
				setTimeout(function() { annimateUnitOntoTerr(terr, 2, true, true); }, 50+150*x);
			}
			player.placedInf=3;
		}
		var terr1 = $scope.gameObj.territories[primaryFactory.terrId-1];
		if(terr1.adCount<=2 && $scope.gameObj.round<=10)
			addUniToFacQueue(primaryFactory,player,13,1);
		var items=[];
		if(capitalId>0 && $scope.gameObj.round>=6)
			addUniToFacQueue({terrId: capitalId},player,3,1);
			
		if(num<=5) {
			addComputerFactory(player, compFactories);
		}
		if(num>=2 && player.income>=30)
			player.money+=8;

		var difficultyNum = numberVal($scope.gameObj.difficultyNum);
		if(difficultyNum==-1)
			player.money-=10;
		if(difficultyNum==1)
			player.money+=10;
		if(num==2 && capitalId>0) {
			addUniToFacQueue({terrId: capitalId},player,4,1);
			addUniToFacQueue({terrId: capitalId},player,5,1);
		}
		if(num==3 && player.income>40)
			addUniToFacQueue(primaryFactory,player,9,1);
		if(num==4) {
			addUniToFacQueue(primaryFactory,player,4,1);
		}
		if(num==5 && player.income>30)
			addUniToFacQueue(primaryFactory,player,8,1);

		if(num==6) {
			addUniToFacQueue(primaryFactory,player,7,1);
		}
		if(num==7 || player.money>=45) {
			addUniToFacQueue(primaryFactory,player,14,1);
		}
		if(player.money>=10) {
			var infCount = parseInt(player.money/6);
			var tankCount = parseInt(player.money/6);
			addUniToFacQueue(primaryFactory,player,2,infCount);
			addUniToFacQueue(compFactories[randomFactory2],player,3,tankCount);
		}
		checkForAllyTerritoryRequests(player);
	}
	function checkForAllyTerritoryRequests(player) {
		if(!player || !player.territories)
			return;
		player.territories.forEach(function(terr) {
			if(terr.requestTransfer && terr.requestTransfer>0) {
				if(treatyStatus(player, terr.requestTransfer)==3) {
					transferControlOfTerr(terr, terr.requestTransfer);
					logItem($scope.currentPlayer, 'Transfer', terr.name+' transferred to '+$scope.superpowers[terr.requestTransfer]);
				}
				terr.requestTransfer=0;
			}
		});
	}
	function transferControlOfTerr(terr, nation, battle) {
		var oldOwner=terr.owner;
		if(terr.factoryCount>0) {
			changeFactoryToPlayer(nation, terr.id);
		}
		terr.owner=nation;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id) {
				if(unit.piece==13 || unit.piece==14 || unit.piece==52 || unit.piece==15 || unit.piece==19) {
					unit.owner=nation;
					unit.nation=nation;
					unit.movesLeft=0;
				}
				if(unit.terr>=79 && unit.owner!=nation && unit.piece != 44)
					deleteAnyUnit(unit, battle, battle.defCasualties); //left over cargo
			}
		});
		refreshTerritory(terr);
	}
	$scope.postNote=function() {
		var msgField = databaseSafe(document.getElementById("noteField").value);
		if(msgField.length==0) {
			showAlertPopup('no msgField', 1);
			return;
		}
		$('#noteField').val('');
		logItem($scope.currentPlayer, 'Note', msgField);
	}
	function logItem(player, type, message, details, terrId, nation, ft, dr, enemy) {
		var id = $scope.gameObj.logId || 0;
		id++;
		$scope.gameObj.logId=id;
		var bRounds = 0;
		if(details && details.length>0) {
			var pieces=details.split('|');
			var lid=1;
			var attackingUnits = arrayObjOfLine(pieces[0], lid);
			lid+=attackingUnits.length;
			var defendingUnits = arrayObjOfLine(pieces[1], lid);
			lid+=defendingUnits.length;
			var attackingCas = arrayObjOfLine(pieces[2], lid);
			lid+=attackingCas.length;
			var defendingCas = arrayObjOfLine(pieces[3], lid);
			var medicHealedCount = pieces[4];
			if(details.length>5)
				bRounds = pieces[5];
		}
		var log = {id:id, round: $scope.gameObj.round,nation: player.nation,type:type,enemy: enemy, message:message,
		attackingUnits:attackingUnits,defendingUnits:defendingUnits,attackingCas:attackingCas,defendingCas:defendingCas,
		medicHealedCount: medicHealedCount, bRounds: bRounds, t: terrId, o: nation, ft: ft, dr: dr};
		$scope.gameObj.logs.push(log);
	}
	function arrayObjOfLine(line, id) {
		var finList=[];
		if(line) {
			var units = line.split('+');
			units.forEach(function(unit) {
				finList.push({id: id, piece: unit});
				id++;
			});
		}
		return finList;
	}
	$scope.finalCheckBoxClicked=function() {
		playClick($scope.muteSound);
		$scope.autoAttacknum=0;
		$scope.finalCheckboxMessage=!$scope.finalCheckboxMessage;
	}
	$scope.showBattleDetails=function(log) {
		if(!log || !log.attackingUnits)
			return;
		if($scope.showLog==log.id)
			log.show=!log.show;
		else
			log.show=true;
		$scope.showLog=log.id;
	}
	function addComputerFactory(player) {
		if(player.territories.length==0) {
			console.log('hey!!! no territories!!!');
			return;
		}
		var num=Math.floor((Math.random() * player.territories.length));
		var terr=player.territories[num];
		if(!terr)
			return;
		if(terr.nation==99)
			return;
		if(!terr)
			return;
		if(terr.factoryCount>1)
			return;
		if(terr.factoryCount==0)
			addUniToFacQueue('',player,15,1,terr.id);
		if(terr.factoryCount==1) {
			addUniToFacQueue('',player,19,1,terr.id);
		}
	}
	function getInfCount(homeTerr) {
		var c=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==homeTerr.id && unit.att>0 && unit.mv>0 && unit.movesLeft>0 && !unit.moving && (unit.piece==2 || unit.piece==3)) {
				c++;
			}
		});
		return c;
	}
	function loadTransports(fromTerr, toTerr) {
		var units = [];
		var count=0;
		var cargoSpace = toTerr.cargoSpace;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==fromTerr.id && unit.att>0 && unit.mv>0 && unit.movesLeft>0 && !unit.moving && (unit.piece==2 || unit.piece==3)) {
				if(unit.cargoUnits+fromTerr.cargoUnits<=cargoSpace) {
					units.push(unit);
					cargoSpace-=unit.cargoUnits;
				}
			}
		});
		if(units.length>0)
			moveUnitsToTerr(toTerr, units);
	}
	function moveTransports(homeTerr, waterTerr, enemyWater, enemyZone) {
		if(waterTerr.shipAttack<enemyZone.shipDefense)
			return;
		var units = [];
		var landunits=0;
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var unit = $scope.gameObj.units[x];
			if(unit.terr==waterTerr.id) {
				if(unit.type==1)
					landunits++;
				units.push(unit);
			}
		}
		if(units.length>0 && landunits>0) {
			moveUnitsToTerr(enemyWater, units);
			return true;
		}
		return false;
	}
	function chanceOfWar(p1, enemyZone) {
		var num=Math.floor((Math.random() * 3));
		if(num==1 && enemyZone.owner>0) {
			var p2=playerOfNation(enemyZone.owner);
			changeTreaty(p1, p2, 0);
		}
	}
	function canAttackTerr(player, terr) {
		if(terr.incomingFlg) {
			return false;
		}
		if(terr.owner==0)
			return true;
		if(terr.nation==99 && terr.unitCount==0)
			return true;
		if(player.nation==terr.owner)
			return false;
		if($scope.gameObj.round<$scope.gameObj.attack)
			return false;
		if(terr.nuked) {
			return false;
		}
		if($scope.gameObj.round==$scope.gameObj.attack) {
			if(player.attackFlg)
				return false;
			var p2=playerOfNation(terr.owner);
			if(p2 && p2.defenseFlg)
				return false;
		}
		if(treatyStatus(player, terr.owner)==0)
			return true;
		else
			return false;
	}
	function okToAttack(player, terr, unlimitedFlg) {
		var result = okToAttack2(player, terr, unlimitedFlg);
//		console.log('okToAttack', player.nation, terr.name, result, terr.incomingFlg, player.attackFlg, terr.nuked);
		return result;
	}
	function okToAttack2(player, terr, unlimitedFlg) {
//		if(terr.incomingFlg) {
//			return false;
//		}
		if(terr.owner==0)
			return true;
		if(terr.nation==99 && terr.unitCount==0)
			return true;
		if(player.nation==terr.owner)
			return false;
		if($scope.gameObj.round<$scope.gameObj.attack)
			return false;
//		if(terr.nuked) {
//			return false;
//		}
		if($scope.gameObj.round==$scope.gameObj.attack && !unlimitedFlg) {
			if(player.attackFlg)
				return false;
			var p2=playerOfNation(terr.owner);
			if(p2 && p2.defenseFlg)
				return false;
		}
		if(treatyStatus(player, terr.owner)>0) {
			var status = treatyStatusForTerrOrWar(player, terr);
//			console.log('!!!!!!!!!!!!!not at war!!!!!!!!!!!!', player.nation, terr.name, status);
			return false;
		}
//		if(treatyStatusForTerrOrWar(player, terr)>0) {
//			return false;
//		}
		return true;
	}
	function recallBoats(player, homeTerr) {
		if(homeTerr.enemyWater && homeTerr.enemyWater>0) {
			var enemyWaterTerr = $scope.gameObj.territories[homeTerr.enemyWater-1];
			recallBoatFromWater(player, homeTerr, enemyWaterTerr);
		}
		if(homeTerr.enemyWater2 && homeTerr.enemyWater2>0) {
			var enemyWaterTerr = $scope.gameObj.territories[homeTerr.enemyWater2-1];
			recallBoatFromWater(player, homeTerr, enemyWaterTerr);
		}
	}
	function recallBoatFromWater(player, homeTerr, enemyWaterTerr) {
		if(enemyWaterTerr.owner==player.nation && enemyWaterTerr.unitCount>0) {
			var waterTerr = $scope.gameObj.territories[homeTerr.water-1];
			if(waterTerr.owner==player.nation || waterTerr.owner==0) {
				var units = [];
				for(var x=0; x<$scope.gameObj.units.length; x++) {
					var unit = $scope.gameObj.units[x];
					if(unit.terr==enemyWaterTerr.id && !unit.moving) {
						units.push(unit);
					}
				}
				if(units.length>0) {
					moveUnitsToTerr(waterTerr, units);
				}
			}
		}
	}
	function amphibiousAttacks2(player) {
		var terrHash={};
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.piece==4 && unit.owner==player.nation) {
				var homeBaseId=0;
				terrHash[unit.terr]=1;
				if(unit.terr==104 || unit.terr==105)
					homeBaseId = 101;
				if(unit.terr==113 || unit.terr==106)
					homeBaseId = 110;
				if(unit.terr==111 || unit.terr==109)
					homeBaseId = 112;
				if(unit.terr==137 || unit.terr==139)
					homeBaseId = 141; // japan
				if(unit.terr==119 || unit.terr==134)
					homeBaseId = 131;
				if(unit.terr==115 || unit.terr==120)
					homeBaseId = 118;
				if(unit.terr==93 || unit.terr==123)
					homeBaseId = 96;
				if(unit.terr==114 || unit.terr==95)
					homeBaseId = 98;
				if(homeBaseId>0) {
					var homeBase = $scope.gameObj.territories[homeBaseId-1];
					moveUnitsToTerr(homeBase, [unit]);
				}
			}
		});
		var keys = Object.keys(terrHash);
		keys.forEach(function(terrId) {
			if(terrId==101 || terrId==110 || terrId==112 || terrId==141 || terrId==131 || terrId==118 || terrId==96 || terrId==98) {
				var t = $scope.gameObj.territories[terrId-1];
				if(t.homeBase>0) {
					var homeBase = $scope.gameObj.territories[t.homeBase-1];
					if(homeBase.groundForce>0 && homeBase.owner == $scope.currentPlayer.nation) {
						if(!attemptAmbibiousLanding(player, homeBase, t.enemyWater, t.enemyZone, t))
							attemptAmbibiousLanding(player, homeBase, t.enemyWater2, t.enemyZone2, t)
					}
				}
			}
		});
	}
	function attemptAmbibiousLanding(player, homeBase, enemyWaterId, enemyZoneId, homeWaterTerr) {
		var enemyWaterTerr = $scope.gameObj.territories[enemyWaterId-1];
		var enemyLandTerr = $scope.gameObj.territories[enemyZoneId-1];
		if(enemyWaterTerr.shipDefense>0 && $scope.gameObj.round<=6)
			return false;
		if(enemyLandTerr.defStrength>homeBase.attStrength)
			return false;
		if(enemyLandTerr.defStrength>homeWaterTerr.transportCount*4)
			return false;
		
		if(okToAttack(player, enemyLandTerr)) {
			amphibiousAttackForPlayer2(player, homeBase, enemyWaterTerr, enemyLandTerr, homeWaterTerr);
			return true;
		}
		return false;
	}
	function amphibiousAttackForPlayer2(player, homeBase, enemyWaterTerr, enemyLandTerr, homeWaterTerr) {
		var units = [];
		var transports = [];
		var cargoSpace=homeWaterTerr.cargoSpace;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==homeWaterTerr.id && unit.owner==$scope.currentPlayer.nation) {
				transports.push(unit);
			}
			if(unit.terr==homeBase.id && unit.att>0 && unit.mv>0 && unit.movesLeft>0 && !unit.moving && (unit.piece==2 || unit.piece==3)) {
				if(cargoSpace-unit.cargoUnits>=0) {
					units.push(unit);
					cargoSpace-=unit.cargoUnits;
				}
			}
		});
		if(units.length>0 && transports.length>0 && units.length>=enemyLandTerr.unitCount) {
			console.log('xxx amphib!!!', homeBase.name, enemyLandTerr.name);
			playSound('foghorn.wav', 0, $scope.muteSound);
			moveUnitsToTerr(enemyWaterTerr, transports);
			if(enemyWaterTerr.shipDefense==0 || enemyWaterTerr.owner==$scope.currentPlayer.nation)
				moveUnitsToTerr(enemyLandTerr, units);
		}
	}
/*	function amphibiousAttacks(player, homeTerr) {
		var enemyZone = $scope.gameObj.territories[homeTerr.enemyZone-1];
		if(okToAttack(player, enemyZone) && enemyZone.defStrength<=homeTerr.attStrength) {
			var enemyWaterTerr = $scope.gameObj.territories[homeTerr.enemyWater-1];
			amphibiousAttackForPlayer(player, homeTerr, enemyWaterTerr, enemyZone);
		} else {
			if(homeTerr.enemyZone2 && homeTerr.enemyZone2>0) {
				var enemyZone2 = $scope.gameObj.territories[homeTerr.enemyZone2-1];
				var enemyWaterTerr2 = $scope.gameObj.territories[homeTerr.enemyWater2-1];
				if(okToAttack(player, enemyZone2) && enemyZone2.defStrength<homeTerr.attStrength)
					amphibiousAttackForPlayer(player, homeTerr, enemyWaterTerr2, enemyZone2);
				else
					recallBoats(player, homeTerr);
			} else if($scope.gameObj.round>$scope.gameObj.attack)
				recallBoats(player, homeTerr);
		}
	}
	function amphibiousAttackForPlayer(player, homeTerr, enemyWaterTerr, enemyZone) {
		console.log('xxx amphib!!!', homeTerr.name, enemyZone.name, okToAttack(player, enemyZone));
		var waterTerr = $scope.gameObj.territories[homeTerr.water-1];
		if(waterTerr.shipAttack>=enemyWaterTerr.shipDefense && waterTerr.transportCount>enemyZone.unitCount/4 && homeTerr.attStrength>enemyZone.defStrength) {
			if(getInfCount(homeTerr)>3) {
				player.amphibiuousFlg=true;
				player.attackCount++;
				playSound('foghorn.wav', 0, $scope.muteSound);
				loadTransports(homeTerr, waterTerr);
				setTimeout(function() { moveTransports(homeTerr, waterTerr, enemyWaterTerr, enemyZone); }, 1250);
				setTimeout(function() { attackFromTerr(player, enemyWaterTerr, enemyZone); }, 2800);
				setTimeout(function() { reduceAttackCount(player); }, 3250);
			}
		}
	}*/
	function reduceAttackCount(player) {
		player.amphibiuousFlg=false;
		player.attackCount--;
	}
	function findNextPrimaryTargetForPlayer(player, ids) {
		for(var x=0; x<ids.length; x++) {
			var terr = $scope.gameObj.territories[ids[x]-1];
			if(terr.owner != player.nation) {
				return ids[x];
			}
		}
		return 0;
	}
	function findPrimaryTarget(player) {
		var target = 0;
		if(player.nation==1)
			target = findNextPrimaryTargetForPlayer(player, [1,2,3,4,5]);
		if(player.nation==2)
			target = findNextPrimaryTargetForPlayer(player, [7,12,8,9,62]);
		if(player.nation==3)
			target = findNextPrimaryTargetForPlayer(player, [13,14,15,16,17,18,19,20]);
		if(player.nation==4)
			target = findNextPrimaryTargetForPlayer(player, [21,24,25,23,22]);
		if(player.nation==5)
			target = findNextPrimaryTargetForPlayer(player, [28,70,29,30,31,34]);
		if(player.nation==6)
			target = findNextPrimaryTargetForPlayer(player, [35,37,40,41,36,38,39]);
		if(player.nation==7)
			target = findNextPrimaryTargetForPlayer(player, [42,44,43,45,46,47,48,49]);
		if(player.nation==8)
			target = findNextPrimaryTargetForPlayer(player, [50,55,54,53,52,51]);
		player.primaryTargetId=target;
	}
	function mainBaseAttack(player) {
		if(player.mainBaseID==0)
			return;
		var mainBase = $scope.gameObj.territories[player.mainBaseID-1];
		logComputer('----mainBase: '+mainBase.name);
		if(!mainBase || mainBase.locked)
			return;
		if(!mainBase.land || mainBase.land.length==0)
			return;
		
		var enemyId=0;
		var targetId = player.primaryTargetId;
		if(targetId==0)
			targetId=player.secondaryTargetId;
		var enemyDistance=2;
		mainBase.land.forEach(function(tId) {
			if(tId==targetId)
				enemyDistance=1; // next door!
			var target = $scope.gameObj.territories[tId-1];
			if(target.owner != mainBase.owner) {
				if(target.defStrength < mainBase.attStrength && canAttackTerr(player, target)) {
					enemyId=tId;
				}
			}
		});
		if(enemyId>0) {
			var target = $scope.gameObj.territories[enemyId-1];
			attackFromTerr(player, mainBase, target);
		} else {
			if(enemyDistance>1)
				checkMainBase(player, targetId);
		}
	}
	function attackFromTerr(player, terr, target, fullAttackFlg) {
		// note: CPU declare peace on each other after round 12 (treatyStatusForTerrOrWar)
		if(!target || !target.name)
			console.log('XXXXXXWHOA!!XXXXXXXXXXXX');
		if(target.incomingFlg) {
//			console.log('incomingFlg!!!!!');
			return;
		}
		if(!okToAttack(player, target)) {
			console.log('not ok to attack!!', target.name);
			return;
		}
		logComputer('###########attackFromTerr#############'+terr.name+' > '+target.name);
//		var warStatus=treatyStatusForTerrOrWar(player, target);
//		if(warStatus>0) {
//			console.log('not ready for war!!!!! ', warStatus);
//			return;
//		}
//		if(treatyStatusForTerrOrWar(player, target)==1 || treatyStatusForTerrOrWar(player, target)==2) {
//			var p2=playerOfNation(target.owner);
//			changeTreaty(player, p2, 0);
//		}
		var xFinal = terr.x-window.innerWidth/2;
		var yFinal = terr.y-window.innerHeight/2;
		window.scrollTo(xFinal, yFinal);
//		console.log('window.scrollTo', xFinal, yFinal);
		var units = [];
		var attStrength=0;
		var targetFound=false;
		var count=0;
		
		
		var advanceHeros=true;
		if(target.enemyForce>=terr.defStrength)
			advanceHeros=false;
		
		var minLeftBehind=3;
		if(terr.leaderFlg || terr.generalFlg)
			minLeftBehind=5;
		if(advanceHeros)
			minLeftBehind=1;
		if(fullAttackFlg)
			minLeftBehind=0;
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var unit = $scope.gameObj.units[x];
			if(unit.owner==player.nation && unit.terr==terr.id && unit.att>0 && unit.mv>0 && !unit.moving && unit.piece!=14) {
				if(terr.id>=79) { // amphib
					if(unit.type==1 || unit.type==2)
						units.push(unit);
						attStrength+=unit.att;
				} else {
					if(unit.piece==2 && count++<=minLeftBehind) {
						//leave one behind
					} else {
						if(advanceHeros || unit.piece<10 || unit.piece>11) {
							units.push(unit);
							if(!unit.returnFlg)
								attStrength+=unit.att;
						}
					}
				}
			}
		}
		if(attStrength>target.defStrength || terr.id>=79) {
			targetFound=true;
			player.targetId = target.id;
			player.attackCount++;
			moveUnitsToTerr(target, units);
		}
		return targetFound;
	}
	function findsecondaryTarget(player) {
		player.secondaryTargetId=0;
		for(var x=0; x<player.territories.length; x++) {
			var terr=player.territories[x];
			if(terr && terr.land) {
				for(var i=0; i<terr.land.length; i++) {
					var t = $scope.gameObj.territories[terr.land[i]-1];
					if(t.owner != player.nation && okToAttack(player, t)) {
						logComputer('xxxsecondaryTarget: '+t.name);
						player.secondaryTargetId = t.id;
						return t.id;
					}
				}
			}			
		}
		return 0;
	}
	function findDefaultTarget(player) {
		var targets = [0,2,8,16,24,29,37,45,53];
		var target=targets[player.nation];
		if(target==player.mainBase.id)
			target=0;
		return target;
	}
	function findMainBaseTarget(player) {
		var targets = [1,7,13,21,28,35,42,50];
		for(var x=0; x<targets.length; x++) {
			var t = $scope.gameObj.territories[targets[x]-1];
			if(t.owner != player.nation && okToAttack(player, t)) {
				if(landDistFromTerr(player.mainBase.id, t.id, 0)<=3) {
					player.secondaryTargetId = t.id;
					return t.id
				}
			}
		}
		return 0;
	}
	function findAttackTarget(player) {
		findPrimaryTarget(player);
//		if(player.mainBaseID>0)
			findHotSpot(player);
		
		if(player.primaryTargetId==0) {
			player.secondaryTargetId=findMainBaseTarget(player);
			if(player.secondaryTargetId==0)
				player.secondaryTargetId=findsecondaryTarget(player);
			if(player.secondaryTargetId==0)
				player.secondaryTargetId=findDefaultTarget(player);
		}
	}
	function getRequestedHotSpot(player) {
		var hotSpot=0;
		if(player.requestedHotSpot && player.requestedHotSpot>0) {
			var terr = $scope.gameObj.territories[player.requestedHotSpot-1];
			if(terr.owner==player.nation) {
				hotSpot=player.requestedHotSpot;
				return;
			} else
				player.requestedHotSpot=0;
		}
		return hotSpot;
	}
	function findHotSpot(player) {
		if(!player || !player.territories || player.territories.length==0)
			return;
		
		player.hotSpotId = getRequestedHotSpot(player);
		if(player.hotSpotId>0) {
			return;
		}
		var hotAmount=0;
		var hotSpot=0;
		player.territories.forEach(function(terr) {
			if(terr.enemyForce>hotAmount) {
				hotAmount=terr.enemyForce;
				hotSpot=terr.id;
			}
		});
		player.hotSpotId = hotSpot;
	}
	function findEnemyForce(terr, player) {
		var attStrength=0;
		terr.land.forEach(function(terrId) {
			var enemyTerr = $scope.gameObj.territories[terrId-1];
			if(enemyTerr.attStrength>attStrength && canAttackTerr(player, enemyTerr))
				attStrength=enemyTerr.attStrength;
		});
		return attStrength;
	}
	function logComputer(msg) {
		if($scope.showCPUMoves)
			console.log(msg);
	}
	function nameOfTerr(terr) {
		if(terr && terr.name)
			return terr.name;
		else
			return 'none';
	}
	function attackCapitalIfPossible(player) {
		$scope.gameObj.territories.forEach(function(target) {
			if(target.capital && target.id<79 && target.owner!=player.nation) {
				target.land.forEach(function(id) {
					var terr = $scope.gameObj.territories[id-1];
					if(terr.owner==player.nation && terr.attStrength>0) {
						if(okToAttack(player, target, true) && terr.attStrength>target.defStrength) {
							console.log('+++cap', target.name, target.defStrength, terr.name, terr.attStrength);
							attackFromTerr(player, terr, target, true);
						}
					}
				});
			}
		});
	}
	function compPlayerAttack(player) {
		logComputer('>>>>compPlayerAttack');
		if(player.status != gStatusPurchase)
			return;
		player.status=gStatusAttack;
		$scope.cpuAction=gStatusAttack;
		if(!player.alive)
			return;
		if(isSoundOn() && !$scope.muteSound)
			warAudio.play();

		player.attackCount=0;
		
		logComputer('    finding target...');
		player.primaryTargetId=0;
		player.secondaryTargetId=0;
		if(player.requestedTarget && player.requestedTarget>0) {
			var primaryTarget = $scope.gameObj.territories[player.requestedTarget-1];
			if(primaryTarget.owner==player.nation)
				player.requestedTarget=0;
			else {
				player.primaryTargetId=player.requestedTarget;
				findHotSpot(player);
			}
		}
		if(player.primaryTargetId==0)
			findAttackTarget(player);
		if(1) {
			var primaryTarget = $scope.gameObj.territories[player.primaryTargetId-1];
			var secondaryTarget = $scope.gameObj.territories[player.secondaryTargetId-1];
			var hotSpot = $scope.gameObj.territories[player.hotSpotId-1];
			var mainBase = $scope.gameObj.territories[player.mainBaseID-1];
			console.log('###############');
			console.log('primaryTarget', player.primaryTargetId, nameOfTerr(primaryTarget));
			console.log('hotSpot', player.hotSpotId, nameOfTerr(hotSpot));
			console.log('secondaryTarget', player.secondaryTargetId, nameOfTerr(secondaryTarget));
			console.log('mainBase', player.mainBaseID, nameOfTerr(mainBase));
			console.log('###############');
		}
		logComputer('    Targets: '+player.primaryTargetId+' '+player.secondaryTargetId);
		
		//------------now ready for the attacks!-----------------
		attackCapitalIfPossible(player);
		
		if(player.primaryTargetId>0) {
			attackPrimaryTarget(player);
		}
//		console.log('player.requestedHotSpot', player.requestedHotSpot);
		if(player.requestedHotSpot>0)
			freezeFortification(player.requestedHotSpot);
			
		mainBaseAttack(player);
		
		if($scope.gameObj.round!=6) {
			amphibiousAttacks2(player);

			logComputer('---big attacks start<<<<<');
			player.territories.forEach(function(terr) {
				if(!terr.locked && terr.groundForce>0 && terr.nation<99) {
					if(terr.nukeCount>0)
						findANukeTarget(player, terr);
					if(terr.bomberCount>0 && $scope.gameObj.round>=6)
						findABomberTarget(player, terr);
					var target = getCompTarget(terr, player);
					if(target && target.capital) {
						console.log('+++capital!!', target.name);
						attackFromTerr(player, terr, target, true);
					} 
				}
			});
			logComputer('---big attacks end<<<<<<');
			
			logComputer('---little attacks start<<<<<');
			player.territories.forEach(function(terr) {
				if(!terr.locked && terr.groundForce>0 && terr.nation<99) {
					var target = getCompTarget(terr, player);
					if(target) {
						attackFromTerr(player, terr, target, true);
					} 
				}
			});
			logComputer('---little attacks end<<<<<<');
		}
	}
	function attemptToTakeCapital(player) {
		logComputer('-attemptToTakeCapital-');
		player.territories.forEach(function(terr) {
			if(!terr.locked && terr.attStrength>0 && terr.nation<99) {
				terr.land.forEach(function(terrId) {
					var target = $scope.gameObj.territories[terrId-1];
					if(target.capital && target.owner != player.nation) {
						if(okToAttack(player, target, true) && terr.attStrength>target.defStrength)
							attackFromTerr(player, terr, target, true);
					}
				});
			}
		});
	}
	function freezeFortification(id) {
		var fortressTerr = $scope.gameObj.territories[id-1];
		console.log('freezeFortification '+fortressTerr.name);
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==id && unit.movesLeft>0) {
				unit.movesLeft=0;
			}
		});
	}
	function attackPrimaryTarget(player) {
		var targetTerr = $scope.gameObj.territories[player.primaryTargetId-1];
		logComputer('attackPrimaryTarget '+targetTerr.name);
		console.log('attack primary!', targetTerr.name);
		var attackTerrId=0;
		var attackForce=0;
		targetTerr.land.forEach(function(terrId) {
			var terr = $scope.gameObj.territories[terrId-1];
			if(terr.owner==player.nation && terr.groundForce>targetTerr.defStrength) {
				if(terr.groundForce>attackForce) {
					attackForce=terr.groundForce;
					attackTerrId=terr.id;
				}
			}
		});
		if(attackTerrId>0) {
			var terr = $scope.gameObj.territories[attackTerrId-1];
			attackFromTerr(player, terr, targetTerr);
		}
	}
	function findABomberTarget(player, terr) {
		var target=findStratBombingTarget(player, terr);
		if(target) {
			var bombers=[];
			$scope.gameObj.units.forEach(function(unit) {
				if(unit.piece==7 && unit.movesLeft>0 && !unit.moving && unit.terr==terr.id && unit.owner==player.nation) {
					bombers.push(unit);
				}
			});
			if(bombers.length>0)
				moveUnitsToTerr(target, bombers, false, 'bomb');
		}
	}
	function findStratBombingTarget(player, terr) {
		var allyHash = getAllyHash(player, $scope.selectedTerritory);
		for(var x=0; x<$scope.gameObj.factories.length; x++) {
			var fac=$scope.gameObj.factories[x];
			if(fac.owner==0 || player.treaties[fac.owner-1]==0) {
				var t = $scope.gameObj.territories[fac.terr-1];
				var distObj = distanceBetweenTerrs(terr, t, 4, 0, 0, 0, allyHash, $scope.gameObj.territories);
				if(distObj.air<=3) {
					if(goodTargetToBomb(player, t))
						return t;
				}
			}
		}
	}
	function goodTargetToBomb(player, terr) {
		if(terr.incomingFlg || terr.facBombed || terr.factoryCount==0)
			return false;
		return true;
	}
	function findANukeTarget(player, terr) {
		var target=findTarget2SpacesAway(player, terr);
		if(target) {
			logComputer('launch nukes!!! '+terr.name+' to '+target.name);
			var nukes=[];
			$scope.gameObj.units.forEach(function(unit) {
				if(unit.piece==14 && unit.movesLeft>0 && !unit.moving && unit.terr==terr.id && unit.owner==player.nation) {
					nukes.push(unit);
				}
			});
			if(nukes.length>0)
				moveUnitsToTerr(target, nukes);
		}
	}
	function findTarget2SpacesAway(player, terr) {
		for(var x=0; x<terr.land.length; x++) {
			var id=terr.land[x];
			var terrOneSpace = $scope.gameObj.territories[id-1];
			for(var y=0; y<terrOneSpace.land.length; y++) {
				var id2=terrOneSpace.land[y];
				var terr2Space = $scope.gameObj.territories[id2-1];
				if(terr2Space.unitCount>4 && okToAttack(player, terr2Space, true))
					return terr2Space;
			}
		}
	}
	function getCompTarget(terr, player) {
		var borders = terr.borders.split('+');
		var possibleTarget;
		for(var x=0; x<borders.length; x++) {
			var toId = parseInt(borders[x]);
			var toTerr = $scope.gameObj.territories[toId-1];
			if(toTerr.defStrength<terr.groundForce && toTerr.nation<99 && toTerr.owner != player.nation && okToAttack(player, toTerr))
				return toTerr;
		}
	}
	function setLastRoundsOfPeaceAndWar(player) {
		$scope.gameObj.players.forEach(function(p) {
			var treaty = player.treaties[p.nation-1];
			if(treaty>=1)
				player.lastRoundsOfPeace[p.nation-1]=$scope.gameObj.round;
			else
				player.lastRoundsOfWar[p.nation-1]=$scope.gameObj.round;
		});
	}
	function computerGo() {
		if($scope.gameObj.gameOver)
			return;
		var player = $scope.currentPlayer;
		var player2 = $scope.gameObj.players[$scope.gameObj.turnId-1];
		if(player.nation != player2.nation) {
			console.log('what the?!?', player.nation, player2.nation);
			showAlertPopup('whoa!!',1);
			return;
		}
		if(!player.alive)
			return;
		if($scope.boardHasBeenUpdated) {
			showAlertPopup('CPU attempting to take turn. Please refresh game by existing and re-entering.',1);
			return;
		}
		console.log('----------->computerGo', player.nation, player.cpu);
		$scope.timerRunningFlg=false;
		$scope.cpuPlayerFlg=true;
		$scope.showMenuControls=false;
		$scope.cpuAction=player.status;
		cleanUpTerritories(player, true);
		if(player.status==gStatusPurchase) {
			compPlayerPurchase(player);
			logPurchases(player);
			applyChanges();
			if(player.alive) {
				setTimeout(function() { compPlayerAttack(player); }, 800);
				setTimeout(function() { computerMovePhase(player, 0); }, 4000);
			}
			else {
				endTurn(player);
			}
		} else if(player.status==gStatusAttack) {
			compPlayerAttack(player);
			setTimeout(function() { computerMovePhase(player, 0); }, 4000);
		} else 	if(player.status==gStatusMovement) {
			compMove(player);
		} else if(player.status==gStatusPlaceUnits) {
			computerPlacementPhase(player);
		}
	}
	function computerMovePhase(player, count) {
		if(gamePaused)
			return;
		
		if(player.amphibiuousFlg || (count++<6 && player.attackCount>0))
			console.log('whoa!! not done attacking!');
			
		compMove(player);
	}
	function compMove(player) {
		logComputer('>>>>compMove');
//		if(!player.cpu && $scope.gameObj.round>=5)
//			returnHeros(player);
		warAudio.pause();
		setTimeout(function() { computerPlacementPhase(player); }, 2000);
		if(player.status != gStatusAttack)
			return;
		player.status=gStatusMovement;
		$scope.cpuAction=gStatusMovement;
		if($scope.gameObj.allowPeace && !player.alliesMaxed && $scope.gameObj.round<6)
			checkDiplomacy(player);
		else if($scope.gameObj.allowAlliances && !player.alliesMaxed)
			checkDiplomacy(player);
			
		if(player.primaryTargetId>0) {
			advanceMainBaseNew(player, player.primaryTargetId);
			advanceUnitsToFront(player, player.primaryTargetId);
		} else {
			advanceMainBaseNew(player, player.secondaryTargetId);
			moveUnitsIntoHotSpot(player, player.hotSpotId);
			advanceUnitsToFront(player, player.secondaryTargetId);
		}
		spreadOutUnits(player);
	}
	function moveUnitsIntoHotSpot(player, targetId) {
		if(!targetId || targetId==0)
			return;
		var terr = $scope.gameObj.territories[targetId-1];
		if(terr.owner==player.nation) {
			terr.land.forEach(function(id) {
				var terr2=$scope.gameObj.territories[id-1];
				if(terr2.owner==player.nation && terr2.unitCount>1) {
					advanceUnitesFromTerr(terr2, terr);
				}
			});
		}
	}
	function checkDiplomacy(player) {
		var num=Math.floor((Math.random() * $scope.gameObj.players.length));
		
		if(!attemptDiplomacy(player, num++))
			if(!attemptDiplomacy(player, num++))
				if(!attemptDiplomacy(player, num++))
					if(!attemptDiplomacy(player, num++))
						attemptDiplomacy(player, num);
		
	}
	function attemptDiplomacy(player, num) {
		if(num>=$scope.gameObj.players.length)
			num-=$scope.gameObj.players.length;
		var player2=$scope.gameObj.players[num];
		if(player.nation==player2.nation)
			return false;
		var val = treatyStatus(player, player2.nation);
		if(val<=1 && player2.alive) {
			if(player.cpu && val==0 && $scope.gameObj.round<8 && player.preferedTeam != player2.preferedTeam)
				return false;
			var msg = 'Peace treaty offered to '+$scope.superpowers[player2.nation];
			popupMessage(player, msg, player2, true);
			logItem(player, 'Diplomacy', msg);
			player2.offers.push(player.nation);
			return true;
		}
		if(val==2 && $scope.gameObj.allowAlliances && player2.alive) {
			if(player.cpu && player2.alliesMaxed)
				return false;
			var msg = 'Alliance offered to '+$scope.superpowers[player2.nation];
			popupMessage(player, msg, player2, true);
			player2.offers.push(player.nation);
			logItem(player, 'Diplomacy', msg);
			return true;
		}
		return false;
	}
	function computerPlacementPhase(player) {
		logComputer('>>>>computerPlacementPhase');
		if(player.status != gStatusMovement && player.status != gStatusPlaceUnits)
			return;
		player.status=gStatusPlaceUnits;
		$scope.cpuAction=gStatusPlaceUnits;
		var numAddedUnitsToAdd=addUnitsToBoard(player.nation);
		setTimeout(function() { endTurn(player); }, 800+numAddedUnitsToAdd*100);
	}
	function addUnitsToBoard(nation) {
		var numAddedUnitsToAdd=0;
		var carrierFlg=false;
		var fighterWaterFlg=false;
		if(!$scope.gameObj.unitPurchases) {
			showAlertPopup('Error! no $scope.gameObj.unitPurchases contact admin',1);
			return;
		}
		var refreshHash = {};
		$scope.gameObj.unitPurchases.forEach(function(unit) {
			refreshHash[unit.terr]=1;
			numAddedUnitsToAdd++;
			if(unit.piece==8 || unit.piece==9 || unit.piece==12)
				carrierFlg=true;
			if(unit.piece==6 && unit.terr>=79)
				fighterWaterFlg=true;
			setTimeout(function() { createNewUnit(unit); }, numAddedUnitsToAdd*95);
		});
		setTimeout(function() { refreshTerrHash(refreshHash); }, 300+numAddedUnitsToAdd*95);
		$scope.gameObj.unitPurchases = [];
		if(carrierFlg)
			numAddedUnitsToAdd=-1;
		if(fighterWaterFlg)
			numAddedUnitsToAdd=-2;
		return numAddedUnitsToAdd;
	}
	function refreshTerrHash(refreshHash) {
		var keys = Object.keys(refreshHash);
		keys.forEach(function(terrId) {
			var t = $scope.gameObj.territories[terrId-1];
			refreshTerritory(t);
		});
	}
	function createNewUnit(unit, refreshflg) {
		var unitId = unit.piece;
		var terr = $scope.gameObj.territories[unit.terr-1];
		if(terr.owner != $scope.currentPlayer.nation && terr.id>=79)
			terr.owner=$scope.currentPlayer.nation;
			
		var piece = $scope.gUnits[unitId];
		if(!piece) {
			console.log("Whoa!!! no piece!!", unitId);
			return;
		}
		if(piece.type==3 && unit.terr<79) {
			terr = getWaterwayOfTerr(terr);
			refreshflg=true;
		}
		if(unitId==19 && terr.facBombed) {
			terr.facBombed=false;
			refreshTerritory(terr);
		} else
			annimateUnitOntoTerr(terr, unitId, false, refreshflg);
	}
	function okToMove(player, terr) {
		if(terr.owner==player.nation)
			return true;
		return (player.treaties[terr.owner-1]>=3)
	}
	function advanceMainBaseNew(player, primaryTargetId) {
		if(!primaryTargetId || primaryTargetId==0)
			return;
		if(!player.mainBase || player.mainBase.id==0)
			return;
		var target=$scope.gameObj.territories[primaryTargetId-1];
		var currentDist=landDistFromTerr(player.mainBase.id, primaryTargetId, 0);
		if(!player.mainBase || !player.mainBase.land || player.mainBase.land.length==0)
			return;
		player.mainBase.land.forEach(function(terrId) {
			var terr2=$scope.gameObj.territories[terrId-1];
			var d = landDistFromTerr(terrId, primaryTargetId, 0);
			if(terr2 && numberVal(terr2.defeatedByNation)==0 && !terr2.nuked) {
				var d = landDistFromTerr(terrId, primaryTargetId, 0);
				if(d>0 && d<currentDist) {
					var status = treatyStatus(player, terr2.owner);
					if(status>2) {
						currentDist=0;
						advanceUnitesFromTerr(player.mainBase, terr2);
					}
				}
			}
		});
	}
	function advanceUnitsToFront(player, primaryTargetId) {
		if(!primaryTargetId || primaryTargetId==0)
			return;
		player.territories.forEach(function(terr) {
			if(terr.unitCount>2 && terr.land && terr.land.length>0 && numberVal(terr.defeatedByNation)==0) {
				var dist=landDistFromTerr(terr.id, primaryTargetId, 0);
				terr.land.forEach(function(id) {
					var terr2=$scope.gameObj.territories[id-1];
					
					if(terr2 && numberVal(terr2.defeatedByNation)==0 && !terr2.nuked) {
						var d = landDistFromTerr(id, primaryTargetId, 0);
						if(d>0 && d<dist) {
							var status = treatyStatus(player, terr2.owner);
							if(status>2)
								advanceUnitesFromTerr(terr, terr2);
						}
					}
				});
			}
		});
	}
	function advanceUnitesFromTerr(terr1, terr2) {
//		if($scope.gameObj.round>4 && (terr1.leaderFlg || terr1.generalFlg) && terr1.groundForce<10)
//			return;
		var units = [];
		var infCount=0;
		var leftBehind=1;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==$scope.currentPlayer.nation && unit.mv>0 && unit.movesLeft>0 && !unit.moving && unit.terr==terr1.id) {
				if(unit.piece!=2 || infCount++>=leftBehind)
					units.push(unit);
			}
		});
		if(units.length>0)
			moveUnitsToTerr(terr2, units);
	}
	function checkMainBase(player, targetId) {
		if(!targetId || targetId==0)
			return;
		var units=[];
		var advanceUnits=false;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.mv>0 && unit.movesLeft>0 && !unit.moving && unit.terr==player.mainBaseID && unit.nation==player.nation) {
				units.push(unit);
			}
		});
		advanceMainBase(player, units, targetId);
	}
	function landDistFromTerr(terr1Id, terr2Id, dist) {
		if(terr1Id==0 || terr2Id==0) {
			console.log('Whoa!');
			return;
		}
		if(terr1Id==terr2Id)
			return dist;
		dist++;
		if(dist>=7)
			return 7;
		
		var terr=$scope.gameObj.territories[terr1Id-1];
		if(!terr)
			return;
		var min=9;
		if(!terr.land) {
			console.log('whoa!!! no land for ', terr);
			return min;
		}
		terr.land.forEach(function(id) {
			var d = landDistFromTerr(id, terr2Id, dist)
			if(d<min)
				min=d;
		});
		return min;
	}
	function advanceMainBase(player, units, targetId) {
		logComputer('    advanceMainBase: '+targetId);
		if(targetId==0 || targetId==player.mainBase.id)
			return;
		var moveToId=0;
		var moveToTerr;
		var dist=landDistFromTerr(player.mainBase.id, targetId, 0);
		player.mainBase.land.forEach(function(id) {
			var terr = $scope.gameObj.territories[id-1];
			if(terr.owner==player.nation) {
				var d = landDistFromTerr(id, targetId, 0);
				if(d<=dist) {
					dist=d;
					moveToId=id;
					moveToTerr=terr;
				}
			}
		});
		if(moveToId>0 && moveToTerr)
			moveUnitsToTerr(moveToTerr, units);
	}
	function spreadOutUnits(player) {
		player.territories.forEach(function(terr) {
			if(terr && terr.id && terr.id<79 && terr.groundForce>=4 && !terr.generalFlg && !terr.leaderFlg && numberVal(terr.defeatedByNation)==0) {
				var finalMoveToTerr;
				var lowestCount=99;
				for(var x=0; x<terr.land.length; x++) {
					var toId = terr.land[x];
					var toTerr = $scope.gameObj.territories[toId-1];
					if(toTerr.owner==player.nation && numberVal(toTerr.defeatedByNation)==0 && !toTerr.nuked) {
						if(toTerr.unitCount*2<terr.unitCount) {
							moveAFewUnitsFromTerrToTerr(terr, toTerr, player);
						}
					}
				}
			}
		});
	}
	function moveAFewUnitsFromTerrToTerr(terr, toTerr, player) {
		var units=[];
		var count=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==$scope.currentPlayer.nation && unit.mv>0 && unit.movesLeft>0 && unit.terr==terr.id && !unit.moving) {
				if(count++<2)
					unit.movesLeft=0;
				if(unit.movesLeft>0 && count<8)
					units.push(unit);
			}
		});
		if(units.length>0)
			moveUnitsToTerr(toTerr, units);
	}
	function advanceActionIfNeeded() {
		if(!$scope.actionAdvancing) {
			actionAdvanceCount=0;
			actionAdvances();
		}
	}
	function actionAdvances() {
		$scope.actionAdvancing=true;
		var maxProdClicks = 25;
		timeClicks++;
//		console.log('actionAdvances', actionAdvanceCount);
		if(actionAdvanceCount++<50 && $scope.gameObj.battles.length>0) {
			scanBattles();
			timeSecondsId = setTimeout(function() { actionAdvances(); }, gClickMilliseconds);
		} else {
			$scope.actionAdvancing=false;
		}
	}
	function scanBattles() {
		$scope.gameObj.battles.forEach(function(battle) {
			if(battle.active || $scope.fullRetreat)
				fightBattle(battle);
		});
	}
	function windowScrollBy(x, y) {
		window.scrollBy(x, y);
	}
	function shakeScreen() {
		windowScrollBy(10, 10);
		setTimeout(function() { windowScrollBy(-10, -10); }, 50);
		setTimeout(function() { windowScrollBy(10, 10); }, 100);
		setTimeout(function() { windowScrollBy(-10, -10); }, 150);
	}
	function landTheCruise(battle) {
		var attacker = playerOfNation(battle.attacker);
		var hits=0;
		var returnterrId=0;
		battle.units.forEach(function(unit) {
			hits+=unitAttacks(unit);
			if(unit.piece==39)
				hits+=unitAttacks(unit);
			if(attacker.tech[8] && unit.piece != 5)
				hits+=unitAttacks(unit);
			unit.moving=false;
			unit.cruiseRound=$scope.gameObj.round;
			returnterrId=unit.terr;
		});
		if(hits>0) {
			playCannon($scope.muteSound);
			shakeScreen();
		}
		if(returnterrId>0) {
			var t = $scope.gameObj.territories[returnterrId-1];
			t.owner=battle.attacker;
			refreshTerritory(t);
		}
		battle.units=[];
		var count=0;
		var medicCount=0;
		var infCount=0;
		if(attacker.tech[8]) { // target vehicles
			battle.defendingUnits.forEach(function(unit) {
				if(unit.def>0 && count<hits && (unit.subType=='vehicle')) {
					count++;
					deleteAnyUnit(unit, battle, battle.defCasualties);
				}
				if(unit.piece==28)
					medicCount++;
				if(unit.piece==2)
					infCount++;
			});
		}
		if(infCount<medicCount)
			medicCount=infCount;
		if(medicCount>0)
			hits-=medicCount;
		battle.defendingUnits.forEach(function(unit) {
			if(unit.piece==28 && medicCount-- > 0)
				unit.medicRound=$scope.gameObj.round;
			if(unit.def>0 && count<hits) {
				count++;
				deleteAnyUnit(unit, battle, battle.defCasualties);
			}
		});
		var terr = $scope.gameObj.territories[battle.terr-1];
		popupNationMessage(battle.attacker, 'Cruise Attack! Hits: '+count, terr.owner, terr.x, terr.y);
		var ft = 0;
		if(battle.units.length>0)
			ft=battle.units[0].terr;
		
		logItem(attacker, 'Cruise Attack!', terr.name+' missiled! '+battle.defCasualties.length+' casualties.', battle.battleDetails+'|'+battle.attCasualties.join('+')+'|'+battle.defCasualties.join('+')+'|', terr.id, terr.owner, ft, '', battle.defender);

		endBattle(battle, false);
	}
	function animateNukeOnTerr(terr, empFlg) {
		whiteoutScreen();
		if(empFlg) {
			playSound('grenade.mp3', 0, $scope.muteSound);
			playSound('shock.mp3', 0, $scope.muteSound);
			hits*=3;
		} else {
			playSound('bomb4.mp3', 0, $scope.muteSound);
		}
		var size=80;
		var offset=size/2;
		var sprite = getSprite(0, 80, terr.x-offset,terr.y+55);
		if(sprite) {
			sprite.frame=0;
			if(empFlg)
				annEMP(sprite);
			else
				annSprite(sprite);
		}
		setTimeout(function() {  shakeScreen(); }, 500);
	}
	function landTheNuke(battle, empFlg) {
		whiteoutScreen();
		var terr = $scope.gameObj.territories[battle.terr-1];
		var hits = 0;
		if(empFlg) {
			playSound('grenade.mp3', 0, $scope.muteSound);
			playSound('shock.mp3', 0, $scope.muteSound);
		} else {
			playSound('bomb4.mp3', 0, $scope.muteSound);
		}
		battle.units.forEach(function(unit) {
			if(unit.piece==14 || unit.piece==52) {
				var unitHits = nukeHitsForTerr(terr);
				if(unit.piece==52)
					unitHits*=3;
				hits+=unitHits;
				deleteAnyUnit(unit, battle, battle.attCasualties);
			}
		});
		var size=80;
		var offset=size/2;
		var sprite = getSprite(0, 80, terr.x-offset,terr.y+55);
		if(sprite) {
			sprite.frame=0;
			if(empFlg)
				annSprite(sprite);
			else
				annEMP(sprite);
		}
		setTimeout(function() {  shakeScreen(); }, 500);
		var count=0;
		console.log('nuke hits', hits);
		if(battle.terr>=79 && hits>0) {
			var defendingBCHP=0;
			var sbs=findDefendingSBS(battle.terr, battle.attacker);
			console.log('sbs', sbs);
			if(sbs && sbs.bcHp && sbs.bcHp>1) {
				defendingBCHP=sbs.bcHp-sbs.damage-1;
				if(defendingBCHP>0 && hits>0) {
					sbs.damage++;
					hits--;
					defendingBCHP--;
					console.log('sbs absorbed!');
				}
				if(defendingBCHP>0 && hits>0) { //second hit
					sbs.damage++;
					hits--;
					console.log('sbs absorbed!');
				}
			}
		}
		battle.defendingUnits.forEach(function(unit) {
			if(unit.def>0 && count<hits) {
				if(unit.subType != 'hero') {
					count++;
					deleteAnyUnit(unit, battle, battle.defCasualties);
				}
			}
		});
		var attacker = playerOfNation(battle.attacker);
		var title = (empFlg)?'EMP':'Nuke';
		popupNationMessage(battle.attacker, title+' Attack! Hits: '+count, terr.owner, terr.x, terr.y);
		var details=battle.battleDetails.split('|');
		var ft = 0;
		if(battle.units.length>0)
			ft=battle.units[0].terr;
		logItem(attacker, title+' Attack!', terr.name+' nuked! '+battle.defCasualties.length+' casualties.', details[0]+'||'+battle.attCasualties.join('+')+'|'+battle.defCasualties.join('+')+'|', terr.id, terr.owner, ft, '', battle.defender);
		if(terr.id<=79)
			terr.nuked=true;
		endBattle(battle, false);
	}
	function findDefendingSBS(terr, attNation) {
		var sbc;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.piece==12 && unit.owner!=attNation && unit.bcHp>1 && unit.damage<2 && unit.terr==terr)
				sbc=unit;
		});
		return sbc;
	}
	function annSprite(sprite) {
		sprite.frame++;
		var e = document.getElementById('sprite'+sprite.name);
		if(e) {
			e.src = 'graphics/anim/ex'+sprite.frame+'.png';
			e.style.display='block';
			$scope.$apply();
			if(sprite.frame<23)
				setTimeout(function() { annSprite(sprite) }, 100);
			else {
				sprite.move=0;
				sprite.active=false;
				e.style.display='none';
			}
		}
	}
	function annEMP(sprite) {
		sprite.frame++;
		var e = document.getElementById('sprite'+sprite.name);
		if(e) {
			e.src = 'graphics/anim/nuke'+sprite.frame+'.png';
			e.style.display='block';
			$scope.$apply();
			if(sprite.frame<18)
				setTimeout(function() { annEMP(sprite) }, 100);
			else {
				sprite.move=0;
				sprite.active=false;
				e.style.display='none';
			}
		}
	}
	function strategicBombing(battle) {
		var terr = $scope.gameObj.territories[battle.terr-1];
		terr.bombed=true;
		fadeInPopup('popupBombingBox', terr.x-100, terr.y-100);
		$scope.battle={};
		$scope.battle.medicHealedCount=0;
		$scope.battle.aaDice=[];
		$scope.battle.attDice=[];
		$scope.strategicBombingBattle={}
		$scope.strategicBombingBattle.aaDice=[];
		$scope.strategicBombingBattle.attDice=[];
		$scope.strategicBombingBattle.fighterDice=[];
		$scope.strategicBombingBattle.airShieldFlg=battle.airShieldFlg;
		$scope.strategicBombingBattle.radarFlg=battle.radarFlg;
		var losses = fireAAGuns(battle, true, $scope.strategicBombingBattle.aaDice);
		var totalLosses=losses;
		var hits=0;
		if(losses>0)
			playSound('Scream.mp3', 0, $scope.muteSound);
			
		battle.units.forEach(function(unit) {
			unit.usedInCombat=true;
			if(losses--<=0) {
				var bomberHits = unitAttacks(unit);
				$scope.strategicBombingBattle.attDice=$scope.battle.attDice;
				if(bomberHits>0) {
					if(terr.factoryCount>=2) {
						hits++;
						removeFactoryFromTerritory(terr);
						terr.factoryCount=1;
					} else if(!terr.facBombed) {
						hits++;
						terr.facBombed=true;
					}
				} else
					playSound('Swoosh.mp3', 0, $scope.muteSound);
			}
		});
		if(hits>0) {
			shakeScreen();
			playCannon($scope.muteSound);
		}
		var attacker = $scope.gameObj.players[$scope.gameObj.turnId-1];
		var msg = terr.name+' bombed! Bombers Sent: '+battle.units.length+', Shot down: '+totalLosses+', Factories destroyed: '+hits;
		popupNationMessage(battle.attacker, msg, terr.owner, terr.x, terr.y);
		var ft = 0;
		if(battle.units.length>0)
			ft=battle.units[0].terr;
		logItem(attacker, 'Strategic Bombing', msg, '', terr.id, terr.owner, ft, '', battle.defender);

		endBattle(battle, false);
		setTimeout(function() { popupMessageFadeOut('popupBombingBox'); }, 3000);	
		setTimeout(function() { popupMessageOff('popupBombingBox'); }, 4000);	
	}
	function removeFactoryFromTerritory(terr) {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id && unit.piece==19) {
				unit.hp=0;
				deleteItem($scope.gameObj.units, unit.id);
			}
			
		});
	}
	function fireAAGuns(battle, stratBombFlg, dice) {
		dice=[];
		
		$scope.battle.fighterDice=[];
		var hits=0;
		var terr = $scope.gameObj.territories[battle.terr-1];
		var adCount=terr.adCount;
		var fighterHits=0;
		$scope.aaDice=[];
		if(terr.owner>0 && stratBombFlg) {
			if(!$scope.strategicBombingBattle)
				$scope.strategicBombingBattle={};
			
			$scope.strategicBombingBattle.fighterDice=[];
				
			var defender = playerOfNation(terr.owner);
			if(defender.tech[2])
				$scope.strategicBombingBattle.radarFlg=true;
			if(defender.tech[16])
				$scope.strategicBombingBattle.airShieldFlg=true;
			if(defender.tech[2]) {
				battle.defendingUnits.forEach(function(unit) {
					if(unit.subType=='fighter') {
						var hit = rollTheDice($scope.strategicBombingBattle.fighterDice, unit.def);
						console.log('fighter defends!', hit);
						if(hit>0) {
							fighterHits++;
						}
					}
						
				});
			}
		}
		if(adCount==0 && fighterHits==0)
			return 0;
		
		var adCount=terr.adCount;
		battle.units.forEach(function(unit) {
			if((unit.type==2 || unit.type==4) && unit.hp>0) {
				adCount=terr.adCount;
				if(adCount>unit.adLimit)
					adCount=unit.adLimit;
				if(terr.battleshipAACount>0) {
					adCount=terr.battleshipAACount;
				}
				if(adCount>2)
					adCount=2;
				if(fighterHits-- > 0) {
					unit.cargo=[];
					deleteAnyUnit(unit, battle, battle.attCasualties);
					hits++;
				} else {
					for(var x=0; x<adCount; x++) {
						var hit = rollTheDice(dice, 1);
						$scope.aaDice.push({id: x, dice: dice[dice.length-1]});
						if(stratBombFlg && $scope.strategicBombingBattle && $scope.strategicBombingBattle.aaDice)
							$scope.strategicBombingBattle.aaDice.push({id: x, dice: dice[dice.length-1]});
							
						if(hit>0) {
							unit.cargo=[];
							deleteAnyUnit(unit, battle, battle.attCasualties);
							hits++;
						}
					}
				}
			}
		});
		if($scope.displayBattle && $scope.displayBattle.airDefenseUnits && $scope.displayBattle.airDefenseUnits.length>=$scope.aaDice.length) {
			var x=0;
			$scope.displayBattle.airDefenseUnits.forEach(function(unit) {
				if(unit.piece==13 && unit.diceFinal)
					unit.diceFinal.push(diceOfType($scope.aaDice[x++], x));
			});
		}
		$scope.aaHits=hits;
		return hits;
	}
	function diceOfType(type, num) {
		if(type && type.dice && type.dice.length>0)
			return {id: num, dice: type.dice, diceImg: type.dice};
		else {
			return {id: num, dice: 'dice6.png', diceImg: 'dice6.png'};
		}
	}
	function deleteAnyUnit(unit, battle, casList) {
//		console.log('deleteAnyUnit', unit);
		if(unit.cargo && unit.cargo.length>0)
			deleteCargo(unit, battle, casList, unit.terr);
		casList.push(unit.piece);
		unit.hp=0;
		unit.dead=true;
		if(unit.piece==10)
			logItem($scope.currentPlayer, 'Hero Killed', $scope.superpowers[unit.owner]+' General killed!');
		if(unit.piece==11)
			logItem($scope.currentPlayer, 'Hero Killed', $scope.superpowers[unit.owner]+' Leader killed!');
		deleteItem($scope.gameObj.units, unit.id);
	}
	function deleteCargo(unit, battle, casList, terr) {
		unit.cargo.forEach(function(unit) {
//			console.log('unit.cargo', unit.piece, unit.hp, unit.terr, terr);
//			if(unit.hp>0 && unit.terr==terr)
				deleteAnyUnit(unit, battle, [])
		});
	}
	function payFineForAttack(status) {
		var fine=status*5;
		logItem($scope.currentPlayer, 'War Fine', fine+' coin penalty paid for attack.');
		$scope.currentPlayer.money-=fine;
		
	}
	function fightBattle(battle) {
		$scope.retreatHash={}
		logAttackSequence(2);
		if(!battle.type) {
			battle.type='attack';
		}
		$scope.battleOver=false;
		if(!battle.warFlg || !battle.type) {
			endBattle(battle, true); // not a battle
			return;
		}
		var terr = $scope.gameObj.territories[battle.terr-1];
		$scope.nationOwner=terr.owner;
		var status = 0;
		if($scope.currentPlayer && $scope.currentPlayer.treatiesAtStart && terr.owner>0)
			status = $scope.currentPlayer.treatiesAtStart[terr.owner-1];
		if(status>0) {
			var p2=playerOfNation(terr.owner);
			if(p2.nation != $scope.currentPlayer.nation && $scope.currentPlayer.treatiesAtStart) {
				$scope.currentPlayer.treatiesAtStart[terr.owner-1]=0;
				payFineForAttack(status);
				if(p2)
					changeTreaty($scope.currentPlayer, p2, 0);
			}
		}
		if(battle.nukeFlg) {
			landTheNuke(battle, false);
			return;
		}
		if(battle.empFlg) {
			landTheNuke(battle, true);
			return;
		}
		if(battle.cruiseFlg) {
			landTheCruise(battle);
			return;
		}
		if(battle.type=='bomb') {
			strategicBombing(battle);
			return;
		}
		battle.destroyerCount=terr.destroyerCount;
		if($scope.fullRetreat) {
			soundsForBattleEnd(false);
			wrapUpBattle(battle, terr, false, 'fighting', ' Attacker retreated.');
			endBattle(battle, false);
			return;
		}
		logAttackSequence(3);
		battle.round++;
		var adHits = fireAAGuns(battle, false, $scope.battle.aaDice);
		// return; not back
		specialtyUnitsFire(battle); //hijacker, mef general, jap general
		//return; //back!!
		var hits=attackerFires(battle);
//		var retreatHash={};
		var medicCount=0;
		var airUnits=0;
		var groundUnits=0;
		var attackBCHP=0;
		var sealsBattleFlg=false;
		if(battle.round==1) { // remove artillery
			var units=[];
			var terrHash={};
			battle.units.forEach(function(unit) {
				if(unit.piece==44)
					sealsBattleFlg=true;
				if(unit.type==3)
					unit.cruiseRound=$scope.gameObj.round;
				unit.movesLeft=0;
				if(unit.piece==12)
					attackBCHP+=unit.bcHp-unit.damage-1;
				if(unit.cargoOf && unit.cargoOf>0 && battle.terr<79) {
					removeUnitFromCargo(unit);
				}
				if(unit.piece==23 || unit.piece==25 || unit.piece==42) { //consumables
					deleteAnyUnit(unit, battle, battle.attCasualties);
				}
				if(unit.piece==43 || (unit.returnFlg && unit.type==1)) {
					unit.retreated=true;
					$scope.retreatHash[unit.terr]=1;
				} else if(unit.retreated) 
					medicCount++;
				else {
					if(unit.type==1 || unit.type==4)
						groundUnits++;
					if(unit.type==2) {
						unit.usedInCombat=true;
						airUnits++;
					}
					
					units.push(unit);
				}
			});
			battle.units=units;
		}
		if(sealsBattleFlg) {
			var defObj = cleanupDefendingCasualties(battle);
			console.log('sealsBattleFlg', defObj);
			wrapUpBattle(battle, terr, false, 'fighting', '');
			return;
			
		}
//		console.log('ct!!', groundUnits, airUnits, units);
		if(groundUnits>0 && airUnits>0)
			reorderUnits(battle);
		logAttackSequence(4);
		
		
		var defHits = defenderFires(battle, attackBCHP);
		var attObj = attackerCasualties(battle, defHits);
		var defObj = cleanupDefendingCasualties(battle);
		
		
		if(1) { //clean up medics
			units=[];
			battle.units.forEach(function(unit) {
				 if(!unit.retreated)
					units.push(unit);
			});
			battle.units=units;
		}

		
		logAttackSequence(5);
		if(!$scope.cpuPlayerFlg) {
			battle.active=false;
//			setUpAttackBoard(battle.units, battle.defendingUnits);
			$scope.battle.attHits=hits.toString()+' hits';
			$scope.battle.defHits=defHits.toString()+' hits';
		}

		if(attObj.attackers==0) {
			wrapUpBattle(battle, terr, false, 'fighting', ' Attacker Defeated.');
			return;
		}
		if(defObj.alive<=0 && attObj.attackers>0 && attObj.groundAttackers==0 && terr.id<79) {
			wrapUpBattle(battle, terr, false, 'attacking', ' No ground units to secure.');
			return;
		}
		if(defObj.alive<=0) {
			wrapUpBattle(battle, terr, true, 'defeating', '');
			return;
		}
		$scope.subsDove=false;
		if(defObj.subsAlive>0 && defObj.subsAlive==defObj.alive && attObj.airAttackers==attObj.attackers) {
			$scope.subsDove=true;
			wrapUpBattle(battle, terr, false, 'fighting', ' Remaining subs dove to avoid attacks.');
			return;
		}
		var liveDefenders=0;
		battle.defendingUnits.forEach(function(unit) {
			 if(unit.hp>0)
				liveDefenders++;
		});
		if(liveDefenders==0) {
			showAlertPopup('something wrong!');
			wrapUpBattle(battle, terr, true, 'defeating', '');
			return;
		}
		if($scope.selectedTerritory && $scope.selectedTerritory.id == battle.terr && !$scope.currentPlayer.cpu) {
			if(!$scope.autoAttacknum)
				$scope.autoAttacknum=0;
			$scope.autoAttacknum++;
			if($scope.finalCheckboxMessage && $scope.autoAttacknum<20) {
				fightButtonPressed2();
			} else {
				displayTerrPopup('territoryPopup', $scope.selectedTerritory);
				applyChanges();
			}
		}

		logAttackSequence(6);
	}
	$scope.viewBattleButtonPressed=function() {
		playClick($scope.muteSound);
		$scope.viewBattleButton=false;
		$scope.selectedTerritory=$scope.battleTerritory;
		displayTerrPopup('territoryPopup', $scope.selectedTerritory);
	}
	function reorderUnits(battle) {
		var units=battle.units;
		if(units.length>1) {
			var unit1 = battle.units[0];
			var unit2 = battle.units[battle.units.length-1];
			if(unit2.type==2 && isLandUnit(unit1)) {
				var newUnits=[];
				var c =0;
				var lastGroundUnit = units[0];
				units.forEach(function(unit) {
					c++;
					var nextUnit = unit;
					if(units.length>c)
						nextUnit=units[c];
					if(isLandUnit(unit) && nextUnit.type==2)
						lastGroundUnit=unit;
					else
						newUnits.push(unit);
				});
				newUnits.push(lastGroundUnit);
				battle.units = newUnits;
			}
		}
	}
	function isLandUnit(unit) {
		return (unit.type==1 || unit.type==4);
	}
	function removeUnitFromCargo(unit) {
		var transport = findUnitOfId(unit.cargoOf);
		if(transport) {
			var cargo=[];
			if(transport.piece==4)
				transport.movesLeft=0;
			transport.cargo.forEach(function(cargoUnit) {
				if(cargoUnit.id != unit.id)
					cargo.push(cargoUnit);
			});
			transport.cargo=cargo;
		}
		if(unit.piece==10)
			$scope.currentPlayer.generalIsCargo=true;
		unit.cargoOf=0;
	}
	function findUnitOfId(id) {
		for(var x=0; x<$scope.gameObj.units.length; x++) {
				
			var unit=$scope.gameObj.units[x];
			if(unit.id==id)
				return unit;
		}
	}
	function wrapUpBattle(battle, terr, wonFlg, word, endPhrase) {
		if($scope.ableToTakeThisTurn)
			$scope.viewBattleButton=true;
		$scope.battleTerritory=terr;
		logAttackSequence(7);
		$scope.wonFlg=wonFlg;
		$scope.battleOver=true;
		if(terr.nuked)
			terr.nuked=false;
		var hits=battle.defCasualties.length;
		var losses=battle.attCasualties.length;
		var unit1 = (losses==1)?'unit':'units';
		var unit2 = (hits==1)?'unit':'units';
		var msg = losses+' '+unit1+' lost '+word+' '+$scope.superpowers[battle.defender]+' at '+terr.name+'. Enemy lost '+hits+' '+unit2+'.'+endPhrase;
		var attacker = playerOfNation(battle.attacker);

		popupNationMessage(battle.attacker, msg, terr.owner, terr.x, terr.y);
		$scope.attCasualties=addUnitsToList(battle.attCasualties);
		$scope.defCasualties=addUnitsToList(battle.defCasualties);
		if($scope.selectedTerritory) {
			if(wonFlg)
				$scope.selectedTerritory.leaderMessage = randomDefeatedMessage();
			else
				$scope.selectedTerritory.leaderMessage = "Ha! I warned you!";
		}
		logAttackSequence(8);

		$scope.battle=battle;
		if(wonFlg) {
			var attacker = playerOfNation(battle.attacker);
			var o = attackerOrAlly(attacker, terr);
			transferControlOfTerr(terr, o, battle);
		}
		var ft = 0;
		if(battle.units.length>0)
			ft=battle.units[0].terr;
		logItem(attacker, 'Battle', msg, battle.battleDetails+'|'+battle.attCasualties.join('+')+'|'+battle.defCasualties.join('+')+'|'+$scope.battle.medicHealedCount+'|'+battle.round, terr.id, terr.owner, ft, '', battle.defender);
		$scope.battleHasEnded=true;
		endBattle(battle, wonFlg);
	}
	function randomDefeatedMessage() {
		var msg = [
		'This act of war will be punished!',
		'You have not heard the last from me!',
		'We will avenge this atrocity!',
		'You just messed with the wrong nation!',
		'Surrender and I will forgive this mistake of yours!',
		'That\'s it. Now you really pissed me off!',
		'What the?! Ok, now it\'s on!',
		'You are going to be very, very sorry for this mistake!',
		]
		var num=Math.floor((Math.random() * msg.length));
		return msg[num];
	}
	function addUnitsToList(items) {
		var finalList=[];
		var x=1;
		items.forEach(function(item) {
			finalList.push({id: x++, piece: item});
		});
		return finalList;
	}
	function getKdForPlayer(player) {
		if(player.losses>0)
			return (player.kills/player.losses).toFixed(1);
		else
			return 0;
	}
	function removeItemsFromList(list1, itemId) {
		var t = [];
		list1.forEach(function(item) {
			if(item.id != itemId)
				t.push(item);
		});
		return t;
	}
	function playerOfNation(nation) {
		for(var x=0; x<$scope.gameObj.players.length; x++) {
			var player = $scope.gameObj.players[x];
			if(player.nation==nation)
				return player;
		}
	}
	function attackerOrAlly(attacker, terr) {
		if(terr.nation==0 || terr.nation==99)
			return attacker.nation;
		if(attacker.treaties[terr.nation-1]==3) {
			var p = playerOfNation(terr.nation);
			if(p.alive)
				return terr.nation;
			else
				return attacker.nation;
		} else
			return attacker.nation;
	}
	$scope.withdrawGeneralButtonClicked=function(flag) {
		playClick($scope.muteSound);
		closePopup('generalWithdrawPopup');
		$scope.closeTerrPopup();
		if(flag) {
			var units = [];
			for(var x=0; x<$scope.gameObj.units.length; x++) {
				var unit = $scope.gameObj.units[x];
				if(unit.piece==10 && unit.owner==$scope.currentPlayer.nation) {
					units.push(unit);
					if(unit.prevTerr && unit.prevTerr>0) {
						var terr=$scope.gameObj.territories[unit.prevTerr-1];
						if(terr && terr.nation<99) {
							moveUnitsToTerr(terr, units);
							setTimeout(function() { saveGame($scope.gameObj, $scope.user, $scope.currentPlayer); }, 3500);
						}
					}
				}
			}
		}
	}
	function returnHeros(player) {
		console.log('returnHeros');
		var units = [];
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var unit = $scope.gameObj.units[x];
			if(unit.nation==player.nation && (unit.piece==10 || unit.piece==11)) {
				units.push(unit);
				var terr=$scope.gameObj.territories[unit.prevTerr-1];
				if(terr.nation<99 && terr.groundForce>2)
					moveUnitsToTerr(terr, units);
			}
		}
	}
	function endBattle(battle, won) {
		$scope.currentBattleTerrId=0;
		if(!battle) {
			showAlertPopup('no battle!',1);
			console.log('what the?!? xxx battle: ', battle);
			return;
		}
		logAttackSequence(10);
		var delay=1200;
		if(battle.attacker==$scope.gameObj.currentNation)
			warAudio.pause();
		var terr = $scope.gameObj.territories[battle.terr-1];
		terr.holdFlg=false;
		terr.incomingFlg=false;
		var attacker = playerOfNation(battle.attacker);
		var defender = playerOfNation(battle.defender);
		
		if($scope.retreatHash) {
			var keys = Object.keys($scope.retreatHash);
				for(x=0;x<keys.length;x++) {
					var terrId = keys[x];
					var t = $scope.gameObj.territories[terrId-1];
					refreshTerritoryLite(t);
				}
		}
		
		logAttackSequence(11);
		
		
		var lastAttackedRound=terr.attackedRound;
		if(battle.warFlg) {
			attacker.attackCount--;
			if(battle.type!='bomb') {
				terr.attackedByNation=battle.attacker;
				terr.attackedRound=$scope.gameObj.round;
			}
			if(battle.attacker>0) {
				attacker.kills+=battle.defCasualties.length;
				attacker.losses+=battle.attCasualties.length;
				attacker.kd = getKdForPlayer(attacker);
			}
			if(battle.defender>0) {
				defender.kills+=battle.attCasualties.length;
				defender.losses+=battle.defCasualties.length;
				defender.kd = getKdForPlayer(defender);
			}
		}
		if(won) { // move to open space or battle won
			if(attacker.primaryTargetId==terr.id)
				attacker.primaryTargetId=0;
			if(battle.warFlg) {
				terr.defeatedByNation = battle.attacker;
				if(attacker && attacker.territories && attacker.territories.length>0)
					attacker.territories.push(terr);
				attacker.targetId = 0;
				if(defender && defender.territories && terr.owner>0 && terr.owner!=battle.attacker) {
					defender.territories = removeItemsFromList(defender.territories, terr.id);
				}
				var newOwner = attackerOrAlly(attacker, terr);
				if(battle.neutralFlg) {
					if(terr.capital) {
						setTimeout(function() { annimateUnitOntoTerr(terr, 15, false, true); }, 4020);
						delay=4500;
						$scope.longPause=true;
						$scope.bonusUnits=1;
						var fac = {id: terr.id, terr: terr.id, owner: newOwner, x: terr.x, y: terr.y, prodUnit: 0, prodCounter: 0, prodQueue: []};
						$scope.gameObj.factories.push(fac);
					} else {
						$scope.bonusUnits=3;
						setTimeout(function() { annimateUnitOntoTerr(terr, 2); }, 4020);
						setTimeout(function() { annimateUnitOntoTerr(terr, 2); }, 4500);
						setTimeout(function() { annimateUnitOntoTerr(terr, 3, false, true); }, 5000);
						$scope.longPause=true;
						delay=5500;
					}
				}
				if($scope.gameObj.round==6 && !battle.neutralFlg && terr.nation<99 && lastAttackedRound!=$scope.gameObj.round) {
					attacker.attackFlg=true;
					defender.defenseFlg=true;
					
					var def = playerOfNation(battle.defender); // just for testing
					if(def.nation != defender.nation)
						showAlertPopup('whoa, wrong defender.');
//					def.defenseFlg=true;
//					if(battle.defendingUnits.length>0) {
//						var unit = battle.defendingUnits[0];
//						var def = playerOfNation(unit.owner);
//						def.defenseFlg=true;
//					}
				}

				terr.owner = attackerOrAlly(attacker, terr);
				terr.defeatedByRound=$scope.gameObj.round;

				battle.defendingUnits.forEach(function(unit) {
					unit.nation=terr.owner;
					unit.owner=terr.owner;
					unit.movesLeft=0;
				});
				transferControlOfTerr(terr, terr.owner, battle);
				

				$scope.showGeneralWithdrawForm = (!$scope.cpuPlayerFlg && battle.generalFlg && terr.nation<99 && !attacker.generalIsCargo);
				if($scope.showGeneralWithdrawForm && $scope.hideAttackBoard)
					displayFixedPopup('generalWithdrawPopup');
				$scope.currentPlayer.generalCanRetreat=$scope.showGeneralWithdrawForm;
			}
			if(terr.nation==99) // water
				terr.owner = attacker.nation;
		} else {
			if(terr.owner>0 && battle.defCasualties.length >= battle.defCount) {
				terr.attackedByNation=battle.attacker;
				terr.attackedRound=$scope.gameObj.round;
			}
		}
		logAttackSequence(12);
		var returningUnits = [];
		var returnTerr;
		var mainBase=false;
		var unitsReturningToreturningId=false;
		if(!battle || !battle.units) {
			console.log('what the?!? battle: ', battle);
			return;
		}
		var returnHash={}
		battle.units.forEach(function(unit) {
			if(unit.cargoOf>0 && terr.id>=79) {
				unit.terr=battle.terr; //fighters follow carriers
			}
			if(unit.cargoOf && unit.cargoOf>0 && terr.id<79) {
				removeUnitFromCargo(unit);
			}
			unit.moving = false;
			if(unit.piece==10 || unit.piece==11)
				mainBase=true;
			if(!battle.warFlg && battle.terr>=79 && unit.subType=='fighter') {
				loadFighterOntoCarrier(unit, terr);
			}
			if(!battle.warFlg && battle.terr>=79 && unit.type==1 && numberVal(unit.cargoOf)==0) {
				loadUnitOntoTransport(unit, terr);
			}
			if(!battle.warFlg || (!unit.returnFlg && !$scope.fullRetreat))
				unit.terr = terr.id; // stay here!!
				
			if(battle.warFlg && unit.hp>0) {
				if(unit.returnFlg || $scope.fullRetreat) {
					returnHash[unit.terr]=1;
					returnHash[unit.prevTerr]=1;
					if(unit.terr==battle.terr) {
//						console.log('destroying unit!', unit);
//						unit.hp=0;
//						unit.dead=true;
					} else {
						if(unit.subType=='fighter' && battle.terr>=79 && unit.cargoOf>0) {
							var carrier = unitWithId(unit.cargoOf);
							unit.terr=carrier.terr;
							console.log('fighter goes to carrier!');
						} else {
							
//							returnTerr = $scope.gameObj.territories[unit.terr-1];
//							refreshTerritory(returnTerr);
	
						}
					}
				}
			}
				
		});
		var k = Object.keys(returnHash);
		k.forEach(function(t) {
			var returnTerr = $scope.gameObj.territories[t-1];
			refreshTerritoryLite(returnTerr);
		});
		if(mainBase && won)
			attacker.mainBase=terr;
		if(returningUnits.length>0 && returnTerr.nation<99) {
			$scope.fullRetreat=false;
		}
		terr.battleId = 0;
		logAttackSequence(13);
		
		refreshTerritory(terr);
		if($scope.gameObj.hardFog=='Y')
			illuminateThisTerritory(terr);
		if(terr.id==battle.terr && $scope.selectedTerritory && $scope.selectedTerritory.id==terr.id) {
			$scope.selectedTerritory.units=unitsForTerr(terr);
			$scope.militaryUnits = militaryUnitsFromLine($scope.selectedTerritory.units, $scope.gUnits);
		}
		addIncomeForPlayer(defender);
		addIncomeForPlayer(attacker);
//		setTimeout(function() { cleanupBattle($scope.battle.terr); }, 3000);
		battle.active=false;
		deleteItem($scope.gameObj.battles, battle.id);
		$scope.battle={};
		if(battle.warFlg && !$scope.adminMode && !$scope.cpuPlayerFlg) {
			$scope.waitForSaveFlg=true;
			setTimeout(function() { 
				saveGame($scope.gameObj, $scope.user, $scope.currentPlayer); 
				$scope.waitForSaveFlg=false;
			}, 5000);
		}
		if(!$scope.longPause || delay>2000)
			disableCompleteButtonsFor1Sec(delay);
		setTimeout(function() { applyChanges();}, 10);
		if($scope.user.rank==0) {
			var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
			if(practiceMode) {
				var flg = showPracticeMoveInfo(numberVal(localStorage.practiceStep), numberVal($scope.practiceClick), terr.id, $scope.gTerritories);
				if(flg)
					$scope.practiceClick++;
				return;
			}
			var russia = $scope.gameObj.territories[12].owner;
			var indoChina = $scope.gameObj.territories[27].owner;
			var japan = $scope.gameObj.territories[20].owner;
			if(japan==2 || (russia==2 && indoChina==2))
				gameOver($scope.currentPlayer, [$scope.superpowers[2]], true);
			if(russia==4 && indoChina==4)
				singlePlayerGameLost();
		}
		logAttackSequence(14);
		
	}
	function scrollToBottom() {
		var bottom=450;
		var e = document.getElementById('generalWithdrawButton');
		if(e) {
			var elemRect = e.getBoundingClientRect();
			if(elemRect.top>bottom)
				bottom=elemRect.top;
		}
		var e = document.getElementById('okBattleEndButton');
		if(e) {
			var elemRect = e.getBoundingClientRect();
			if(elemRect.top>bottom)
				bottom=elemRect.top;
		}
		var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
		console.log('scroll...', bottom, height);
		if(bottom>height)
			window.scrollTo(window.pageXOffset, bottom);
	}
	function unitWithId(unitId) {
		var carrier='';
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.id==unitId)
				carrier=unit;
		});
		return carrier;
	}
	function loadFighterOntoCarrier(fighter, terr) {
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var unit=$scope.gameObj.units[x];
			if(unit.owner==fighter.owner && unit.terr==terr.id && unit.piece==8) {
				doubleCheckCargoUnits(unit);
				if(unit.cargoSpace-unit.cargoUnits>=20) {
					unit.cargoUnits+=fighter.cargoUnits;
					fighter.cargoOf = unit.id;
					if(!unit.cargo)
						unit.cargo=[];
					unit.cargo.push({id: fighter.id, piece: fighter.piece, cargoUnits: fighter.cargoUnits});
					return;
				}
			}
		}
//		showAlertPopup('No carrier found for fighter!');
	}
	function loadUnitOntoTransport(unit, terr) {
//		console.log('loadUnitOntoTransport!', $scope.optionType);
		if(terr.unitCount>2 && (unit.piece==13 || unit.subType=='hero')) {
			var bestShip=null;
			var maxDef=0;
			for(var x=0; x<$scope.gameObj.units.length; x++) {
				var transport=$scope.gameObj.units[x];
				if(transport.owner==unit.owner && transport.terr==terr.id && transport.type==3) {
					doubleCheckCargoUnits(transport);
					if(transport.cargoSpace>=transport.cargoUnits+unit.cargoUnits) {
						if(!bestShip) {
							bestShip=transport;
							maxDef=transport.def;
						} else {
							if(transport.def>maxDef) {
								bestShip=transport;
								maxDef=transport.def;
							}
						}
					}
				}
			}
			if(maxDef>0 && bestShip) {
				loadThisUnitOntoThisTransport(unit, bestShip);
				return;
			}
		}
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var transport=$scope.gameObj.units[x];
			if(transport.owner==unit.owner && transport.terr==terr.id && (transport.piece==4 || transport.piece==49 || transport.piece==45)) {
				doubleCheckCargoUnits(transport);
				if(transport.cargoSpace>=transport.cargoUnits+unit.cargoUnits) {
					loadThisUnitOntoThisTransport(unit, transport);
					return;
				}
			}
		}
		showAlertPopup('No transport found for unit!',1);
	}
	function loadUnitOntoBomber(unit, terr) {
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var transport=$scope.gameObj.units[x];
			if(transport.owner==unit.owner && transport.terr==terr.id && transport.movesLeft>0 && (transport.piece==7 || transport.piece==50)) {
				if(($scope.cobraFlg && transport.piece==50) || (!$scope.cobraFlg && transport.piece==7)) {
					console.log('bomber found!', transport);
					doubleCheckCargoUnits(transport);
					if(transport.cargoSpace>=transport.cargoUnits+unit.cargoUnits) {
						loadThisUnitOntoThisTransport(unit, transport);
						return;
					}
				}
			}
		}
		console.log('No bomber found for unit!');
//		showAlertPopup('No bomber found for unit!');
	}
	function loadThisUnitOntoThisTransport(unit, transport) {
//		console.log('loadThisUnitOntoThisTransport', transport.cargoLoadedThisTurn, transport.cargoSpace);
		if(unit.cargoOf && unit.cargoOf>0) {
			showAlertPopup('already cargo of!');
			return;
		}
		if(!transport.cargoLoadedThisTurn)
			transport.cargoLoadedThisTurn=0;
		if(transport.cargoLoadedThisTurn+unit.cargoUnits>transport.cargoSpace*2) {
			showAlertPopup('this transport has been maxed out for this turn.', 1);
			unit.terr=unit.prevTerr;
			return;
		}
		transport.cargoUnitsThisTurn+=unit.cargoUnits;
		transport.cargoUnits+=unit.cargoUnits;
		transport.cargoLoadedThisTurn+=unit.cargoUnits;
		unit.cargoOf = transport.id;
		if(!transport.cargo)
			transport.cargo=[];
		transport.cargo.push({id: unit.id, piece: unit.piece, cargoUnits: unit.cargoUnits});
		console.log('transport.cargo', transport.cargo);
	}
	function cleanupBattle(terr) {
		if(terr>0 && $scope.battle && $scope.battle.terr==terr)
			$scope.battle={};
//		if(warFlg && !$scope.cpuPlayerFlg)
//			closeThePopup(true);
	}
	function applyChanges() {
		try { $scope.$apply(); }
		catch(e) { console.log('applyChanges!!'); }
	}
	function changeFactoryToPlayer(nation, terrId) {
		$scope.gameObj.factories.forEach(function(fac) {
			if(fac.terr == terrId && fac.owner!=nation) {
				fac.prodUnit=0;
				fac.prodCounter=0;
				fac.prodQueue=[];
				fac.owner=nation;
				fac.hold=false;
			}
		});
	}
	function addIncomeForPlayer(player) {
		if(!player || player.nation==0)
			return;
		var terrHash = {};
		var income = 0;
		var caps=0;
		var bombedCount=0;
		var economicCount=0;
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.owner==player.nation) {
				terr.holdFlg=false;
				terr.incomingFlg=false;
				if(terr.capital && terr.nation<99) {
					income+=10;
					caps++;
				}
				if(terr.factoryCount>1) {
					economicCount++;
					income+=5;
				}
				if(terr.factoryCount==-1 || terr.facBombed) {
					bombedCount++;
					income-=5;
				}
				if(terr.nation<99) {
					if(terrHash[terr.nation])
						terrHash[terr.nation]++
					else
						terrHash[terr.nation]=1;
				}
			}
		});
		if(player.leaderFlg)
			income+=10;
		var spIncome = 0;
		var k = Object.keys(terrHash);
		k.forEach(function(nation) {
			var count = terrHash[nation];
			if(nation==1 && count>5)
				spIncome+=10;
			if(nation==2 && count>5)
				spIncome+=10;
			if(nation==3 && count>7)
				spIncome+=10;
			if(nation==4 && count>6)
				spIncome+=10;
			if(nation==5 && count>6)
				spIncome+=10;
			if(nation==6 && count>6)
				spIncome+=10;
			if(nation==7 && count>7)
				spIncome+=10;
			if(nation==8 && count>5)
				spIncome+=10;
		});
		income+=spIncome;
		player.sp = spIncome/10;
		player.cap = caps;
		var techCount=0;
		if(player.tech[9])
			techCount++;
		if(player.tech[10])
			techCount++;
		if(player.tech[11])
			techCount++;
		income+=5*techCount;
		player.techCount=techCount;
		player.bombedCount=bombedCount;
		player.economicCount=economicCount;
		player.income=income;
		var units=0;
		player.nukes=false;
		player.sat=player.tech[18];
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==player.nation && unit.mv>0 && unit.hp>0) {
				if(unit.piece==14)
					player.nukes=true;
				units++;
			}
		});
		player.units=units;
	}
	function deleteItem(itemList, itemId) {
		for(var x=0; x<itemList.length; x++)
			if(itemList[x].id==itemId) {
				itemList.splice(x, 1);
				return;
			}
	}
	function getItem(itemList, itemId) {
		for(var x=0; x<itemList.length; x++)
			if(itemList[x].id==itemId) {
				return itemList[x];
			}
	}
	function isUnitAirDefense(unit) {
		return (unit.piece==13 || unit.piece==37 || unit.piece==39 || unit.piece==40 || unit.piece==9);
	}
	function refreshTerritory(terr, cleanDice) {
		refreshTerritoryHeavy(terr, cleanDice);
	}
	function refreshTerritoryLite(terr) {
		if(!terr)
			return;
		var unitCount=0;
		var highestPiece=0;
		var adCount=0;
		terr.generalFlg=false;
		terr.leaderFlg=false;
		var attStrength=0;
		var defStrength=0;
		var cargoUnits=0;
		var cargoSpace=0;
		var amphibAtt=0;
		var factoryCount=0;
		var superBC=false;
		var shipAttack=0;
		var shipDefense=0;
		var transportCount=0;
		var transportCargo=0;
		var transportSpace=0;
		var carrierCargo=0;
		var carrierSpace=0;
		var destroyerCount=0;
		var bomberCount=0;
		var paratrooperCount=0;
		var infParatrooperCount=0;
		var cargoTypeUnits=0; // groundUnits & fighters
		var unloadedCargo=[];
		var strandedCargo=[];
		var superBSStats='';
		var defendingFighterId=0;
		var battleshipAACount=0;
		var cobraCount=0;

		var unitHash = {};
		var unitIdHash = {};
		var flagHash = {};
		flagHash[terr.owner]=1;
		var pieces=[];
		var nukeCount=0;
		var unitOwner=0;
		var groundForce=0;
		var anyPiece=0;
		var includesCargoFlg=false;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id && !unit.moving) {
				if(unit.piece==9)
					battleshipAACount++;
				if(unit.subType=='fighter')
					defendingFighterId=unit.piece;
				if(unit.piece>anyPiece)
					anyPiece=unit.piece;
				flagHash[unit.owner]=1;
				if(unit.cargoOf && unit.cargoOf>0)
					includesCargoFlg=true;
//				if($scope.currentPlayer && (unit.piece==7 || unit.piece==50) && unit.owner==$scope.currentPlayer.nation)
//					$scope.loadPlanesFlg=true;
				if($scope.currentPlayer && unit.type==3 && unit.owner==$scope.currentPlayer.nation)	
					$scope.loadBoatsFlg=true;
				if(terr.id<79 && unit.cargoOf && unit.cargoOf>0)
					paratrooperCount++;
				if(terr.id<79 && unit.cargoOf && unit.cargoOf>0 && unit.piece==2)
					infParatrooperCount++;

				var sp = '';
				var unitName = $scope.gUnits[unit.piece].name+sp;
				var count = unitHash[unitName] || 0;
				count++;
				unitHash[unitName]=count;
				
				var unitName2 = $scope.gUnits[unit.piece].name;
				var count2 = unitIdHash[unit.piece] || 0;
				count2++;
				unitIdHash[unit.piece]=count2;
				
				attStrength+=unit.att;
				defStrength+=unit.def;
				if(unitOwner>0 && unitOwner!=terr.owner && unit.owner==terr.owner)
					unitOwner=terr.owner;
				if(unitOwner==0)
					unitOwner=unit.owner;
				if(unit.piece==7)
					bomberCount++;
				if(unit.piece==2 || unit.piece==3)
					groundForce+=unit.att;
				if(isUnitAirDefense(unit))
					adCount++;
				if(unit.piece==15 || unit.piece==19)
					factoryCount++;
				if(unit.piece==50)
					cobraCount++;
				if(unit.piece==4) {
					transportCount++;
					transportSpace+=4;
				}
				if(unit.piece==45) {
					transportCount++;
					transportSpace+=4;
				}
				if(unit.piece==8 && unit.owner==terr.owner) {
					carrierSpace+=2;
				}
				if(unit.subType=='fighter' && unit.owner==terr.owner)
					carrierCargo++;
				if(unit.subType=='vehicle')
					transportCargo+=2;
				if(unit.subType=='soldier')
					transportCargo++;
				if(unit.piece>highestPiece && (terr.nation<99 || unit.type==3 || unit.type==4))
					highestPiece=unit.piece;
				if(terr.nation==99) {
					if(unit.type==3)
						cargoSpace+=unit.cargoSpace;
					if(unit.type==3 || unit.type==2) {
						shipAttack+=unit.att;
						shipDefense+=unit.def;
					}
					if(unit.type==1) {
						amphibAtt+=unit.att;
						cargoUnits+=unit.cargoUnits;
					}
				}
				if(unit.piece==27)
					destroyerCount++;
				if(unit.piece==14)
					nukeCount++;
				if(unit.piece==10)
					terr.generalFlg=true;
				if(unit.piece==11)
					terr.leaderFlg=true;
				if(unit.piece != 13 && unit.piece != 15 && unit.piece != 19 && unit.piece != 44)
					unitCount++;
			}
		});
		if(unitOwner>0 && terr.owner==0)
			terr.owner=unitOwner;
		if(unitOwner>0 && unitOwner!=terr.owner && terr.id>=79)
			terr.owner=unitOwner;
		if(factoryCount>1 && terr.facBombed)
			terr.facBombed=false;
		if($scope.gameObj.airDefenseTech[terr.owner] && terr.id<79)
			adCount++;
		terr.defendingUnits = pieces.join('+');
		var results = [];
		var militaryUnits = [];
		var flags=[];
		terr.flags=flags;
		terr.cobraCount=cobraCount;
		terr.battleshipAACount=battleshipAACount;
		terr.showUnitDetailFlg = (includesCargoFlg || flags.length>1);
		terr.cargoTypeUnits=cargoTypeUnits;
		terr.unloadedCargo=unloadedCargo;
		terr.infParatrooperCount=infParatrooperCount;
		terr.paratrooperCount=paratrooperCount;
		terr.transportCargo=transportCargo;
		terr.transportSpace=transportSpace;
		terr.carrierCargo=carrierCargo;
		terr.carrierSpace=carrierSpace;
		terr.destroyerCount=destroyerCount;
		terr.superBC=superBC;
		
		terr.nukeCount = nukeCount;
		terr.shipAttack = shipAttack;
		terr.shipDefense = shipDefense;
		terr.transportCount = transportCount;
		terr.factoryCount = factoryCount;
		terr.bomberCount = bomberCount;
		terr.amphibAtt = amphibAtt;
		terr.cargoUnits = cargoUnits;
		terr.cargoSpace = cargoSpace;
		terr.attStrength = attStrength;
		terr.defStrength = defStrength;
		terr.groundForce = groundForce;
		terr.adCount = adCount;
		terr.unitCount=unitCount;

		var status = 3;
		
		var showDetailsFlg = true;

		var flag = flagOfOwner(terr.owner, terr, showDetailsFlg, unitCount, terr.defeatedByNation, terr.nuked, terr.attackedByNation);
		terr.flag = flag;

		var userName = 'Neutral';

//		terr.displayUnitCount=displayCountFromCount(terr.unitCount, terr.nation, $scope.gameObj.currentNation, $scope.gameObj.fogOfWar=='Y', status, true, $scope.gameObj.hardFog=='Y', terr.illuminateFlg);
		terr.displayUnitCount=getDisplayUnitCount(terr, $scope.gameObj.fogOfWar, $scope.gameObj.hardFog)
//		terr.displayUnitCountLong=displayCountFromCount(terr.unitCount, terr.nation, $scope.gameObj.currentNation, $scope.gameObj.fogOfWar=='Y', status, true, $scope.gameObj.hardFog=='Y', terr.illuminateFlg);
		var unitStr = (terr.unitCount==1)?'unit':'units';
		if(factoryCount==0 && defendingFighterId>0)
			defendingFighterId=0;
		terr.defendingFighterId=defendingFighterId;
		var titleUnitCount=unitCount;
		if(terr.fogOfWar)
			titleUnitCount=terr.displayUnitCount;
		if(terr.factoryCount==1) {
			if(adCount==0)
				highestPiece=100;
			if(adCount==1)
				highestPiece=101;
			if(adCount==2)
				highestPiece=102;
			if(adCount>2)
				highestPiece=104;
		}
		if(terr.factoryCount>1) {
			if(adCount==0)
				highestPiece=110;
			if(adCount==1)
				highestPiece=111;
			if(adCount==2)
				highestPiece=112;
			if(adCount>2)
				highestPiece=113;
		}
		if(terr.facBombed)
			highestPiece=103;
		if(terr.superBC)
			highestPiece=12;
		if(highestPiece==0)
			highestPiece=anyPiece;
		terr.piece=highestPiece;
		terr.title=terr.name+' ('+titleUnitCount+' '+unitStr+')\n-'+userName+'-\n'+results.join('\n');
		if(superBC)
			terr.title+='\n'+superBSStats;
	}
	function refreshTerritoryHeavy(terr, cleanDice) {
		var unitCount=0;
		var highestPiece=0;
		var adCount=0;
		terr.generalFlg=false;
		terr.leaderFlg=false;
		var attStrength=0;
		var defStrength=0;
		var cargoUnits=0;
		var cargoSpace=0;
		var amphibAtt=0;
		var factoryCount=0;
		var superBC=false;
		var shipAttack=0;
		var shipDefense=0;
		var transportCount=0;
		var transportCargo=0;
		var transportSpace=0;
		var carrierCargo=0;
		var carrierSpace=0;
		var destroyerCount=0;
		var bomberCount=0;
		var paratrooperCount=0;
		var infParatrooperCount=0;
		var cargoTypeUnits=0; // groundUnits & fighters
		var unloadedCargo=[];
		var strandedCargo=[];
		var superBSStats='';
		var defendingFighterId=0;
		var battleshipAACount=0;
		var cobraCount=0;

		var unitHash = {};
		var unitIdHash = {};
		var flagHash = {};
		flagHash[terr.owner]=1;
		var pieces=[];
		var nukeCount=0;
		var unitOwner=0;
		var groundForce=0;
		var anyPiece=0;
		var includesCargoFlg=false;
		var totalUnitCount=0;
		var leaderOwner=terr.owner;
		var enemyPiecesExist=false;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id && !unit.moving) {
				if($scope.currentPlayer && unit.owner != terr.owner && !enemyPiecesExist) {
					if($scope.currentPlayer.treaties[unit.owner-1] == 0)
						enemyPiecesExist=true;
				}
				totalUnitCount++;
				if(unit.piece==9)
					battleshipAACount++;
				if(unit.subType=='fighter')
					defendingFighterId=unit.piece;
				if(unit.piece>anyPiece)
					anyPiece=unit.piece;
				flagHash[unit.owner]=1;
				if(unit.cargoOf && unit.cargoOf>0)
					includesCargoFlg=true;
//				if($scope.currentPlayer && (unit.piece==7 || unit.piece==50) && unit.owner==$scope.currentPlayer.nation)
//					$scope.loadPlanesFlg=true;
//				if(unit.piece==50)
//					console.log('hey!', $scope.loadPlanesFlg);
				if($scope.currentPlayer && unit.type==3 && unit.owner==$scope.currentPlayer.nation)	
					$scope.loadBoatsFlg=true;
				if(cleanDice)
					unit.dice=[];
				if(unit.def>0)
					pieces.push(unit.piece);
				if(terr.id<79 && unit.cargoOf && unit.cargoOf>0)
					paratrooperCount++;
				if(terr.id<79 && unit.cargoOf && unit.cargoOf>0 && unit.piece==2)
					infParatrooperCount++;

				var sp = '';
				if(unit.owner != terr.owner)
					sp = ' ('+$scope.superpowers[unit.owner]+')';
				var unitName = $scope.gUnits[unit.piece].name+sp;
				var count = unitHash[unitName] || 0;
				count++;
				unitHash[unitName]=count;
				
				var unitName2 = $scope.gUnits[unit.piece].name;
				var count2 = unitIdHash[unit.piece] || 0;
				count2++;
				unitIdHash[unit.piece]=count2;
				
				attStrength+=unit.att;
				defStrength+=unit.def;
				if(unitOwner>0 && unitOwner!=terr.owner && unit.owner==terr.owner)
					unitOwner=terr.owner;
				if(unitOwner==0)
					unitOwner=unit.owner;
				if(unit.piece==50)
					cobraCount++;
				if(unit.piece==7 || unit.piece==50)
					bomberCount++;
				if(unit.piece==12) {
					superBC=true;
					adCount+=unit.adCount;
					var stats = [];
					stats.push('Name: '+unit.sbName || unit.name);
					stats.push('Attack: '+unit.att);
					stats.push('Defend: '+unit.def);
					stats.push('# att: '+unit.numAtt);
					stats.push('# def: '+unit.numDef);
					stats.push('Air Defense: '+unit.adCount);
					stats.push('HP: '+unit.bcHp);
					stats.push('Damage: '+unit.damage);
					superBSStats=stats.join('\n');
				}
				if(unit.piece==2 || unit.piece==3)
					groundForce+=unit.att;
				if(isUnitAirDefense(unit))
					adCount++;
				if(unit.piece==40)
					adCount++; // 2 for this piece
				if(unit.piece==15 || unit.piece==19)
					factoryCount++;
				if(unit.piece==4) {
					transportCount++;
					transportSpace+=4;
				}
				if(unit.piece==45) {
					transportCount++;
					transportSpace+=4;
				}
				if(unit.piece==49) {
					transportCount++;
					transportSpace++;
				}
				if(unit.piece==8 && unit.owner==terr.owner) {
					carrierSpace+=2;
				}
				if(unit.subType=='fighter' && unit.owner==terr.owner)
					carrierCargo++;
				if(unit.subType=='vehicle')
					transportCargo+=2;
				if(unit.subType=='soldier')
					transportCargo++;
				if(unit.piece>highestPiece && (terr.nation<99 || unit.type==3 || unit.type==4))
					highestPiece=unit.piece;
				if(terr.nation==99) {
					if(unit.subType=='fighter' && unit.cargoOf>0) {
						var carrierTerr=getTerrOfUnitId(unit.cargoOf);
						if(carrierTerr>0 && unit.terr!=carrierTerr) {
							showAlertPopup('Unloaded Fighter. Fixing.');
							unit.terr=carrierTerr;
						}
					}
					if(unit.type==1 || unit.subType=='fighter') {
						cargoTypeUnits++;
						if(unit.terr==terr.id)
							strandedCargo.push(unit);
					}
					if(unit.type==1 || unit.type==2) {
						if(numberVal(unit.cargoOf)==0) {
							unloadedCargo.push(unit);
						}
					}
					if(unit.type==3)
						cargoSpace+=unit.cargoSpace;
					if(unit.type==3 || unit.type==2) {
						shipAttack+=unit.att;
						shipDefense+=unit.def;
					}
					if(unit.type==1) {
						amphibAtt+=unit.att;
						cargoUnits+=unit.cargoUnits;
					}
				}
				if(unit.piece==27)
					destroyerCount++;
				if(unit.piece==14)
					nukeCount++;
				if(unit.piece==10)
					terr.generalFlg=true;
				if(unit.piece==28)
					includesCargoFlg=true; //show medic details
				if(unit.piece==11) {
					leaderOwner=unit.owner;
					terr.leaderFlg=true;
				}
				if(unit.piece != 13 && unit.piece != 15 && unit.piece != 19 && unit.piece != 44)
					unitCount++;
			}
//			if(unit.terr==terr.id && unit.moving)
//				unit.moving=false;
		});
		if(terr.defeatedByNation>0 && numberVal(terr.defeatedByRound)<$scope.gameObj.round-1) {
			terr.defeatedByNation=0;
		}

		terr.enemyPiecesExist=enemyPiecesExist;
		terr.totalUnitCount=totalUnitCount;
		terr.battleshipAACount=battleshipAACount;
		if(unitOwner>0 && terr.owner==0)
			terr.owner=unitOwner;
		if(unitOwner>0 && unitOwner!=terr.owner && terr.id>=79)
			terr.owner=unitOwner;
		if(factoryCount>1 && terr.facBombed)
			terr.facBombed=false;
		if($scope.gameObj.airDefenseTech[terr.owner] && terr.id<79)
			adCount++;
		terr.defendingUnits = pieces.join('+');
		var results = [];
		var militaryUnits = [];
		var keys = Object.keys(unitHash);
		for(x=0;x<keys.length;x++) {
			var piece = keys[x];
			results.push(unitHash[piece]+' '+piece);
		}
		var keys2 = Object.keys(unitIdHash);
		for(x=0;x<keys2.length;x++) {
			var piece = keys2[x];
			var amount = unitIdHash[piece];
			militaryUnits.push({'name': $scope.gUnits[piece].name, amount: amount, piece: piece, owner: leaderOwner});
		}
		var keys3 = Object.keys(flagHash);
		var flags=[];
		for(x=0;x<keys3.length;x++) {
			var k = keys3[x];
			flags.push(k);
		}
		terr.cobraCount=cobraCount;
		terr.flags=flags;
		terr.showUnitDetailFlg = (includesCargoFlg || flags.length>1);
		terr.cargoTypeUnits=cargoTypeUnits;
		terr.unloadedCargo=unloadedCargo;
		terr.infParatrooperCount=infParatrooperCount;
		terr.paratrooperCount=paratrooperCount;
		terr.transportCargo=transportCargo;
		terr.transportSpace=transportSpace;
		terr.carrierCargo=carrierCargo;
		terr.carrierSpace=carrierSpace;
		terr.destroyerCount=destroyerCount;
		terr.superBC=superBC;
		
		terr.nukeCount = nukeCount;
		terr.shipAttack = shipAttack;
		terr.shipDefense = shipDefense;
		terr.transportCount = transportCount;
		terr.factoryCount = factoryCount;
		terr.bomberCount = bomberCount;
		terr.amphibAtt = amphibAtt;
		terr.cargoUnits = cargoUnits;
		terr.cargoSpace = cargoSpace;
		terr.attStrength = attStrength;
		terr.defStrength = defStrength;
		terr.groundForce = groundForce;
		terr.adCount = adCount;
		terr.unitCount=unitCount;

		var status = 1;
		if($scope.yourPlayer && $scope.yourPlayer.nation>0)
			status = treatyStatus($scope.yourPlayer, terr.owner);

		var showDetailsFlg = ($scope.gameObj.fogOfWar!='Y' || status>2);

		if(strandedCargo.length==0)
			terr.strandedCargo=[];
		if(terr.id>=79 && terr.cargoTypeUnits>0) {
			if(terr.cargoTypeUnits==terr.unitCount)
				terr.strandedCargo=strandedCargo;
			else if(terr.cargoUnits>terr.cargoSpace)
				terr.strandedCargo=strandedCargo;
		}
		var flag = flagOfOwner(terr.owner, terr, showDetailsFlg, totalUnitCount, terr.defeatedByNation, terr.nuked, terr.attackedByNation);
		terr.flag = flag;
		if($scope.historyMode) {
			terr.flag = flagOfOwner(terr.histOwner, terr, false, totalUnitCount, terr.histDefeatedByNation, terr.histNuked, terr.attackedByNation);
			return;
		}	

		var userName = 'Neutral';
		if(terr.owner>0) {
			var player=playerOfNation(terr.owner);
			if(!$scope.gameObj.multiPlayerFlg && !player.cpu && $scope.gameObj.currentNation==terr.owner) {
				status=3; // all humans can see
			}
			if(player && player.userName) {
				userName=player.userName;
				terr.shieldTech=player.tech[18];
			}
			if(!player.tech[2])
				defendingFighterId=0;
		}

//		terr.displayUnitCount=displayCountFromCount(terr.unitCount, terr.nation, $scope.gameObj.currentNation, $scope.gameObj.fogOfWar=='Y', status, true, $scope.gameObj.hardFog=='Y', terr.illuminateFlg);
//		terr.displayUnitCountLong=displayCountFromCount(terr.unitCount, terr.nation, $scope.gameObj.currentNation, $scope.gameObj.fogOfWar=='Y', status, true, $scope.gameObj.hardFog=='Y', terr.illuminateFlg);
		terr.fogOfWar=($scope.gameObj.fogOfWar=='Y' && numberVal(status)<3);
		if(terr.fogOfWar)
			results=['-fog of war-'];
		var unitStr = (terr.unitCount==1)?'unit':'units';
		if(factoryCount==0 && defendingFighterId>0)
			defendingFighterId=0;
		terr.defendingFighterId=defendingFighterId;
		terr.militaryUnits = results;
		terr.militaryUnits2 = militaryUnits;
		if(terr.factoryCount==1) {
			if(adCount==0)
				highestPiece=100;
			if(adCount==1)
				highestPiece=101;
			if(adCount==2)
				highestPiece=102;
			if(adCount>2)
				highestPiece=104;
		}
		if(terr.factoryCount>1) {
			if(adCount==0)
				highestPiece=110;
			if(adCount==1)
				highestPiece=111;
			if(adCount==2)
				highestPiece=112;
			if(adCount>2)
				highestPiece=113;
		}
		if(terr.facBombed)
			highestPiece=103;
		if(terr.superBC)
			highestPiece=12;
		if(highestPiece==0)
			highestPiece=anyPiece;
		if(highestPiece==0 && terr.unitCount>0) {
			highestPiece=(terr.nation<99)?2:4;
			console.log('ERROR!!!!! highestPiece==0!!', terr);
		}
		terr.piece=highestPiece;
		var obj = getTerritoryType($scope.yourPlayer, terr);
		terr.territoryType = obj.territoryType;
		terr.isAlly = obj.isAlly;
		terr.enemyForce = getEnemyForceForTerr(terr);
		terr.displayUnitCount=getDisplayUnitCount(terr, $scope.gameObj.fogOfWar, $scope.gameObj.hardFog)
		var titleUnitCount=unitCount;
		if(terr.fogOfWar)
			titleUnitCount=terr.displayUnitCount;
		terr.title=terr.name+' ('+titleUnitCount+' '+unitStr+')\n-'+userName+'-\n'+results.join('\n');
		if(superBC)
			terr.title+='\n'+superBSStats;

		cleanupTerr(terr);
	}
	function getEnemyForceForTerr(terr) {
		var attStrength=0;
		if(!terr || !terr.land || terr.land.length==0)
			return attStrength;
			
		terr.land.forEach(function(tId) {
			var t = $scope.gameObj.territories[tId-1];
			if(t.owner>0 && t.owner != terr.owner && t.attStrength>0)
				attStrength+=numberVal(t.attStrength);
		});
		return attStrength;
	}
	function getTerrOfUnitId(id) {
		var terrId=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.id==id)
				terrId=unit.terr;
		});
		return terrId;
	}
	function flagOfOwner(own, terr, showDetailsFlg, unitCount, defeatedByNation, nuked, attackedByNation) {
		var flag = 'flag'+own+'.gif'; 
		if(terr.generalFlg && showDetailsFlg)
			flag = 'flagg'+own+'.gif';
		if(terr.leaderFlg && showDetailsFlg)
			flag = 'flagl'+own+'.gif';

		if(own==0 && terr.nation>0 && terr.nation<99)
			flag = 'flagn'+terr.nation+'.gif';
		if(defeatedByNation>0 || attackedByNation>0) {
			flag = 'flag_ex'+own+'.gif';
		}
		if(nuked && own>0)
			flag = 'flag_nuke'+own+'.gif';

		var f = document.getElementById('flag'+terr.id);
		if(f) {
			if(terr.nation==99 && unitCount==0) {
				flag = 'flag99.gif';
				own=0;
				f.style.opacity=.3; // see also refreshBoard in script.js
			} else
				f.style.opacity=1;
		}
		return flag;
	}
	$scope.scrollToNation=function(nation) {
		$scope.pingNation=nation;
		scrollToCapital(nation);
	}
	$scope.toggleMenu=function() {
		console.log('toggleMenu!!');
		$scope.showMenuFlg=!$scope.showMenuFlg;
		var e = document.getElementById('sidelinePopup');
		var w = window.innerWidth;
		var rect = e.getBoundingClientRect();
		var left=($scope.showMenuFlg)?0:w-rect.width;
		e.style.left=left.toString()+'px';
}
	$scope.ngClassGameType=function(gameType) {
		return ngClassGameTypeMain(gameType);
	}
	$scope.ngStyleLogType=function(type) {
		if(type=='Strategic Bombing')
			return {'color': 'blue'};
		if(type=='Nuke Attack!')
			return {'color': 'purple'};
		if(type=='Battle')
			return {'color': 'red'};
		else
			return {'color': 'black'};
	}
	$scope.ngStyleUnit = function(hp) {
		if(hp==0)
			return {'opacity': '0.2'}
		else
			return {'opacity': '1'}
	}
	$scope.ngStyleTerr = function(terr) {
		var num = terr.nation;
		if(num>8)
			num=9;
		var colors = ['#ffc','#ccf','#ccc','#ea0','#fcc','#cfc','#ff7','#fcf','#fc0','#cff'];
		return {'background-color': colors[num], 'border-top': '1px solid black', 'border-bottom': '1px solid black'};
	}
	$scope.ngStyleTerrMed = function(terr) {
		var num = terr.nation;
		if(num>8)
			num=9;
		var colors = ['#cca','#aac','#aaa','#a80','#caa','#aca','#cc7','#cac','#ca0','#acc'];
		return {'background-color': colors[num], 'border-top': '1px solid black', 'border-bottom': '1px solid black'};
	}
	$scope.retreatButtonPressed = function() {
		if($scope.battle.generalExists && $scope.currentPlayer.generalIsCargo) {
			showAlertPopup('Cannot retreat general when he is dropped in!', 1);
			return;
		}
		playSound('Scream.mp3', 0, $scope.muteSound);
		$scope.fullRetreat=true;
		closeThePopup(true);
		scanBattles();
	}
	function attackerCasualties(battle) {
		var attackers=0;
		var groundAttackers=0;
		var airAttackers=0;
		$scope.attackUnits=[];
		var hits=0;
		battle.units.forEach(function(unit) {
			if(unit.hp>0 && !unit.retreated) {
				if(unit.dead) {
					hits++;
					deleteAnyUnit(unit, battle, battle.attCasualties);
				} else {
					if(unitIsValidForBattle(unit, battle.terr)) {
						attackers++;
						$scope.attackUnits.push(unit);
						if(unit.type==1 || unit.type==4)
							groundAttackers++;
						if(unit.type==2)
							airAttackers++;
					}
				}
			}
		});
		$scope.defHits=hits;
		return {attackers: attackers, groundAttackers: groundAttackers, airAttackers: airAttackers};
	}
	function unitIsValidForBattle(unit, terrId) {
		if(unit.piece==13 || unit.piece==15 || unit.piece==19)
			return false;
		if(unit.subType=='vehicle' && terrId>=79 && unit.terr<79 && unit.returnFlg)
			return true;
		if(unit.type==1 && terrId>=79 && unit.piece!=14 && unit.piece!=52)
			return false;
		if(unit.piece==14 && !unit.dead)
			return true;
		if(unit.hp==0 || unit.dead) {
//			console.log('xxx something wrong!!!', unit.piece, unit.hp, unit.dead);
			return false;
		}
		return true;
	}
	function specialtyUnitsFire(battle) {
		var cleanupFlg=false;
		var mefGeneral=false;
		battle.units.forEach(function(unit) {
			if(unitIsValidForBattle(unit, battle.terr)) {
				unit.moving=false;
				if(unit.piece==41) {
					hijackerAttacks(battle);
					cleanupFlg=true;
				}
				if(unit.piece==10 && unit.nation==4) {
					japGeneralAttacks(battle);
					cleanupFlg=true;
				}
				if(unit.piece==10 && unit.nation==6) {
					mefGeneral=true;
					cleanupFlg=true;
				}
			}
		});
		if(mefGeneral) {
			mefGeneralAttacks(battle);
		}
		if(cleanupFlg) {
			var attackunits=[];
			battle.units.forEach(function(unit) {
				attackunits.push(unit);
			});
			var defendingUnits=[];
			console.log('cleanupFlg!!');
			
			battle.defendingUnits.forEach(function(unit) {
				if(unit.owner==battle.attacker) {
					console.log('this does not belong to defender!!', unit.piece, unit.id);
					var newUnit = createNewUnitOfNation(battle.attacker, unit.piece, unit.terr, false);
					if(newUnit.piece<=2)
						attackunits.unshift(newUnit);
					else
						attackunits.push(newUnit);
					if($scope.attackUnits)
						$scope.attackUnits.push(newUnit);
					if($scope.displayBattle && $scope.displayBattle.attackUnits)
						$scope.displayBattle.attackUnits.push(newUnit);
					deleteAnyUnit(unit, battle, battle.defCasualties);
				}
				else 
					defendingUnits.push(unit);
			});
			
			battle.units=attackunits;
			battle.defendingUnits=defendingUnits;
			//console.log('battle.units', battle.units.length);
		}
	}
	function attackerFires(battle) {
//		console.log('attackerFires');
		if($scope.fullRetreat)
			return;
		var hits=0;
		$scope.battle.attDice=[];
		battle.attackingMedics=[];
		var defendingMedics=[];
		var predatorsShot=0;
		var defendingBCHP=0;
		battle.defendingUnits.forEach(function(unit) {
			if(unit.def && unit.def>0 && unit.hp>0 && !unit.retreated && unit.owner!=battle.attacker) {
				if(unit.piece==12)
					defendingBCHP+=unit.bcHp-unit.damage-1;
				if(unit.piece==28 && $scope.gameObj.round > unit.medicRound+1)
					defendingMedics.push(unit);
				if(battle.includesDronesFlg) {
					predatorsShot+=checkForPredDefense(unit);
				}
			}		
		});
		var validUnits=0;
		var attackUnitNumber=0;
		//snipers go first!
		var cleanOfdestroyersFlg = (!battle.destroyerCount || battle.destroyerCount==0);
		if(cleanOfdestroyersFlg) {
			battle.units.forEach(function(unit) {
				if(unitIsValidForBattle(unit, battle.terr)) {
					if(unit.piece==21 || unit.piece==5 || unit.piece==47) {
						hits += sniperFires(battle, unit);
					}
				}
			});
		}
		battle.units.forEach(function(unit) {
			if(unitIsValidForBattle(unit, battle.terr)) {
				validUnits++;
				unit.moving=false;
				if(unit.piece==28 && $scope.gameObj.round > unit.medicRound+1)
					battle.attackingMedics.push(unit);
				if(unit.piece==43)
					predatorsShot = predatorDroneAttack(battle, unit, predatorsShot);
				if(cleanOfdestroyersFlg && (unit.piece==21 || unit.piece==5 || unit.piece==47)) {
					//sniperFires(battle, unit); <--do nothing!
				} else {
					attackUnitNumber++;
					var forceLowFlg=false;
					var forceHiFlg=false;
					if(attackUnitNumber>1 && battle.units.length>0 && !battle.generalFlg && !battle.leaderFlg) {
						var currentHitsPerUnit=hits/attackUnitNumber;
						var targetHitsPerUnit=$scope.expectedHits/battle.units.length;
						forceLowFlg=currentHitsPerUnit<targetHitsPerUnit;
						forceHiFlg=currentHitsPerUnit>targetHitsPerUnit;
					}
					var pieceHits = unitAttacks(unit, battle.terr>=79, forceLowFlg, forceHiFlg);

					for(var x=0; x<pieceHits; x++) {
//					console.log('pieceHits', pieceHits, unit.piece);
						if(defendingBCHP>0) {
							absorbBSHit(battle, false);
							defendingBCHP--;
						} else
							markUnitForKill(unit.target, battle.defendingUnits, defendingMedics, battle.terr);
					}
					hits+=pieceHits;
				}
			} 
		});
		$scope.attDice=$scope.battle.attDice;
		$scope.attHits=hits;
		return hits;
	}
	function absorbBSHit(battle, attackerFlg) {
		console.log('absorbBSHit');
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var unit=$scope.gameObj.units[x];
			if(attackerFlg) {
				if(unit.terr==battle.terr && unit.piece==12 && unit.owner == battle.attacker && unit.damage<unit.bcHp-1) {
					unit.damage++;
					return;
				}
			} else {
				if(unit.terr==battle.terr && unit.piece==12 && unit.owner != battle.attacker && unit.damage<unit.bcHp-1) {
					unit.damage++;
					return;
				}
			}
		}
	}
	function checkForPredDefense(unit) {
		var hits=0;
		var uid=101;
		var diceRolls=[];
		if(unit.subType=='fighter' || unit.piece==37 || unit.piece==40 || unit.piece==20 || unit.piece==30 || unit.piece==34) {
			unit.droneAttack = $scope.gameObj.round; 
			unit.dice=[];
			var hit = rollTheDice($scope.battle.fighterDice, unit.def, unit, 1, true);
			hits+=hit;
		}
		return hits;
	}
	function predatorDroneAttack(battle, attUnit, predatorsShot) {
		var uid=101;
		var diceRolls=[];
		var latestRoll={id:uid++, diceImg:$scope.battle.fighterDice[$scope.battle.fighterDice.length-1-predatorsShot]};
		if($scope.displayBattle && $scope.displayBattle.airDefenseUnits)
			diceRolls.push(latestRoll);
		if(predatorsShot>0) {
			deleteAnyUnit(attUnit, battle, battle.attCasualties);
			predatorsShot--;
		}
		if($scope.displayBattle && $scope.displayBattle.airDefenseUnits && $scope.displayBattle.airDefenseUnits.length>0 && diceRolls.length<=$scope.displayBattle.airDefenseUnits.length) {
			var x=0;
			$scope.displayBattle.airDefenseUnits.forEach(function(unit) {
				if(unit.piece != 13 && unit.diceFinal.length==0 && diceRolls.length>x)
					unit.diceFinal.push(diceRolls[x++]);
			});
		}
		return predatorsShot;
		
	}
	function markUnitForKill(target, units, medics, terrId) {
		if(findTargetUnitToKill(target, units, medics, terrId))
			return;
		if(target=='vehicles' || target=='planes') {
			findTargetUnitToKill('default', units, medics, terrId);
			return;
		}
		if(target=='planesTanks') {
			if(findTargetUnitToKill('vehicles', units, medics, terrId))
				return;
			findTargetUnitToKill('default', units, medics, terrId);
			return;
		}
	}
	function findTargetUnitToKill(target, units, medics, terrId) {
		for(var x=0; x<units.length; x++) {
			var unit=units[x];
			if(unit.retreated) {
				console.log('whoa! retreated');
//				continue;
			}
			if(unit.piece==15 || unit.piece==19 || unit.piece==13 || unit.piece==14 || unit.piece==52)
				continue;
			if(target=='noplanes' && unit.type==2)
				continue;
			if(unit.dead) {
				continue;
			}
			if(target=='noplanes' && unitIsValidForBattle(unit, terrId)) {
				return killUnitUnlessMedic(unit, medics);
			}
			if(target=='default' && unitIsValidForBattle(unit, terrId)) {
				return killUnitUnlessMedic(unit, medics);
			}
			if(target=='vehicles' && (unit.piece==1 || unit.piece==3) && unitIsValidForBattle(unit, terrId)) {
				return killUnitUnlessMedic(unit, medics);
			}
			if(target=='soldierOnly' && (unit.subType=='soldier') && unitIsValidForBattle(unit, terrId)) {
				return killUnitUnlessMedic(unit, medics);
			}
			if(target=='planes' && (unit.type=='2' || unit.type=='4') && unitIsValidForBattle(unit, terrId)) {
				return killUnitUnlessMedic(unit, medics);
			}
			if(target=='planesTanks' && (unit.type=='2' || unit.type=='4') && unitIsValidForBattle(unit, terrId)) {
				return killUnitUnlessMedic(unit, medics);
			}
			if(target=='kamakazi' && (unit.piece=='4' || unit.type=='2' || unit.subType=='vehicle' || unit.subType=='chopper') && unitIsValidForBattle(unit, terrId)) {
				unit.dead=true;
				return true;
//				return killUnitUnlessMedic(unit, medics);
			}
		}
		return false;
	}
	function killUnitUnlessMedic(unit, medics) {
		if(medics && medics.length>0 && unit.piece=='2') {
			if($scope.battle.medicHealedCount)
				$scope.battle.medicHealedCount++;
			else
				$scope.battle.medicHealedCount=1;
			
			if($scope.displayBattle) {
				if(!$scope.displayBattle.medicHealedCount)
					$scope.displayBattle.medicHealedCount=0;
				$scope.displayBattle.medicHealedCount++;
			}
			
			var medic=medics.shift();
			console.log('medic healed!!!', medic.terr, medic.prevTerr);
			medic.retreated=true;
//			if(medic.terr != medic.prevTerr) {
//				medic.retreated=true;
//				medic.terr = medic.prevTerr;
//			}
			medic.medicRound=$scope.gameObj.round;
			return true;
		}
		unit.dead=true;
		return true;
	}
	function inflictHitsOnDefenders(battle, hits) {
		var count=0;
		battle.defendingUnits.forEach(function(unit) {
			if(!unit.dead && unit.def>0 && unit.hp>0 && count<hits) {
				count++;
				unit.dead=true;
			}
		});
	}
	function sniperFires(battle, unit) {
		var hits=unitAttacks(unit);
		if(hits>0)
			removeDefendingCasualty(battle, unit.piece);
		return hits;
	}
	function cleanupDefendingCasualties(battle) {
		var alive=0;
		var subsAlive=0;
		battle.defendingUnits.forEach(function(unit) {
			if(unit.dead && unit.hp>0) { //must be unit.hp>0
				deleteAnyUnit(unit, battle, battle.defCasualties);
			} else if(unit.def>0 && !unit.dead) {
				alive++;
				if(unit.piece==5)
					subsAlive++;
			}
		});
		return {alive:alive, subsAlive:subsAlive};
	}
	function removeDefendingCasualty(battle, piece) {
		var bestPlane;
		var bestVehicle;
		var bestSoldier;
		var techMav = false;
		var techRadar = false;
		if($scope.currentPlayer && $scope.currentPlayer.tech) {
			techMav = $scope.currentPlayer.tech[1];
			techRadar = $scope.currentPlayer.tech[2];
		}
		for(var x=0; x<battle.defendingUnits.length; x++) {
			var unit=battle.defendingUnits[x];
			if(unit.dead && unit.hp==0) {
//				console.log('already sniped', unit.id, unit.hp);
				continue;
			}
			if(piece==21) {
				if(unit.subType=='soldier') {
					deleteAnyUnit(unit, battle, battle.defCasualties);
					return;
				}
			}
			if(piece==47) { // laser
				if(!bestSoldier)
					bestSoldier=unit;
				if(techMav && !bestVehicle && unit.subType=='vehicle')
					bestVehicle=unit;
				if(techRadar && !bestPlane && (unit.type==2 || unit.type==4))
					bestPlane=unit;
			}
			if(piece==5) {
				if(unit.type==3 && unit.hp>0 && unitIsValidForBattle(unit, battle.terr)) {
					deleteAnyUnit(unit, battle, battle.defCasualties);
					return;
				}
			}
		}
		if(piece==47) {
			if(bestPlane) {
				deleteAnyUnit(bestPlane, battle, battle.defCasualties);
				return;
			}
			if(bestVehicle) {
				deleteAnyUnit(bestVehicle, battle, battle.defCasualties);
				return;
			}
			if(bestSoldier) {
				deleteAnyUnit(bestSoldier, battle, battle.defCasualties);
				return;
			}
		}
	}
	function mefGeneralAttacks(battle) {
		var targetPlane=null;
		var targetVehicle=null;
		var targetSoldier=null;
		battle.defendingUnits.forEach(function(unit) {
			if(unit.hp>0 && unit.owner!=battle.attacker) {
				if(unit.type==2 || unit.type==4)
					targetPlane=unit;
				if(unit.subType=='vehicle')
					targetVehicle=unit;
				if(unit.subType=='soldier')
					targetSoldier=unit;
			}
		});
		var targetUnit = targetPlane || targetVehicle || targetSoldier;
		if(targetUnit && targetUnit.id>0) {
			console.log('xxxmefGeneral!targetUnit ', targetUnit.piece);
			if($scope.displayBattle)
				$scope.displayBattle.generalUnit=targetUnit.piece;
			deleteAnyUnit(targetUnit, battle, battle.defCasualties);
		}
	}
	function japGeneralAttacks(battle) {
		var targetUnit;
		battle.defendingUnits.forEach(function(unit) {
			if(!targetUnit && unit.hp>0 && unit.owner!=battle.attacker && unit.subType=='soldier') {
				targetUnit=unit;
			}
		});
		if(targetUnit && targetUnit.id>0) {
			if($scope.displayBattle)
				$scope.displayBattle.generalUnit=targetUnit.piece;
			targetUnit.owner=battle.attacker;
			targetUnit.nation=battle.attacker;
		}
	}
	function hijackerAttacks(battle) {
		var targetUnit;
		battle.defendingUnits.forEach(function(unit) {
			if(unit.hp>0 && unit.owner!=battle.attacker) {
				if(unit.type==2 || unit.type==4)
					targetUnit=unit;
				else if(!targetUnit && unit.subType=='vehicle')
					targetUnit=unit;
			}
		});
		if(targetUnit && targetUnit.id>0) {
			if($scope.displayBattle)
				$scope.displayBattle.hijackerUnit=targetUnit.piece;
			targetUnit.owner=battle.attacker;
			targetUnit.nation=battle.attacker;
			
//			console.log('hijacker', battle.units.length, $scope.displayBattle.attackUnits.length);
		}
	}
	function isArtillery(unit) {
		if(unit.piece==1 || unit.piece==24 || unit.piece==33 || unit.piece==38)
			return true;
		else
			return false;
	}
	function unitAttacks(unit, waterFlg, forceLowFlg, forceHiFlg) {
		var hits=0;
		unit.dice=[];
		var numAtt=unit.numAtt;
		var unitAtt = unit.att;
		if(waterFlg) {
			if(isArtillery(unit))
				numAtt = Math.floor(numAtt/3);
		}
		if(numAtt>1) {
			forceLowFlg=false;
			forceHiFlg=false;
		}
		for(var x=0;x<numAtt;x++) {
			hits += rollTheDice($scope.battle.attDice, unitAtt, unit, x, null, forceLowFlg, forceHiFlg);
		}
		return hits;
	}
	function rollTheDice(diceArray, att, unit, x, fighterVsPredFlg, forceLowFlg, forceHiFlg) {
		var hits=0;
		var diceRoll=Math.floor((Math.random() * 6)+1);
		if(forceLowFlg && diceRoll>1) {
//			console.log('force low!');
			diceRoll--;
		}
		if(forceHiFlg && diceRoll<6) {
//			console.log('force hi!');
			diceRoll++;
		}
		if(fighterVsPredFlg)
			diceRoll=1;
		if(diceRoll<=att) {
			hits++;
		}
		var dice=(diceRoll<=att)?'h'+diceRoll:diceRoll;
		var str = new String('dice'+dice+'.png');
		if(diceArray)
			diceArray.push(str);
		if(unit && unit.dice) {
			unit.dice.push({id: x, diceImg: str});
			if($scope.displayBattle && $scope.displayBattle.attackUnits.length>0)
				findMatchingDisplayUnit(unit, x, str);
		}
		return hits;
	}
	function findMatchingDisplayUnit(u, x, str) {
		if($scope.displayBattle && $scope.displayBattle.attackUnits && $scope.displayBattle.attackUnits.length>0) {
			$scope.displayBattle.attackUnits.forEach(function(unit) {
				if(u.id==unit.id) {
					updateUnitDice(unit, str);
					if(unit && unit.diceFinal)
						unit.diceFinal.push({id: x, diceImg: str});
				}
			});
		}
		if($scope.displayBattle && $scope.displayBattle.defendingUnits && $scope.displayBattle.defendingUnits.length>0) {
			$scope.displayBattle.defendingUnits.forEach(function(unit) {
				if(u.id==unit.id) {
					updateUnitDice(unit, str);
					if(unit && unit.diceFinal)
						unit.diceFinal.push({id: x, diceImg: str});
				}
			});
		}
	}
	function updateUnitDice(unit, str) {
		for(var x=0; x<unit.dice.length; x++) {
			if(unit.dice[x].diceImg=='spin.gif') {
				unit.dice[x].diceImg=str;
				return;
			}
		}
	}
	function defenderFires(battle, attackBCHP) {
		var hits=0;
		$scope.battle.defDice=[];
		var attackUnitNumber=0;
		battle.defendingUnits.forEach(function(unit) {
			if(unit.def && unit.def>0 && unit.hp>0 && unit.owner!=battle.attacker) {
				var numDef = unit.numDef || 1;
				unit.dice=[];
				attackUnitNumber++;
				var forceLowFlg=false;
				var forceHiFlg=false;
				if(attackUnitNumber>1 && battle.defendingUnits.length>0) {
					var currentHitsPerUnit=hits/attackUnitNumber;
					var targetHitsPerUnit=$scope.expectedLosses/battle.defendingUnits.length;
					forceLowFlg=currentHitsPerUnit<targetHitsPerUnit;
					forceHiFlg=currentHitsPerUnit>targetHitsPerUnit;
				}
				for(var x=0; x<numDef; x++) {
					var hit=rollTheDice($scope.battle.defDice, unit.def, unit, x, null, forceLowFlg, forceHiFlg);
					hits+=hit;
					if(hit>0) {
						if(attackBCHP>0) {
							absorbBSHit(battle, true);
							attackBCHP--;
						} else
							markUnitForKill(unit.target, battle.units, battle.attackingMedics, battle.terr);
					}
				}
			}		
		});
		$scope.defDice=$scope.battle.defDice;
		$scope.defHits=hits;
		return hits;
	}
	
		$(function() {
    $("#map").click(function(e) {

      var offset = $(this).offset();
      var relativeX = (e.pageX - offset.left);
      var relativeY = (e.pageY - offset.top);
	
	var mapWidth = window.innerWidth;
	var mapHeight = mapWidth*462/791;
	
	var x=relativeX*100/mapWidth;
	var y=relativeY*100/mapHeight;
	
	console.log('map', relativeX,relativeY);
	closeAllPopups();
		});
	});
	$scope.svgClick=function() {
		closeAllPopups();
	}
	function closeAllPopups() {
		var popups = ['purchasesPopup','territoriesPopup','techPopup','unitsPopup','chatPopup','logsPopup','playersPopup','details2Popup','alliesPopup','menu1Popup'];
		popups.forEach(function(popup) {
			var e = document.getElementById(popup);
			if(e && e.className=='popupScreenOpen') {
				var id1 = popup.replace('Popup', '');
				$scope.openCloseSlider(id1);
			}
		});
		var popups2 = ['alertPopup','alertPopup2','advisorPopup','bugReportPopup','roundNumPopup', 'territoryPopup'];
		popups2.forEach(function(popup) {
			var e = document.getElementById(popup);
			if(e && e.style.display=='block') {
				e.style.display='none';
			}
			if(e && e.className=='roundNumPopup fadeIn') {
				e.className='roundNumPopup off';
			}
		});
		if($scope.selectedTerritory)
			$scope.closeTerrPopup();

	}
	function startSequence() {
		var e = document.getElementById('arrow');
		e.style.display='block';
		var coords = locationOfCapital($scope.gameObj.currentNation);
		e.style.position='absolute';
		e.style.left=(coords.x-36).toString()+'px';
		e.style.top=(coords.y+100).toString()+'px';
	}
/*	function createUnits(fac) {
		var carrierFlg=false;
		for(var x=0; x<fac.prodQueue.length; x++) {
			var prodUnit = fac.prodQueue[x];
			if(prodUnit==8 || prodUnit==9 || prodUnit==12)
				carrierFlg=true;
			setTimeout(function() { createUnit(fac); }, x*95);
		}
		return carrierFlg;
	}
	function createUnit(fac) {
		if(fac.prodQueue.length>0) {
			fac.prodUnit = parseInt(fac.prodQueue.shift());
		}
		var unitId = fac.prodUnit;
		var terr = $scope.gameObj.territories[fac.terr-1];
		var piece = $scope.gUnits[unitId];
		if(!piece) {
			console.log("Whoa!!! no piece!!", unitId);
			return;
		}
		if(piece.type==3)
			terr = getWaterwayOfTerr(terr);
		if(unitId==19 && terr.facBombed) {
			terr.facBombed=false;
			refreshTerritory(terr);
		} else
			annimateUnitOntoTerr(terr, unitId);
	}*/
	function getWaterwayOfTerr(terr) {
		if(terr.seaZoneId>0) {
			var terr2 = $scope.gameObj.territories[terr.seaZoneId-1];
			terr2.owner = terr.owner;
			return terr2;
		}
		var borders = terr.borders.split("+");
		for(var x=0; x<borders.length; x++) {
			var id = parseInt(borders[x]);
			var terr2 = $scope.gameObj.territories[id-1];
			if(terr2.nation==99) {
				terr2.owner = terr.owner;
				return terr2;
			}
		}
			
		var terr = $scope.gameObj.territories[100];
	}
	function annimateUnitOntoTerr(terr, piece, allowMovesFlg, refreshFlg) {
		if(!terr || !piece)
			return;
		if(piece==16 || piece==17 || piece==18)
			return;
		playSound('Swoosh.mp3', 0, $scope.muteSound);
		addUnitToTerr(terr, piece, allowMovesFlg, refreshFlg);
		var sprite = getSprite(piece, 60, terr.x, terr.y+95);
		if(!sprite)
			return;
		sprite.zoomFlg=true;
		zoomActiveSprites();	
//		zoomSprite(sprite);
	}
	function createNewUnitOfNation(nation, piece, terrId, allowMovesFlg) {
		var newId = $scope.gameObj.unitId;
		$scope.gameObj.unitId++;
		var unit = unitOfId(newId, nation, piece, terrId, $scope.gUnits, allowMovesFlg);
		$scope.gameObj.units.push(unit);
		return unit;
	}
	function addUnitToTerr(terr, piece, allowMovesFlg, refreshFlg) {
		if(piece==52)
			allowMovesFlg=true;
		var nation = terr.owner;
		var newId = $scope.gameObj.unitId;
		var startCount = $scope.gameObj.units.length;
		if(piece==12) {
			console.log($scope.gameObj.superBCForm);
			var unit = unitOfId(newId, nation, piece, terr.id, $scope.gUnits, allowMovesFlg);
			var names=['Titan','Bismark','Enterprise','Cowboy','Terminator','Ball-Buster','Behemuth','Gargantia','TLC','Peacemaker','Bubba Gump','Miami Vice','MVP','The Kracken','Flint Beastwood','Rager','Annihilation','Extermination','Massacre','All-Seaing','Monkey-Sea Monkey-Do','Seaing is Believing','Mother of Sea'];
			var nameId = Math.floor((Math.random() * names.length));
			unit.sbName=names[nameId];
			unit.att=4+$scope.gameObj.superBCForm.att;
			unit.att2=4+$scope.gameObj.superBCForm.att;
			unit.def=4+$scope.gameObj.superBCForm.def;
			unit.def2=4+$scope.gameObj.superBCForm.def;
			unit.numAtt=1+$scope.gameObj.superBCForm.numAtt;
			unit.numAtt2=1+$scope.gameObj.superBCForm.numAtt;
			unit.numDef=1+$scope.gameObj.superBCForm.numDef;
			unit.adCount=$scope.gameObj.superBCForm.adCount;
			unit.bcHp=1+$scope.gameObj.superBCForm.hp;
			unit.damage=0;
			console.log('sbc created!', unit);
			$scope.gameObj.units.push(unit);
		} else {
			$scope.gameObj.units.push(unitOfId(newId, nation, piece, terr.id, $scope.gUnits, allowMovesFlg));
		}
		$scope.gameObj.unitId++;
		if(piece==15 || piece==19) {
			terr.factoryCount++;
		}
		if(refreshFlg) {
			refreshTerritory(terr);
			applyChanges();
		} else {
			terr.unitCount++;
			terr.displayUnitCount=getDisplayUnitCount(terr, $scope.gameObj.fogOfWar, $scope.gameObj.hardFog);
			applyChanges();
		}
	}
	function zoomActiveSprites() {
		if(!$scope.zoomingSpritesFlg) {
			$scope.zoomingSpritesFlg=true;
			weAreZoomingTheSprites();
		}
	}
	function weAreZoomingTheSprites() {
		var anyActive=false;
		$scope.sprites.forEach(function(sprite) {
			if(sprite.active) {
				if(sprite.zoomFlg)
					zoomThisSprite(sprite);
				anyActive=true;
			}
		});
		if(anyActive) {
			var id = window.requestAnimationFrame(weAreZoomingTheSprites);
		} else
			$scope.zoomingSpritesFlg=false;
	}
	function zoomThisSprite(sprite) {
		sprite.move++;
		var size = 60-sprite.move;
		var e = document.getElementById('sprite'+sprite.name);
		if(e) {
			e.style.width = size+'px';
			e.style.height = size+'px';
			if(sprite.move>=60) {
				sprite.move=0;
				sprite.active=false;
				e.style.display='none';
			}
		}
	}
	/*function zoomSprite(sprite) {
		sprite.move++;
		var size = 60-sprite.move;
		var e = document.getElementById('sprite'+sprite.name);
		if(e) {
			e.style.width = size+'px';
			e.style.height = size+'px';
			if(sprite.move<60) {
//				marqueeId = window.requestAnimationFrame(zoomSprite);
				setTimeout(function() { zoomSprite(sprite, e) }, 20);
			} else {
				sprite.move=0;
				sprite.active=false;
				e.style.display='none';
			}
		}
	}*/
	function queueMarqueeMessage(msg, queueFlg) {
		if(queueFlg)
			marqueeMgs.push(msg);
		if(!marqueeInAction) {
			marqueeInAction=true;
			if(marqueeMgs.length>0)
				displayMarqueeMessage(marqueeMgs.shift());
			else
				displayMarqueeMessage(msg);
		}
	}
	function displayMarqueeMessage(msg) {
		setInnerHTMLFromElement('marqueeMsg', msg);
		marqueeLeft=window.innerWidth;
		annimateMarquee();
	}
	function annimateMarquee() {
		var e = document.getElementById('marqueeMsg');
		if(!e)
			return;
		marqueeLeft--;
		document.getElementById('marqueeMsg').style.left=marqueeLeft.toString()+'px';
		var msg = innerHTMLFromElement('marqueeMsg');
		if(marqueeLeft>0-msg.length*5)
			marqueeId = window.requestAnimationFrame(annimateMarquee);
		else {
			if(marqueeMgs.length>0) {
				var m = marqueeMgs.shift();
				displayMarqueeMessage(m)
			} else
				marqueeInAction=false;
		}
	}
	function pauseAction() {
		window.cancelAnimationFrame(spriteId);
		window.clearTimeout(timeSecondsId);
		$scope.gameMusic.pause();
		warAudio.pause();
		gamePaused=true;
		changeClass('pauseButton', 'btn ptp-yellow');
	}
	function resumeAction() {
		if(gamePaused) {
			changeClass('pauseButton', 'btn ptp-blue');
			gamePaused=false;
//			advanceActionIfNeeded();
//			console.log('resumeAction');
			moveSprites();
			if(isMusicOn())
				$scope.gameMusic.play();
		}
	}
	$scope.ngStyleUnitDetail=function() {
		if($scope.unitDetailFlg)
			return {'max-height': '60px', 'max-width': '100px'};
		else
			return {'max-height': '20px', 'max-width': '40px'};
	}
	$scope.toggleUnitDetail=function() {
		playClick($scope.muteSound);
		$scope.unitDetailFlg=!$scope.unitDetailFlg;
	}
	$scope.closeTerrPopup = function() {
		if(!$scope.selectedTerritory)
			return;
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if(practiceMode) {
			var practiceStep = numberVal(localStorage.practiceStep);
			if(practiceStep==0 && $scope.practiceClick==2) {
				showAlertPopup('Move some units to France. Click the "Move Here" button, select some troops and press "Go".', 1);
				return;
			}
			if(practiceStep==0 && $scope.practiceClick==5) {
				showAlertPopup('Load some units onto your transport. Press "Load Ships", select one or two infantry and press "Load These Units".', 1);
				return;
			}
			if(practiceStep==0 && $scope.practiceClick==6) {
				showAlertPopup('Move your transport here. Click the "Move Here" button, select your transport and press "Go".', 1);
				return;
			}
			if(practiceStep==0 && $scope.practiceClick==7) {
				showAlertPopup('Move your cargo here. Click the "Move Here" button, select your cargo units and press "Go".', 1);
				return;
			}
			if(practiceStep==2 && $scope.currentPlayer.money>5) {
				showAlertPopup('Press the buy buttons until you use up all your coins.', 1);
				return;
			}
			var flg = showCloseTerrClicked(practiceStep, numberVal($scope.practiceClick), $scope.gTerritories);
			if(flg)
				$scope.practiceClick++;
			playClick($scope.muteSound);
			closeThePopup();
			$scope.selectedTerritory=undefined;
			return;
		}
//		if($scope.user.rank==1 && $scope.gameObj.round==1 && $scope.gameObj.transportFlg) {
//			showAlertPopup('You want to practice loading infantry onto your transport unit. Press "Load Units" to show your units. Then select an infantry and a transport and press "Load!" button.', 1);
//			return;
//		}
		if($scope.user.rank==0 && $scope.currentPlayer.money>=10 && $scope.gameObj.round==1) {
			showAlertPopup('Purchase units by clicking on the "buy" buttons. You have '+$scope.currentPlayer.money+' more coins you can spend.', 1);
			return;
		}
		highlightTerritory($scope.selectedTerritory.id, $scope.selectedTerritory.owner, false);
		playClick($scope.muteSound);
		closeThePopup();
		if($scope.ableToTakeThisTurn && $scope.gameObj.round==1 && $scope.currentPlayer.status=='Purchase') {
			playVoiceSound(46, $scope.muteSound);
			showUpArrowAtElement('completeTurnButton');
		}
		
		if($scope.ableToTakeThisTurn && $scope.gameObj.round==1 && $scope.user.rank==0) {
			if($scope.currentPlayer.status=='Attack') {
				if($scope.user.rank==0 && $scope.gameObj.round==1) {
					var ukraine=$scope.gameObj.territories[61];
					if(ukraine.owner != 2)
						showAlertPopup('Attack Ukraine!');
					else {
						playVoiceSound(49, $scope.muteSound);
						showAlertPopup('Nice work! Your first battle won. Victory is ours! You are done with your turn. Press "Complete Turn" button to place your units and end your turn.');
						changeClass('completeTurnButton', 'glowButton');
					}
				} else
					showAlertPopup('Continue making attacks, or press "Complete Turn" button to place your units and end your turn.');
			} else {
				
				showAlertPopup('Excellent. If you are happy with your purchases, press "Purchase Complete" button at the top to continue.');
			}
		}
		$scope.selectedTerritory=undefined;
//		if($scope.currentPlayer.status=='Attack')
//			changeClass('completeTurnButton', 'glowButton');
	}
	function closeThePopup(noResetFlag) {
		$scope.attDice=[];
		if(!noResetFlag)
			setTimeout(function() { resetMessageButton(); }, 1000);	
		$scope.popupOpen = false;
		warAudio.pause();
		closePopup('territoryPopup');
		$scope.optionType=='none';
	}
	function newFacCount() {
		var count=0;
		$scope.gameObj.unitPurchases.forEach(function(uPurch) {
			if(uPurch.piece=='15') {
				count++;
			}
			
		});
	    	return count;
	}
	function neutralMessageForNation(nation) {
		var m=[
		'We will not take kindly to enemy troops in our territory!',
		'Your nation is a loser and we will really, really defeat your puny army.',
		'We are a peaceful people, but we will not hesitate to destroy you if you invade!',
		'Do not try to take our lands. We are more powerful than you can possibly imagine!',
		'The red sun is rising in the east. Stay out of our way if you know what is good for you.',
		'The people\'s communist army will rise up with one voice and one cannon and defeat you!',
		'Death to the infidels! Convert to our way of extreme happiness or be destroyed!',
		'We bring good tidings and gifts to your people. Unless you anger us, then we kill you.',
		'Soon all of the world will share in the good fortune that our tanks and bombs will bring.',
		];
		return m[nation];
	}
	function warMessageForNation(nation) {
		var m=[
		'We will not take kindly to enemy troops in our territory!',
		'Now you have really made me angry. You are not only a loser, but a big loser. A really, really big loser.',
		'You do not stand a chance. We will defeat you!',
		'The armies of mother Russia never surrender! We will defeat you even if it kills every one of us.',
		'You have brought great dishonor to your nation and to your people. Prepare for war!',
		'The people\'s cannon is pointed at your hearts! Surrender now or face the consequences.',
		'Prepare for jihad! We will attack you with a million strikes of total destruction.',
		'We tried to bring peace to your nation, but have failed. Now we must kill you.',
		'Please send us the coordinates of your leadership bunker. Guided missiles have already been launched!',
		];
		return m[nation];
	}
	function neutralRandomMessage(id) {
		var m=[
		'You better watch yourself, before you wreck yourself!! Or check yourself... ',
		'Our nation is very powerful. And we have friends too!',
		'We have positioned all our troops in strategic locations to ensure total dominance. Total and complete dominance!',
		'We are not interested in negotiating with such a puny country as yours.',
		'We are now accepting gifts and bribes of all denominations.',
		'Silence! We own this country and will stop at nothing to expand our ownership of it.',
		'Your pitiful army is no match for the massive empire we have built!',
		'I am on vacation. Please book a meeting with my secretary.',
		'We will not take kindly to enemy troops in our territory!',
		'I have two words for you... Step and Off!',
		'You are looking at your next boss. Keep that in mind as you make your next move.',
		'I don\'t have to tell you how dumb of a move it would be for you to invade. It\'s really, really dumb.',
		'We can do this the easy way, or the hard way. Or some way in between.',
		];
		var i=Math.floor((id % m.length));
		return m[i];
		//
	}
	$scope.changeTerritory = function(num) {
		var x=0;
		var terrNum=-1;
		var firstFac=-1;
		var lastFac=-1;
		var prevFac=-1;
		var nextFac=-1;
		$scope.currentPlayer.territories.forEach(function(terr) {
			if(terr.id==$scope.selectedTerritory.id)
				terrNum=x;
			if(terr.factoryCount>0) {
				if(terrNum<0)
					prevFac=x;
				if(terrNum>=0 && nextFac<0 && terrNum!=x)
					nextFac=x;
				lastFac=x;
				if(firstFac<0)
					firstFac=x;
			}
			
			x++;
		});
		if(num==1) {
			terrNum--;
			if(terrNum<0)
				terrNum=$scope.gameObj.territories.length-1;
		}
		if(num==2) {
			terrNum=prevFac;
			if(terrNum<0)
				terrNum=lastFac;
		}
		if(num==3) {
			terrNum=nextFac;
			if(terrNum<0)
				terrNum=firstFac;
		}
		if(num==4) {
			terrNum++;
			if(terrNum>$scope.gameObj.territories.length-1)
				terrNum=0;
		}
		if(terrNum>=0 && terrNum<$scope.currentPlayer.territories.length) {
			var terr = $scope.currentPlayer.territories[terrNum];
			$scope.terrClicked(terr);
		}
	}
	$scope.terrClickedId = function(terrId) {
		var terr = $scope.gameObj.territories[terrId-1];
		$scope.terrClicked(terr);
	}
	$scope.ngClassFlag=function(terr) {
		var flagShadow = ' hoverShadowed';
		if(terr.territoryType=='Ally' || terr.territoryType=='Your Empire')
			flagShadow = ' flagAlly';
		if(terr.territoryType=='Enemy!')
			flagShadow = ' flagEnemy';
		var hover = isMobile()?'':flagShadow;
		if(terr.capital && terr.id<79)
			return "flagCapital"+hover;
		else
			return "flag "+hover;
	}
	$scope.ngStyleHalo=function(terr,x,y) {
		return {'top': (terr.y+y).toString()+'px', 'left': (terr.x+x).toString()+'px'}
	}
	$scope.ngClassHalo=function(terr) {
		var flagShadow = ' haloNone';
		if(terr.territoryType=='Ally' || terr.territoryType=='Your Empire')
			flagShadow = ' haloAlly';
		if(terr.territoryType=='Enemy!')
			flagShadow = ' haloEnemy';
		if(terr.capital && terr.id<79)
			return "haloCapital "+flagShadow;
		else
			return "halo "+flagShadow;
	}
	$scope.ngHoverShadowClass=function(type) {
		if(isMobile())
			return '';
		else
			return 'type';
	}
	function whiteoutScreen() {
		var e = document.getElementById('whiteOut');
		if(e) {
			e.className='on';
			e.style.display='block';
			e.style.transition='all 1s ease';
			setTimeout(function() { e.className='fadeOut'; }, 100);
			setTimeout(function() { e.style.display='none'; }, 1100);
		}
	}
	$scope.dismissArrow=function() {
		hideArrow();
	}
	function hideArrow() {
		var e = document.getElementById('arrow');
		if(e && e.style.display=='block')
			e.style.display='none';
			
		var e2 = document.getElementById('chatMessagesPopup');
		if(e2 && e2.style.display=='block')
			e2.style.display='none';

		changeClass('chatMessagesPopup', 'popupMsg off');
	}
	function showUpArrow(x,y) {
		var e = document.getElementById('arrow');
		e.style.display='block';
		e.style.position='absolute';
		e.style.left=(x).toString()+'px';
		e.style.top=(y).toString()+'px';
	}
	function showUpArrowAtElement(id) {
		var e = document.getElementById('arrow');
		var b = document.getElementById(id);
		if(e && b) {
			var elemRect = b.getBoundingClientRect();
			e.style.display='block';
			e.style.position='fixed';
			e.style.left=(elemRect.left+10).toString()+'px';
			e.style.top=(elemRect.top+40).toString()+'px';
		}
	}
	function displayLeaderInfo(terr) {
		terr.leader = terr.owner || 0;
		if(terr.leader==0)
			terr.leader=terr.nation || 0;
		if(terr.leader==99)
			terr.leader=0;
		terr.leaderPic='leader'+terr.leader+'.jpg';
		if(terr.leader==0)
			terr.leaderPic='leaders/leader'+terr.id+'.jpg';
		terr.leaderMessage = "";

		if($scope.currentPlayer && $scope.ableToTakeThisTurn && terr.id<79) {
			var names = [terr.name+' Leader', 'Donald Trump', 'Angela Merkel', 'Vladimir Putin', 'Shinzo Abe', 'Xi Jinping', 'Mohammad bin Salman', 'Idi Amin', 'Michel Temer'];
			document.getElementById("leaderName").innerHTML = names[terr.leader];
			if(terr.owner == $scope.currentPlayer.nation) {
				if($scope.currentPlayer.status == 'Attack')
					terr.leaderMessage = "We need to expand our empire. Find a good target to attack, or press 'Complete Turn' to end your turn.";
				else
					terr.leaderMessage = "Time to build troops. Buy your desired units, press 'Close' and then press 'Purchase Complete'.";
			} else {
				if(terr.nation==0)
					terr.leaderMessage = neutralRandomMessage(terr.id);
				else {
					var status = treatyStatus($scope.yourPlayer, terr.leader);
					if(status==0)
						terr.leaderMessage = warMessageForNation(terr.leader);
					if(status==1)
						terr.leaderMessage = neutralMessageForNation(terr.leader);
					if(status==2)
						terr.leaderMessage = 'Our peace agreement is serving us both well. Do not think of breaking it.';
					if(status==3)
						terr.leaderMessage = 'Our alliance is strong. Let us work together to defeat the enemies.';
				}
			}
		}
	}
	function cleanupTerr(terr) {
		if(terr.owner>0) {
			var terrPlayer=playerOfNation(terr.owner);
			terr.userName=terrPlayer.userName;
			if(terr.nuked && !terrPlayer.alive)
				terr.nuked=false;
		}
		/*
		if($scope.currentPlayer && $scope.currentPlayer.nation>0 && terr.id>=79 && terr.owner>0 && terr.owner != $scope.currentPlayer.nation && terr.unitCount>0) {
			$scope.gameObj.units.forEach(function(unit) {
				if(unit.owner==$scope.currentPlayer.nation && unit.terr==terr.id) {
					terr.owner=$scope.currentPlayer.nation;
				}
			});
		}*/
	}
	function resetPracticePieces() {
		console.log('resetPracticePieces');
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==2) {
				unit.movesLeft=2;
				unit.movesTaken=0;
			}
		});
	}
	function moveStrandedCargoFromHere(fromTerr, toTerr) {
		showAlertPopup('Moved.');
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==fromTerr.id && unit.subType=='fighter' && numberVal(unit.cargoOf)==0) {
				unit.terr=toTerr.id;
			}
		});
	}
	function moveStrandedCargo(t) {
		var terr = $scope.gameObj.territories[$scope.strandedCargoAtId-1];
		$scope.strandedCargoAtId=0;
		if(!terr.strandedCargo || terr.strandedCargo.length==0) {
			moveStrandedCargoFromHere(terr, t);
			return;
		}
		if(terr.id<79) {
			showAlertPopup('invalid terr',1);
			return;
		}
		terr.strandedCargo.forEach(function(unit) {
			showAlertPopup('moving cargo'+unit.piece,1);
			if(unit.type==1 || unit.subType=='fighter') {
				console.log('fixing', unit);
				unit.terr=t.id;
			}
		});
	}
	function showTerrUnits(terr) {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id) {
				console.log(unit);
			}
		});
	}
	function moveGeneral(terr) {
		$scope.closeTerrPopup();
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==$scope.currentGeneralTerr && (unit.piece==10 || unit.piece==11)) {
				unit.terr=terr.id;
				playSound('tada.mp3', 0, $scope.muteSound);
			}
		});
		$scope.currentGeneralTerr=0;
	}
	$scope.terrClicked = function(terr) {
		if($scope.bettleTerrId && $scope.bettleTerrId>0 && $scope.bettleTerrId==terr.id) {
			$scope.bettleTerrId=0;
		}
		if($scope.currentGeneralTerr>0) {
			moveGeneral(terr);
		}
		if($scope.moveAllUnitsTerr)
			moveAllUnitsGo(terr.id);
		if($scope.strandedCargoAtId>0)
			moveStrandedCargo(terr);
//		setPlayerTeams();
		$scope.enemyPiecesExist=false;
		if($scope.adminMode)
			showTerrUnits(terr);
		$scope.viewBattleButton=false;
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if(practiceMode) {
			if(numberVal(localStorage.practiceStep)==0) {
				if(numberVal($scope.practiceClick)==0)
					resetPracticePieces();
//				$scope.currentPlayer.status='Attack';
//				$scope.currentPlayer.money=0;
			}
			var message=messageForPracticeClick(numberVal(localStorage.practiceStep), numberVal($scope.practiceClick), terr);
			if(message.length>0) {
				showAlertPopup(message, 1);
				return;
			}
			if($scope.practiceClick==0 && terr.id==7)
				$scope.practiceClick++;
			if($scope.practiceClick==1 && terr.id==8)
				$scope.practiceClick++;
		}
		if($scope.displayTurnMessage) {
			showAlertPopup('Click "Start" to begin!',1);
			return;
		}
		if($scope.user.rank==1 && $scope.gameObj.round>=15 && $scope.currentPlayer.income<25) {
			showAlertPopup('Sorry, but you just had your ass handed to you! It is time to surrender. Click the "Menu" button on the left and click on "Surrender". Then try again!',1);
			return;
		}
		if(!$scope.showControls || !$scope.showMenuControls) {
			showAlertPopup('Computer taking turn. Please wait...',1);
			return;
		}
		if($scope.gameObj.logsFlg && $scope.gameObj.round==2) {
			showAlertPopup('Press the "Logs" button at the top. (It has 3 horizonal lines and 3 numbers on it)', 1);
			showUpArrowAtElement('logsButton');
			return;
		}
//		if($scope.gameObj.transportFlg) {
//			if(terr.transportCount!=1 || terr.owner!=$scope.currentPlayer.nation) {
//				showAlertPopup('Click on your transport. It is positioned along with your submarine, next to your capital. Click on your submarine icon.', 1);
//				return;
//			} else
//				showAlertPopup('Good job. Now press "Load Ships" and load a few units onto your transport.');
//		}
//		if($scope.ableToTakeThisTurn && $scope.battle && $scope.battle.battleId && $scope.battle.battleId>0 && $scope.battle.battleId!=terr.battleId) {
//			showAlertPopup('Finish your battle!');
//			console.log('current battle!', $scope.battle);
//			return;
//		}
		if($scope.showLeftArrow) {
			showAlertPopup('Press the "Players" button on the top.', 1);
			return;
		}
		if(!$scope.currentPlayer) {
			showAlertPopup('Something wrong. no currentPlayer.', 1);
			return;
		}
		if($scope.gameObj.round==1 && !$scope.gameObj.initializedFlg && !$scope.gameObj.multiPlayerFlg) {
			showAlertPopup('Press the "Players" button on the top.', 1);
			return;
		}
		if($scope.user.rank==0 && $scope.ableToTakeThisTurn && $scope.gameObj.round==3 && $scope.currentPlayer.status=='Purchase') {
			if(newFacCount()==0) {
				if(terr.id==7) {
					showAlertPopup('A good strategy is to build factories close to your front lines. Try doing that now. Click on one of your territories that isn\'t Germany');
					return;
				}
				if(terr.owner != $scope.currentPlayer.nation) {
					showAlertPopup('This is not owned by you. Click on any '+$scope.superpowers[$scope.currentPlayer.nation]+' territories besides Germany.');
					return;
				}
			}
		}
		if($scope.ableToTakeThisTurn && $scope.gameObj.round==1 && !practiceMode) {
			if($scope.currentPlayer.placedInf<3) {
				if(terr.nation != $scope.currentPlayer.nation) {
					showAlertPopup('This is not owned by you. Click on any '+$scope.superpowers[$scope.currentPlayer.nation]+' territories to place your infantry.', 1);
					return;
				}
				if(terr.nation==$scope.currentPlayer.nation) {
					$scope.currentPlayer.placedInf++;
					setTimeout(function() { annimateUnitOntoTerr(terr, 2, true, true); }, 2);
					if($scope.currentPlayer.placedInf==3) {
						highlightCapital($scope.currentPlayer.nation);
						playVoiceSound(22, $scope.muteSound);
//						showAlertPopup2('Good job! Now it is time to purchase units. Click on your capital: '+$scope.nations[$scope.currentPlayer.nation]);
						displayFixedPopup('infantry3Confirm');
					}
					return;
				}
			} else {
				if($scope.user.rank==0 && $scope.currentPlayer.status=='Attack' && terr.id != 62) {
					var terr=$scope.gameObj.territories[61];
					if(terr.owner==2) {
						playVoiceSound(50, $scope.muteSound);
						showAlertPopup('Press "Complete Turn" button at the top.', 1);
						showUpArrowAtElement('completeTurnButton');
						changeClass('completeTurnButton', 'glowButton');
						return;
					}
					showAlertPopup('Click on Ukraine to invade! Look for the blue arrow.', 1);
					playVoiceSound(48, $scope.muteSound);
					var e = document.getElementById('arrow');
					e.style.display='block';
					e.style.position='absolute';
					e.style.left=(657).toString()+'px';
					e.style.top=(340).toString()+'px';
					return;
				}
				if($scope.user.rank<2 && $scope.currentPlayer.status!='Attack' && (terr.nation != $scope.currentPlayer.nation ||!terr.capital)) {
					if($scope.currentPlayer.money>10) {
						showAlertPopup('Click on '+$scope.nations[$scope.currentPlayer.nation]+' to conduct purchases.', 1);
						highlightCapital($scope.currentPlayer.nation);
					} else
						showAlertPopup('Press "Purchase Complete" at the top.', 1);
					return;
				}
				if($scope.user.rank<=2 && $scope.currentPlayer.status=='Attack' && terr.owner != $scope.currentPlayer.nation && terr.owner>0) {
					playSound('error.mp3', 0, $scope.muteSound);
					militaryAdvisorPopup('This country is owned by '+$scope.superpowers[terr.owner]+'. You cannot attack other players until round 6. Find an enemy country to invade. These are the ones with an "N" on them or ones that have faded flags.');
					return;
				}
			}
		}
		$scope.battleHasEnded=false;
		$scope.unitDetailFlg=false;
		refreshTerritoryHeavy(terr, true);
		
		if(terr.unloadedCargo && terr.unloadedCargo.length>0) {
			console.log('unloadedCargo!!', terr.unloadedCargo);
			$scope.terrNeedsToBeClickedFlg=false;
			terr.unloadedCargo.forEach(function(unit) {
				if(unit.type==1) {
					if(terr.cargoSpace>0) {
						showAlertPopup('Attempting to load cargo.');
						loadUnitOntoTransport(unit, terr);
					} else
						showAlertPopup('Unable to load cargo.');
				} else {
					if(terr.carrierSpace>0) {
						loadFighterOntoCarrier(unit, terr);
					} else {
						$scope.strandedCargoAtId = terr.id;
						showAlertPopup('Stranded unit. Click on correct territory for this fighter.',1);
					}
				}
			});
		}
		if(terr.strandedCargo && terr.strandedCargo.length>0) {
			var fixedFlg=true;
			terr.strandedCargo.forEach(function(unit) {
				if(unit.cargoOf>0) {
					var terrId = getTerrOfUnitId(unit.cargoOf);
					if(terrId>0)
						unit.terr=terrId;
					else
						fixedFlg=false;
				} else
					fixedFlg=false;
			});
			if(fixedFlg)
				showAlertPopup('Standed Cargo. Fixed',1);
			else {
				$scope.strandedCargoAtId = terr.id;
				showAlertPopup('Stranded Cargo. Click on correct territory for this cargo.',1);
			}
			
		}
		if(terr.cargoSpace>0 && terr.cargoTypeUnits>0 && terr.nation==99)
			doubleCheckCargo(terr);
		if($scope.selectedTerritory)
			highlightTerritory($scope.selectedTerritory.id, $scope.selectedTerritory.owner, false); // turn off existing one
		highlightTerritory(terr.id, terr.owner, true); // turn on new one


		$scope.showNationArrows=false;
		document.getElementById('selectAllId').checked=false;
		displayLeaderInfo(terr);
		$scope.loadPlanesFlg = $scope.gameObj.currentNation==terr.owner && terr.bomberCount>0;
		$scope.loadBoatsFlg = $scope.gameObj.currentNation==terr.owner && terr.nation==99;



		if($scope.loadBoatsFlg) {
			var loadBoatsFlg=false;
			var borders=terr.borders.split('+');
			borders.forEach(function(terrId) {
				var t = $scope.gameObj.territories[terrId-1];
				if(t.generalFlg || t.leaderFlg)
					loadBoatsFlg=true;
			});
			$scope.loadBoatsFlg=loadBoatsFlg;
		}
		$scope.attDice=[];
		$scope.bonusUnits=0;
		hideArrow();
		disableCompleteButtons();
		disableButton('okButton', true);
		disableButton('fightButton', false);
		disableButton('cancelAttackButton', false);
		disableButton('addMoreButton', false);
		disableButton('autoButton', false);
		$scope.hostileMessage='';
		$scope.popupOpen = true;
		var obj = getTerritoryType($scope.yourPlayer, terr);
		//console.log($scope.yourPlayer, obj);
		$scope.territoryType = obj.territoryType;
//		$scope.territoryType = 'Unknown';
		var player = $scope.yourPlayer;
		if(player) {
			disableButton('loadPlaneButton', terr.bomberCount==0);
			if($scope.currentPlayer)
				disableButton('cruiseButton', !$scope.currentPlayer.cruiseButton);
			else
				disableButton('cruiseButton', false);
			disableButton('attackButton', false);
			disableButton('nukeButton', false);
		}
		$scope.showLeaderMessage=!($scope.territoryType=='Your Empire');
		$scope.limitedView=false;
		$scope.optionType = 'units';
		$scope.attackInfoHelp = false;
		$scope.selectedTerritory=terr;
		$scope.selectedTerritory.units=unitsForTerr(terr);
		$scope.militaryUnits = militaryUnitsFromLine($scope.selectedTerritory.units, $scope.gUnits);
		$scope.displayQueue=getDisplayQueueFromQueue(terr);
		$scope.facBombedFlg=(terr.facBombed && noUnitInQueue($scope.displayQueue, 19));
		
		if(terr.battleId>0) {
			$scope.selectedBattle = getItem($scope.gameObj.battles, terr.battleId);
			if($scope.selectedBattle) {
				$scope.defendingUnits = $scope.selectedBattle.defendingUnits;
				$scope.optionType='battlefield';
				console.log('$scope.battle.round', $scope.battle.round);
//				$scope.battle.battleboardVisible=true;
				warAudio.currentTime=0;
				if(isSoundOn() &&!$scope.muteSound)
					warAudio.play();
			}
		}
		var player=playerOfNation($scope.gameObj.currentNation);
		var tStatus = treatyStatusForTerr(player, terr);
		var statuses = ['War', 'Neutral','Peace','Alliance','You'];
		$scope.treatyStatus=statuses[tStatus];

		if($scope.currentPlayer.status==gStatusPurchase && terr.owner==player.nation && $scope.ableToTakeThisTurn && $scope.selectedTerritory.nation<99)
			$scope.optionType='production';
		$scope.selectedTerritory.seaZoneName = seaZoneForTerr($scope.selectedTerritory);

		$scope.showProductionForm=false;
		var prodNum=0;
		if($scope.currentPlayer && $scope.ableToTakeThisTurn && $scope.currentPlayer.status=='Purchase') {
			if(terr.id<79) {
				$scope.showProductionForm=(terr.owner==$scope.currentPlayer.nation);
			} else {
				var borders=terr.borders.split("+");
				borders.forEach(function(tid) {
					var t = $scope.gameObj.territories[tid-1];
					if(t.id<79 && t.owner==$scope.currentPlayer.nation && t.factoryCount>0) {
						$scope.optionType='production';
						$scope.selectedFactoryTerr=t;
						$scope.showProductionForm=true;
						prodNum=99;
					}
				});
			}
		}
		$scope.changeProdType(prodNum);
//		$scope.showTopUnits=(terr.unitCount>=12 || !$scope.ableToTakeThisTurn);
		$scope.showTopUnits=true;
		$scope.showBottomUnits=(terr.unitCount<12 || !$scope.ableToTakeThisTurn);
		disableButton('changeSeaButton', false);
		if($scope.adminMode)
			console.log('terr', terr);
		displayTerrPopup('territoryPopup', terr);
		checkPurchaseButtons();
		if($scope.gameObj.gameOver) {
			$scope.ableToTakeThisTurn=false;
		}
	}
	function doubleCheckCargo(terr) {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==terr.id && unit.type==3) {
				makeSureCargoIsLoaded(unit);
			}
		});
	}
	function makeSureCargoIsLoaded(transport) {
		var cargo=[];
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.cargoOf==transport.id) {
				cargo.push(unit);
			}
		});
		if(cargo.length>0 && (!transport.cargo || cargo.length!=transport.cargo.length))
			transport.cargo=cargo;
	}
	function getTerritoryType(player, terr) {
		var territoryType = 'n/a';
		var isAlly=false;
		if(player) {
			if(terr.owner>0 && (terr.nation<99 || terr.unitCount>0)) {
				var status = treatyStatus(player, terr.owner);
				isAlly = (status>=3);
				if(status==0)
					territoryType = 'War!';
				if(status==1)
					territoryType = 'Non-Agression';
				if(status==2)
					territoryType = 'Peace';
				if(status>2)
					territoryType = 'Ally';
			}
			if(terr.owner==player.nation)
				territoryType = 'Your Empire';
			if(terr.nation==99 && terr.unitCount==0)
				territoryType = 'Water Zone';
			if(terr.nation==0 && terr.owner==0)
				territoryType = 'Neutral';
			if(terr.nation>0 && terr.nation<99 && terr.owner==0)
				territoryType = 'Independent';
		}
		var obj = {territoryType: territoryType, isAlly: isAlly};
		return obj;
	}
	function noUnitInQueue(displayQueue, id) {
		for(var x=0; x<displayQueue.length; x++) {
			var pUnit = displayQueue[x];
			if(pUnit.piece==19)
				return false;
		}
		return true;
	}
	$scope.moveTerrPopup=function() {
		$scope.showNationArrows=true;
		$scope.showLeaderMessage=true;
		displayTerrPopup('territoryPopup', $scope.selectedTerritory, true);
	}
	function getDisplayQueueFromQueue(terr) {
		if(!terr)
			return [];
		var queue=[];
		var pieceHash={};
		if(!$scope.gameObj.unitPurchases)
			showAlertPopup('whoa!!!, no $scope.gameObj.unitPurchases', 1);

		$scope.gameObj.unitPurchases.forEach(function(unit) {
			if(unit.terr==terr.id) {
				if(pieceHash[unit.piece]>0)
					pieceHash[unit.piece]++;
				else
					pieceHash[unit.piece]=1;
			}
		});
		var keys = Object.keys(pieceHash);
		for(x=0;x<keys.length;x++) {
			var piece = keys[x];
			queue.push({piece: piece, count: pieceHash[piece]});
		}
		return queue;
	}
	function seaZoneForTerr(terr) {
		var zoneId = $scope.selectedTerritory.seaZoneId || 0;
		if(zoneId==0) {
			var borders=terr.borders.split('+');
			for(var x=0;x<borders.length;x++) {
				var id = borders[x];
				if(zoneId==0 && id>=79) {
					zoneId=id;
					$scope.selectedTerritory.seaZoneId=id;
				}
			}
		}
		var name='N/A';
		if(zoneId>0)
			name=$scope.gameObj.territories[zoneId-1].name;
		return name;
	}
	$scope.changeSeaZone = function() {
		var zoneId=0;
		var oldZoneId = $scope.selectedTerritory.seaZoneId;
		var next=false;
		var firstZoneId=0;
		var borders=$scope.selectedTerritory.borders.split('+');
		for(var x=0;x<borders.length;x++) {
			var id = borders[x];
			if(next && zoneId==0 && id>=79)
				zoneId=id;
			if(firstZoneId==0 && id>=79)
				firstZoneId=id;
			if(oldZoneId==id)
				next=true;
		}
		if(zoneId==0)
			zoneId=firstZoneId;
		if(zoneId>0 && zoneId!=oldZoneId) {
			$scope.selectedTerritory.seaZoneName = $scope.gameObj.territories[zoneId-1].name;
			$scope.selectedTerritory.seaZoneId=zoneId;
		} else
			disableButton('changeSeaButton', true);
	}
	$scope.changeTerrFlag=function(nation) {
		playClick($scope.muteSound);
		if($scope.selectedTerritory.id>79) {
			$scope.selectedTerritory.owner=nation;
			refreshTerritory($scope.selectedTerritory);
		} else 
			showAlertPopup('error!');
	}
	$scope.offerTreaty=function(type, nation) {
		if($scope.treatyMinimized || $scope.treatyOffered) {
			showAlertPopup('Finish existing diplomacy first!',1);
			return;
		}
		playClick($scope.muteSound);
		disableButton('peaceButton', true);
		disableButton('allianceButton', true);
		if(!nation || nation==0)
			nation=$scope.selectedTerritory.owner;
		var p2 = playerOfNation(nation);
		var p1TopFlg = ($scope.currentPlayer.nation==$scope.gameObj.top1Nation || $scope.currentPlayer.nation==$scope.gameObj.top2Nation);
		var p2TopFlg = (p2.nation==$scope.gameObj.top1Nation || p2.nation==$scope.gameObj.top2Nation);
		closeThePopup();
		if(p1TopFlg && p2TopFlg && type==3) {
			showAlertPopup('Sorry, top 2 players cannot ally.');
			return;
		}
		$scope.currentPlayer.diplomacyFlg=true;
		attemptDiplomacy($scope.currentPlayer, p2.turn-1);
	}
	$scope.declareWar=function() {
		playClick($scope.muteSound);
		closeThePopup();
		closePopup('declareWarPopup');
		var player = $scope.gameObj.players[$scope.gameObj.turnId-1];
		var p2 = playerOfNation($scope.selectedTerritory.owner);
		if(player.nation==p2.nation)
			return;
		var status=player.treaties[p2.nation-1];
		if(status==3 && !$scope.gameObj.allowAlliances) {
			showAlertPopup('You cannot declare war on an ally in a locked game',1);
			return;
		}
		if(p2)
			changeTreaty(player, p2, 0);
	}
	function changeTreaty(p1, p2, type) {
		if(!p1 || !p2) {
//			console.log('+++++++changeTreaty+++', p1, p2);
			return;
		}
		if(p1.nation==p2.nation)
			return;
		if(p1.treaties[p2.nation-1]==type && p2.treaties[p1.nation-1]==type)
			return; //already done!
		p1.treaties[p2.nation-1]=type;
		p2.treaties[p1.nation-1]=type;
		logDiplomacyNews(p1, p2, type);
		if(type==0) {
			var msg = $scope.superpowers[p1.nation]+' has declared war on '+$scope.superpowers[p2.nation];
			logItem(p1, 'Diplomacy', msg);
			popupMessage(p1, msg, p2);
			if(p2.nation==$scope.gameObj.currentNation)
				showAlertPopup($scope.superpowers[p1.nation]+' has declared war on you!');
		}
		if(type==1)
			logItem(p1, 'Diplomacy', $scope.superpowers[p1.nation]+' has cancelled the alliance with '+$scope.superpowers[p2.nation]);
		if(type==2)
			logItem(p1, 'Diplomacy', $scope.superpowers[p1.nation]+' has accepted a peace treaty from '+$scope.superpowers[p2.nation]);
			
		if(type==3) {
			logItem(p1, 'Diplomacy', $scope.superpowers[p1.nation]+' has accepted an alliance with '+$scope.superpowers[p2.nation]);
			playSound('bell.mp3', 0, $scope.muteSound);
			transferAllianceLand(p1, p2);
			transferAllianceLand(p2, p1);
		}
	}
	function logDiplomacyNews(p1, p2, type) {
		if(!p2.news)
			p2.news=[];
		p2.news.push({nation: p1.nation, type: type});
	}
	function transferAllianceLand(p1, p2) {
		p1.territories.forEach(function(terr) {
			if(terr.nation==p2.nation) {
				terr.owner=p2.nation;
				refreshTerritory(terr);
			}
		});
	}
	$scope.purchaseTechnologyClicked = function(num) {
		playClick($scope.muteSound);
		var tech = purchaseTechnology(num);
		if(tech<18)
			showAlertPopup($scope.technology[tech-1].name+ ' Aquired!');
	}
	function purchaseTechnology(num) {
		var player = $scope.gameObj.players[$scope.gameObj.turnId-1];
		if(player.tech.length==0)
			player.tech=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
		if(num==0)
			num=getRandomTech(player);
		if(num==0)
			return;
			
		player.tech[num-1]=true;
		chechTechnologyButtons(player);
		logItem(player, 'Technology', $scope.technology[num-1].name);
		if(num==17) {
			console.log('Air defense!!!!!');
			$scope.gameObj.airDefenseTech[player.nation]=true;
			refreshPlayerTerritories(player);
		}
		return num;
	}
	function refreshPlayerTerritories(player) {
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.owner==player.nation) {
				refreshTerritory(terr);
			}
		});
	}
	function getRandomTech(player) {
		for(var x=0; x<=100; x++) {
			var diceRoll=Math.floor((Math.random() * 6)+1);
			var tech=diceRoll*3-2;
			if(!player.tech[tech-1])
				return tech;
			tech++;
			if(!player.tech[tech-1])
				return tech;
			tech++;
			if(!player.tech[tech-1])
				return tech;
		}
		return 0;
	}
	function chechTechnologyButtons(player) {
		disableButton('techButton1', player.tech[18] || player.money<10);
		disableButton('techButton2', player.tech[19] || player.money<10);
		if(!$scope.gameObj.unitPurchases)
			showAlertPopup('whoa, no $scope.gameObj.unitPurchases', 1);
		$scope.gameObj.unitPurchases.forEach(function(pUnit) {
			if(pUnit.piece==16)
				disableButton('techButton1', true);
			if(pUnit.piece==17)
				disableButton('techButton2', true);
		});
		var count=0;
		for(var x=0; x<18; x++) {
			if(player.tech[x])
				count++;
		}
		$scope.techCount=count+$scope.techsBoughtThisTurn;
		disableButton('techButton3', ($scope.techCount>=18 || player.money<10));
	}
	$scope.unitHPBar = function(unit) {
		var width = unit.hp*40/100;
		var c = '#080';
		if(unit.hp<100)
			c = '#0c0';
		if(unit.hp<50)
			c = '#cc0';
		if(unit.hp<25)
			c = '#c00';
		return {'background-color': c, 'width': width+'px', 'height': '6px'}
	}
	$scope.tranferButtonClicked=function() {
		if($scope.selectedTerritory.defeatedByRound==$scope.gameObj.round) {
			closeThePopup();
			showAlertPopup('You cannot transfer a country you just conquered.', 1);
			return;
		}
		if(areUnitsBuildHere($scope.selectedTerritory)) {
			closeThePopup();
			showAlertPopup('You cannot transfer this turn because you have units being built here.', 1);
			return;
		}
		playClick($scope.muteSound); 
		populateAllies($scope.currentPlayer);
		$scope.optionType = ($scope.optionType=='transfer')?'none':'transfer';
	}
	function areUnitsBuildHere(terr) {
		var flag=false;
		$scope.gameObj.unitPurchases.forEach(function(unitP) {
			if(unitP.terr==terr.id)
				flag=true;
		});
		return flag;
	}
	$scope.transferToAlly=function(ally) {
		if(areUnitsBuildHere($scope.selectedTerritory)) {
			showAlertPopup('You cannot transfer this country because you have troops in production',1);
			return;
		}
		playClick($scope.muteSound); 
		transferControlOfTerr($scope.selectedTerritory, ally.nation);
		logItem($scope.currentPlayer, 'Transfer', $scope.selectedTerritory.name+' transferred to '+$scope.superpowers[ally.nation]);
		closeThePopup();
	}
	$scope.requestTranferButtonClicked=function() {
		if($scope.selectedTerritory.nation>0 && $scope.selectedTerritory.nation==$scope.selectedTerritory.owner) {
			showAlertPopup('Sorry, you cannot transfer original territories of a superpower.',1);
			return;
		}
		playClick($scope.muteSound); 
		$scope.optionType = ($scope.optionType=='requestTranfer')?'none':'requestTranfer';
	}
	$scope.requestFortifyButtonClicked=function() {
		playClick($scope.muteSound);
		$scope.allyIndex=0;
		$scope.fortifyNation=$scope.currentPlayer.allies[0];
		$scope.currentPlayer.allies.forEach(function(nation) {
			if(nation===$scope.selectedTerritory.owner)
				$scope.fortifyNation=nation;
		});
		$scope.optionType = ($scope.optionType=='requestForitfy')?'none':'requestForitfy';
	}
	$scope.requestTargetButtonClicked=function() {
		playClick($scope.muteSound);
		$scope.allyIndex=0;
		$scope.fortifyNation=$scope.currentPlayer.allies[$scope.allyIndex];
		$scope.optionType = ($scope.optionType=='requestTarget')?'none':'requestTarget';
	}
	$scope.changeTargetNationButtonClicked=function(num) {
		playClick($scope.muteSound);
		if(!$scope.allyIndex)
			$scope.allyIndex=0;
		$scope.allyIndex++;
		if($scope.allyIndex>=$scope.currentPlayer.allies.length)
			$scope.allyIndex=0;
		$scope.fortifyNation=$scope.currentPlayer.allies[$scope.allyIndex];
	}
	$scope.requestFortifyConfirmButtonClicked=function(num) {
		playClick($scope.muteSound); 
		var player = playerOfNation($scope.fortifyNation);
		if(num==1 && player.requestedHotSpot==$scope.selectedTerritory.id) {
			showAlertPopup('This ally already has this spot fortified!',1);
			return;
		}
		if(num==2 && player.requestedTarget==$scope.selectedTerritory.id) {
			showAlertPopup('This ally already has this set as a target!',1);
			return;
		}
		if(num==1) {
			player.requestedHotSpot=$scope.selectedTerritory.id;
			$scope.selectedTerritory.requestedHotSpot=player.nation;
		} else {
			player.requestedTarget=$scope.selectedTerritory.id;
			$scope.selectedTerritory.requestedTarget=player.nation;
		}
		if(!player.botRequests)
			player.botRequests=[];
		player.botRequests.push({type: num, fromN: $scope.currentPlayer.nation, terr: $scope.selectedTerritory.id});
		closeThePopup();
		showAlertPopup('Request Sent!');
	}
	$scope.requestTranferConfirmButtonClicked=function() {
		$scope.selectedTerritory.requestTransfer=$scope.currentPlayer.nation;
		closeThePopup();
		showAlertPopup('Request Sent!');
	}
	$scope.diplomacyButtonClicked = function() {
		playClick($scope.muteSound); 
		$scope.optionType = ($scope.optionType=='diplomacy')?'none':'diplomacy';
	}
	$scope.topMenuButtonClicked = function() {
		playClick($scope.muteSound); 
		$scope.optionType = 'none';
	}
	$scope.moveButtonClicked = function(loadShipsFlg) {
		if($scope.selectedTerritory.attackedByNation && $scope.selectedTerritory.attackedByNation==$scope.gameObj.currentNation && $scope.selectedTerritory.attackedRound==$scope.gameObj.round && $scope.selectedTerritory.id<79) {
			showAlertPopup('You cannot move troops into a territory you just attacked', 1);
			return;
		}
		if(loadShipsFlg)
			$scope.goButton='Load These Units';
		else
			$scope.goButton='Go!';

		playClick($scope.muteSound);
		$scope.optionType = 'movement';
		showUnitsForMovement('move');
	}
	$scope.loadPlanesButtonClicked = function(cobraFlg) {
		$scope.cobraFlg=cobraFlg;
		if($scope.selectedTerritory.attackedByNation && $scope.selectedTerritory.attackedByNation==$scope.gameObj.currentNation && $scope.selectedTerritory.attackedRound==$scope.gameObj.round && $scope.selectedTerritory.id<79) {
			showAlertPopup('You cannot move troops into a territory you just attacked', 1);
			return;
		}
		$scope.goButton='Load!';
		playClick($scope.muteSound);
		$scope.optionType = 'loadPlanes';
		showUnitsForMovement('loadPlanes');
	}
	$scope.unloadPlanesButtonClicked=function() {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==$scope.currentPlayer.nation && unit.terr==$scope.selectedTerritory.id) {
				if(unit.piece==7 || unit.piece==50)
					unit.cargo=[];
				if(unit.cargoOf && unit.cargoOf>0)
					unit.cargoOf=0;
			}
		});
		$scope.closeTerrPopup();
	}
	$scope.loadButtonClicked = function() {
		$scope.goButton='Load!';
		playClick($scope.muteSound);
		$scope.optionType = 'loadUnits';
		showUnitsForMovement('loadUnits');
	}
	$scope.attackButtonClicked = function() {
		if($scope.selectedTerritory.capital && $scope.gameObj.round<$scope.gameObj.attack && $scope.currentPlayer.cap>1) {
			showAlertPopup("Can't attack more than one capital until round "+$scope.gameObj.attack+".", 1);
			return;
		}
		$scope.subsDove=false;
		hostileAct('Send into Battle!', 'attack');
	}
	$scope.cruiseButtonClicked = function() {
		hostileAct('Launch Missiles', 'cruise');
	}
	$scope.nukeButtonClicked = function() {
		hostileAct('Launch Nuke!', 'nuke');
	}
	$scope.addMoreButtonClicked = function() {
		$scope.optionType = 'attack';
		$scope.goButton='Send into Battle!';
	}
	$scope.bombButtonClicked = function() {
		hostileAct('Bomb!', 'bomb')
	}
	function hostileAct(buttonName, type) {
		if($scope.bettleTerrId && $scope.bettleTerrId>0) {
			var t=$scope.gameObj.territories[$scope.bettleTerrId-1];
			showAlertPopup('Battle in '+t.name+' wrapping up. One moment please.',1);
			return;
		}
		if($scope.currentBattleTerrId && $scope.currentBattleTerrId>0 && $scope.currentBattleTerrId != $scope.selectedTerritory.id) {
			var terr=$scope.gameObj.territories[$scope.currentBattleTerrId-1];
			showAlertPopup('Complete battle in '+terr.name+' first.', 1);
			return;
		}
		playClick($scope.muteSound);
		$scope.attackSequence=0;
		$scope.limitedView=true;
		if($scope.gameObj.gameOver) {
			showAlertPopup("Game has ended.", 1);
			return;
		}
		if($scope.currentPlayer.status ==gStatusPlaceUnits) {
			showAlertPopup("No attacks allowed in Place Unit phase.", 1);
			return;
		}
		if(type=='bomb' && $scope.selectedTerritory.bombed) {
			showAlertPopup("This country has already been bombed.", 1);
			return;
		}
		if($scope.gameObj.round != $scope.selectedTerritory.defeatedByRound && $scope.selectedTerritory.owner>0 && type=='attack' && $scope.gameObj.round==$scope.gameObj.attack && $scope.selectedTerritory.nation<99) {
			if($scope.currentPlayer.attackFlg) {
				showAlertPopup("In the limited attack round, you can only take over one player nation.", 1);
				return;
			}
			var defender = playerOfNation($scope.selectedTerritory.owner);
			if(defender.defenseFlg) {
				showAlertPopup("This player has already lost one nation in the limited attack round.", 1);
				return;
			}
		}

		$scope.showTopUnits=false;
		$scope.showBottomUnits=false;
		$scope.selectedTerritory.leaderMessage = "What are you doing?";
		$scope.hostileMessage='';
		if(!$scope.currentPlayer.treatiesAtStart)
			$scope.currentPlayer.treatiesAtStart=[0,0,0,0,0,0,0,0];
		var status = 0;
		if($scope.currentPlayer.treatiesAtStart && $scope.currentPlayer.treatiesAtStart.length>$scope.selectedTerritory.owner-1)
			status = $scope.currentPlayer.treatiesAtStart[$scope.selectedTerritory.owner-1];
		if(status==1)
			$scope.hostileMessage='You were not at war with this player at the start of your turn. It will cost you 5 coins to attack this turn. Or you can declare war this turn and attack for free next turn.';
		if(status==2)
			$scope.hostileMessage='You were not at war with this player at the start of your turn. It will cost you 10 coins to attack this turn. Or you can declare war this turn and attack for free next turn.';
		if(status==3)
			$scope.hostileMessage='You were not at war with this player at the start of your turn. It will cost you 15 coins to attack this turn. Or you can declare war this turn and attack for free next turn.';
		if((type=='attack' || type=='nuke' || type=='cruise') && $scope.selectedTerritory.attackedByNation==$scope.gameObj.currentNation && $scope.selectedTerritory.attackedRound==$scope.gameObj.round) {
			showAlertPopup("Can't attack the same territory twice.", 1);
			return;
		}
		if($scope.selectedTerritory.owner>0 && $scope.gameObj.round<$scope.gameObj.attack) {
			showAlertPopup("Can't attack other players until round "+$scope.gameObj.attack+". Territories with an 'N' flag or faded flag can be attacked this round.", 1);
			return;
		}
		if($scope.selectedTerritory && $scope.currentPlayer && $scope.selectedTerritory.owner != $scope.currentPlayer.nation) {
			if($scope.selectedTerritory.owner>0 && treatyStatusForTerr($scope.currentPlayer, $scope.selectedTerritory)>0) {
				if($scope.user.rank==0 || $scope.selectedTerritory.nation == $scope.currentPlayer.nation) {
					var p2 = playerOfNation($scope.selectedTerritory.owner);
					changeTreaty($scope.currentPlayer, p2, 0);
					$scope.hostileMessage='';
					$scope.currentPlayer.treatiesAtStart[$scope.selectedTerritory.owner-1]=0;
				} else {
					displayFixedPopup('declareWarPopup', 1);
					return;
				}
			}
		}
		$scope.goButton=buttonName;
		$scope.optionType = ($scope.optionType==type)?'none':type;
		var e = document.getElementById('selectAllId');
		if(e)
			e.checked=false;
		showUnitsForMovement(type); 
	}
	function treatyStatusForTerrOrWar(p1, terr) {
		if(terr.nation==p1.nation)
			return 3; // used to be 0
		if($scope.gameObj.type=='freeforall' && $scope.gameObj.round>40 && p1.cpu && terr.owner>0) {
			var p2 = playerOfNation(terr.owner);
			if(p2.cpu) {
				changeTreaty(p1, p2, 2);
				return 2; //peace
			} else {
				if(treatyStatus(p1, terr.owner)>0)
					changeTreaty(p1, p2, 0);
				return 0;
			}
		}
		var status = treatyStatusForTerr(p1, terr);
		if(status==0 || status==3)
			return status;
		
		if($scope.gameObj.round>=6) {
			var p2 = playerOfNation(terr.owner);
			if(!p2 || p2.nation==0)
				return 0;
			if(status==1) {
				changeTreaty(p1, p2, 0);
				return 0;
			}
			if(p2.cpu) {
				changeTreaty(p1, p2, 0);
				return 0;
			} else {
				var numAtWar=getNumberAtWar(p2);
				if(numAtWar>0 && $scope.gameObj.round==6)
					return 2;
				if(numAtWar>0 && $scope.gameObj.round==7)
					return 2;
				if(numAtWar>1 && $scope.gameObj.round==8)
					return 2;
				if(numAtWar>1 && $scope.gameObj.round==9)
					return 2;
				if($scope.gameObj.round-numberVal(p1.lastRoundsOfWar[p2.nation-1])>3) {
					changeTreaty(p1, p2, 0);
					return 0;
				}
			}
		}
	
		
		return status;
	}
	function getNumberAtWar(p) {
		var count=0;
		p.treaties.forEach(function(t) {
			if(t==0)
				count++;
		});
		return count;
	}
	function treatyStatusForTerr(p1, terr) {
		if(terr.owner==0 || !p1)
			return 0;
		if(terr.owner==p1.nation)
			return 4; //self
		
		return treatyStatus(p1, terr.owner);
	}
	function treatyStatus(p1, nation) {
		if(!p1)
			return 0;
		if(p1.nation==nation)
			return 4;
		if(!p1.treaties)
			return 0;
		
		return p1.treaties[nation-1];
//		var t2=-1;
//		if(p1.treatiesAtStart && p1.treatiesAtStart.length>=8)
//			t2 = p1.treatiesAtStart[nation-1];
//		return t1;
	}
	function treatyStatusAtStart(p1, nation) {
		if(!p1)
			return 0;
		if(p1.nation==nation)
			return 4;
		if(!p1.treaties)
			return 0;
		
		if(p1.treatiesAtStart && p1.treatiesAtStart.length>=8)
			return p1.treatiesAtStart[nation-1];
		else
			return p1.treaties[nation-1];;
	}
	function disableGlowButton(id, flag) {
		if(flag)
			changeClass(id, 'btn ptp-green roundButton');
		else
			changeClass(id, 'glowButton');
		disableButton(id, flag);
	}
	function showUnitsForMovement(type) {
		$scope.unitProgressFlg=true;
		$scope.loadingFlg=true;
		disableGlowButton('sendButton', true);
		setTimeout(function() { $scope.$apply(); }, 1);
		setTimeout(function() { 
			var obj = showUnitsForMovementBG(type, $scope.gameObj.units, $scope.currentPlayer, $scope.gameObj.territories, $scope.selectedTerritory, $scope.goButton, $scope.gameObj.round, $scope.currentPlayer, $scope.optionType, $scope.svgs);
			$scope.svg = $scope.svgs[2]; //ngStyleSVG2
			$scope.moveTerr = obj.moveTerr;
			$scope.totalUnitsThatCanMove = obj.totalUnitsThatCanMove;
			$scope.unitProgressFlg=false;
			$scope.loadingFlg=false;
			$scope.$apply();
		}, 20);
	}
	function unitsForTerr(terr) {
		var units = $scope.gameObj.units;
		var tUnits = [];
		for(var x=0; x<units.length; x++) {
			var unit = units[x];
			if(unit.terr == terr.id) {
				tUnits.push(unit);
			}
		}
		return tUnits;
	}
	$scope.showTeamsClicked=function(teamDisplayFlg) {
		$scope.teamDisplayFlg=teamDisplayFlg;
		changeClass('treatyButton', (teamDisplayFlg)?'btn ptp-blue roundButton':'btn ptp-yellow roundButton');
		changeClass('teamButton', (!teamDisplayFlg)?'btn ptp-blue roundButton':'btn ptp-yellow roundButton');
	}
	$scope.changeFilter=function(num) {
		console.log('changeFilter');
		console.log(num);
	}
	$scope.showStatsClicked=function(showStatsFlg) {
		$scope.showStatsFlg=showStatsFlg;
		changeClass('showPlayerButton', (showStatsFlg)?'btn ptp-blue roundButton':'btn ptp-yellow roundButton');
		changeClass('incomeButton', (!showStatsFlg)?'btn ptp-blue roundButton':'btn ptp-yellow roundButton');
	}
	$scope.incomeInfoClicked=function() {
		$scope.showIncomeInfo=!$scope.showIncomeInfo;
		if($scope.showIncomeInfo && !$scope.showStatsFlg)
			$scope.showStatsClicked(true);
	}
	$scope.ngStyleWinners=function(winFlg, gameOverFlg) {
		if(gameOverFlg) {
			if(winFlg)
				return {'background-color': '#cfc'};
			else
				return {'background-color': '#fcc'};
		}
	}
	$scope.toggleShowTech=function() {
		$scope.showTechDesc=!$scope.showTechDesc;
	}
	$scope.showInfoClicked=function() {
		playClick($scope.muteSound);
		$scope.showInfoFlag=!$scope.showInfoFlag;
	}
	$scope.playersPopupClicked=function() {
		var left = window.innerWidth-55;
		if(left>=1282) {
			$scope.openCloseSlider('players');
		} else {
			var e = document.getElementById("sidelinePopup");
			if(e) {
				var left = window.innerWidth-55;
				if(left>1282)
					left=1282;
				var currentLeft = numberVal(e.style.left.replace('px',''));
				if(currentLeft==0)
					e.style.left=left+'px';
				else
					e.style.left='0';
			}
		}
	}
	$scope.aiTakeTurn=function(noCloseFlag) {
		if(!noCloseFlag)
			$scope.openCloseSlider('menu1');
		if($scope.gameObj.multiPlayerFlg)
			showConfirmationPopup('Allow Computer to take this turn?', 'confirmAiTakeTurn');
		else
			skipTurn();
	}
	$scope.territoriesPopup=function() {
		$scope.openCloseSlider('menu1');
		$scope.openCloseSlider('territories');
		activateTerritoriesPanel();
	}
	function startUpBackgroundViewer() {
		console.log('+++startUpBackgroundViewer+++', $scope.ableToTakeThisTurn, $scope.activelyViewing);
		if($scope.activelyViewing) {
			console.log('startUpBackgroundViewer already viewing');
			return;
		}
		$scope.activelyViewing=true;
		$scope.scanGameId=$scope.gameObj.id;
		showAlertPopup('Starting Viewer!');
		doBackgroundViewerCall();
	}
	function doBackgroundViewerCall() {
		if($scope.scanGameId != $scope.gameObj.id)
			return;
		var e = document.getElementById("eyeButton");
		if(!e) {
			$scope.activelyViewing=false;
			return;
		}
		console.log('viewing');
		var url = getHostname()+"/scanGameViewer.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'scanGameViewer',
	        gameId: $scope.gameObj.id,
	        lastChatId: $scope.lastChatId,
	        gameUpdDt: localStorage.gameUpdDt
	    },
	    function(data, status){
//	    	console.log(data);
		$scope.viewerScanFlg=false;
		if(verifyServerResponse(status, data)) {
			var items = data.split("|");
			$scope.scanObj={};
			if(items.length>2) {
				$scope.scanObj.gameId=items[1];
				$scope.scanObj.round=items[2];
				$scope.scanObj.turn=items[3];
				$scope.scanObj.status=items[4];
				$scope.scanObj.uName=items[5];
				$scope.scanObj.chatRow_id=items[6];
				$scope.scanObj.message=items[7];
				console.log('$scope.scanObj', $scope.scanObj);
				var playerFlags = items[8].split(',');
				var playerHash={};
				playerFlags.forEach(function(pFlag) {
					var e = pFlag.split(':');
					playerHash[e[0]]=e[1];
				});
				var currentPlayerOn=false;
				$scope.gameObj.players.forEach(function(player) {
					player.onlineFlg=(playerHash[player.nation]=='Y');
					if(player.nation==$scope.currentPlayer.nation)
						currentPlayerOn = player.onlineFlg;
				});
				console.log('currentPlayerOn', currentPlayerOn);
				$scope.scanObj.gameUpdDt=items[9];
				if($scope.scanObj.gameUpdDt != localStorage.gameUpdDt) {
					localStorage.gameUpdDt=items[9];
					console.log('+++gameUpdDt+++', localStorage.gameUpdDt);
					$scope.viewerUpdatedFlg=true;
					localStorage.setItem("gameObj2", items[10]);
					localStorage.setItem("logs2", items[11]);
					localStorage.setItem("players2", items[12]);
					localStorage.setItem("territories2", items[13]);
					localStorage.setItem("units2", items[14]);
					$scope.boardHasBeenUpdated=true;
//					console.log('gameObj2', items[10]);
					$scope.redoMoves();
				}
			}
			if(!$scope.initScanObj || !$scope.initScanObj.gameId)
				$scope.initScanObj=$scope.scanObj;
			if(currentPlayerOn) {
				if($scope.scanGameId == $scope.gameObj.id)
					setTimeout(function() { doBackgroundViewerCall(); }, 8000);
			} else {
				if(!$scope.currentPlayer.cpu && $scope.gameObj.turboFlg) {
//					showAlertPopup('Player is offline. turning in cpu',1);
					showConfirmationPopup('Player is offline. Allow Computer to take this turn?', 'confirmAiTakeTurn');
//					$scope.currentPlayer.cpu=true;
//					$scope.viewerStopped=true;
//					skipTurn();
				}
			}
			$scope.$apply();
		}
	    });
	}
	$scope.openViewerButtonPressed=function(flag) {
		playClick($scope.muteSound);
		if(!flag)
			$scope.openCloseSlider('menu1');
		$scope.scanViewFlg=true;
		$scope.viewerUpdatedFlg=false;
		displayFixedPopup('realtimeViewerPopup');
		$scope.initScanObj={};
//		scanGameViewer();
	}
	/*function scanGameViewer() {
		$scope.viewerScanFlg=true;
		if(!$scope.scanViewFlg)
			return;
		var e = document.getElementById("realtimeViewerPopup");
		if(!e) {
			console.log('no e!!');
			return;
		}
	}*/
	$scope.closeViewerButtonPressed=function() {
		$scope.scanViewFlg=false;
		playClick($scope.muteSound);
		closePopup('realtimeViewerPopup')
	}
	$scope.showHistory=function() {
		playClick($scope.muteSound);
		$scope.openCloseSlider('menu1');
		displayFixedPopup('popupHistoryBoxRight');
		document.getElementById("popupHistoryBoxRight").style.right='5px';
		document.getElementById("popupHistoryBoxRight").style.top='100px';
				var left = window.innerWidth-155;
		$('#popupHistoryBoxRight').draggable();	
		document.getElementById("popupHistoryBoxRight").style.left=left+'px';
		startSpinner('History Mode...');
		stopSpinner();
		$scope.showControls=false;
		$scope.historyMode=true;
		disableButton('histPlayButton', true);
		changeClass('histPlayButton', 'btn ptp-yellow');
		$scope.historyPlayMode=false;
		$scope.timerAmount=0;
//		startTheDemo();
		readHistory();
	}
	function readHistory() {
		$scope.historyItems=[];
		$scope.historyItemIndex=0;
		var url = getHostname()+"/webHistory.php";
		$.post(url,
		{
			user_login: $scope.user.userName,
			code: $scope.user.code,
			gameId: $scope.gameObj.id,
			action: 'readHistory'
		},
		function(data, status){
			console.log('data bytes: ', data.length);
			var obj = JSON.parse(data);
			
			if(verifyServerResponse(status, obj.status)) {
				var historyLines = obj.data;
				historyLines.forEach(function(line) {
					$scope.historyItems.push(JSON.parse(line));
				});
				if($scope.historyItems.length>0)	
					loadCurrentHistoryItemData();
				else
					showAlertPopup('No History Yet!',1);
				$scope.$apply();
			}
		});
	}
	function loadCurrentHistoryItemData() {
		var histData = $scope.historyItems[$scope.historyItemIndex];
		console.log('histData', histData);
		$scope.historyRound=histData.round;
		$scope.historyNation=histData.nation;
		var flagData=histData.data;
		var x=0;
		$scope.gameObj.territories.forEach(function(terr) {
			var line1 = flagData[x++].toString();
			var line=line1;
			if(line.length==0) {
				line="0:0:0:99";
			}
			if(line.length==1 && numberVal(line)>0) {
				var nation = line;
				line = nation+":0:0:"+nation;
			}
			if(line.length==1 && numberVal(line)==0) {
				if(x>=79)
					line="0:0:0:99";
				else
					line="0:0:0:0";
			}
			var c = line.split(':');
			if(c.length>3) {
				var nation=c[0];
				var viewingNation = 0;
				var status=1;
				if($scope.yourPlayer && $scope.yourPlayer.nation>0) {
					viewingNation=$scope.yourPlayer.nation;
					status = treatyStatus($scope.yourPlayer, nation);
				}
				var unitCOunt = numberVal(c[1]);
				terr.displayUnitCount=displayCountFromCount(unitCOunt, nation, viewingNation, $scope.gameObj.fogOfWar=='Y', status, true, $scope.gameObj.hardFog=='Y', terr.illuminateFlg);
				terr.unitCount=unitCOunt;
				terr.piece=c[2];
				terr.flag = 'flag'+c[3]+'.gif';
//				console.log(terr.name, line.length, line1, line, unitCOunt, terr.flag);
			}
		});
		checkHistButtons();
		parseLogsForRound($scope.historyRound, $scope.historyNation);
		populateHistoryLogs($scope.historyRound, $scope.historyNation);
		
//		console.log('histData', histData);
	}
	function populateHistoryLogs(round, nation) {
		var currentNation=0;
		$scope.historyLog=[];
		var logs=[];
		var x=0;
		var userNameHash={}
		$scope.gameObj.players.forEach(function(player) {
			userNameHash[player.nation]=player.userName;
		});
		$scope.gameObj.logs.forEach(function(log) {
			if(log.round==round) {
				if(currentNation!=log.nation) {
					if(logs.length>0 && currentNation>0) {
						$scope.historyLog.push({nation: currentNation, user: userNameHash[currentNation], logs: logs});
						logs=[];
					}
					currentNation=log.nation;
				}
				var historyObj = getHistObj(x);
				logs.push(historyObj);
			}
			x++;
		});
		if(logs.length>0 && currentNation>0) {
			$scope.historyLog.push({nation: currentNation, user: userNameHash[currentNation], logs: logs});
		}
		$scope.historyPlayer=userNameHash[nation]
		$scope.showLogsPlayer=nation;
	}
	function checkHistButtons() {
		disableButton('histStartButton', $scope.historyItemIndex==0);
		disableButton('histPrevRoundButton', $scope.historyItemIndex==0);
		disableButton('histPrevTurnButton', $scope.historyItemIndex==0);
		disableButton('histNextTurnButton', $scope.historyItemIndex >= $scope.historyItems.length-1);
		disableButton('histNextRoundButton', $scope.historyItemIndex >= $scope.historyItems.length-1);
		disableButton('histEndButton', $scope.historyItemIndex >= $scope.historyItems.length-1);
	}
	$scope.historyChangeFrame=function(direction, roundFlg, fullFlg) {
		if(direction>0) {
			$scope.historyItemIndex++;
			if(roundFlg)
				$scope.historyItemIndex += $scope.gameObj.players.length-1;
			if(fullFlg)
				$scope.historyItemIndex = $scope.historyItems.length-1;
		} else {
			$scope.historyItemIndex--;
			if(roundFlg)
				$scope.historyItemIndex -= $scope.gameObj.players.length;
			if(fullFlg)
				$scope.historyItemIndex = 0;
		}
		if($scope.historyItemIndex<0)
			$scope.historyItemIndex=0;
		if($scope.historyItemIndex >= $scope.historyItems.length-1)
			$scope.historyItemIndex = $scope.historyItems.length-1;

		console.log($scope.historyItemIndex, $scope.historyItems.length-1);
		playClick($scope.muteSound);
		loadCurrentHistoryItemData();
	}
	function startTheDemo() {
		$scope.historyCount=0;
		$scope.historyNation = 0;
		$scope.historyRound=0;
		var playerHash = {}
		$scope.gameObj.players.forEach(function(player) {
			playerHash[player.nation]=1;
		});
		$scope.gameObj.territories.forEach(function(terr) {
			if(playerHash[terr.nation]==1)
				terr.histOwner=terr.nation;
			else
				terr.histOwner=0;
			terr.histDefeatedByNation=0;
			terr.histNuked=false;
			refreshTerritory(terr);
		});
		whiteoutScreen();
		getHistoryInfo();
	}
	function playIfNotPaused() {
		if($scope.historyPlayMode) {
			$scope.historyRound++;
			showHIstoryForCurrentRound();
		}
	}
	function showHIstoryForCurrentRound() {
		$scope.historyNation = 0;
		$scope.historyLog=[];
		disableButton('histStartButton', true);
		disableButton('histForwardButton', true);
		setTimeout(function() { showCurrentHistoryLogItem(); }, 10);
	}
/*	function playSequenceForNation() {
		getHistoryInfo();
		var nation = $scope.historyNation;
		disableButton('histStartButton', true);
		disableButton('histForwardButton', true);
		$scope.scrollToNation(nation);
		setTimeout(function() { showCurrentHistoryTurn(nation); }, $scope.timerAmount);
	}*/
	$scope.showLogsForPlayer=function(player) {
		$scope.showLogsPlayer=($scope.showLogsPlayer==player.nation)?0:player.nation;
	}
	$scope.toggleTimerView=function() {
		playClick($scope.muteSound);
		$scope.hideTimerView=!$scope.hideTimerView;
	}
	function parseLogsForRound(round, nation) {
		scrollToCapital(nation);
		var histLogs = getHistLogsForRound(round, nation); //getHistObjForRound
		histLogs.forEach(function(log) {
			var coords = capitalXY(log.historyNation);
			if(log.historyStatus=='Turn Completed') {
				playSound('clink.wav', 0, $scope.muteSound);
			}
			if(log.historyStatus=='Strategic Bombing') {
				playSound('bombersShort.mp3', 0, $scope.muteSound);
			}
			if(log.historyStatus=='Player Surrendered!') {
				var voiceId = numberVal(nation)+60;
				setTimeout(function() {playVoiceSound(voiceId, $scope.muteSound); }, 1000);
			}
			if(log.historyStatus=='Battle' || log.historyStatus=='Nuke Attack!') {
				var terr = $scope.gameObj.territories[log.log.t-1];
				var player = playerOfNation(log.historyNation);
				player.histType=log.log.type;
				player.histMessage=log.log.message;
				popupHistoryMessage(log.historyNation, log.log.message, terr.x, terr.y, log.log.type);
				if(log.historyStatus=='Battle') {
					playSound('', 2, $scope.muteSound);
				}
				if(log.historyStatus=='Nuke Attack!') {
					playSound('warning.mp3', 0, $scope.muteSound);
					animateNukeOnTerr(terr, false);
				}
			}
		});
	}
	function showCurrentHistoryLogItem() {
		if(!$scope.historyMode)
			return;
		var historyObj = getHistObj($scope.historyCount);
		if(!historyObj || !historyObj.log)
			return;
//		console.log('xxx', $scope.historyRound, $scope.historyCount, historyObj);
		
		if(historyObj.historyNation != $scope.historyNation) {
			$scope.historyNation=historyObj.historyNation;
			$scope.historyLog.push({nation: historyObj.historyNation, user: historyObj.historyPlayer, logs: []});
		}
		
		if(historyObj.historyStatus=='Turn Completed') {
			$scope.histPlayerStatus='Place Units';
			playSound('clink.wav', 0, $scope.muteSound);
		}
			
		var coords = capitalXY(historyObj.historyNation);
		var latest = $scope.historyLog[$scope.historyLog.length-1];
		latest.logs.push(historyObj);
//		$scope.histLogs.push(historyObj);
//		console.log($scope.histLogs);
		if(historyObj.historyStatus=='Technology') {
			$scope.histPlayerStatus='Purchase';
		}
		if(historyObj.historyStatus=='Purchases') {
			$scope.histPlayerStatus='Purchase';
			$scope.gameObj.territories.forEach(function(terr) {
				if(terr.histOwner==historyObj.historyNation) {
					terr.histDefeatedByNation=0;
					terr.histNuked=false;
					refreshTerritory(terr);
				}
			});
		}
		if(historyObj.historyStatus=='Battle') {
			$scope.histPlayerStatus='Attack';
			playSound('', 2, $scope.muteSound);
			var terr = territoryFromBattleLogs(historyObj);
			if(terr && terr.id && terr.id>0) {
				var terrOwner = terr.histOwner;
				if(historyObj.log.o && historyObj.log.o>0)
					terrOwner=historyObj.log.o;
				else if (historyObj.log.message.match('defeating'))
					terrOwner=historyObj.historyNation;
				terr.histOwner=terrOwner;
				terr.histDefeatedByNation=terrOwner;
				refreshTerritory(terr);
				coords={x: terr.x, y: terr.y};
			}
		}
		if(historyObj.historyStatus=='Nuke Attack!') {
			$scope.histPlayerStatus='Attack';
			playSound('warning.mp3', 0, $scope.muteSound);
			var terr = territoryFromBattleLogs(historyObj);
			if(terr && terr.id && terr.id>0) {
				terr.histNuked=true;
				refreshTerritory(terr);
				coords={x: terr.x, y: terr.y};
				animateNukeOnTerr(terr, false);
			}
		}
		if(historyObj.historyStatus=='Strategic Bombing') {
			$scope.histPlayerStatus='Attack';
			playSound('bombers.mp3', 0, $scope.muteSound);
		}
		if(historyObj.historyStatus=='Battle' || historyObj.historyStatus=='Nuke Attack!') {
			var player = playerOfNation(historyObj.historyNation);
			player.histType=historyObj.log.type;
			player.histMessage=historyObj.log.message;
			popupHistoryMessage(historyObj.historyNation, historyObj.log.message, coords.x, coords.y, historyObj.log.type);
		}

//		$scope.historyRound = historyObj.historyRound;
		$scope.historyNation = historyObj.historyNation;
		$scope.historyStatus = historyObj.historyStatus;
		$scope.historyPlayer = historyObj.historyPlayer;
		$scope.$apply();
		$scope.historyCount++;
		if($scope.gameObj.logs.length>$scope.historyCount) {
			var nextHistoryObj = getHistObj($scope.historyCount);
			setHistoryButtons();
			if(nextHistoryObj.historyRound==$scope.historyRound) {
				setTimeout(function() { showCurrentHistoryLogItem(); }, $scope.timerAmount/100);
			} else {
				if($scope.historyPlayMode)
					setTimeout(function() { playIfNotPaused(); }, $scope.timerAmount*2);
			}
		}
	}
	function territoryFromBattleLogs(historyObj) {
		if(historyObj.log.t && historyObj.log.t>0) {
			var terr = $scope.gameObj.territories[historyObj.log.t-1];
			return terr;
		} else {
			var id = findIdFromMsg(historyObj.log.message);
			if(id>0 && historyObj.log.message.match('defeating') ) {
				var terr = $scope.gameObj.territories[id-1];
				return terr;
			}
		}
	}
	function findIdFromMsg(msg) {
		for(var x=0; x<$scope.gameObj.territories.length; x++) {
			var terr=$scope.gameObj.territories[x];
			if(msg.match(terr.name))
				return x+1;
		}
		return 0;
	}
	function getHistLogsForRound(round, nation) {
		var logs=[];
		$scope.gameObj.logs.forEach(function(log) {
			if(log.round==round && log.nation==nation) {
				var histObj = {};
				histObj.log = log;
				histObj.historyRound = log.round;
				histObj.historyNation = log.nation;
				histObj.historyStatus = log.type;
				var p = playerOfNation(nation);
				histObj.historyPlayer = p.userName;
				logs.push(histObj);
			}
		});
		return logs;
	}
	function getHistObj(num) {
		var histObj = {};
		if($scope.gameObj.logs.length>num) {
			histObj.log = $scope.gameObj.logs[num];
			histObj.historyRound = $scope.gameObj.logs[num].round;
			histObj.historyNation = $scope.gameObj.logs[num].nation;
			histObj.historyStatus = $scope.gameObj.logs[num].type;
			var p = playerOfNation(histObj.historyNation);
			histObj.historyPlayer = p.userName;
		}
		return histObj;
	}
	function getHistoryInfo() {
		$scope.histLogs=[];
		if($scope.gameObj.logs.length>$scope.historyCount) {
//			$scope.historyRound = $scope.gameObj.logs[$scope.historyCount].round;
			$scope.historyNation = $scope.gameObj.logs[$scope.historyCount].nation;
			$scope.historyStatus = $scope.gameObj.logs[$scope.historyCount].type;
			var p = playerOfNation($scope.historyNation);
			$scope.historyPlayer = p.userName;
			$scope.histPlayerStatus='Purchase';
		}
		setHistoryButtons();
	}
	function setHistoryButtons() {
		disableButton('histStartButton', $scope.historyCount==0);
		disableButton('histBackButton', $scope.historyCount==0);
		disableButton('histForwardButton', $scope.historyCount==$scope.gameObj.logs.length-1 || $scope.historyPlayMode);
		disableButton('histPlayButton', ($scope.historyPlayMode || $scope.historyCount==$scope.gameObj.logs.length-1));
		disableButton('histPauseButton', (!$scope.historyPlayMode || $scope.historyCount==$scope.gameObj.logs.length-1));
		disableButton('histSpeedButton', !$scope.historyPlayMode);
	}
	$scope.historyStart=function() {
		playClick($scope.muteSound);		
		startTheDemo();
	}
	$scope.historyBack=function() {
		playClick($scope.muteSound);		
		$scope.historyCount--;
		getHistoryInfo();
	}
	$scope.historyPlay=function() {
		playClick($scope.muteSound);
		$scope.historyRound++;
		$scope.timerAmount = ($scope.speedFlg)?1000:2000;
		$scope.historyPlayMode=true;
		disableButton('histForwardButton', true);
		disableButton('histPlayButton', true);
		disableButton('histPauseButton', false);
		changeClass('histPlayButton', 'btn ptp-yellow');
		changeClass('histPauseButton', 'btn btn-primary tight roundButton');
		disableButton('histSpeedButton', !$scope.historyPlayMode);
		showHIstoryForCurrentRound();
	}
	$scope.historyPause=function() {
		playClick($scope.muteSound);
		$scope.timerAmount=250;
		$scope.historyPlayMode=false;
		disableButton('histForwardButton', false);
		disableButton('histSpeedButton', !$scope.historyPlayMode);
		disableButton('histPlayButton', false);
		disableButton('histPauseButton', true);
		changeClass('histPauseButton', 'btn ptp-yellow');
		changeClass('histPlayButton', 'btn btn-primary tight roundButton');
	}
	$scope.historyStepForward=function() {
		playClick($scope.muteSound);	
		$scope.historyRound++;
		showHIstoryForCurrentRound();
	}
	$scope.historySppedChanged=function() {
		playClick($scope.muteSound);
		$scope.speedFlg=!$scope.speedFlg;
		$scope.timerAmount = ($scope.speedFlg)?1000:2000;
		changeClass('histSpeedButton', ($scope.speedFlg)?'btn ptp-yellow':'btn btn-primary tight roundButton');
	}
	$scope.exitHistory=function() {
		playClick($scope.muteSound);
		closePopup('popupHistoryBoxRight');
		$scope.showControls=true;
		$scope.historyMode=false;
		whiteoutScreen();
		$scope.gameObj.territories.forEach(function(terr) {
			refreshTerritory(terr);
		});
	}
	
	$scope.purchasesPopup=function() {
		$scope.openCloseSlider('menu1');
		$scope.openCloseSlider('purchases');
		$scope.purchaseFactories=[];
	    	for(var x=0; x<$scope.gameObj.factories.length; x++) {
	    		var factory=$scope.gameObj.factories[x];
	    		if(factory.owner==$scope.currentPlayer.nation)
		    		$scope.purchaseFactories.push({name: $scope.gameObj.territories[factory.terr-1].name, prodQueue: queueFromProdQueue(factory.prodQueue), nation: factory.owner});
	    	}
	}
	function queueFromProdQueue(prodQueue) {
		var newQ = [];
	    	for(var x=0; x<prodQueue.length; x++) {
	    		var piece = prodQueue[x];
	    		newQ.push({id: x, piece: piece});
		}
		return newQ;
	}
	function activateTerritoriesPanel() {
		$scope.availableNations=[];
	    	for(var x=0; x<$scope.gameObj.players.length; x++) {
	    		var player=$scope.gameObj.players[x];
	    		$scope.availableNations.push(player.nation);
	    	}
	    	populateTerritoriesForNation($scope.availableNations[0]);
	}
	$scope.ngNationClass=function(nation) {
		if(nation==$scope.selectedNation)
			return 'btn ptp-yellow roundButton';
		else
			return 'btn ptp-gray roundButton';
	}
    	function populateTerritoriesForNation(num) {
	    	$scope.loadingFlg=true;
    		setTimeout(function() { populateTerritoriesForNationBG(num); }, 1);
    	}
    	function populateTerritoriesForNationBG0(num) {
	    	$scope.$apply();
    	}
    	function populateTerritoriesForNationBG(num) {
    		$scope.nationTerritories = [];
    		$scope.playerUnits=[];
    		var terrHash = {}
	    	for(var x=0; x<$scope.gameObj.units.length; x++) {
	    		var unit=$scope.gameObj.units[x];
	    		if(unit.owner==$scope.selectedNation) {
	    			$scope.playerUnits.push(unit);
	    			if(terrHash[unit.terr] && terrHash[unit.terr]==1) {
	    		} else {
	    				var fogOfWar=false;
	    				var fogOfWarBasedOnTreaty=true;
	    				if($scope.yourPlayer) {
	    					fogOfWarBasedOnTreaty = ($scope.yourPlayer.treaties[num-1]<3 && num!=$scope.yourPlayer.nation);
	    				}
	    				if($scope.gameObj.fogOfWar=='Y' && fogOfWarBasedOnTreaty)
	    					fogOfWar=true;
	    				
	    				if($scope.adminMode)
		    				fogOfWar=false; // <-- admin mode
	    				$scope.fogOfWar=fogOfWar;
	    				
	    				var terr=$scope.gameObj.territories[unit.terr-1];
	    				var unitCount = terr.displayUnitCount==1?'1 unit':terr.displayUnitCount+' units';
	    				$scope.nationTerritories.push({name: terr.name, id: unit.terr, nation: terr.nation, fogOfWar: fogOfWar, unitCount: unitCount});
	    				terrHash[unit.terr]=1;
	    			}
	    		}
	    	}
	    	$scope.loadingFlg=false;
	    	$scope.$apply();
    	}
    	$scope.changeNation=function(num) {
    		$scope.selectedNation=num;
	    	$scope.loadingFlg=true;
    		setTimeout(function() { populateTerritoriesForNationBG0(num); }, 1);
    		setTimeout(function() { populateTerritoriesForNationBG(num); }, 100);
    	}
	$scope.reportBug=function() {
		displayFixedPopup('bugReportPopup');
	}
	$scope.submitBugReport=function() {
		playClick($scope.muteSound);
		postBugReport();
	}
	function postBugReport() {
		var message = databaseSafe(document.getElementById("area1").value);
		if(message.length==0) {
			showAlertPopup('no message', 1);
			return;
		}
		closePopup('bugReportPopup');
		message = '**Bug Alert** '+message;
		document.getElementById("area1").value = '';
		startSpinner('Posting...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'postMessage',
	        message: message,
	        game_id: $scope.gameObj.id,
	        recipient: 'All',
	        bugFlg: 'Y'
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Bug Reported and will be addressed soon.');
		}
	    });
	}
	function postComputerChat(message) {
		if(message.length==0) {
			showAlertPopup('no message', 1);
			return;
		}
		message = '**Computer** '+message;
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'postMessage',
	        type: 'CPU',
	        message: message,
	        game_id: $scope.gameObj.id,
	        recipient: 'All'
	    },
	    function(data, status){
	    	console.log('postComputerChat', data);
	    });
	}
	$scope.accountSit=function() {
		showAlertPopup('This feature not coded yet.');
	}
	$scope.toggleSoundSettings=function() {
		if(document.getElementById('musicBox').checked) {
			localStorage.removeItem('musicBox');
			$scope.gameMusic.play();
		} else {
			localStorage.musicBox='N';
			$scope.gameMusic.pause();
		}
		if(document.getElementById('soundBox').checked)
			localStorage.removeItem('soundBox');
		else
			localStorage.soundBox='N';
		if(document.getElementById('voiceBox').checked)
			localStorage.removeItem('voiceBox');
		else
			localStorage.voiceBox='N';
		var musicBox=localStorage.musicBox || '';
		var soundBox=localStorage.soundBox || '';
		var voiceBox=localStorage.voiceBox || '';
		$scope.muteSound = (musicBox.length>0 && soundBox.length>0 && voiceBox.length>0);
	}
	$scope.toggleSound=function(num) { //changeAudioSettings
		playClick($scope.muteSound);
		displayFixedPopup('soundBoard');
		var musicBox=localStorage.musicBox || '';
		var soundBox=localStorage.soundBox || '';
		var voiceBox=localStorage.voiceBox || '';
		
		if(document.getElementById('musicBox') && musicBox.length==0)
			document.getElementById('musicBox').checked=true;
		if(document.getElementById('soundBox') && soundBox.length==0)
			document.getElementById('soundBox').checked=true;
		if(document.getElementById('voiceBox') && voiceBox.length==0)
			document.getElementById('voiceBox').checked=true;
		
		$scope.muteSound = (musicBox.length>0 && soundBox.length>0 && voiceBox.length>0);
		/*
		return;
		if(num==0) {
			if(!$scope.soundPresses)
				$scope.soundPresses=0;
			$scope.soundPresses++;
			$scope.muteSound=!$scope.muteSound;
			localStorage.muteSound=($scope.muteSound)?'Y':'N';
		}
		if(num==1)
			localStorage.musicBox=(localStorage.musicBox && localStorage.musicBox=='N')?'':'N';
		if(num==2)
			localStorage.soundBox=(localStorage.soundBox && localStorage.soundBox=='N')?'':'N';
			
		if(localStorage.musicBox=='N')
			changeClass('musicButton', 'btn ptp-gray tight roundButton');
		else
			changeClass('musicButton', 'btn ptp-yellow tight roundButton');
		if(localStorage.soundBox=='N')
			changeClass('soundEffectsButton', 'btn ptp-gray tight roundButton');
		else
			changeClass('soundEffectsButton', 'btn ptp-yellow tight roundButton');
		
		if(num>0 && (localStorage.musicBox=='' || localStorage.soundBox==''))
			$scope.muteSound=false;
			
		if($scope.muteSound || localStorage.musicBox=='N')
			$scope.gameMusic.pause();
		else
			$scope.gameMusic.play();
		*/
	}
	$scope.closeSoundOptions=function() {
		playClick($scope.muteSound);
		$scope.soundPresses=1;
	}
	$scope.openCloseSlider=function(id) {
		//this is the main openCloserSlider
		if(!id)
			id=$scope.sliderName;
		if($scope.showLeftArrow && id != 'players') {
			if($scope.startupSequence==4 || numberVal(localStorage.rank)>0)
				showAlertPopup('Press the "Players" button on the top.', 1);
			return;
		}
		if(!$scope.gameObj.initializedFlg  && !$scope.gameObj.multiPlayerFlg && id!='players' && id!='menu1') {
			showAlertPopup('Press the "Players" button on the top.', 1);
			return;
		}
		if($scope.gameObj.logsFlg) {
			if(id=='logs') {
				showAlertPopup('Good job! Look through the logs to get an idea of what is in them. Then continue with your attacks.');
				$scope.gameObj.logsFlg=false;
				hideArrow();
			} else {
				showAlertPopup('Press the "Logs" button at the top.', 1);
				return;
			}
		}
		if($scope.showLeftArrow) {
			$scope.showLeftArrow=false;
			hideArrow();
		}
		playSound('open.mp3', 0, $scope.muteSound);
		window.scrollTo(0, 0);
		var popupId = id+'Popup';
		var buttonId = id+'Button';
		closePopup('diplomacyWarningPopup');
		var className = document.getElementById(popupId).className;
		if(className=='popupScreenOpen') {
			$scope.showPanelDetails=false;
			$scope.sliderName = '';
			changeClass(popupId, 'popupScreenClosed');
			changeClass(buttonId, 'btn btn-primary roundButton');
			if(popupId=='logsPopup')
				setTimeout(function() { turnOffSlider(popupId); }, 1000);
			if(id=='players' && !$scope.gameObj.initializedFlg) {
				$scope.gameObj.initializedFlg=true;
				if(!$scope.currentPlayer || !$scope.currentPlayer.id) {
					initializePlayer($scope.gameObj.players[0]);
					saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
				}
			}
		} else {
			$scope.showPanelDetails=true;
			$scope.sliderName = id;
			var e = document.getElementById('closeSliderButton');
			if(e) {
				var left = self.innerWidth-83;
				e.style.left = left+'px';
			}
			changeClass(popupId, 'popupScreenOpen');
			changeClass(buttonId, 'btn ptp-yellow roundButton');
			if(popupId=='logsPopup') {
				changeClass(popupId, 'popupScreenClosed');
				$scope.logType=0;
				changeClass('logType1', 'btn btn-primary roundButton');
				changeClass('logType2', 'btn btn-default roundButton');
				changeClass('logType3', 'btn btn-default roundButton');
				setTimeout(function() { turnOnSlider(popupId); }, 100);
			}

			if(id=='purchases') {
				var terrHash = {};
				$scope.gameObj.unitPurchases.forEach(function(unitP) {
					terrHash[unitP.terr]=1;
				});
				var k = Object.keys(terrHash);
				$scope.unitPurchaseTerrs=[];
				k.forEach(function(str) {
					var terrId = parseInt(str);
					var t = $scope.gameObj.territories[terrId-1];
					$scope.unitPurchaseTerrs.push({id: terrId, nation: t.nation, name: t.name});
				});
			}
			if(id=='stats') {
				$scope.numTeams=0;
				$scope.gameObj.teams.forEach(function(team) {
					if(team.income>0)
						$scope.numTeams++;
				});
				drawSPGraph($scope.gameObj.statsObj, 1, 'teamCanvas');
				drawSPGraph($scope.gameObj.statsObj, 2, 'playersCanvas');
			}
			if(id=='logs') {
				document.getElementById(popupId).style.display='block';
				$scope.logRound=$scope.gameObj.round;
				disableButton('leftArrow', $scope.logRound<=1);
				disableButton('rightArrow', $scope.logRound>=$scope.gameObj.round);
			}
			if(id=='chat') {
				$scope.editPostMode=false;
				$scope.recipient='All';
				$scope.recipientId=0;
				$scope.recipientNationId=0;
				$scope.recipientNation=0;
				updateChatMessages('N');
				changeClass('chatMessagesPopup', 'popupMsg off');
				document.getElementById('arrow').style.display='none';
			}
			if(id=='allies') {
				var teamHash = {}
				$scope.gameObj.teams.forEach(function(team) {
					var n = 1;
					if(team.nations && team.nations.length>0)
						n=team.nations[0]
					teamHash[team.name]=n;
				});
				$scope.gameObj.players.forEach(function(player) {
					player.teamColor=teamHash[player.team];
					if(!player.alive)
						player.teamColor=9;
				});
			}
		}
	}
	$scope.chooseChatPlayer=function(nation) {
		$scope.recipientNation=nation;
		disableButton('chatSendButton', false);
	}
	$scope.changePlayer=function() {
		$scope.recipientNationId++;
		if($scope.recipientNationId>=$scope.gameObj.players.length)
			$scope.recipientNationId=0;
		$scope.recipientNation=$scope.gameObj.players[$scope.recipientNationId].nation;
	}
	$scope.changeRecpient=function() {
		var recipients=['All', 'Allies', 'Player'];
		$scope.recipientId++;
		if($scope.recipientId>2)
			$scope.recipientId=0;
		$scope.recipientNation=0;
		disableButton('chatSendButton', ($scope.recipientId==2));
		$scope.recipient=recipients[$scope.recipientId];
	}
	$scope.replyToChat=function(chat) {
		if(chat.name == $scope.user.userName) {
			if(!$scope.editPostMode)
				$('#msgField').val('');
			$scope.chatId = chat.rowId;
		} else {
//			$('#msgField').val('');
			$scope.editPostMode=false;
			$scope.chatId=0;
			$scope.recipient='Player';
			$scope.recipientNation=chat.nation;
		}
	}
	$scope.replyToPlayer=function(player) {
		$scope.editPostMode=false;
		$scope.recipient='Player';
		$scope.recipientNation=player.nation;
//		$('#msgField').val('');
	}
	$scope.editPost=function(chat) {
		$scope.editPostMode=!$scope.editPostMode;
		if($scope.editPostMode) {
			$scope.chatMessages.forEach(function(msg) {
				if(msg.rowId==$scope.chatId)
					$('#msgField').val(msg.message);
			});
		} else
			$('#msgField').val('');
	}
	$scope.deletePost=function(chat) {
		startSpinner('Working...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: 'deleteMessage',
	        chatId: chat.rowId,
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			updateChatMessages('N');
		}
	    });
	}
	$scope.showMoreInfo=function() {
		$scope.showMoreDetail=!$scope.showMoreDetail;
	}
	$scope.unitPopup=function(id) {
		$scope.popupPiece='piece'+id;
		$scope.selectedUnit = $scope.gUnits[id];
		$scope.isMobile=isMobile();
		displayFixedPopup("unitPopup");
	}
	$scope.toggleEditMode=function() {
		$scope.editMode=!$scope.editMode;
	}
	function updateChatMessages(noLimitFlg) {
		$scope.chatMessages=[];
		startSpinner('Loading...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        game_id: $scope.gameObj.id,
	        noLimitFlg: noLimitFlg
	    },
	    function(data, status){
	    	stopSpinner();
		if(verifyServerResponse(status, data)) {
//			console.log('hey', data);
			var items = data.split("<b>");
			var basics=items[0].split("|");
			$scope.chatCount=basics[2];
			var messages=items[1].split("<br>");
			messages.forEach(function(msg) {
				if(msg.length>3)
					$scope.chatMessages.push(messageFromLine(msg));
			});
	    		$scope.$apply();
		}
	    });
	}
	$scope.showOlderMessages=function() {
		updateChatMessages('Y');
	}
	$scope.postChat=function(gameId) {
		var message = databaseSafe(document.getElementById("msgField").value);
		if(message.length==0)
			message=$("textarea#msgArea").attr("value");
		if(message.length==0) {
			showAlertPopup('no message', 1);
			return;
		}
		disableButton('chatSendButton', true);
		document.getElementById("msgField").value = '';
		$('#msgArea').val('');
		startSpinner('Posting...', '150px');
		var url = getHostname()+"/webChat.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName || 'test',
	        code: $scope.user.code,
	        action: ($scope.editPostMode)?'editMessage':'postMessage',
	        message: message,
	        treaties: $scope.myTreaties,
	        game_id: $scope.gameObj.id,
	        recipient: $scope.recipient,
	        chatId: $scope.chatId,
	        nation: $scope.recipientNation
	    },
	    function(data, status){
		console.log('$scope.myTreaties', $scope.myTreaties);

	    	stopSpinner();
		disableButton('chatSendButton', false);
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			updateChatMessages();
		}
	    });
	}
	function turnOffSlider(popupId) {
		changeClass(popupId, 'popupScreenClosed off');
	}
	function turnOnSlider(popupId) {
		changeClass(popupId, 'popupScreenOpen');
	}

	$scope.checkMovement = function(distObj, unit) {
		if($scope.optionType == 'loadPlanes') {
			if(unit.type==1 && (!unit.cargoOf || unit.cargoOf==0))
				return true;
			else
				return false;
		}
		if($scope.optionType == 'cruise') {
			if(distObj.air==1)
				return true;
		}
		if($scope.optionType == 'loadUnits') {
			if(distObj.air==0)
				return true;
		}
		if(unit.type == 1 && unit.terr>=79) {
			if(distObj.air==1)
				return true;
			else
				return false;
		}
		var movement = ($scope.optionType=='attack' || $scope.optionType=='bomb' || $scope.optionType=='nuke')?unit.moveAtt:unit.mv;
		if(unit.type == 1 && distObj.land<=movement)
			return true;
		if((unit.type == 2  || unit.type == 4 || unit.subType =='missile') && distObj.air<=movement)
			return true;
		if(unit.type == 3 && distObj.sea<=movement-numberVal(unit.movesTaken))
			return true;
		return false;
	}
	$scope.setUnitCountToMax = function(terr) {
		for(var x=0; x<terr.units.length;x++) {
			var unit = terr.units[x];
			var cm = $scope.checkMovement(terr.distObj, unit);
			var e = document.getElementById('unit'+unit.id);
			if(e && cm && unit.piece==$scope.selectedFormUnit.piece)
				e.checked=true;
		}
		$scope.checkSendButtonStatus();
	}
	$scope.unitCountDownF = function(terr) {
		var keepGoing=true;
		for(var x=0; x<terr.units.length;x++) {
			var unit = terr.units[x];
			var cm = $scope.checkMovement(terr.distObj, unit);
			var e = document.getElementById('unit'+unit.id);
			if(keepGoing && e && e.checked && cm && unit.piece==$scope.selectedFormUnit.piece) {
				e.checked=false;
				keepGoing=false;
				$scope.checkSendButtonStatus(unit);
			}
		}
		
	}
	$scope.unitCountUpF = function(terr) {
		var keepGoing=true;
		for(var x=0; x<terr.units.length;x++) {
			var unit = terr.units[x];
			var cm = $scope.checkMovement(terr.distObj, unit);
			var e = document.getElementById('unit'+unit.id);
			if(keepGoing && e && !e.checked && cm && unit.piece==$scope.selectedFormUnit.piece) {
				e.checked=true;
				keepGoing=false;
				$scope.checkSendButtonStatus(unit);
			}
		}
		
	}
	$scope.unitCountToZero = function(terr) {
		for(var x=0; x<terr.units.length;x++) {
			var unit = terr.units[x];
			var cm = $scope.checkMovement(terr.distObj, unit);
			var e = document.getElementById('unit'+unit.id);
			if(e && cm && unit.piece==$scope.selectedFormUnit.piece)
				e.checked=false;
		}
		$scope.checkSendButtonStatus();
	}
	$scope.selectAllUnits = function(terr) {
		var checked = document.getElementById('ter'+terr.id).checked;
		for(var x=0; x<terr.units.length;x++) {
			var unit = terr.units[x];
			var cm = $scope.checkMovement(terr.distObj, unit);
			var e = document.getElementById('unit'+unit.id);
			if(e && cm && unit.piece!=13)
				e.checked=checked;
		}
		$scope.checkSendButtonStatus();
	}
	$scope.autoButtonPressed = function(battleFlg) {
		disableButton('autoButton', true);
		var checked = true;
		var attStrength=0;
		var defStrength=$scope.selectedTerritory.defStrength*1.2+10;
		var groundUnits=0;
		var infantryCount=0;
		var artilleryCount=0;
		$scope.moveTerr.forEach(function(terr) {
			var t1 = document.getElementById('ter'+terr.id);
			if(t1)
				t1.checked=checked;
			for(var x=0; x<terr.units.length;x++) {
				var unit = terr.units[x];
				var e = document.getElementById('unit'+unit.id);
				var cm = $scope.checkMovement(terr.distObj, unit);
				if(e && cm && unit.piece!=13) {
					var infNeeded=false;
					var groundUnitsNeeded=false;
					if(infantryCount<2 && unit.piece==2)
						infNeeded=true;
					if(groundUnits<2 && unit.type==1)
						groundUnitsNeeded=true;
						
					if(unit.piece==11 || unit.piece==13 || unit.piece==7)
						continue;
					if(unit.piece==1 && artilleryCount>=$scope.selectedTerritory.unitCount)
						continue;
					if(attStrength<defStrength || unit.piece==1 || unit.piece==10 || infNeeded || groundUnitsNeeded || $scope.gameObj.round<3) {
						attStrength+=unit.att;
						if(unit.type==1)
							groundUnits++;
						if(unit.piece==2)
							infantryCount++;
						if(unit.piece==1)
							artilleryCount++;
						e.checked=checked;
					}
				}
			}
		});
		$scope.checkSendButtonStatus();
	}
	$scope.selectAllButtonChecked = function() {
		var checked = document.getElementById('selectAllId').checked;
		$scope.moveTerr.forEach(function(terr) {
			var t1 = document.getElementById('ter'+terr.id);
			if(t1)
				t1.checked=checked;
			for(var x=0; x<terr.units.length;x++) {
				var unit = terr.units[x];
				var e = document.getElementById('unit'+unit.id);
				var cm = $scope.checkMovement(terr.distObj, unit);
				if(e && cm && unit.piece!=13)
					e.checked=checked;
			}
		});
		disableButton('sendButton', false);
		$scope.checkSendButtonStatus();
	}
	$scope.autoAttackButtonClicked=function() {
		$scope.autoButtonPressed();
		$scope.goButton='Send into Battle!';
		$scope.moveTroopsButtonPressed();
	}
	$scope.fullAttackButtonClicked=function() {
		document.getElementById('selectAllId').checked=true;
		$scope.selectAllButtonChecked();
		$scope.goButton='Send into Battle!';
		$scope.moveTroopsButtonPressed();
	}
	$scope.checkSendButtonStatus = function(u) {
		var transportCargo=$scope.selectedTerritory.transportCargo;
		var carrierCargo=$scope.selectedTerritory.carrierCargo;
		var numUnits = 0;
		var expectedHits=0;
		var numNukes=0;
		var checkAGroundUnitFlg=false;
		var checkAGroundUnitID='';
		var artlleryChecked=false;
		var artTerr=0;
		if(u && (u.piece==1 || u.piece==24 || u.piece==33 || u.piece==38)) {
			artlleryChecked=true;
			artTerr=u.terr;
		}
		$scope.selectedUnitForm = 0;
		var artCount=0;
		var soldierCount=0;
		var specOpsCount=0;
		var sealCount=0;
		var nonSealCount=0;
		var spotterCount=0;
		var specOpsUnit=false;
		var includesGeneral=false;
		var infParatrooperCount = $scope.selectedTerritory.infParatrooperCount;
		var specialUnitHash={};
		var selectedUnitCounts={}
		var totalUnitCounts={}
		for(var x=0;x<$scope.moveTerr.length;x++) {
			var ter = $scope.moveTerr[x];
			for(var i=0;i<ter.units.length;i++) {
				var unit = ter.units[i];
				if(u && unit.terr==u.terr) {
					if(totalUnitCounts[unit.piece]>0)
						totalUnitCounts[unit.piece]++;
					else
						totalUnitCounts[unit.piece]=1;
				}
				var e = document.getElementById('unit'+unit.id);
				if(e) {
					if(e && checkAGroundUnitID.length==0 && !e.checked && unit.piece==2 && unit.terr==artTerr) {
						var cm = $scope.checkMovement(ter.distObj, unit);
						if(cm)
							checkAGroundUnitID='unit'+unit.id;
					}
					if(e && e.checked) {
						if(u && unit.terr==u.terr) {
							if(selectedUnitCounts[unit.piece]>0)
								selectedUnitCounts[unit.piece]++;
							else
								selectedUnitCounts[unit.piece]=1;
							$scope.selectedUnitForm = u.terr;
						}
						if(!specialUnitHash[unit.piece])
							specialUnitHash[unit.piece]=0;
						specialUnitHash[unit.piece]++;
						if(unit.piece>=20 && $scope.optionType=='attack' && specialUnitHash[unit.piece]>6) {
							showAlertPopup('Maximum of 6 '+$scope.gUnits[unit.piece].name+' units per battle.', 1);
							e.checked=false;
						}
						
						if((unit.piece==23 || unit.piece==25 || unit.piece==41 || unit.piece==42) && $scope.optionType=='attack' && $scope.selectedTerritory.unitCount==0) {
							showAlertPopup('No target for your '+$scope.gUnits[unit.piece].name+'.',1);
							e.checked=false;
						}
						if(unit.piece==44 && $scope.optionType=='attack') {
							if($scope.selectedTerritory.id>79) {
								showAlertPopup('Seals cannot attack ships.',1);
								e.checked=false;
							}
							if($scope.selectedTerritory.generalFlg || $scope.selectedTerritory.leaderFlg) {
								showAlertPopup('Seals cannot attack if hero is present',1);
								e.checked=false;
							}
							if($scope.selectedTerritory.owner==0) {
								showAlertPopup('Seals can ONLY attack other players',1);
								e.checked=false;
							}
							if(nonSealCount>0) {
								showAlertPopup('No seals with regular troops',1);
								e.checked=false;
							} else
								sealCount++;
						} else {
							if(sealCount>0) {
								showAlertPopup('No mixing Seals with regular troops',1);
								e.checked=false;
							} else
								nonSealCount++;
						}
							
						if(unit.piece==10)
							includesGeneral=true;
						if(unit.piece==35)
							specOpsCount++;
						if(unit.type==1 && !unit.returnFlg)
							spotterCount++;
						if(unit.subType=='vehicle' || unit.subType=='missile')
							transportCargo+=2;
						if(unit.subType=='soldier') {
							soldierCount++;
							transportCargo++;
						}
						if(unit.subType=='fighter' && unit.terr != $scope.selectedTerritory.id)
							carrierCargo++;
						if(unit.piece==1 || unit.piece==24 || unit.piece==33 || unit.piece==38)
							artCount++;
						if(unit.piece==2) {
							infParatrooperCount++;
						}
						if(u && artlleryChecked && 'unit'+u.id==e.id) {
							checkAGroundUnitFlg=true;
						}
						if($scope.optionType=='loadPlanes' && infParatrooperCount>$scope.selectedTerritory.bomberCount*2) {
							showAlertPopup('Not enough room on your bombers. Removing items.', 1);
							e.checked=false;
						}
						if($scope.selectedTerritory.id>=79 && $scope.optionType=='movement') {
							if(transportCargo>$scope.selectedTerritory.transportSpace) {
								showAlertPopup('Not enough room on your transports. Removing items.', 1);
								e.checked=false;
							}
							if(carrierCargo>$scope.selectedTerritory.carrierSpace) {
								showAlertPopup('Not enough room on your carriers. Removing fighters.', 1);
								e.checked=false;
							}
						}
						if(unit.piece==28 && $scope.optionType=='attack' && unit.terr>=79) {
							showAlertPopup('Medics cannot attack from transports.', 1);
							e.checked=false;
						}
						if(unit.type==1 && unit.returnFlg && $scope.optionType=='attack' && unit.terr>=79) {
							showAlertPopup(unit.name+' cannot attack from transports.', 1);
							e.checked=false;
						}
						if(unit.piece==35 && $scope.optionType=='attack' && spotterCount==0) {
							specOpsUnit=e;
						}
						if(unit.piece==2)
							expectedHits++;
						else
							expectedHits+=unit.att*unit.numAtt;
						if(unit.piece==41)
							expectedHits+=6;
						if(unit.piece==14)
							numNukes++;
						if(unit.piece==52)
							numNukes+=3;
						numUnits++;
					}
				}
			}

		}
		if(u) {
			$scope.selectedFormUnit = {piece: u.piece, max: totalUnitCounts[u.piece], num: selectedUnitCounts[u.piece]};
			if($scope.selectedUnitForm>0 && totalUnitCounts[u.piece]<5)
				$scope.selectedUnitForm=0;
			var numSelected = 0;
			if(selectedUnitCounts[u.piece] && selectedUnitCounts[u.piece]>0)
				numSelected=selectedUnitCounts[u.piece];
			disableButton('unitCountToOne', numSelected<=0);
			disableButton('unitCountDown', numSelected<=0);
			disableButton('unitCountUp', selectedUnitCounts[u.piece]==totalUnitCounts[u.piece]);
			disableButton('unitCountToMax', selectedUnitCounts[u.piece]==totalUnitCounts[u.piece]);
		}
		
		if(specOpsUnit && $scope.optionType=='attack' && spotterCount==0) {
			showAlertPopup('You need at least one ground unit to attack with your special ops.', 1);
			specOpsUnit.checked=false;
			numUnits=0;
		}
		if(includesGeneral)
			expectedHits+=soldierCount;
		if($scope.optionType=='attack' && checkAGroundUnitFlg && checkAGroundUnitID.length>0 && artCount-1>=soldierCount) {
			var e = document.getElementById(checkAGroundUnitID);
			if(e &&  !e.checked)
				e.checked=true;
		}
		$scope.expectedHits=expectedHitsFromHits(expectedHits);
		
		if(numNukes>0) {
			$scope.expectedHits=nukeHitsForTerr($scope.selectedTerritory)*numNukes;
			if($scope.expectedHits==0)
				showAlertPopup('This territory is too heavily defended for your nukes! Find a better target or get your nukes upgraded through technology.',1);
		}
			
		disableGlowButton('sendButton', numUnits+numNukes==0);
	}
	$scope.test=function() {
		playClick($scope.muteSound);
	}
	function nukeHitsForTerr(terr) {
		var player = $scope.gameObj.players[$scope.gameObj.turnId-1];
		var hits=12;
		if(player.tech[4])
			hits+=3;
		if(player.tech[5])
			hits+=3;
		var adCount=terr.adCount;
		if(adCount>3)
			adCount=3;
		var blocked=adCount*2;
		if(terr.owner>0) {
			var defender = playerOfNation(terr.owner);
			if(defender.tech[18])
				blocked*=2;
		}
		var finalHits=hits-blocked;
		if(terr.nation==99) {
			finalHits = Math.floor(finalHits/3);
//			finalHits/=3;
		}
		return finalHits;
	}
	$scope.attackInfoButtonPressed = function() {
		$scope.attackInfoHelp = !$scope.attackInfoHelp;
	}
	$scope.attackInfo2ButtonPressed = function() {
		$scope.attackInfoHelp2 = !$scope.attackInfoHelp2;
	}
	function loadCargo(type) {
		console.log('loadCargo!!');
		var transports=0;
		var units = [];
		var cargoUnits = 0;
		var cargoSpace = 0;
		var transportUnit;
		var piece1Flg=false;
		var piece2Flg=false;
		var piece4Flg=false;
		var transportUnit;
		var transportType = (type=='loadUnits')?'transport':'bomber';
		var cargoType = (type=='loadUnits')?'cargo':'infantry';
//		var cargoItems=[];
		for(var x=0;x<$scope.moveTerr.length;x++) {
			var ter = $scope.moveTerr[x];
			for(var i=0;i<ter.units.length;i++) {
				var unit = ter.units[i];
				if(document.getElementById('unit'+unit.id) && document.getElementById('unit'+unit.id).checked) {
					if(unit.type==1 || unit.subType=='fighter')
						cargoUnits+=unit.cargoUnits;
					cargoSpace+=unit.cargoSpace;
					if(unit.cargoSpace>0) {
						transportUnit=unit;
						transports++;
					} else {
						if(unit.type==1 && unit.subType != 'hero')
							piece1Flg=true;
						if(unit.type==2)
							piece2Flg=true;
						if(unit.type==4 || (unit.type==2 && unit.subType!='fighter')) {
							showAlertPopup('Invalid unit to load.', 1);
							return false;
						}
						units.push(unit);
//						cargoItems.push({id: unit.id, piece: unit.piece});
					}
				}
			}
		}
		if(cargoUnits==0) {
			showAlertPopup('You need to select '+cargoType, 1);
			return false;
		}
		if(type=='loadPlanes') {
			units.forEach(function(unit) {
				loadUnitOntoBomber(unit, $scope.selectedTerritory);
			});
			$scope.closeTerrPopup();
			return;
		}
		if(transports==0) {
			showAlertPopup('You need to select a '+transportType, 1);
			return false;
		}
		if(transports>1) {
			showAlertPopup('ONLY select one '+transportType, 1);
			return false;
		}
		if(!transportUnit.cargo)
			transportUnit.cargo=[];
		var currentCargoUnits = getCargoUnitsOfTransport(transportUnit);
		if(cargoUnits+currentCargoUnits>cargoSpace) {
			showAlertPopup('Too much cargo selected. Click on the info button for details.', 1);
			return false;
		}
		if(transportUnit.piece==8 && piece1Flg) {
			showAlertPopup('Invalid cargo. Only fighters allowed.', 1);
			return false;
		}
		if(transportUnit.piece==4 && piece2Flg) {
			showAlertPopup('Invalid cargo. Only ground units allowed.', 1);
			return false;
		}
		units.forEach(function(unit) {
			loadThisUnitOntoThisTransport(unit, transportUnit);
		});
		if(type=='loadPlanes') {
			setTimeout(function() { showUnitsForMovement('loadPlanes'); }, 500);
			return false;
		}
		return true;
	}
	function getCargoUnitsOfTransport(transportUnit) {
		if(!transportUnit.cargo)
			return 0;
		var cargoUnits = 0;
		transportUnit.cargo.forEach(function(cargo) {
			cargoUnits+=cargo.cargoUnits;
		});
		return cargoUnits;
	}
	$scope.ngStyleTerrRow=function(nation, idx) {
		if(nation>8)
			nation=9;
		var row1 = ['#ffc','#ccf','#ccc','#ea0','#fcc','#cfc','#ff7','#fcf','#fc0','#cff'];
		var row2 = ['#ffe','#eef','#eee','#fb4','#fee','#efe','#ffa','#fef','#fe0','#eff'];
		if(idx%2==0)
			return {'background-color': row1[nation]};
		else
			return {'background-color': row2[nation]};
	}
	$scope.fightButtonPressed = function() {
		if($scope.occupyWarning && (!$scope.user || $scope.user.rank<3)) {
			showAlertPopup('You need ground troops to occupy a territory. Add ground troops or find a target within reach of your ground troops. You can also use transports to move ground units over seas.', 1);
			return;
		}
		if($scope.battleHasEnded) {
			showAlertPopup('Something out of sync! Exit app and retry.', 1);
			return;
		}
		if($scope.currentBattleTerrId && $scope.currentBattleTerrId>0 && $scope.currentBattleTerrId != $scope.selectedTerritory.id) {
			var terr=$scope.gameObj.territories[$scope.currentBattleTerrId-1];
			showAlertPopup('Complete battle in '+terr.name+' first.', 1);
			return;
		}
		if($scope.waitForSaveFlg) {
			$scope.waitForSaveFlg=false;
			showAlertPopup('Saving game, please try again.', 1);
			return;
		}
		$scope.currentBattleTerrId=$scope.selectedTerritory.id;
		$scope.autoAttacknum=0;
		$scope.displayFinalBattleResult=false;
		$scope.attackSequence=0;
		$scope.showGeneralWithdrawForm=false;
		disableButton('fightButton', true);
		disableButton('pullBombersButton', true);
		disableButton('pullPlanesButton', true);
		disableButton('pullGeneralButton', true);
		disableButton('retreatButton', true);
		$scope.hideAttackBoard=$scope.defendingUnits.length<3;
		if($scope.hideAttackBoard)
			closePopup('territoryPopup');
		setTimeout(function() { fightButtonPressed2(); }, 10);
	}
	function fightButtonPressed2() {
		if($scope.hideAttackBoard)
			window.scrollTo($scope.selectedTerritory.x-200, $scope.selectedTerritory.y-200);
		setUpAttackBoard($scope.attackUnits, $scope.defendingUnits);
		
		if(!$scope.displayBattle) {
			showAlertPopup('No $scope.displayBattle!!',1);
			return;
		}
		if(!$scope.battle) {
			showAlertPopup('No $scope.battle!!',1);
			return;
		}
		$scope.battle.sounds.forEach(function(sound) {
			playSound(sound, 0, $scope.muteSound);
		});
		$scope.longPause=false;
		
		playSound('9mm.mp3', 0, $scope.muteSound);
		
		if($scope.selectedTerritory.fogOfWar)
			$scope.selectedTerritory.fogOfWar=false;
		$scope.battle.round++;

		$scope.displayBattle.phase=2;
		$scope.displayBattle.generalUnit=0;
		$scope.displayBattle.hijackerUnit=0;
		$scope.displayBattle.airDefenseUnits=$scope.battle.airDefenseUnits;
		
		if($scope.battle && $scope.battle.battleId && $scope.battle.battleId>0) {
			console.log('--->Continue the battle');
			$scope.gameObj.battles.forEach(function(battle) { 
				if(battle.id==$scope.battle.battleId) {
					battle.active=true;
					advanceActionIfNeeded();
				}
			});
		} else {
			console.log('--->start the battle new');
			//start the battle new
			$scope.goButton='Fight!';
			attackTroopsNow();
		}
		
		
		var delay1=1000;
		var delay2=delay1*2;
		var delay3=delay1*3;
		$scope.bettleTerrId = $scope.battle.terr
		setTimeout(function() { initDisplayBattle(); }, 500);	
		setTimeout(function() { startAttackerRolls(); }, delay1);	
		setTimeout(function() { showAttackerRolls(); }, delay2);	
		setTimeout(function() { showDefenderRolls(); }, delay3);
		setTimeout(function() { scrollToBottom(); }, 5000);

	}
	function logAttackSequence(num) {
		$scope.attackSequence=num.toString();
//		console.log(num);
	}
	function initDisplayBattle() {
		if($scope.displayBattle)
			$scope.displayBattle.phase=2;
		$scope.$apply();
	}
	$scope.removeCasulaties=function() {
		playClick($scope.muteSound);
		if($scope.displayBattle)
			$scope.displayBattle.phase=0;
		setUpAttackBoard($scope.attackUnits, $scope.defendingUnits);
	}
	function finishTheBattle() {
		soundsForBattleEnd($scope.wonFlg);
		$scope.displayFinalBattleResult=true;
	}
	function soundsForBattleEnd(wonFlg) {
		if(wonFlg) {
			var voiceId=Math.floor((Math.random() * 6)+71);
			playVoiceSound(voiceId, $scope.muteSound);
			setTimeout(function() { playSound('Cheer.mp3', 3, $scope.muteSound); }, 1800);
		} else {
			if(numberVal($scope.attHits)>0 && numberVal($scope.defHits)==0) {
				playVoiceSound(76, $scope.muteSound);
				return;
			}
			var voiceId=Math.floor((Math.random() * 2)+81);
			playVoiceSound(voiceId, $scope.muteSound);
			setTimeout(function() { playSound('CrowdBoo.mp3', 4, $scope.muteSound); }, 2000);
		}
	}
	function startAttackerRolls() {
		if(!$scope.displayBattle || !$scope.displayBattle.phase || !$scope.displayBattle.attackUnits|| $scope.displayBattle.attackUnits.length==0)
			return;
		$scope.displayBattle.phase=2;
		$scope.displayBattle.attackUnits.forEach(function(unit) {
			var numAtt=unit.numAtt;
			for(var x=0;x<numAtt;x++) {
				if(unit.dice.length>x)
					unit.dice[x].diceImg='spin.gif';
			}
		});
		if($scope.displayBattle.airDefenseUnits && $scope.displayBattle.airDefenseUnits.length>0) {
			$scope.displayBattle.airDefenseUnits.forEach(function(unit) {
				if(unit.dice.length>0)
					unit.dice[0].diceImg='spin.gif';
			});
		}
		applyChanges();
	}
	function showAttackerRolls() {
		if(!$scope.displayBattle || !$scope.displayBattle.phase || !$scope.displayBattle.defendingUnits || $scope.displayBattle.defendingUnits.length==0)
			return;
		$scope.displayBattle.phase=3;
		$scope.displayBattle.defendingUnits.forEach(function(unit) {
			var numDef=unit.numDef || 1;
			for(var x=0;x<numDef;x++) {
				if(unit.dice.length>x)
					unit.dice[x].diceImg='spin.gif';
			}
		});
		applyChanges();
	}
	function showDefenderRolls() {
		disableButton('fightButton', false);
		if(!$scope.displayBattle || !$scope.displayBattle.phase) {
			showAlertPopup('Error on showDefenderRolls',1);
//			return;
		}
		$scope.displayBattle.phase=4;
		if($scope.battleOver) {
			finishTheBattle();
		}
		$scope.bettleTerrId=0;
		applyChanges();
	}
	$scope.pullUnitsButtonPressed = function(type) {
		playClick($scope.muteSound);
		if(type==1)
			disableButton('pullGeneralButton', true);
		if(type==2)
			disableButton('pullPlanesButton', true);
		if(type==3)
			disableButton('pullBombersButton', true);
		var battle=$scope.gameObj.battles[0];
		var newUnits=[]
		battle.units.forEach(function(unit) {
			if((type==1 && unit.piece==10) || (type==2 && (unit.type==2 || unit.type==4)) || (type==3 && unit.piece==7) ) {
				unit.terr=unit.prevTerr;
				unit.retreated=true;
			} else
				newUnits.push(unit);
		});
		battle.units=newUnits;
		setUpAttackBoard(battle.units, battle.defendingUnits);
	}
	function setUpAttackBoard(attackUnits, defendingUnits) {
		if(!attackUnits)
			return;
		var expectedHits=0;
		var expectedLosses=0;
		$scope.battle.generalExists=false;
		$scope.battle.planeExists=false;
		$scope.battle.bomberExists=false;
		var planesExist=false;
		var choppersExist=false;
		var aaGunsExist=false;
		var soldiersExist=false;
		var vehiclesExist=false;
		var laserExists=false;
		var sealExists=false;
		var shipsExist=false;
		var groundUnitsExist=false;
		$scope.battle.sounds=[];
		var airDefenseUnits=[];
		$scope.battle.droneExists=false;
		var aaId=1;
		attackUnits.forEach(function(unit) {
			if(unitIsValidForBattle(unit, $scope.selectedTerritory.id)) {
				if(unit.type==2)
					planesExist=true;
				if(unit.type==2 || unit.type==4) {
					var adCountForUnit=$scope.selectedTerritory.adCount;
					if(adCountForUnit>unit.adLimit)
						adCountForUnit=unit.adLimit;
					
					if($scope.selectedTerritory.battleshipAACount>0 && $scope.selectedTerritory.battleshipAACount>adCountForUnit)
						adCountForUnit=$scope.selectedTerritory.battleshipAACount;
					if(adCountForUnit>2)
						adCountForUnit=2;
					for(var x=0; x<adCountForUnit; x++) 
						airDefenseUnits.push({id: aaId++, piece: 13, dice: [{id: 1, diceImg: 'dice.png'}], diceFinal: []})
				}
				if(unit.type==1 || unit.type==4)
					groundUnitsExist=true;
				if(unit.type==4 && unit.piece!=44)
					choppersExist=true;
				if(unit.type==3)
					shipsExist=true;
				if(unit.subType=='soldier')
					soldiersExist=true;
				if(unit.piece==47)
					laserExists=true;
				if(unit.piece==44)
					sealExists=true;
				if(unit.subType=='vehicle' && unit.piece!=47)
					vehiclesExist=true;
				expectedHits+=unit.att*unit.numAtt;
				if(unit.piece==41)
					expectedHits+=6;
				if(unit.type==2 || unit.type==4)
					$scope.battle.planeExists=true;
				if(unit.piece==7)
					$scope.battle.bomberExists=true;
				if(unit.piece==10)
					$scope.battle.generalExists=true;
				if(unit.piece==43)
					$scope.battle.droneExists=true;
			}
		});
		$scope.occupyWarning = (planesExist && !groundUnitsExist && $scope.selectedTerritory.id<79);
		if(soldiersExist)
			$scope.battle.sounds.push('marching.wav');
		if(sealExists)
			$scope.battle.sounds.push('mp5.mp3');
		if(laserExists)
			$scope.battle.sounds.push('shock.mp3');
		if(planesExist)
			$scope.battle.sounds.push('fighter.mp3');
		if(vehiclesExist)
			$scope.battle.sounds.push('vehicles.mp3');
		if(choppersExist)
			$scope.battle.sounds.push('chopper.mp3');
		if(shipsExist && $scope.optionType!='cruise')
			$scope.battle.sounds.push('foghorn.wav');
		if($scope.battle.generalExists) {
			$scope.battle.sounds.push('yes.mp3');
			for(var x=0; x<$scope.attackUnits.length; x++) {
				var unit = $scope.attackUnits[x];
				if(unit.subType=='soldier') {
					expectedHits++;
					unit.att=unit.att2+1;
					if(unit.nation==1 && unit.piece==2) {
						unit.att=3;
						expectedHits++;
					}
				}
				if(unit.nation==3 && (unit.piece==3 || unit.piece==46)) {
					unit.att=unit.att2+1;
					expectedHits++;
				}
				if(unit.piece==50 || unit.piece==51) {
					unit.att=unit.att2+1;
					expectedHits++;
				}
			}
		}
		var leaderExists=false;
		defendingUnits.forEach(function(unit) {
			if(unit.piece==13)
				aaGunsExist=true;
			if(unit.def>0 && unit.hp>0) {
				if(unit.piece==11)
					leaderExists=true;
				var numDef=unit.numDef || 1;
				expectedLosses+=unit.def*numDef;
			}
			if($scope.selectedTerritory.id==8 && unit.piece==2 && unit.owner==0)
				unit.def=1;
			if($scope.battle.droneExists && unit.subType=='fighter') 
				airDefenseUnits.push({id: unit.id, piece: unit.piece, dice: [{id: 1, diceImg: 'dice.png'}], diceFinal: []})
		});
		if(leaderExists) {
			console.log('++leaderExists++');
			defendingUnits.forEach(function(unit) {
				if(unit.def>0 && unit.def<=unit.def2 && unit.hp>0 && (unit.subType=='soldier' || unit.subType=='vehicle') ) {
					unit.def=unit.def2+1;
					expectedLosses++;
				}
			});
		}
		$scope.battle.aaFireFlg=(planesExist && aaGunsExist);
//		$scope.battle.expectedHits=expectedHitsFromHits(expectedHits);
		$scope.expectedHits=expectedHitsFromHits(expectedHits);
		$scope.expectedLosses=expectedHitsFromHits(expectedLosses);
		$scope.battle.airDefenseUnits = airDefenseUnits;
		
		console.log('expected hits/Losses ', $scope.expectedHits, $scope.expectedLosses, expectedLosses);

		$scope.displayBattle={attNation: $scope.currentPlayer.nation, defNation: $scope.selectedTerritory.owner, phase: 0, attackUnits: [], defendingUnits: [], airDefenseUnits: airDefenseUnits};
		attackUnits.forEach(function(unit) {
			if(unit.hp>0 && !unit.dead && !unit.retreated)
				$scope.displayBattle.attackUnits.push({id: unit.id, piece: unit.piece, att: unit.att, def: unit.def, numAtt: unit.numAtt, numDef: unit.numDef, dice: diceForUnit(unit.numAtt), diceFinal: []});
		});
		defendingUnits.forEach(function(unit) {
			if(okToDefend(unit))
				$scope.displayBattle.defendingUnits.push({id: unit.id, piece: unit.piece, att: unit.att, def: unit.def, numAtt: unit.numAtt, numDef: unit.numDef, dice: diceForUnit(unit.numDef), diceFinal: []});
		});
		disableButton('fightButton', false);
		disableButton('retreatButton', false);
		disableButton('pullGeneralButton', false);
		disableButton('pullPlanesButton', false);
		disableButton('pullBombersButton', false);
	}
	function okToDefend(unit) {
		if(unit.hp==0 || unit.dead)
			return false;
		if(unit.terr>=79 && unit.type==1)
			return false;
		if(unit.def==0)
			return false;
		return true;
	}
	function diceForUnit(num) {
		if(!num || num==0)
			num=1;
		var dice=[];
		for(var x=0; x<num; x++) {
			dice.push({id: x, diceImg: 'dice.png'});
		}
		return dice;
	}
	function expectedHitsFromHits(num) {
		if(num>=18)
			return parseInt(num/6);
		else
			return (num/6).toFixed(1);
	}
	function initializeBattle() {
		$scope.attDice=[];
		$scope.defDice=[];
		$scope.aaDice=[];
		$scope.attCasualties=[];
		$scope.defCasualties=[];
		$scope.wonFlg=false;
		$scope.longPause=false;
		populateDefendingUnits([]);
		$scope.battle={};
		$scope.battle.terr=$scope.selectedTerritory.id;
		$scope.battle.aaDice=[];
		$scope.battle.fighterDice=[];
		$scope.battle.attacker=$scope.gameObj.currentNation;
		$scope.battle.round=0; //needs to be 0 to show 'add more'
	}
	function populateDefendingUnits(attackUnits) {
		$scope.defendingUnits=[];
		$scope.selectedTerritory.units.forEach(function(unit) {
			if($scope.currentPlayer && $scope.currentPlayer.nation==unit.owner)
				attackUnits.push(unit);
			else
				$scope.defendingUnits.push(unit);
		});
		return attackUnits;
	}
	$scope.moveTroopsButtonPressed = function() {
		playClick($scope.muteSound);

		if(($scope.optionType=='loadUnits' || $scope.optionType=='loadPlanes') && !loadCargo($scope.optionType)) {
			return;
		}
		
		$scope.attackUnits = getAllUnitsMoving();
		console.log('$scope.optionType', $scope.optionType);
		if($scope.optionType=='attack')
			$scope.attackUnits = populateDefendingUnits($scope.attackUnits);
		
		if(!$scope.attackUnits || $scope.attackUnits.length==0)
			return;
		disableButton('redoMovesButton1', false);
		if($scope.goButton=='Send into Battle!') {
			initializeBattle();
			if($scope.selectedTerritory.id<79)
				$scope.selectedTerritory.leaderMessage = randomAttackMessage();
			setUpAttackBoard($scope.attackUnits, $scope.defendingUnits);
			$scope.optionType='battlefield';
			scrollToBattleButtons();
		} else {
			closeThePopup(true); // unless load
			setUpAttackBoard($scope.attackUnits, $scope.defendingUnits || []);
			moveUnitsToTerr($scope.selectedTerritory, $scope.attackUnits, false, $scope.optionType, true);
		}
		if($scope.battle && $scope.battle.sounds && $scope.battle.sounds.length>0) {
			$scope.battle.sounds.forEach(function(sound) {
				playSound(sound, 0, $scope.muteSound);
			});
		}
	}
	function attackTroopsNow() {
		console.log('attacking...');
		$scope.attackUnits = getAllUnitsMoving();
		if(!$scope.attackUnits || $scope.attackUnits.length==0) {
			showAlertPopup('no units!!!!', 1);
			return;
		}
		playSound('AirHorn.mp3', 0, $scope.muteSound);
		$scope.battle.battleStarted=true;
		$scope.battle.incomingFlg=true;
//		disableButton('cancelAttackButton', true);
//		disableButton('addMoreButton', true);
		moveUnitsToTerr($scope.selectedTerritory, $scope.attackUnits, false, $scope.optionType, true);
	}
	function getAllUnitsMoving() {
		var movingUnits=[];
		var generalIncluded=false;
		var artilleryCount=0;
		var specOpsCount=0;
		var spotterCount=0;
		var paratroopers=0;
		var noPassCanal=0;
		var medicCount=0;
		var infintryCount=0;
		$scope.planesIncluded=false;
		for(var x=0;x<$scope.moveTerr.length;x++) {
			var ter = $scope.moveTerr[x];
			for(var i=0;i<ter.units.length;i++) {
				var unit = ter.units[i];
				if(document.getElementById('unit'+unit.id) && document.getElementById('unit'+unit.id).checked) {
					if(okToMove($scope.optionType, ter)) {
						if(unit.type==1 && unit.att>0) {
							if(isArtillery(unit))
								artilleryCount++;
							else
								spotterCount++;
						}
						if(unit.type==4 && unit.att>0) {
							spotterCount++;
						}
						if(unit.type==3) {
							if(passThroughPanamaCanal(unit.terr, $scope.selectedTerritory.id))
								noPassCanal=1;
							if(passThroughSuezCanal(unit.terr, $scope.selectedTerritory.id))
								noPassCanal=2;
						}
						if(unit.piece==10)
							generalIncluded=true;
						if(unit.piece==35)
							specOpsCount++;
						if(unit.piece==28)
							medicCount++;
						if(unit.piece==2)
							infintryCount++;
						if(unit.type==2 || unit.type==4)
							$scope.planesIncluded=true;
						movingUnits.push(unit);
						if(unit.cargo && unit.cargo.length>0) {
							for(var j=0; j<unit.cargo.length; j++) {
								if(unit.piece==7)
									paratroopers++;
								
								var cagoUnit = unitOfCargo(unit.cargo[j]);
								if(!isUnitChecked(cagoUnit.id))
									movingUnits.push(cagoUnit);
							}
						}
					}
				}
			}
		}
		if(noPassCanal>0) {
			if(noPassCanal==1) {
				var panama = $scope.gameObj.territories[51];
				var status = treatyStatusForTerr($scope.currentPlayer, panama);
				if(status<3) {
					showAlertPopup('Your ships cannot pass through Panama canal unless you or an ally owns Panama.', 1);
					return;
				}
			} else {
				var egypt = $scope.gameObj.territories[39];
				var status1 = treatyStatusForTerr($scope.currentPlayer, egypt);
				var syria = $scope.gameObj.territories[36];
				var status2 = treatyStatusForTerr($scope.currentPlayer, syria);
				if(status1<3 && status2<3) {
					showAlertPopup('Your ships cannot pass through Suez canal unless you or an ally owns Egypt or Syria.', 1);
					return;
				}
			}
		}
		if(movingUnits.length==0) {
			showAlertPopup('No units selected. Note you can only move into, or attack territories adjacent to your current forces.', 1);
			return;
		}
		if($scope.optionType=='attack' && spotterCount==0 && paratroopers>0) {
			showAlertPopup('You cannot bring paratroopers into a battle unless you also have other ground units involved.', 1);
			return;
		}
		if(artilleryCount>spotterCount && $scope.optionType=='attack' && $scope.selectedTerritory.id<79) {
			var deficit = artilleryCount-spotterCount;
			showAlertPopup('You need more spotters for your artillery. Either add '+deficit+' more ground unit(s) or remove '+deficit+' artillery. You need one ground unit for each attacking artillery.', 1);
			return;
		}
		if(medicCount>1 && infintryCount>0 && medicCount>infintryCount && $scope.optionType=='attack' && $scope.selectedTerritory.id<79) {
			var deficit = medicCount-infintryCount;
			showAlertPopup('You need more infantry for your medics. Either add '+deficit+' more infantry or remove '+deficit+' medics. You need one infantry unit for each attacking medic.', 1);
			return;
		}
		if(specOpsCount>0 && spotterCount==0 && $scope.optionType=='attack' && $scope.selectedTerritory.id<79) {
			showAlertPopup('You need at least one spotter (infantry) with your Special Ops.', 1);
			return;
		}
		if($scope.user.rank==0 && localStorage.practiceStep==3) {
			if($scope.user.rank==0 && $scope.gameObj.round==1 && $scope.currentPlayer.status=='Attack' && movingUnits.length<8) {
				showAlertPopup('Send more troops for this battle. Go ahead and send all your troops.', 1);
				return;
			}
		}
		return movingUnits;
	}
	function scrollToBattleButtons() {
		var topBar = document.getElementById('topBar');
		if(topBar) {
			var elemRect = topBar.getBoundingClientRect();
			window.scrollTo(window.pageXOffset, window.pageYOffset+elemRect.top-200);
		}
	}
	function isUnitChecked(unitId) {
		var e = document.getElementById('unit'+unitId);
		if(e && e.checked)
			return true;
		else
			return false;
	}
	function randomAttackMessage() {
		var msg = [
		'You are going to regret this!',
		'What are you doing??!',
		'We will crush you!',
		'You cannot be serious!',
		'What kind of madness is this?!',
		'This is my final warning. Call off your attack or die!',
		'If you attack, I will be forced to crush your entire army!',
		'No, no no! Stop this insanity!',
		]
		var num=Math.floor((Math.random() * msg.length));
		return msg[num];
	}
	function passThroughPanamaCanal(unitTerr, selectedTerritoryId) {
		var startInPacific=false;
		var startInAtl=false;
		
		var endInPacific=false;
		var endInAtl=false;
		
		if(unitTerr==85 || unitTerr==86 || unitTerr==88 || unitTerr==91)
			startInPacific=true;

		if(unitTerr==99 || unitTerr==100 || unitTerr==101 || unitTerr==102)
			startInAtl=true;
		
		if(selectedTerritoryId==85 || selectedTerritoryId==86 || selectedTerritoryId==88 || selectedTerritoryId==91)
			endInPacific=true;

		if(selectedTerritoryId==99 || selectedTerritoryId==100 || selectedTerritoryId==101 || selectedTerritoryId==102)
			endInAtl=true;
		
		if((startInPacific && endInAtl) || (startInAtl && endInPacific))
			return true;
			
		return false;
	}
	function passThroughSuezCanal(unitTerr, selectedTerritoryId) {
		var startInAtl=false;
		var startInIndian=false;
		
		var endInAtl=false;
		var endInIndian=false;

		if(unitTerr==114 || unitTerr==115)
			startInAtl=true;

		if(unitTerr==118 || unitTerr==119 || unitTerr==121 || unitTerr==125)
			startInIndian=true;
		
		if(selectedTerritoryId==114 || selectedTerritoryId==115)
			endInAtl=true;

		if(selectedTerritoryId==118 || selectedTerritoryId==119 || selectedTerritoryId==121 || selectedTerritoryId==125)
			endInIndian=true;

		if((startInIndian && endInAtl) || (startInAtl && endInIndian))
			return true;

		return false;
	}
	function unitOfCargo(cargoUnit) {
		for(var x=0; x<$scope.gameObj.units.length; x++) {
			var unit = $scope.gameObj.units[x];
			if(unit.id==cargoUnit.id)
				return unit;
		}
		console.log('whoa!!!', cargoUnit);
		return cargoUnit;
	}
	function moveUnitsToTerr(terr, units, removeLockFlg, type, scrollLockFlg) {
		if(!terr || !units || units.length==0) {
//			showAlertPopup('Unknown error: 105!');
			console.log('ERROR!! no terr or units to moveUnitsToTerr', terr.name, units);
			return;
		}
//		console.log('moveUnitsToTerr!!!', terr.name, units.length); //window.pageXOffset
		
		if(!scrollLockFlg)
			window.scrollTo(terr.x-200, terr.y-200);
		$scope.currentPlayer.lastMovedRound=$scope.gameObj.round;
		var defender = terr.owner;
		if($scope.currentPlayer.nation != terr.owner && $scope.gameObj.round<6 && $scope.currentPlayer.treaties[terr.owner-1]<3) {
			console.log($scope.currentPlayer.treaties, $scope.currentPlayer.treaties[terr.owner]);
			if(!okToAttack($scope.currentPlayer, terr)) {
				if(!$scope.currentPlayer.cpu)
					showAlertPopup('Movement not allowed here until round 6.', 1);
				return;
			}
		}
		var attacker = 0;
		var warFlg = false;
		var fromTerrHash={};
		var generalFlg = false;
		var nukeFlg=false;
		var empFlg=false;
		var returningId=0;
		var nukes=0;
		var emps=0;
		var waterPiece=0;
		var attackPieces=[];
		var id=0;
		var includesFacFlg=false;
		var includesDronesFlg=false;
		var allyHash = getAllyHash($scope.currentPlayer, $scope.selectedTerritory);
		if(treatyStatusForTerr($scope.currentPlayer, terr)<3)
			warFlg=true;
		units.forEach(function(unit) {
			if(unit.piece==15 || unit.piece==19)
				includesFacFlg=true;
			id++;
			attackPieces.push(unit.piece);
			
			if(unit.type==3) {
				var unitTerr = $scope.gameObj.territories[unit.terr-1];
				var distObj = distanceBetweenTerrs(unitTerr, terr, 2, 0, 0, 0, allyHash, $scope.gameObj.territories);
				var dist=distObj.sea;
				if(dist>unit.movesLeft)
					dist=unit.movesLeft;
				unit.movesLeft-=dist;
				unit.movesTaken+=dist;
			} else {
				if($scope.optionType=='attack' || numberVal(unit.cargoOf)==0 || unit.type==1)
					unit.movesLeft=0;
			}
			if(unit.piece==14)
				nukes++;
			if(unit.piece==52)
				emps++;
			if(unit.piece==43)
				includesDronesFlg=true;
			unit.moving = true;
			returningId=unit.terr;
			if(unit.piece==10)
				generalFlg=true;
			attacker = unit.owner;
			if(!fromTerrHash[unit.terr] || fromTerrHash[unit.terr]==13) {
				fromTerrHash[unit.terr]=unit.piece;
			}
			if(unit.type==3)
				waterPiece=unit.piece;
		});
		if(includesFacFlg) {
			console.log('+++illegal fac move attempt. fixed.+++');
			return;
		}
		if(terr.nation==99 && terr.unitCount==0)
			warFlg = false;
		if(warFlg) {
			terr.incomingFlg = true;
		}
		if(nukes>0 && warFlg) 
			nukeFlg=true;
		if(emps>0 && warFlg) {
			empFlg=true;
			nukeFlg=false;
		}
		
		var cruiseFlg=(type=='cruise');

		var battleId=$scope.gameObj.battleId; //battleId! battle.battleDetails
		$scope.battle.battleId=battleId;
		$scope.gameObj.battleId++;
		var battleDetails=attackPieces.join('+')+'|'+terr.defendingUnits;
		var neutralFlg = (terr.owner==0 && terr.nation<99);
		var battle = {id: battleId, round: 0, cruiseFlg: cruiseFlg, attCasualties: [], defCasualties: [], battleDetails: battleDetails, type: type, defender: terr.owner, defCount: terr.unitCount, losses: 0, hits: 0, nukeFlg: nukeFlg, empFlg: empFlg, returningId: returningId, removeLockFlg: removeLockFlg, terr: terr.id, units: units, active: false, owner: defender, attacker: attacker, warFlg: warFlg, generalFlg: generalFlg, neutralFlg: neutralFlg, includesDronesFlg: includesDronesFlg};
		$scope.gameObj.battles.push(battle);

		var k = Object.keys(fromTerrHash);
		k.forEach(function(str) {
			var terrId = parseInt(str);
			var piece = parseInt(fromTerrHash[str]);
			if(terrId>=79 && waterPiece>0)
				piece=waterPiece;
			var ter = $scope.gameObj.territories[terrId-1];
			if(warFlg && terrId==returningId)
				ter.holdFlg=true;
			refreshTerritory(ter);
			var speed=200; // 100=fast,500=medium,600=slow
			if(cruiseFlg)
				speed=100;
			var sprite = getSprite(piece, 22, ter.x,ter.y+95,terr.x,terr.y+95, speed, battle);
		});
//		setTimeout(function() { scanBattles(); }, 1000);
//		setTimeout(function() { scanBattles(); }, 2000);
	}
	function okToMove(optionType, terr) {
//		if(optionType=='loadUnits' && terr.nation==99) {
//			return false;
//		}
		return true;
	}
	$scope.productionButtonClicked = function() {
		playClick($scope.muteSound);
		$scope.optionType = ($scope.optionType=='production')?'none':'production';
		$scope.showTopUnits=false;
		$scope.showBottomUnits=false;
		checkPurchaseButtons();
	}
/*	$scope.unitsButtonClicked = function() {
		playClick($scope.muteSound);
		$scope.optionType = ($scope.optionType=='units')?'none':'units';
		$scope.showAllUnits=($scope.optionType=='units');
	}*/
	$scope.showUnitsButtonClicked = function() {
		playClick($scope.muteSound);
		$scope.optionType = ($scope.optionType=='units')?'none':'units';
		$scope.showTopUnits=true;
		$scope.showBottomUnits=true;
	}
	$scope.changeProdType = function(num) {
		playClick($scope.muteSound);
		$scope.unitFilter=num;
		updateButtonFilters(num);
		$scope.productionUnits = [];
		if(num==0) { //land
			$scope.productionUnits = [$scope.gUnits[1],$scope.gUnits[2],$scope.gUnits[3],$scope.gUnits[19]];
		}
		if(num==1 || num==99) //water
			$scope.productionUnits = [$scope.gUnits[4],$scope.gUnits[5],$scope.gUnits[8],$scope.gUnits[9],$scope.gUnits[12],$scope.gUnits[6],$scope.gUnits[13]];
		if(num==2) //air
			$scope.productionUnits = [$scope.gUnits[6],$scope.gUnits[7],$scope.gUnits[13],$scope.gUnits[14]];
		if(num==3 || num==99) { // spec or water
			var num2 = parseInt($scope.gameObj.currentNation)+19;
			if(1) { //4
				var unit = $scope.gUnits[num2];
				unit.locked=($scope.playerRank<4);
				if(isUnitGoodForForm(num, unit.type,  unit.subType))
					$scope.productionUnits.push(unit);
			}
			if(1) { //7
				var unit = $scope.gUnits[num2+8];
				unit.locked=($scope.playerRank<7);
				if(isUnitGoodForForm(num,  unit.type,  unit.subType))
					$scope.productionUnits.push(unit);
			}
			if(1) { //10
				var unit = $scope.gUnits[num2+16];
				unit.locked=($scope.playerRank<10);
				if(isUnitGoodForForm(num,  unit.type,  unit.subType))
					$scope.productionUnits.push(unit);
			}
			if(1) { // new units
				var unit = $scope.gUnits[num2+24];
				unit.locked=($scope.playerRank<14);
				if(isUnitGoodForForm(num,  unit.type,  unit.subType))
					$scope.productionUnits.push(unit);
			}
		}
		
		setTimeout(function() { checkPurchaseButtons(); }, 100);	
	}
	function isUnitGoodForForm(num, type, subType) {
		if(num==3 && type!=3)
			return true;
		if(num==99 && (type==3 || type==4))
			return true;
		if(num==99 && subType=='fighter')
			return true;
		return false;
	}
	function addUniToFacQueue(fac,player,piece,count,terrId) {
		if(!terrId)
			terrId=fac.terrId;
		if(terrId && terrId.id && terrId.id>0)
			terrId=terrId.id;
		if(isNaN(terrId)) {
			showAlertPopup('Whoa, isNaN');
			console.log('Whoa, isNaN');
		}
		terrId=numberVal(terrId);
		
		if(!$scope.gameObj.unitPurchases)
			showAlertPopup('who, no $scope.gameObj.unitPurchases', 1);

		addUnitsOntoQueue(piece, player, terrId, count);
//		setTimeout(function() { addUnitsOntoQueue(piece, player, terrId, count); }, 10);	
	}
	function addUnitsOntoQueue(piece, player, terrId, count) {
		var unit = $scope.gUnits[piece];
		var cost=unit.cost;

		for(var x=0; x<count; x++) {
			if(player.money-cost>=0) {
				player.money-=cost;
				var id = $scope.gameObj.unitPurchases.length+1;
				$scope.gameObj.unitPurchases.push({id: id, terr: terrId, piece: unit.id});
				if(piece==18) {
					$scope.techsBoughtThisTurn++;
					$scope.techCount++;
				}
			}
		}
		if(!$scope.cpuPlayerFlg)
			checkPurchaseButtons();
//		$scope.$apply();
	}
	$scope.addTechToQueue=function(id) {
		if(id==16)
			disableButton('techButton1', true);
		if(id==17)
			disableButton('techButton2', true);
		if(id==18) {
			if($scope.techPurchasedThisTurn) {
				showAlertPopup('Sorry, research not allowed once you completed initial purchases', 1);
				return;
			}
			disableButton('techButton3', $scope.techCount>=17);
		}
		if($scope.currentPlayer.money>=10)
			$scope.addUniToQueue(id, 1);
		else
			playSound('error.mp3', 0, $scope.muteSound);
		chechTechnologyButtons($scope.currentPlayer);
	}
	$scope.selectAllBattleShipUpg=function() {
		var checked = document.getElementById('bsb99').checked;
		if(checked) {
			$scope.battleshipCost=45;
			if($scope.battleshipCost>$scope.currentPlayer.money) {
				playSound('error.mp3', 0, $scope.muteSound);
				disableButton('battleshipBuyButton', ($scope.battleshipCost>$scope.currentPlayer.money));
				return;
			}
		} else {
			$scope.battleshipCost=0;
		}
		for(var x=1; x<=10;x++) {
			var e = document.getElementById('bsb'+x);
			e.checked=checked;
		}
		$scope.addUpBattleShipCost();
		disableButton('battleshipBuyButton', ($scope.battleshipCost>$scope.currentPlayer.money));
	}
	$scope.addUpBattleShipCost=function() {
		var superBCForm = {name: '', hp: 0, att: 0, def: 0, adCount: 0, numAtt: 0, numDef: 0, cost: 0};
		for(var x=1; x<=10;x++) {
			var e = document.getElementById('bsb'+x);
			if(e && e.checked) {
				if(x==1 || x==2)
					superBCForm.hp++;
				if(x==3 || x==4)
					superBCForm.adCount++;
				if(x==5 || x==6)
					superBCForm.numAtt++;
				if(x==7 || x==8)
					superBCForm.numDef++;
				if(x==9)
					superBCForm.att++;
				if(x==10)
					superBCForm.def++;
				superBCForm.cost+=3;
			}
		}
		$scope.battleshipCost=15+superBCForm.cost;
		$scope.gameObj.superBCForm = superBCForm;
		if($scope.battleshipCost>$scope.currentPlayer.money) {
			playSound('error.mp3', 0, $scope.muteSound);
		}
		disableButton('battleshipBuyButton', ($scope.battleshipCost>$scope.currentPlayer.money));
	}
	$scope.buyBattleShipButtonClicked=function() {
		$scope.battleshipFormOpen=false;
		console.log('$scope.battleshipCost', $scope.battleshipCost);
		$scope.currentPlayer.money-=($scope.battleshipCost-15);
		$scope.gameObj.superBCForm.cost=$scope.battleshipCost;
		closePopup('battleshipPopup');
		addUniToFacQueue($scope.selectedFactory,$scope.currentPlayer,12,1,$scope.selectedTerritory);
	}
	$scope.buyBattleShipCancelButtonClicked=function() {
		$scope.battleshipFormOpen=false;
		closePopup('battleshipPopup');
	}
	$scope.buyEmp = function() {
		if($scope.currentPlayer.totalTech<18) {
			showAlertPopup('You must have all 18 techs researched to buy an EMP.', 1);
			return;
		}
		if($scope.currentPlayer.empCount<=0) {
			showAlertPopup('No EMP Available!', 1);
			return;
		}
		if($scope.currentPlayer.empPurchaseRd>0) {
			showAlertPopup('Sorry, only 1 EMP per game!', 1);
			return;
		}
		$scope.currentPlayer.empCount--;
		playSound('clink.wav', 0, $scope.muteSound);
		disableButton('buyEMP', true);
		addUniToFacQueue(null,$scope.currentPlayer,52,1,$scope.selectedTerritory);
		showAlertPopup('Special notice: Since you are buying an EMP, once you press the Purchase Complete button, your purchases will be final. You will not be able to redo your purchases.', 1);
	}
	function getOpenCarrierSlots() {
		var fighterCount=0;
		var carrierSlots=0;
		$scope.gameObj.unitPurchases.forEach(function(unit) {
			if(unit.terr==$scope.selectedTerritory.id) {
				if(unit.piece==6)
					fighterCount++;
				if(unit.piece==8)
					carrierSlots+=2;
			}
		});
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.terr==$scope.selectedTerritory.id && unit.owner==$scope.currentPlayer.nation) {
				if(unit.piece==6)
					fighterCount++;
				if(unit.piece==8)
					carrierSlots+=2;
			}
		});
		return carrierSlots-fighterCount;
	}
	$scope.addUniToQueue = function(id, count) {
		if($scope.gameObj.restrict_units_flg=='Y' && id>=20) {
			showAlertPopup('Special Units not allowed in this game.', 1);
			return;
		}
		if(id==44 && (!$scope.currentPlayer.generalFlg || !$scope.currentPlayer.leaderFlg)) {
			showAlertPopup('You can no longer create Seals because you have lost a hero.', 1);
			return;
		}
		if((id==6 || id==22 || id==23 || id==43 || id==48) && $scope.selectedTerritory.id>=79) {
			var openSlots=getOpenCarrierSlots();
			if(openSlots<count) {
				showAlertPopup('No room for fighters! Add an aircraft carrier first.', 1);
				return;
			}
		}
		if($scope.gameObj.id != '10573' && $scope.gameObj.id != '10574') {
			if($scope.playerRank<4 && id>=20 && id<=27) {
				showAlertPopup('You must reach rank of Sereant to unlock this unit!', 1);
				return;
			}
			if($scope.playerRank<7 && id>=28 && id<=35) {
				showAlertPopup('You must reach rank of Warrant Officer W1 to unlock this unit!', 1);
				return;
			}
			if($scope.playerRank<10 && id>=36 && id<=43) {
				showAlertPopup('You must reach rank of Lieutenant to unlock this unit!', 1);
				return;
			}
			if($scope.playerRank<14 && id>=44 && id<=51) {
				showAlertPopup('You must reach rank of Brig General to unlock this unit!', 1);
				return;
			}
		}
			
		playSound('clink.wav', 0, $scope.muteSound);
		if(id==19 && $scope.facBombedFlg)
			$scope.facBombedFlg=false;
		if(id==12) {
			$scope.battleshipCost=15;
			$scope.battleshipFormOpen=true;
			for(var x=1; x<=10;x++) {
				var e = document.getElementById('bsb'+x);
				e.checked=false;
			}
			displayFixedPopup('battleshipPopup');
			return;
		}
		addUniToFacQueue(null,$scope.currentPlayer,id,count,$scope.selectedTerritory);
	}
	$scope.clearQueue = function() {
		playClick($scope.muteSound);
		$scope.techsBoughtThisTurn=0;
		var newUnits=[];
		$scope.gameObj.unitPurchases.forEach(function(purchUnit) {
			if(purchUnit.terr==$scope.selectedTerritory.id) {
				var unit = $scope.gUnits[purchUnit.piece];
				$scope.currentPlayer.money += unit.cost;
				if(purchUnit.piece==52) {
					$scope.currentPlayer.empCount++;
				}
				if(purchUnit.piece==12) {
					$scope.currentPlayer.money+=$scope.gameObj.superBCForm.cost-15;
					$scope.battleshipCost=0;
					$scope.gameObj.superBCForm.cost=0;
				}
			} else {
				newUnits.push(purchUnit);
			}
		});
		$scope.gameObj.unitPurchases=newUnits;
		$scope.displayQueue=getDisplayQueueFromQueue($scope.selectedTerritory);
		checkPurchaseButtons();
		chechTechnologyButtons($scope.currentPlayer);
	}
	function checkPurchaseButtons() {
		$scope.displayQueue=getDisplayQueueFromQueue($scope.selectedTerritory);
		if(!$scope.selectedTerritory)
			return;
		var money=$scope.currentPlayer.money;
		for(var x=0; x<$scope.gUnits.length; x++) {
			var unit = $scope.gUnits[x];
			disableButton('buy'+unit.id, money-unit.cost<0);
			disableButton('buy5'+unit.id, money-unit.cost<0);
			if(unit.id==15 || unit.id==19) {
				disableButton('buy5'+unit.id, true);
			}
		}
		if(money<3)
			disableButton('buy52', true);
		disableButton('buyEMP', $scope.currentPlayer.empCount<=0);
		if($scope.selectedTerritory.factoryCount>1) {
			disableButton('buy15', true);
			disableButton('buy19', true);
		}
		if($scope.unitFilter==1 || $scope.selectedTerritory.id>=79)
			disableButton('buy512', true);
		if(spbInQueue())
			disableButton('buy12', true);
		var maxfacs=1;
		if($scope.selectedTerritory.facBombed)
			maxfacs=2;
		var numOfFacs=0;
		$scope.gameObj.unitPurchases.forEach(function(pUnit) {
			if(pUnit.terr==$scope.selectedTerritory.id) {
				var p = pUnit.piece;
				if(p==15 || p==19) {
					numOfFacs++;
					if(numOfFacs>=maxfacs) {
						disableButton('buy15', true);
						disableButton('buy19', true);
					}
				}
			}
		});

	}
	function spbInQueue() {
		if($scope.currentPlayer.sbcFlg)
			return true;
		var flg=false;
		$scope.gameObj.unitPurchases.forEach(function(pUnit) {
			if(pUnit.piece==12) {
				flg = true;
			}
		});
		return flg;
	}
	$scope.actionButtonPressed = function() {
		playClick($scope.muteSound);
		displayFixedPopup("actionPopup");
		if($scope.currentPlayer.status==gStatusPurchase)
			document.getElementById("actionMessage").innerHTML = 'Purchase units by clicking on the factories you want to produce units. Then press "Purchase Complete"';
		if($scope.currentPlayer.status==gStatusAttack || $scope.currentPlayer.status==gStatusMovement)
			document.getElementById("actionMessage").innerHTML = 'Conduct battles & movement, then press "Complete Turn" to add your new units and end your turn.';
		if($scope.currentPlayer.status==gStatusPlaceUnits)
			document.getElementById("actionMessage").innerHTML = 'Press "Complete Turn" to end your turn.';
	}
	$scope.refreshEntireBoard=function() {
		closePopup('infantry3Confirm');
		setTimeout(function() { initBoard(); }, 50);
		setTimeout(function() { verifyLoad(); }, 10000);		
	}
	$scope.redoMoves=function(menuFlg) {
		playClick($scope.muteSound);
		if(menuFlg)
			$scope.openCloseSlider('menu1');
		disableButton('redoMovesButton1', true);
		closePopup('infantry3Confirm');
		whiteoutScreen();
		startSpinner('Resetting board...');
		setTimeout(function() { doRedoMoves(); }, 100);
	}
	function doRedoMoves() {
		whiteoutScreen();
		$scope.gameObj = loadLastSavedGame($scope.gameObj.multiPlayerFlg);
		scrubGameObj($scope.gameObj);
		setTimeout(function() { launchGame(); }, 50);
	}
	$scope.retreatOption=function(num) {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.nation==$scope.currentPlayer.nation && unit.piece==10 ) {
				var prevTerr = unit.prevTerr;
				var terr = unit.terr;
				if(prevTerr==terr) {
					showAlertPopup('sorry, unable to retreat.', 1);
				} else {
					var t1 = $scope.gameObj.territories[prevTerr-1];
					var t2 = $scope.gameObj.territories[terr-1];
					if(num==1) {
						unit.prevTerr=unit.terr;
						unit.terr=t1.id;
					} else {
						unit.prevTerr=unit.terr;
						unit.terr=t2.id;
					}
					refreshTerritory(t1);
					refreshTerritory(t2);
					showAlertPopup('done.');
				}
			}
		});
		$scope.displayRetreatOptions=false;
	}
	$scope.retreatGeneral=function() {
		$scope.displayRetreatOptions=!$scope.displayRetreatOptions;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.nation==$scope.currentPlayer.nation && unit.piece==10 ) {
				var prevTerr = unit.prevTerr;
				var terr = unit.terr;
				if(prevTerr==terr) {
					showAlertPopup('sorry, unable to retreat.', 1);
					$scope.displayRetreatOptions=false;
				} else {
					var t1 = $scope.gameObj.territories[prevTerr-1];
					$scope.t1Name=t1.name;
					var t2 = $scope.gameObj.territories[terr-1];
					$scope.t2Name=t2.name;
				}
			}
		});
	}
	$scope.helpButtonPressed=function() {
		scrollToCapital($scope.gameObj.currentNation);
		displayHelpMessages(true);
		changeClass('completeTurnButton', 'glowButton');
	}
	$scope.ruleBookPressed=function() {
		displayFixedPopup('rulebookPopup', true);
	}
	function resetTroopsForPractice() {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==2 && unit.type<3 && unit.att>0)
				unit.terr=7;
			if(unit.owner==2 && unit.type==3)
				unit.terr=110;
			if(unit.owner==2) {
				unit.movesLeft=2;
				unit.movesTaken=0;
			}
		});
	}
	$scope.resetBoardButtonPressed=function() {
		var practiceStep=numberVal(localStorage.practiceStep);
		console.log('resetBoardButtonPressed', practiceStep);
		playClick($scope.muteSound);
		changeClass('redoPracticeButton', 'btn btn-primary roundButton bottomButton');
		if(practiceStep==0) {
			 resetTroopsForPractice();
			$scope.gameObj.territories.forEach(function(terr) {
				refreshTerritory(terr);
			});
			if(numberVal(localStorage.practiceStep)==0 && $scope.practiceClick==4)
				$scope.practiceClick++;
		}
		if(practiceStep==1) {
			var ukraine=$scope.gameObj.territories[61];
			ukraine.attackedByNation=0;
			ukraine.attackedRound=0;
			ukraine.defeatedByNation=0;
			ukraine.owner=0;
			var deadUnits=[];
			$scope.gameObj.units.forEach(function(unit) {
				if(unit.terr==62 || (unit.owner==2 && unit.type==1 && unit.att>0)) {
					unit.hp=0;
					unit.dead=true;
					unit.terr=1;
					deadUnits.push(unit);
				}
			});
			deadUnits.forEach(function(unit) {
				deleteItem($scope.gameObj.units, unit.id);
			});
			placeUnitsOnTerrId(62, [2,2,2]);
			placeUnitsOnTerrId(7, [2,2,2,2,2,2,3,3,10,11,6], 2, true);
		}
		showPracticeInfo(numberVal(localStorage.practiceStep), numberVal($scope.practiceClick), $scope.gTerritories);
	}
	$scope.practiceDoneButtonPressed=function() {
		playClick($scope.muteSound);
		var practiceStep=numberVal(localStorage.practiceStep);
		practiceStep++;
		localStorage.practiceStep=practiceStep.toString();
		$scope.resetBoardButtonPressed();
		if(practiceStep>=3) {
			clearCurrentGameId();
			window.location = "index.html#!/";
		} else {
			displayHelpMessages();
		}
	}
	function computerAnnouncement(msg) {
		console.log('here', msg);
		var url = getHostname()+"/webSuperpowers.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        msg: msg,
		        action: 'computerAnnouncement'
		    },
		    function(data, status){
		    	console.log(data, status);
		    });
	}
	function displayHelpMessages(forceShowFlg) {
		$scope.practiceStep=numberVal(localStorage.practiceStep);
		console.log('practiceStep', $scope.practiceStep);
		var practiceMode=($scope.user.rank==0 && $scope.practiceStep<3);
		if(practiceMode) {
			$scope.gameObj.initializedFlg=true;
			
			initializePlayer($scope.gameObj.players[0]);
			$scope.practiceClick=0;
			document.getElementById('redoMovesButton1').style.display='none';
			resetTroopsForPractice();
			console.log('practice init here!!!', $scope.currentPlayer);
			if($scope.practiceStep==0 || $scope.practiceStep==1)
				$scope.currentPlayer.status='Attack';
			if($scope.practiceStep==2)
				$scope.currentPlayer.status='Purchase';
			showPracticeInfo(numberVal(localStorage.practiceStep), numberVal($scope.practiceClick), $scope.gTerritories);
			disableButton('donePracticeButton', true);
			return;
		}
		if($scope.gameObj.multiPlayerFlg || $scope.gameObj.initializedFlg) {
			initializePlayer($scope.gameObj.players[$scope.gameObj.turnId-1]);
			if($scope.ableToTakeThisTurn)
				displayHelpPopupMessages(forceShowFlg);
		} else {
			if($scope.user.rank==0) {
				if($scope.practiceStep==3) {
					$scope.showControls=false;
					startIntro();
				}
			} else {
				scrollToCapital(localStorage.startingNation);
				$scope.currentPlayer = {nation: localStorage.startingNation};
				$scope.showLeftArrow=true;
				setTimeout(function() { 
					showUpArrowAtElement('playersButton');
					militaryAdvisorPopup('New Game! You are starting as '+$scope.superpowers[localStorage.startingNation]+'. Press the "Players" button on the top, to see what CPU players you will be up against.', 20); 
					}, 2000);	
			}
		}
	}
	function displayHelpPopupMessages(forceShowFlg) {
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if(practiceMode)
			return;
		if($scope.gameObj.round==1 && $scope.currentPlayer.status=='Attack') {
			$scope.gameObj.gameInProgressFlg=true;
			document.getElementById('arrow').style.display = 'none';
		}
		if($scope.user.rank==1 && $scope.gameObj.round>=15 && $scope.currentPlayer.income<25) {
			militaryAdvisorPopup('Sorry, but you just had your ass handed to you! It is time to surrender. Click the "Menu" button on the left and click on "Surrender". Then try again!');
			return;
		}
		if($scope.user.rank>0 && $scope.gameObj.round==1 && $scope.currentPlayer.status=='Attack')
			playVoiceSound(51, $scope.muteSound);
			
		if($scope.user.rank==0) {
			if($scope.gameObj.round==1) {
				if($scope.currentPlayer.status=='Attack') {
					var ukraine=$scope.gameObj.territories[61];
					if(ukraine.owner == 2) {
						militaryAdvisorPopup('Your military units only get to attack once per turn. Click "Complete Turn" at the top.');
					} else {
						playVoiceSound(47, $scope.muteSound);
						militaryAdvisorPopup('Begin the conquest! '+$scope.firstAttack[$scope.currentPlayer.nation]+' would be a great first target for you to attack. Click on Ukraine to invade!');
						var e = document.getElementById('arrow');
						e.style.display='block';
						e.style.position='absolute';
						e.style.left=(657).toString()+'px';
						e.style.top=(340).toString()+'px';
						highlightTerritory(62, 0, true);
					}
				}
			} 
			if($scope.gameObj.round==2 && $scope.user.rank==0 && $scope.currentPlayer.status=='Attack') {
//				highlightTerritory(14, 3, true);
				highlightTerritory(15, 3, true);
				showUpArrow(730-40,177+130); //730, y: 177
				militaryAdvisorPopup('Begin the assault on Russia! Click on either Karelia or Chechnya to attack.');
			}
			if($scope.gameObj.round==3 && $scope.user.rank==0 && $scope.currentPlayer.status=='Attack')
				militaryAdvisorPopup('Continue the assault on Russia! To move units closer to the front line, click on the territory you want to move units INTO.');
		} 
		if($scope.user.rank==1) {
			/*
			if($scope.gameObj.round==1 && $scope.currentPlayer.status=='Attack') {
	    			$scope.gameObj.territories.forEach(function(terr) {
	    				if(terr.id>79 && terr.owner==$scope.currentPlayer.nation && terr.capital) {
						militaryAdvisorPopup('Special notice: In order to move units across the sea, you must first load them into a transport. Let\'s practice that. Click on your transport in '+terr.name+'.');
						$scope.gameObj.transportFlg=true;
						var e = document.getElementById('arrow');
						e.style.display='block';
						e.style.position='absolute';
						e.style.left=(terr.x-35).toString()+'px';
						e.style.top=(terr.y+130).toString()+'px';
	    				}
				});
			}*/
			if($scope.gameObj.round==2 && $scope.currentPlayer.status=='Attack') {
						militaryAdvisorPopup('Special notice: Click the "Logs" button at the top to review previous actions.');
						$scope.gameObj.logsFlg=true;
						showUpArrowAtElement('logsButton');
			}
		}
		if($scope.user.rank>1) {
			if(forceShowFlg) {
				if($scope.currentPlayer.status=='Attack')
					militaryAdvisorPopup('Conduct attacks, then press "Complete Turn" button at the top to end your turn.');
				else
					militaryAdvisorPopup('Purchase units and then press "Purchase Complete".');
			}
		}
	}
	function startIntro() {
		displayFixedPopup('introPopup');
		
		setTimeout(function() { fadeInDiv('intro1', ''); playSound('zap.mp3', 0, $scope.muteSound); }, 3000);	
		setTimeout(function() { fadeInDiv('intro2', ''); playSound('zap.mp3', 0, $scope.muteSound); playVoiceSound(41, $scope.muteSound);  }, 6000);	
		setTimeout(function() { fadeInDiv('intro3', ''); playSound('zap.mp3', 0, $scope.muteSound);}, 9000);	
		setTimeout(function() { 
			fadeInDiv('intro4', 'glowButton'); 
			fadeInDiv('intro5', 'btn btn-primary ptp-gray'); 
			playSound('zap.mp3', 0, $scope.muteSound); 
			}, 12000);	
	}
	$scope.introContinuePressed=function() {
		playClick($scope.muteSound);
		closePopup('introPopup');
		
		var delay=2500;
		setTimeout(function() { $scope.pingNation=1; targetNation(1); }, delay*0);	
		setTimeout(function() { $scope.pingNation=2; targetNation(2); }, delay*1);	
		setTimeout(function() { $scope.pingNation=3; targetNation(3); }, delay*2);	
		setTimeout(function() { $scope.pingNation=4; targetNation(4); }, delay*3);	
		setTimeout(function() { $scope.pingNation=5; targetNation(5); }, delay*4);	
		setTimeout(function() { $scope.pingNation=6; targetNation(6); }, delay*5);	
		setTimeout(function() { $scope.pingNation=7; targetNation(7); }, delay*6);	
		setTimeout(function() { $scope.pingNation=8; targetNation(8); }, delay*7);
		setTimeout(function() { displayFixedPopup('introPopup2'); }, delay*8);	
	}
	$scope.introContinuePressed2=function() {
		playClick($scope.muteSound);
		playVoiceSound(42, $scope.muteSound);
		closePopup('introPopup2');
		startBasicTraining(); 
	}
	function startBasicTraining() {
		$scope.showControls=true;
		$scope.showMenuControls=true;
		basicTrainingIntro(0);
	}
	function targetNation(num) {
		$scope.pingNation=num; 
		scrollToCapital(num);
		$scope.$apply();
	}
	$scope.closeButtonButtons=function() {
		if(document.getElementById('redoMovesButton1').style.display=='none') {
			document.getElementById('sidelinePopup').style.display='block';
			document.getElementById('toggleLabels').style.display='block';
			if($scope.user.rank>0)
				document.getElementById('redoMovesButton1').style.display='block';
			document.getElementById('helpButton').style.display='block';
		} else {
//			document.getElementById('sidelinePopup').style.display='none';
			document.getElementById('toggleLabels').style.display='none';
			document.getElementById('redoMovesButton1').style.display='none';
			document.getElementById('helpButton').style.display='none';
		}
	}
	$scope.redoPurchase=function() {
		$scope.openCloseSlider('menu1');
		if($scope.currentPlayer.status==gStatusPurchase) {
			showAlertPopup('already in purchase!!', 1);
			return;
		}
		if($scope.currentPlayer.lastMovedRound==$scope.gameObj.round) {
			showAlertPopup('Cannot redo purchase. already moved this turn.', 1);
			return;
		}
		if($scope.currentPlayer.empPurchaseRd==$scope.gameObj.round) {
			showAlertPopup('Cannot redo purchase because you bought EMP.', 1);
			return;
		}
		var techPurchases=0;
	    	for(var x=0; x<$scope.gameObj.factories.length; x++) {
	    		var factory=$scope.gameObj.factories[x];
	    		if(factory.owner==$scope.currentPlayer.nation) {
	    			factory.prodQueue.forEach(function(piece) {
	    				if(piece=='16' || piece=='17' || piece=='18')
	    					techPurchases++;
				});

	    		}
	    			
	    	}
		if(techPurchases>0) {
			showAlertPopup('Cannot redo purchase due to technology purchases.', 1);
			return;
		}
		logItem($scope.currentPlayer, 'Redoing Purchases', 'Redo');
		showAlertPopup('Redoing Purchases.');
		$scope.currentPlayer.status=gStatusPurchase;
		$scope.gameObj.actionButtonMessage='Purchase Complete';
		setTimeout(function() { resetMessageButton(); }, 1000);	
		saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
	}
	$scope.diplomacyOptionClicked=function() {
		disableButton('completeTurnButton', false);
		$scope.openCloseSlider('allies');
	}
	$scope.completeTurnButtonPressed = function(passFlag) {
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if(practiceMode) {
			disableButton('completeTurnButton', true);
			return;
		}
		if($scope.gameObj.round==1 && $scope.currentPlayer.placedInf<3) {
			showAlertPopup('Place your 3 infantry first.', 1);
			return;
		}
		if($scope.terrNeedsToBeClickedFlg) {
			showAlertPopup('Load your newly placed fighters by clicking on that water territory.', 1);
			$scope.terrNeedsToBeClickedFlg=false;
			return;
		}
		if($scope.treatyMinimized || $scope.treatyOffered) {
			showAlertPopup('Finish your diplomacy first. Click on the "Treaty Offers" button at the bottom.', 1);
			return;
		}
		if($scope.user.rank<2 && $scope.gameObj.round==1 && $scope.currentPlayer.money>=20 && $scope.currentPlayer.status=='Purchase') {
			showAlertPopup('Conduct purchases first. Click on your capital, '+$scope.nations[$scope.currentPlayer.nation]+'.', 1);
			return;
		}
		if($scope.gameObj.gameOver || !$scope.gameObj.actionButtonMessage || $scope.gameObj.actionButtonMessage.length==0)
			return;
		if($scope.battleshipFormOpen) {
			showAlertPopup('Close Battleship Form', 1);
			return;
		}
		if($scope.user.rank==0 && $scope.gameObj.round==1 && $scope.currentPlayer.money==20 && $scope.currentPlayer.status=='Purchase') {
			showAlertPopup('First step: Purchase Units. Click on Germany, then buy some units.', 1);
			return;
		}
		if($scope.user.rank==0 && $scope.gameObj.round==1 && $scope.currentPlayer.status=='Attack') {
			var ukraine=$scope.gameObj.territories[61];
			if(ukraine.owner != 2) {
				showAlertPopup('Let\'s put your military to the test! Click on Ukraine and attack it with all your troops.', 1);
				return;
			}
		}
		if($scope.user.rank==0 && $scope.gameObj.round==2 && $scope.currentPlayer.status=='Attack') {
			var c1=$scope.gameObj.territories[14-1];
			var c2=$scope.gameObj.territories[15-1];
			if(c1.owner != 2 && c2.owner != 2 && c1.attackedRound !=2 && c2.attackedRound !=2) {
				showAlertPopup('Continue the assault of Russia! Attack either Karelia or Chechnya.', 1);
				return;
			}
		}
		$scope.allowTurnToEnd=false;
		hideArrow();
		playClick($scope.muteSound);
		closePopup('actionPopup');
		closePopup('diplomacyWarningPopup');
		closeThePopup(true);
		if($scope.waitForSaveFlg) {
			$scope.waitForSaveFlg=false;
			showAlertPopup('Saving game, please try again.', 1);
			return;
		}
		if($scope.gameObj.battles.length>0) {
			var terr=$scope.gameObj.territories[$scope.gameObj.battles[0].terr-1];
			showAlertPopup('Sync Error. Battle in '+ terr.name+'. Refresh browser or exit and re-enter app.', 1);
			return;
		}
		if($scope.gameObj.actionButtonMessage=='Redo Purchase') {
			$scope.currentPlayer.status=gStatusPurchase;
			$scope.gameObj.actionButtonMessage='Purchase Complete';
			setTimeout(function() { resetMessageButton(); }, 1000);	
			saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
			disableCompleteButtons();
		} else if($scope.currentPlayer.status==gStatusPurchase) {
			if($scope.user.rank==0 && $scope.currentPlayer.money>=$scope.currentPlayer.income && $scope.gameObj.round<3) {
				showAlertPopup('Purchase units first. Click on Germany.', 1);
				return;
			}
			if($scope.currentPlayer.money>=$scope.currentPlayer.income && !passFlag) {
				showConfirmationPopup('Do you wish to complete purchase with un-spent money?', 'confirmPurchase');
				return;
			}
			$scope.currentPlayer.generalCanRetreat=false;
			cleanUpTerritories($scope.currentPlayer, true);
			logPurchases($scope.currentPlayer);
			scrubUnitsOfPlayer($scope.currentPlayer);
			$scope.currentPlayer.status=gStatusAttack;
			$scope.gameObj.actionButtonMessage='Complete Turn';
			displayHelpPopupMessages();
			saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
			setTimeout(function() { resetMessageButton(); }, 1000);	
			disableCompleteButtons();
		} else  {
			countUnusedUnits($scope.currentPlayer);
			displayFixedPopup('diplomacyWarningPopup');
		}
	}
	$scope.finalEndTurnButtonPressed=function() {
		playClick($scope.muteSound);
		$scope.allowTurnToEnd=true;
		closePopup('actionPopup');
		closePopup('diplomacyWarningPopup');
		if($scope.user.rank<=2) {
			var ipCode = ($scope.user.rank*100)+$scope.gameObj.round;
			registerIP(ipCode);
		}
		var numAddedUnitsToAdd=0;
		if(!$scope.carrierAddedFlg) {
			numAddedUnitsToAdd=addUnitsToBoard($scope.gameObj.turnId);
			if(numAddedUnitsToAdd<0) {
				$scope.carrierAddedFlg=true;
				setTimeout(function() { resetMessageButton(); }, 1000);	
				if(numAddedUnitsToAdd==-2) {
					showAlertPopup('Fighters added to water territory. Click on the newly placed units to load them onto carriers.', 1);
					$scope.terrNeedsToBeClickedFlg=true;
				} else
					showAlertPopup('New Carrier or Battleship placed. You can load units onto it or press "Complete Turn".', 1);
				$scope.currentPlayer.status=gStatusPlaceUnits;
				return;
			}
		}
		$scope.showMenuControls=false;
		$scope.gameObj.actionButtonMessage='';
		//cleanupAircraft($scope.currentPlayer);
		if($scope.gameObj.multiPlayerFlg)
			$scope.uploadMultiplayerStats($scope.currentPlayer.nation);
		else
			startSpinner('Saving...', '150px');
		setTimeout(function() { showProgress(30); }, 500);
		setTimeout(function() { showProgress(75); }, 1000+numAddedUnitsToAdd*100);
		setTimeout(function() { endTurn($scope.currentPlayer); }, 1500+numAddedUnitsToAdd*100);
	}
	function countUnusedUnits(player) {
		var count=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.owner==player.nation && unit.movesLeft==2)
				count++;
		});
		$scope.unusedUnitCount=count;
	}
	function logPurchases(player) {
		var unitHash={};
		var techs=[];
		var newPurchaseUnits=[];
		$scope.technologyPurchases=[];
		$scope.gameObj.unitPurchases.forEach(function(pUnit) {
			var id=parseInt(pUnit.piece);
			if(id != 52 && (id<16 || id>18))
				newPurchaseUnits.push(pUnit);
			if(parseInt(id)===16)
				purchaseTechnology(19);
			if(parseInt(id)===17)
				purchaseTechnology(20);
			if(parseInt(id)===18) {
				$scope.techPurchasedThisTurn=true;
				var techId = purchaseTechnology(0);
				var tech = $scope.technology[techId-1];
				var i = Math.floor((tech.id-1)/3);
				var techpieces = [6,1,5,19,7,13];
				$scope.technologyPurchases.push({name: tech.name, i: i, piece: techpieces[i], desc: tech.desc});
				techs.push(tech.name);
			}
			if(id==52) {
				removeEMPFromServer();
				$scope.currentPlayer.empPurchaseRd=$scope.gameObj.round;
				createNewUnit(pUnit, true);
			}
			if(unitHash[id])
				unitHash[id]++;
			else
				unitHash[id]=1;
		});
		$scope.gameObj.unitPurchases=newPurchaseUnits;
		var units=[];
		var k = Object.keys(unitHash);
		k.forEach(function(unitId) {
			var count = unitHash[unitId];
			var piece = $scope.gUnits[unitId];
			if(piece.id==18)
				displayFixedPopup('technologyPopup');
			units.push(count+' '+piece.name);
		});
		logItem(player, 'Purchases', units.join(', '));
	}
	function removeEMPFromServer() {
		startSpinner('One moment...');
		var url = getHostname()+"/webCheckForum.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        action: 'removeEMP'
		    },
		    function(data, status){
		    	console.log(data);
			stopSpinner();
			if(!verifyServerResponse(status, data)) {
				$scope.showControls=false;
				$scope.$apply();
			}
		    });
	}
	function findFirstAlivePlayer() {
		for(var x=0; x<$scope.gameObj.players.length; x++) {
			var player = $scope.gameObj.players[x];
			if(player.alive)
				return player.turn;
		}
	}
	function checkGameTeams(incomes, capitals) {
		var x=0;
		$scope.gameObj.teams.forEach(function(team) {
			var nations = [];
			$scope.gameObj.players.forEach(function(player) {
				if(player.team==team.name)
					nations.push(player.nation);
			});
			team.nations=nations;
			team.income=incomes[x];
			team.capitals=capitals[x];
			x++;
		});
	}
	function addTechForPlayer(player) {
		var totalTech=0;
		player.tech.forEach(function(tech) {
			if(tech)
				totalTech++;
		});
		player.totalTech=totalTech;
	}
	function setPlayerTeams() {
		var currentTurn=-1;
		var teamHash={};
		var teamNum=0;
		var nextTurn=-1;
		for(var x=0; x<$scope.gameObj.players.length; x++) {
			var pl1 = $scope.gameObj.players[x];
			resetPlayerUnits(pl1); 
			if($scope.gameObj.turnId==pl1.turn)
				currentTurn=pl1.turn;
			if(currentTurn>=0 && $scope.gameObj.turnId!=pl1.turn && nextTurn==-1 && pl1.alive)
				nextTurn=pl1.turn;
			pl1.teamIndex = getTeamIndex(pl1);
			var team=0;
			if(teamHash[pl1.teamIndex]>0) {
				team=teamHash[pl1.teamIndex];
			} else {
				teamNum++;
				team=teamNum;
				teamHash[pl1.teamIndex]=teamNum;
			}
			pl1.team=team;
			console.log(pl1.nation, pl1.team);
		}
	}
	function endTurn(player) {
		if(!$scope.allowTurnToEnd && !player.cpu && player.alive) {
			showAlertPopup('Turn illegally trying to end. Refesh and try again!!!', 1);
			return;
		}
		$scope.allowTurnToEnd=false;
		secondsSinceLastSave=0;
		$scope.gameObj.secondsSinceUpdate=0;
//		var player = $scope.currentPlayer;
		if(player.status=='Attack')
			player.status = 'Place Units';
		if(player.nation != $scope.currentPlayer.nation) {
			showAlertPopup('Whoa! something out of sync!', 1);
			return;
		}
		if(player.status!='Place Units') {
			console.log('hey', player.nation, player.status, gStatusPlaceUnits),
			showAlertPopup('Whoa! something out of sync!', 1);
			return;
		}
		player.news=[];
//		var player = $scope.gameObj.players[$scope.gameObj.turnId-1];
		var currentTurn=-1;
		var nextTurn=-1;
		var teamNum=0;
		var teamHash={};
		var incomes=[0,0,0,0,0,0,0,0];
		var capitals=[0,0,0,0,0,0,0,0];
		addIncomeForPlayer(player);
		addTechForPlayer(player);
		for(var x=0; x<$scope.gameObj.players.length; x++) {
			var pl1 = $scope.gameObj.players[x];
			resetPlayerUnits(pl1); 
			if($scope.gameObj.turnId==pl1.turn)
				currentTurn=pl1.turn;
			if(currentTurn>=0 && $scope.gameObj.turnId!=pl1.turn && nextTurn==-1 && pl1.alive)
				nextTurn=pl1.turn;
			pl1.teamIndex = getTeamIndex(pl1);
			var team=0;
			if(teamHash[pl1.teamIndex]>0) {
				team=teamHash[pl1.teamIndex];
			} else {
				teamNum++;
				team=teamNum;
				teamHash[pl1.teamIndex]=teamNum;
			}
			pl1.team=team;
			incomes[team-1]+=pl1.income;
			capitals[team-1]+=pl1.cap;
		}
		player.botRequests=[];
		player.requestedHotSpot=0;
		player.requestedTarget=0;
		player.status='Waiting'
		player.money+=player.income;
		var damageReport = getDamageReport(player);
		logItem(player, 'Turn Completed', player.income+' Coins Collected.', '', '', '', '', damageReport);
		$scope.gameObj.superBCForm.cost=0;
		playSound('clink.wav', 0, $scope.muteSound);
		checkGameTeams(incomes, capitals);
		registerTeamStats(player);
		var nextPlayerCPU=false;
		if(!checkVictoryConditions(player)){
			if(nextTurn==-1) {
				$scope.gameObj.round++;
				nextTurn=findFirstAlivePlayer();
			}
				
			$scope.gameObj.turnId = nextTurn;
			var nextPlayer = $scope.gameObj.players[nextTurn-1];
			$scope.currentPlayer = nextPlayer;
			$scope.gameObj.currentNation=nextPlayer.nation;
			$scope.cpuAction=gStatusPurchase;
			nextPlayerCPU=nextPlayer.cpu;
			$scope.updateUploadNation(nextPlayer.nation);
			setTimeout(function() { initializePlayer(nextPlayer); }, 1000);
		}
		if(!$scope.gameObj.multiPlayerFlg)
			stopSpinner();

		var sendEmailFlg=($scope.gameObj.numPlayers>3);
		if($scope.currentPlayer.cpu || !$scope.currentPlayer.alive || $scope.gameObj.turboFlg)
			sendEmailFlg=false;
		
		console.log('sendEmailFlg', sendEmailFlg);
		saveGame($scope.gameObj, $scope.user, $scope.currentPlayer, sendEmailFlg, true, player, nextPlayerCPU, $scope.secondsLeft);
		applyChanges();
	}
	function getDamageReport(player) {
		var lostUnits=0;
		var lostCoins=0;
		var enemyUnits=0;
		var enemyCoins=0;
		$scope.gameObj.logs.forEach(function(log) {
			if(log.round==$scope.gameObj.round && log.nation==player.nation) {
				if(log.type=='Battle' || log.type=='Nuke Attack!' || log.type=='EMP Attack!' || log.type=='Cruise Attack!') {
					log.attackingCas.forEach(function(unit) {
						lostUnits++;
						lostCoins += $scope.gUnits[unit.piece].cost;
					});
					log.defendingCas.forEach(function(unit) {
						enemyUnits++;
						enemyCoins += $scope.gUnits[unit.piece].cost;
					});
				}
				if(log.type=='Strategic Bombing') {
					if(log.message.includes('Shot down: 1')) {
						lostUnits++;
						lostCoins += 15;
					}
					if(log.message.includes('Shot down: 2')) {
						lostUnits+=2;
						lostCoins += 30;
					}
					if(log.message.includes('Shot down: 3')) {
						lostUnits+=3;
						lostCoins += 45;
					}
					if(log.message.includes('Factories destroyed: 1')) {
						enemyUnits++;
						enemyCoins += 15;
					}
					if(log.message.includes('Factories destroyed: 2')) {
						enemyUnits+=2;
						enemyCoins += 30;
					}
				}
			}
		});
		return {lostUnits: lostUnits, lostCoins: lostCoins, enemyUnits: enemyUnits, enemyCoins: enemyCoins};
	}
	function registerTeamStats(player) {
		if(!$scope.gameObj.statsObj)
			$scope.gameObj.statsObj = [];
		var statsObj = $scope.gameObj.statsObj || [];
		var roundStarted=false;
		statsObj.forEach(function(obj) {
			if(obj.round==$scope.gameObj.round) {
				roundStarted=true;
			}
		});
		var thisTurnStatsObj = {};
		if(roundStarted)
			thisTurnStatsObj=$scope.gameObj.statsObj.pop();
			
		thisTurnStatsObj.round=$scope.gameObj.round;
		if(!thisTurnStatsObj.players)
			thisTurnStatsObj.players=[];
		thisTurnStatsObj.players.push({n: player.nation, i: player.income})
		
		thisTurnStatsObj.teams=[];
//		$scope.gameObj.players.forEach(function(player) {
//			thisTurnStatsObj.players.push({nation: player.nation, income: player.income})
//		});
		$scope.gameObj.teams.forEach(function(team) {
			var n = 1;
			if(team.nations && team.nations.length>0)
				n=team.nations[0]
			thisTurnStatsObj.teams.push({t: team.name, i: team.income, n: n});
		});
		$scope.gameObj.statsObj.push(thisTurnStatsObj);
	}
	function checkVictoryConditions(player) {
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if(practiceMode)
			return false;
		var teamHash={};
		var alivePlayers=[];
		var winFlg=false;
		var humanPlayers=0;
		var capitalListHash={};
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.id<79 && terr.capital && terr.owner>0) {
				var p = playerOfNation(terr.owner);
				if(!capitalListHash[p.team])
					capitalListHash[p.team]=[];
				capitalListHash[p.team].push(terr.nation);
			}
		});
		$scope.gameObj.players.forEach(function(pl) {
			if(pl.alive) {
				if(!pl.cpu) {
					humanPlayers++;
					winFlg=true;
				}
				alivePlayers.push($scope.superpowers[pl.nation]);
				if(teamHash[pl.team]>0) {
					teamHash[pl.team]++;
				} else
					teamHash[pl.team]=1;
			}
		});
		var t = Object.keys(teamHash);
//		t.forEach(function(team) {
//			console.log(team);
//		});
		if(t.length==1 || humanPlayers==0) {
			gameOver(player, alivePlayers, winFlg);
			return true;
		}
		var victoryMet=false;
		var gameOverFlg=false;
		$scope.gameObj.teams.forEach(function(team) {
			team.capitalList = capitalListHash[team.name];
			if(team.capitals>5) {
				victoryMet=true;
				if($scope.gameObj.victoryRound && $scope.gameObj.victoryRound>0) {
					if($scope.gameObj.round>$scope.gameObj.victoryRound || $scope.gameObj.nation==player.nation) {
						gameOverFlg = true;
						gameOver(player, playersOfTeam(team.name), winFlg);
						clearCurrentGameId();
					}
				} else {
					showAlertPopup('Initial victory conditions met!');
					$scope.gameObj.victoryRound=$scope.gameObj.round+1;
					$scope.gameObj.nation=player.nation;
					logItem($scope.currentPlayer, 'Victory Conditions Met', team.capitals+' Capitals Controlled');
				}
			}
		});
		if($scope.gameObj.victoryRound && $scope.gameObj.victoryRound>0 && !victoryMet)
			$scope.gameObj.victoryRound=0;

		return gameOverFlg; 
	}
	function checkWinningTeam() {
		var pList = [];
		$scope.gameObj.teams.forEach(function(team) {
			if(team.capitals>5) {
				pList = playersOfTeam(team.name);
			}
		});
		return pList;
	}
	function playersOfTeam(team) {
		var winningTeam=[];
		$scope.gameObj.players.forEach(function(player) {
			if(player.team==team) {
				player.wonFlg=true;
				winningTeam.push($scope.superpowers[player.nation]);
			}
		});
		return winningTeam;
	}
	function gameOver(player, winningTeam, winFlg) {
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if(practiceMode)
			return;
		console.log('++++game over+++', localStorage.currentGameId);
		var nation=(winningTeam.length==1)?'Winner':'Winning team';
		var msg = 'Victory! '+nation+': '+winningTeam.join(', ');
		logItem(player, 'Game Over!', msg, localStorage.currentGameId);
		$scope.winFlg=winFlg;
		setInnerHTMLFromElement('winningTeam', msg);
		displayFixedPopup('gameOverPopup');
		playSound('tada.mp3', 0, $scope.muteSound);
		$scope.gameObj.inProgress=false;
		$scope.gameObj.gameOver=true;
		$scope.ableToTakeThisTurn=false;
		pauseAction();
		clearCurrentGameId();
		if(isMusicOn())
			$scope.introAudio.play();
		$scope.gameInProgressFlg=false;
		if($scope.gameObj.multiPlayerFlg) {
			uploadCompletedGameStats($scope.gameObj, winningTeam.join('|'));
			// upload stats
		} else {
			if($scope.user.rank<=2) {
				var ipCode = ($scope.user.rank*100)+99;
				registerIP(ipCode);
			}
			var humanPlayer = getHumanPlayer();
			addTestScore($scope.gameObj.created, $scope.gameObj.type, winFlg, $scope.gameObj.round, humanPlayer.nation);
			var newRank=1;
			$scope.gameInProgressFlg=false;
			localStorage.completedGame='Y';
			if(winFlg && $scope.user.rank==1) {
				localStorage.wonGame='Y';
				newRank=2;
			}
			console.log('++++single Player+++', newRank, $scope.gameObj.type);
			if(newRank>$scope.user.rank) {
				promoteThisUsertoRank(newRank);
				uploadNewRank(newRank);
				if(newRank==1)
					computerAnnouncement('Player just finished Basic Training');
				if(newRank==2)
					computerAnnouncement('New player just completed Single Player');
				$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
				}
		}
	}
	function uploadNewRank(rank) {
		if(!$scope.user || !$scope.user.userName || $scope.user.userName.length==0) {
			if(rank<=1)
				showAlertPopup('Nice work! Your next goal is to win a single player game.');
			else
				showAlertPopup('You are now ready for multiplayer games! Log in under the multiplayer button to rank up.');
			return;
		}
		var url = getHostname()+"/web_join_game2.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName,
	        rank: rank,
	        pwd: $scope.user.password,
	        action: 'newRank'
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
	    });
	}
	function uploadCompletedGameStats(gameObj, winningNationStr) {
		winningNationStr = winningNationStr.replace($scope.superpowers[1], '1');
		winningNationStr = winningNationStr.replace($scope.superpowers[2], '2');
		winningNationStr = winningNationStr.replace($scope.superpowers[3], '3');
		winningNationStr = winningNationStr.replace($scope.superpowers[4], '4');
		winningNationStr = winningNationStr.replace($scope.superpowers[5], '5');
		winningNationStr = winningNationStr.replace($scope.superpowers[6], '6');
		winningNationStr = winningNationStr.replace($scope.superpowers[7], '7');
		winningNationStr = winningNationStr.replace($scope.superpowers[8], '8');
		console.log('uploadCompletedGameStats', gameObj.id, winningNationStr);
		var url = getHostname()+"/web_join_game2.php";
	    $.post(url,
	    {
	        user_login: $scope.user.userName,
	        game_id: gameObj.id,
	        pwd: $scope.user.password,
	        action: 'uploadStats',
	        gameData: winningNationStr
	    },
	    function(data, status){
	    	stopSpinner();
	    	console.log(data);
		if(verifyServerResponse(status, data)) {
			showAlertPopup('Game Over! Stats Uploaded.', 1);
		}
	    });
	}
	function capitalOfPlayer(player) {
		for(var x=0; x<$scope.gameObj.territories.length; x++) {
			var terr=$scope.gameObj.territories[x];
			if(terr.capital && terr.nation<99 && terr.owner==player.nation && terr.nation==player.nation)
				return terr;
		}
	}
	function addPeaceFighter(player) {
		var peaceFighters = player.peaceFighters || 0;
		peaceFighters++;
		if(peaceFighters<=$scope.gameObj.players.length-1) {
			var terr1 = capitalOfPlayer(player);
			if(terr1) {
				player.peaceFighters=peaceFighters;
				setTimeout(function() { annimateUnitOntoTerr(terr1, 6, true, true); }, 3000);
				
			}
		}
	}
	function acceptPeaceTreaty(player, player2) {
		var msg='Peace treaty accepted from '+$scope.superpowers[player2.nation];
		popupMessage(player, msg, player2, true);
		changeTreaty(player, player2, 2);
		addPeaceFighter(player);
		addPeaceFighter(player2);
	}
	$scope.removeAlly=function(ally) {
		closePopup('tooManyAlliesPopup');
		var p2=playerOfNation(ally.nation);
		changeTreaty($scope.currentPlayer, p2, 1);
		checkTooManyAllies($scope.currentPlayer);
	}
	function populateAllies(player) {
		$scope.allies=[];
		var x=0;
		player.treaties.forEach(function(treaty) {
			x++;
			if(treaty==3)
				$scope.allies.push({nation: x});
		});
	}
	function checkTooManyAllies(player) {
		populateAllies(player);
		var maxAllies=$scope.gameObj.maxAllies;
		if($scope.gameObj.type=='barbarian' && player.nation!=2 && player.nation!=3 && player.nation!=4)
			 maxAllies=0;
		if($scope.allies.length>maxAllies) {
			if(player.cpu)
				removeExcessAllies(player, $scope.allies);
			else if($scope.ableToTakeThisTurn)
				displayFixedPopup("tooManyAlliesPopup");
		}
	}
	function removeExcessAllies(player, allies) {
		var p2=playerOfNation(allies[0].nation);
		if(p2) {
			changeTreaty(player, p2, 1);
			checkTooManyAllies(player);
		}
	}
	function cleanupTreaties(player) {
		var i=0;
		var needsFixing=false;
		var newTreaties=[];
		player.treaties.forEach(function(treaty) {
			i++;
			if(treaty==3 && player.nation==i) {
				needsFixing=true;
				newTreaties.push('1');
			} else
				newTreaties.push(treaty);
		});
		if(needsFixing)
			player.treaties=newTreaties;
	}
	$scope.minimizeTreatyPopup=function(flag) {
		closePopup('treatyConfirmationPopup');
		if(flag) {
			closePopup('tooManyAlliesPopup');
			$scope.maxAlliesFlg=true;
		}
		$scope.treatyMinimized=true;
	}
	$scope.maximizeTreatyPopup=function() {
		if($scope.maxAlliesFlg)
			displayFixedPopup("tooManyAlliesPopup");
		else
			displayFixedPopup("treatyConfirmationPopup");

		$scope.treatyMinimized=false;
	}
	function checkTreatyOffers(player) {
		cleanupTreaties(player);
		if(player.offers.length==0)
			checkTooManyAllies(player);
		player.offers.forEach(function(offer) {
			var player2=playerOfNation(offer);
//			var val = treatyStatus(player, player2.nation);
			var val = treatyStatusAtStart(player, player2.nation);
			if(val==2 && ($scope.gameObj.type=='freeforall' || $scope.gameObj.type=='ffa-5' || $scope.gameObj.type=='ffa-6' || $scope.gameObj.type=='ffa-7'))
				val=3;
			if(val<=1) {
				if(player.cpu) {
					if(player2.cpu) {
						if($scope.gameObj.round<21)
							acceptPeaceTreaty(player, player2);
						else {
							logDiplomacyNews(player, player2, 4);
							logItem(player, 'Diplomacy', 'Treaty from '+player2.userName+' rejected.');
						}
					} else {
						if($scope.gameObj.round<7 || $scope.gameObj.round-numberVal(player.lastRoundsOfPeace[player2.nation-1])>=3)
							acceptPeaceTreaty(player, player2);
						else	{
							logDiplomacyNews(player, player2, 4);
							logItem(player, 'Diplomacy', 'Treaty from '+player2.userName+' rejected.');
						}
					}
				} else if($scope.ableToTakeThisTurn) {
					playSound('tada.mp3', 0, $scope.muteSound);
					$scope.treatyOffered=true;
					showTreatyConfirmationPopup($scope.superpowers[offer]+' has offered a Peace treaty.', 'treaty', player2.nation);
					disableButton('treatyAcceptButton', false);
				}
			}
			if(val==2) {
				if(player.cpu) {
					var msg='';
					if(player.preferedTeam==player2.preferedTeam && allyCountOfPlayer(player)<$scope.gameObj.maxAllies) {
						msg='Alliance accepted from '+$scope.superpowers[player2.nation];
						changeTreaty(player, player2, 3);
					} else if(allyCountOfPlayer(player)<$scope.gameObj.maxAllies && $scope.gameObj.round>7) {
						msg='Alliance accepted from '+$scope.superpowers[player2.nation];
						changeTreaty(player, player2, 3);
					} else {
						msg='Alliance rejected from '+$scope.superpowers[player2.nation];
						logDiplomacyNews(player, player2, 4);
						logItem(player, 'Diplomacy', msg);
					}
					popupMessage(player, msg, player2, true);
				} else if($scope.ableToTakeThisTurn) {
					playSound('tada.mp3', 0, $scope.muteSound);
					$scope.treatyOffered=true;
					showTreatyConfirmationPopup($scope.superpowers[offer]+' has offered an Alliance.', 'treaty', player2.nation);
					disableButton('treatyAcceptButton', false);
				}
			}
		});
		if(player.cpu)
			player.offers=[];
	}
	function allyCountOfPlayer(player) {
		var allyCount=0;
		player.treaties.forEach(function(treaty) {
			if(treaty==3)
				allyCount++;
		});
		return allyCount;
	}
	$scope.treatAcceptButtonClicked=function(acceptFlg) {
		disableButton('treatyAcceptButton', true);
		playClick($scope.muteSound);
		$scope.treatyOffered=false;
		closePopup('treatyConfirmationPopup');
		var player = $scope.gameObj.players[$scope.gameObj.turnId-1];
		var nation = player.offers.pop();
		var player2=playerOfNation(nation);
		var val = treatyStatus(player, player2.nation);
		val++;
		if(val==1)
			val=2;
		var tType = (val==2)?'Peace Treaty':'Alliance';
		var tResult = (acceptFlg)?'accepted.':'rejected.';
		var msg = tType+' from '+$scope.superpowers[player2.nation]+' '+tResult;
		if(acceptFlg) {
			if(val==2)
				acceptPeaceTreaty(player, player2);
			else
				changeTreaty(player, player2, val);
			checkTooManyAllies($scope.currentPlayer);
		} else {
			logDiplomacyNews(player, player2, 4);
			logItem(player, 'Diplomacy', msg);
		}
		if( player.offers.length>0)
			checkTreatyOffers(player)
	}
	function cleanupAircraft(player) {
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.nation==player.nation && unit.mv>0 && unit.hp>0 && unit.type==2) {
				if(unit.usedInCombat && unit.startTerr) {
					if(unit.usedInCombat && unit.startTerr && unit.startTerr>0 && unit.startTerr<79 && unit.terr != unit.startTerr) {
						unit.terr=unit.startTerr;
						showAlertPopup('aircraft cleanup.');
					}
				}
			}
		});
	}
	function resetPlayerUnits(player) {
		var unitCount=0;
		var generalFlg=false;
		var leaderFlg=false;
		var sbcFlg=false;
		player.mainBaseID=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.nation==player.nation && unit.mv>0 && unit.hp>0) {
				unit.dice=[];
				unit.moving=false;
				unit.usedInCombat=false;
				if(unit.type==3)
					unit.cargoLoadedThisTurn=0;
				unit.movesLeft=2;
				unit.movesTaken=0;
				unit.retreated=false;
				unit.prevTerr=unit.terr;
				if(unit.att>0)
					unitCount++;
				if(unit.piece==10) {
					generalFlg=true;
					unit.startTerr=unit.terr;
				}
				if(unit.type==2)
					unit.startTerr=unit.terr;
				if(unit.piece==11)
					leaderFlg=true;
				if(unit.piece==10 || unit.piece==11)
					player.mainBaseID=unit.terr;
				if(unit.moving)
					unit.moving=false;
				if(unit.piece==12)
					sbcFlg=true;
				if(unit.cargoUnits>0 && (unit.piece==4 || unit.piece==7 || unit.piece==8))
					doubleCheckCargoUnits(unit);
				if(unit.piece==44)
					checkSealUnit(unit, player);
			}
		});
		player.sbcFlg=sbcFlg;
		player.generalFlg=generalFlg;
		player.leaderFlg=leaderFlg;
		player.unitCount=unitCount;
	}
	function checkSealUnit(unit, player) {
		if(!player.generalFlg || !player.leaderFlg) {
			unit.hp=0;
			unit.dead=true;
			unit.movesLeft=0;
			return;
		}
		var terr = $scope.gameObj.territories[unit.terr-1];
		if(unit.owner != terr.owner) {
			if(terr.generalFlg || terr.leaderFlg)
				unit.movesLeft=0;
		}
	}
	function doubleCheckCargoUnits(unit) {
		var cargoUnits=0;
		var cargo=[];
		if(unit.cargo && unit.cargo.length>0) {
			unit.cargo.forEach(function(cUnit) {
				if(isUnitValid(cUnit, unit.terr)) {
					cargoUnits+=cUnit.cargoUnits;
					cargo.push(cUnit);
				}
			});
		}
		unit.cargo=cargo;
		unit.cargoUnits=cargoUnits;
	}
	function isUnitValid(cUnit, terrId) {
		var isValid=false;
		$scope.gameObj.units.forEach(function(unit) {
			if(cUnit.id==unit.id && unit.terr==terrId && !unit.dead)
				isValid=true;
		});
		return isValid;
	}
	function getTeamIndex(player) {
		var adder=parseInt(player.nation);
		var multiplier=parseInt(player.nation);
		var nation=0;
		var numAllies=0;
		var index=0;
		player.treaties.forEach(function(treaty) {
			nation++;
			if(treaty==3) {
				numAllies++;
				adder+=nation;
				multiplier*=nation;
			}
			if(treaty==3 || player.nation==nation) {
				index += Math.pow(2, nation);
			}
		});
		if(!player.alliesMaxed && numAllies==$scope.gameObj.maxAllies)
			player.alliesMaxed=true;
		return index;
	}
	function illuminateTerritories() {
		$scope.gameObj.territories.forEach(function(t) {
			t.illuminateFlg=t.isAlly;
			if(!t.isAlly)
				t.displayUnitCount='?';
		});
		$scope.gameObj.territories.forEach(function(t) {
			if(t.isAlly)
				illuminateThisTerritory(t);
		});
	}
	function illuminateThisTerritory(t) {
		if($scope.gameObj.hardFog!='Y')
			return;
		if(t.unitCount>0) {
			var borders = t.borders.split('+');
			borders.forEach(function(b) {
				var terr=$scope.gameObj.territories[b-1];
				terr.illuminateFlg=true;
				terr.displayUnitCount=getDisplayUnitCount(terr, $scope.gameObj.fogOfWar, $scope.gameObj.hardFog);
			});
		}
	}
	function initializePlayer(player) {
		$scope.allowTurnToEnd=false;
		$scope.showMenuControls=!player.cpu;
		$scope.cpuPlayerFlg=player.cpu;
		$scope.yourPlayer=getYourPlayer($scope.gameObj.players);
		if($scope.gameObj.hardFog=='Y')
			illuminateTerritories();
		$scope.gameObj.transportFlg=false;
		$scope.carrierAddedFlg=false;
		$scope.pingNation=player.nation;
		closePopup('territoryPopup');
		console.log('+++-------------------------player: ', $scope.superpowers[player.nation]);
		cleanupSprites();
		disableButton('peaceButton', false);
		disableButton('allianceButton', false);
		disableButton('redoMovesButton1', true);
		disableButton('redoMovesButton2', true);
		player.diplomacyFlg=false;
		player.diplomacyWarningFlg=false;
		player.generalIsCargo=false;
		
		if(!player.status || player.status=='' || player.status=='Waiting')
			player.status=gStatusPurchase;
		if($scope.gameObj.round>5 && player.preferedTeam>1)
			player.preferedTeam=1;
		
		cleanupLoseSprites();
		cleanupTreaties(player);
		$scope.currentPlayer=player;
		cleanupCargo();
		$scope.techsBoughtThisTurn=0;
		chechTechnologyButtons(player);
		$scope.gameObj.battles=[];
		$scope.cpuPlayerFlg = player.cpu;
		$scope.gameObj.currentNation=player.nation;

		$scope.gameObj.actionButtonMessage=(player.status=='Purchase')?'Purchase Complete':'Complete Turn';
		
		scrollToCapital($scope.gameObj.currentNation);
		highlightCapital($scope.gameObj.currentNation);
		
		if($scope.gameObj.gameOver) {
			showAlertPopup('Game Over!');
			localStorage.removeItem('currentGameId');
			$scope.ableToTakeThisTurn=false;
			$scope.gameObj.fogOfWar='N';
			var pList = checkWinningTeam();
			var winner = (pList.length>0)?pList[0]:'No one';
				
			var finalMessage = 'Game has ended! Winner: '+winner;
			if(pList.length>1)
				finalMessage = 'Game has ended! Winning Team: '+pList.join(', ');
			$scope.gameObj.finalMessage=finalMessage;
			
			showAlertPopup(finalMessage);
			$scope.showMenuControls=true;
			return;
		}
		$scope.displayTurnMessage=false;
		console.log('$scope.gameObj.secondsSinceUpdate', $scope.gameObj.secondsSinceUpdate);
		$scope.currentPlayer.superpower=$scope.superpowers[player.nation];
		if($scope.gameObj.turboFlg && $scope.currentPlayer.status == 'Purchase') {
//			if($scope.currentPlayer.status == 'Purchase')
				$scope.timerRunningFlg=false;
				
			if($scope.gameObj.secondsSinceUpdate>200 && !$scope.ableToTakeThisTurn)
				showConfirmationPopup('Player has run out of time. Skip Player?', 'skipPlayer');
			if($scope.gameObj.round==1) {
				$scope.gameObj.secondsSinceUpdate=0;
				$scope.gameObj.secondsLeft=300;
				if($scope.ableToTakeThisTurn) {
					$scope.displayTurnMessage=true;
					displayFixedPopup('turboStartPopup');
				}
			} else {
				var timerSeconds = 120-numberVal($scope.gameObj.secondsSinceUpdate);
				if(timerSeconds<15)
					timerSeconds=15;
				console.log('secondsSinceUpdate', $scope.gameObj.secondsSinceUpdate, $scope.gameObj.secondsLeft);
				startTurboTimer(timerSeconds, 0);
			}
		}
		
		
		if($scope.gameObj.multiPlayerFlg && $scope.yourPlayer && $scope.yourPlayer.nation>0) {
			$scope.ableToTakeThisTurn=($scope.user.userName==player.userName);
		} else
			$scope.ableToTakeThisTurn=($scope.gameObj.viewingNation==player.nation && !player.cpu);
			
		if(!$scope.gameObj.multiPlayerFlg)
			$scope.ableToTakeThisTurn=!player.cpu;
			
		if($scope.adminMode && $scope.user.userName=='Rick') {
			$scope.ableToTakeThisTurn=true; // admin mode only!!!
			$scope.yourPlayer=$scope.currentPlayer;
		}

		if($scope.gameObj.multiPlayerFlg && !player.cpu) {
			if($scope.user.userName==player.userName && $scope.gameObj.mmFlg)
				player.empCount=0;
			if(userCanSkip(player.nation))
				checkEMPAndTimer(player, $scope.ableToTakeThisTurn);
		}
		if($scope.gameObj.multiPlayerFlg && $scope.gameObj.turboFlg && !$scope.ableToTakeThisTurn)
			startUpBackgroundViewer();
		if($scope.ableToTakeThisTurn && $scope.gameObj.round<6 && $scope.user.rank>0) {
			fadeInDiv('bottomPopup', 'bottomPopup');
			fadeInDiv('bottomRoundPopup', 'bottomPopup');
		} else {
			changeClass('bottomPopup', 'bottomPopup off');
			changeClass('bottomRoundPopup', 'bottomPopup off');
		}
		if(player.nation==$scope.gameObj.players[0].nation) {
			fadeInDiv('roundNumPopup', 'roundNumPopup');
			setTimeout(function() { fadeOutDiv('roundNumPopup', 'roundNumPopup'); }, 3500);
		}
		var practiceMode=($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3);
		if($scope.currentPlayer.status == 'Place Units') {
			showConfirmationPopup('Player is stuck in Place Units phase. Press "OK" to continue the game.', 'forceEndTurn');
		}
		if(player.status==gStatusPurchase && !practiceMode) {
			$scope.techPurchasedThisTurn=false;
			resetPlayerUnits(player); //<------------------------------------------------- clean player units
			setLastRoundsOfPeaceAndWar(player);
			var numFactories=cleanUpTerritories(player, player.cpu); //<------------------ clean territories
			if(player.cpu && player.income<=5 && $scope.gameObj.round>12 && !$scope.gameObj.multiPlayerFlg) {
				numFactories=0;
			}
			player.treatiesAtStart=player.treaties.slice(0);
			checkTreatyOffers(player, player.cpu);
			if(numFactories==0 && $scope.gameObj.round>6) {
				logItem($scope.currentPlayer, 'Eliminated', $scope.superpowers[player.nation]+' eliminated.');
				var voiceId = numberVal(player.nation)+60;
				playVoiceSound(voiceId, $scope.muteSound);
				showAlertPopup($scope.superpowers[player.nation]+' surrendered!', 1)
				player.alive=false;
				player.status=gStatusPlaceUnits;
				removeAlliancesForNation(player.nation);
				setTimeout(function() { endTurn(player); }, 1500); 
				return;
			}
		}
		player.allies=alliesFromTreaties(player);
		if(player && player.territories && player.territories.length>0) {
			if(player.mainBaseID>0)
				player.mainBase = $scope.gameObj.territories[player.mainBaseID-1];
			else
				player.mainBase = player.territories[0];
		}
		player.secondaryTargetId=player.secondaryTargetId || 0;
		if(player.cpu) {
			console.log('player.cpu!');
			disableCompleteButtons();
			disableButton('actionButton', true);
			setTimeout(function() { computerGo(); }, 2000);
		} else {
			if($scope.user.rank==0 && numberVal(localStorage.practiceStep)<3){ 
			} else
				militaryAdvisory(player);
		}
	}
	function cleanupTreaties(player) {
		for(var x=0; x<player.treaties.length; x++) {
			if(player.treaties[x]==4)
				player.treaties[x]=0;
		}
	}
	function alliesFromTreaties(player) {
		var allies=[];
		var nation=0;
		player.treaties.forEach(function(t) {
			nation++;
			if(t==3 && nation!=player.nation)
				allies.push(nation);
		});
		return allies;
	}
	function getPlayerIdForTurn(turnId) {
		var pId=0;
		$scope.gameObj.players.forEach(function(player) {
			if(player.turn==turnId)
				pId=player.userId;
		});
		return pId;
	}
	function checkEMPAndTimer(player, ableToTakeThisTurn) {
		$scope.playerRank=0;
		var url = getHostname()+"/webSuperpowers.php";
	    $.post(url,
	    {
	        action: 'checkEMPAndTimer',
	        user_login: $scope.user.userName,
	        code: $scope.user.code,
	        gameId: $scope.gameObj.id
	    },
	    function(data, status){
//	    	console.log('hey', data);
		if(verifyServerResponse(status, data)) {
			var c = data.split("|");
			var obj = {gameId: c[1], turn: c[2], empCount: c[3], uid: c[4], minutesReduced: c[5], time_elapsed: numberVal(c[6]), rank: numberVal(c[7]), nation: numberVal(c[8]), mygames_last_login: c[9], time_elapsedUser: numberVal(c[10])}
			var playerIdForTurn = getPlayerIdForTurn($scope.gameObj.turnId);
			if(obj.turn != playerIdForTurn && $scope.currentPlayer.status == 'Attack' && !$scope.gameObj.turboFlg)
				showConfirmationPopup('Game appears out of sync. Press OK to complete current players turn.', 'advanceGame');
			$scope.playerRank=obj.rank;
			if(obj.nation==player.nation) {
				player.empCount=obj.empCount;
//				console.log('obj', obj);
				var secondsSinceLastLogin = getDateFromString(obj.mygames_last_login);
				var hours = secondsSinceLastLogin/3600;
				var playerIsAwol=false;
				if(hours>30 && obj.rank<8) {
					console.log('hours offline: ', hours, obj.rank);
					if($scope.gameObj.type=='battlebots' || $scope.gameObj.type=='freeforall' || $scope.gameObj.round<=2) {
						playerIsAwol=true;
					}
					if(hours>40 && $scope.gameObj.round<=4)
						playerIsAwol=true;
					if(hours>60 && $scope.gameObj.round<=6)
						playerIsAwol=true;
				}
				if(hours>60) {
					var num = numberHumanAllies(player);
					if(num==0)
						playerIsAwol=true;
				}
				if(playerIsAwol) {
					showAlertPopup('Player is AWOL! Turning into CPU',1);
					player.cpu=true;
					logItem(player, 'Turn AWOL', 'Player turned into CPU due to being awol over 50 hours.');
					postComputerChat(player.userName+' is AWOL! Turning into CPU');
					setTimeout(function() { computerGo(); }, 2000);
					return;
				}
				if(obj.time_elapsed>43200 && $scope.gameObj.numPlayers>=2)
					checkForAccountSit(player, obj);
				if(ableToTakeThisTurn && obj.time_elapsed>36000) {
					var elapsedHours=parseInt(obj.time_elapsed/3600);
					var newTimer = 24-elapsedHours+6;
					if(newTimer<6)
						newTimer=6;
					
					if(obj.minutesReduced>0)
						showAlertPopup('Slow Turn Response: Your turn timer has dropped below 12 hours. Your timer started with '+obj.minutesReduced+' minutes reduced due to a previous slow turn. Your next turn timer will start with only '+newTimer+' hours. Taking turns faster will bring your timer back up to 24 hours.', 1);
					else
						showAlertPopup('Slow Turn Response: The game has been waiting on your turn for '+elapsedHours+' hours. Your next turn timer will start with only '+newTimer+' hours. Taking turns faster will bring your timer back up to 24 hours.', 1);
				}
			}
		}
	    });
	}
	function numberHumanAllies(player) {
		var num=0;
		var nation=0;
		player.treaties.forEach(function(t) {
			nation++;
			if(t==3 && nation!=player.nation) {
				var p = playerOfNation(nation);
				if(!p.cpu)
					num++;
			}
		});
		return num;
	}
	function cleanUpTerritories(player, cleanFlg) {
		var numFactories=0;
		var biggestForce=0;
		var mainBase=0;
		var territories=[];
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.attackedByNation==player.nation)
				terr.attackedByNation=0;
			if(terr.defeatedByNation==player.nation) {
				terr.defeatedByNation=0;
				terr.defeatedByRound=0;
			}
//			if(terr.defeatedByNation!=terr.owner)
//				terr.defeatedByNation=0;
			if(terr.owner==player.nation) {
				if(terr.attackedByNation>0)
					terr.attackedByNation=0; // needed in case planes attack
				if(terr.nuked && cleanFlg)
					terr.nuked=false;
				if(terr.bombed && cleanFlg)
					terr.bombed=false;
				refreshTerritory(terr);
				numFactories+=terr.factoryCount;
				if(terr.attStrength>biggestForce && terr.id<79) {
					mainBase=terr.id;
					biggestForce=terr.attStrength;
				}
					
				territories.push(terr);
			}
		});
		if(player.mainBaseID==0 && mainBase>0)
			player.mainBaseID=mainBase;
		player.territories=territories;
		return numFactories;
	}
	function militaryAdvisory(player) {
		if(!$scope.ableToTakeThisTurn)
			return;
		var userName = $scope.user.userName || 'rookie';
		if($scope.gameObj.round==1 && player.placedInf<3) {
			if($scope.user.rank==0) {
				highlightCapital(2);
				militaryAdvisorPopup('Time to start building your empire! First let\'s place 3 additional infantry on the board. Click 3 times on Germany to place them.', 21);
				startSequence();
			} else if($scope.user.rank<3)
				militaryAdvisorPopup('Welcome '+userName+'. Time to start building your empire! You will be starting with several military units on your capital. Plus you get to place 3 additional infantry on any land territory you own. Click on any '+$scope.superpowers[$scope.currentPlayer.nation]+' territories to place them.', 21);
			else
				militaryAdvisorPopup('Welcome '+userName+'. Click on any '+$scope.superpowers[$scope.currentPlayer.nation]+' territories to place your 3 infantry.', 21);
		}
		if($scope.user.rank==0 && player.status=='Purchase') {
			if($scope.gameObj.round==2) {
				highlightCapital(2);
				militaryAdvisorPopup('Round 2! It is your turn. Start by purchasing more units. Click on Germany.',32);
			}
			if($scope.gameObj.round==3)
				militaryAdvisorPopup('Round 3! The first 5 rounds you are free from being attacked. Use this time to build your economy and take over territories.',33);
			if($scope.gameObj.round==4)
				militaryAdvisorPopup('Round 4! Remember the object is to capture Russia and Indo-China before Japan does.',34);
			if($scope.gameObj.round==5)
				militaryAdvisorPopup('Round 5! Get your forces up to the front lines. You need a lot of units to conquer the capitals.',35);
			if($scope.gameObj.round==6)
				militaryAdvisorPopup('Round 6! Japan can now start attacking your forces so get ready.',36);
			if($scope.gameObj.round>6)
				basicTrainingReport();
			return;
		}
		else if($scope.user.rank<3) {
			if($scope.gameObj.round==2)
				militaryAdvisorPopup('Round 2! It is your turn. Start by purchasing units, and then move your existing troops to the front lines and make attacks.',32);
			if($scope.gameObj.round==3)
				militaryAdvisorPopup('Round 3! The first 5 rounds you are free from being attacked. Use this time to build your economy and take over territories.',33);
			if($scope.gameObj.round==4)
				militaryAdvisorPopup('Round 4! Remember the object is to control 6 of the original 8 capitals. First team to do this wins the game.',34);
		} else {
			if($scope.gameObj.round==2)
				militaryAdvisorPopup('Round 2. Get that economy built up.',32);
			if($scope.gameObj.round==3)
				militaryAdvisorPopup('Round 3. We need more territory! Two more rounds of peace.',33);
			if($scope.gameObj.round==4)
				militaryAdvisorPopup('Round 4. Double check diplomacy and allies to make sure you know who the enemies are.',34);
		}

		if($scope.user.rank>0) {
			if($scope.gameObj.round==5)
				militaryAdvisorPopup('Round 5! Last round of peace before all-out war breaks out! Secure your borders.',35);
			if($scope.gameObj.round==$scope.gameObj.attack)
				militaryAdvisorPopup('This is the limited attack round. Each player can lose only one land country and take over at most one enemy player land country. Nukes and strategic bombings are not limited.',36);
		}
		if($scope.gameObj.round>$scope.gameObj.attack) {
			if($scope.gameObj.victoryRound && $scope.gameObj.victoryRound>0) {
				militaryAdvisorPopup('Victory conditions met! Game will end in round '+$scope.gameObj.victoryRound+' unless they are stopped!');
				changeClass('alliesButton', 'btn ptp-red');
				playVoiceSound(60, $scope.muteSound);
			} else {
				var obj = getMilitaryReportObj();
				if($scope.gameObj.round%2==1)	
					customMilitaryReport1(obj);
				else
					customMilitaryReport2(obj);
			}
		}
		resetMessageButton();
		disableButton('actionButton', false);
	}
	function basicTrainingReport() {
		var russia = $scope.gameObj.territories[12].owner;
		var indoChina = $scope.gameObj.territories[27].owner;
		if(russia==0 && indoChina==0)
			militaryAdvisorPopup('Round '+$scope.gameObj.round+'. No capitals have fallen. Keep pushing towards Russia.');
		if(russia==0 && indoChina==4)
			militaryAdvisorPopup('Round '+$scope.gameObj.round+'. Japan has already conquered Indo-China. You need to take Russia quickly.');
		if(russia==2)
			militaryAdvisorPopup('Round '+$scope.gameObj.round+'. You own Russia. Now start pushing towards Indo-China.');
	}
	function customMilitaryReport1(obj) {
//		console.log('customMilitaryReport1');
		var voiceOverId=obj.place;
		var line1 = '';
		if(obj.place==1)
			line1='Good work! You are currently in first place.';
		if(obj.place==2)
			line1='Not bad. You are currently in second place.';
		if(obj.place==3)
			line1='You are currently in third place.';
		if(obj.place==4)
			line1='You are currently in fourth place, which isn\'t very good.';
		if(obj.place==5)
			line1='Unfortunately you are currently in 5th place, which isn\'t very good.';
		if(obj.place==6)
			line1='Unfortunately you are currently in 6th place, which is terrible.';
		if(obj.place==7)
			line1='Unfortunately you are currently in 7th place, which is downright terrible.';
		if(obj.place==8 || obj.place==obj.numPlayers)
			line1='Ugh! You are currently in last place. This is not good.';
			
		if(obj.nationLost.length>0)
			line1+= ' Your primary goal this turn should be to reclaim '+obj.nationLost+'.';
		
		if(obj.teamCapitals==0) {
			line1+= ' As of right now you don\'t control any capitals so you are in danger of losing this game.';
		} else {
			var capitals = (obj.teamCapitals==1)?'just 1 capital':obj.teamCapitals+' capitals';
			if($scope.gameObj.allowAlliances)
				line1+= ' As of this turn your team is controlling '+capitals+'. The goal is to control at least 6.';
			else
				line1+= ' As of this turn you are controlling '+capitals+'. The goal is to control at least 6.';
		}
			
		if(line1.length>0)
			militaryAdvisorPopup(line1, voiceOverId);
	}
	function customMilitaryReport2(obj) {
		console.log('customMilitaryReport2');
		
		var voiceOverId=obj.teamCapitals+10;
		if($scope.currentPlayer.status=='Attack') {
			militaryAdvisorPopup('Conduct battles, move troops to the front and then press "Complete Turn" when done.');
			return;
		}
		var line = '';
			
		if(obj.nationLost.length>0)
			line+= ' An enemy scurge currently occupies part of the motherland! Send forces in to reclaim '+obj.nationLost+'.';
		
		if(obj.nukeCount>0 && !obj.balistics) {
			voiceOverId=101;
			line+= ' There are nukes in play and you do not have Anti-Balistics tech. Purchase that upgrade.';
		}
		
		if(obj.facBombed>0) {
			voiceOverId=102;
			line+= ' You have factories bombed out. Purchase air defense (2 per factory) and buy a new factory to restore your income.';
		}
		
		if(line.length>0)
			militaryAdvisorPopup(line, voiceOverId);
		else
			playVoiceSound(voiceOverId, $scope.muteSound);
	}
	function getMilitaryReportObj() {
		var obj = {};
		var numPlayers=0;
		var place=1;
		var yourIncome=$scope.currentPlayer.income;
		var team1Income=0;
		var team2Income=0;
		$scope.gameObj.players.forEach(function(player) {
			if(player.alive)
				numPlayers++;
			if(player.team==1)
				team1Income+=player.income;
			if(player.team==2)
				team2Income+=player.income;
			if(player.nation != $scope.currentPlayer.nation) {
				if(player.income>yourIncome)
					place++;
			}
		});
		var nukeCount=0;
		$scope.gameObj.units.forEach(function(unit) {
			if(unit.piece==14 && unit.owner!=$scope.currentPlayer.nation)
				nukeCount++;
		});
		var facBombed=0;
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.owner==$scope.currentPlayer.nation && terr.facBombed)
				facBombed++;
		});
		obj.numPlayers=numPlayers;
		obj.place=place;
		obj.team1Income=team1Income;
		obj.team2Income=team2Income;
		obj.team=$scope.currentPlayer.team;
		obj.nationLost=checkControlOrigEmpire($scope.currentPlayer.nation);
		obj.teamCapitals=getTeamCapitals($scope.currentPlayer.team);
		obj.balistics=$scope.currentPlayer.tech[18];
		obj.nukeCount=nukeCount;
		obj.facBombed=facBombed;
		return obj;
	}
	function getTeamCapitals(team) {
		var count=0;
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.capital && terr.nation<99 && terr.owner>0) {
				var p = playerOfNation(terr.owner);
				if(p.team==team)
					count++;
			}
		});
		return count;
	}
	function checkControlOrigEmpire(nation) {
		var name='';
		$scope.gameObj.territories.forEach(function(terr) {
			if(terr.owner!=nation && terr.nation==nation) {
				name=terr.name;
			}
		});
		return name;
	}
	function isCountOfNation(nation, count) {
		if(nation==1 && count>5)
			return true;
		if(nation==2 && count>5)
			return true;
		if(nation==3 && count>7)
			return true;
		if(nation==4 && count>6)
			return true;
		if(nation==5 && count>6)
			return true;
		if(nation==6 && count>6)
			return true;
		if(nation==7 && count>7)
			return true;
		if(nation==8 && count>5)
			return true;
		return false;
	}
	function checkForAccountSit(player, obj) {
		if($scope.gameObj.gameOver)
			return;
		if(obj.time_elapsedUser<1000) {
			showAlertPopup('Player timer is running low but appears to be online now.');
			return;
		}
		if(obj.time_elapsed>43200) {
			var val = treatyStatus($scope.yourPlayer, player.nation);
			if(val==3)
				displayFixedPopup('accountSitPopup');
			else if(obj.time_elapsed>86400)
				showConfirmationPopup('Skip Player?', 'skipPlayer');

		}
	}
	$scope.accountSitButtonClicked=function(){
		playClick($scope.muteSound);
		closePopup('accountSitPopup');
		logItem($scope.currentPlayer, 'Account Sit', $scope.user.userName+' account sitting.');
		$scope.ableToTakeThisTurn=true;
	}
	function disableCompleteButtonsFor1Sec(delay) {
		disableCompleteButtons();
		setTimeout(function() { resetMessageButton(); }, delay);	
	}
	function disableCompleteButtons() {
		changeClass('completeTurnButton', 'btn ptp-green roundButton');
//		disableButton('completeTurnButton', true);
	}
	$scope.closeBottomPopup=function() {
		fadeOutDiv('bottomPopup', 'bottomPopup');
		fadeOutDiv('bottomRoundPopup', 'bottomPopup');
	}
	function resetMessageButton() {
		if($scope.currentPlayer.status=='Purchase') {
			if($scope.currentPlayer.money<$scope.currentPlayer.income)
				changeClass('completeTurnButton', 'glowButton');
			else
				changeClass('completeTurnButton', 'btn ptp-green roundButton');
		}
//		if($scope.currentPlayer.status=='Attack')
//			changeClass('completeTurnButton', 'btn ptp-green roundButton');
		disableButton('completeTurnButton', false);
	}
	$scope.fadeRoundNum=function() {
		fadeOutDiv('roundNumPopup', 'roundNumPopup');
	}
	$scope.changeMenu = function() {
		playClick($scope.muteSound);
		$scope.menuNum++;
		if($scope.menuNum>2)
			$scope.menuNum=0;
	}
	$scope.unitsPressed = function() {
		pauseAction();
		window.location = "index.html#!/units";
	}
	$scope.techPressed = function() {
		pauseAction();
		window.location = "index.html#!/tech";
	}
	$scope.alliesPressed = function() {
		pauseAction();
		window.location = "index.html#!/allies";
	}
	$scope.statsPressed = function() {
		pauseAction();
		window.location = "index.html#!/stats";
	}
	$scope.spButtonPressed = function() {
		pauseAction();
		window.location = "index.html#!/nations";
	}
	$scope.pauseButtonPressed = function() {
		playClick($scope.muteSound);
		if(!gamePaused)
			pauseAction();
		else
			resumeAction();
	}
	$scope.adminEndTurn = function() {
		playClick($scope.muteSound);
		closeAllPopups();
		if($scope.currentPlayer.status=='Attack' || $scope.currentPlayer.status=='Place Units') {
			logItem($scope.currentPlayer, 'Force Turn End', 'Admin forced turn end due to being stuck.');
			$scope.currentPlayer.status=gStatusPlaceUnits;
			computerPlacementPhase($scope.currentPlayer);
		} else
			showAlertPopup('Invalid status!',1);
	}
	$scope.adminTurnCPU = function() {
		playClick($scope.muteSound);
		$scope.currentPlayer.cpu=true;
	}
	$scope.adminTurnHuman = function() {
		playClick($scope.muteSound);
		playerOfNation(1).cpu=false;
		playerOfNation(2).cpu=false;
		playerOfNation(3).cpu=false;
		playerOfNation(4).cpu=false;
		playerOfNation(5).cpu=false;
		playerOfNation(6).cpu=false;
		playerOfNation(7).cpu=false;
		playerOfNation(8).cpu=false;
	}
	$scope.adminSave = function() {
		closeAllPopups();
		playClick($scope.muteSound);
		saveGame($scope.gameObj, $scope.user, $scope.currentPlayer, false);
		showAlertPopup('game saved.');
	}
	$scope.quitButtonPressed = function() {
		closeAllPopups();
		playClick($scope.muteSound);
		pauseAction();
//		if($scope.gameObj.multiPlayerFlg)
//			showAlertPopup('Not yet coded!');
//		else
			showConfirmationPopup('Surrender?', 'surrender', 0);
	}
	$scope.acceptOption = function() {
		var option = localStorage.confirmationOption;
		closePopup('confirmationPopup');
		if(option=='surrender') {
			if($scope.gameObj.multiPlayerFlg) {
				showAlertPopup('You have surrendered. The Computer will take over for you from here.', 1);
				$scope.currentPlayer.cpu=true;
				var voiceId = numberVal($scope.currentPlayer.nation)+60;
				playVoiceSound(voiceId, $scope.muteSound);
				logItem($scope.currentPlayer, 'Player Surrendered!', 'Player has quit');
				postComputerChat($scope.currentPlayer.userName+' has surrendered!');
				$scope.cpuPlayerFlg=true;
				$scope.ableToTakeThisTurn=false;
				$scope.openCloseSlider('menu1');
				removeAlliancesForNation($scope.currentPlayer.nation);
				resumeAction();
				setTimeout(function() { computerGo(); }, 100);
			} else {
				if($scope.gameObj && $scope.gameObj.round>1) {
					$scope.gameObj.gameInProgressFlg = false;
					$scope.gameObj.gameOver=true;
					$scope.ableToTakeThisTurn=false;
					var humanPlayer = getHumanPlayer();
					if(humanPlayer && humanPlayer.nation>0)
						addTestScore($scope.gameObj.created, $scope.gameObj.type, false, $scope.gameObj.round, humanPlayer.nation);
				}
				singlePlayerGameLost();
			}
		}
		if(option=='forceEndTurn') {
			if($scope.currentPlayer.status != 'Place Units') {
				showAlertPopup('out of sync! Exit app and try again. Or fill out Bug Report.');
			} else {
				logItem($scope.currentPlayer, 'Force Turn End', 'Forced turn end due to being stuck.');
				showAlertPopup('Game might be out of sync. Fill out Bug Report',1);
//				computerPlacementPhase($scope.currentPlayer);
			}
		}
		if(option=='advanceGame') {
			if($scope.currentPlayer.status != 'Attack') {
				showAlertPopup('out of sync! Exit app and try again. Or fill out Bug Report.');
			} else {
				logItem($scope.currentPlayer, 'Force Turn End', 'Forced turn end due to being stuck.');
				compMove($scope.currentPlayer);
			}
		}
		if(option=='skipPlayer') {
			console.log('skipping player!!');
			if($scope.currentPlayer.status == 'Purchase' || $scope.currentPlayer.status == 'Place Units')
				$scope.aiTakeTurn(true);
			else
				showAlertPopup('Not in Purchase!');
		}
		if(option=='confirmPurchase') {
			console.log('confirmPurchase!!');
			$scope.completeTurnButtonPressed(true);
		}
		if(option=='confirmAiTakeTurn') {
			
			skipTurn();
		}
		
	}
	function skipTurn() {
		console.log('confirmAiTakeTurn!!');
		logItem($scope.currentPlayer, 'Turn Skipped', 'Skipped by '+$scope.user.userName);
		$scope.cpuPlayerFlg=true;
		$scope.ableToTakeThisTurn=false;
		$scope.allowTurnToEnd=true;
		setTimeout(function() { computerGo(); }, 10);
	}
	function singlePlayerGameLost() {
		clearCurrentGameId();
		$scope.gameInProgressFlg=false;
		$scope.gameObj.gameOver=true;
		playSound('CrowdBoo.mp3', 4, $scope.muteSound);
		$scope.winFlg=false;
		displayFixedPopup('gameOverPopup');
	}
	function getHumanPlayer() {
		if(!$scope.gameObj.players)
			return;
		for(var x=0; x<$scope.gameObj.players.length; x++) {
			var player = $scope.gameObj.players[x];
			if(!player.cpu)
				return player;
		}
	}
	$scope.cancelButtonClicked = function() {
		resumeAction();
		closePopup('confirmationPopup');
	}
	$scope.okButtonClicked = function() {
		playClick($scope.muteSound);
		closePopup('alertPopup');
		closePopup('alertPopup2');
		closePopup('advancedPopup');
		closePopup('battlePlanPopup');
		if($scope.user.rank==0 && $scope.startupSequence<6) {
			basicTrainingIntro($scope.startupSequence);
			return;
		}
			
		if(!$scope.gameObj.gameInProgressFlg)
			startSequence();
		else
			resumeAction();
	}
	$scope.toggleLabels=function() {
		$scope.showLabels=!$scope.showLabels;
//		$scope.gameObj.territories.forEach(function(terr) {
//			$scope.changeSVGColor(!$scope.showLabels, terr.id, terr.owner);
//		});
	}
	$scope.victoryButtonPressed=function() {
		if($scope.gameObj.multiPlayerFlg)
			closePopup('gameOverPopup');
		else
			window.location = "index.html#!/";
	}
	$scope.homeButtonPressed=function() {
		if(localStorage.iosApp=='Y')
			return;
		pauseAction();
//		var historyObj = window.history;
//		if(historyObj.length>1)
//			window.history.back();
//		else
//			window.location = "index.html#!/multiplayer";
//			$scope.goBack();

		if($scope.gameObj.multiPlayerFlg)
			window.location = "index.html#!/multiplayer";
		else
			window.location = "index.html#!/";
		window.scrollTo(0, 0);
	}
	$scope.ngStyleNameLabel=function(terr) {
		var offset = 0;
		if(terr.capital && terr.id<79)
			offset-=13;
		if(terr.name.length>8 && (terr.name.includes(' ') || terr.name.includes('-')))
			offset-=13;
		if(terr.id==111 || terr.id==112)
			offset=57;
		return {'top': (terr.y+60+offset).toString()+'px', 'left': (terr.x-22).toString()+'px'}
//		return {'margin-top': offset+'px'};
	}
	function highlightCapital(nation) {
		console.log('highlightCapital!');
		var ids = [1,1,7,13,21,28,35,42,50];
		highlightTerritory(ids[nation], nation, true);
		var obj = capitalXY(nation);
		var e = document.getElementById('arrow');
		e.style.display='block';
		e.style.position='absolute';
		e.style.left=(obj.x-40).toString()+'px';
		e.style.top=(obj.y+140).toString()+'px';
	}
	function highlightTerritory(id, nation, flg) {
		var f = document.getElementById('svg'+id);
		if(f) {
			var colors=['#ffffc0','blue','gray','#cc8800','red','green','yellow','magenta','orange'];
			var color=colors[numberVal(nation)];
			if(flg) {
				f.style.fill = color;
				f.style.stroke = 'black';
			} else {
				f.style.stroke = 'none';
				f.style.fill = 'transparent';
			}
		}
	}
	$scope.ngClassButtonPrimary=function(flg) {
		if(flg)
			return "btn btn-primary roundButton";
		else
			return "btn btn-default roundButton";
	}
	$scope.changeLogNation=function(player) {
		playClick($scope.muteSound);
		$scope.logNation=player.nation;
	}
	$scope.ngShowLog=function(log) {
		if($scope.yourPlayer && log.type=='Note' && log.nation!=$scope.yourPlayer.nation)
			return false;
		if($scope.logType==2) {
			if(log.nation==$scope.logNation)
				return true;
			else
				return false;
		}
		if($scope.logType==3) {
			if(log.type=='Note') {
				return true;
			} else
				return false;
		}
		if(log.round==$scope.logRound)
			return true;
		else
			return false;
	}
	$scope.changeLogType=function(num) {
		playClick($scope.muteSound);
		$scope.logType=num;
		if($scope.gameObj.players && $scope.gameObj.players.length>0)
			$scope.logNation=$scope.gameObj.players[0].nation;
		updateButtonFiltersForId('logType', num-1);
		console.log('logNation', $scope.logNation);
	}
	$scope.changeSVGColor=function(flg, id, nation) {
		if(window.innerWidth<500)
			return;
		var n = document.getElementById('name'+id);
		if(n) {
			if(flg && !$scope.showLabels)
				n.style.display = 'block';
			else
				n.style.display = 'none';
		}
		var f = document.getElementById('svg'+id);
		if(f) {
			var colors=['#ffffc0','blue','gray','#cc8800','red','green','yellow','magenta','cyan'];
			var color=colors[numberVal(nation)];
			if(flg) {
				f.style.fill = color;
				f.style.stroke = 'black';
			} else {
				f.style.stroke = 'none';
				f.style.fill = 'transparent';
			}
		}
	}
}); //boardCtrl
app.controller("nationsCtrl", function ($scope) {
	displayFixedPopup('mainPopup');
	playClick($scope.muteSound);
	$(function() {
    $("#map").click(function(e) {

      var offset = $(this).offset();
      var relativeX = (e.pageX - offset.left);
      var relativeY = (e.pageY - offset.top);
	
	var mapWidth = window.innerWidth;
	if(mapWidth>900)
		mapWidth=900;
	console.log('mapWidth', mapWidth);
	var mapHeight = mapWidth*462/791;
	
	var x=relativeX*100/mapWidth;
	var y=relativeY*100/mapHeight;
	
	if(x<35 && y <=50)
		showFlag(1);
	else if(x<35 && y >50)
		showFlag(8);
	else if(x>=80 && y <=46)
		showFlag(4);
	else if(x>35 && x<59 && y>55)
		showFlag(7);
	else if(x>35 && x<59 && y<44)
		showFlag(2);
	else if(x>53 && x<82 && y<41)
		showFlag(3);
	else if(x>=69 && x<82 && y>39)
		showFlag(5);
	else if(x>=52 && x<68 && y>41 && y<62)
		showFlag(6);

		});
	});
	$scope.clear = function() {
		clearLabels();
	}
	$scope.clickFlag=function(num) {
		showFlag(num);
	}
	function showFlag(num) {
		var mapWidth = window.innerWidth;
		if(mapWidth>900)
			mapWidth=900;
		var mapHeight = mapWidth*462/791;
		
		if(num==1)
			showLabel('usa', mapHeight*.55, mapWidth*.1, 'graphics/board_usa.jpg');
		else if(num==8)
			showLabel('lat', mapHeight*.80, mapWidth*.05, 'graphics/board_lat.jpg');
		else if(num==4)
			showLabel('jap', mapHeight*.50, mapWidth*.7, 'graphics/board_jap.jpg');
		else if(num==7)
			showLabel('afr', mapHeight*.80, mapWidth*.3, 'graphics/board_afr.jpg');
		else if(num==2)
			showLabel('eu', mapHeight*.50, mapWidth*.3, 'graphics/board_eu.jpg');
		else if(num==3)
			showLabel('rr', mapHeight*.40, mapWidth*.5, 'graphics/board_rr.jpg');
		else if(num==5)
			showLabel('chi', mapHeight*.70, mapWidth*.6, 'graphics/board_chi.jpg');
		else if(num==6)
			showLabel('arab', mapHeight*.60, mapWidth*.3, 'graphics/board_arab.jpg');
	}
	function showLabel(id, x, y, board) {
		clearLabels();
		document.getElementById('map').src=board;
		document.getElementById(id).style.top = x+'px';
		document.getElementById(id).style.left = y+'px';
		document.getElementById(id).style.display = 'block';
	}
	function clearLabels() {
		playClick($scope.muteSound);
		document.getElementById('map').src='graphics/map.png';
		document.getElementById('usa').style.display = 'none';
		document.getElementById('lat').style.display = 'none';
		document.getElementById('jap').style.display = 'none';
		document.getElementById('afr').style.display = 'none';
		document.getElementById('eu').style.display = 'none';
		document.getElementById('rr').style.display = 'none';
		document.getElementById('chi').style.display = 'none';
		document.getElementById('arab').style.display = 'none';
	}
}); //nationsCtrl
app.controller("chooseNationCtrl", function ($scope) {
	$scope.gameOption=0;
	$scope.gameInProgressFlg = (localStorage.currentGameId && localStorage.currentGameId>0);
	$scope.user = userObjFromUser(localStorage.username, localStorage.rank, localStorage.password);
	$scope.userName=$scope.user.userName || 'New Player';
	$scope.ranks=getAllRanks();
	playClick($scope.muteSound);
	localStorage.hardFog=($scope.hardFog)?"Y":"N";
	localStorage.fogOfWar=($scope.fog)?"Y":"N";
	setLoadGameId(0); // no multiplayer
	localStorage.gameType=0;
	$scope.gameTypeNum=0;
	localStorage.iosApp='N';
	localStorage.fogOfWar='N';
	$scope.selectedNum=0;
	$scope.difficultyNum=1;
	localStorage.difficultyNum=0;
	localStorage.customGame='N';
	displayFixedPopup('mainPopup');
	if(!$scope.user.rank || $scope.user.rank==0) {
		$scope.selectedNum=2;
		localStorage.startingNation = $scope.selectedNum;
	}
	var history = ['',
'Modern day United States territories including Alaska and Hawaii.',
'Modern day European Union.',
'Modern day Russia, although some far east land has been lost to an agressive Imperial Japan.',
'Japan has expanded their empire to take over lands reminiscent of World War II Japan at it\'s height.',
'China has formed an grand Communist alliance with several far eastern countries and islands.',
'A number of Arab and Muslim based nations have formed a strong alliance around Saudi Arabia.',
'Many of the nations of africa have formed a strong alliance around Congo.',
'Most of Latin America has formed a strong alliance with Brazil as their capital.'];
//	if(!$scope.user || !$scope.user.userName) {
//		window.location = "index.html#!/login";
//		return;
//	}
	$scope.gameTypes=getGameTypesObj(true);
	$scope.gameType=$scope.gameTypes[0];
	localStorage.customGameType='diplomacy';
	var numTeams=0;
	var youName = $scope.user.userName || 'You';
	$scope.players = [
		{id: 1, nation: 1, team: 0, name: youName, teamName: 'No Team', cpu: false, active: true, locked: false},
		{id: 2, nation: 2, team: 0, name: 'CPU 1', teamName: 'No Team', cpu: true, active: true, locked: false},
		{id: 3, nation: 3, team: 0, name: 'CPU 2', teamName: 'No Team', cpu: true, active: true, locked: false},
		{id: 4, nation: 4, team: 0, name: 'CPU 3', teamName: 'No Team', cpu: true, active: true, locked: false},
		{id: 5, nation: 5, team: 0, name: 'CPU 4', teamName: 'No Team', cpu: true, active: false, locked: false},
		{id: 6, nation: 6, team: 0, name: 'CPU 5', teamName: 'No Team', cpu: true, active: false, locked: false},
		{id: 7, nation: 7, team: 0, name: 'CPU 6', teamName: 'No Team', cpu: true, active: false, locked: false},
		{id: 8, nation: 8, team: 0, name: 'CPU 7', teamName: 'No Team', cpu: true, active: false, locked: false},
	]
	$scope.numPlayers=4;
	$scope.numHumans=1;
	$scope.numCPUs=3;
	var gameTypeNum=0;
	checkButtons();
	$scope.changeTeam=function(player) {
		console.log(numTeams, player);
		if(numTeams==0) {
			player.teamName='No Team';
			return;
		}
		var team=player.team;
		team++;
		if(team>numTeams)
			team=0;
		player.team=team;
		if(player.team==0)
			player.teamName='No Team';
		if(player.team==1)
			player.teamName='Team 1';
		if(player.team==2)
			player.teamName='Team 2';
	}
	$scope.ngClassGameType=function(gameType) {
		return ngClassGameTypeMain(gameType);
	}
	$scope.addPlayer=function(num, cpuFlg) {
		if(num>0 && $scope.numPlayers>=8) {
			showAlertPopup('Too many Players',1);
			return;
		}
		if(num<0 && !cpuFlg && $scope.numHumans<=1) {
			showAlertPopup('Need a human',1);
			return;
		}
		var lastPlayer;
		$scope.players.forEach(function(player) {
			if(num>0 && !player.active) {
				num=0;
				player.active=true;
				player.cpu=cpuFlg;
				$scope.numPlayers++;
				if(cpuFlg)
					$scope.numCPUs++;
				else
					$scope.numHumans++;
				player.name = (cpuFlg)?'CPU '+$scope.numCPUs:'Human '+$scope.numHumans;
			}
			if(num<0 && player.active && player.cpu==cpuFlg) {
				lastPlayer=player;
			}
		});

		if(num<0) {
			lastPlayer.active=false;
			$scope.numPlayers--;
			if(cpuFlg)
				$scope.numCPUs--;
			else
				$scope.numHumans--;
		}

		checkButtons();
	}
	function pOfNation(nation) {
		var player;
		$scope.players.forEach(function(p) {
			if(p.nation==nation)
				player=p;
		});
		return player;
	}
	function findNationNotLocked(nation) {
		for(var x=0; x<8; x++) {
			nation++;
			if(nation>8)
				nation=1;
			var player = pOfNation(nation);
			if(!player.locked)
				return nation;
		}
		return nation;
	}
	$scope.changeNation=function(player) {
		var oldNation=player.nation;
		var nation=findNationNotLocked(oldNation);
		if(nation>8)
			nation=1;
		$scope.players.forEach(function(p) {
			if(p.nation==nation)
				p.nation=oldNation;
		});
		player.nation=nation;
		player.locked=true;
	}
	function checkButtons() {
		disableButton('minusHuman', $scope.numHumans<=1 || $scope.numPlayers<=2);
		disableButton('addHuman', $scope.numPlayers>7);
		disableButton('minusBot', $scope.numPlayers<=2 || $scope.numHumans==$scope.numPlayers);
		disableButton('addBot', $scope.numPlayers>7);
	}
	$scope.randomizeNations=function() {
		var nationHash={};
		$scope.players.forEach(function(p) {
			p.nation=getRandomNationNotPicked(nationHash);
			p.locked=false;
		});
	}
	function getRandomNationNotPicked(nationHash) {
		var num = Math.floor((Math.random() * 8) + 1);
		for(var x=0; x<8; x++) {
			if(!nationHash[num]) {
				nationHash[num]=1;
				return num;
			}
			num++;
			if(num>8)
				num=1;
		}
	}
	$scope.loadType=function(type) {
		numTeams=0;
		if(type.type=='locked')
			numTeams=2;
		$scope.gameType=type;
		localStorage.customGameType=type.type
		$scope.players.forEach(function(p) {
			p.team=0;
			p.teamName='No Team';
		});
	}
	if($scope.gameInProgressFlg && localStorage.startingNation && localStorage.startingNation>0)
		window.location = "index.html#!/board";
	$scope.changeDifficulty=function(num) {
		$scope.difficultyNum=num;
		localStorage.difficultyNum=(num-1);
		updateButtonFiltersForId('dificulty', num);
	}
	$scope.selectNext=function(num) {
		$scope.gameOption=num;
	}
	$scope.selectAdvancedOptions=function() {
		if($scope.user.rank<=1) {
			showAlertPopup('You must beat the computer before playing with advanced options.',1);
			return;
		}
		$scope.changeFilter(2);
	}
	$scope.selectFogOfWar=function(flag) {
		if(flag) {
			$scope.hardFog=!$scope.hardFog;
			if($scope.hardFog)
				$scope.fog=true;
		} else {
			$scope.fog=!$scope.fog;
			if(!$scope.fog)
				$scope.hardFog=false;
		}
		localStorage.hardFog=($scope.hardFog)?"Y":"N";
		localStorage.fogOfWar=($scope.fog)?"Y":"N";
	}
	$scope.changeFilter=function(num) {
		console.log('changeFilter');
		$scope.gameTypeNum=num;
		updateButtonFilters(num);
		localStorage.gameType=num;
	}
	$scope.selectCountry = function(num) {
		$scope.selectedNum=num;
		playClick($scope.muteSound);
		$scope.spName=$scope.superpowers[num];
		$scope.spHistory=history[num];
		$scope.spGeneral=$scope.gUnits[10].generalBonuses[num-1];
		localStorage.startingNation = num;
		displayFixedPopup('chooseNationPopup');
	}
	$scope.selectRandom = function(num) {
		$scope.selectedNum=num;
		playClick($scope.muteSound);
		$scope.spName='random';
		if(num>0)
			$scope.spName=$scope.superpowers[num];
		showConfirmationPopup('Choose '+$scope.spName+'?', 'chooseNation', 0)
		if(num==0)
			num=Math.floor((Math.random() * 8) + 1);
		localStorage.startingNation = num;
	}
	$scope.startAdvancedGame=function() {
		playClick($scope.muteSound);
		var gamePlayers=[];
		$scope.players.forEach(function(p) {
			if(p.active)
				gamePlayers.push(p);
		});
		
		localStorage.customGamePlayers=JSON.stringify(gamePlayers);
		localStorage.customNumPlayers = gamePlayers.length;
		localStorage.customGame='Y';
		localStorage.startingNation = gamePlayers[0].nation;
		if(0) {
			console.log('startingNation', localStorage.startingNation);
			console.log(localStorage.customGamePlayers);
			console.log(localStorage.customGame);
			console.log(localStorage.customGameType);
			console.log(localStorage.fogOfWar);
			console.log(localStorage.difficultyNum);
			console.log(localStorage.customNumPlayers);
			var pObj = JSON.parse(localStorage.customGamePlayers);
			console.log(pObj);
		}
		window.location = "index.html#!/board";
	}
	$scope.resumeGame = function() {
		if($scope.user.rank==0)
			registerIP(-1);

		window.location = "index.html#!/board";
	}
}); //chooseNationCtrl
app.controller("mainCtrl", function ($scope) {
	$scope.sVersion=getScriptV();
	$scope.gameMusic.pause();
	localStorage.homePage='';
	if(0) {
		localStorage.rank=0; // new player!!
		localStorage.practiceClick=0; // new player!!
		localStorage.practiceStep=0; // new player!!
		localStorage.username=''; // new player!!
	}
	$scope.practiceStep = numberVal(localStorage.practiceStep);
	$scope.user = userObjFromUser();
	if($scope.user.userId>0 && (!$scope.user.userName || $scope.user.userName.length==0))
		showAlertPopup('Something out of sync! Try logging out and back in.');
	$scope.userRank=0;
	$scope.initMultMessage=false;
	if($scope.user.rank==2 && !localStorage.initMultMessage) {
		$scope.initMultMessage=true;
		localStorage.initMultMessage='Y';
	}
	if($scope.user && $scope.user.rank && $scope.user.rank>0)
		$scope.userRank=$scope.user.rank;
//	console.log($scope.user, localStorage.username); //, atob($scope.user.code)
	$scope.gameInProgressFlg = (localStorage.currentGameId && localStorage.currentGameId>0);
	$scope.currentGameId = localStorage.currentGameId;
	if($scope.gameInProgressFlg)
		console.log('gameInProgressFlg', localStorage.currentGameId);
	$scope.videoWatched=(localStorage.videoWatched=='Y');
	$scope.installOption=0;
	var logoWidth=100;
	var direction=-.1;
	var requestId;
	displayFixedPopup('mainFrame');
	if($scope.user.rank<=2) {
		var practiceStep=numberVal(localStorage.practiceStep);
		if(practiceStep==3)
			playVoiceSound(212);
		displayFixedPopup('initPopup' ,true);
	}
	$scope.pageLoaded=true;
	var zoomCount=0;
	zoomLogo();
	/*FB.getLoginStatus(function(response) {
    		statusChangeCallback(response);
	});
	function statusChangeCallback(response) {
		console.log('fb', response);
	}*/
//	$('#multiplayButton3').draggable();
	setTimeout(function() { fadeSplashScreen(); }, 2000);
/*	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
		setTimeout(function() { fadeSplashScreen(); }, 2000);
	} else {
		setTimeout(function() { fadeSplashScreen(); }, 2000);
	}*/
	$scope.enterButtonPressed=function() {
		setTimeout(function() { fadeSplashScreen(); $scope.enteringGame=true; }, 10);
		$scope.showiPhoneButton=false;
		
	}
	function fadeSplashScreen() {
		if($scope.enteringGame)
			return;
		if(isMusicOn()) {
			if($scope.user.rank>0)
				$scope.introAudio.play();
			playSound('zap.mp3', 0, $scope.muteSound);
		}
		fadeImage("splash");
		fadeImage("splash2");
		fadeImage("splash3");
		var audio = new Audio('sounds/close.mp3');
		if(audio)
			audio.play();
		setTimeout(function() { turnOffImages(); }, 1000);
		$scope.showMainView=true;
		$scope.$apply();
	}
	function fadeImage(id) {
		var e = document.getElementById(id);
		if(e)
			e.className='fadeOut';
	}
	function turnOffImages() {
		if(document.getElementById("splash")) {
			document.getElementById("splash").style.display='none';
			document.getElementById("splash2").style.display='none';
			document.getElementById("splash3").style.display='none';
		}
	}
	$scope.alreadyInstalled=function() {
		closePopup('installPopup');
		localStorage.alreadyInstalled=true;
		$scope.showInstallButton=false;
	}
	$scope.screenWidth=screen.width;
	$scope.standalone=window.navigator.standalone;
	$scope.browser='?';
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	if(isFirefox)
		$scope.browser='Firefox';
	if(isSafari)
		$scope.browser='Safari';
	if(isIE)
		$scope.browser='IE';
	if(isChrome)
		$scope.browser='Chrome';

	$scope.showInstallButton=true;
//	if (('standalone' in navigator && !navigator.standalone && (/iphone|ipod|ipad/gi).test(navigator.platform) && (/Safari/i).test(navigator.appVersion)) {
//		$scope.showInstallButton=false;
//      	}
	if(window.navigator.standalone || $scope.screenWidth>800 || localStorage.alreadyInstalled)
		$scope.showInstallButton=false;
 //       console.log(window.navigator.standalone); // true is launched from home screen
	
	if($scope.user && $scope.user.userName && $scope.user.userName.length>0)
		checkForum();
	else
		registerIP(-5);
	function checkForum() {
		console.log('webCheckForum');
		var url = getHostname()+"/webCheckForum.php";
		    $.post(url,
		    {
		        user_login: $scope.user.userName || 'test',
		        code: $scope.user.code,
		        ip: $scope.user.ip
		    },
		    function(data, status){
		    	console.log(data);
			var items = data.split("|");
			$scope.forumCount=items[0];
			$scope.mailCount=items[1];
			$scope.urgentCount=items[2];
			localStorage.lastForumLogin =items[3];
			$scope.yourTurnCount=items[4];
			var userId = items[5];
			var myEMPCount=items[6];
			var maxGamesCount=items[7];
			$scope.newGameCount=items[8];
			$scope.endGameCount=items[9];
			var gold_member_flg = items[10];
			var uploadIPInfo = items[11];
			$scope.owner_flg = (items[12]=='Y');
			
			$scope.owner_flg = (gold_member_flg=='Y');
			
			if(userId != localStorage.userId)
				localStorage.userId=userId;
			if(uploadIPInfo=='Y')
				getIPInfo(localStorage.username, localStorage.password);
			
			if(gold_member_flg=='Y' && localStorage.gold_member_flg != 'Y') {
				playSound('tada.mp3', 0, $scope.muteSound);
				localStorage.gold_member_flg = 'Y';
				$scope.gold_member_flg = 'Y';
				displayFixedPopup('upgradePopup');
			}
			
			if($scope.yourTurnCount>0 || $scope.newGameCount>0 || $scope.endGameCount>0) {
				displayFixedPopup('initPopup', true);
				$scope.$apply();
			}
			if($scope.forumCount>0 || $scope.mailCount>0)
				$scope.$apply();
		    	if($scope.urgentCount>0)
		    		showAlertPopup('Urgent Message Waiting!');
		    		
		    	var existingEMPCount = numberVal(localStorage.existingEMPCount);
		    	$scope.myEMPCount=myEMPCount;
		    	if(myEMPCount>existingEMPCount) {
		    		localStorage.existingEMPCount=myEMPCount;
		    		displayFixedPopup('empAddedPopup');
		    	}
		    	if(myEMPCount!=existingEMPCount)
		    		localStorage.existingEMPCount=myEMPCount;
		    	var existingMaxGames = numberVal(localStorage.existingMaxGames);
		    	if(maxGamesCount!=existingMaxGames)
		    		localStorage.existingMaxGames=maxGamesCount;
		    });
	}
	function zoomLogo() {
		var e = document.getElementById('spLogo');
		if(e) {
			logoWidth+=direction;
			if(logoWidth<=75 || logoWidth>=100)
				direction*=-1;
			e.style.width = logoWidth.toString()+'%';
		}
		if($scope.pageLoaded && zoomCount++<1000)
			requestId = window.requestAnimationFrame(zoomLogo);
	}
	$scope.gotoInfoPage=function() {
		$scope.pageLoaded=false;
		window.location = "index.html#!/info";
	}
	$scope.continueToSinglePlayer=function() {
		gotoSingleplayer();
	}
	$scope.displayInstallInstructions=function() {
		closePopup('welcomePopup');
		displayFixedPopup('installPopup');
		registerIP(-3);
	}
	$scope.displayRulebook=function() {
		playClick($scope.muteSound);
		displayFixedPopup('rulebookPopup', true);
	}
	$scope.basicTrainingGame = function() {
		closePopup('multiplayerPopup');
		$scope.singlePlayerGame();
	}
	$scope.singlePlayerGame = function() {
		playClick($scope.muteSound);
		if($scope.userRank==0)
			changeClass('multiplayButton1', 'mainbutton bClicked');
		else
			changeClass('multiplayButton2', 'mainbutton bClicked');
		setTimeout(function() { singlePlayerGameBG(); }, 100);
	}
	function singlePlayerGameBG() {
		var practiceStep=numberVal(localStorage.practiceStep);
		$scope.practiceStep = practiceStep;
		if($scope.userRank==0 && practiceStep<3) {
			localStorage.currentGameId="0";
			$scope.currentGameId = 0;
			registerIP(-3);
			if(practiceStep==0)
				playVoiceSound(201, $scope.muteSound);
			changeClass('movementButton', (practiceStep==0)?'glowButton roundButton medium':'btn btn-primary roundButton medium');
			changeClass('fightingButton', (practiceStep==1)?'glowButton roundButton medium':'btn btn-primary roundButton medium');
			changeClass('purchaseButton', (practiceStep==2)?'glowButton roundButton medium':'btn btn-primary roundButton medium');
			changeClass('playNowButton', (practiceStep==3)?'glowButton roundButton medium':'btn btn-primary roundButton medium');
			
			disableButton('movementButton', practiceStep>0);
			disableButton('fightingButton', practiceStep!=1);
			disableButton('purchaseButton', practiceStep!=2);
			disableButton('playNowButton', practiceStep<3);
			displayFixedPopup('welcomePopup');
			$scope.$apply();
		} else
			gotoSingleplayer();
	}
	$scope.practiceMovement=function() {
		gotoPracticeScreen(-3)
	}
	$scope.practiceFighting=function() {
		gotoPracticeScreen(-2)
	}
	$scope.practicePurchase=function() {
		gotoPracticeScreen(-1)
	}
	function gotoPracticeScreen(num) {
		registerIP(num);
		localStorage.startingNation = '2';
		setLoadGameId(0); // no multiplayer
		window.cancelAnimationFrame(requestId);
		$scope.pageLoaded=false;
		window.location = "index.html#!/board";
	}
	$scope.installButtonPressed=function(num) {
		$scope.installOption=num;
	}
	$scope.openInstallPopup = function() {
		displayFixedPopup('installPopup');
	}
	$scope.moreButtonToggled=function() {
		$scope.showMore=!$scope.showMore;
		console.log($scope.showMore);
	}
	$scope.multiplayGameClicked = function() {
		if(numberVal($scope.user.rank)<1)
			displayFixedPopup('multiplayerPopup');//window.location = "index.html#!/login";
		else {
			$scope.pageLoaded=false;
			changeClass('multiplayButton3', 'mainbutton bClicked');
			$scope.introAudio.pause();
			disableButton('multiplayButton1', true);
			disableButton('multiplayButton2', true);
			setTimeout(function() { gotoMultiplayer(); }, 10);
		}
	}
	function gotoMultiplayer() {
		$scope.pageLoaded=false;
		window.location = "index.html#!/multiplayer";
	}
	function gotoSingleplayer() {
		$scope.pageLoaded=false;
		$scope.introAudio.pause();
		setLoadGameId(0); // no multiplayer
		disableButton('singlePlayButton1', true);
		disableButton('singlePlayButton2', true);
		if($scope.gameInProgressFlg)
			window.location = "index.html#!/board";
		else {
			if($scope.user.rank==0)
				registerIP(0);
			window.cancelAnimationFrame(requestId);
			window.location = "index.html#!/chooseNation";
		}
	}
}); //mainCtrl

})(window.angular);
