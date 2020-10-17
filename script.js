let inventory = [];
let boxInv = [0,0,0,0];
const boxPrices = [5000, 12500, 25000, 75000]
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
  switch (command[0]) {
    case "use":
      if (!idling) Use(command);
      break;
    case "inv":
      if (!idling) {
        let x = ShowArray(inventory, outputText, true);
        x += `<br><span class="BoxTitle"><u><b>Boxes</b></u></span>`;
        x += `<br><span class="common"><b>Common</b></span> Boxes - ${boxInv[0]}`;
        x += `<br><span class="uncommon"><b>Uncommon</b></span> Boxes - ${boxInv[1]}`;
        x += `<br><span class="rare"><b>Rare</b></span> Boxes - ${boxInv[2]}`;
        x += `<br><span class="ultrarare"><b>Ultra Rare</b></span> Boxes - ${boxInv[3]}`;
        outputText.innerHTML = x;
      }
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
    case "buy":
      outputText.innerHTML = Buy(command);
      break;
    default:
      outputText.innerHTML = "Unknown Command";
      break;
  }
}

function SellAll() {
  let value = 0;
  if (inventory.length > 0) {
    inventory = SortItemArray(inventory);
    inventory = CompressArray(inventory);
    for (let i = 0; i < inventory.length; i++) {
      value += inventory[i].value * inventory[i].count;
    }
  }
  inventory = [];
  money += value;
  outputText.innerHTML =
    "Sold All Items For $" +
    numberWithCommas(value) +
    "<br>You Now Have $" +
    numberWithCommas(money);
}

let mps = 5;
let moneyMade = 0;
function MakeMoney() {
  let out = "Making You Some Sweet Cash At $" + mps + "/s !!<br>";
  moneyMade += mps / (1000 / 50);
  money += mps / (1000 / 50);
  out += "Money Made<br>$" + moneyMade.toFixed(2);
  outputText.innerHTML = out;
}

function Use(command) {
  let amount;
  if (command[2]) amount = parseInt(command[2]);
  else amount = 1;
  switch (command[1]) {
    case "commonbox":
      if (boxInv[0] >= amount) {
        UseBox(command, "common");
        boxInv[0]--;
      }
      else {
        outputText.innerHTML = "You Dont Have That Many Common Boxes<br>Go Buy Some Using buy commonbox [amount]";
      }
      break;
    case "uncommonbox":
      if (boxInv[1] >= amount) {
        UseBox(command, "uncommon");
        boxInv[1]--;
      }
      else {
        outputText.innerHTML = "You Dont Have That Many Uncommon Boxes<br>Go Buy Some Using buy uncommonbox [amount]";
      }
      break;
    case "rarebox":
      if (boxInv[2] >= amount) {
        UseBox(command, "rare");
        boxInv[2]--;
      }
      else {
        outputText.innerHTML = "You Dont Have That Many Rare Boxes<br>Go Buy Some Using buy rarebox [amount]";
      }
      break;
    case "ultrararebox":
      if (boxInv[3] >= amount) {
        UseBox(command, "ultrarare");
        boxInv[3]--;
      }
      else {
        outputText.innerHTML = "You Dont Have That Many UltraRare Boxes<br>Go Buy Some Using buy ultrararebox [amount]";
      }
      break;
    default:
      outputText.innerHTML = "Not A Box";
  }
}

