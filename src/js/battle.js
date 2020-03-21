function initializeBattle(attackPlayer, selectedTerritory, attackUnits, gameObj) {
    if (!attackPlayer) {
        console.log('whoa!!!');
    }
    var displayBattle = {
        generalUnit: 0,
        hijackerUnit: 0,
        medicHealedCount: 0,
        subsDove: 0,
        airDefenseUnits: [],
        phase: 1,
        round: 0,
        attNation: attackPlayer.nation,
        attHits: 0,
        attackUnits: [],
        defendingUnits: [],
        defHits: 0,
        defNation: selectedTerritory.owner,
        allowGeneralRetreat: true,
        allowRetreat: true,
        militaryMessage: '',
        defender: selectedTerritory.owner,
        attacker: attackPlayer.nation,
        militaryObj: {},
        battleDetails: '',
        bonusUnitsFlg: (selectedTerritory.owner == 0 && !selectedTerritory.capital)
    };
    var defendingUnits = [];
    selectedTerritory.units.forEach(unit => {
        if (unit.owner != attackPlayer.nation && isUnitOkToDefend(unit)) {
            unit.dice = [];
            var numDef = unit.numDef || 1;
            for (var i = 0; i < numDef; i++)
                unit.dice.push('dice.png');
            defendingUnits.push(unit);
        }
    });
    displayBattle.defendingUnits = defendingUnits;
    displayBattle.attackUnits = attackUnits;
    displayBattle.militaryObj = getBattleAnalysis(displayBattle, selectedTerritory, attackPlayer, gameObj);
    var att = arrayOfPieces(displayBattle.attackUnits);
    var def = arrayOfPieces(displayBattle.defendingUnits);
    displayBattle.battleDetails = att + '|' + def;
    return displayBattle;

}
function arrayOfPieces(units) {
    var list = [];
    units.forEach(unit => {
        list.push(unit.piece);
    });
    return list.join('+');
}
function startBattle(terr, player, gameObj, superpowersData) {
    var cost = costToAttack(terr, player);
    if (cost > 0 && player.cpu) {
        console.log('!!!why attack ally??!!!!', terr.name);
        return;
    }

    if (cost > 0) {
        var p2 = playerOfNation(terr.owner, gameObj);
        changeTreaty(player, p2, 0, gameObj, superpowersData, cost);
        player.treatiesAtStart[p2.nation - 1] = 0;
        player.money -= cost;
    }
    terr.attackedByNation = player.nation;
    terr.attackedRound = gameObj.round;
}
function isUnitOkToDefend(unit) {
    if (unit.piece == 13 || unit.piece == 14 || unit.piece == 52 || unit.piece == 15 || unit.piece == 19)
        return false;
    else
        return true;
}
function isUnitOkToAttack(unit, nation) {
    if (unit.att > 0 && unit.mv > 0 && unit.movesLeft > 0 && unit.owner == nation && unit.subType != 'missile')
        return true;
    else
        return false;
}
function isUnitOkToMove(unit, nation) {
    if (unit.att > 0 && unit.mv > 0 && unit.movesLeft > 0 && unit.owner == nation)
        return true;
    else
        return false;
}
function getBattleAnalysis(battle, selectedTerritory, player, gameObj) {
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
        if (battle.round > 0 && unit.returnFlg)
            return;
        if (unit.piece > pieceId)
            pieceId = unit.piece;
        if (unit.type == 1 || unit.type == 4)
            groundUnits++;
        if (selectedTerritory.nation == 99 && unit.type == 3)
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
    var numDefSubs = 0;
    battle.defendingUnits.forEach(unit => {
        if (unit.piece == 11)
            includesLeader = true;
    });
    battle.defendingUnits.forEach(unit => {
        if (unit.dead)
            return;
        numDefUnits++;
        if (unit.piece == 5)
            numDefSubs++;
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
    var endPhrase = '';

    militaryMessage = (attStrength > defStrength) ? 'Launch the attack!' : 'You need more units to attack!';
    if (battle.round > 0)
        militaryMessage = (attStrength > defStrength) ? 'Continue the attack' : 'Retreat!';

    if (airunits > 0 && groundUnits == 0)
        militaryMessage = 'You do not have any ground units to secure the territory. Send additinal ground units.';

    if (numNukes > 0) {
        expectedHits = nukeHitsForTerr(selectedTerritory, player, gameObj) * numNukes;
        if (expectedHits == 0) {
            militaryMessage = 'This territory is too heavily defended for your nukes! Find a better target or get your nukes upgraded through technology.';
            allowAttackFlg = false;
        }
    }
    var wonFlg = false;
    if (battle.round > 0) {
        battleInProgress = (groundUnits > 0 && numDefUnits > 0);
        if (groundUnits > 0 && numDefUnits == 0) {
            wonFlg = true;
            battleMessage = 'You have won!';
        }
        if (groundUnits == 0)
            battleMessage = 'You have lost.';

        if (groundUnits == 0 && numDefUnits == 0)
            endPhrase = ' No ground units to secure the territory.'

        if (numAttUnits > 0 && airunits == numAttUnits && numDefSubs == numDefUnits) {
            endPhrase = ' Remaining subs dove to avoid attacks.'
            battleInProgress = false;
        }
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
function landTheNukeBattle(player, targetTerr, attackUnits, gameObj, superpowersData, launchTerritories) {
    playSound('tornado.mp3');
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj);
    startBattle(targetTerr, player, gameObj, superpowersData);
    targetTerr.nuked = true;
    battle.attHits = battle.militaryObj.expectedHits;
    var expectedHits = nukeHitsForTerr(targetTerr, player, gameObj);
    console.log('***NUKE***', targetTerr.name, expectedHits, battle);
    battle.defHits = attackUnits.length;
    markCasualties(battle);
    nukeBattleCompleted(battle, targetTerr, player, launchTerritories, gameObj, superpowersData, false);
}
function landTheCruiseBattle(player, targetTerr, attackUnits, gameObj, superpowersData) {
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj);
    startBattle(targetTerr, player, gameObj, superpowersData);
    battle.attHits = battle.militaryObj.expectedHits;
    battle.defHits = 0;
    markCasualties(battle);
    nukeBattleCompleted(battle, targetTerr, player, [], gameObj, superpowersData, true);
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
        unit.movesLeft = 0;
        unit.dice = [];
        for (var x = 0; x < unit.numAtt; x++) {
            var diceRoll = Math.floor((Math.random() * 6) + 1);
            if (diceRoll <= unit.att) {
                unit.dice.push('diceh' + diceRoll + '.png');
                battle.attHits++;
            }
            else
                unit.dice.push('dice' + diceRoll + '.png');
        }
    });
}
function rollDefenderDice(battle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData) {
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
    markCasualties(battle);

    battle.phase = 3;
    battle.militaryObj = getBattleAnalysis(battle, selectedTerritory, currentPlayer, gameObj);
    if (!battle.militaryObj.battleInProgress)
        battleCompleted(battle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData);


}
function removeReturnFlgUnits(battle) {
    attackUnits = [];
    battle.attackUnits.forEach(unit => {
        if (!unit.returnFlg)
            attackUnits.push(unit);
    });
    battle.attackUnits = attackUnits;
}
function markCasualties(battle) {
    var hits = battle.defHits;
    battle.attackUnits.forEach(unit => {
        if (!unit.returnFlg) {
            if (hits-- > 0)
                unit.dead = true;
        }
    });

    hits = battle.attHits;
    battle.defendingUnits.forEach(unit => {
        if (hits-- > 0)
            unit.dead = true;
    });
}
function removeCasualties(battle, gameObj, player, finalFlg, superpowersData) {
    if (!battle.attCasualties)
        battle.attCasualties = [];
    if (!battle.defCasualties)
        battle.defCasualties = [];
    var attackUnits = [];
    battle.attackUnits.forEach(unit => {
        if (unit.dead) {
            battle.attCasualties.push(unit.piece);
            if (unit.piece == 10 || unit.piece == 11)
                logItem(gameObj, player, 'Hero Killed', superpowersData.superpowers[unit.owner] + ' ' + unit.name + ' killed!');
        } else if (!unit.returnFlg)
            attackUnits.push(unit);
    });
    if (!finalFlg)
        battle.attackUnits = attackUnits;
    var defendingUnits = [];
    battle.defendingUnits.forEach(unit => {
        if (unit.dead) {
            battle.defCasualties.push(unit.piece);
            if (unit.piece == 10 || unit.piece == 11)
                logItem(gameObj, player, 'Hero Killed', superpowersData.superpowers[unit.owner] + ' ' + unit.name + ' killed!');
        } else
            defendingUnits.push(unit);
    });
    if (!finalFlg)
        battle.defendingUnits = defendingUnits;
}
function nukeBattleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData, cruiseFlg) {
    var title = (cruiseFlg) ? 'Cruise Attack!' : 'Nuke Attack!';
    var weaponType = (cruiseFlg) ? ' missiled! ' : ' nuked! ';
    wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, title, selectedTerritory, moveTerr, 1500, weaponType);
}
function battleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData) {
    if (displayBattle.militaryObj.wonFlg) {
        selectedTerritory.defeatedByNation = currentPlayer.nation;
        selectedTerritory.defeatedByRound = gameObj.round;
        transferControlOfTerr(selectedTerritory, currentPlayer.nation, gameObj, true);
        if (!currentPlayer.cpu)
            playVoiceSound(71 + Math.floor((Math.random() * 6)));
        displayBattle.attackUnits.forEach(function (unit) {
            if (unit.type != 2 && !unit.returnFlg)
                unit.terr = selectedTerritory.id;
        });
    } else {
        if (!currentPlayer.cpu)
            playVoiceSound(81 + Math.floor((Math.random() * 2)));
    }
    wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, 'Battle', selectedTerritory, moveTerr);
}
function wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, title, selectedTerritory, moveTerr, delay = 0, weaponType = '') {
    removeCasualties(displayBattle, gameObj, selectedTerritory, true, superpowersData);

    if (displayBattle.bonusUnitsFlg && displayBattle.militaryObj.wonFlg) {
        if (selectedTerritory.capital)
            addNewUnitToBoard(gameObj, selectedTerritory, 15, superpowersData);
        else {
            addNewUnitToBoard(gameObj, selectedTerritory, 2, superpowersData);
            addNewUnitToBoard(gameObj, selectedTerritory, 2, superpowersData);
            addNewUnitToBoard(gameObj, selectedTerritory, 3, superpowersData);
            setTimeout(() => { playSound('Swoosh.mp3'); }, 100);
            setTimeout(() => { playSound('Swoosh.mp3'); }, 200);
        }
        playSound('Swoosh.mp3');
    }

    var units = [];
    gameObj.units.forEach(function (unit) {
        if (!unit.dead)
            units.push(unit);
    });
    gameObj.units = units;
    moveTerr.forEach(function (terr) {
        refreshTerritory(terr, gameObj, currentPlayer, superpowersData, currentPlayer);
    });

    var hits = displayBattle.defCasualties.length;
    var losses = displayBattle.attCasualties.length;
    if (currentPlayer.nation > 0) {
        currentPlayer.kills += hits;
        currentPlayer.losses += losses;
        currentPlayer.kd = getKdForPlayer(currentPlayer);
    }
    if (displayBattle.defender > 0) {
        var p2 = playerOfNation(displayBattle.defender, gameObj);
        p2.kills += losses;
        p2.losses += hits;
        p2.kd = getKdForPlayer(p2);
    }

    var unit1 = (losses == 1) ? 'unit' : 'units';
    var unit2 = (hits == 1) ? 'unit' : 'units';
    var word = displayBattle.militaryObj.wonFlg ? 'defeating ' : 'losing to ';
    var msg = losses + ' ' + unit1 + ' lost ' + word + ' ' + superpowersData.superpowers[displayBattle.defender] + ' at ' + selectedTerritory.name + '. Enemy lost ' + hits + ' ' + unit2 + '.' + displayBattle.militaryObj.endPhrase;
    if (weaponType.length > 0)
        msg = selectedTerritory.name + weaponType + hits + ' casualties.';
    if (displayBattle.round == 0)
        displayBattle.round = 1
    logItem(gameObj, currentPlayer, title, msg, displayBattle.battleDetails + '|' + displayBattle.attCasualties.join('+') + '|' + displayBattle.defCasualties.join('+') + '|' + displayBattle.medicHealedCount + '|' + displayBattle.round, selectedTerritory.id, selectedTerritory.owner, '', '', displayBattle.defender);
    popupNationMessage(currentPlayer.nation, msg, selectedTerritory.owner, selectedTerritory.x, selectedTerritory.y);

    setTimeout(() => {
        refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, currentPlayer);
    }, delay);
}
function getKdForPlayer(player) {
    if (player.losses > 0)
        return (player.kills / player.losses).toFixed(1);
    else
        return 0;
}
function transferControlOfTerr(terr, nation, gameObj, annihilationFlg) {
    terr.owner = nation;
    terrUnits = [];
    gameObj.units.forEach(function (unit) {
        if (unit.terr == terr.id) {
            if (isUnitOkToDefend(unit)) {
                if (annihilationFlg && unit.owner != nation)
                    unit.dead = true;
                else
                    terrUnits.push(unit);
            } else {
                unit.owner = nation;
                unit.nation = nation;
                unit.movesLeft = 0;
                terrUnits.push(unit);
            }
        }
    });
    terr.units = terrUnits;
}
function transferControlOfTerrAndRefresh(terr, nation, gameObj, currentPlayer, superpowersData, yourPlayer) {
    transferControlOfTerr(terr, nation, gameObj, false);
    refreshTerritory(terr, gameObj, currentPlayer, superpowersData, yourPlayer)
}
function addNewUnitToBoard(gameObj, terr, piece, superpowersData) {
    var nation = terr.owner;
    var newId = gameObj.unitId;
    gameObj.unitId++;
    var unit = unitOfId(newId, nation, piece, terr.id, superpowersData.units, false);
    gameObj.units.push(unit);
}
function allowHostileAct(type, selectedTerritory, player, gameObj) {
    //   console.log('allowHostileAct', type);
    if (type == 'bomb' && selectedTerritory.bombed) {
        showAlertPopup("This country has already been bombed.", 1);
        return false;
    }
    if (type == 'movement' && selectedTerritory.defeatedByNation == player.nation && selectedTerritory.defeatedByRound == gameObj.round) {
        showAlertPopup("Can't move into territories just defeated.", 1);
        return false;
    }
    if ((type == 'attack' || type == 'nuke' || type == 'cruise') && selectedTerritory.attackedByNation == player.nation && selectedTerritory.attackedRound == gameObj.round) {
        showAlertPopup("Can't attack the same territory twice.", 1);
        return false;
    }

    if (type == 'attack') {
    }
    return true;
}