//Varibels
const navBtn = $(".panel-button");
var div_home = $("#cont1");
var div_card = $("#card-wrapper");
var checkBoxArray = [];

var lsArray = false;
var delete_coins = [];

const counter = 0;
class Coin {
  constructor(id, symbol, name, counter) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.index = counter;
  }
  getCoinId() {
    return this.id;
  }
  addCounter() {
    return counter + 1;
  }
}
const coinsArr = [];
var allCoins = [];
class ReportCoin {
  constructor(symbol, id, switchElement, index) {
    this.symbol = symbol;
    this.id = id;
    this.cardSwitchElement = switchElement;
    this.index = index;
  }
  toggleSwitch(x) {
    if ($(this.switchElement).prop("checked", true)) {
      $(x).prop("checked", false);
    } else if ($(this.switchElement).prop("checked", false)) {
      $(x).prop("checked", true);
    }
  }
}
const selected_coins = [];
//console.log(selected_coins);

//Print Cards
function printCards(cardData) {
  console.log("printCards Function");
  for (let i = 0; i < 100; i++) {
    coinsArr.push(
      new Coin(cardData[i].id, cardData[i].symbol, cardData[i].name, i)
    );
    //console.log(coinsArr);
    createCard(coinsArr[i], i);
  }
}

//Create Cards
function createCard(coin, index) {
  var card = $(
    `<div class ='col-lg-4 col-md-6 card col-sm-12' id=c${coin.id}></div>`
  );
  var body = $(`<div class ="card-body"></div>`);
  var first_row = $(`<div class ="row"></div>`);
  var symbol = $(`<div class ="card-title col" ><h4>${coin.symbol}<h4></div>`);
  let label_switch = $(`<label class="switch mt-1" id=${coin.symbol}>
                          <input class="si" type="checkbox" name="sliderCheck" id=${coin.id} switch-index=${index}  >
                          <span class ="slider round"></span>
                        </label>`);
  var name = $(`<div class ="card-text">Name : ${coin.name}</div>`);
  var infobtn = $(
    `<button class ="btn btn-primary collapsible"  id="info_btn">More Info</button>`
  );
  var infoWrapper = $(`<div class ="content"></div>`);
  $(first_row).append(symbol).append(label_switch);
  $(body).append(first_row).append(name).append(infobtn).append(infoWrapper);
  $(card).append(body);
  div_card.append(card);

  // toggle

  $("#" + coin.id).click(function (e) {
    // alert(`you clicked: ${coin.id},${e.currentTarget}`);
    console.log(coin, e);
    toggleCoin(coin, e);
  });

  infobtn.on("click", function () {
    var time = new Date();
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      console.log("hide");
    } else {
      content.style.display = "block";
      console.log("show");
      console.log(time);
      getInfoOnCoin(infoWrapper, coin.id, time);
    }
  });
}
//Toggle Coin
function toggleCoin(currentCoin, event) {
  let input_checked = event.target;
  let thisCoin = currentCoin;
  let active=$(event.target.parentElement).hasClass("active");
  console.log("input_checked", input_checked);
  console.log("thisCoin", thisCoin);
  if ($(input_checked).is(":checked")) {
    $(input_checked).addClass("active");
    if (selected_coins.length > 4) {
      alert("You Can Choose Only 5 Coins !!!");
      createModal(selected_coins, input_checked);
    } else {
      let c = new ReportCoin(
        thisCoin.symbol,
        thisCoin.id,
        input_checked,
        thisCoin.index
      );
      console.log(c);
      selected_coins.push(c);
      console.log(selected_coins);
    }
  } else {
    //if ($(input_checked).is(":checked", false)) {
      if (!active){
      let tempCoinId=input_checked.id;
      console.log('tempCoinId', tempCoinId);
      $(input_checked).removeClass("active");
      selected_coins.splice(0, 1);
      console.log(selected_coins);
      // counter--;
    }
  }
}
//Get serched  Coin
function getSearchCoin() {
  var searchcoin = {};
  var i = "";
  let search = $("#search").val();
  if (search.length < 3) {
    alert("Search Phrase too Short...");
    return;
  }
  var searchId;
  allCoins.forEach((coin) => {
    if (coin.symbol === search) {
      searchId = coin.id;
    }
  });
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${searchId}`,
    success: function (searchcoin) {
      $("#card-wrapper").html("");
      console.log(searchcoin);
      createCard(searchcoin, i);
    },
  });
}
//Get Coin Info
function getInfoOnCoin(wrepper, coinId, time) {
  let now = new Date();
  localStoageCheck(now, coinId);
  console.log(time, now);
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
    success: function (infoCoin) {
      console.log(infoCoin);
      let localStorageObj = {
        res: infoCoin,
        time: time.toString(),
      };
      addLocalStorage(coinId, JSON.stringify(localStorageObj));
      printInfoOnCoin(wrepper, infoCoin, time);
    },
    error: function () {
      alert("error!");
    },
  });
}
//Print Info on Coin
function printInfoOnCoin(wrepper, coinInfo, time) {
  wrepper.html("");
  var coin_img = $(
    `<img src="${coinInfo.image.large}" id="coin_img" srcset="">`
  );
  var coin_vs_USD = $(
    `<div><label>USD : </label> ${coinInfo.market_data.current_price.usd} <b>$</b> </div>`
  );
  var coin_vs_EUR = $(
    `<div><label>EUR : </label> ${coinInfo.market_data.current_price.eur} <b>€</b> </div>`
  );
  var coin_vs_ILS = $(
    `<div><label>ILS : </label> ${coinInfo.market_data.current_price.ils} <b>₪</b></div>`
  );

  wrepper
    .append(coin_img)
    .append(coin_vs_USD)
    .append(coin_vs_EUR)
    .append(coin_vs_ILS);
  console.log(time.toUTCString());
}
//Save to Local Storage
function localStoageCheck(now, coinId) {
  let tempLocal;
  if (localStorage.length === 0) {
    console.log("Local Storage Is Empty !");
  } else {
    console.log("Local Storage Is Not Empty !");
  }
}
function addLocalStorage(name, data) {
  console.log(data + "saving to local storage");
  localStorage.setItem(name, data);
}

//Save coins array to local storage
function saveCoinsToLS(arr) {
  console.log("Saving To Local Storage The Coins Array");
  let coinsLSArr = arr;

  let coinsLSArr_str = JSON.stringify(coinsLSArr);

  localStorage.setItem("coinsLSArr", coinsLSArr_str);
}
//Get coins array From local storage
function getCoinsFromLS() {
  //alert("From Local Storege");
  let arrls = localStorage.getItem("coinsLSArr");
  console.log(arrls);
  let objArray = JSON.parse(arrls);
  console.log(objArray);
  return objArray;
}

function createModal(arr, checkbox) {
  $(".modal-body").empty();
  $(checkbox).prop("checked", !$(checkbox).prop("checked"));

  console.log("show model");
  $("#myModal").show();
  arr.forEach((element) => {
    let div = $(`<div class="button-holder"></div>`)[0];
    let input = $(`<label class="switch mt-1" id=${element.symbol}>
    <input  type="checkbox" name="sliderCheck" id=m${element.id}   >
    <span class ="slider round"></span></label>`);
    div.append(input[0]);
    div.append(element.symbol);

    $(".modal-body")[0].append(div);
  });
  let modal_footer = $(`<div class ="modal-footer">
                              <button type="button" class ="btn btn-secondary close" data-dismiss="modal" id="closemodal" onClick="closeModel()">
                                Cancel
                              </button>
                              <button type="button" class ="btn btn-primary" id="save_btn" onclick="saveNewArr(delete_coins)">
                                Save changes
                              </button>
                            </div>`);
  $("#modal-wrepper").append(modal_footer);

  $(".modal-body").on("change", function (e) {
    let coin_checked = e.target;
    console.log(coin_checked);
    if ($(coin_checked).is(":checked")) {
      let x = coin_checked.id;
      let temp = x.slice(1);
      console.log(temp);
      delete_coins.push(temp);
      console.log(delete_coins);
    }
  });
  addLocalStorage("SelectedCoins", selected_coins);
}

//cancel was clicked on modal
function cancelModal() {
  //let origArray = $('.modal-body').find('.switch');
  //checkBoxArray = [...origArray];
  $(".modal-body").empty();
}

//Modal

/*function createModal(arr, checkbox) {
  let temp = "";
  let temp2 = null;
  delete_coins = [];

  $(checkbox).prop("checked", !$(checkbox).prop("checked"));
  let div_modal = $(
    `<div class="modal" tabindex="-1" role="dialog" id="modal"></div>`
  );
  let modal_dialog = $(
    `<div class="modal-dialog modal-md col-5" role="document"></div>`
  );
  let modal_content = $(`<div class="modal-content"><div>`);
  let modal_header = $(` <div class="modal-header">
                                <h5 class="modal-title">Selected Coins - Please select which coin to remove ! </h5>
                              </div>`);
  let modal_close = $(`<button type="button" id="md-close" class="close" data-dismiss="modal" aria-label="close" onClick="closeModel()" >
                              <span aria-hidden="true">&times;</span>
                          </button>`);

  arr.forEach(coin) {
    temp += `<div class="row mrow">
    <p class ="switchlabel">${coin.symbol}</p>
              <label class ="switch">
                <input type="checkbox" name="sliderCheck" id="m${coin.id}" mindex=${coin.index} >
                <span class ="slider round"></span>
              </label>
            <div>
            `;
  }
  let modal_body = $(`<div class ="modal-body"><p>${temp} </p></div>`);
  let modal_footer = $(`<div class ="modal-footer">
                              <button type="button" class ="btn btn-secondary close" data-dismiss="modal" id="closemodal" onClick="closeModel()">
                                Cancel
                              </button>
                              <button type="button" class ="btn btn-primary" id="save_btn" onclick="saveNewArr(selected_coins,delete_coins)">
                                Save changes
                              </button>
                            </div>`);

  $(modal_header).append(modal_close);
  $(modal_content).append(modal_header).append(modal_body).append(modal_footer);
  $(div_modal).append(modal_dialog).append(modal_content);

  $("#w_modal").append(div_modal);
  $(".modal").show();
  $("#w_modal").show();

  //

  $(".modal-body").on("change", function (e) {
    let coin_checked = e.target;
    console.log(coin_checked);
    if ($(coin_checked).is(":checked")) {
      let x = coin_checked.id;
      let temp = x.slice(1);
      console.log(temp);
      delete_coins.push(temp);
      console.log(delete_coins);
    }
  });
  addLocalStorage("SelectedCoins", selected_coins);
  $("#closemodal").on("click", closeModel);
}*/
function closeModel() {
  $(".modal").empty();
  $("#w_modal").hide();
}
function saveNewArr(arr1) {
  let origanArr = selected_coins;
  let deleteArr = [];
  //let modalSwitchs = $(".modal_body").find(".switch");
  //console.log(modalSwitchs);

  if (arr1.length > 0) {
    alert("saving");
    console.log("arr1: " + arr1);
    deleteArr = arr1;
    for (i = 0; i < deleteArr.length; i++) {
      for (j = 0; j < origanArr.length; j++) {
        if (origanArr[j].id === deleteArr[i]) {
          origanArr = selected_coins.splice(j, 1);
          console.log("origanArr", origanArr);
          //selected_coins = [...arr1.splice(j, 1)];
          console.log("you delete: " + deleteArr[j] + "!");
          console.log("selected_coins: " + selected_coins);
          let temp = deleteArr[i];
          $('#temp').prop("checked", !$('#temp').prop("checked"));

          /*if ($("#m" + temp).is(":checked", true)) {
            //selected_coins.toggleSwitch(temp);
            $("#" + temp).removeClass("active");
            $("#" + temp).is(":checked", false);*/
          }
           //console.log(selected_coins);
        }
      }
    }
  
  console.log("selected_coins: " + selected_coins);
  if ($(input_checked).is(":checked", false)) {
    $(input_checked).removeClass("active");
  }
  addLocalStorage("SelectedCoins", selected_coins);
  closeModel();
}

//API GET COINS
async function getDataAsync() {
  console.log("getDataAsync Function");
  let response = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
  let data = await response.json();
  return data;
}
//Home Page
function homePage() {
  console.log("homePage Function");
  $(document).ajaxStart(function () {
    $(".cover").show();
  });
  $(document).ajaxComplete(function () {
    $(".cover").hide();
  });
  $("#1").addClass("active");
  let sitetitel = "Cryptonite";
  var back_img = $(`
                      <div class ="parallax" id="back_img">
                          <div class ="img_titel">
                              <span class ="border">${sitetitel}</span> 
                          </div>
                      </div>`);

  div_home.append(back_img);

  if (lsArray) {
    alert("Take from LS!");
    allCoins = getCoinsFromLS();
    printCards(allCoins);
  } else {
    $(".cover").show();

    allCoins = getDataAsync()
      .then((data) => {
        console.log(data);
        allCoins = data;
        console.log("allCoins " + allCoins);
        return allCoins;
      })
      .then((allCoins) => {
        if (allCoins.length > 0) {
          printCards(allCoins);

          saveCoinsToLS(coinsArr);
          $(".cover").hide();
        }
      });
  }
}

//Navigation
function navfunc(panel) {
  $("[id*='panel']").hide();
  $("[id*='panel']").removeClass("active");
  $("#" + panel).show();
  $("#" + panel).addClass("active");
  if (panel != "panel1") {
    $(div_home).empty();
    $(div_card).empty();
    $("#1").removeClass("active");
  }
  switch (panel) {
    case "panel3":
      // code block
      alert("About!");

      break;
    case "panel2":
      // code block
      alert("Live!");
      //livePage();
      break;
    default:
      // code block
      alert("Home!");
      homePage();
  }
}

//Main
//$(document).ready(function() {
(function () {
  $(".modal").hide();
  localStorage.clear();
  console.log("Local Storege Has Been Cleared...");
  $(document).ajaxStart(function () {
    $(".cover").show();
    console.log("cover active");
  });
  $(document).ajaxComplete(function () {
    $(".cover").hide();
    console.log("cover not active");
  });
  $("[id*='panel']").addClass("active");
  homePage();
  navBtn.on("click", function () {
    console.log(navBtn);
    navBtn.toggleClass("active");
    var panelId = $(this).data("panelid");
    console.log("panelId: " + panelId);
    navfunc(panelId);
  });
})();
