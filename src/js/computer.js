function purchaseCPUUnits(player, gameObj, superpowersData) {
    if (gameObj.round <= 18)
        purchaseTechnology(0, player, gameObj, superpowersData);
    if (gameObj.round == 10)
        purchaseTechnology(19, player, gameObj, superpowersData);

    var factoryTerritories = [];
    var waterwayTerritories = [];
    var hotSpotTerr;
    var allowFacRestorFlg = true;
    player.territories.forEach(function (terr) {
        if (terr.id == player.hotSpotId && terr.owner == player.nation)
            hotSpotTerr = terr;
        if (terr.factoryCount > 0) {
            factoryTerritories.push(terr);
            if (terr.water > 0)
                waterwayTerritories.push(gameObj.territories[terr.water - 1]);
        }
        if (allowFacRestorFlg && terr.facBombed) {
            terr.facBombed = false;
            allowFacRestorFlg = false;
            console.log('fac restored', terr.name)
        }
    });
    if (factoryTerritories.length == 0) {
        showAlertPopup(superpowers[player.nation] + ' eliminated!');
        removeAlliancesForNation(player.nation, gameObj);
        player.alive = false;
        return;
    }

    var terr1 = factoryTerritories[Math.floor((Math.random() * factoryTerritories.length))];
    var terr2 = factoryTerritories[Math.floor((Math.random() * factoryTerritories.length))];
    var waterway;
    if (waterwayTerritories.length > 0)
        waterway = waterwayTerritories[Math.floor((Math.random() * waterwayTerritories.length))];

    if (hotSpotTerr) {
        if (hotSpotTerr.factoryCount == 0)
            addUniToQueue(15, 1, superpowersData, player, gameObj, hotSpotTerr);
        else
            terr1 = hotSpotTerr;
    }

    var num = Math.floor((Math.random() * 8));
    if (gameObj.round < 10)
        player.money += 5;
    if (gameObj.round > 20)
        player.money -= 5;
    if (gameObj.round >= 100 && player.cpu)
        player.money += 350; // keep players from dragging feet

    var placedInf = numberVal(player.placedInf);
    if (placedInf < 3) {
        for (var x = placedInf; x < 3; x++) {
            addUniToQueue(2, 1, superpowersData, player, gameObj, terr1);
        }
        player.placedInf = 3;
    }
    if (terr1.adCount <= 2) {
        addUniToQueue(13, 1, superpowersData, player, gameObj, terr1);
    }
    if (terr2.adCount <= 2) {
        addUniToQueue(13, 1, superpowersData, player, gameObj, terr2);
    }
    if (num <= 6) {
        addComputerFactory(player, superpowersData, gameObj);
    }
    if (num >= 2 && player.income >= 30)
        player.money += 8;

    var difficultyNum = numberVal(gameObj.difficultyNum);
    if (difficultyNum == -1)
        player.money -= 10;
    if (difficultyNum == 1)
        player.money += 10;
    if (num == 2 && waterway && waterway.id > 0) {
        addUniToQueue(4, 1, superpowersData, player, gameObj, waterway);
        addUniToQueue(5, 1, superpowersData, player, gameObj, waterway);
    }
    if (num == 3 && player.income > 40)
        addUniToQueue(9, 1, superpowersData, player, gameObj, waterway);
    if (num == 4 && waterway && waterway.id > 0) {
        addUniToQueue(4, 1, superpowersData, player, gameObj, waterway);
    }
    if (num == 5 && player.income > 30 && waterway && waterway.id > 0)
        addUniToQueue(8, 1, superpowersData, player, gameObj, waterway);

    if (num == 6) {
        addUniToQueue(7, 1, superpowersData, player, gameObj, terr1);
    }
    if (num == 7 || player.money >= 45) {
        addUniToQueue(14, 1, superpowersData, player, gameObj, terr1);
    }
    if (player.money >= 10) {
        var infCount = parseInt(player.money / 6);
        var tankCount = parseInt(player.money / 6);
        addUniToQueue(2, infCount, superpowersData, player, gameObj, terr1);
        addUniToQueue(3, tankCount, superpowersData, player, gameObj, terr2);
    }
    checkForAllyTerritoryRequests(player, gameObj, superpowersData);

}
function checkForAllyTerritoryRequests(player, gameObj, superpowersData) {
    if (!player || !player.territories)
        return;
    player.territories.forEach(function (terr) {
        if (terr.requestTransfer && terr.requestTransfer > 0) {
            if (terr.treatyStatus == 3) {
                transferControlOfTerrAndRefresh(terr, terr.requestTransfer, gameObj, currentPlayer, superpowersData, yourPlayer);
                logItem(gameObj, player, 'Transfer', terr.name + ' transferred to ' + superpowersData.superpowers[terr.requestTransfer]);
            }
            terr.requestTransfer = 0;
        }
    });
}

