function initializeBattle(attackPlayer, selectedTerritory, attackUnits, gameObj, stratBombFlg = false, cruiseFlg = false) {
    if (!attackPlayer) {
        console.log('whoa!!!');
    }
    var displayBattle = {
        stratBombFlg: stratBombFlg,
        cruiseFlg: cruiseFlg,
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
        destoryerIncludedFlg: false,
        militaryMessage: '',
        defender: selectedTerritory.owner,
        attacker: attackPlayer.nation,
        militaryObj: {},
        battleDetails: '',
        cruiseFlg: cruiseFlg,
        seaBattleFlg: (selectedTerritory.nation == 99),
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
    var destoryerIncludedFlg = false;
    selectedTerritory.units.forEach(unit => {
        if (unit.owner != attackPlayer.nation && isUnitOkToDefend(unit)) {
            if (defenseUnitOkForType(unit, stratBombFlg, displayBattle.seaBattleFlg, fighterDefenseFlg)) {
                unit.dice = [];
                var numDef = unit.numDef || 1;
                for (var i = 0; i < numDef; i++)
                    unit.dice.push('dice.png');
                if (selectedTerritory.id == 8 && selectedTerritory.owner == 0)
                    unit.def = 1; // france sucks
                defendingUnits.push(unit);
                if (unit.piece == 12)
                    defSBSHps += unit.bcHp - unit.damage - 1;
                if (unit.piece == 28)
                    defActiveMedics++;
                if (unit.piece == 27)
                    destoryerIncludedFlg = true;
                if (unit.targetDroneFlg)
                    numDefDroneKillers++;
            }
        }
    });
    displayBattle.numDefDroneKillers = numDefDroneKillers;
    displayBattle.defSBSHps = defSBSHps;
    displayBattle.defActiveMedics = defActiveMedics;
    displayBattle.destoryerIncludedFlg = destoryerIncludedFlg;

    var attSBSHps = 0;
    var attActiveMedics = 0;
    var nukeFlg = false;
    var empFlg = false;
    var numAttDrones = 0;
    attackUnits.forEach(unit => {
        if (unit.piece == 14 || unit.piece == 52)
            nukeFlg = true;
        if (cruiseFlg)
            unit.didAttackFlg = true;
        if (unit.piece == 28)
            attActiveMedics++;
        if (unit.piece == 43)
            numAttDrones++;
        if (unit.piece == 52)
            empFlg = true;
        if (unit.piece == 12)
            attSBSHps += unit.bcHp - unit.damage - 1;
        if (unit.cargoOf > 0) {
            displayBattle.allowRetreat = false;
            var transport = findUnitOfId(unit.cargoOf, gameObj);
            if (transport && transport.subType == 'transport') {
                transport.movesLeft = 0;
            }
        }

        if (unit.piece == 10) {
            localStorage.generalTerr1 = unit.terr;
            displayBattle.allowGeneralRetreat = true;
            if (unit.cargoOf > 0)
                displayBattle.allowGeneralRetreat = false;
        }
    });
    displayBattle.numAttDrones = numAttDrones;
    displayBattle.nukeFlg = nukeFlg;
    displayBattle.empFlg = empFlg;
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
    //   getBattleAnalysis(displayBattle, selectedTerritory, attackPlayer, gameObj)
    return displayBattle;

}
function reorderAttackUnitsSoLandUnitRemains(attackUnits) {
    units = [];
    highestLandId = 0;
    highestLandCas = 0;
    attackUnits.forEach(unit => {
        if ((unit.type == 1 || unit.type == 4) && !unit.returnFlg && unit.cas > highestLandCas) {
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
function startBattle(terr, player, gameObj, superpowersData, battle) {
    var cost = costToAttack(terr, player);
    if (cost > 0 && gameObj.round < gameObj.attack) {
        showAlertPopup('Whoa can\'t attack this turn!', 1);
        console.log('bad attack!!', terr.name);
        return;
    }
    battle.attackUnits.forEach(unit => {
        if (unit.cargo && unit.cargo.length > 0) {
            unit.cargo.forEach(cargoUnit => {
                console.log('moving', cargoUnit);
                var u = findUnitOfId(cargoUnit.id, gameObj);
                u.terr = terr.id;
            });
        }
    });


    if (cost > 0) {
        var p2 = playerOfNation(terr.owner, gameObj);
        changeTreaty(player, p2, 0, gameObj, superpowersData, cost);
    }
    if (!battle.stratBombFlg) {
        terr.attackedByNation = player.nation;
        terr.attackedRound = gameObj.round;
    }
    terr.leaderMessage = ''; //needed to make advisor go away
    return cost;
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
function defenseUnitOkForType(unit, stratBombFlg, seaBattleFlg, fighterDefenseFlg) {
    if (stratBombFlg && (!fighterDefenseFlg || unit.subType != 'fighter'))
        return false;
    if (seaBattleFlg && unit.type == 1 && unit.piece != 10)
        return false;
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
        if (unit.subType == 'soldier' || unit.id == 46 || unit.id == 51)
            unit.att = unit.att2;
        if (unit.piece == 3 || unit.piece == 46)
            unit.att = unit.att2;
        if (unit.piece == 50)
            unit.numAtt = 1;
        if (includesGeneral) {
            if (unit.subType == 'soldier' || unit.id == 46 || unit.id == 51)
                unit.att = unit.att2 + 1;
            if (unit.piece == 50) //cobra
                unit.numAtt = 2;
            if (player.nation == 3 && (unit.piece == 3 || unit.piece == 46))
                unit.att = unit.att2 + 1;
            if (player.nation == 1 && unit.piece == 2)
                unit.att = 3;
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

        if (numAttUnits > 0 && airunits == numAttUnits && numDefSubs == numDefUnits && numDefSubs > 0) {
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
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj);
    if (battle.empFlg)
        playSound('shock.mp3');
    else
        playSound('tornado.mp3');
    startBattle(targetTerr, player, gameObj, superpowersData, battle);
    targetTerr.nuked = true;
    battle.attHits = battle.militaryObj.expectedHits;
    var expectedHits = maximumPossibleNukeHitsForTerr(targetTerr, player, gameObj);
    console.log('***NUKE***', targetTerr.name, expectedHits);
    battle.defHits = attackUnits.length;
    addhitsToList(battle.defTargets, 'default', battle.defHits);
    addhitsToList(battle.attTargets, 'nuke', battle.attHits);
    markCasualties(battle, gameObj);
    nukeBattleCompleted(battle, targetTerr, player, launchTerritories, gameObj, superpowersData, false);
    return battle;
}
function landTheCruiseBattle(player, targetTerr, attackUnits, gameObj, superpowersData) {
    playSound('bomb2.mp3');
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj, false, true);
    startBattle(targetTerr, player, gameObj, superpowersData, battle);
    battle.attHits = battle.militaryObj.expectedHits;
    battle.defHits = 0;
    var target = 'default';
    if (player.tech[9])
        target = 'vehicles';
    addhitsToList(battle.attTargets, target, battle.attHits);
    markCasualties(battle, gameObj);
    battle.attackUnits.forEach(unit => {
        unit.movesLeft = 0;
    });
    nukeBattleCompleted(battle, targetTerr, player, [], gameObj, superpowersData, true);
    return battle;
}
function strategicBombBattle(player, targetTerr, attackUnits, gameObj, superpowersData) {
    playSound('bombers.mp3');
    var battle = initializeBattle(player, targetTerr, attackUnits, gameObj, true);
    //remove paratroopers
    battle.attackUnits.forEach(unit => {
        unit.cargo = [];
    });
    startBattle(targetTerr, player, gameObj, superpowersData, battle);
    rollAAGuns(battle, targetTerr, gameObj, true);
    removeCasualties(battle, gameObj, player, true, superpowersData);
    rollAttackDice(battle, gameObj, true);

    var hits = battle.attHits;
    for (var x = 0; x < battle.defTargets.length; x++)
        battle.attCasualties.push(7);

    if (battle.defHits > 0)
        playSound('Scream.mp3');

    if (hits > 0) {
        if (targetTerr.factoryCount >= 2) {
            targetTerr.factoryCount = 1;
            var facCount = 0;
            gameObj.units.forEach(unit => {
                if (unit.terr == targetTerr.id && unit.piece == 19)
                    unit.dead = true;
                if (unit.terr == targetTerr.id && unit.piece == 15 && facCount++ > 0)
                    unit.dead = true; // in case extra factory exists
            });
            hits--;
            battle.defCasualties.push(15);
        }
        if (hits > 0) {
            targetTerr.facBombed = true;
            battle.defCasualties.push(15);
        }
    }
    wrapUpBattle(battle, player, gameObj, superpowersData, 'Strategic Bombing', targetTerr, [], 1200, 'bomb');
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
function addAAGunesToBattle(battle, terr, stratBombFlg) {
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
    if (stratBombFlg && terr.defendingFighterId > 0) {
        battle.defendingUnits.forEach(unit => {
            if (unit.subType == 'fighter')
                battle.airDefenseUnits.push({ piece: unit.piece, nation: 1, dice: [] })
        });
    }
}
function startToRollAAGuns(battle, selectedTerritory) {
    addAAGunesToBattle(battle, selectedTerritory);
    battle.airDefenseUnits.forEach(unit => {
        unit.dice.push('dice.png');
    });
}
function rollAAGuns(battle, selectedTerritory, gameObj, stratBombFlg) {
    addAAGunesToBattle(battle, selectedTerritory, stratBombFlg);
    battle.attTargets = [];
    battle.defTargets = [];
    battle.airDefenseUnits.forEach(unit => {
        unit.dice = [];
        var diceRoll = Math.floor((Math.random() * 6) + 1);
        var hitScore = 1;
        if (unit.piece != 13)
            hitScore = 5;
        if (unit.piece == 22)
            hitScore = 3;
        if (diceRoll <= hitScore) {
            unit.dice.push('diceh' + diceRoll + '.png');
            battle.defHits++;
            battle.defTargets.push('planes');
        }
        else
            unit.dice.push('dice' + diceRoll + '.png');
    });
    markCasualties(battle, gameObj);
}
function rollAttackDice(battle, gameObj, stratFlg = false) {
    battle.attHits = 0;
    battle.attTargets = [];
    specialUnitsFire(battle);
    battle.attackUnits.forEach(unit => {
        if (unit.dead)
            return;
        unit.movesLeft = 0;
        unit.didAttackFlg = true;
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
                if ((!battle.destoryerIncludedFlg && unit.piece == 5) || unit.piece == 21 || unit.piece == 47)
                    unitGetsInstantKill(unit, battle, gameObj);
                else
                    battle.attTargets.push(unit.target);
            }
            else
                unit.dice.push('dice' + diceRoll + '.png');
        }
        if (unit.piece == 23 || unit.piece == 25 || unit.piece == 42)
            unit.dead = true;

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

        defendingUnits = [];
        battle.defendingUnits.forEach(unit => {
            if (!unit.dead) {
                if (unit.owner == battle.attacker)
                    attackUnits.push(unit);
                else
                    defendingUnits.push(unit);
            }
            if (unit.dead)
                battle.defCasualties.push(unit.piece);
        });
        battle.defendingUnits = defendingUnits;
        battle.attackUnits = attackUnits;
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
function hijackerAttacks(battle) {
    var targetUnit;
    battle.defendingUnits.forEach(function (unit) {
        if (!targetUnit && !unit.dead && unit.owner != battle.attacker && (unit.type == '2' || unit.type == '4')) {
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
    if (targetUnit) {
        battle.hijackerUnit = targetUnit.piece;
        targetUnit.owner = battle.attacker;
        targetUnit.nation = battle.attacker;
        battle.defCasualties.push(targetUnit.piece);
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
function unitGetsInstantKill(unit, battle, gameObj) {
    var targetHash = {};
    targetHash[unit.target] = 1;
    markPlanesAsDead(battle.defendingUnits, targetHash);
    markTanksAsDead(battle.defendingUnits, targetHash);
    markRemainerAsDead(battle.defendingUnits, targetHash, gameObj);
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
        unit.dice = [];
        var numDef = unit.numDef || 1;
        for (var x = 0; x < numDef; x++) {
            var diceRoll = Math.floor((Math.random() * 6) + 1);
            var cpuHits = battle.defHits + battle.attCasualties.length;
            if (selectedTerritory.owner == 0 && !selectedTerritory.capital && cpuHits > 2) {
                diceRoll = 6; // make sure neutrals don't do too much damage
            }
            if (battle.attNation == 4 && battle.round == 1 && battle.generalUnit > 0 && battle.defender == 0 && battle.bonusUnitsFlg && battle.defendingUnits.length == 2 && battle.defHits > 0)
                diceRoll = 6; // don't let general die!
            if (diceRoll <= unit.def) {
                unit.dice.push('diceh' + diceRoll + '.png');
                battle.defHits++;
                battle.defTargets.push(unit.target);
            }
            else
                unit.dice.push('dice' + diceRoll + '.png');
        }
    });
    if (battle.round == 1)
        removeArtilleryUnits(battle);
    markCasualties(battle, gameObj);

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
        if (unit.subType == 'vehicle' && targetHash['vehicles2'] > 0) {
            targetHash['vehicles2']--;
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
function sinkCargo(unit, gameObj) {
    if (!gameObj)
        console.log('!!! no gameObj sent to sinkCargo');
    if (unit.cargo && unit.cargo.length > 0) {
        unit.cargo.forEach(cargoUnit => {
            var cargo = findUnitOfId(cargoUnit.id, gameObj);
            if (cargo)
                cargo.dead = true;
        });
    }
}
function unitCannotBeHealed(battle, unit) {
    if (!battle || unit.subType != 'soldier')
        return true;

    if (battle && battle.defActiveMedics > 0) {
        battle.defActiveMedics--;
        var healedFlg = healInfantryByMedic(battle.defendingUnits);
        if (healedFlg) {
            battle.defSoldiersHealed++;
            return false;
        }
    }
    return true;
}
function markRemainerAsDead(units, targetHash, gameObj, battle) {
    units.forEach(unit => {
        if (unit.dead)
            return;

        if (unit.type == 3 && targetHash['noplanes'] > 0) {
            targetHash['noplanes']--;
            unit.dead = true;
            sinkCargo(unit, gameObj);
            return;
        }
        if ((unit.subType == 'transport' || unit.subType == 'vehicle' || unit.type == 2 || unit.type == 4) && targetHash['kamakazi'] > 0) {
            targetHash['kamakazi']--;
            unit.dead = true;
            sinkCargo(unit, gameObj);
            return;
        }
        if (unit.subType == 'soldier' && targetHash['soldierOnly'] > 0) {
            targetHash['soldierOnly']--;
            if (unitCannotBeHealed(battle, unit))
                unit.dead = true;
            return;
        }
        if (targetHash['default'] > 0) {
            targetHash['default']--;
            if (unitCannotBeHealed(battle, unit))
                unit.dead = true;
            sinkCargo(unit, gameObj);
            return;
        }
        if (targetHash['planesTanks'] > 0) {
            targetHash['planesTanks']--;
            if (unitCannotBeHealed(battle, unit))
                unit.dead = true;
            return;
        }
        if (targetHash['vehicles2'] > 0) {
            targetHash['vehicles2']--;
            if (unitCannotBeHealed(battle, unit))
                unit.dead = true;
            return;
        }
        if (targetHash['vehicles'] > 0) {
            targetHash['vehicles']--;
            if (unitCannotBeHealed(battle, unit))
                unit.dead = true;
            return;
        }
        if (targetHash['planes'] > 0) {
            targetHash['planes']--;
            if (unitCannotBeHealed(battle, unit))
                unit.dead = true;
            return;
        }
        if (unit.subType != 'hero' && targetHash['nuke'] > 0) {
            targetHash['nuke']--;
            unit.dead = true;
            sinkCargo(unit, gameObj);
            return;
        }
    });
}
function markCasualties(battle, gameObj) {
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
    markRemainerAsDead(battle.attackUnits, targetHash, gameObj);

    //-------------------defending units hit by attackers 
    targetHash = {};
    battle.attTargets.forEach(target => {
        if (battle.defSBSHps > 0) {
            battle.defSBSHps--;
            addAPointOfDamageToSbs(battle.defendingUnits);
            return;
        }

        if (!targetHash[target])
            targetHash[target] = 0;
        targetHash[target]++;
    });

    hits = battle.attHits;
    markPlanesAsDead(battle.defendingUnits, targetHash);
    markTanksAsDead(battle.defendingUnits, targetHash);

    markRemainerAsDead(battle.defendingUnits, targetHash, gameObj, battle);
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
    var heroKilledFlg = false;
    battle.attackUnits.forEach(unit => {
        if (unit.dead) {
            battle.attCasualties.push(unit.piece);
            if (unit.piece == 10 || unit.piece == 11) {
                if (unit.owner == 1)
                    removeAllSeals(gameObj);
                heroKilledFlg = true;
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
                heroKilledFlg = true;
                logItem(gameObj, player, 'Hero Killed', superpowersData.superpowers[unit.owner] + ' ' + unit.name + ' killed!', '', 0, battle.defender);
            }
        } else
            defendingUnits.push(unit);
    });
    if (!finalFlg)
        battle.defendingUnits = defendingUnits;
    if (heroKilledFlg) {
        setTimeout(() => { playSound('torture.mp3'); }, 2500);
    }
}
function removeAllSeals(gameObj) {
    gameObj.units.forEach(unit => {
        if (unit.piece == 44)
            unit.dead = true;
    });
}
function nukeBattleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData, cruiseFlg) {
    var title = (cruiseFlg) ? 'Cruise Attack!' : 'Nuke Attack!';
    if (displayBattle.empFlg)
        title = 'EMP Blast!';
    var weaponType = (cruiseFlg) ? ' missiled! ' : ' nuked! ';
    displayBattle.round = 1;
    wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, title, selectedTerritory, moveTerr, 1500, weaponType);
}
function battleCompleted(displayBattle, selectedTerritory, currentPlayer, moveTerr, gameObj, superpowersData) {
    if (selectedTerritory.nation < 99 && displayBattle.militaryObj.wonFlg && selectedTerritory.owner > 0 && gameObj.round == gameObj.attack && selectedTerritory.defeatedByRound != gameObj.round)
        currentPlayer.attackFlg = true;
    if (displayBattle.militaryObj.wonFlg) {
        transferControlOfTerr(selectedTerritory, currentPlayer.nation, gameObj, true, currentPlayer);
        if (!currentPlayer.cpu) {
            if (displayBattle.defHits == 0)
                playVoiceClip('won6.mp3');
            else
                playVoiceSound(71 + Math.floor((Math.random() * 5)));
        }
        displayBattle.attackUnits.forEach(function (unit) {
            if (unit.type != 2 && !unit.returnFlg)
                unit.terr = selectedTerritory.id;
        });
    } else {
        if (!currentPlayer.cpu)
            playVoiceSound(81 + Math.floor((Math.random() * 2)));
    }
    wrapUpBattle(displayBattle, currentPlayer, gameObj, superpowersData, 'Battle', selectedTerritory, moveTerr);
    currentPlayer.battleFlg = true;
    if (!currentPlayer.cpu && currentPlayer.nation == 6 && !displayBattle.militaryObj.wonFlg)
        removeAnyConvertedUnits(displayBattle, selectedTerritory.id);
    if (!currentPlayer.cpuFlg && displayBattle.militaryObj.wonFlg && displayBattle.allowGeneralRetreat) {
        var generalRetreatObj = { gameId: gameObj.id, terrId1: numberVal(localStorage.generalTerr1), terrId2: selectedTerritory.id };
        localStorage.generalRetreatObj = JSON.stringify(generalRetreatObj);
        displayFixedPopup('generalWithdrawPopup');
        $('#territoryPopup').modal('hide');
    }
}
function removeAnyConvertedUnits(displayBattle, terrId) {
    displayBattle.attackUnits.forEach(unit => {
        if (unit.owner == 6 && unit.terr == terrId) {
            console.log('kill unit!');
            unit.dead = true;
        }
    });
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
    addIncomeForPlayer(currentPlayer, gameObj);

    if (displayBattle.defender > 0) {
        var p2 = playerOfNation(displayBattle.defender, gameObj);
        if (displayBattle.militaryObj.wonFlg) {
            if (gameObj.round == gameObj.attack && selectedTerritory.nation < 99 && selectedTerritory.defeatedByRound != gameObj.round)
                p2.defenseFlg = true;
            selectedTerritory.defeatedByNation = currentPlayer.nation;
            selectedTerritory.defeatedByRound = gameObj.round;
        }
        addIncomeForPlayer(p2, gameObj);
        p2.kills += losses;
        p2.losses += hits;
        p2.kd = getKdForPlayer(p2);
    }

    var unit1 = (losses == 1) ? 'unit' : 'units';
    var unit2 = (hits == 1) ? 'unit' : 'units';
    var word = displayBattle.militaryObj.wonFlg ? 'defeating ' : 'in failed attack on ';
    var msg = losses + ' ' + unit1 + ' lost ' + word + ' ' + superpowersData.superpowers[displayBattle.defender] + ' at ' + selectedTerritory.name + '. Enemy lost ' + hits + ' ' + unit2 + '.' + displayBattle.militaryObj.endPhrase;
    if (weaponType.length > 0)
        msg = selectedTerritory.name + weaponType + hits + ' casualties.';
    if (weaponType == 'bomb')
        msg = selectedTerritory.name + ' bombed. ' + hits + ' factories destroyed, ' + losses + ' bombers shot down.';
    if (displayBattle.round == 0)
        displayBattle.round = 1
    var medicHealedCount = displayBattle.attSoldiersHealed + displayBattle.defSoldiersHealed;
    logItem(gameObj, currentPlayer, title, msg, displayBattle.battleDetails + '|' + displayBattle.attCasualties.join('+') + '|' + displayBattle.defCasualties.join('+') + '|' + medicHealedCount + '|' + displayBattle.round, selectedTerritory.id, displayBattle.defender, '', '', displayBattle.defender);

    if (!displayBattle.militaryObj.wonFlg)
        saveGame(gameObj, null, currentPlayer);
    //console.log('displayBattle', displayBattle);
    setTimeout(() => {
        refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, null);
    }, delay);
}
function fixSeaCargo(terr, gameObj) {
    if (terr.unloadedCargo && terr.unloadedCargo.length > 0) {
        terr.unloadedCargo.forEach(function (fighterUnit) {
            findTransportForThisCargo(fighterUnit, terr, gameObj);
        });
    }
    /*
    terr.units.forEach(function (cargoUnit) {
        if (cargoUnit.cargoOf && cargoUnit.cargoOf > 0) {
            var gameUnit = findUnitOfId(cargoUnit.cargoOf, gameObj);
            if (!gameUnit || gameUnit.terr != terr.id) {
                findTransportForThisCargo(cargoUnit, terr, gameObj);
            }
        }
    });
    */
}
function fixCargoOnTerr(strandedCargo, terr, gameObj) {
    console.log('fixCargoOnTerr', terr.name);
    strandedCargo.forEach(unit => {
        findTransportForThisCargo(unit, terr, gameObj);
        console.log('fix', unit);
    });
}
function squareUpAllAircraftCarriers(units, gameObj) {
    console.log('squareUpAllAircraftCarriers');
}
function squareUpAllCargo(units, gameObj) {
    //return; // this seems to be messing things up
    console.log('squareUpAllCargo');
    units.forEach(function (transport) {
        if (!transport.dead && transport.cargo && transport.cargo.length > 0) {
            var cargo = [];
            var cargoUnits = 0;
            transport.cargo.forEach(function (cargoUnit) {
                var gameUnit = findUnitOfId(cargoUnit.cargoOf, gameObj);
                if (gameUnit && gameUnit.cargoOf == transport.id) {
                    cargoUnits += cargoUnit.cargoUnits;
                    cargo.push(cargoUnit);
                    gameUnit.terr = transport.terr;
                }

            });
            transport.cargo = cargo;
            transport.cargoUnits = cargoUnits;
        }
    });
}
function findUnitOfId(unitId, gameObj) {
    if (!gameObj) {
        showAlertPopup('no gameObj to findUnitOfId', 1);
        return;
    }
    var gameUnit;
    gameObj.units.forEach(function (unit) {
        if (unit.id == unitId) {
            gameUnit = unit;
        }
    });
    return gameUnit;
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
function transferControlOfTerr(terr, nation, gameObj, annihilationFlg, player) {
    if (player && gameObj.allowAlliances && player.allies.length > 0 && player.treaties.length >= 8) {
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
    return nation;
}
function transferControlOfTerrAndRefresh(terr, nation, gameObj, currentPlayer, superpowersData, yourPlayer) {
    transferControlOfTerr(terr, nation, gameObj, false, currentPlayer);
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
        allowFlg = (terr.nation == 99 || type == 'bomb');
    }
    if (terr.attackedByNation == player.nation && terr.attackedRound == gameObj.round) {
        message = "This territory has already been attacked.";
        allowFlg = (terr.nation == 99 || type == 'bomb');
    }
    //   if (type == 'movement' && terr.defeatedByNation == player.nation && terr.defeatedByRound == gameObj.round) {
    //       message = 'Can\'t move into territories just defeated.';
    //       allowFlg = false;
    //   }
    if (terr.owner > 0 && gameObj.round < gameObj.attack && terr.treatyStatus <= 2 && terr.nation < 99) {
        message = 'Players cannot be attacked until round ' + gameObj.attack + '.';
        allowFlg = false;
    }
    if (hostileType) {
        if (terr.owner == 0 && terr.capital && terr.nation < 99 && gameObj.round < gameObj.attack && type == 'attack') {
            if (player.cap && player.cap > 1) {
                message = 'You can only take over one capital before round 6.';
                allowFlg = false;
            }
        }
        var cost = costToAttack(terr, player);
        if (cost > 0) {
            var treatyName = 'non-aggression pact';
            if (cost == 10)
                treatyName = 'peace treaty';
            if (cost == 15)
                treatyName = 'alliance';
            if (terr.treatyStatus == 0)
                message = 'This will cost you ' + cost + ' coins to attack, because you were not at war at the beginning of the turn. You can attack for free next turn.';
            else
                message = 'This will cost you ' + cost + ' coins to break the ' + treatyName + '! Alternatively, you can declare war this turn and then attack for free next turn.';

            if (cost == 15) {
                var p2 = playerOfNation(terr.owner, gameObj);
                if (p2.cpu) {
                    message = 'You cannot attack a computer ally! Declare war this turn and you can attack next turn.';
                    allowFlg = false;
                }
            }
        }
        if (type == 'bomb' && terr.bombed) {
            message = 'This country has already been bombed.';
            allowFlg = false;
        }
        if (type != 'bomb' && terr.attackedByNation == player.nation && terr.attackedRound == gameObj.round) {
            message = 'Can\'t attack the same territory twice.';
            allowFlg = false;
        }
        if (terr.owner > 0 && gameObj.round < gameObj.attack) {
            message = 'You can\'t attack other players, or be attacked until round ' + gameObj.attack + '.';
            allowFlg = false;
        }
        if (type == 'attack' && terr.owner > 0 && gameObj.round == gameObj.attack && terr.nation < 99 && terr.defeatedByRound != gameObj.round) {
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