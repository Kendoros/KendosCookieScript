var KCS = {
    title: 'Kendo\'s Cookie Script!',
    author: 'Kendoros',
    config: {
        click: {
            interval: 2,
            clicksPerInterval: 1,
            enabled: false
        },
        buildings: {
            interval: 20,
            enabled: false,
            selectedStrategy: 'cheapest',
            buyStrategies: {
                cheapest: 'cheapest',
                lucrative: 'lucrative'
            }
        },
        upgrades: {
            interval: 10,
            enabled: false,
            selectedStrategy: 'cheapest',
            buyStrategies: {
                cheapest: 'cheapest',
                lucrative: 'lucrative'
            },
            buyablePoolType: ['', 'cookie', 'tech', 'prestige']
        },
        golden: {
            interval: 5,
            enabledSpawn: false,
            enabledClick: false
        },
        debuffs: {
            debuffInterval: 500,
            enabledDestroyWrinkler: false,
            enabledRemoveDebuffs: false,
            debuffList: ['clot', 'cursed finger', 'pixie misery']
        }
    },
    counter: 0
};
KCS.handleAutoClick = function () {
    if (KCS.counter % KCS.config.click.interval === 0) {
        for (var x = 0; x < KCS.config.click.clicksPerInterval; x++) {
            Game.ClickCookie();
            Game.lastClick = 0;
        }
    }
};
KCS.handleSpawnGolden = function () {
    if (KCS.counter % KCS.config.golden.interval === 0) {
        Game.shimmerTypes['golden'].time = 50000;
    }
};
KCS.handleClickGolden = function () {
    if (KCS.counter % KCS.config.golden.interval === 0) {
        for (var shimmers = 0; shimmers < Game.shimmers.length; shimmers++) {
            if (Game.shimmers[shimmers].type === 'golden') {
                Game.shimmerTypes['golden'].popFunc(Game.shimmers[shimmers]);
            }
        }
    }
};
KCS.handleUpgrades = function () {
    if (KCS.counter % KCS.config.upgrades.interval === 0) {
        if (Game.UpgradesInStore.length > 0) {
            if (KCS.config.upgrades.selectedStrategy === KCS.config.upgrades.buyStrategies.cheapest) {
                for (var itemInStore = 0; itemInStore < Game.UpgradesInStore.length; itemInStore++) {
                    if (KCS.config.upgrades.buyablePoolType.indexOf(Game.UpgradesInStore[itemInStore].pool) >= 0) {
                        Game.UpgradesInStore[itemInStore].buy();
                    }

                }
            } else if (KCS.config.upgrades.selectedStrategy === KCS.config.upgrades.buyStrategies.lucrative) {
                // not implemented yet
            }
        }
    }
};
KCS.handleBuildings = function () {
    if (KCS.counter % KCS.config.buildings.interval === 0) {
        if (KCS.config.buildings.selectedStrategy === KCS.config.buildings.buyStrategies.cheapest) {
            var cheapest = Game.ObjectsById[0];
            for (i = 0; i < Game.ObjectsById.length; i++) {
                if (cheapest.price > Game.ObjectsById[i].price) {
                    cheapest = Game.ObjectsById[i];
                }
            }
            cheapest.buy();
        } else if (KCS.config.buildings.selectedStrategy === KCS.config.buildings.buyStrategies.lucrative) {
            //Need to have Cookie Monster plugin loaded
            if (KCS.cookieMonsterLoaded) {
                var optimalItemFound = false;
                for (var object in CM.Cache.Objects) {
                    if (CM.Cache.Objects[object].color === 'Green') {
                        Game.Objects[object].buy();
                        optimalItemFound = true;
                        break;
                    }
                }
                if (!optimalItemFound) {
                    for (var object in CM.Cache.Objects) {
                        if (CM.Cache.Objects[object].color === 'Yellow') {
                            Game.Objects[object].buy();
                            optimalItemFound = true;
                            break;
                        }
                    }
                }
            }
        }

    }
};
KCS.handleWrinklers = function () {
    if (KCS.counter % KCS.config.debuffs.debuffInterval === 0) {
        Game.CollectWrinklers();
    }
};
KCS.handleDebuffs = function () {
    if (KCS.counter % KCS.config.debuffs.debuffInterval === 0) {
        for (var buff in Game.buffs) {
            if(KCS.config.debuffs.debuffList.indexOf(Game.buffs[buff].type.name) >= 0){
                Game.buffs[buff].time = 1;
            }
        }
    }
};

KCS.endlessWork = function () {
    if (KCS.config.click.enabled) KCS.handleAutoClick();
    if (KCS.config.golden.enabledSpawn) KCS.handleSpawnGolden();
    if (KCS.config.golden.enabledClick) KCS.handleClickGolden();
    if (KCS.config.upgrades.enabled) KCS.handleUpgrades();
    if (KCS.config.buildings.enabled) KCS.handleBuildings();
    if (KCS.config.debuffs.enabledDestroyWrinkler) KCS.handleWrinklers();
    if (KCS.config.debuffs.enabledRemoveDebuffs) KCS.handleDebuffs();
    KCS.counter++;
    if (KCS.counter > 100000000) KCS.counter = 0;
};

KCS.loadKendoDefault = function () {
    KCS.config.click.enabled = true;
    KCS.config.click.clicksPerInterval = 100;
    KCS.config.click.interval = 1;
    KCS.config.buildings.enabled = true;
    KCS.config.golden.enabledClick = true;
    KCS.config.upgrades.enabled = true;
    return 'config set';
};

KCS.loadGodConfig = function () {
    KCS.config.click.enabled = true;
    KCS.config.click.clicksPerInterval = 1000;
    KCS.config.click.interval = 1;
    KCS.config.buildings.enabled = true;
    KCS.config.upgrades.enabled = true;
    KCS.config.golden.enabledClick = true;
    KCS.config.golden.enabledSpawn = true;
    KCS.config.debuffs.enabledRemoveDebuffs = true;
    KCS.config.debuffs.enabledDestroyWrinkler = true;
};

KCS.start = function () {
    KCS.counter = 0;
    KCS.runId = setInterval(KCS.endlessWork, 1);
};
KCS.stop = function () {
    if (KCS.runId) {
        clearInterval(KCS.runId);
        KCS.runId = undefined;
    }
};
KCS.loadCookieMonster = function () {
    Game.LoadMod('http://aktanusa.github.io/CookieMonster/CookieMonster.js');
    KCS.cookieMonsterLoaded = true;
};




