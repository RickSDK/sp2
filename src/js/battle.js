function getBattleAnalysis(battle, selectedTerritory, player) {
    var militaryMessage = '';
    var expectedHits = 0;
    var expectedLosses = 0;
    var attStrength = 0;
    var defStrength = 0;
    var numAttUnits = 0;
    var numDefUnits = 0;
    var numNukes = 0;
    var airunits = 0;
    var bomberCount = 0;
    var specOpsCount = 0;
    var spotterCount = 0;
    var transportCargo = 0;
    var infParatrooperCount = 0;
    var groundUnits = 0;
    var soldierCount = 0;
    var carrierCargo = 0;
    var artCount = 0;
    var includesGeneral = false;
    var pieceId = 0;
    battle.attackUnits.forEach(unit => {
        if (unit.piece == 10)
            includesGeneral = true;
    });

    battle.attackUnits.forEach(unit => {
        if (unit.dead)
            return;
        if (unit.piece > pieceId)
            pieceId = unit.piece;
        if (unit.type == 1)
            groundUnits++;
        if (unit.type == 2)
            airunits++;
        if (includesGeneral) {
            if (unit.subType == 'soldier' || unit.id == 46 || unit.id == 51)
                unit.att = unit.att2 + 1;
            if (unit.id == 50) //cobra
                unit.numAtt = 2;
        }


        var numAtt = unit.numAtt || 1;
        attStrength += unit.att * numAtt;
        if (unit.piece == 41)
            attStrength += 6;
        if (unit.piece == 14)
            numNukes++;
        if (unit.piece == 7)
            bomberCount++;
        if (unit.piece == 52)
            numNukes += 3;
        numAttUnits++;

        if (unit.piece == 35)
            specOpsCount++;
        if (unit.type == 1 && !unit.returnFlg)
            spotterCount++;
        if (unit.subType == 'vehicle' || unit.subType == 'missile')
            transportCargo += 2;
        if (unit.subType == 'soldier') {
            soldierCount++;
            transportCargo++;
        }
        if (unit.subType == 'fighter' && unit.terr != selectedTerritory.id)
            carrierCargo++;
        if (unit.piece == 1 || unit.piece == 24 || unit.piece == 33 || unit.piece == 38)
            artCount++;
        if (unit.piece == 2) {
            infParatrooperCount++;
        }
    });
    var includesLeader = false;
    battle.defendingUnits.forEach(unit => {
        if (unit.piece == 11)
            includesLeader = true;
    });
    battle.defendingUnits.forEach(unit => {
        if (unit.dead)
            return;
        numDefUnits++;
        var numDef = unit.numDef || 1;
        if (includesLeader && unit.type == 1)
            unit.def = unit.def2 + 1;
        defStrength += unit.def * numDef;
    });

    if (includesGeneral)
        attStrength += soldierCount;
    expectedHits = expectedHitsFromHits(attStrength);
    expectedLosses = expectedHitsFromHits(defStrength);

    var allowAttackFlg = (numAttUnits > 0);
    var battleInProgress = true;
    var battleMessage = '';

    militaryMessage = (attStrength > defStrength) ? 'Launch the attack!' : 'You need more units to attack!';
    if (battle.round > 0)
        militaryMessage = (attStrength > defStrength) ? 'Continue the attack' : 'Retreat!';

    if (airunits > 0 && groundUnits == 0)
        militaryMessage = 'You do not have any ground units to secure the territory. Send additinal ground units.';

    if (numNukes > 0) {
        expectedHits = nukeHitsForTerr(selectedTerritory, player) * numNukes;
        if (expectedHits == 0) {
            militaryMessage = 'This territory is too heavily defended for your nukes! Find a better target or get your nukes upgraded through technology.';
            allowAttackFlg = false;
        }
    }
    var wonFlg = false;
    var endPhrase = '';
    if (battle.round > 0) {
        battleInProgress = (numAttUnits > 0 && numDefUnits > 0);
        if (numAttUnits > 0 && numDefUnits == 0) {
            wonFlg = true;
            battleMessage = 'You have won!';
        }
        if (numAttUnits == 0 && numDefUnits > 0)
            battleMessage = 'You have lost.';
        if(0)
            endPhrase = ' Remaining subs dove to avoid attacks.'
    }
    return {
        militaryMessage: militaryMessage,
        expectedHits: expectedHits,
        expectedLosses: expectedLosses,
        allowAttackFlg: allowAttackFlg,
        airunits: airunits,
        bomberCount: bomberCount,
        includesGeneral: includesGeneral,
        numAttUnits: numAttUnits,
        numDefUnits: numDefUnits,
        pieceId: pieceId,
        battleInProgress: battleInProgress,
        battleMessage: battleMessage,
        wonFlg: wonFlg,
        endPhrase: endPhrase
    };
}
function highlightTheseUnits(moveTerr, units) {
    unitIdHash = {}
    units.forEach(unit => {
        unitIdHash[unit.id] = true;
    });
    for (var x = 0; x < moveTerr.length; x++) {
        var ter = moveTerr[x];
        for (var i = 0; i < ter.units.length; i++) {
            var unit = ter.units[i];
            var e = document.getElementById('unit' + unit.id);
            if (e && unitIdHash[unit.id]) {
                e.checked = true;
            }
        }
    }
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
}
function rollAttackDice(battle) {
    battle.attHits = 0;
    battle.attackUnits.forEach(unit => {
        var diceRoll = Math.floor((Math.random() * 6) + 1);
        if (diceRoll <= unit.att) {
            unit.dice = ['diceh' + diceRoll + '.png'];
            battle.attHits++;
        }
        else
            unit.dice = ['dice' + diceRoll + '.png'];
    });
}
function rollDefenderDice(battle) {
    battle.defHits = 0;
    battle.defendingUnits.forEach(unit => {
        var diceRoll = Math.floor((Math.random() * 6) + 1);
        if (diceRoll <= unit.def) {
            unit.dice = ['diceh' + diceRoll + '.png'];
            battle.defHits++;
        }
        else
            unit.dice = ['dice' + diceRoll + '.png'];
    });
    markCasualties(battle)
}
function markCasualties(battle) {
    var hits = battle.defHits;
    battle.attackUnits.forEach(unit => {
        if (hits-- > 0)
            unit.dead = true;
    });

    hits = battle.attHits;
    battle.defendingUnits.forEach(unit => {
        if (hits-- > 0)
            unit.dead = true;
    });
}
function removeCasualties(battle) {
    if (!battle.attCasualties)
        battle.attCasualties = [];
    if (!battle.defCasualties)
        battle.defCasualties = [];
    var attackUnits = [];
    battle.attackUnits.forEach(unit => {
        if (unit.dead)
            battle.attCasualties.push(unit.piece);
        else
            attackUnits.push(unit);
    });
    battle.attackUnits = attackUnits;
    var defendingUnits = [];
    battle.defendingUnits.forEach(unit => {
        if (unit.dead)
            battle.defCasualties.push(unit.piece);
        else
            defendingUnits.push(unit);
    });
    battle.defendingUnits = defendingUnits;
}
function addFinalCasualtiesToList(battle) {
    if (!battle.attCasualties)
        battle.attCasualties = [];
    if (!battle.defCasualties)
        battle.defCasualties = [];
   battle.attackUnits.forEach(unit => {
        if (unit.dead)
            battle.attCasualties.push(unit.piece);
    });
     battle.defendingUnits.forEach(unit => {
        if (unit.dead)
            battle.defCasualties.push(unit.piece);
    });
}
function battleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData) {
    var hits=displayBattle.defCasualties.length;
    var losses=displayBattle.attCasualties.length;
    var unit1 = (losses==1)?'unit':'units';
    var unit2 = (hits==1)?'unit':'units';
    var word = displayBattle.militaryObj.wonFlg?'defeating ':'losing to ';
    var msg = losses+' '+unit1+' lost '+word+' '+superpowersData.superpowers[displayBattle.defender]+' at '+selectedTerritory.name+'. Enemy lost '+hits+' '+unit2+'.'+displayBattle.militaryObj.endPhrase;
    addFinalCasualtiesToList(displayBattle);
    transferControlOfTerr(selectedTerritory, currentPlayer.nation);
    if (displayBattle.militaryObj.wonFlg)
        playVoiceSound(71 + Math.floor((Math.random() * 6)));
    else
        playVoiceSound(81 + Math.floor((Math.random() * 2)));
    if (displayBattle.bonusUnitsFlg && displayBattle.militaryObj.wonFlg) {
        addNewUnitToBoard(gameObj, selectedTerritory, 2, superpowersData);
        addNewUnitToBoard(gameObj, selectedTerritory, 2, superpowersData);
        addNewUnitToBoard(gameObj, selectedTerritory, 3, superpowersData);
        playSound('Swoosh.mp3');
        setTimeout(() => { playSound('Swoosh.mp3'); }, 100);
        setTimeout(() => { playSound('Swoosh.mp3'); }, 200);
    }

    displayBattle.attackUnits.forEach(function (unit) {
        unit.movesLeft = 0;
        if (unit.type != 2 && !unit.returnFlg)
            unit.terr = selectedTerritory.id;
    });
    var units = [];
    gameObj.units.forEach(function (unit) {
        if (!unit.dead)
            units.push(unit);
    });
    gameObj.units = units;
    moveTerr.forEach(function (terr) {
        refreshTerritory(terr, gameObj, currentPlayer, superpowersData, currentPlayer);
    });
    refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, currentPlayer);
    var ft = 'test';
    logItem(gameObj, currentPlayer, 'Battle', msg, displayBattle.battleDetails+'|'+displayBattle.attCasualties.join('+')+'|'+displayBattle.defCasualties.join('+')+'|'+displayBattle.medicHealedCount+'|'+displayBattle.round, selectedTerritory.id, selectedTerritory.owner, ft, '', displayBattle.defender);
     popupNationMessage(currentPlayer.nation, msg, selectedTerritory.owner, selectedTerritory.x, selectedTerritory.y);
}
function transferControlOfTerr(terr, nation) {
    terr.owner = nation;
    terr.units.forEach(function (unit) {
        if (unit.piece == 13 || unit.piece == 14 || unit.piece == 52 || unit.piece == 15 || unit.piece == 19) {
            unit.owner = nation;
            unit.nation = nation;
            unit.movesLeft = 0;
        }
    });
}
function addNewUnitToBoard(gameObj, terr, piece, superpowersData) {
    var nation = terr.owner;
    var newId = gameObj.unitId || gameObj.units.length;
    var unit = unitOfId(newId, nation, piece, terr.id, superpowersData.units, false);
    gameObj.units.push(unit);
}
