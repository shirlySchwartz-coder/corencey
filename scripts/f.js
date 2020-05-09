function toggleCoin(currentCoin, event) {
    let input_checked = event.target;
    let thisCoin = currentCoin;
    let coin = {};
    let active = $(event.target.parentElement).hasClass("active");
    console.log("input_checked", input_checked);
    console.log("thisCoin", thisCoin);
    if ($(input_checked).is(":checked")) {
      $(input_checked).addClass("active");
      if (selected_coins.length > 4) {
        alert("You Can Choose Only 5 Coins !!!");
        createModal(selected_coins, input_checked);
      } else {
        coin = new Coin(
          thisCoin.symbol,
          thisCoin.id,
          input_checked,
          thisCoin.index
        );
        console.log(coin);
        selected_coins.push(coin);
        console.log(selected_coins);
      }
    } else {
      //if ($(input_checked).is(":checked", false)) {
      if (!active) {
        let tempCoinId = input_checked.id;
        console.log("tempCoinId", tempCoinId);
        $(input_checked).removeClass("active");
        selected_coins.splice(selected_coins.indexOf(tempCoinId), 1);
        console.log(selected_coins);
       
      }
    }
  }