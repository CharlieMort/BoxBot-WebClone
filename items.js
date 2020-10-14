const odds = [
    [64, 22, 8.5, 5, 0.5],
    [0, 75, 16, 8, 1],
    [0, 0, 70, 28, 2],
    [0, 0, 0, 95, 5]
];

function Item(name, value, tier) {
    this.name = name;
    this.value = value;
    this.count = 1;
    this.tier = tier;
}

function GetItem(tier) {
    switch (tier) {
        case 0://Common
            return RandomIndex(odds[0]);
        case 1://Uncommon
            return RandomIndex(odds[1]);
        case 2://Rare
            return RandomIndex(odds[2]);
        case 3://Ultrarare
            return RandomIndex(odds[3]);
    }
}

function RandomIndex(percArr) {
    let randint = Math.random()*100;
    if (randint<percArr[0]) {
        return commonItems[Math.floor(Math.random()*commonItems.length)];
    }
    randint-=percArr[0];
    if (randint<percArr[1]) {
        return uncommonItems[Math.floor(Math.random()*uncommonItems.length)];
    }
    randint-=percArr[1];
    if (randint<percArr[2]) {
        return rareItems[Math.floor(Math.random()*rareItems.length)];
    }
    randint-=percArr[2];
    if (randint<percArr[3]) {
        return ultrarareItems[Math.floor(Math.random()*ultrarareItems.length)];
    }
    randint-=percArr[3];
    if (randint<percArr[4]) {
        return godtierItems[Math.floor(Math.random()*godtierItems.length)];
    }
    return console.log("This Wasnt Meant To Happen");
}

const commonItems = [
    new Item("Green Apple", 1000, 0),
    new Item("Pomegranate", 500, 0),
    new Item("Redcurrent", 2000, 0),
    new Item("Starfruit", 5000, 0),
    new Item("Avocado", 5000, 0),
    new Item("Gooseberry", 5000, 0),
    new Item("Grapefruit", 5000, 0),
    new Item("Cranberry", 5000, 0),
    new Item("Dragonfruit", 5000, 0),
    new Item("Fig", 5000, 0)
];

const uncommonItems = [
    new Item("Cherry", 10000, 1),
    new Item("Date", 10000, 1),
    new Item("Kiwi", 10000, 1),
    new Item("Papaya", 5000, 1),
    new Item("Apricot", 10000, 1),
    new Item("Blackberry", 10000, 1),
    new Item("White Grapes", 10000, 1),
    new Item("Blackcurrent", 10000, 1),
    new Item("Cantaloupe", 10000, 1),
    new Item("Persimmon", 10000, 1),
    new Item("Plum", 10000, 1),
    new Item("Nectarine", 10000, 1),
    new Item("Coconut", 15000, 1),
    new Item("Litchi", 15000, 1)
];

const rareItems = [
    new Item("Lemon", 20000, 2),
    new Item("Lime", 20000, 2),
    new Item("Passionfruit", 20000, 2),
    new Item("Peach", 20000, 2),
    new Item("Raspberry", 20000, 2),
    new Item("Pear", 25000, 2),
    new Item("Banana", 50000, 2),
    new Item("White Grapes", 50000, 2),
    new Item("Orange", 50000, 2),
    new Item("Tangerine", 50000, 2)
];

const ultrarareItems = [
    new Item("Mango", 75000, 3),
    new Item("Strawberry", 75000, 3),
    new Item("Pineapple", 100000, 3),
    new Item("Watermelon", 250000, 3)
];

const godtierItems = [
    new Item("Red Apple", 1000000, 4),
    new Item("Bananana", 10000000, 4)
];