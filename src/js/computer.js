function purchaseCPUUnits(player, gameObj, superpowersData) {
    if (gameObj.round <= 18)
        purchaseTechnology(0, player, gameObj, superpowersData);
    if (gameObj.round == 10)
        purchaseTechnology(19, player, gameObj, superpowersData);

    var compFactories = [];
    var islandFactories = [];
    var capitalId = 0;
    var hotSpotFactory = 0;
    var requestedHotSpot = getRequestedHotSpot(player, gameObj);
    if (requestedHotSpot > 0)
        player.hotSpotId = requestedHotSpot;

    gameObj.territories.forEach(function (terr) {
        if (terr.owner == player.nation && terr.factoryCount > 0) {
            if (player.hotSpotId && player.hotSpotId == terr.id)
                hotSpotFactory = compFactories.length;
            if (terr.capital)
                capitalId = terr.id;
            if (terr.land.length > 0)
                compFactories.push({ terrId: terr.id });
            else
                islandFactories.push({ terrId: terr.id });
        }
    });

    if (compFactories.length == 0)
        compFactories = islandFactories;
    if (compFactories.length == 0) {
        showAlertPopup(superpowers[player.nation] + ' eliminated!');
        removeAlliancesForNation(player.nation, gameObj);
        player.alive = false;
        return;
    }
    var randomFactory1 = Math.floor((Math.random() * compFactories.length));

    if (player.hotSpotId && player.hotSpotId > 0 && compFactories.length > hotSpotFactory)
        randomFactory1 = hotSpotFactory;

    var primaryFactory = compFactories[randomFactory1];
    if (!primaryFactory)
        primaryFactory = compFactories[0];
    var randomFactory2 = Math.floor((Math.random() * compFactories.length));
    var num = Math.floor((Math.random() * 8));
    player.money += 5;
    if (player.money > gameObj.round)
        player.money -= gameObj.round; // make game easier as you go (avoid long, long games);

    var terr1 = gameObj.territories[primaryFactory.terrId - 1];

    var placedInf = numberVal(player.placedInf);
    if (placedInf < 3) {
        for (var x = placedInf; x < 3; x++) {
            // add infantry
        }
        player.placedInf = 3;
    }
    if (terr1.adCount <= 2 && gameObj.round <= 10)
        addUniToQueue(13, 1, superpowersData, player, gameObj, terr1);
    var items = [];

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
    var capital = gameObj.territories[capitalId - 1];
    var waterway = gameObj.territories[capital.water - 1];
    if (num == 2 && waterway && waterway.id > 0) {
        addUniToQueue(4, 1, superpowersData, player, gameObj, waterway);
        addUniToQueue(5, 1, superpowersData, player, gameObj, waterway);
    }
    if (num == 3 && player.income > 40)
        addUniToQueue(9, 1, superpowersData, player, gameObj, terr1);
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
        addUniToQueue(3, tankCount, superpowersData, player, gameObj, terr1);
    }
    checkForAllyTerritoryRequests(player, gameObj, superpowersData);

}
function checkForAllyTerritoryRequests(player, gameObj, superpowersData) {
    if (!player || !player.territories)
        return;
    player.territories.forEach(function (terr) {
        if (terr.requestTransfer && terr.requestTransfer > 0) {
            if (terr.treatyStatus == 3) {
                transferControlOfTerr(terr, terr.requestTransfer, gameObj, currentPlayer, superpowersData, yourPlayer);
                logItem(gameObj, player, 'Transfer', terr.name + ' transferred to ' + superpowersData.superpowers[terr.requestTransfer]);
            }
            terr.requestTransfer = 0;
        }
    });
}
function transferControlOfTerr(terr, nation, gameObj, currentPlayer, superpowersData, yourPlayer) {
    terr.owner = nation;
    gameObj.units.forEach(function (unit) {
        if (unit.terr == terr.id) {
            if (unit.piece == 13 || unit.piece == 14 || unit.piece == 52 || unit.piece == 15 || unit.piece == 19) {
                unit.owner = nation;
                unit.nation = nation;
                unit.movesLeft = 0;
            }
        }
    });
    refreshTerritory(terr, gameObj, currentPlayer, superpowersData, yourPlayer)
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
function getRequestedHotSpot(player, gameObj) {
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
        if (terr.id < 79 && terr.groundForce >= 4 && !terr.generalFlg && !terr.leaderFlg && numberVal(terr.defeatedByNation) == 0 && terr.land.length > 0) {
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
function refreshPlayerTerritories(gameObj, player, superpowersData) {
    player.territories.forEach(function (terr) {
        refreshTerritory(terr, gameObj, player, superpowersData, player);
    });
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
        var terr = gameObj.territories[ids[x] - 1];
        if (terr.owner != player.nation) {
            return ids[x];
        }
    }
    return 0;
}
function findSecondaryTarget(gameObj, player) {
    var targets = [1, 7, 13, 21, 28, 35, 42, 50];
    var min = 7;
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
        var dist = landDistFromTerr(terr.id, primaryTargetId, 0, gameObj);
        if (dist < min) {
            min = dist;
            minId = terr.id;
        }
    });
    return minId;
}
function okToAttack(player, terr, gameObj) {
    if (terr.owner == 0)
        return true;
    if (terr.nation == 99 && terr.unitCount == 0)
        return true;
    if (player.nation == terr.owner)
        return false;
    if (gameObj.round < gameObj.attack)
        return false;
    if (gameObj.round == gameObj.attack) {
        if (player.attackFlg)
            return false;
        var p2 = playerOfNation(terr.owner);
        if (p2 && p2.defenseFlg)
            return false;
    }
    if (terr.treatyStatus >= 2) {
        return false;
    }
    return true;
}
function landDistFromTerr(terr1Id, terr2Id, dist, gameObj) {
    if (terr1Id == 0 || terr2Id == 0) {
        console.log('Whoa! landDistFromTerr');
        return;
    }
    if (terr1Id == terr2Id)
        return dist;
    dist++;
    if (dist >= 7)
        return 7;

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
function attemptToAttack(targetId, currentPlayer, gameObj) {

    /*   var terr = gameObj.territories[targetId - 1];
       terr.land.forEach(function (t) {
           //       console.log(id, t);
       });*/
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
    if (closestTerr && closestTerr.land.length > 0) {
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
function stageAttackBetweenTerritories(terr1, terr2, currentPlayer, limit = 99) {
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
            if (unit.att > 0 && unit.mv > 0 && unit.movesLeft > 0 && unit.owner == currentPlayer.nation && limit > 0) {
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
            if (unit.def > 0 && unit.mv > 0) {
                defUnits.push(unit);
            }
        });
    }
    return { attackUnits: attackUnits, defUnits: defUnits, t1: attId, t2: defId, id: pieceId, terr: terr2, attTerr: terr1 };

}
function findGoodTargetForTerr(terr1, currentPlayer, gameObj) {
    if (!terr1 || !terr1.land || terr1.land.length == 0)
        return null;
    var terr2;
    terr1.land.forEach(function (t) {
        var ter = gameObj.territories[t - 1];
        if (okToAttack(currentPlayer, ter, gameObj))
            terr2 = ter;
    });
    return terr2;
}
function fortifyThisTerritory(player, gameObj) {
    var terr1 = gameObj.territories[player.hotSpotId - 1];
    terr1.land.forEach(function (t) {
        var ter = gameObj.territories[t - 1];
        if (ter.owner == player.nation) {
            var x = 0;
            ter.units.forEach(function (unit) {
                if (unit.att > 0 && unit.mv > 0 && unit.movesLeft > 0 && unit.owner == player.nation && x++ > 2)
                    unit.terr = player.hotSpotId;
            });
        }
    });
}
function findMainBaseTarget(gameObj, player) {
    var terr1 = gameObj.territories[player.mainBaseID - 1];
    var terr2 = findGoodTargetForTerr(terr1, player, gameObj);
    return stageAttackBetweenTerritories(terr1, terr2, player, 99);
}
function findAmphibiousAttacks(gameObj, player) {
    var obj = stageAttackBetweenTerritories(null, null, player, 0);
    player.territories.forEach(function (terr) {
        if (terr.transportSpace > 0 && (terr.id == 101 || terr.id == 110 || terr.id == 112 || terr.id == 141 || terr.id == 131 || terr.id == 118 || terr.id == 96 || terr.id == 98)) {
            var homeBase = gameObj.territories[terr.homeBase - 1];
            if (homeBase.groundForce > 0 && homeBase.owner == player.nation) {
                obj = attemptAmbibiousLanding(player, homeBase, terr.enemyWater, terr.enemyZone, terr, gameObj, obj);
                if (obj.t1 == 0)
                    obj = attemptAmbibiousLanding(player, homeBase, terr.enemyWater2, terr.enemyZone2, terr, gameObj);
            }
        }
    });
    return obj;
}
function attemptAmbibiousLanding(player, homeBase, enemyWaterId, enemyZoneId, homeWaterTerr, gameObj, obj) {
    var enemyWaterTerr = gameObj.territories[enemyWaterId - 1];
    var enemyLandTerr = gameObj.territories[enemyZoneId - 1];
    if (enemyWaterTerr.shipDefense > 0 && gameObj.round <= 6)
        return obj;
    if (enemyLandTerr.defStrength > homeBase.attStrength)
        return obj;
    if (enemyLandTerr.defStrength > homeWaterTerr.transportCount * 4)
        return obj;

    if (okToAttack(player, enemyLandTerr, gameObj)) {
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
        if (unit.def > 0) {
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
            attackFleet.push(unit);
            if (enemyWaterTerr.unitCount == 0)
                unit.terr = enemyWaterTerr.id;
        }
    });
    homeBase.units.forEach(function (unit) {
        if (unit.terr == homeBase.id && unit.att > 0 && unit.mv > 0 && unit.movesLeft > 0 && !unit.moving && (unit.piece == 2 || unit.piece == 3)) {
            if (cargoSpace - unit.cargoUnits >= 0) {
                attackUnits.push(unit);
                pieceId = unit.piece;
                cargoSpace -= unit.cargoUnits;
            }
        }
    });

    if (homeWaterTerr.shipAttack > enemyWaterTerr.shipDefense * 2 && attackUnits.length > 0 && attackFleet.length > 0 && attackUnits.length >= enemyLandTerr.unitCount) {
        obj = stageAttackBetweenTerritories(homeBase, enemyLandTerr, player);
        return {
            attackUnits: attackUnits,
            defUnits: defUnits,
            t1: homeBase.id,
            t2: enemyLandTerr.id,
            id: pieceId,
            terr: enemyLandTerr,
            attTerr: homeBase,
            ampFlg: enemyWaterTerr.unitCount > 0,
            ampAttTerr: homeWaterTerr,
            ampDefTerr: enemyWaterTerr,
            ampAttUnits: attackFleet,
            ampDefUnits: defSeaUnits
        };
    }
    return obj;
}