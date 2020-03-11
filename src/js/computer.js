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
    if (num == 2 && waterway && waterway.id>0) {
        addUniToQueue(4, 1, superpowersData, player, gameObj, waterway);
        addUniToQueue(5, 1, superpowersData, player, gameObj, waterway);
    }
    if (num == 3 && player.income > 40)
        addUniToQueue(9, 1, superpowersData, player, gameObj, terr1);
    if (num == 4 && waterway && waterway.id>0) {
        addUniToQueue(4, 1, superpowersData, player, gameObj, waterway);
    }
    if (num == 5 && player.income > 30 && waterway && waterway.id>0)
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
                transferControlOfTerr(terr, terr.requestTransfer, gameObj);
                logItem(gameObj, player, 'Transfer', terr.name + ' transferred to ' + superpowersData.superpowers[terr.requestTransfer]);
            }
            terr.requestTransfer = 0;
        }
    });
}
function transferControlOfTerr(terr, nation, gameObj) {
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
    refreshTerritory(terr);
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
