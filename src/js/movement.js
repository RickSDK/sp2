function selectAllUnits(terr, optionType, currentPlayer) {
    var checked = document.getElementById('ter' + terr.id).checked;
    for (var x = 0; x < terr.units.length; x++) {
        var unit = terr.units[x];
        var cm = checkMovement(terr.distObj, unit, optionType, currentPlayer);
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
                unit.movesLeft = 0;
            }
        }
    }
    return { t1: terr1Id, t2: selectedTerritory.id, id: piece };
}
function refreshBoardFromMove(moveTerr, selectedTerritory, gameObj, superpowersData, currentPlayer) {
    for (var x = 0; x < moveTerr.length; x++) {
        var terr = moveTerr[x];
        refreshTerritory(terr, gameObj, currentPlayer, superpowersData, currentPlayer);
    }
    refreshTerritory(selectedTerritory, gameObj, currentPlayer, superpowersData, currentPlayer);
}
function checkMovement(distObj, unit, optionType, currentPlayer) {
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
    if (optionType == 'attack' && unit.piece == 14)
        return false;
    if (optionType == 'nuke' && unit.subType != 'missile')
        return false;
    if (optionType == 'loadPlanes') {
        if (unit.type == 1 && (!unit.cargoOf || unit.cargoOf == 0))
            return true;
        else
            return false;
    }
    if (optionType == 'loadUnits') {
        if (distObj.air == 0)
            return true;
    }
    if (unit.type == 1 && unit.terr >= 79) {
        if (distObj.air == 1)
            return true;
        else
            return false;
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
function expectedHitsFromStrength(strength) {
    if (strength >= 18)
        return parseInt(strength / 6);
    else
        return (strength / 6).toFixed(1);
}
/*
function checkSendButtonStatus(unit, moveTerr, optionType) {
    var totalStrength = 0;
    for (var x = 0; x < moveTerr.length; x++) {
        var terr = moveTerr[x];
        terr.units.forEach(function (unit) {
            var e = document.getElementById('unit' + unit.id);
            if (e && e.checked)
                totalStrength += unit.att;
        });
    }
    return totalStrength;
}
*/
function showUnitsForMovementBG2(optionType, gameObj, currentPlayer, totalMoveTerrs, selectedTerritory) {
    var moveTerr = [];
    var totalUnitsThatCanMove = 0;
    for (var x = 0; x < totalMoveTerrs.length; x++) {
        var terr = totalMoveTerrs[x];
        var maxDist = 9;
        var allyHash = {};
        terr.distObj = distanceBetweenTerrs(terr, selectedTerritory, maxDist, 0, 0, 0, allyHash, gameObj.territories);
        var moveUnits = 0;
        terr.units.forEach(function (unit) {
            if (checkMovement(terr.distObj, unit, optionType, currentPlayer))
                moveUnits++;
        });
        totalUnitsThatCanMove += moveUnits;
        if (moveUnits > 0)
            moveTerr.push(terr);
    }
    return { totalUnitsThatCanMove: totalUnitsThatCanMove, moveTerr: moveTerr };
}

function checkSendButtonStatus(u, moveTerr, optionType, selectedTerritory, player) {
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
                    var cm = checkMovement(ter.distObj, unit);
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
                        showAlertPopup('Maximum of 6 ' + gUnits[unit.piece].name + ' units per battle.', 1);
                        e.checked = false;
                    }

                    if ((unit.piece == 23 || unit.piece == 25 || unit.piece == 41 || unit.piece == 42) && optionType == 'attack' && selectedTerritory.unitCount == 0) {
                        showAlertPopup('No target for your ' + gUnits[unit.piece].name + '.', 1);
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
                            showAlertPopup('Not enough room on your transports. Removing items.', 1);
                            e.checked = false;
                        }
                        if (carrierCargo > selectedTerritory.carrierSpace) {
                            showAlertPopup('Not enough room on your carriers. Removing fighters.', 1);
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
        //      disableButton('unitCountToOne', numSelected<=0);
        //      disableButton('unitCountDown', numSelected<=0);
        //      disableButton('unitCountUp', selectedUnitCounts[u.piece]==totalUnitCounts[u.piece]);
        //      disableButton('unitCountToMax', selectedUnitCounts[u.piece]==totalUnitCounts[u.piece]);
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
    expectedHits = expectedHitsFromHits(expectedHits);

    if (numNukes > 0) {
        expectedHits = nukeHitsForTerr(selectedTerritory, player) * numNukes;
        if (expectedHits == 0)
            showAlertPopup('This territory is too heavily defended for your nukes! Find a better target or get your nukes upgraded through technology.', 1);
    }
    return { expectedHits: expectedHits, numNukes: numNukes, numUnits: numUnits };
}
function expectedHitsFromHits(num) {
    if (num >= 18)
        return parseInt(num / 6);
    else
        return (num / 6).toFixed(1);
}
function nukeHitsForTerr(terr, player) {
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
        var defender = playerOfNation(terr.owner);
        if (defender.tech[18])
            blocked *= 2;
    }
    var finalHits = hits - blocked;
    if (terr.nation == 99) {
        finalHits = Math.floor(finalHits / 3);
        //			finalHits/=3;
    }
    return finalHits;
}
function autoButtonPressed(selectedTerritory, moveTerr) {
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
            var cm = checkMovement(terr.distObj, unit);
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
                for(var i=0; i<unit.numAtt; i++)
                    unit.dice.push('dice.png');
                units.push(unit);
            }
        }
    });
    return units;
}