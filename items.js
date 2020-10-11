function Item(name, value, count=1) {
    this.name = name;
    this.value = value;
    this.count = count;
}


const commonItems = [
    new Item("Box", 100),
    new Item("Hat", 250),
    new Item("Car", 1000),
    new Item("Toast", 5000)
];