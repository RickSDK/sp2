function messageForPracticeClick(practiceStep, practiceClick, terr) {
	console.log('messageForPracticeClick', practiceStep, practiceClick, terr.id);
	var message='';
	if(practiceStep==0) {
		if(practiceClick==0) {
			if(terr.id !=7)
				message='Click on Germany to view your units.';
			if(terr.id ==7)
				showAlertPopup('Good. Review your units and then close the popup. FYI, your "Factory" and "Air Defense" are not counted as part of your 8 units as they cannot be destroyed.');
		}
		if(practiceClick==1) {
			if(terr.id !=8)
				message='Click on France.';
			if(terr.id ==8) {
				playVoiceSound(204);
				showAlertPopup('Perfect! Now click "OK" on this popup and then click the "Move Here" button to send some units into France.');
			}
		}
		if(practiceClick==2 && terr.id !=8)
			message='Click on "Move Here".';
		if(practiceClick==3) {
			if(terr.id !=8)
				message='Click on France.';
		}
		if(practiceClick==4)
			message='Click "Reset Board" at the bottom of the screen.';
		if(practiceClick==5 && terr.id != 110)
			message='Click on your transport which is on the same space as your submarine.';
		if(practiceClick==5 && terr.id == 110) {
			playVoiceSound(208);
			showAlertPopup('Great! Now click the "Load Ships" button and add an infantry onto your transport.');
		}
		if(practiceClick==6 && terr.id != 109)
			message='Click on Denmark Straight.';
		if(practiceClick==6 && terr.id == 109)
			showAlertPopup('OK! Now click the "Move Here" button, select your transport and press "Go".');
		if(practiceClick==7 && terr.id != 10)
			message='Click on "Move Here" button on UK territory.';
		if(practiceClick==7 && terr.id == 10)
			showAlertPopup('Good! Now click the "Move Here" button, select your cargo and press "Go".');
	}
	if(practiceStep==1) {
		if(practiceClick==0 && terr.id != 62)
			message='Click on Ukraine. (Or click "Reset Board" or "Done" at the bottom)';
		if(practiceClick==0 && terr.id == 62)
			showAlertPopup('Good! Now click the "Attack" button, select your troops and press "Send into Battle!".');
	}
	if(practiceStep==2) {
		if(practiceClick==0 && terr.id != 7)
			message='Click on Germany.';
		if(practiceClick==0 && terr.id == 7)
			showAlertPopup('Use the form below to buy some units. You have 20 coins to spend.".');
	}
	return message;
}
function showPracticeMoveInfo(practiceStep, practiceClick, id, terrs) {
	console.log('showPracticeMoveInfo', practiceStep, practiceClick);
	if(practiceStep==0) {
		if(practiceClick==2 && id==8) {
			playVoiceSound(205);
			showArrowAtTerrId(id, terrs, 'Notice the counter has changed. Click France to see the new units.');
			return true;
		}
		if(practiceClick==5 && id==110) {
			playVoiceSound(209);
			showArrowAtTerrId(109, terrs, 'Good. Now move your transport to the Denmark Straight.');
			return true;
		}
		if(practiceClick==6 && id==109) {
			playVoiceSound(210);
			showArrowAtTerrId(10, terrs, 'Good. Now move your cargo units to UK.');
			return true;
		}
		if(practiceClick==7 && id==10) {
			playVoiceSound(211);
			showAlertPopup('Excellent! You are done with this exercise. Press "Done!" to continue with your training. (Or press "Reset Board" to continue practicing movement)');
			changeClass('donePracticeButton', 'btn btn-primary roundButton bottomButton glowButton');
			disableButton('donePracticeButton', false);
			return true;
		}
	}
	return false;
}
function showPracticeInfo(practiceStep, practiceClick, terrs) {
	console.log('showPracticeInfo', practiceStep, practiceClick);
	if(practiceStep==0) {
		if(practiceClick==0) {
			playVoiceSound(202);
			showArrowAtTerrId(7, terrs, 'Welcome to Superpowers! First thing, lets study the board... notice the number "8"? That means you have 8 units on that territory. Click on Germany to view those units.');
		}
		if(practiceClick==5) {
			playVoiceSound(207);
			showArrowAtTerrId(110, terrs, 'Lets try moving troops over water. Click on your transport to load units onto it.');
		}
	}
	if(practiceStep==1) {
		if(practiceClick==0) {
			playVoiceSound(47);
			showArrowAtTerrId(62, terrs, 'Try invading a country! Click on Ukraine and press "Attack".');
		}
	}
	if(practiceStep==2) {
		if(practiceClick==0) {
			playVoiceSound(213);
			showArrowAtTerrId(7, terrs, 'You will purchase new units at your factory. Click on Germany to buy new units.');
		}
	}
}
function showCloseTerrClicked(practiceStep, practiceClick, terrs) {
	console.log('showCloseTerrClicked', practiceStep, practiceClick);
	if(practiceStep==0) {
		if(practiceClick==1) {
			playVoiceSound(203);
			showArrowAtTerrId(8, terrs, 'Lets try moving troops! Click on France.');
		}
		if(practiceClick==3) {
			playVoiceSound(206);
			changeClass('redoPracticeButton', 'btn btn-primary roundButton bottomButton glowButton');
			showAlertPopup('Perfect. Lets reset the board and do another exercise. Click on "Reset Board" at the bottom of the screen.');
			return true;
		}
	}
	if(practiceStep==1) {
		showAlertPopup('Nice job. Click the "View Battle" button at the bottom to see the battle. You can then click "Reset Board" to try again, or click "Done!" to continue with your training.');
		changeClass('donePracticeButton', 'btn btn-primary roundButton bottomButton glowButton');
		disableButton('donePracticeButton', false);
	}
	if(practiceStep==2) {
		playVoiceSound(211);
		showAlertPopup('Thats all there is to it! You can click "Clear" Queue button to try again, or click "Done!" to play an actual Campaign.');
		changeClass('donePracticeButton', 'btn btn-primary roundButton bottomButton glowButton');
		disableButton('donePracticeButton', false);
	}
	return false;
}
function showArrowAtTerrId(id, terrs, msg) {
	var terr = terrs[id-1];
	showUpArrow(terr.x-35, terr.y+140);
	showMsgBox(terr.x-100,terr.y+240, msg);
}
function showUpArrow(x,y) {
	var e = document.getElementById('arrow');
	e.style.display='block';
	e.style.position='absolute';
	e.style.left=(x).toString()+'px';
	e.style.top=(y).toString()+'px';
	window.scrollTo(x-100, y-200);
}
function showMsgBox(x,y, msg) {
	changeClass('chatMessagesPopup', 'popupMsg');
	var e = document.getElementById('chatMessagesPopup');
	e.style.display='block';
	e.style.position='absolute';
	e.style.left=(x).toString()+'px';
	e.style.top=(y).toString()+'px';
	e.style.width='200px';
	setInnerHTMLFromElement('chatMessagesPopup', msg);
}