function addComputerFactory(player, superpowersData, gameObj) {
    if (player.territories.length == 0) {
        console.log('hey!!! no territories!!!');
        return;
    }
    var num = Math.floor((Math.random() * player.territories.length));
    var terr = player.territories[num];
    if (!terr)
        return;
    if (terr.nation == 99)
        return;
    if (terr.factoryCount > 1)
        return;
    if (terr.factoryCount == 0)
        addUniToQueue(15, 1, superpowersData, player, gameObj, terr);
    if (terr.factoryCount == 1) {
        addUniToQueue(19, 1, superpowersData, player, gameObj, terr);
    }
}
function purchaseTechnology(num, player, gameObj, superpowersData) {
    if (player.tech.length == 0)
        player.tech = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    if (num == 0)
        num = getRandomTech(player);
    if (num == 0)
        return;

    player.tech[num - 1] = true;
    logItem(gameObj, player, 'Technology', superpowersData.techs[num - 1].name);
    return num;
}
function getRandomTech(player) {
    for (var x = 0; x <= 100; x++) {
        var diceRoll = Math.floor((Math.random() * 6) + 1);
        var tech = diceRoll * 3 - 2;
        if (!player.tech[tech - 1])
            return tech;
        tech++;
        if (!player.tech[tech - 1])
            return tech;
        tech++;
        if (!player.tech[tech - 1])
            return tech;
    }
    return 0;
}
/*function getRequestedHotSpot(player, gameObj) {
    var hotSpot = 0;
    if (player.requestedHotSpot && player.requestedHotSpot > 0) {
        var terr = gameObj.territories[player.requestedHotSpot - 1];
        if (terr.owner == player.nation) {
            hotSpot = player.requestedHotSpot;
            return;
        } else
            player.requestedHotSpot = 0;
    }
    return hotSpot;
}*/
function doCpuDiplomacyRespond(player, gameObj, superpowersData) {
    if (player.allySpotsOpen < 0 && player.allies.length > 0) {
        var nation = player.allies[0];
        dropAllyOfNation(player, nation, gameObj, superpowersData)
    }
    player.offers.forEach(function (nation) {
        var status = player.treaties[nation - 1];
        var roundsW = roundsOfWar(player, nation, gameObj);
        var roundsP = roundsOfPeace(player, nation, gameObj);
        if (status < 2 && (roundsW > 3 || gameObj.round < 6))
            acceptOfferFromNation(player, nation, gameObj, superpowersData);
        if (status == 2) {
            if (player.allySpotsOpen > 0)
                acceptOfferFromNation(player, nation, gameObj, superpowersData);
            else {
                rejectOfferFromNation(player, nation, gameObj);
            }
        }
    });
    player.offers = [];
    player.news = [];
}
function doCpuDiplomacyOffer(player, gameObj, superpowersData) {
    var num = Math.floor((Math.random() * gameObj.players.length));
    var player2 = gameObj.players[num];
    var status = player.treaties[player2.nation - 1];
    if (!player2.cpu && gameObj.round > 8)
        return;

    if (status < 2) {
        var rounds = roundsOfWar(player, player2.nation, gameObj);
        if (rounds > 3)
            offerTreatyToNation(player2.nation, gameObj, player, superpowersData);
    }
    if (status == 2 && player.allies.length < player.maxAlliesForPlayer) {
        offerTreatyToNation(player2.nation, gameObj, player, superpowersData);
    }
}
function declareWarIfNeeded(gameObj, player, superpowersData) {
    if (gameObj.round > 6) {
        gameObj.players.forEach(function (p2) {
            var status = treatyStatus(player, p2.nation);
            var roundsP = roundsOfPeace(player, p2.nation, gameObj);
            var roundsW = roundsOfWar(player, p2.nation, gameObj);
            if ((status == 1 || status == 2) && roundsP > 3 && (player.alliesMaxed || p2.alliesMaxed)) {
                console.log('xxxdeclare war', roundsP);
                declareWarOnNation(p2.nation, gameObj, player, superpowersData);
            }
            if (gameObj.type == 'co-op' && gameObj.round > 50) {
                if (status > 0 && !p2.cpu) {
                    console.log('xxxdeclare war2');
                    declareWarOnNation(p2.nation, gameObj, player, superpowersData);
                }
                    
                if (status == 0 && p2.cpu && p2.alive)
                    changeTreaty(player, p2, 3, gameObj, superpowersData);
            }
        });
    }
}
function roundsOfWar(player, nation, gameObj) {
    var num = 4;
    if (gameObj.round > 5 && player.lastRoundsOfPeace && player.lastRoundsOfPeace.length >= 8) {
        num = gameObj.round - player.lastRoundsOfPeace[nation - 1];
    }
    return num;
}
function roundsOfPeace(player, nation, gameObj) {
    var num = 4;
    if (gameObj.round > 5 && player.lastRoundsOfWar && player.lastRoundsOfWar.length >= 8) {
        num = gameObj.round - player.lastRoundsOfWar[nation - 1];
    }
    return num;
}
//---------------------------------------------------------------
//              Move
//---------------------------------------------------------------
function moveCPUUnits(player, gameObj, superpowersData) {
    console.log('moveCPUUnits');
    if (gameObj.allowPeace && !player.alliesMaxed && gameObj.round < 6)
        checkDiplomacy(player, gameObj);
    else if (gameObj.allowAlliances && !player.alliesMaxed)
        checkDiplomacy(player, gameObj);

    if (player.primaryTargetId > 0) {
        //       advanceMainBaseNew(player, player.primaryTargetId);
        //      advanceUnitsToFront(player, player.primaryTargetId);
    } else {
        //      advanceMainBaseNew(player, player.secondaryTargetId);
        //      moveUnitsIntoHotSpot(player, player.hotSpotId);
        //      advanceUnitsToFront(player, player.secondaryTargetId);
    }
    var obj = spreadOutUnits(player, gameObj, superpowersData);
    return obj;
}
function checkDiplomacy(player, gameObj) {
    var num = Math.floor((Math.random() * gameObj.players.length));
    /*  
      if(!attemptDiplomacy(player, num++))
          if(!attemptDiplomacy(player, num++))
              if(!attemptDiplomacy(player, num++))
                  if(!attemptDiplomacy(player, num++))
                      attemptDiplomacy(player, num);
      */
}
function spreadOutUnits(player, gameObj, superpowersData) {
    var obj = { t1: 0, t2: 0, id: 0 };
    player.territories.forEach(function (terr) {
        if (terr.id < 79 && terr.owner == player.nation && terr.groundForce >= 4 && !terr.generalFlg && !terr.leaderFlg && numberVal(terr.defeatedByNation) == 0 && terr.land) {
            for (var x = 0; x < terr.land.length; x++) {
                var toId = terr.land[x];
                var toTerr = gameObj.territories[toId - 1];
                if (toTerr.owner == player.nation && numberVal(toTerr.defeatedByNation) == 0 && !toTerr.nuked) {
                    if (toTerr.unitCount * 1 < terr.unitCount) {
                        obj = moveAFewUnitsFromTerrToTerr(terr, toTerr, player, gameObj);
                    }
                }
            }
        }
    });
    return obj;
}
function moveAFewUnitsFromTerrToTerr(terr, toTerr, player, gameObj) {
    var count = 0;
    var obj = { t1: 0, t2: 0, id: 0 };
    gameObj.units.forEach(function (unit) {
        if (unit.owner == player.nation && unit.att > 0 && unit.movesLeft > 0 && unit.terr == terr.id) {
            if (count++ < 3) {
                unit.terr = toTerr.id;
                unit.movesLeft = 0;
                obj = { t1: terr.id, t2: toTerr.id, id: unit.piece };
            }
        }
    });
    return obj;
}
function findMainBase(gameObj, currentPlayer) {
    var baseId = 0;
    var max = 0;
    gameObj.territories.forEach(function (terr) {
        if (terr.owner == currentPlayer.nation && terr.unitCount > max && terr.nation < 99) {
            max = terr.unitCount;
            baseId = terr.id;
        }
    });
    return baseId;
}
function findPrimaryTarget(gameObj, player) {
    if (player.requestedTarget && player.requestedTarget > 0)
        return player.requestedTarget;
    var target = 0;
    if (player.nation == 1)
        target = findNextPrimaryTargetForPlayer(player, [1, 2, 3, 4, 5], gameObj);
    if (player.nation == 2)
        target = findNextPrimaryTargetForPlayer(player, [7, 12, 8, 9, 62], gameObj);
    if (player.nation == 3)
        target = findNextPrimaryTargetForPlayer(player, [13, 14, 15, 16, 17, 18, 19, 20], gameObj);
    if (player.nation == 4)
        target = findNextPrimaryTargetForPlayer(player, [21, 24, 25, 23, 22], gameObj);
    if (player.nation == 5)
        target = findNextPrimaryTargetForPlayer(player, [28, 70, 29, 30, 31, 34], gameObj);
    if (player.nation == 6)
        target = findNextPrimaryTargetForPlayer(player, [35, 37, 40, 41, 36, 38, 39], gameObj);
    if (player.nation == 7)
        target = findNextPrimaryTargetForPlayer(player, [42, 44, 43, 45, 46, 47, 48, 49], gameObj);
    if (player.nation == 8)
        target = findNextPrimaryTargetForPlayer(player, [50, 55, 54, 53, 52, 51], gameObj);
    return target;
}
function findNextPrimaryTargetForPlayer(player, ids, gameObj) {
    for (var x = 0; x < ids.length; x++) {
        var id = ids[x];
        var terr = gameObj.territories[id - 1];
        if (terr.owner != player.nation) {
            return id;
        }
    }
    return 0;
}
function findSecondaryTarget(gameObj, player) {
    var terrId = findBorderingAttackableTerritory(gameObj, player);
    if (terrId > 0)
        return terrId;
    else return findClosestAttackableCapital(gameObj, player);
}
function findBorderingAttackableTerritory(gameObj, player) {
    var targetId = 0;
    var smallestArmy = 6;
    player.territories.forEach(function (terr) {
        if (terr.land && terr.land.length > 0) {
            terr.land.forEach(function (terrId) {
                var ter = gameObj.territories[terrId - 1];
                if (ter.owner != player.nation && ter.unitCount < smallestArmy && okToAttack(player, ter, gameObj)) {
                    targetId = terrId;
                    smallestArmy = ter.unitCount;
                }
            });
        }
    });
    return targetId;
}
function findClosestAttackableCapital(gameObj, player) {
    var targets = [1, 7, 13, 21, 28, 35, 42, 50];
    var min = 9;
    var minId = 0;
    for (var x = 0; x < targets.length; x++) {
        var t = gameObj.territories[targets[x] - 1];
        if (t.owner != player.nation && okToAttack(player, t, gameObj)) {
            var dist = landDistFromTerr(player.mainBaseID, t.id, 0, gameObj);
            if (dist < min) {
                min = dist;
                minId = t.id;
            }
            if (dist <= 3) {
                player.secondaryTargetId = t.id;
                return t.id;
            }
        }
    }
    return minId;
}
function findFortification(gameObj, player) {
    if (player.requestedHotSpot && player.requestedHotSpot > 0)
        return player.requestedHotSpot;
    if (player.primaryTargetId > 0) {
        var target = findClosestTerr(gameObj, player, player.primaryTargetId);
        if (target > 0)
            return target;
    }
    if (player.secondaryTargetId > 0) {
        var target = findClosestTerr(gameObj, player, player.secondaryTargetId);
        if (target > 0)
            return target;
    }
    return player.mainBaseID;
}
function findClosestTerr(gameObj, player, primaryTargetId) {
    var min = 9;
    var minId = 0;
    player.territories.forEach(function (terr) {
        if (terr.owner == player.nation) {
            var dist = landDistFromTerr(terr.id, primaryTargetId, 0, gameObj);
            if (dist < min) {
                min = dist;
                minId = terr.id;
            }
        }
    });
    return minId;
}
function okToAttackReason(player, terr, gameObj) {
    if (terr.attackedByNation == player.nation && terr.attackedRound == gameObj.round)
        return 'Already Attacked';
    if (terr.owner == 0)
        return 'ok';
    if (terr.nation == 99 && terr.unitCount == 0)
        return 'ok';
    if (player.nation == terr.owner)
        return 'you own it';
    if (gameObj.round < gameObj.attack)
        return 'too soon';
    if (gameObj.round == gameObj.attack) {
        if (player.attackFlg)
            return 'attackFlg';
        var p2 = playerOfNation(terr.owner, gameObj);
        if (p2 && p2.defenseFlg)
            return 'defenseFlg';
    }
    var status = treatyStatus(player, terr.owner)
    if (status > 0) {
        return 'not at war';
    }
    if (status == 1) {
        //   var rounds = roundsSincePeace2(player, terr.owner, gameObj);
        return 'ok';
    }

    return 'ok';
}
function isAtWarWith(player, terr, gameObj) {
    //use in place of okToAttack
    var status = treatyStatus(player, terr.owner);
    return (status == 0 && gameObj.round > 5);
}
function okToAttack(player, terr, gameObj) {
    if (terr.attackedByNation == player.nation && terr.attackedRound == gameObj.round)
        return false;
    if (terr.owner == 0)
        return true;
    if (terr.nation == 99 && terr.unitCount == 0)
        return true;
    if (player.nation == terr.owner)
        return false;
    if (terr.nuked)
        return false;
    if (gameObj.round < gameObj.attack)
        return false;
    if (gameObj.round == gameObj.attack) {
        if (player.attackFlg)
            return false;
        if (terr.owner > 0) {
            var p2 = playerOfNation(terr.owner, gameObj);
            if (p2 && p2.defenseFlg)
                return false;
        }
    }
    var status = treatyStatus(player, terr.owner)
    if (status > 0) {
        return false;
    }
    if (status == 1) {
        //   var rounds = roundsSincePeace2(player, terr.owner, gameObj);
        return true;
    }

    return true;
}
function landDistFromTerr(terr1Id, terr2Id, dist, gameObj) {
    var max = 9;
    if (terr1Id == 0 || terr2Id == 0) {
        console.log('Whoa! landDistFromTerr');
        return;
    }
    if (terr1Id == terr2Id)
        return dist;
    dist++;
    if (dist >= max)
        return max;

    var terr = gameObj.territories[terr1Id - 1];
    if (!terr)
        return;
    var min = 9;
    if (!terr.land) {
        return min;
    }
    terr.land.forEach(function (id) {
        var d = landDistFromTerr(id, terr2Id, dist, gameObj)
        if (d < min)
            min = d;
    });
    return min;
}
function allUnitsAttack(targetId, currentPlayer, gameObj) {
    var targetTerr = gameObj.territories[targetId - 1];
    if (treatyStatus(currentPlayer, targetTerr.nation) > 0)
        return null;;
    if (!okToAttack(currentPlayer, targetTerr, gameObj))
        return null;

    var terrHash = {};
    terrHash[targetId] = true;
    targetTerr.land.forEach(function (t) {
        terrHash[t] = true;
    });
    var attackUnits = [];
    var defUnits = [];
    var piece = 2;
    targetTerr.units.forEach(function (unit) {
        if (unit.owner != currentPlayer.nation && isUnitOkToDefend(unit))
            defUnits.push(unit);
    });
    gameObj.units.forEach(function (unit) {
        if (unit.owner == currentPlayer.nation && isUnitOkToAttack(unit, currentPlayer.nation) && terrHash[unit.terr]) {
            attackUnits.push(unit);
            piece = unit.piece;
        }
    });

    return { attackUnits: attackUnits, defUnits: defUnits, t1: targetTerr.id, t2: targetTerr.id, id: piece, terr: targetTerr, attTerr: targetTerr };
}
function attemptToAttack(targetId, currentPlayer, gameObj) {
    var targetTerr = gameObj.territories[targetId - 1];
    var biggestAttacker;
    var min = 0;
    targetTerr.land.forEach(function (t) {
        var ter = gameObj.territories[t - 1];
        if (ter.owner == currentPlayer.nation && ter.attStrength > targetTerr.defStrength && ter.attStrength > min && okToAttack(currentPlayer, ter, gameObj)) {
            min = ter.attStrength;
            biggestAttacker = ter;
        }
    });
    if (biggestAttacker) {
        return stageAttackBetweenTerritories(biggestAttacker, targetTerr, currentPlayer);
    }
    //-----------------
    var min = 5;
    var closestTerr;
    currentPlayer.territories.forEach(function (terr) {
        var dist = landDistFromTerr(terr.id, targetId, 0, gameObj);
        if (dist < min) {
            min = dist;
            closestTerr = terr;
        }
    });
    var defendingTerr;
    if (closestTerr && closestTerr.land && closestTerr.land.length > 0) {
        closestTerr.land.forEach(function (t) {
            var dist = landDistFromTerr(t, targetId, 0, gameObj);
            if (dist < min) {
                var ter = gameObj.territories[t - 1];
                if (okToAttack(currentPlayer, ter, gameObj)) {
                    min = dist;
                    defendingTerr = ter;
                }
            }
        });
    }
    return stageAttackBetweenTerritories(closestTerr, defendingTerr, currentPlayer);
}
function stageAttackBetweenTerritories(terr1, terr2, currentPlayer, limit = 500) {
    var attackUnits = [];
    var defUnits = [];
    var attId = 0;
    var defId = 0
    var pieceId = 2;
    if (terr1 && terr2) {
        attId = terr1.id;
        defId = terr2.id;
        artCount = 0;
        spotterCount = 0;
        terr1.units.forEach(function (unit) {
            if (isUnitOkToAttack(unit, currentPlayer.nation) && limit > 0) {
                var artFlg = isArtillery(unit);
                if (artFlg && artCount >= spotterCount)
                    return;
                if (artFlg)
                    artCount++;
                else
                    spotterCount++;
                limit -= unit.att;
                attackUnits.push(unit);
                pieceId = unit.piece;
            }
        });
        terr2.units.forEach(function (unit) {
            if (isUnitOkToDefend(unit)) {
                defUnits.push(unit);
            }
        });
    }
    return { attackUnits: attackUnits, defUnits: defUnits, t1: attId, t2: defId, id: pieceId, terr: terr2, attTerr: terr1 };

}
function findGoodTargetForTerr(terr1, currentPlayer, gameObj, logging) {
    if (!terr1 || !terr1.land || terr1.land.length == 0)
        return null;
    var terr2;
    if (logging)
        console.log('===>', terr1.name, currentPlayer.nation);
    for (var x = 0; x < terr1.land.length; x++) {
        var t = terr1.land[x];
        var ter = gameObj.territories[t - 1];
        if (ter.owner != currentPlayer.nation && terr1.attStrength > ter.defStrength) {
            if (logging)
                console.log('+', ter.name, terr1.attStrength, ter.defStrength, okToAttackReason(currentPlayer, ter, gameObj));
            if (okToAttack(currentPlayer, ter, gameObj)) {
                return ter;
            }

        }
    }
    return null;
}
function respositionMainBase(player, gameObj) {
    if (!player.mainBaseID)
        return;
    var terr1 = gameObj.territories[player.mainBaseID - 1];
    var max = terr1.unitCount;
    var newTerr;
    if (terr1 && terr1.land) {
        terr1.land.forEach(function (t) {
            var ter = gameObj.territories[t - 1];
            if (ter.owner == player.nation && ter.unitCount > max) {
                max = ter.unitCount;
                newTerr = ter;
            }
        });
    }
    if (newTerr) {
        player.mainBaseID = newTerr.id;
        terr1.units.forEach(function (unit) {
            if (unit.owner == player.nation && (unit.piece == 10 || unit.piece == 11))
                unit.terr = newTerr.id;
        });
    }
}
function fortifyThisTerritory(player, gameObj) {
    if (!player.hotSpotId)
        return;
    var terr1 = gameObj.territories[player.hotSpotId - 1];
    if (!terr1 || !terr1.land)
        return;
    terr1.land.forEach(function (t) {
        var ter = gameObj.territories[t - 1];
        if (ter.owner == player.nation) {
            var x = 0;
            ter.units.forEach(function (unit) {
                if (isUnitOkToMove(unit, player.nation)) {
                    unit.movesLeft = 0;
                    if (x++ >= 2)
                        unit.terr = player.hotSpotId;
                }
            });
        }
    });
}
function findMainBaseTarget(gameObj, player) {
    if (!player.mainBaseID)
        return;
    var terr1 = gameObj.territories[player.mainBaseID - 1];
    var terr2 = findGoodTargetForTerr(terr1, player, gameObj);
    return stageAttackBetweenTerritories(terr1, terr2, player, 99);
}
function recallBoats(gameObj, player) {
    var ids = [101, 110, 112, 141, 131, 118, 96, 98];
    for (var x = 0; x < ids.length; x++) {
        var id = ids[x];
        var terr = gameObj.territories[id - 1];
        if (terr.owner == player.nation) {
            gameObj.units.forEach(function (unit) {
                if (unit.owner == player.nation && unit.movesLeft > 0 && (unit.terr == terr.enemyWater || unit.terr == terr.enemyWater2)) {
                    unit.terr = terr.id;
                }

            });
        }
    }
}
function findAmphibiousAttacks(gameObj, player, moveFlg = false) {
    var obj = stageAttackBetweenTerritories(null, null, player, 0);
    player.territories.forEach(function (terr) {
        if (terr.transportSpace > 0 && (terr.id == 101 || terr.id == 110 || terr.id == 112 || terr.id == 141 || terr.id == 131 || terr.id == 118 || terr.id == 96 || terr.id == 98)) {
            var homeBase = gameObj.territories[terr.homeBase - 1];
            if (homeBase.groundForce > 0 && homeBase.owner == player.nation) {
                obj = attemptAmbibiousLanding(player, homeBase, terr.enemyWater, terr.enemyZone, terr, gameObj, obj, moveFlg);
                if (obj.t1 == 0) //try second spot
                    obj = attemptAmbibiousLanding(player, homeBase, terr.enemyWater2, terr.enemyZone2, terr, gameObj, obj, moveFlg);
            }
        }
    });
    return obj;
}
function attemptAmbibiousLanding(player, homeBase, enemyWaterId, enemyZoneId, homeWaterTerr, gameObj, obj, moveFlg) {
    var enemyWaterTerr = gameObj.territories[enemyWaterId - 1];
    var enemyLandTerr = gameObj.territories[enemyZoneId - 1];
    if (enemyWaterTerr.shipDefense > 0 && gameObj.round <= 6)
        return obj;
    if (enemyLandTerr.defStrength > homeBase.attStrength)
        return obj;
    if (enemyLandTerr.defStrength > homeWaterTerr.transportCount * 4)
        return obj;

    var goodToGoFlg = okToAttack(player, enemyLandTerr, gameObj);
    if (moveFlg)
        goodToGoFlg = enemyLandTerr.owner == player.nation;
    if (goodToGoFlg) {
        obj = getAmphibiousAttackObj(player, homeBase, enemyWaterTerr, enemyLandTerr, homeWaterTerr, gameObj, obj);
        return obj;
    }
    return obj;
}
function getAmphibiousAttackObj(player, homeBase, enemyWaterTerr, enemyLandTerr, homeWaterTerr, gameObj, obj) {
    var attackUnits = [];
    var defUnits = [];
    var defSeaUnits = [];
    var attackFleet = [];
    var pieceId = 4;
    var cargoSpace = homeWaterTerr.cargoSpace;

    enemyLandTerr.units.forEach(function (unit) {
        if (isUnitOkToDefend(unit)) {
            defUnits.push(unit);
        }
    });
    enemyWaterTerr.units.forEach(function (unit) {
        if (unit.type > 1) {
            defSeaUnits.push(unit);
        }
    });
    homeWaterTerr.units.forEach(function (unit) {
        if (unit.owner == player.nation) {
            pieceId = unit.piece;
            attackFleet.push(unit);
        }
    });
    homeBase.units.forEach(function (unit) {
        if (isUnitOkToAttack(unit, player.nation) && (unit.piece == 2 || unit.piece == 3)) {
            if (cargoSpace - unit.cargoUnits >= 0) {
                attackUnits.push(unit);
                //               pieceId = unit.piece;
                cargoSpace -= unit.cargoUnits;
            }
        }
    });
    if (homeWaterTerr.shipAttack > enemyWaterTerr.shipDefense * 2 && attackUnits.length > 0 && attackFleet.length > 0 && attackUnits.length >= enemyLandTerr.unitCount) {
        obj = stageAttackBetweenTerritories(homeBase, enemyLandTerr, player);

        var ampFlg = true;
        if (enemyWaterTerr.unitCount == 0 && enemyWaterTerr.id > 0) {
            ampFlg = false;
            attackFleet.forEach(function (unit) {
                unit.terr = enemyWaterTerr.id; // move the fleet!
                unit.movesLeft = 0;
            });
        }
        return {
            attackUnits: attackUnits,
            defUnits: defUnits,
            t1: homeWaterTerr.id,
            t2: enemyWaterTerr.id,
            id: pieceId,
            terr: enemyLandTerr,
            attTerr: homeBase,
            ampFlg: ampFlg,
            ampAttTerr: homeWaterTerr,
            ampDefTerr: enemyWaterTerr,
            ampAttUnits: attackFleet,
            ampDefUnits: defSeaUnits
        };
    }
    return obj;
}
function addTestScore(gameObj, humanPlayer) {
    if (!humanPlayer)
        humanPlayer = getHumanPlayer(gameObj);
    var winLoss = (gameObj.winningTeamFlg) ? 'Win' : 'Loss';
    var gameScores = getGameScores();
    gameScores.push({ id: gameScores.length + 1, created: gameObj.created, type: gameObj.type, winLoss: winLoss, round: gameObj.round, nation: humanPlayer.nation });
    localStorage.setItem("gameScores", JSON.stringify(gameScores));
}
function getGameScores() {
    return JSON.parse(localStorage.getItem("gameScores")) || [];
}
function getHumanPlayer(gameObj) {
    for (var x = 0; x < gameObj.players.length; x++) {
        var player = gameObj.players[x];
        if (!player.cpu)
            return player;
    }
}