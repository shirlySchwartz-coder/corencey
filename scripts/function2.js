//Varibels
const $body = $("body");
const navBtn = $(".panel-button");
const chartBox = $("#chartContainer");
var div_home = $("#cont1");
var div_card = $("#card-wrapper");
var checkBoxArray = [];
var symbolArray = [];
var timeLabels = [];
var updateInterval = 2000;
var livePageIsOn = false;
var homePageIsOnFirstTime = true;
var myVar = "";
var dataFromApiCall = [];
var selectedData;
var idVar;
var datasets = [];
var dataObjects;

var lsArray = false;
var delete_coins = [];
var allCoins = [];

class Coin {
  constructor(id, symbol, name, index) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.index = index;
  }
}

const coinsArr = [];

(function () {
  //
  $(document).on({
    ajaxStart: ajaxAdd,
    ajaxStop: ajaxRemove,
  });
  //
  $(".modal").hide();
  localStorage.clear();
  console.log("Local Storege Has Been Cleared...");

  $("[id*='panel']").addClass("active");
  homePage();
  navBtn.on("click", function () {
    console.log(navBtn);

    navBtn.toggleClass("active");
    var panelId = $(this).data("panelid");
    console.log("panelId: " + panelId);
    //killInterval();
    navfunc(panelId);
  });
})();
//starts ajax loading
function ajaxAdd() {
  $(".cover").show();
}

//stops ajax loading
function ajaxRemove() {
  $(".cover").hide();
}

//Print Cards
function printCards(cardData) {
  //console.log("printCards Function");
  for (let i = 0; i < 100; i++) {
    coinsArr.push(
      new Coin(cardData[i].id, cardData[i].symbol, cardData[i].name, i)
    );
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
    toggleCoin(coin, e);
  });

  infobtn.on("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      //console.log("hide");
    } else {
      content.style.display = "block";
      //console.log("show");

      getInfoOnCoin(infoWrapper, coin.id);
    }
  });
}
//Toogle Select Coins

function toggleCoin(currentCoin, event) {
  let input_checked = event.target;
  let input = input_checked.closest("label");
  //console.log("input", input);

  if (symbolArray.includes(currentCoin.symbol)) {
    //console.log("in the array");
    checkBoxArray.splice(checkBoxArray.indexOf(input), 1);
    symbolArray.splice(symbolArray.indexOf(currentCoin.symbol), 1);
  } else {
    //console.log("not in the array");
    if (checkBoxArray.length > 4) {
      alert("more the five");

      createModal(checkBoxArray, input_checked);
    } else {
      let checked = input.cloneNode(true);
      checkBoxArray.push(checked);
      //console.log("checkBoxArray", checkBoxArray);
      symbolArray.push(currentCoin.symbol);
      //console.log("symbolArray", symbolArray);
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
      //console.log(searchcoin);
      createCard(searchcoin, i);
    },
  });
}
//Get Coin Info
function getInfoOnCoin(wrepper, coinId) {
  let now = new Date();

  if (localStorage.getItem(coinId) === null) {
    makeAPIInfoOnCoinReq(wrepper, coinId, now);
  } else {
    let localStorageObj = JSON.parse(localStorage.getItem(coinId));
    if (Date.now() - localStorageObj.time > 120000) {
      //2 minuts pass
      console.log("2 minuts passed !!!");
      makeAPIInfoOnCoinReq(wrepper, coinId, now);
    } else {
      //2 minuts not passed
      console.log("2 minuts not passed");
      printInfoOnCoin(wrepper, localStorageObj.res);
    }
  }
}
function makeAPIInfoOnCoinReq(wrepper, coinId, now) {
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
    success: function (infoCoin) {
      //console.log(infoCoin);
      let localStorageObj = {
        res: infoCoin,
        time: now.toString(),
      };
      printInfoOnCoin(wrepper, infoCoin);
      localStorage.setItem(coinId, JSON.stringify(localStorageObj));
    },
    error: function () {
      alert("error!");
    },
  });
}
//Print Info on Coin
function printInfoOnCoin(wrepper, coinInfo) {
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
}

function addLocalStorage(name, data) {
  console.log(data + "saving to local storage");
  localStorage.setItem(name, data);
}

//Save Json coins array to local storage
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

  checkBoxArray.forEach((element) => {
    console.log(element);
    let div = $(`<div class="button-holder"></div>`)[0];
    div.append(element);
    div.append(element.id);

    $(".modal-body")[0].append(div);
  });

  $("#myModal").show();
}

//Modal
//cancel was clicked on modal
function cancelModal() {
  $(".modal-body").empty();
  $(".modal").hide();
}
function closeModel() {
  $(".modal").hide();
}

function saveNewArr() {
  let localCheckBoxArray = [];
  let localSymbolArray = [];
  let origArray = [];

  origArray = $(".modal-body").find(".switch");

  for (let i = 0; i < origArray.length; i++) {
    let checkbox = $(origArray[i]).find("input")[0];
    let bool = $(checkbox).is(":checked");
    if (bool) {
      localCheckBoxArray.push(origArray[i]);
      //console.log("localCheckBoxArray", localCheckBoxArray);
    }
  }

  for (let i = 0; i < localCheckBoxArray.length; i++) {
    localSymbolArray.push(localCheckBoxArray[i].id);
  }

  //on toogle model switch
  let allSwitchs = $(".root").find(".switch");
  for (let i = 0; i < allSwitchs.length; i++) {
    if (localSymbolArray.indexOf(allSwitchs[i].id) == -1) {
      let input = allSwitchs[i].children[0];
      $(input).prop("checked", false);
    }
  }
  checkBoxArray = [...localCheckBoxArray];
  symbolArray = [...localSymbolArray];
  //console.log("symbolArray", symbolArray);

  $(".modal").hide();
  $(".modal-body").empty();
}

