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

  //create messages collection and load with data[results]

  var messages = new Messages(data['results']);

  var messagesView = new MessagesView({
    collection: messages
  });

  // Append it to the page (uncomment this when you are ready):
  $('.chats-container').append(messagesView.render());
  // messagesView.render();
  ///create messages view and render

  // _.each(data["results"], function(item) {
  //   app.addMessage(item);
  //   if (!app.rooms.hasOwnProperty(item.roomname)) {
  //     app.rooms[item.roomname] = item.roomname;
  //   }
  // });

  // var $roomSelect = $('#roomSelect')
  // var $room = $("<option value='Select'>Select...</option>");
  // $room.appendTo($roomSelect);
  // $room = $("<option value='Add a Room'>Add a Room...</option>");
  // //append it to the roomSelect
  // $room.appendTo($roomSelect);

  // for (var room in app.rooms) {
  //   if (app.rooms[room] && app.rooms[room] !== "") {
  //     var $room = $("<option value='" + app.rooms[room] + "'></option>");
  //     $room.text(app.rooms[room]);
  //     //append it to the roomSelect
  //     $room.appendTo($roomSelect);
  //   }
  // }
}

app.escapeHtml = function(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//backbone mvc
var Message = Backbone.Model.extend({
  /* This is purposely different from the previous steps.
   * Make sure to do those first (!!!) and then check here for new patterns. */

  initialize: function() {
    //this.set('message', message);
  },
  // Default to 0 votes
  // defaults: {
  //   votes: 0
  // },
  // Convenience function over `model.get/set`
  // votes: function(votes) {
  //   if (arguments.length) {
  //     this.set('votes', votes);
  //     return votes;
  //   } else {
  //     return this.get('votes');
  //   }
  // }
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

    return this.$el.html(html);
  }
});

var Messages = Backbone.Collection.extend({
  model: Message
});

var MessagesView = Backbone.View.extend({
  /* Again, we use our initialize function to register listeners.
   * In this case, we want to know when votecounts of the models
   * in our collection changes. */
  initialize: function() {
    /* Backbone events bubble up through collections,
     * so monitoring a model in a collection is easy! */
    //this.collection.on('change:votes', this.render, this);
  },

  // Now we must render the collection:
  render: function() {
    var html = [
      '<div class="chats">',
      '</div>'
    ].join('');

    this.$el.html(html);

    this.$el.find('.chats').append(this.collection.map(function(message) {
      var messageView = new MessageView({
        model: message
      });
      return messageView.render();
    }));

    return this.$el;
  }
});
