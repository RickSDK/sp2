
function checkMovement(distObj, unit, optionType, currentPlayer, toTerr) {
    //console.log('cm', distObj, optionType);
    if (unit.owner != currentPlayer.nation)
        return false;
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
        if (unit.subType == 'missile')
            return false;
        if (isArtillery(unit) && toTerr.nation == 99 && distObj.air == 1) {
            return true;
        }
        if (unit.type == 1 && toTerr.nation == 99)
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
        if (distObj.air == 1 && unit.type == 1)
            return true;
        if (unit.subType == 'fighter')
            return true;

        return false;
    }
    if (optionType == 'loadUnits') {
        if (distObj.air == 0)
            return true;
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
    if (optionType == 'movement' && unit.type == 2 && toTerr.nation == 99 && unit.cargoOf > 0) {
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
function distanceBetweenTerrs(terr1, terr2, max, land, air, sea, allyHash, territories) {
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
        return { land: maxLand, air: maxAir, sea: maxSea };

    if (land > 1 && (terr1.defeatedByNation > 0 || terr1.attackedByNation > 0))
        land = 9;

    //		console.log('here', terr1.id, terr2.id, land);
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
            if (isTerritoryBlocked(terr1.owner, terr, allyHash))
                nextSea = 9;
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
    if (terr.owner == fromNation || terr.unitCount == 0)
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
        if (optinType == 'loadPlanes' && transport.piece == 7 && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits)
            selectedTransport = transport;
        if (optinType == 'loadChoppers' && transport.piece == 50 && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits)
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
        if (unit.cargo && unit.cargo.length > 0)
            moveCargoWithThisUnit(unit, gameObj, terr1Id);
    }
    //squareUpAllCargo(units, gameObj);
    illuminateThisTerritory(selectedTerritory, gameObj);
    return { t1: terr1Id, t2: selectedTerritory.id, id: piece };
}
function removeThisUnitFromTransport(unit, gameObj) {
    console.log('removeThisUnitFromTransport');
    var transport = findUnitOfId(unit.cargoOf, gameObj);
    if (transport && transport.cargo) {
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
        // load ground units onto transport ships
        for (var u = 0; u < terr.units.length; u++) {
            var transport = terr.units[u];
            if (transport.subType == 'transport' && transport.owner == unit.owner) {
                if (transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
                    loadThisUnitOntoThisTransport(unit, transport);
                    return;
                }
            }
        }

    }
    for (var u = 0; u < terr.units.length; u++) {
        // load fighter
        var transport = terr.units[u];
        if (transport.piece == 8 && transport.owner == unit.owner && unit.subType == 'fighter' && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
            loadThisUnitOntoThisTransport(unit, transport);
            return;
        }
    }
    if (unit.subType == 'fighter') {
        // load fighter (search all units)
        for (var u = 0; u < gameObj.units.length; u++) {
            var transport = gameObj.units[u];
            if (transport.piece == 8 && unit.terr == terr.id && transport.owner == unit.owner) {
                if (transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
                    loadThisUnitOntoThisTransport(unit, transport);
                    return;
                }
            }
        }
    }
    cleanup
    console.log('no transport found!!!', unit, terr.units.length);
    //unit.terr = unit.prevTerr;
    //showAlertPopup('no transport found!', 1);
}
function loadThisUnitOntoThisTransport(unit, transport) {
    console.log('loadThisUnitOntoThisTransport');
    if (!unit || !transport || unit.owner != transport.owner) {
        console.log('!!unit', unit);
        console.log('!!transport', transport);
        showAlertPopup('invalid cargo', 1);
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
    //    console.log('xxx', transport.id, unit.cargoUnits, transport.cargoUnits, unit.cargoOf);
    if (!transport.cargo)
        transport.cargo = [];
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
    var borders = selectedTerritory.borders.split('+');
    var moveTerr = [];
    var allyHash = {};
    currentPlayer.allies.forEach(function (ally) {
        allyHash[ally] = true;
    });

    borders.forEach(border => {
        var tid = parseInt(border);
        var terr = gameObj.territories[tid - 1];
        terr.distObj = distanceBetweenTerrs(terr, selectedTerritory, 2, 0, 0, 0, allyHash, gameObj.territories);
        var moveUnits = 0;
        terr.units.forEach(function (unit) {
            unit.allowMovementFlg = false;
            if (checkMovement(terr.distObj, unit, optionType, currentPlayer, selectedTerritory)) {
                moveUnits++;
                unit.allowMovementFlg = true;
            }
        });
        if (moveUnits > 0)
            moveTerr.push(terr);

    });
    return moveTerr;
}
function showUnitsForMovementBG2(optionType, gameObj, currentPlayer, totalMoveTerrs, selectedTerritory) {
    if (optionType == 'loadPlanes' || optionType == 'loadChoppers')
        totalMoveTerrs = [selectedTerritory];
    var moveTerr = [];
    var totalUnitsThatCanMove = 0;
    var maxDist = 8;
    if (optionType == 'nuke')
        maxDist = 6;
    if (optionType == 'attack' || optionType == 'bomb')
        maxDist = 5;
    if (optionType == 'cruise')
        maxDist = 2;

    var allyHash = {};
    currentPlayer.allies.forEach(function (ally) {
        allyHash[ally] = true;
    });
    for (var x = 0; x < totalMoveTerrs.length; x++) {
        var terr = totalMoveTerrs[x];
        terr.distObj = distanceBetweenTerrs(terr, selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
        //console.log(terr.name, terr.distObj);
        var moveUnits = 0;
        terr.units.forEach(function (unit) {
            unit.allowMovementFlg = false;
            if (checkMovement(terr.distObj, unit, optionType, currentPlayer, selectedTerritory)) {
                moveUnits++;
                unit.allowMovementFlg = true;
            }
        });
        totalUnitsThatCanMove += moveUnits;
        if (moveUnits > 0)
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
    var selectedUnitCounts = {}
    var totalUnitCounts = {}
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
                        if (moveOrLoadFlg && carrierCargo > selectedTerritory.carrierSpace) {
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
        showAlertPopup('No room for your fighter!', 1);
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
                unit.allowMovementFlg = (isTransport && selectedShips > 0 && unit.movesLeft > 0 && unit.mv > 0);
            if (optionType == 'loadUnits' && unit.type == 2)
                unit.allowMovementFlg = (selectedShipPiece == 8 && selectedShips > 0 && unit.movesLeft > 0 && unit.mv > 0);
            if (optionType == 'loadUnits' && (unit.piece == 10 || unit.piece == 11 || unit.piece == 13))
                unit.allowMovementFlg = (selectedShips > 0 && unit.movesLeft > 0 && unit.mv > 0);

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

    var obj = getBattleAnalysis({ attackUnits: units, defendingUnits: defendingUnits, cruiseFlg: (optionType == 'cruise') }, selectedTerritory, player, gameObj);
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
    if (unit.piece == 1 || unit.piece == 24 || unit.piece == 33 || unit.piece == 38)
        return true;
    else
        return false;
}
