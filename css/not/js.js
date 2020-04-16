var selected_coins=[
        {symbol: "zoc", id: "01coin", switchElement: "input#01coin.active"},
        {symbol: "zch", id: "0cash", switchElement: "input#0cash.active"},
        {symbol: "zrx", id: "0x", switchElement: "input#0x.active"}
];
console.log(selected_coins);
selected_coins.splice(1,1);
console.log(selected_coins);
