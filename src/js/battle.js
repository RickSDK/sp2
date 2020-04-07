function initializeBattle(attackPlayer, selectedTerritory, attackUnits, gameObj, stratBombFlg = false, cruiseFlg = false) {
    if (!attackPlayer) {
        console.log('whoa!!!');
    }
    var displayBattle = {
        generalUnit: 0,
        hijackerUnit: 0,
        medicHealedCount: 0,
        subsDove: 0,
        airDefenseUnits: [],
        attTargets: [],
        defTargets: [],
        phase: 1,
        round: 0,
        attNation: attackPlayer.nation,
        attHits: 0,
        attackUnits: [],
        defendingUnits: [],
        defCasualties: [],
        attCasualties: [],
        defHits: 0,
        attSBSHps: 0,
        defSBSHps: 0,
        attActiveMedics: 0,
        defActiveMedics: 0,
        attSoldiersHealed: 0,
        defSoldiersHealed: 0,
        numAttDrones: 0,
        numDefDroneKillers: 0,
        defNation: selectedTerritory.owner,
        allowGeneralRetreat: false,
        allowRetreat: true,
        militaryMessage: '',
        defender: selectedTerritory.owner,
        attacker: attackPlayer.nation,
        militaryObj: {},
        battleDetails: '',
        cruiseFlg: cruiseFlg,
        seaBattleFlg: (selectedTerritory.nation==99),
        terrX: selectedTerritory.x,
        terrY: selectedTerritory.y,
        bonusUnitsFlg: (selectedTerritory.owner == 0 && selectedTerritory.nation < 99)
    };
    var defendingUnits = [];
    var fighterDefenseFlg = false;
    if (stratBombFlg) {
        selectedTerritory.bombed = true;
        var p2 = playerOfNation(selectedTerritory.owner, gameObj);
        fighterDefenseFlg = p2.tech[2];
    }

    var defSBSHps = 0;
    var defActiveMedics = 0;
    var numDefDroneKillers = 0;
    selectedTerritory.units.forEach(unit => {
        if (unit.owner != attackPlayer.nation && isUnitOkToDefend(unit)) {
            if (!stratBombFlg || (stratBombFlg && fighterDefenseFlg && unit.subType == 'fighter')) {
                unit.dice = [];
                var numDef = unit.numDef || 1;
                for (var i = 0; i < numDef; i++)
                    unit.dice.push('dice.png');
                defendingUnits.push(unit);
                if (unit.piece == 12)
                    defSBSHps += unit.bcHp - unit.damage - 1;
                if (unit.piece == 28)
                    defActiveMedics++;
                if (unit.targetDroneFlg)
                    numDefDroneKillers++;
            }
        }
    });
    displayBattle.numDefDroneKillers = numDefDroneKillers;
    displayBattle.defSBSHps = defSBSHps;
    displayBattle.defActiveMedics = defActiveMedics;

    var attSBSHps = 0;
    var attActiveMedics = 0;
    var nukeFlg = false;
    var numAttDrones = 0;
    attackUnits.forEach(unit => {
        if (unit.piece == 14 || unit.piece == 52)
            nukeFlg = true;
        if (unit.piece == 28)
            attActiveMedics++;
        if (unit.piece == 43)
            numAttDrones++;
        if (unit.piece == 12)
            attSBSHps += unit.bcHp - unit.damage - 1;
        if (unit.cargoOf > 0)
            displayBattle.allowRetreat = false;
        if (unit.piece == 10) {
            localStorage.generalTerr1 = unit.terr;
            displayBattle.allowGeneralRetreat = true;
            if (unit.cargoOf > 0)
                displayBattle.allowGeneralRetreat = false;
        }
    });
    displayBattle.numAttDrones = numAttDrones;
    displayBattle.nukeFlg = nukeFlg;
    if (nukeFlg && displayBattle.defActiveMedics > 0)
        displayBattle.defActiveMedics = 0;
    displayBattle.attActiveMedics = attActiveMedics;
    displayBattle.attSBSHps = attSBSHps;
    attackUnits.sort(function (a, b) { return a.cas - b.cas; });
    defendingUnits.sort(function (a, b) { return a.cas - b.cas; });

    displayBattle.defendingUnits = defendingUnits;
    displayBattle.attackUnits = attackUnits;
    displayBattle.militaryObj = getBattleAnalysis(displayBattle, selectedTerritory, attackPlayer, gameObj);
    if (displayBattle.militaryObj.airunits > 0 && selectedTerritory.nation < 99)
        displayBattle.attackUnits = reorderAttackUnitsSoLandUnitRemains(attackUnits);
    var att = arrayOfPieces(displayBattle.attackUnits);
    var def = arrayOfPieces(displayBattle.defendingUnits);
    displayBattle.battleDetails = att + '|' + def;
    addAAGunesToBattle(displayBattle, selectedTerritory);
    console.log(displayBattle);
    return displayBattle;

}
function reorderAttackUnitsSoLandUnitRemains(attackUnits) {
    units = [];
    highestLandId = 0;
    highestLandCas = 0;
    attackUnits.forEach(unit => {
        if ((unit.type == 1 || unit.type == 4) && unit.cas > highestLandCas) {
            highestLandCas = unit.cas;
            highestLandId = unit.id;
        }
    });
    if (highestLandId == 0)
        return attackUnits;
    var highestUnit;
    attackUnits.forEach(unit => {
        if (unit.id == highestLandId)
            highestUnit = unit;
        else
            units.push(unit);
    });
    units.push(highestUnit);
    return units;
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

    if (cost > 0) {
        var p2 = playerOfNation(terr.owner, gameObj);
        changeTreaty(player, p2, 0, gameObj, superpowersData, cost);
    }
    terr.attackedByNation = player.nation;
    terr.attackedRound = gameObj.round;
    terr.leaderMessage = ''; //needed to make advisor go away
}
function isUnitCruiseUnit(piece) {
    if (piece == 5 || piece == 9 || piece == 12 || piece == 39)
        return true;
    else
        return false;
}
function isUnitFighterUnit(piece) {
    if (piece == 6 || piece == 22 || piece == 23 || piece == 43 || piece == 48)
        return true;
    else
        return false;
}
function isUnitOkToDefend(unit) {
    if (unit.piece == 13 || unit.piece == 14 || unit.piece == 52 || unit.piece == 15 || unit.piece == 19 || unit.piece == 44)
        return false;
    else
        return true;
}
function isUnitOkToAttack(unit, nation) {
    if (unit.att > 0 && unit.mv > 0 && unit.movesLeft > 0 && unit.owner == nation && unit.subType != 'missile' && unit.piece != 13)
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
        if (isArtillery(unit) && selectedTerritory.nation == 99)
            numAtt = 3;
        attStrength += unit.att * numAtt;
        if (battle.cruiseFlg) {
            if (unit.piece == 39)
                attStrength += unit.att; // cruiser
            if ((unit.piece == 9 || unit.piece == 12 || unit.piece == 39) && player.tech[7])
                attStrength += unit.att * numAtt;
        }
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
        expectedHits = maximumPossibleNukeHitsForTerr(selectedTerritory, player, gameObj) * numNukes;
        if (expectedHits == 0) {
            militaryMessage = 'This territory is too heavily defended for your nukes! Find a better target or get your nukes upgraded through technology.';
            allowAttackFlg = false;
        }
    }
    var wonFlg = false;
    if (battle.round > 0 && battle.round < 100) {
        battleInProgress = (numAttUnits > 0 && numDefUnits > 0);
        if (groundUnits > 0 && numDefUnits == 0) {
            wonFlg = true;
            battleMessage = 'You have won!';
        }
        if (groundUnits == 0)
            battleMessage = 'You have lost.';

        if (groundUnits == 0 && numDefUnits == 0)
            endPhrase = ' No ground units to secure the territory.';

        if (groundUnits == 0 && numDefUnits == 0 && selectedTerritory.nation == 99) {
            wonFlg = true;
            endPhrase = '';
        }

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
        battleLeaderMessage: battleMessageForNation(selectedTerritory.owner),
        endPhrase: endPhrase
    };
}
function battleMessageForNation(nation) {
    var messages = [
        'You are making a mistake and will regret this!',
        'Ok buddy, this is a stupid mistake. Really, really stupid mistake.',
        'Hold it right there! You don\'t want to make this mistake!',
        'Mother Russia is taking names. And yours is at the top of the list!',
        'The Emporer will not be happy when he find out about this!',
        'We demand you withdraw your troops and raise the flag of surrender!',
        'Jihad!',
        'Stop! This is a most unfortunate mistake on your part.',
        'No, no no! We are laughing at this pitiful attack you are trying to make!',
    ]
    return messages[nation];
}
function landTheNukeBattle(player, targetTerr, attackUnits, gameObj, superpowersData, launchTerritories) {
    playSound('tornado.mp3');
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj);
    startBattle(targetTerr, player, gameObj, superpowersData);
    targetTerr.nuked = true;
    battle.attHits = battle.militaryObj.expectedHits;
    var expectedHits = maximumPossibleNukeHitsForTerr(targetTerr, player, gameObj);
    console.log('***NUKE***', targetTerr.name, expectedHits);
    battle.defHits = attackUnits.length;
    addhitsToList(battle.defTargets, 'default', battle.defHits);
    addhitsToList(battle.attTargets, 'nuke', battle.attHits);
    markCasualties(battle);
    nukeBattleCompleted(battle, targetTerr, player, launchTerritories, gameObj, superpowersData, false);
    return battle;
}
function landTheCruiseBattle(player, targetTerr, attackUnits, gameObj, superpowersData) {
    playSound('bomb2.mp3');
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj, false, true);
    startBattle(targetTerr, player, gameObj, superpowersData);
    battle.attHits = battle.militaryObj.expectedHits;
    battle.defHits = 0;
    var target = 'default';
    if (player.tech[9])
        target = 'vehicles';
    addhitsToList(battle.attTargets, target, battle.attHits);
    markCasualties(battle);
    nukeBattleCompleted(battle, targetTerr, player, [], gameObj, superpowersData, true);
    return battle;
}
function strategicBombBattle(player, targetTerr, attackUnits, gameObj, superpowersData) {
    playSound('bombers.mp3');
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj, true);
    startBattle(targetTerr, player, gameObj, superpowersData);
    rollAAGuns(battle, targetTerr);
    removeCasualties(battle, gameObj, player, true, superpowersData);
    rollAttackDice(battle, true);

    var hits = battle.attHits;
    for (var x = 0; x < battle.defTargets.length; x++)
        battle.attCasualties.push(7);
    if (battle.defHits > 0)
        playSound('Scream.mp3');

    if (hits > 0) {
        if (targetTerr.factoryCount >= 2) {
            targetTerr.factoryCount = 1;
            gameObj.units.forEach(unit => {
                if (unit.terr == targetTerr.id && unit.piece == 19)
                    unit.dead = true;
            });
            hits--;
            battle.defCasualties.push(15);
        }
        if (hits > 0) {
            targetTerr.facBombed = true;
            battle.defCasualties.push(15);
        }
    }
    wrapUpBattle(battle, player, gameObj, superpowersData, 'Strategic Bombing Run', targetTerr, [], 1200, 'bomb');
    return battle;
}
function addhitsToList(field, type, amount) {
    for (var x = 0; x < amount; x++)
        field.push(type);
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
function addAAGunesToBattle(battle, terr) {
    var aaGunsPerPLane = terr.adCount;
    if (aaGunsPerPLane > 2)
        aaGunsPerPLane = 2;
    battle.airDefenseUnits = [];
    battle.attackUnits.forEach(unit => {
        var unitAdLimit = unit.adLimit;
        if (terr.battleshipAACount > unitAdLimit)
            unitAdLimit = terr.battleshipAACount;
        if (unit.type == 2 || unit.type == 4) {
            if (unitAdLimit >= 1 && aaGunsPerPLane >= 1)
                battle.airDefenseUnits.push({ piece: 13, nation: 1, dice: [] })
            if (unitAdLimit >= 2 && aaGunsPerPLane >= 2)
                battle.airDefenseUnits.push({ piece: 13, nation: 1, dice: [] })
        }
    });
}
function startToRollAAGuns(battle, selectedTerritory) {
    addAAGunesToBattle(battle, selectedTerritory);
    battle.airDefenseUnits.forEach(unit => {
        unit.dice.push('dice.png');
    });
}
function rollAAGuns(battle, selectedTerritory) {
    addAAGunesToBattle(battle, selectedTerritory);
    battle.attTargets = [];
    battle.defTargets = [];
    battle.airDefenseUnits.forEach(unit => {
        unit.dice = [];
        var diceRoll = Math.floor((Math.random() * 6) + 1);
        if (diceRoll <= 1) {
            unit.dice.push('diceh' + diceRoll + '.png');
            battle.defHits++;
            battle.defTargets.push('planes');
        }
        else
            unit.dice.push('dice' + diceRoll + '.png');
    });
    markCasualties(battle);
}
function rollAttackDice(battle, stratFlg = false) {
    battle.attHits = 0;
    battle.attTargets = [];
    specialUnitsFire(battle);
    console.log('xxx', battle);
    battle.attackUnits.forEach(unit => {
        if (unit.dead)
            return;
        unit.movesLeft = 0;
        if (unit.cargoOf > 0)
            unit.cargoOf = 0;
        unit.dice = [];
        var unitHits = 0;
        var numAtt = unit.numAtt;
        if (isArtillery(unit) && battle.seaBattleFlg)
            numAtt = 3;
        for (var x = 0; x < numAtt; x++) {
            var diceRoll = Math.floor((Math.random() * 6) + 1);
            if (diceRoll <= unit.att) {
                unit.dice.push('diceh' + diceRoll + '.png');
                if (stratFlg)
                    unitHits = 1;
                else
                    unitHits++;
                if (unit.piece == 5 || unit.piece == 21 || unit.piece == 47)
                    unitGetsInstantKill(unit, battle);
                else
                    battle.attTargets.push(unit.target);
            }
            else
                unit.dice.push('dice' + diceRoll + '.png');
        }
        battle.attHits += unitHits;
        if (unit.piece == 43 && battle.numDefDroneKillers > 0) {
            battle.numDefDroneKillers--;
            unit.dead = true; // kill drone
            battle.attCasualties.push(43);
        }
    });
}

function specialUnitsFire(battle) {
    var updateFlg = false;
    battle.attackUnits.forEach(unit => {
        if (unit.piece == 41) {
            hijackerAttacks(battle);
            updateFlg = true;
        }
        if (unit.piece == 10 && unit.nation == 4) {
            japGeneralAttacks(battle);
            updateFlg = true;
        }
        if (unit.piece == 10 && unit.nation == 6) {
            mefGeneralAttacks(battle);
            updateFlg = true;
        }
    });
    if (updateFlg) {
        attackUnits = [];
        battle.attackUnits.forEach(unit => {
            if (!unit.dead && unit.owner == battle.attacker)
                attackUnits.push(unit);
        });
        battle.attackUnits = attackUnits;

        defendingUnits = [];
        battle.defendingUnits.forEach(unit => {
            if (!unit.dead && unit.owner != battle.attacker)
                defendingUnits.push(unit);
            if (unit.dead)
                battle.defCasualties.push(unit.piece);
        });
        battle.defendingUnits = defendingUnits;
    }
}
function mefGeneralAttacks(battle) {
    var targetUnit;
    battle.defendingUnits.forEach(function (unit) {
        if (!targetUnit && !unit.dead && unit.owner != battle.attacker && (unit.type == 2 || unit.type == 4)) {
            targetUnit = unit;
        }
    });
    if (!targetUnit) {
        battle.defendingUnits.forEach(function (unit) {
            if (!targetUnit && !unit.dead && unit.owner != battle.attacker && unit.subType == 'vehicle') {
                targetUnit = unit;
            }
        });
    }
    if (!targetUnit) {
        battle.defendingUnits.forEach(function (unit) {
            if (!targetUnit && !unit.dead && unit.owner != battle.attacker && unit.subType == 'soldier') {
                targetUnit = unit;
            }
        });
    }
    if (targetUnit) {
        battle.generalUnit = targetUnit.piece;
        targetUnit.dead = true;
    }
}
function japGeneralAttacks(battle) {
    var targetUnit;
    battle.defendingUnits.forEach(function (unit) {
        if (!targetUnit && !unit.dead && unit.owner != battle.attacker && unit.subType == 'soldier') {
            targetUnit = unit;
        }
    });
    if (targetUnit) {
        battle.generalUnit = targetUnit.piece;
        targetUnit.owner = battle.attacker;
        targetUnit.nation = battle.attacker;
        battle.defCasualties.push(targetUnit.piece);
    }
}
function unitGetsInstantKill(unit, battle) {
    var targetHash = {};
    targetHash[unit.target] = 1;
    markPlanesAsDead(battle.defendingUnits, targetHash);
    markTanksAsDead(battle.defendingUnits, targetHash);
    markRemainerAsDead(battle.defendingUnits, targetHash);
}
function markSoliderAsDead(battle) {
    for (var x = 0; x < battle.defendingUnits.length; x++) {
        var unit = battle.defendingUnits[x];
        if (!unit.dead && unit.subType == 'soldier') {
            unit.dead = true;
            return 1;
        }
    }
    return 0;
}
function rollDefenderDice(battle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData) {
    battle.defHits = 0;
    battle.defTargets = [];
    battle.defendingUnits.forEach(unit => {
        if (unit.dead)
            return;
        var diceRoll = Math.floor((Math.random() * 6) + 1);
        var cpuHits = battle.defHits + battle.attCasualties.length;
        if (selectedTerritory.owner == 0 && !selectedTerritory.capital && cpuHits > 2) {
            diceRoll = 6; // make sure neutrals don't do too much damage
        }
        if (diceRoll <= unit.def) {
            unit.dice = ['diceh' + diceRoll + '.png'];
            battle.defHits++;
            battle.defTargets.push(unit.target);
        }
        else
            unit.dice = ['dice' + diceRoll + '.png'];
    });
    if (battle.round == 1)
        removeArtilleryUnits(battle);
    markCasualties(battle);

    battle.phase = 3;
    battle.militaryObj = getBattleAnalysis(battle, selectedTerritory, currentPlayer, gameObj);
    if (!battle.militaryObj.battleInProgress)
        battleCompleted(battle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData);


}
function removeArtilleryUnits(battle) {
    attackUnits = [];
    battle.attackUnits.forEach(unit => {
        if (!unit.returnFlg)
            attackUnits.push(unit);
    });
    battle.attackUnits = attackUnits;
}
function markPlanesAsDead(units, targetHash) {
    units.forEach(unit => {
        if (unit.dead)
            return;
        if ((unit.type == 2 || unit.type == 4) && targetHash['planesTanks'] > 0) {
            targetHash['planesTanks']--;
            unit.dead = true;
            return;
        }
        if ((unit.type == 2 || unit.type == 4) && targetHash['planes'] > 0) {
            targetHash['planes']--;
            unit.dead = true;
            return;
        }
    });
}
function markTanksAsDead(units, targetHash) {
    units.forEach(unit => {
        if (unit.dead)
            return;
        if ((unit.piece == 1 || unit.piece == 3) && targetHash['planesTanks'] > 0) {
            targetHash['planesTanks']--;
            unit.dead = true;
            return;
        }
        if ((unit.piece == 1 || unit.piece == 3) && targetHash['vehicles'] > 0) {
            targetHash['vehicles']--;
            unit.dead = true;
            return;
        }
    });
}
function markRemainerAsDead(units, targetHash) {
    units.forEach(unit => {
        if (unit.dead)
            return;
        if (unit.type == 3 && targetHash['noplanes'] > 0) {
            targetHash['noplanes']--;
            unit.dead = true;
            return;
        }
        if ((unit.subType == 'transport' || unit.subType == 'vehicle' || unit.type == 2 || unit.type == 4) && targetHash['kamakazi'] > 0) {
            targetHash['kamakazi']--;
            unit.dead = true;
            return;
        }
        if (unit.subType == 'soldier' && targetHash['soldierOnly'] > 0) {
            targetHash['soldierOnly']--;
            unit.dead = true;
            return;
        }
        if (targetHash['default'] > 0) {
            targetHash['default']--;
            unit.dead = true;
            return;
        }
        if (targetHash['planesTanks'] > 0) {
            targetHash['planesTanks']--;
            unit.dead = true;
            return;
        }
        if (targetHash['vehicles'] > 0) {
            targetHash['vehicles']--;
            unit.dead = true;
            return;
        }
        if (targetHash['planes'] > 0) {
            targetHash['planes']--;
            unit.dead = true;
            return;
        }
        if (unit.subType != 'hero' && targetHash['nuke'] > 0) {
            targetHash['nuke']--;
            unit.dead = true;
            return;
        }
    });
}
function markCasualties(battle) {
    var logging = false;
    if (logging) {
        console.log('---------markCasualties------')
        console.log(battle.defTargets);
        console.log(battle.attTargets);
        console.log(battle.attHits);
        console.log(battle.defHits);

    }
    //------------attacking units hit by defenders  
    var targetHash = {};
    battle.defTargets.forEach(target => {
        if (battle.attSBSHps > 0) {
            battle.attSBSHps--;
            addAPointOfDamageToSbs(battle.attackUnits);
            return;
        }
        if (battle.attActiveMedics > 0) {
            battle.attActiveMedics--;
            var healedFlg = healInfantryByMedic(battle.attackUnits);
            if (healedFlg) {
                battle.attSoldiersHealed++;
                return;
            }
        }
        if (!targetHash[target])
            targetHash[target] = 0;
        targetHash[target]++;
    });
    var hits = battle.defHits;
    markPlanesAsDead(battle.attackUnits, targetHash);
    markTanksAsDead(battle.attackUnits, targetHash);
    markRemainerAsDead(battle.attackUnits, targetHash);

    //-------------------defending units hit by attackers 
    targetHash = {};
    battle.attTargets.forEach(target => {
        if (battle.defSBSHps > 0) {
            battle.defSBSHps--;
            addAPointOfDamageToSbs(battle.defendingUnits);
            return;
        }
        if (battle.defActiveMedics > 0) {
            battle.defActiveMedics--;
            var healedFlg = healInfantryByMedic(battle.defendingUnits);
            if (healedFlg) {
                battle.defSoldiersHealed++;
                return;
            }
        }
        if (!targetHash[target])
            targetHash[target] = 0;
        targetHash[target]++;
    });

    hits = battle.attHits;
    markPlanesAsDead(battle.defendingUnits, targetHash);
    markTanksAsDead(battle.defendingUnits, targetHash);
    markRemainerAsDead(battle.defendingUnits, targetHash);
}
function healInfantryByMedic(units) {
    var healedFlg = false;
    units.forEach(unit => {
        if (unit.subType == 'soldier')
            healedFlg = true;
    });
    return healedFlg;
}
function addAPointOfDamageToSbs(units) {
    console.log('remove defSBSHps sbs hp!!!');
    var hit = 1;
    units.forEach(unit => {
        if (hit > 0 && unit.piece == 12 && unit.damage < 2) {
            hit--;
            unit.damage++;
        }
    });
}
function removeCasualties(battle, gameObj, player, finalFlg, superpowersData) {
    if (battle.round == 0)
        return;

    if (!battle.attCasualties)
        battle.attCasualties = [];
    if (!battle.defCasualties)
        battle.defCasualties = [];
    var attackUnits = [];
    battle.attackUnits.forEach(unit => {
        if (unit.dead) {
            battle.attCasualties.push(unit.piece);
            if (unit.piece == 10 || unit.piece == 11) {
                if (unit.owner == 1)
                    removeAllSeals(gameObj);
                logItem(gameObj, player, 'Hero Killed', superpowersData.superpowers[unit.owner] + ' ' + unit.name + ' killed!', '', 0, player.nation);
            }
        } else
            attackUnits.push(unit);
    });
    if (!finalFlg)
        battle.attackUnits = attackUnits;
    var defendingUnits = [];
    battle.defendingUnits.forEach(unit => {
        if (unit.dead) {
            battle.defCasualties.push(unit.piece);
            if (unit.piece == 10 || unit.piece == 11) {
                if (unit.owner == 1)
                    removeAllSeals(gameObj);
                logItem(gameObj, player, 'Hero Killed', superpowersData.superpowers[unit.owner] + ' ' + unit.name + ' killed!', '', 0, battle.defender);
            }
        } else
            defendingUnits.push(unit);
    });
    if (!finalFlg)
        battle.defendingUnits = defendingUnits;
}
function removeAllSeals(gameObj) {
    gameObj.units.forEach(unit => {
        if (unit.piece == 44)
            unit.dead = true;
    });
}
function nukeBattleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData, cruiseFlg) {
    var title = (cruiseFlg) ? 'Cruise Attack!' : 'Nuke Attack!';
    var weaponType = (cruiseFlg) ? ' missiled! ' : ' nuked! ';
    displayBattle.round = 1;
    wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, title, selectedTerritory, moveTerr, 1500, weaponType);
}
function battleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData) {
    if (displayBattle.militaryObj.wonFlg) {
        selectedTerritory.defeatedByNation = currentPlayer.nation;
        selectedTerritory.defeatedByRound = gameObj.round;
        transferControlOfTerr(selectedTerritory, currentPlayer, gameObj, true);
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
    if (!currentPlayer.cpuFlg && displayBattle.militaryObj.wonFlg && displayBattle.allowGeneralRetreat) {
        localStorage.generalTerr2 = selectedTerritory.id;
        displayFixedPopup('generalWithdrawPopup');
        $('#territoryPopup').modal('hide');
    }
}
function wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, title, selectedTerritory, moveTerr, delay = 0, weaponType = '') {
    removeCasualties(displayBattle, gameObj, currentPlayer, true, superpowersData);

    if (displayBattle.bonusUnitsFlg && displayBattle.militaryObj.wonFlg && currentPlayer.cpuFlg) {
        if (selectedTerritory.capital) {
            addNewUnitToBoard(gameObj, selectedTerritory, 15, superpowersData);
            playSound('Swoosh.mp3');
        } else {
            addNewUnitToBoard(gameObj, selectedTerritory, 2, superpowersData);
            addNewUnitToBoard(gameObj, selectedTerritory, 2, superpowersData);
            addNewUnitToBoard(gameObj, selectedTerritory, 3, superpowersData);
            playSound('Swoosh.mp3');
            setTimeout(() => { playSound('Swoosh.mp3'); }, 100);
            setTimeout(() => { playSound('Swoosh.mp3'); }, 200);
        }
    }

    var units = [];
    gameObj.units.forEach(function (unit) {
        if (!unit.dead)
            units.push(unit);
    });
    gameObj.units = units;

    if (displayBattle.militaryObj.wonFlg) {
        illuminateThisTerritory(selectedTerritory, gameObj);
        if (selectedTerritory.nation == 99)
            squareUpAllCargo(displayBattle.attackUnits, gameObj);
    }

    moveTerr.forEach(function (terr) {
        refreshTerritory(terr, gameObj, currentPlayer, superpowersData, null);
    });

    var hits = displayBattle.defCasualties.length;
    var losses = displayBattle.attCasualties.length;
    if (currentPlayer.nation > 0) {
        currentPlayer.kills += hits;
        currentPlayer.losses += losses;
        currentPlayer.kd = getKdForPlayer(currentPlayer);
    }
    if (displayBattle.militaryObj.wonFlg && gameObj.round == gameObj.attack)
        currentPlayer.attackFlg = true;
    addIncomeForPlayer(currentPlayer, gameObj);

    if (displayBattle.defender > 0) {
        var p2 = playerOfNation(displayBattle.defender, gameObj);
        if (displayBattle.militaryObj.wonFlg && gameObj.round == gameObj.attack)
            p2.defenseFlg = true;
        addIncomeForPlayer(p2, gameObj);
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
    if (weaponType == 'bomb')
        msg = selectedTerritory.name + ' bombed. ' + hits + ' factories destroyed, ' + losses + ' bombers shot down.';
    if (displayBattle.round == 0)
        displayBattle.round = 1
    var medicHealedCount = displayBattle.attSoldiersHealed + displayBattle.defSoldiersHealed;
    logItem(gameObj, currentPlayer, title, msg, displayBattle.battleDetails + '|' + displayBattle.attCasualties.join('+') + '|' + displayBattle.defCasualties.join('+') + '|' + medicHealedCount + '|' + displayBattle.round, selectedTerritory.id, displayBattle.defender, '', '', displayBattle.defender);
    //console.log('displayBattle', displayBattle);
    setTimeout(() => {
        refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, null);
    }, delay);
}
function squareUpAllCargo(units, gameObj) {
    units.forEach(function (transport) {
        if (!transport.dead && transport.cargo && transport.cargo.length > 0) {
            var cargo = [];
            var cargoUnits = 0;
            transport.cargo.forEach(function (cargoUnit) {
                var gameUnit = moveCargoUnitToTerr(transport, cargoUnit, gameObj);
                if (gameUnit) {
                    cargoUnits += cargoUnit.cargoUnits;
                    cargo.push(cargoUnit);
                }

            });
            transport.cargo = cargo;
            transport.cargoUnits = cargoUnits;
        }
    });
}
function moveCargoUnitToTerr(transport, cargoUnit, gameObj) {
    var gameUnit;
    gameObj.units.forEach(function (unit) {
        if (unit.id == cargoUnit.id) {
            if (unit.owner == transport.owner) {
                gameUnit = unit;
                unit.terr = transport.terr;
                unit.cargoOf = transport.id;
            } else {
                showAlertPopup('killing cargo!');
                unit.dead = true;
            }
        }
    });
    return gameUnit;
}
function getKdForPlayer(player) {
    if (player.losses > 0)
        return (player.kills / player.losses).toFixed(1);
    else
        return 0;
}
function transferControlOfTerr(terr, player, gameObj, annihilationFlg) {
    var nation = player.nation;
    if (gameObj.allowAlliances && player.allies.length > 0 && player.treaties.length >= 8) {
        if (player.treaties[terr.nation - 1] == 3)
            nation = terr.nation; //liberateNationIfNeccessary
    }

    terr.owner = nation;
    terrUnits = [];
    gameObj.units.forEach(function (unit) {
        if (unit.terr == terr.id && unit.piece != 44) { //seals exempt
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
function allowHostileAct(type, terr, player, gameObj) {
    var obj = hostileActObj(type, terr, gameObj, player);
    if (!obj.allowFlg) {
        showAlertPopup(obj.message, 1);
    }
    return obj.allowFlg;
}
function populateHostileMessage(type, terr, gameObj, player) {
    var obj = hostileActObj(type, terr, gameObj, player);
    return obj.message;
}
function hostileActObj(type, terr, gameObj, player) {
    var message = '';
    var allowFlg = true;
    var hostileType = (type == 'attack' || type == 'nuke' || type == 'cruise' || type == 'bomb');

    if (terr.defeatedByNation == player.nation && terr.defeatedByRound == gameObj.round) {
        message = "This territory has just been conquered.";
        allowFlg = false;
    }
    if (terr.attackedByNation == player.nation && terr.attackedRound == gameObj.round) {
        message = "This territory has already been attacked.";
        allowFlg = terr.nation == 99;
    }
    //   if (type == 'movement' && terr.defeatedByNation == player.nation && terr.defeatedByRound == gameObj.round) {
    //       message = 'Can\'t move into territories just defeated.';
    //       allowFlg = false;
    //   }
    if (terr.owner > 0 && gameObj.round < gameObj.attack && terr.treatyStatus <= 2) {
        message = 'Players cannot be attacked until round ' + gameObj.attack + '.';
        allowFlg = false;
    }
    if (hostileType) {
        if (terr.owner == 0 && terr.capital && terr.nation < 99 && player.capitals.length > 1 && gameObj.round < gameObj.attack) {
            message = 'You can only take over one capital before round 6.';
            allowFlg = false;
        }
        var cost = costToAttack(terr, player);
        if (cost > 0) {
            var treatyName = 'non-agression pact';
            if (cost == 10)
                treatyName = 'peace treaty';
            if (cost == 15)
                treatyName = 'alliance';
            if (terr.treatyStatus == 0)
                message = 'This will cost you ' + cost + ' coins to attack, because you were not at war at the beginning of the turn. You can attack for free next turn.';
            else
                message = 'This will cost you ' + cost + ' coins to break the ' + treatyName + '! Alternatively, you can declare war this turn and then attack for free next turn.';
        }
        if (type == 'bomb' && terr.bombed) {
            message = 'This country has already been bombed.';
            allowFlg = false;
        }
        if (terr.attackedByNation == player.nation && terr.attackedRound == gameObj.round) {
            message = 'Can\'t attack the same territory twice.';
            allowFlg = false;
        }
        if (terr.owner > 0 && gameObj.round < gameObj.attack) {
            message = 'You can\'t attack other players, or be attacked until round ' + gameObj.attack + '.';
            allowFlg = false;
        }
        if (terr.owner > 0 && gameObj.round == gameObj.attack) {
            var p2 = playerOfNation(terr.owner, gameObj);
            if (player.attackFlg) {
                message = 'Limited attack round: You are only allowed to take over 1 enemy territory on this round.';
                allowFlg = false;
            }
            if (p2.defenseFlg) {
                message = 'Limited attack round: This player has already lost a territory on this round.';
                allowFlg = false;
            }
        }
    }
    return { message: message, allowFlg: allowFlg }
}