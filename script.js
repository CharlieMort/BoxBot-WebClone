let inventory = [];
const outputText = document.getElementById("OutputText");
let idling;
let money = 0;
let awaitingSecondCommand = false;

function ifEnter(ele) {
    if (event.key == "Enter") {
        submitCommand(ele.value);
        ele.value = "";
    }
}

function submitCommand(command) {
    command = command.toLowerCase();
    command = command.split(" ");
    console.log(command);
    switch(command[0]) {
        case "use":
            if (!idling) Use(command);
            break;
        case "inv":
            if (!idling) ShowArray(inventory, outputText);
            break;
        case "start":
            if (!idling) {
                idling = setInterval(MakeMoney, 50);
            }
            break;
        case "stop":
            clearInterval(idling);
            idling = null;
            outputText.innerHTML = "Stopped Making Money<br>Awaiting Next Command...";
            break;
        case "sellall":
            SellAll();
            break;
        case "coinflip":
            CoinFlip(command[1], command[2]);
            break;
        default:
            console.log("Invalid Command");
            break;
    }
}

function SellAll() {
    let value = 0;
    if (inventory.length > 0) {
        inventory = SortItemArray(inventory);
        inventory = CompressArray(inventory);
        for (let i = 0; i<inventory.length; i++) {
            value += inventory[i].value * inventory[i].count;
        }
    }
    inventory = [];
    money += value;
    outputText.innerHTML = "Sold All Items For $" + numberWithCommas(value) + "<br>You Now Have $" + numberWithCommas(money);
}

let mps = 5;
let moneyMade = 0;
function MakeMoney() {
    let out = "Making You Some Sweet Cash At $" + mps +"/s !!<br>";
    moneyMade += mps/(1000/50);
    money += mps/(1000/50);
    out += "Money Made<br>$" + moneyMade.toFixed(2);
    outputText.innerHTML = out;
}

function Use(command) {
    switch(command[1]) {
        case "commonbox":
            UseBox(command, "common");
            break;
        case "uncommonbox":
            UseBox(command, "uncommon");
            break;
        case "rarebox":
            UseBox(command, "rare");
            break;
        case "ultrararebox":
            UseBox(command, "ultrarare");
            break;
        default:
            console.log(command[2]);
    }
}

function UseBox(command, tier) {
    if (parseInt(command[2])) {
        let amount = parseInt(command[2]);
        let results = [];
        for (let i = 0; i<amount; i++) {
            results.push(OpenBox(tier));
        }
        inventory = inventory.concat(ShowArray(results, outputText));
    }
    else {
        let result = OpenBox(tier);
        inventory.push(result);
        ShowItem(result);
    }
}

function ShowArray(arr, htmlElement, returnString = false) {
    let out = "";
    let value = 0;
    if (arr.length > 0) {
        arr = SortItemArray(arr);
        arr = CompressArray(arr);
        for (let i = 0; i<arr.length; i++) {
            out += ShowItem(arr[i], true);
            out += "<br>";
            value += arr[i].value * arr[i].count;
        }
    }
    out += "Total Value:$" + numberWithCommas(value);
    out += "<br>Current Money:$" + numberWithCommas(money);
    if (returnString) {
        return out;
    }
    htmlElement.innerHTML = out;
    return arr;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function OpenBox(type) {
    let result;
    switch(type) {
        case "common":
            result = GetItem(0);
            break;
        case "uncommon":
            result = GetItem(1);
            break;
        case "rare":
            result = GetItem(2);
            break;
        case "ultrarare":
            result = GetItem(3);
            break;
        default:
            console.log("Not a box");
    }
    result = new Item(result.name, result.value, result.tier);
    return result;
}

function ShowItem(item, returnString = false, htmlElement) {
    if (returnString) {
        str = FormatStringItemName(item);
        str += " $" + item.value + " x" + item.count;
        return str;
    }
    htmlElement.innerHTML = FormatStringItemName(item) + " $" + item.value + " x" + item.count;
}

function FormatStringItemName(item) {
    let str = "";
    console.log(item);
    switch(item.tier) {
        case 0:
            str = "<b>"+item.name+"</b>";
            break;
        case 1:
            str = '<span class="uncommon">'+item.name+'</span>';
            break;
        case 2:
            str = '<span class="rare">'+item.name+'</span>';
            break;
        case 3:
            str = '<span class="ultrarare">'+item.name+'</span>';
            break;
        case 4:
            str = '<span class="god">'+item.name+'</span>';
            break;
        default:
            console.log("Uh Oh");
    }
    console.log(str);
    return str;
}

function CompressArray(arr) {
    let count = arr[0].count;
    let returnArr = [];
    for (let i = 0; i<arr.length-1; i++) {
        if (arr[i].name == arr[i+1].name) {
            count += arr[i+1].count;
        }
        else {
            arr[i].count = count;
            returnArr.push(arr[i]);
            count = arr[i+1].count;
        }
    }
    arr[arr.length-1].count = count;
    returnArr.push(arr[arr.length-1]);
    return returnArr;
}

function SortItemArray(arr) {
    let newArr = arr.sort(function(a, b) {
        if (a.name == b.name) {
            return 0;
        }
        else if (a.name > b.name) {
            return 1;
        }
        else {
            return -1;
        }
    });
    return newArr;
}

function CoinFlip(choice, amount) {
    let num = Math.random();
    console.log(num);
    out = "";
    if (num > 0.5) {
        if (choice == "heads") {
            money += amount;
            out = "You <b>WON<\b><br>You got $" + numberWithCommas(amount*2);
        }
        else {
            money -= amount;
            out = "You <b>LOST<\b><br>You Lost $" + numberWithCommas(amount);
        }
    }
    else{
        if (choice == "tails") {
            money += amount;
            out = "You <b>WON<\b><br>You got $" + numberWithCommas(amount*2);
        }
        else {
            money -= amount;
            out = "You <b>LOST\<b><br>You Lost $" + numberWithCommas(amount);
        }
    }
    outputText.innerHTML = out;
}