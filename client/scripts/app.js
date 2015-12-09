$(document).ready(function() {
  $('#send').on('click', function() {
    app.handleSubmit();
  });

  $('#main').on('click', '.chat-user', function() {
    app.addFriend();
  });

  $('#refresh').on('click', function() {
    app.fetch();
  });

  $('#roomSelect').on('change', function() {
    //$(this)
    if ($(this).val() === "Add a Room") {
      app.roomName = prompt("Room name?");

      var $roomSelect = $('#roomSelect')
      var $room = $("<option value='" + app.roomName + "'></option>");
      $room.text(app.roomName);
      $room.appendTo($roomSelect);

      $('#roomSelect').val(app.roomName).change();
    } else {
      app.filterChats($(this).val());
    }
  });

  app.init();
  app.fetch();
});

var app = {};

app.filterChats = function(roomName) {
  $('#chats').children().hide();
  $('.' + roomName).show();
}

app.init = function() {
  app.server = "https://api.parse.com/1/classes/chatterbox";
  var rawUserName = window.location.search;
  app.userName = rawUserName.slice(rawUserName.indexOf("=") + 1);
  app.roomName = "myRoom";
  app.rooms = {
    myRoom: "myRoom"
  };
}

app.send = function(msg) {
  $.ajax({
    type: "POST",
    url: app.server,
    data: JSON.stringify(msg),
    success: app.successSend,
    error: function(data) {
      console.log("error")
    }
  });
}

app.fetch = function() {
  $.ajax({
    type: "GET",
    url: app.server,
    success: app.successFetch,
  });

}

app.successSend = function() {
  app.fetch();
}

app.successFetch = function(data) {
  app.clearMessages();
  _.each(data["results"], function(item) {
    app.addMessage(item);
    if (!app.rooms.hasOwnProperty(item.roomname)) {
      app.rooms[item.roomname] = item.roomname;
    }
  });

  var $roomSelect = $('#roomSelect')
  var $room = $("<option value='Select'>Select...</option>");
  $room.appendTo($roomSelect);
  $room = $("<option value='Add a Room'>Add a Room...</option>");
  //append it to the roomSelect
  $room.appendTo($roomSelect);

  for (var room in app.rooms) {
    if (app.rooms[room] && app.rooms[room] !== "") {
      var $room = $("<option value='" + app.rooms[room] + "'></option>");
      $room.text(app.rooms[room]);
      //append it to the roomSelect
      $room.appendTo($roomSelect);
    }
  }
}

app.clearMessages = function() {
  $("#chats").children().each(function() {
    $(this).remove();
  });
}

app.addMessage = function(data) {
  var $chats = $("#chats");
  var $chatBody = $('<div class="chat ' + data.roomname + '" ></div>');

  var $chatUser = $('<div class="chat-user"></div>');
  $chatUser.text(data.username);
  var $chatMessage = $('<div class="chat-message"></div>');
  $chatMessage.text(data.text);
  // var $chatRoom = $('<div class="chat-room"></div>');
  // $chatRoom.text(data.roomname);

  $chatUser.appendTo($chatBody);
  $chatMessage.appendTo($chatBody);
  // $chatRoom.appendTo($chatBody);

  $chatBody.appendTo($chats);
}

app.addRoom = function(roomName) {
  var $rooms = $("#roomSelect")
  var $roomName = $('<div class="chat-room-select">' + roomName + '</div>');
  $roomName.appendTo($rooms);
}

app.addFriend = function(friend) {
  console.log('friend');
}

app.handleSubmit = function(data) {
  var message = {
    username: app.userName,
    text: $('#message').val(),
    roomname: app.roomName
  }
  app.send(message);
}