//API GET COINS
async function getDataAsync() {
  //console.log("getDataAsync Function");
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

  if (!homePageIsOnFirstTime) {
    //alert("Take from LS!");
    allCoins = getCoinsFromLS();
    printCards(allCoins);
  } else {
    $(".cover").show();

    allCoins = getDataAsync()
      .then((data) => {
        //console.log(data);
        allCoins = data;
        //console.log("allCoins " + allCoins);
        return allCoins;
      })
      .then((allCoins) => {
        if (allCoins.length > 0) {
          printCards(allCoins);
          saveCoinsToLS(coinsArr);
          homePageIsOnFirstTime = false;
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
      if (idVar) clearInterval(idVar);
      //alert("About!");
      createAbout();

      break;
    case "panel2":
      livePageIsOn = !livePageIsOn;
      if (idVar) clearInterval(idVar);
      $(document).off({
        ajaxStart: ajaxAdd,
        ajaxStop: ajaxRemove,
      });
      livePage();

      break;
    default:
      // code block
      if (idVar) clearInterval(idVar);
      //alert("Home!");
      homePage();
  }
}

//-----------------------------------------------------LIVE PAGE-----------------------------------------------
function stopInterval() {
  console.log(idVar);
  clearInterval(idVar);
}

function getStringForURLSerch() {
  let str = "";
  var symbolUperCase = [];
  let selectedCoinsSymbol = [...symbolArray];

  console.log(selectedCoinsSymbol);
  selectedCoinsSymbol.forEach((element) => {
    symbolUperCase.push(element.toUpperCase());
  });

  for (let i = 0; i < symbolUperCase.length; i++) {
    str += symbolUperCase[i];
    if (i + 1 < symbolUperCase.length) {
      str += ",";
    }
  }
  //console.log(str);
  return str;
}

async function livePage() {
  //alert("Live function! ");
  var synbolStr = "";
  if (livePageIsOn) {
    livePageIsOn = !livePageIsOn;
    //GET STRING FOR URL
    console.log("Get Chart Info");
    //If no selected coins give warrning, go to home page
    if (symbolArray.length == 0) {
      alert("You need to select several coins first!");
      stopInterval();
      homePage();
    } else {
      symbolStr = getStringForURLSerch();
      //console.log('dataFromApi', dataFromApi);
      //console.log("start chart");

      $(chartBox).append('<canvas id="myChart"></canvas>');
      
      //new chart creation
      var ctx = document.getElementById("myChart").getContext("2d");
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",
        // The data for our dataset
        data: {
          labels: timeLabels,
          datasets: datasets,
        },

        // Configuration options go here
        options: {
          animation: { duration: 1000 * 1, easing: "linear" },
        },
      });

      //dataFromApiCall = await getDataFromUrl(symbolStr,timeLabels,chart);
      var d = new Date();
      var formatted_time = time_format(d);
      timeLabels.push(formatted_time);
      getCurrentPrice(symbolStr, timeLabels, chart);

      //will run on setinterval()
      idVar = setInterval(() => {
        var d = new Date();
        var formatted_time = time_format(d);
        if (timeLabels.length > 10) timeLabels.shift();
        timeLabels.push(formatted_time);
        getCurrentPrice(symbolStr, timeLabels, chart);
      }, 1000);
      //
    }
  }
}

function getCurrentPrice(str, timeLabels, chart) {
  //let coinSymbolsString = symbolArray.join();
  let fullURL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`;
  //min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD
  $.ajax({
    url: fullURL,
    success: function (res) {
      if (res) drawChart(res, timeLabels, chart);
    },
    error: function () {
      alert("error!");
    },
  });
}

function drawChart(res, timeLabels, chart) {
  try {
    let datasets = buildDataSets(res);
    chart.data.labels = timeLabels;
    chart.data.datasets = datasets;
    chart.update(1000);
  } catch (exception) {}
}

function buildDataSets(res) {
  if (datasets.length == 0) {
    Object.keys(res).forEach((element) => {
      let coinName = element;
      let coinPrice = res[element]["USD"];

      let dataObject = {
        label: `${coinName}`,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        fill: false,
        data: [coinPrice],
      };
      datasets.push(dataObject);
    });
  } else {
    for (let i = 0; i < datasets.length; i++) {
      let coinPrice = res[Object.keys(res)[i]]["USD"];
      if (datasets[i].data.length > 10) datasets[i].data.shift();
      datasets[i].data = [...datasets[i].data, coinPrice];
    }
  }
  return datasets;
}

//time functions
function time_format(d) {
  hours = format_two_digits(d.getHours());
  minutes = format_two_digits(d.getMinutes());
  seconds = format_two_digits(d.getSeconds());
  return hours + ":" + minutes + ":" + seconds;
}

function format_two_digits(n) {
  return n < 10 ? "0" + n : n;
}

//get random color
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

///////////////////////About Page
function createAbout() {
  console.log("In About Page");
  var aboutcont = document.getElementById("aboutWrepper");
  let picDiv = $(
    '<img src="./media/Shirly.jpg" class="about_img mt-5 col-4"></img>'
  );
  let aboutDiv = $(`<div class=mt-5 col-10><h3>My name is Shirly Schwartz <br>I'm a mother of one.<br>I am A Web Devloper.<br>I am a Software Engineer and Computer Technician.<br>I live in Harish.<br>I study Full Stack College John Brice Haifa.
  </h3></div>`);
  $(aboutcont).append(picDiv).append(aboutDiv);
}
