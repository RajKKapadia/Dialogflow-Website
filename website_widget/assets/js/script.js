$(document).ready(function () {

  let baseUrl = "http://localhost:5000/website";

  var mybot =
    '<div class="chatCont" id="chatCont">' +
    '<div class="bot_profile">' +
    '<div class="close">' +
    '<i class="fa fa-times" aria-hidden="true"></i>' +
    "</div>" +
    "</div><!--bot_profile end-->" +
    '<div id="result_div" class="resultDiv"></div>' +
    '<div class="chatForm" id="chat-div">' +
    '<div class="spinner">' +
    '<div class="bounce1"></div>' +
    '<div class="bounce2"></div>' +
    '<div class="bounce3"></div>' +
    "</div>" +
    '<input type="text" id="chat-input" autocomplete="off" placeholder="Type a message"' +
    'class="form-control bot-txt"/>' +
    "</div>" +
    "</div><!--chatCont end-->" +
    '<div class="profile_div">' +
    '<div class="row">' +
    '<div class="col-hgt">' +
    '<img src="assets/img/icons8-chat-96.png" class="img-circle img-profile">' +
    "</div><!--col-hgt end-->" +
    "</div><!--row end-->" +
    "</div><!--profile_div end-->";

  $("mybot").html(mybot);
  $("#chat-input").focus();

  // ----------------------------------------- Variable to handle auto send Hello ----------------------------
  let count = 0;

  // ------------------------------------------ Toggle chatbot -----------------------------------------------
  $(".profile_div").click(function () {
    $(".profile_div").toggle();
    $(".chatCont").toggle();
    $(".bot_profile").toggle();
    $(".chatForm").toggle();
    if (count == 0) {
      send("hello");
      count += 1;
    }
    document.getElementById("chat-input").focus();
  });

  $(".close").click(function () {
    $(".profile_div").toggle();
    $(".chatCont").toggle();
    $(".bot_profile").toggle();
    $(".chatForm").toggle();
  });

  // Session Init (is important so that each user interaction is unique)--------------------------------------
  var session = function () {
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    var uid = navigator_info.mimeTypes.length;
    uid += navigator_info.userAgent.replace(/\D+/g, "");
    uid += navigator_info.plugins.length;
    uid += screen_info.height || "";
    uid += screen_info.width || "";
    uid += screen_info.pixelDepth || "";
    return uid;
  };

  // Call Session init
  var mysession = session();

  //----------------------------------------- on input/text enter ---------------------------------------------
  $("#chat-input").on("keyup keypress", function (e) {
    var keyCode = e.keyCode || e.which;
    var text = $("#chat-input").val();
    if (keyCode === 13) {
      if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
      } else {
        $("#chat-input").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    }
  });

  //------------------------------------------- Send request to backend ---------------------------------------
  function send(text) {
    $.ajax({
      type: "GET",
      url: baseUrl,
      data: { text, mysession },
      success: function (data) {
        main(data);
      },
      error: function (e) {
        console.log(e);
      },
    });
  };

  //------------------------------------------- Main function ------------------------------------------------
  function main(data) {
    let intentData = JSON.parse(data);
    setTimeout(function () {
      setBotResponse(intentData.text);
      if (intentData.buttons.length > 0) {
        addSuggestion(intentData.buttons);
      }
    }, getRndInteger(500, 1000));
  };

  //----------------------------------- Get a random number -------------------------------------------------
  function getRndInteger(min, max) {
    let rNumb = Math.floor(Math.random() * (max - min)) + min;
    console.log(rNumb);
    return rNumb;
  };

  //------------------------------------ Set bot response in result_div -------------------------------------
  function setBotResponse(val) {
    if ($.trim(val) == "") {
      val = "I couldn't get that. Let's try something else!";
      var BotResponse =
        '<p class="botResult">' + val + '</p><div class="clearfix"></div>';
      $(BotResponse).appendTo("#result_div");
    } else {
      val = val.replace(new RegExp("\r?\n", "g"), "<br />");
      var BotResponse =
        '<div class="content-block"><p class="botResult">' +
        val +
        '</p></div><div class="clearfix"></div>';
      $(BotResponse).appendTo("#result_div");
    }
    scrollToBottomOfResults();
    hideSpinner();
    $("#chat-input").focus();
  };

  //------------------------------------- Set user response in result_div ------------------------------------
  function setUserResponse(val) {
    var UserResponse =
      '<div class="content-block"><p class="userEnteredText">' +
      val +
      '</p></div><div class="clearfix"></div>';
    $(UserResponse).appendTo("#result_div");
    $("#chat-input").val("");
    scrollToBottomOfResults();
    showSpinner();
    $(".suggestion").remove();
  };

  //---------------------------------- Scroll to the bottom of the results div -------------------------------
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById("result_div");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  };

  //---------------------------------------- Ascii Spinner ---------------------------------------------------
  function showSpinner() {
    $(".spinner").show();
  };
  function hideSpinner() {
    $(".spinner").hide();
  };

  //------------------------------------------- Suggestions ------------------------------------------
  function addSuggestion(textToAdd) {
    var suggestions = textToAdd;
    var suggLength = textToAdd.length;
    $('<p class="suggestion"></p>').appendTo("#result_div");
    // $('<div class="sugg-title">Suggestions: </div>').appendTo(".suggestion");
    for (i = 0; i < suggLength; i++) {
      $('<span class="sugg-options">' + suggestions[i] + "</span>").appendTo(
        ".suggestion"
      );
    }
    scrollToBottomOfResults();
  };

  $(document).on("click", ".suggestion span", function () {
    var text = this.innerText;
    setUserResponse(text);
    send(text);
    $(".suggestion").remove();
  });
  //----------------------------------------------- Suggestions end ----------------------------------
});
