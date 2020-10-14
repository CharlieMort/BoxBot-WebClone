class LootTable {
    constructor() {
        this.items = [];
    }

    Add(item, weight) {
        for (let i = 0; i<weight; i++) {
            this.items.push(item);
        }
        console.log(this.items);
    }

    PickRandom() {
        let randint = Math.floor(Math.random()*this.items.length);
        console.log(randint);
        return this.items[randint];
    }
}