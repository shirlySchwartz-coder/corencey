//Varibels
const navBtn = $(".panel-button");
var div_home = $("#cont1");
var div_card = $("#card-wrapper");
var allCoins = [];

var lsArray = false;
var delete_coins = null;
var selected_coins = null;

localStorage.clear();

//Get Data
function getData() {
  $.ajax({
    type: "GET",
    url: "https://api.coingecko.com/api/v3/coins/list",
    success: function(data) {
      if (data.length > 0) {
        $(".cover").hide();

        allCoins = data;
        if (allCoins.length > 0) {
          console.log(allCoins);
          printCards(allCoins);
          saveCoinsToLS(allCoins);
          lsArray = true;
        }
      }
    },
    error: function() {
      alert("error!");
    }
  });
}

//Print Cards
function printCards(cardData) {
  for (let i = 0; i < 90; i++) {
    createCard(cardData[i]);
  }
}

//Create Cards
function createCard(coin) {
  
  var card = $(`<div class='col-md-4 card' id=c${coin.id}></div>`);
  var body = $(`<div class="card-body"></div>`);
  var first_row = $(`<div class="row"></div>`);
  var symbol = $(`<div class="card-title col" ><h4>${coin.symbol}<h4></div>`);
  var label_switch = $(`<label class="switch">
                          <input type="checkbox" name="sliderCheck" id=${coin.id} >
                          <span class="slider round"></span>
                        </label>`);
  var name = $(`<div class="card-text">Name : ${coin.name}</div>`);
  var infobtn = $(
    `<button class="btn btn-primary collapsible"  id="info_btn">More Info</button>`
  );
  var infoWrapper = $(`<div class="content"></div>`);
  $(first_row).append(symbol).append(label_switch);
  $(body).append(first_row).append(name).append(infobtn).append(infoWrapper);
  $(card).append(body);
  div_card.append(card);

  $(label_switch).on("change", function(e) {
    let input_checked = e.target;
    console.log(input_checked);
    if ($(input_checked).is(":checked")) {
      $(input_checked).addClass("active");
      if (selected_coins.length > 4) {
        alert("You Can Choose Only 5 Coins !!!");
        createModal(selected_coins, event.target);
      } else {
        selected_coins.push(coin.id);
        console.log(selected_coins);
      }
    } else {
      if ($(input_checked).is(":checked", false)) {
        $(input_checked).removeClass("active");
        console.log(selected_coins);
      }
    }
  });

  infobtn.on("click", function() {
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

//Get Info on Coin
function getSearchCoin() {
  var searchcoin = {};
  let search = $("#search").val();
  if (search.length < 3) {
    alert("Search Phrase too Short...");
    return;
  }
  var searchId;
 allCoins.forEach(coin=>{
     if(coin.symbol===search){
      searchId= coin.id;
      
     }     
  });
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${searchId}`,
    success: function(searchcoin) {
      $("#card-wrapper").html("");
      console.log(searchcoin);
      createCard(searchcoin);
    }
  });
}
//Save coins array to local storage
function saveCoinsToLS(arr) {
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

//Home Page
function homePage() {
  
  $("#1").addClass("active");
  let sitetitel = "Cryptonite";
  var back_img = $(`
                      <div class="parallax" id="back_img">
                          <div class="img_titel">
                              <span class="border">${sitetitel}</span> 
                          </div>
                      </div>`);

  div_home.append(back_img);

  if (lsArray) {
    //alert("Take from LS!");
    allCoins = getCoinsFromLS();
    printCards(allCoins);
  } else {
    allCoins = getData();
  }
}

//Navigation
function navfunc(panel) {
  $("[id*='panel']").hide();
  $("[id*='panel']").removeClass("active");
  $("#" + panel).show();
  $("#" + panel).addClass("active");
if(panel!="panel1"){
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
$(document).ready(function () {
	
  //localStorage.clear();
  $(document).ajaxStart(function() {
    $(".cover").show();
  });
  $(document).ajaxComplete(function() {
    $(".cover").hide();
  });
  $("[id*='panel']").addClass("active");
  homePage();
  navBtn.on("click", function() {
    var panelId = $(this).data("panelid");
    console.log("panelId: " + panelId);
    navfunc(panelId);
  });
});
