//jquery event handlers
$(document).ready(function() {
  $('#send').on('click', function() {
    app.handleSubmit();
  });

  $('#main').on('click', '.chat-user', function() {
    //app.addFriend(); todo
  });

  $('#refresh').on('click', function() {
    app.fetch();
  });

  app.init();
  app.fetch();
});

//app functions
var app = {};

app.filterChats = function(roomName) {
  $('#chats').children().hide();
  $('.' + roomName).show();
}

app.init = function() {
  app.server = "https://api.parse.com/1/classes/chatterbox";
  var rawUserName = window.location.search;
  app.currentUser = rawUserName.slice(rawUserName.indexOf("=") + 1);
  app.currentRoom = "myRoom";
  app.rooms = {};
}

app.initRooms = function() {
  app.rooms = {};
}

app.addRoom = function(roomName) {
  if (!app.rooms.hasOwnProperty(roomName)) {
    app.rooms[roomName] = roomName;
  }
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

app.handleSubmit = function(data) {
  var message = {
    username: app.currentUser,
    text: $('#message').val(),
    roomname: app.currentRoom
  }
  app.send(message);
}

app.fetch = function() {
  $.ajax({
    type: "GET",
    url: app.server,
    success: app.successFetch,
  });

}

app.clearMessages = function() {
  $(".chats").children().each(function() {
    $(this).remove();
  });
}

app.successSend = function() {
  app.fetch();
}

app.successFetch = function(data) {
  app.clearMessages();

  var messages = new Messages(data['results']);

  var messagesView = new MessagesView({
    collection: messages
  });

  $('.chats-container').append(messagesView.render());

  var roomsData = _.map(app.rooms, function(value) {
    return {
      'value': value
    };
  });

  var rooms = new Rooms(roomsData);
  var roomsView = new RoomsView({
    collection: rooms
  });

  $('.room-select-container').append(roomsView.render());

  app.addRoomSelectHandler();
}

app.escapeHtml = function(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

app.addRoomSelectHandler = function() {
  $('#roomSelect').on('change', function() {
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
}

//Rooms backbone
var Room = Backbone.Model.extend({
  initialize: function() {}
});

var RoomView = Backbone.View.extend({
  initialize: function() {
    //this.model.on('change:votes', this.render, this);
  },
  render: function() {
    var html = [
      '<option class="room-select-item">',
      app.escapeHtml(this.model.get('value')),
      '</option>'
    ].join('');

    this.$el.html(html);
    return this.$el.find('.room-select-item');
  }
});

var Rooms = Backbone.Collection.extend({
  model: Room
});

var RoomsView = Backbone.View.extend({
  initialize: function() {
    //this.collection.on('change:votes', this.render, this);
  },
  render: function() {
    var html = [
      '<select id="roomSelect">',
      '</select>'
    ].join('');

    this.$el.html(html);

    this.$el.find('#roomSelect').append(this.collection.map(function(room) {
      var roomView = new RoomView({
        model: room
      });
      return roomView.render();
    }));

    return this.$el.find("#roomSelect");
  }
});

//backbone mvc
var Message = Backbone.Model.extend({
  initialize: function() {
    //this.set('message', message);
  }
});

var MessageView = Backbone.View.extend({
  initialize: function() {
    //this.model.on('change:votes', this.render, this);
  },
  render: function() {
    var html = [
      '<div class="chat">',
      '<div class="chat-user">',
      app.escapeHtml(this.model.get('username')),
      '</div>',
      '<div class="chat-message">',
      app.escapeHtml(this.model.get('text')),
      '</div>',
      '</div>'
    ].join('');

    app.addRoom(this.model.get('roomname'));

    return this.$el.html(html);
  }
});

var Messages = Backbone.Collection.extend({
  model: Message
});

var MessagesView = Backbone.View.extend({
  initialize: function() {
    //this.collection.on('change:votes', this.render, this);
  },
  render: function() {
    var html = [
      '<div class="chats">',
      '</div>'
    ].join('');

    this.$el.html(html);

    app.initRooms();

    this.$el.find('.chats').append(this.collection.map(function(message) {
      var messageView = new MessageView({
        model: message
      });
      return messageView.render();
    }));

    return this.$el;
  }
});
