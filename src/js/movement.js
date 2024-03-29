
function checkMovement(distObj, unit, optionType, currentPlayer, toTerr) {
    if (0 && unit.piece == 49) {
        console.log('xxxxx', unit.type, toTerr.id, distObj, optionType);
    }
    //return true;    // if this function returns true, a checkbox will show up

    if (unit.owner != currentPlayer.nation)
        return false;

    if (optionType != 'cruise' && toTerr.id < 79 && unit.type == 3)
        return false; // boats cannot go on land

    if (unit.piece == 4 && unit.movesLeft == 1) {
        unit.mv = 1;
    }
    if (optionType == 'cruise') {
        if (unit.didAttackFlg)
            return false;
        if (distObj.air > 1)
            return false;
        if (unit.piece != 5 && unit.piece != 9 && unit.piece != 12 && unit.piece != 39)
            return false;
        if (unit.piece != 39 && !currentPlayer.tech[7])
            return false;

        return true;
    }
    if (unit.piece == 43 && toTerr.nation == 99)
        return false;

    if (unit.movesLeft == 0)
        return false;
    if (unit.mv == 0)
        return false;
    if (optionType == 'attack') {
        if (unit.terr == toTerr.id)
            return true;
        if (unit.subType == 'missile')
            return false;
        if (isArtillery(unit) && toTerr.nation == 99 && distObj.air == 1) {
            return true;
        }
        if (unit.type == 1 && toTerr.nation == 99)
            return false;
        if (unit.type == 1 && unit.returnFlg && unit.terr > 79)
            return false;
    }
    if (optionType == 'nuke' && unit.subType != 'missile')
        return false;
    if (optionType == 'bomb' && unit.piece != 7)
        return false;
    if (optionType == 'loadPlanes' || optionType == 'loadChoppers') {
        if ((unit.piece == 2 || unit.piece == 10 || unit.piece == 11) && (!unit.cargoOf || unit.cargoOf == 0))
            return true;
        else
            return false;
    }
    if (optionType == 'loadUnits') {
        if (unit.terr == toTerr.id && unit.type == 3)
            return true;
        if (distObj.air == 1 && unit.type == 1 && toTerr.transportSpace > 0)
            return true;
        if (unit.subType == 'fighter' && toTerr.carrierSpace > 0)
            return true;

        if (distObj.air == 0)
            return true;

        return false;
    }
    if (optionType == 'movement' && toTerr.nation == 99) {
        //water loading
        if (unit.subType == 'fighter' && toTerr.carrierSpace == 0)
            return false;
        if ((unit.subType == 'hero' || unit.subType == 'aa') && unit.terr <= 79 && toTerr.cargoSpace > 0 && distObj.air == 1)
            return true;
        if (unit.type == 1 && toTerr.transportSpace == 0)
            return false;
        if (unit.type == 1 && distObj.air != 1)
            return false;
    }
    if (unit.type == 1 && unit.terr >= 79) {
        if (distObj.air == 1 && toTerr.nation < 99)
            return true;
        else
            return false;
    }
    if (optionType == 'movement' && unit.type == 1 && toTerr.nation == 99 && distObj.air > 1) {
        return false; // cargo
    }
    if (optionType == 'movement' && unit.type == 1 && toTerr.nation == 99 && distObj.air == 1 && toTerr.transportSpace > 0) {
        return true; // cargo situation!!
    }
    if (optionType == 'movement' && unit.type == 2 && toTerr.nation == 99 && unit.cargoOf > 0 && unit.terr >= 79) {
        return false; // fighters
    }

    if (optionType == 'movement' && unit.piece == 7 && toTerr.nation == 99) {
        return false; // bombers
    }
    if (optionType == 'movement' && distObj.land == 0)
        return false;

    var movement = (optionType == 'attack' || optionType == 'bomb' || optionType == 'nuke') ? unit.moveAtt : unit.mv;
    if (unit.subType == 'missile' && distObj.air <= movement) {
        return true;
    }

    if (unit.type == 1 && distObj.land <= movement)
        return true;
    if ((unit.type == 2 || unit.type == 4 || unit.subType == 'missile') && distObj.air <= movement)
        return true;
    if (unit.type == 3 && distObj.sea <= movement - numberVal(unit.movesTaken))
        return true;

    return false;
}
function clearAllDistanceObjects(gameObj) {
    gameObj.territories.forEach(terr => {
        terr.distanceHash = {};
    });

}
function isTerrOwned(terr, nation) {
    if (!terr)
        return false;
    if (terr.owner == nation)
        return true;
    return terr.treatyStatus >= 3;

}
function resetAllPlayerDistanceObjects(gameObj, currentPlayer) {
    clearAllDistanceObjects(gameObj);
    var panamaOwned = isTerrOwned(gameObj.territories[51], currentPlayer.nation);
    var egyptOwned = isTerrOwned(gameObj.territories[39], currentPlayer.nation);
    var syriaOwned = isTerrOwned(gameObj.territories[36], currentPlayer.nation);
    currentPlayer.territories.forEach(terr => {
        var distanceHash = {};
        var borders = terr.borders.split('+');
        borders.forEach(terrId => {
            var sea = 9;
            if (terrId >= 79)
                sea = seaDistanceForCannals(1, terr.id, terr.id, terrId, panamaOwned, egyptOwned, syriaOwned);

            distanceHash[terrId] = { land: 1, air: 1, sea: sea };
        });
        terr.distanceHash = distanceHash;
    });
}
function findTheDistanceBetweenTwoTerrs(terr1, terr2, max, land, air, sea, allyHash, territories) {
    if (terr1.id == terr2.id) {
        //same territory
        return;
    }
    if (terr1.distanceHash && terr1.distanceHash[terr2.id]) {
        terr1.distObj = terr1.distanceHash[terr2.id];
        //console.log('got it!', terr1.name, terr2.name, terr1.distObj);
    } else {
        terr1.distObj = find1SpaceAway(terr1, terr2, max, land, air, sea, allyHash, territories);
        //console.log('aaa', terr1.distObj);
        terr1.distanceHash[terr2.id] = terr1.distObj;
        //console.log('needed it!', terr1.name, terr2.name, max, terr1.distObj);
    }
}
function find1SpaceAway(terr1, terr2, max, land, air, sea, allyHash, territories) {
    //console.log('find1SpaceAway', terr1.name, terr2.name);
    var borders = terr1.borders.split('+');
    var land = 9;
    var air = 9;
    var sea = 9;
    borders.forEach(terrId => {
        if (terrId == terr2.id) {
            air = 1;
            if (terrId < 79)
                land = 1;
            if (terrId >= 79) {
                sea = seaDistanceForCannals(1, terr1.id, terr2.id, terrId, territories[51].treatyStatus >= 3, territories[39].treatyStatus >= 3, territories[36].treatyStatus >= 3);
            }
        }
    });
    if (air == 1 || max == 1) {
        return { land: land, air: air, sea: sea };
    } else
        return find2SpacesAway(terr1, terr2, max, land, air, sea, allyHash, territories);
}
function find2SpacesAway(terr1, terr2, max, land, air, sea, allyHash, territories) {
    //console.log('find2SpacesAway', terr1.name, terr2.name, max, terr1.borders);
    var land = 9;
    var air = 9;
    var sea = 9;
    var reachableLandTerrHash = {}
    var reachableSeaTerrHash = {}
    var reachableAirTerrHash = {}
    var borders = terr1.borders.split('+');
    borders.forEach(terrId => {
        var nextTerr = territories[terrId - 1];
        var borders2 = nextTerr.borders.split('+');
        if (air > 2 || sea > 2 || air > 2) {

            var middleBlocked = isTerritoryBlocked(terr1.owner, nextTerr, allyHash);

            borders2.forEach(tid => {
                reachableAirTerrHash[tid] = true;
                if (!middleBlocked && tid < 79 && nextTerr.id < 79)
                    reachableLandTerrHash[tid] = true;
                if (!middleBlocked && tid >= 79 && nextTerr.id >= 79)
                    reachableSeaTerrHash[tid] = true;

                if (tid == terr2.id) {
                    air = 2;
                    if (!middleBlocked && tid < 79 && nextTerr.id < 79) {
                        land = 2;
                    }
                    if (!middleBlocked && tid >= 79 && nextTerr.id >= 79) {
                        sea = seaDistanceForCannals(2, terr1.id, terrId, tid, territories[51].treatyStatus >= 3, territories[39].treatyStatus >= 3, territories[36].treatyStatus >= 3);
                    }
                }
            });
        }

    });
    //console.log('find2SpacesAway', air, land, max);
    if (air == 2 && max == 2)
        return { land: land, air: air, sea: sea };
    else
        return find3SpacesAway(terr1, terr2, max, land, air, sea, allyHash, territories, reachableLandTerrHash, reachableAirTerrHash, reachableSeaTerrHash);
}
function find3SpacesAway(terr1, terr2, max, land, air, sea, allyHash, territories, reachableLandTerrHash, reachableAirTerrHash, reachableSeaTerrHash) {
    //console.log('find3SpacesAway', terr1.name, terr2.name, max, land, air, sea);
    var land = land;
    var air = air;
    var sea = sea;

    var borders = terr2.borders.split('+');
    borders.forEach(terrId => {
        var nextTerr = territories[terrId - 1];
        var middleBlocked = (isTerritoryBlocked(terr1.owner, nextTerr, allyHash));
        if (air > 3 && reachableAirTerrHash[nextTerr.id])
            air = 3;
        if (land > 3 && reachableLandTerrHash[nextTerr.id] && !middleBlocked && terrId < 79 && nextTerr.id < 79)
            land = 3;
        if (sea > 3 && reachableSeaTerrHash[nextTerr.id] && !middleBlocked && terrId >= 79 && nextTerr.id >= 79)
            sea = seaDistanceForCannals(3, terr1.id, terr2.id, terrId, territories[51].treatyStatus >= 3, territories[39].treatyStatus >= 3, territories[36].treatyStatus >= 3);

    });
    //console.log('find3SpacesAway', land, air, sea);
    if (air == 3 || max == 3)
        return { land: land, air: air, sea: sea };
    else
        return distanceBetweenTerrs(terr1, terr2, max, 0, 0, 0, allyHash, territories);
}
function seaDistanceForCannals(sea, t1Id, t2Id, t3Id, panamaOwnedFlg, egyptOwnedFlg, syriaOwnedFlg) {
    if (sea > 3)
        return sea
    if ((t1Id == 99 || t2Id == 99 || t3Id == 99) && (t1Id == 86 || t2Id == 86 || t3Id == 86)) {
        //panama
        if (!panamaOwnedFlg)
            sea = 9;
    }
    if ((t1Id == 115 || t2Id == 115 || t3Id == 115) && (t1Id == 118 || t2Id == 118 || t3Id == 118)) {
        //suez cannal
        if (!egyptOwnedFlg && !syriaOwnedFlg)
            sea = 9;
    }
    if (sea > 3) {
        console.log('cannal blocked!!');
    }
    return sea;
}
function distanceBetweenTerrs(terr1, terr2, max, land, air, sea, allyHash, territories) {
    //console.log('======>distanceBetweenTerrs', terr1.name, terr2.name, land, air, sea, max);
    if (terr1.id == terr2.id)
        return { land: land, air: air, sea: sea };

    land++;
    air++;
    sea++;
    var maxLand = 9;
    var maxAir = 9;
    var maxSea = 9;

    //return { land: 2, air: 2, sea: 2 };
    //------
    if (terr2.nation < 99)
        sea = 9;
    if ((terr1.id == 99 && terr2.id == 86) || (terr1.id == 86 && terr2.id == 99)) {
        //panama
        if (territories[51].treatyStatus < 3)
            sea = 9;
    }
    if ((terr1.id == 115 && terr2.id == 118) || (terr1.id == 118 && terr2.id == 115)) {
        //suez cannal
        if (territories[36].treatyStatus < 3 && territories[39].treatyStatus < 3)
            sea = 9;
    }

    //------
    //		if(air>=max || (terr1.defeatedByNation>0 && terr1.nation<99))
    //			return {land: maxLand, air: maxAir, sea: maxSea};
    //return {land: 1, air: 1, sea: 1};
    if (air >= max)
        return { land: land, air: air, sea: sea };
    //return { land: maxLand, air: maxAir, sea: maxSea };

    if (land > 1 && (terr1.defeatedByNation > 0)) // || terr1.attackedByNation > 0
        land = 9;

    //console.log('here', terr1.id, terr2.id, land, air);
    var neighbors = terr1.borders.split('+');
    for (var x = 0; x < neighbors.length; x++) {
        var id = neighbors[x];
        //			console.log(id, terr2.id, land);
        if (id == terr2.id) {
            return { land: land, air: air, sea: sea };
        }
        var terr = territories[id - 1];
        var nextLand = land;
        var nextSea = sea;
        if (terr.nation < 99) {
            nextSea = 9;
            if (isTerritoryBlocked(terr1.owner, terr, allyHash)) {
                nextLand = 9;
            }

        }
        if (terr.nation == 99) {
            nextLand = 9;
            if (isTerritoryBlocked(terr1.owner, terr, allyHash)) {
                nextSea = 9;
            }
        }

        var obj = distanceBetweenTerrs(terr, terr2, max, nextLand, air, nextSea, allyHash, territories);
        if (obj.land < maxLand)
            maxLand = obj.land;
        if (obj.air < maxAir)
            maxAir = obj.air;
        if (obj.sea < maxSea)
            maxSea = obj.sea;
    }
    return { land: maxLand, air: maxAir, sea: maxSea };
}
function isTerritoryBlocked(fromNation, terr, allyHash) {
    if (terr.nation < 99 && terr.defeatedByNation > 0)
        return true;
    if (terr.nation < 99 && terr.attackedByNation == fromNation)
        return true;
    if (terr.owner == fromNation || terr.unitCount == 0 || fromNation == 0)
        return false;
    if (allyHash[fromNation] == true)
        return false;
    if (allyHash[terr.owner] == true)
        return false;
    return true;
}
function selectAllUnits(terr, optionType, currentPlayer) {
    var t = document.getElementById('ter' + terr.id);
    var checked = (t && t.checked);
    for (var x = 0; x < terr.units.length; x++) {
        var unit = terr.units[x];
        var e = document.getElementById('unit' + unit.id);
        if (e && unit.piece != 13) // && cm
            e.checked = checked;
    }
}
function selectAllButtonChecked(moveTerr, checkFlg, optionType, currentPlayer) {
    for (var x = 0; x < moveTerr.length; x++) {
        var terr = moveTerr[x];
        var e = document.getElementById('ter' + terr.id);
        if (e)
            e.checked = checkFlg;
        selectAllUnits(terr, optionType, currentPlayer);
    }

}
function packageSelectedUnits(moveTerr, selectedTerritory) {
    var terr1Id = 1;
    var piece = 3;
    for (var x = 0; x < moveTerr.length; x++) {
        var terr = moveTerr[x];
        for (var u = 0; u < terr.units.length; u++) {
            var unit = terr.units[u];

            var e = document.getElementById('unit' + unit.id);
            if (e && e.checked) {
                terr1Id = unit.terr;
                piece = unit.piece;
            }
        }
    }
    return { t1: terr1Id, t2: selectedTerritory.id, id: piece };
}
function loadParatroopers(selectedTerritory, optinType) {
    var units = getSelectedUnits([selectedTerritory]);
    for (var x = 0; x < units.length; x++) {
        var unit = units[x];
        findBomberForParatrooper(unit, selectedTerritory, optinType);
    }
}
function findBomberForParatrooper(unit, selectedTerritory, optinType) {
    var selectedTransport;
    if (unit.cargoUnits == 0)
        unit.cargoUnits = cargoUnitsForUnit(unit);
    selectedTerritory.units.forEach(function (transport) {
        if (optinType == 'loadPlanes' && transport.piece == 7 && transport.movesLeft > 0 && transport.owner == unit.owner && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits)
            selectedTransport = transport;
        if (optinType == 'loadChoppers' && transport.piece == 50 && transport.movesLeft > 0 && transport.owner == unit.owner && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits)
            selectedTransport = transport;
    });
    if (selectedTransport)
        loadThisUnitOntoThisTransport(unit, selectedTransport);
    else
        console.log('no transport found!')
}
function moveSelectedUnits(moveTerr, selectedTerritory, gameObj, optionType) {
    var units = getSelectedUnits(moveTerr, gameObj);
    if (optionType == 'loadUnits')
        return loadTheseUnitsOntoSelectedTransport(units, selectedTerritory, gameObj);
    else
        return moveTheseUnitsToThisTerritory(units, selectedTerritory, gameObj);
}
function doubleCheckFighterCargo(terr, gameObj) {
    var emptyTransportHash = {};
    terr.units.forEach(function (unit) {
        if (unit.piece == 8) {
            if (unit.cargo && unit.cargo.length > 2) {
                unit.cargo = [];
                emptyTransportHash[unit.id] = true;
                console.log('xxx too much cargo!!!', unit.id);
            }
            if (!unit.cargo || unit.cargo.length == 0)
                emptyTransportHash[unit.id] = true;
            //loadThisUnitOntoThisTransport(unit, transport);
        }
    });
    var fightserNeedLoading = [];
    terr.units.forEach(function (unit) {
        if (unit.subType == 'fighter') {
            if (emptyTransportHash[unit.cargoOf]) {
                console.log('removing!!!');
                unit.cargoOf = 0;
            }
            if (unit.cargoOf > 0) {
                var carrier = findUnitOfId(unit.cargoOf, gameObj);
                if (!carrier || carrier.terr != terr.id) {
                    fightserNeedLoading.push(unit);
                }
            } else {
                fightserNeedLoading.push(unit);
            }
        }
    });
    fightserNeedLoading.forEach(function (fighter) {
        findTransportForThisCargo(fighter, terr, gameObj);
    });
}
function loadTheseUnitsOntoSelectedTransport(units, selectedTerritory, gameObj) {
    var piece = 2;
    var terr1Id = 1;
    var transport;
    units.forEach(function (unit) {
        if (unit.type == 3)
            transport = unit;
    });
    units.forEach(function (unit) {
        if (unit.type == 1) {
            loadThisUnitOntoThisTransport(unit, transport);
            piece = unit.piece;
            terr1Id = unit.terr;
            unit.terr = transport.terr;
        }
    });

    //squareUpAllCargo(units, gameObj);
    illuminateThisTerritory(selectedTerritory, gameObj);
    return { t1: terr1Id, t2: selectedTerritory.id, id: piece };
}
function moveTheseUnitsToThisTerritory(units, selectedTerritory, gameObj) {
    var terr1Id = 1;
    var piece = 1;
    for (var x = 0; x < units.length; x++) {
        var unit = units[x];
        terr1Id = unit.terr;
        if (unit.piece > piece)
            piece = unit.piece;
        unit.terr = selectedTerritory.id;
        if (unit.piece == 4) {
            var oneSpaceFlg = false;
            var terrIds = selectedTerritory.borders.split('+');
            terrIds.forEach(function (terrId) {
                var terr = gameObj.territories[terrId - 1];
                if (terr.id == terr1Id)
                    oneSpaceFlg = true;
            });
            if (oneSpaceFlg)
                unit.movesLeft--;
            else
                unit.movesLeft = 0;
        } else
            unit.movesLeft = 0;

        if (unit.cargoOf > 0 && unit.type == 1 && selectedTerritory.nation < 99) {
            removeThisUnitFromTransport(unit, gameObj);
        }
        if ((unit.type == 1 || unit.type == 2) && selectedTerritory.nation == 99)
            findTransportForThisCargo(unit, selectedTerritory, gameObj);

        //       if (unit.piece == 8 && unit.cargo.length == 0)
        //          seeIfCargoShouldBeThere(unit, gameObj);

        if (unit.cargo && unit.cargo.length > 0)
            moveCargoWithThisUnit(unit, gameObj, terr1Id);
    }
    //squareUpAllCargo(units, gameObj);
    illuminateThisTerritory(selectedTerritory, gameObj);
    return { t1: terr1Id, t2: selectedTerritory.id, id: piece };
}
function seeIfCargoShouldBeThere(carrier, gameObj) {
    return;
    gameObj.units.forEach(fighter => {
        if (fighter.subType == 'fighter' && fighter.nation == carrier.nation)
            console.log('fighter!!', fighter)
    });
}
function removeThisUnitFromTransport(unit, gameObj) {
    console.log('removeThisUnitFromTransport');
    var transport = findUnitOfId(unit.cargoOf, gameObj);
    if (transport && transport.cargo) {
        if (transport.piece == 4)
            transport.movesLeft = 0;
        var cargo = [];
        transport.cargo.forEach(cUnit => {
            if (cUnit.id != unit.id)
                cargo.push(cUnit);
        });
        transport.cargo = cargo;
    }
    unit.cargoOf = 0;
}
function moveCargoWithThisUnit(unit, gameObj, terr1Id) {
    console.log('xxxxmoveCargoWithThisUnit');
    unit.cargo.forEach(cUnit => {
        var cargo = findUnitOfId(cUnit.id, gameObj);
        if (cargo)
            cargo.terr = unit.terr;
    });
    for (var u = 0; u < gameObj.units.length; u++) {
        var cargo = gameObj.units[u];
        if (cargo.cargoOf && cargo.cargoOf == unit.id && cargo.owner == unit.owner && cargo.terr == terr1Id) {
            cargo.terr = unit.terr;
        }
    }
}
function findTransportForThisCargo(unit, terr, gameObj) {
    if (unit.type == 1 && unit.movesLeft == 0)
        unit.movesLeft = 2;
    if (unit.cargoUnits == 0)
        unit.cargoUnits = cargoUnitsForUnit(unit);
    if (unit.piece == 10 || unit.piece == 11 || unit.piece == 13) {
        // heros & AA guns onto ships
        var bestSub;
        var bestShip;
        for (var u = 0; u < terr.units.length; u++) {
            var ship = terr.units[u];
            if (ship.type == 3 && ship.owner == unit.owner && ship.piece != 5 && (!bestShip || ship.cas > bestShip.cas))
                bestShip = ship;
            if (ship.type == 3 && ship.owner == unit.owner && ship.piece == 5 && !bestSub)
                bestSub = ship;
        }
        if (bestShip) {
            loadThisUnitOntoThisTransport(unit, bestShip);
            return;
        }
        if (bestSub) {
            loadThisUnitOntoThisTransport(unit, bestSub);
            return;
        }
    }

    if (unit.type == 1) {
        console.log('findTransportForThisCargo', terr.name, unit.id, unit.piece);
        // load ground units onto transport ships
        for (var u = 0; u < terr.units.length; u++) {
            var transport = terr.units[u];
            if (transport.subType == 'transport' && transport.owner == unit.owner) {
                console.log('possible transport found!', transport.id, transport.cargoSpace, transport.cargoUnits, unit.cargoUnits)
                if (transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
                    console.log('this one!', transport.id);
                    loadThisUnitOntoThisTransport(unit, transport);
                    return;
                }
            }
        }
        console.log('none found!', terr.name, unit.id);
    }
    if (unit.subType == 'fighter') {
        // load fighter (search all units)
        //console.log('xxx loadThisUnitOntoThisTransport xxx', terr.id);
        var stillLooking = true;
        terr.units.forEach(carrier => {
            if (stillLooking && carrier.piece == 8 && unit.owner == carrier.owner && carrier.cargoSpace >= carrier.cargoUnits + unit.cargoUnits) {
                loadThisUnitOntoThisTransport(unit, carrier);
                stillLooking = false;
            }
        });
        return;
        /*
       for (var u = 0; u < gameObj.units.length; u++) {
           var transport = gameObj.units[u];
           if (transport.piece == 8 && unit.terr == terr.id && transport.owner == unit.owner) {
               console.log('how about this guy??', transport.terr, transport.cargoSpace, transport.cargoUnits, unit.cargoUnits)
               if (transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
                   loadThisUnitOntoThisTransport(unit, transport);
                   return;
               }
           }
       }*/
    }
    /*
    for (var u = 0; u < terr.units.length; u++) {
        // load fighter
        var transport = terr.units[u];
        if (transport.piece == 8 && transport.owner == unit.owner && unit.subType == 'fighter' && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
            loadThisUnitOntoThisTransport(unit, transport);
            return;
        }
    }*/

    console.log('no transport found!!!', unit.terr, unit.prevTerr);
    unit.terr = unit.prevTerr;
    showAlertPopup('no transport found!', 1);
}
function loadThisUnitOntoThisTransport(unit, transport) {
    //console.log('loadThisUnitOntoThisTransport');
    if (!unit) {
        showAlertPopup('no unit selected!', 1);
        return;
    }
    if (!transport) {
        showAlertPopup('no transport selected!', 1);
        return;
    }
    if (unit.owner != transport.owner) {
        showAlertPopup('transport and cargo are different owners!', 1);
        return;
    }
    if (!transport.cargoLoadedThisTurn)
        transport.cargoLoadedThisTurn = 0;

    if (unit.cargoUnits == 0) {
        unit.cargoUnits = cargoUnitsForUnit(unit);
        console.log('!!no cargo units!', unit.cargoUnits);
    }

    transport.cargoUnits += unit.cargoUnits;
    if (transport.cargoUnits > transport.cargoSpace) {
        showAlertPopup('Cargo Overload Issue', 1);
        console.log('Cargo Overload Issue', transport.piece, transport.cargoUnits, transport.cargoSpace);
        unit.terr = unit.prevTerr;
        return;
    }


    transport.cargoLoadedThisTurn += unit.cargoUnits;
    unit.cargoOf = transport.id;
    if (!transport.cargo)
        transport.cargo = [];

    var allowFlg = true;
    transport.cargo.forEach(c => {
        if (c.id == unit.id)
            allowFlg = false;
    });
    if (allowFlg)
        transport.cargo.push({ id: unit.id, piece: unit.piece, cargoUnits: unit.cargoUnits });
}
function refreshBoardFromMove(moveTerr, selectedTerritory, gameObj, superpowersData, currentPlayer, yourPlayer) {
    for (var x = 0; x < moveTerr.length; x++) {
        var terr = moveTerr[x];
        refreshTerritory(terr, gameObj, currentPlayer, superpowersData, yourPlayer);
    }
    refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, yourPlayer);
}
function expectedHitsFromStrength(strength) {
    if (strength >= 18)
        return parseInt(strength / 6);
    else
        return (strength / 6).toFixed(1);
}
function showUnits1TerritoryAway(optionType, gameObj, currentPlayer, totalMoveTerrs, selectedTerritory) {
    //return;
    var borders = selectedTerritory.borders.split('+');
    var moveTerr = [];
    var allyHash = {};
    currentPlayer.allies.forEach(function (ally) {
        allyHash[ally] = true;
    });

    borders.forEach(border => {
        var tid = parseInt(border);
        var terr = gameObj.territories[tid - 1];
        //terr.distObj = distanceBetweenTerrs(terr, selectedTerritory, 2, 0, 0, 0, allyHash, gameObj.territories); // old method
        findTheDistanceBetweenTwoTerrs(terr, selectedTerritory, 1, 0, 0, 0, allyHash, gameObj.territories);
        var moveUnits = 0;
        terr.units.forEach(function (unit) {
            unit.allowMovementFlg = false;
            if (checkMovement(terr.distObj, unit, optionType, currentPlayer, selectedTerritory)) {
                moveUnits++;
                unit.allowMovementFlg = true;
            }
        });
        terr.movableUnitCount = moveUnits;
        if (moveUnits > 0)
            moveTerr.push(terr);

    });
    return moveTerr;
}
function maxDistForTerr(optionType, terr, currentPlayer) {
    var maxDist = 8;
    if (!currentPlayer.tech[15])
        maxDist = 6;

    if (optionType == 'nuke')
        maxDist = 6;
    if (optionType == 'attack' || optionType == 'bomb') {
        maxDist = 5;
        if (!currentPlayer.tech[15])
            maxDist = 3;
        if (maxDist > 3 && terr.bomberCount == 0)
            maxDist = 3;
    }
    if (optionType == 'cruise')
        maxDist = 1;


    return maxDist;
}
function showUnitsForMovementBG2(optionType, gameObj, currentPlayer, totalMoveTerrs, selectedTerritory) {
    if (optionType == 'loadPlanes' || optionType == 'loadChoppers')
        totalMoveTerrs = [selectedTerritory];
    var moveTerr = [];
    var totalUnitsThatCanMove = 0;


    var allyHash = {};
    currentPlayer.allies.forEach(function (ally) {
        allyHash[ally] = true;
    });
    for (var x = 0; x < totalMoveTerrs.length; x++) {
        var terr = totalMoveTerrs[x];
        var maxDist = maxDistForTerr(optionType, terr, currentPlayer);
        //terr.distObj = distanceBetweenTerrs(terr, selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
        //console.log('xxx1', terr.name, terr.distObj);
        findTheDistanceBetweenTwoTerrs(terr, selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
        var moveUnits = 0;
        terr.units.forEach(function (unit) {
            unit.allowMovementFlg = false;
            if (checkMovement(terr.distObj, unit, optionType, currentPlayer, selectedTerritory)) {
                moveUnits++;
                unit.allowMovementFlg = true;
            }
        });
        terr.movableUnitCount = moveUnits;
        totalUnitsThatCanMove += moveUnits;
        if (terr.unitCount > 0 || terr.movableTroopCount > 0)
            moveTerr.push(terr);
    }
    return { totalUnitsThatCanMove: totalUnitsThatCanMove, moveTerr: moveTerr };
}
function countNumberUnitsChecked(terr, unit, currentPlayer) {
    var max = 0;
    var count = 0;
    for (var i = 0; i < terr.units.length; i++) {
        var u = terr.units[i];
        if (u.piece == unit.piece) {
            max++;
            var e = document.getElementById('unit' + u.id);
            if (e && e.checked)
                count++;
        }
    }
    return { count: count, max: max };
}
function checkThisNumberBoxesForUnit(piece, num, terr) {
    var totalChecked = 0;
    for (var i = 0; i < terr.units.length; i++) {
        var u = terr.units[i];
        if (u.piece == piece) {
            var e = document.getElementById('unit' + u.id);
            if (e) {
                if (e.checked && totalChecked >= num)
                    e.checked = false;
                else if (!e.checked && totalChecked < num)
                    e.checked = true;
                if (e.checked)
                    totalChecked++;
            }
        }
    }
}
function checkSendButtonStatus(u, moveTerr, optionType, selectedTerritory, player, gameObj, superpowersData) {
    var transportCargo = selectedTerritory.transportCargo;
    var carrierCargo = selectedTerritory.carrierCargo;
    var moveOrLoadFlg = (optionType == 'movement' || optionType == 'loadUnits');
    var numUnits = 0;
    var expectedHits = 0;
    var numNukes = 0;
    var checkAGroundUnitFlg = false;
    var checkAGroundUnitID = '';
    var artlleryChecked = false;
    var artTerr = 0;
    if (u && (u.piece == 1 || u.piece == 24 || u.piece == 33 || u.piece == 38)) {
        artlleryChecked = true;
        artTerr = u.terr;
    }
    var selectedUnitForm = 0;
    var artCount = 0;
    var soldierCount = 0;
    var specOpsCount = 0;
    var sealCount = 0;
    var nonSealCount = 0;
    var spotterCount = 0;
    var fightersSelected = 0;
    var carriersSelected = 0;
    var cargoUnitsSelected = 0;
    var cargoSpaceSelected = 0;
    var selectedShips = 0;
    var selectedShipPiece = 0;
    var fighterUnitClicked;
    var bomberUnit;
    var specOpsUnit = false;
    var includesGeneral = false;
    var lastSelectedUnit;
    var infParatrooperCount = selectedTerritory.infParatrooperCount;
    var specialUnitHash = {};
    var selectedUnitCounts = {};
    var totalUnitCounts = {};
    var selectedSoldierCount = 0;
    var selectedFighterCount = 0;
    for (var x = 0; x < moveTerr.length; x++) {
        var ter = moveTerr[x];
        for (var i = 0; i < ter.units.length; i++) {
            var unit = ter.units[i];
            if (u && unit.terr == u.terr) {
                if (totalUnitCounts[unit.piece] > 0)
                    totalUnitCounts[unit.piece]++;
                else
                    totalUnitCounts[unit.piece] = 1;
            }
            var e = document.getElementById('unit' + unit.id);
            if (e) {
                if (e && checkAGroundUnitID.length == 0 && !e.checked && unit.piece == 2 && unit.terr == artTerr) {
                    if (unit.allowMovementFlg)
                        checkAGroundUnitID = 'unit' + unit.id;
                }
                if (e && e.checked) {
                    lastSelectedUnit = e;
                    cargoUnitsSelected += unit.cargoUnits;
                    cargoSpaceSelected += unit.cargoSpace;
                    if (unit.subType == 'fighter') {
                        fighterUnitClicked = e;
                        fightersSelected++;
                    }
                    if (unit.subType == 'soldier')
                        selectedSoldierCount++;
                    if (unit.subType == 'vehicle')
                        selectedSoldierCount += 2;
                    if (unit.subType == 'fighter')
                        selectedFighterCount++;
                    if (unit.piece == 8)
                        carriersSelected++;
                    if (u && unit.terr == u.terr) {
                        if (selectedUnitCounts[unit.piece] > 0)
                            selectedUnitCounts[unit.piece]++;
                        else
                            selectedUnitCounts[unit.piece] = 1;
                        selectedUnitForm = u.terr;
                    }
                    if (!specialUnitHash[unit.piece])
                        specialUnitHash[unit.piece] = 0;
                    specialUnitHash[unit.piece]++;
                    if (unit.type == 3) {
                        selectedShips++;
                        selectedShipPiece = unit.piece;
                    }
                    if (optionType == 'loadUnits' && selectedShips > 1) {
                        showAlertPopup('Only select one ship.', 1);
                        e.checked = false;
                        selectedShips--;
                    }
                    if (optionType == 'loadUnits') {
                        if (cargoUnitsSelected > selectedTerritory.cargoSpaceSelected) {
                            cargoUnitsSelected -= unit.cargoUnits;
                            e.checked = false;
                            showAlertPopup('Not enough room.', 1);
                        }
                    }
                    if (unit.piece >= 20 && optionType == 'attack' && specialUnitHash[unit.piece] > 6) {
                        showAlertPopup('Maximum of 6 ' + superpowersData.units[unit.piece].name + ' units per battle.', 1);
                        e.checked = false;
                    }

                    if ((unit.piece == 23 || unit.piece == 25 || unit.piece == 41 || unit.piece == 42) && optionType == 'attack' && selectedTerritory.unitCount == 0) {
                        showAlertPopup('No target for your ' + superpowersData.units[unit.piece].name + '.', 1);
                        e.checked = false;
                    }
                    if (unit.piece == 7 && optionType == 'attack' && unit.cargo && unit.cargo.length > 0) {
                        bomberUnit = e;
                    }
                    if (unit.piece == 43 && selectedTerritory.nation == 99) {
                        showAlertPopup('Drones cannot fly over water.', 1);
                        e.checked = false;
                    }
                    if (unit.piece == 44 && optionType == 'attack') {
                        if (selectedTerritory.id > 79) {
                            showAlertPopup('Seals cannot attack ships.', 1);
                            e.checked = false;
                        }
                        if (selectedTerritory.generalFlg || selectedTerritory.leaderFlg) {
                            showAlertPopup('Seals cannot attack if hero is present', 1);
                            e.checked = false;
                        }
                        if (selectedTerritory.owner == 0) {
                            showAlertPopup('Seals can ONLY attack other players', 1);
                            e.checked = false;
                        }
                        if (nonSealCount > 0) {
                            showAlertPopup('No seals with regular troops', 1);
                            e.checked = false;
                        } else
                            sealCount++;
                    } else {
                        if (sealCount > 0) {
                            showAlertPopup('No mixing Seals with regular troops', 1);
                            e.checked = false;
                        } else
                            nonSealCount++;
                    }

                    if (unit.piece == 10)
                        includesGeneral = true;
                    if (unit.piece == 35)
                        specOpsCount++;
                    if (unit.type == 4 || (unit.type == 1 && !unit.returnFlg))
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
                    if (u && artlleryChecked && 'unit' + u.id == e.id) {
                        checkAGroundUnitFlg = true;
                    }
                    if (optionType == 'loadPlanes' && infParatrooperCount > selectedTerritory.bomberCount * 2) {
                        showAlertPopup('Not enough room on your bombers. Removing items.', 1);
                        e.checked = false;
                    }
                    if (selectedTerritory.id >= 79 && moveOrLoadFlg) {
                        if (transportCargo > selectedTerritory.transportSpace) {
                            if (selectedTerritory.transportSpace > 0)
                                showAlertPopup('Not enough room on your transports. Removing items.', 1);
                            else
                                showAlertPopup('No transports there!', 1);
                            e.checked = false;
                        }
                        if (unit.subType == 'fighter' && moveOrLoadFlg && carrierCargo > selectedTerritory.carrierSpace) {
                            if (selectedTerritory.carrierSpace > 0)
                                showAlertPopup('Not enough room on your carriers. Removing fighters.', 1);
                            else
                                showAlertPopup('No carriers there!', 1);
                            e.checked = false;
                        }
                    }
                    //                   if (unit.piece == 28 && optionType == 'attack' && unit.terr >= 79) {
                    //                       showAlertPopup('Medics cannot attack from transports.', 1);
                    //                      e.checked = false;
                    //                  }
                    if (unit.type == 1 && unit.returnFlg && optionType == 'attack' && unit.terr >= 79) {
                        showAlertPopup(unit.name + ' cannot attack from transports.', 1);
                        e.checked = false;
                    }
                    if (unit.piece == 35 && optionType == 'attack' && spotterCount == 0) {
                        specOpsUnit = e;
                    }
                    if (unit.piece == 2)
                        expectedHits++;
                    else
                        expectedHits += unit.att * unit.numAtt;
                    if (unit.piece == 41)
                        expectedHits += 6;
                    if (unit.piece == 14)
                        numNukes++;
                    if (unit.piece == 52)
                        numNukes += 3;
                    numUnits++;
                }
            }
        }

    }
    if (optionType == 'loadUnits') {
        selectedTerritory.cargoSpaceSelected = cargoSpaceSelected;
        if (cargoUnitsSelected > cargoSpaceSelected && lastSelectedUnit && lastSelectedUnit.checked) {
            lastSelectedUnit.checked = false;
            showAlertPopup('Not enough room.', 1);
        }
    }
    if (bomberUnit && spotterCount == 0) {
        showAlertPopup('You need ground troops to include paratroopers!', 1);
        bomberUnit.checked = false;
    }
    if (moveOrLoadFlg && fighterUnitClicked && selectedTerritory.nation == 99 && selectedTerritory.carrierSpace == 0 && carriersSelected == 0) {
        fighterUnitClicked.checked = false;
        if (selectedTerritory.unitCount > 0)
            showAlertPopup('No available carrier for your fighter!', 1);
        else
            showAlertPopup('Fighters cannot move to water zones', 1);
    }
    //   if (fightersSelected > 0 && selectedTerritory.nation == 99)
    //       console.log('fighter situation', fightersSelected, carriersSelected, selectedTerritory.carrierSpace, carrierCargo);
    if (u) {
        selectedFormUnit = { piece: u.piece, max: totalUnitCounts[u.piece], num: selectedUnitCounts[u.piece] };
        if (selectedUnitForm > 0 && totalUnitCounts[u.piece] < 5)
            selectedUnitForm = 0;
        var numSelected = 0;
        if (selectedUnitCounts[u.piece] && selectedUnitCounts[u.piece] > 0)
            numSelected = selectedUnitCounts[u.piece];
    }

    if (specOpsUnit && optionType == 'attack' && spotterCount == 0) {
        showAlertPopup('You need at least one ground unit to attack with your special ops.', 1);
        specOpsUnit.checked = false;
        numUnits = 0;
    }
    if (includesGeneral)
        expectedHits += soldierCount;
    if (optionType == 'attack' && checkAGroundUnitFlg && checkAGroundUnitID.length > 0 && artCount - 1 >= soldierCount) {
        var e = document.getElementById(checkAGroundUnitID);
        if (e && !e.checked)
            e.checked = true;
    }

    //-----------------recheck
    var units = [];
    for (var x = 0; x < moveTerr.length; x++) {
        var ter = moveTerr[x];
        for (var i = 0; i < ter.units.length; i++) {
            var unit = ter.units[i];

            var isTransport = (selectedShipPiece == 4 || selectedShipPiece == 45 || selectedShipPiece == 49);
            if (optionType == 'loadUnits' && unit.type == 1)
                unit.allowMovementFlg = (isTransport && selectedShips > 0 && unit.movesLeft > 0 && unit.mv > 0 && ter.distObj.air == 1);
            if (optionType == 'loadUnits' && unit.type == 2)
                unit.allowMovementFlg = (selectedShipPiece == 8 && selectedShips > 0 && unit.movesLeft > 0 && unit.mv > 0);
            if (optionType == 'loadUnits' && (unit.piece == 10 || unit.piece == 11 || unit.piece == 13))
                unit.allowMovementFlg = (selectedShips > 0 && unit.movesLeft > 0 && unit.mv > 0 && ter.distObj.air == 1);

            var e = document.getElementById('unit' + unit.id);
            if (e && e.checked) {
                units.push(unit);
            }
        }
    }
    var defendingUnits = [];
    selectedTerritory.units.forEach(unit => {
        defendingUnits.push(unit);
    });

    var obj = getBattleAnalysis({ attackUnits: units, defendingUnits: defendingUnits, cruiseFlg: (optionType == 'cruise') }, selectedTerritory, player, gameObj, optionType);
    obj.selectedSoldierCount = selectedSoldierCount;
    obj.selectedFighterCount = selectedFighterCount;

    //   var remaingCargo = selectedTerritory.realCargoSpace - selectedTerritory.cargoUnits - (selectedSoldierCount*10) - (selectedVehicleCount*20);
    //   obj.soldierSlotsOpen = Math.floor(remaingCargo/10);
    //   obj.vehicleSlotsOpen = Math.floor(remaingCargo/20);

    obj.soldierSlotsOpen = selectedTerritory.transportSpace - selectedTerritory.transportCargo - selectedSoldierCount;
    obj.vehicleSlotsOpen = Math.floor((selectedTerritory.transportSpace - selectedTerritory.transportCargo - selectedSoldierCount) / 2);
    obj.fighterSlotsOpen = selectedTerritory.carrierSpace - selectedTerritory.carrierCargo - selectedFighterCount;
    if (optionType == 'cruise')
        obj.expectedLosses = 0;
    if (optionType == 'nuke')
        obj.expectedLosses = units.length;

    return obj;
}
function expectedHitsFromHits(num) {
    if (num >= 18)
        return parseInt(num / 6);
    else
        return (num / 6).toFixed(1);
}
function maximumPossibleNukeHitsForTerr(terr, player, gameObj) {
    if (!terr || !terr.name) {
        console.log('!!! no terr sent to maximumPossibleNukeHitsForTerr');
        return 0;
    }
    var hits = 12;
    if (player.tech[4])
        hits += 3;
    if (player.tech[5])
        hits += 3;
    var adCount = terr.adCount;
    if (adCount > 3)
        adCount = 3;
    var blocked = adCount * 2;
    if (terr.owner > 0) {
        var defender = playerOfNation(terr.owner, gameObj);
        if (defender && defender.tech && defender.tech[18])
            blocked *= 2;
    }
    var finalHits = hits - blocked;
    if (terr.nation == 99) {
        finalHits = Math.floor(finalHits / 3);
        //			finalHits/=3;
    }
    return finalHits;
}
function autoButtonPressed(selectedTerritory, moveTerr, optionType, player) {
    var checked = true;
    var attStrength = 0;
    var defStrength = selectedTerritory.defStrength * 1.2 + 10;
    var groundUnits = 0;
    var infantryCount = 0;
    var artilleryCount = 0;
    moveTerr.forEach(function (terr) {
        var t1 = document.getElementById('ter' + terr.id);
        if (t1)
            t1.checked = checked;
        for (var x = 0; x < terr.units.length; x++) {
            var unit = terr.units[x];
            var e = document.getElementById('unit' + unit.id);
            if (e && unit.allowMovementFlg && unit.piece != 13) {
                var infNeeded = false;
                var groundUnitsNeeded = false;
                if (infantryCount < 2 && unit.piece == 2)
                    infNeeded = true;
                if (groundUnits < 2 && unit.type == 1)
                    groundUnitsNeeded = true;

                if (unit.piece == 11 || unit.piece == 13 || unit.piece == 7)
                    continue;
                if (unit.piece == 1 && artilleryCount >= selectedTerritory.unitCount)
                    continue;
                if (attStrength < defStrength || unit.piece == 1 || unit.piece == 10 || infNeeded || groundUnitsNeeded) {
                    attStrength += unit.att;
                    if (unit.type == 1)
                        groundUnits++;
                    if (unit.piece == 2)
                        infantryCount++;
                    if (unit.piece == 1)
                        artilleryCount++;
                    e.checked = checked;
                }
            }
        }
    });
}
function autoLoadButtonPressed(selectedTerritory, moveTerr, optionType, player) {
    var checked = true;
    var cargoSpace = selectedTerritory.cargoSpace;
    var cargoUnits = selectedTerritory.cargoUnits;
    moveTerr.forEach(function (terr) {
        var t1 = document.getElementById('ter' + terr.id);
        if (t1)
            t1.checked = checked;
        for (var x = 0; x < terr.units.length; x++) {
            var unit = terr.units[x];
            var e = document.getElementById('unit' + unit.id);
            if (e && unit.allowMovementFlg && unit.piece != 13) {
                if (unit.piece != 2 && unit.piece != 10 && unit.piece != 11)
                    continue;
                if (unit.piece != 2 || cargoSpace - cargoUnits > 10) {
                    e.checked = checked;
                    cargoUnits += 10;
                }
            }
        }
    });
    if (cargoSpace - cargoUnits < 20)
        return;
    // now load tanks
    moveTerr.forEach(function (terr) {
        var t1 = document.getElementById('ter' + terr.id);
        if (t1)
            t1.checked = checked;
        for (var x = 0; x < terr.units.length; x++) {
            var unit = terr.units[x];
            var e = document.getElementById('unit' + unit.id);
            if (e && unit.allowMovementFlg && unit.piece != 13) {
                if (unit.subType != 'vehicle')
                    continue;
                if (cargoSpace - cargoUnits > 20) {
                    e.checked = checked;
                    cargoUnits += 20;
                }
            }
        }
    });
}
function getSelectedUnits(moveTerr, gameObj) {
    var units = [];
    moveTerr.forEach(function (terr) {
        var t1 = document.getElementById('ter' + terr.id);
        for (var x = 0; x < terr.units.length; x++) {
            var unit = terr.units[x];
            var e = document.getElementById('unit' + unit.id);
            if (e && e.checked) {
                unit.dice = [];
                for (var i = 0; i < unit.numAtt; i++)
                    unit.dice.push('dice.png');
                units.push(unit);
                if (gameObj && (unit.piece == 7 || unit.piece == 50) && unit.cargo && unit.cargo.length > 0) {
                    console.log('adding cargo!');
                    gameObj.units.forEach(function (cargoUnit) {
                        if (cargoUnit.cargoOf == unit.id) {
                            console.log('cargo added!', cargoUnit.piece)
                            units.push(cargoUnit);
                        }
                    });
                }
            }
        }
    });
    return units;
}
function verifyUnitsAreLegal(units, terr) {
    if (units.length == 0) {
        showAlertPopup('No units selected!', 1);
        return false;
    }
    var artillery = 0;
    var spotters = 0;
    units.forEach(function (unit) {
        if (isArtillery(unit))
            artillery++;
        else
            if (unit.type == 1)
                spotters++;
    });
    if (artillery > spotters && terr.nation < 99) {
        showAlertPopup('You need ' + (artillery - spotters) + ' more infantry or spotters for your artillery!', 1);
        return false;
    }
    return true;
}
function isArtillery(unit) {
    if (unit.piece == 1 || unit.piece == 24 || unit.piece == 33 || unit.piece == 35 || unit.piece == 38)
        return true;
    else
        return false;
}