function UseBox(command, tier) {
  if (parseInt(command[2])) {
    let amount = parseInt(command[2]);
    let results = [];
    for (let i = 0; i < amount; i++) {
      results.push(OpenBox(tier));
    }
    inventory = inventory.concat(ShowArray(results, outputText));
  } else {
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
    arr = SortItemArrayByTier(arr);
    for (let i = 0; i < arr.length; i++) {
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
  switch (type) {
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
  htmlElement.innerHTML =
    FormatStringItemName(item) + " $" + item.value + " x" + item.count;
}

function FormatStringItemName(item) {
  let str = "";
  console.log(item);
  switch (item.tier) {
    case 0:
      str = '<span class="common"><b>' + item.name + "</b></span>";
      break;
    case 1:
      str = '<span class="uncommon"><b>' + item.name + "</b></span>";
      break;
    case 2:
      str = '<span class="rare"><b>' + item.name + "</b></span>";
      break;
    case 3:
      str = '<span class="ultrarare"><b>' + item.name + "</b></span>";
      break;
    case 4:
      str = '<span class="god"><b>' + item.name + "</b></span>";
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
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].name == arr[i + 1].name) {
      count += arr[i + 1].count;
    } else {
      arr[i].count = count;
      returnArr.push(arr[i]);
      count = arr[i + 1].count;
    }
  }
  arr[arr.length - 1].count = count;
  returnArr.push(arr[arr.length - 1]);
  return returnArr;
}

function SortItemArray(arr) {
  let newArr = arr.sort(function(a, b) {
    if (a.name == b.name) {
      return 0;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return -1;
    }
  });
  return newArr;
}

function SortItemArrayByTier(arr) {
  let cItems = arr.filter(function(value) {
    if (value.tier == 0) {
      return value;
    }
  });
  let uncItems = arr.filter(function(value) {
    if (value.tier == 1) {
      return value;
    }
  });
  let rItems = arr.filter(function(value) {
    if (value.tier == 2) {
      return value;
    }
  });
  let urItems = arr.filter(function(value) {
    if (value.tier == 3) {
      return value;
    }
  });
  let gItems = arr.filter(function(value) {
    if (value.tier == 4) {
      return value;
    }
  });
  let newarr = [];
  newarr = newarr.concat(cItems);
  newarr = newarr.concat(uncItems);
  newarr = newarr.concat(rItems);
  newarr = newarr.concat(urItems);
  newarr = newarr.concat(gItems);
  console.log(newarr);
  return newarr;
}

function CoinFlip(choice, amount) {
  let num = Math.random();
  console.log(money);
  console.log(amount);
  out = "";
  if (amount > money) {
    out = "You Can't Afford That smh";
  } else if (num > 0.5) {
    if (choice == "heads") {
      money += parseInt(amount);
      out = "You <b>WON</b><br>You got $" + numberWithCommas(amount * 2);
    } else {
      money -= parseInt(amount);
      out = "You <b>LOST</b><br>You Lost $" + numberWithCommas(amount);
    }
  } else {
    if (choice == "tails") {
      money += parseInt(amount);
      out = "You <b>WON</b><br>You got $" + numberWithCommas(amount * 2);
    } else {
      money -= parseInt(amount);
      out = "You <b>LOST</b><br>You Lost $" + numberWithCommas(amount);
    }
  }
  console.log(money);
  outputText.innerHTML = out;
}

function Buy(command) {
  let amount;
  if (command[2]) amount = parseInt(command[2]);
  else amount = 1;
  console.log(amount);
  let price = 0;
  if (amount == 0) amount = 1;
  switch(command[1]) {
      case "commonbox":
        price = amount*boxPrices[0];
        if (money < price) {
          return `You Can't Afford That<br>You Need $${numberWithCommas(amount)} and you have $${numberWithCommas(money)}`;
        }
        boxInv[0] += amount;
        money -= price;
        return `You Just Bought<br>x${amount} <span class="common"><b>Common</b></span> Boxes For $${numberWithCommas(price)}<br>You Now Have $${numberWithCommas(money)}`;
      case "uncommonbox":
        price = amount*boxPrices[1];
        if (money < price) {
          return `You Can't Afford That<br>You Need $${numberWithCommas(amount)} and you have $${numberWithCommas(money)}`;
        }
        boxInv[1] += amount;
        money -= price;
        return `You Just Bought<br>x${amount} <span class="uncommon"><b>Uncommon</b></span> Boxes For $${numberWithCommas(price)}<br>You Now Have $${numberWithCommas(money)}`;
      case "rarebox":
        price = amount*boxPrices[2];
        if (money < price) {
          return `You Can't Afford That<br>You Need $${numberWithCommas(amount)} and you have $${numberWithCommas(money)}`;
        }
        boxInv[2] += amount;
        money -= price;
        return `You Just Bought<br>x${amount} <span class="rare"><b>Rare</b></span> Boxes For $${numberWithCommas(price)}<br>You Now Have $${numberWithCommas(money)}`;
      case "ultrararebox":
        price = amount*boxPrices[3];
        if (money < price) {
          return `You Can't Afford That<br>You Need $${numberWithCommas(amount)} and you have $${numberWithCommas(money)}`;
        }
        boxInv[3] += amount;
        money -= price;
        return `You Just Bought<br>x${amount} <span class="ultrarare"><b>Ultra Rare</b></span> Boxes For $${numberWithCommas(price)}<br>You Now Have $${numberWithCommas(money)}`;
      default:
          outputText.innerHTML = "Not A Box";
  }
}
