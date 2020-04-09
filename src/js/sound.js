var clickSound = new Audio('http://www.superpowersgame.com/app/sounds/click.mp3');
var cannonSound = new Audio('http://www.superpowersgame.com/app//sounds/Cannon.mp3');
var cheerSound = new Audio('http://www.superpowersgame.com/app//sounds/Cheer.mp3');
var crowdBooSound = new Audio('http://www.superpowersgame.com/app//sounds/CrowdBoo.mp3');
var voiceOverAudio = new Audio('assets/voice/bt01welcome.mp3');
//clickSound.play();
function playClick(muteSound) {
	playSound('', 1, muteSound)
}
function playCannon(muteSound) {
	playSound('', 2, muteSound)
}
function playSound(fileName, num, muteSound) {
	if (muteSound || !isSoundOn()) {
		console.log('no sound ', fileName)
		return;
	}
	if (localStorage.muteSound && localStorage.muteSound == 'Y') {
		console.log('muted ', fileName)
		return;
	}
	if (num && num > 0)
		fileName = '';
	if (fileName && fileName.length > 0) {
		var audio = new Audio('http://www.superpowersgame.com/app/sounds/' + fileName);
		audio.play();
	}
	if (num == 1 && clickSound)
		clickSound.play();
	if (num == 2 && cannonSound)
		cannonSound.play();
	if (num == 3 && cheerSound)
		cheerSound.play();
	if (num == 4 && crowdBooSound)
		crowdBooSound.play();

}
function isMusicOn() {
	return (!localStorage.musicBox || localStorage.musicBox.length == 0);
}
function isSoundOn() {
	return (!localStorage.soundBox || localStorage.soundBox.length == 0);
}
function isVoiceOn() {
	return (!localStorage.voiceBox || localStorage.voiceBox.length == 0);
}
function playSoundForPiece(piece, superpowersData) {
	var unit = superpowersData.units[piece];
	if (unit.type == 2)
		playSound('fighter.mp3');
	if (unit.type == 3)
		playSound('foghorn.wav');
	if (unit.subType == 'soldier')
		playSound('marching.wav');
	if (unit.subType == 'chopper')
		playSound('chopper.mp3');
	if (unit.subType == 'vehicle')
		playSound('vehicles.mp3');
	if (unit.subType == 'hero')
		playSound('yes.mp3');
	if (unit.subType == 'seal')
		playSound('mp5.mp3');
	if (unit.id == 47 || unit.id == 52)
		playSound('shock.mp3');
	if (unit.id == 13)
		playSound('gun.mp3');
}
function playVoiceSound(voiceOverId, muteSound) {
	//	console.log('playVoiceSound', voiceOverId, muteSound);
	if (muteSound || !isVoiceOn()) {
		return;
	}
	if (localStorage.muteSound && localStorage.muteSound == 'Y') {
		console.log('muted ', fileName)
		return;
	}
	var fileName = "";
	if (voiceOverId == 1)
		fileName = "place1.mp3";
	if (voiceOverId == 2)
		fileName = "place2.mp3";
	if (voiceOverId == 3)
		fileName = "place3.mp3";
	if (voiceOverId == 4)
		fileName = "place4.mp3";
	if (voiceOverId == 5)
		fileName = "place5.mp3";
	if (voiceOverId == 6)
		fileName = "place6.mp3";
	if (voiceOverId == 7)
		fileName = "place7.mp3";
	if (voiceOverId == 8)
		fileName = "place8.mp3";

	if (voiceOverId == 10)
		fileName = "capitals0.mp3";
	if (voiceOverId == 12)
		fileName = "capitals2.mp3";
	if (voiceOverId == 13)
		fileName = "capitals3.mp3";
	if (voiceOverId == 14)
		fileName = "capitals4.mp3";
	if (voiceOverId == 15)
		fileName = "capitals5.mp3";

	if (voiceOverId == 20)
		fileName = "welcome.mp3";
	if (voiceOverId == 21)
		fileName = "startPlace3Inf.mp3";
	if (voiceOverId == 22)
		fileName = "clickCapital.mp3";
	if (voiceOverId == 23)
		fileName = "welcome.mp3";


	if (voiceOverId == 31)
		fileName = "round1.mp3";
	if (voiceOverId == 32)
		fileName = "round2.mp3";
	if (voiceOverId == 33)
		fileName = "round3.mp3";
	if (voiceOverId == 34)
		fileName = "round4.mp3";
	if (voiceOverId == 35)
		fileName = "round5b.mp3";
	if (voiceOverId == 36)
		fileName = "round6b.mp3";

	if (voiceOverId == 41)
		fileName = "bt01welcome.mp3";
	if (voiceOverId == 42)
		fileName = "bt02EU.mp3";
	if (voiceOverId == 43)
		fileName = "bt03Goal.mp3";
	if (voiceOverId == 44)
		fileName = "bt04Japan.mp3";
	if (voiceOverId == 45)
		fileName = "bt05PlayersButton.mp3";
	if (voiceOverId == 46)
		fileName = "bt08PurchComplete.mp3";
	if (voiceOverId == 47)
		fileName = "bt09Ukraine.mp3";
	if (voiceOverId == 48)
		fileName = "bt09bUkraine.mp3";
	if (voiceOverId == 49)
		fileName = "bt10EndTurn.mp3";
	if (voiceOverId == 50)
		fileName = "bt10bEndTurn.mp3";
	if (voiceOverId == 51)
		fileName = "beginConquest.mp3";

	if (voiceOverId == 60)
		fileName = "conditionsMet.mp3";
	if (voiceOverId == 61)
		fileName = "surrendered1.mp3";
	if (voiceOverId == 62)
		fileName = "surrendered2.mp3";
	if (voiceOverId == 63)
		fileName = "surrendered3.mp3";
	if (voiceOverId == 64)
		fileName = "surrendered4.mp3";
	if (voiceOverId == 65)
		fileName = "surrendered5.mp3";
	if (voiceOverId == 66)
		fileName = "surrendered6.mp3";
	if (voiceOverId == 67)
		fileName = "surrendered7.mp3";
	if (voiceOverId == 68)
		fileName = "surrendered8.mp3";

	if (voiceOverId == 71)
		fileName = "won1.mp3";
	if (voiceOverId == 72)
		fileName = "won2.mp3";
	if (voiceOverId == 73)
		fileName = "won3.mp3";
	if (voiceOverId == 74)
		fileName = "won4.mp3";
	if (voiceOverId == 75)
		fileName = "won5.mp3";
	if (voiceOverId == 76)
		fileName = "won6.mp3";
	if (voiceOverId == 81)
		fileName = "loss1.mp3";
	if (voiceOverId == 82)
		fileName = "loss2.mp3";

	if (voiceOverId == 101)
		fileName = "nukesInPlay.mp3";
	if (voiceOverId == 102)
		fileName = "factoryBombed.mp3";

	if (voiceOverId == 201)
		fileName = "bt1_welcome1.mp3";
	if (voiceOverId == 202)
		fileName = "bt2_clickGermany.mp3";
	if (voiceOverId == 203)
		fileName = "bt3_clickFrance.mp3";
	if (voiceOverId == 204)
		fileName = "bt4_moveHere.mp3";
	if (voiceOverId == 205)
		fileName = "bt5_france.mp3";
	if (voiceOverId == 206)
		fileName = "bt6_reset.mp3";
	if (voiceOverId == 207)
		fileName = "bt7_transport.mp3";
	if (voiceOverId == 208)
		fileName = "bt8_load.mp3";
	if (voiceOverId == 209)
		fileName = "bt9_denmark.mp3";
	if (voiceOverId == 210)
		fileName = "bt10_uk.mp3";
	if (voiceOverId == 211)
		fileName = "bt11_done.mp3";
	if (voiceOverId == 212)
		fileName = "bt12_campaign.mp3";
	if (voiceOverId == 213)
		fileName = "bt07Germany.mp3";

	playVoiceClip(fileName);
}
function playVoiceClip(fileName) {
	if (!isVoiceOn()) {
		return;
	}
	if (fileName.length > 0) {
		voiceOverAudio.pause();
		voiceOverAudio = new Audio('assets/voice/' + fileName);
		voiceOverAudio.play();
	}
}

