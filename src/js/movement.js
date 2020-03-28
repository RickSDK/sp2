
function checkMovement(distObj, unit, optionType, currentPlayer, toTerr) {
    //   if (unit.owner != currentPlayer.nation)
    //       return false;
    if (optionType == 'cruise') {
        if (distObj.air > 1)
            return false;
        if (unit.piece != 5 && unit.piece != 9 && unit.piece != 12 && unit.piece != 39)
            return false;
        if (unit.piece != 39 && !currentPlayer.tech[7])
            return false;

        return true;
    }
    if (unit.movesLeft == 0)
        return false;
    if (unit.mv == 0)
        return false;
    if (optionType == 'attack' && unit.subType == 'missile')
        return false;
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
    if (optionType == 'movement' && distObj.land == 0)
        return false;
    var movement = (optionType == 'attack' || optionType == 'bomb' || optionType == 'nuke') ? unit.moveAtt : unit.mv;
    if (unit.type == 1 && distObj.land <= movement)
        return true;
    if ((unit.type == 2 || unit.type == 4 || unit.subType == 'missile') && distObj.air <= movement)
        return true;
    if (unit.type == 3 && distObj.sea <= movement - numberVal(unit.movesTaken))
        return true;
    return false;
}
function selectAllUnits(terr, optionType, currentPlayer) {
    var t = document.getElementById('ter' + terr.id);
    var checked = (t && t.checked);
    for (var x = 0; x < terr.units.length; x++) {
        var unit = terr.units[x];
        var cm = checkMovement(terr.distObj, unit, optionType, currentPlayer, terr);
        var e = document.getElementById('unit' + unit.id);
        if (e && cm && unit.piece != 13)
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
    units.forEach(function (unit) {
        findBomberForParatrooper(unit, selectedTerritory, optinType);
    });
}
function findBomberForParatrooper(unit, selectedTerritory, optinType) {
    var selectedTransport;
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
function moveSelectedUnits(moveTerr, selectedTerritory) {
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
                unit.terr = selectedTerritory.id;
                if (unit.piece == 4)
                    unit.movesLeft--;
                else
                    unit.movesLeft = 0;
                if (unit.cargoOf > 0 && unit.type == 1 && selectedTerritory.nation < 99)
                    unit.cargoOf = 0;
                if ((unit.type == 1 || unit.type == 2) && selectedTerritory.nation == 99)
                    findTransportForThisCargo(unit, selectedTerritory);
                if (unit.cargo && unit.cargo.length > 0)
                    moveCargoWithThisUnit(unit, terr);
            }
        }
    }
    return { t1: terr1Id, t2: selectedTerritory.id, id: piece };
}
function moveCargoWithThisUnit(unit, terr) {
    for (var u = 0; u < terr.units.length; u++) {
        var cargo = terr.units[u];
        if (cargo.cargoOf && cargo.cargoOf == unit.id) {
            cargo.terr = unit.terr;
        }
    }
}
function findTransportForThisCargo(unit, terr) {
    unit.movesLeft = 2;
    if (unit.piece == 10 || unit.piece == 11 || unit.piece == 13) {
        var bestShip;
        for (var u = 0; u < terr.units.length; u++) {
            var ship = terr.units[u];
            if (ship.type == 3 && (!bestShip || ship.cas > bestShip.cas))
                bestShip = ship;
        }
        loadThisUnitOntoThisTransport(unit, bestShip);
        return;
    }
    for (var u = 0; u < terr.units.length; u++) {
        var transport = terr.units[u];
        if (transport.piece != 8 && unit.type == 1 && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
            loadThisUnitOntoThisTransport(unit, transport);
            return;
        }
    }
    for (var u = 0; u < terr.units.length; u++) {
        var transport = terr.units[u];
        if (transport.piece == 8 && transport.cargoSpace >= transport.cargoUnits + unit.cargoUnits) {
            loadThisUnitOntoThisTransport(unit, transport);
            return;
        }
    }
}
function loadThisUnitOntoThisTransport(unit, transport) {
    if (!transport.cargoLoadedThisTurn)
        transport.cargoLoadedThisTurn = 0;
    transport.cargoUnits += unit.cargoUnits;
    transport.cargoLoadedThisTurn += unit.cargoUnits;
    unit.cargoOf = transport.id;
    if (!transport.cargo)
        transport.cargo = [];
    transport.cargo.push({ id: unit.id, piece: unit.piece, cargoUnits: unit.cargoUnits });
}
function refreshBoardFromMove(moveTerr, selectedTerritory, gameObj, superpowersData, currentPlayer) {
    for (var x = 0; x < moveTerr.length; x++) {
        var terr = moveTerr[x];
        refreshTerritory(terr, gameObj, currentPlayer, superpowersData, currentPlayer);
    }
    refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, currentPlayer);
}
function expectedHitsFromStrength(strength) {
    if (strength >= 18)
        return parseInt(strength / 6);
    else
        return (strength / 6).toFixed(1);
}
function showUnitsForMovementBG2(optionType, gameObj, currentPlayer, totalMoveTerrs, selectedTerritory) {
    if (optionType == 'loadPlanes' || optionType == 'loadChoppers')
        totalMoveTerrs = [selectedTerritory];
    var moveTerr = [];
    var totalUnitsThatCanMove = 0;
    var maxDist = 8;
    if (optionType == 'nuke')
        maxDist = 5;
    if (optionType == 'attack' || optionType == 'bomb')
        maxDist = 4;
    if (optionType == 'cruise')
        maxDist = 2;

    for (var x = 0; x < totalMoveTerrs.length; x++) {
        var terr = totalMoveTerrs[x];
        var allyHash = {};
        terr.distObj = distanceBetweenTerrs(terr, selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
        var moveUnits = 0;
        terr.units.forEach(function (unit) {
            if (checkMovement(terr.distObj, unit, optionType, currentPlayer, selectedTerritory))
                moveUnits++;
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
    var specOpsUnit = false;
    var includesGeneral = false;
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
                    var cm = checkMovement(ter.distObj, unit, optionType, player, ter);
                    if (cm)
                        checkAGroundUnitID = 'unit' + unit.id;
                }
                if (e && e.checked) {
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
                    if (unit.piece >= 20 && optionType == 'attack' && specialUnitHash[unit.piece] > 6) {
                        showAlertPopup('Maximum of 6 ' + superpowersData.units[unit.piece].name + ' units per battle.', 1);
                        e.checked = false;
                    }

                    if ((unit.piece == 23 || unit.piece == 25 || unit.piece == 41 || unit.piece == 42) && optionType == 'attack' && selectedTerritory.unitCount == 0) {
                        showAlertPopup('No target for your ' + superpowersData.units[unit.piece].name + '.', 1);
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
                    if (u && artlleryChecked && 'unit' + u.id == e.id) {
                        checkAGroundUnitFlg = true;
                    }
                    if (optionType == 'loadPlanes' && infParatrooperCount > selectedTerritory.bomberCount * 2) {
                        showAlertPopup('Not enough room on your bombers. Removing items.', 1);
                        e.checked = false;
                    }
                    if (selectedTerritory.id >= 79 && optionType == 'movement') {
                        if (transportCargo > selectedTerritory.transportSpace) {
                            if (selectedTerritory.transportSpace > 0)
                                showAlertPopup('Not enough room on your transports. Removing items.', 1);
                            else
                                showAlertPopup('No transports there!', 1);
                            e.checked = false;
                        }
                        if (carrierCargo > selectedTerritory.carrierSpace) {
                            if (selectedTerritory.carrierSpace > 0)
                                showAlertPopup('Not enough room on your carriers. Removing fighters.', 1);
                            else
                                showAlertPopup('No carriers there!', 1);
                            e.checked = false;
                        }
                    }
                    if (unit.piece == 28 && optionType == 'attack' && unit.terr >= 79) {
                        showAlertPopup('Medics cannot attack from transports.', 1);
                        e.checked = false;
                    }
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

    var obj = getBattleAnalysis({ attackUnits: units, defendingUnits: defendingUnits }, selectedTerritory, player, gameObj);
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
            var cm = checkMovement(terr.distObj, unit, optionType, player, terr);
            if (e && cm && unit.piece != 13) {
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
function getSelectedUnits(moveTerr) {
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
            }
        }
    });
    return units;
}
function verifyUnitsAreLegal(units) {
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
    if (artillery > spotters) {
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
