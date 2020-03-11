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
        refreshTerritory(terr, gameObj, superpowersData.units, currentPlayer, superpowersData.superpowers, currentPlayer);
    }
    refreshTerritory(selectedTerritory, gameObj, superpowersData.units, currentPlayer, superpowersData.superpowers, currentPlayer);
}
function checkMovement(distObj, unit, optionType, currentPlayer) {
    if (unit.owner != currentPlayer.nation)
        return false;
    if (unit.movesLeft == 0)
        return false;
    if (optionType == 'loadPlanes') {
        if (unit.type == 1 && (!unit.cargoOf || unit.cargoOf == 0))
            return true;
        else
            return false;
    }
    if (optionType == 'cruise') {
        if (distObj.air == 1)
            return true;
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