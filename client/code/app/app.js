/* QUICK CHAT DEMO */

// Delete this file once you've seen how the demo works

// Listen out for newMessage events coming from the server
ss.event.on('newMessage', function(message) {

  // Example of using the Hogan Template in client/templates/chat/message.jade to generate HTML for each message
  var html = ss.tmpl['chat-message'].render({
    message: message,
    time: function() { return timestamp(); }
  });

  // Append it to the #chatlog div and show effect
  return $(html).hide().appendTo('#chatlog').slideDown();
});

// Show the chat form and bind to the submit action
$('#demo').on('submit', function() {

  // Grab the message from the text box
  var text = $('#myMessage').val();

  // Call the 'send' funtion (below) to ensure it's valid before sending to the server
  return exports.send(text, function(success) {
    if (success) {
      return $('#myMessage').val('');
    } else {
      return alert('Oops! Unable to send message');
    }
  });
});

// Demonstrates sharing code between modules by exporting function
exports.send = function(text, cb) {
  if (valid(text)) {
    return ss.rpc('demo.sendMessage', text, cb);
  } else {
    return cb(false);
  }
};

// Timeline
var data = [
  {
    'start': new Date(2010,7,23),
    'content': 'Conversation<br><img src="/images/img/comments-icon.png" style="width:32px; height:32px;">'
  },
  {
    'start': new Date(2010,7,23,23,0,0),
    'content': 'Mail from boss<br><img src="/images/img/mail-icon.png" style="width:32px; height:32px;">'
  },
  {
    'start': new Date(2010,7,24,16,0,0),
    'content': 'Report'
  },
  {
    'start': new Date(2010,7,28),
    'content': 'Memo<br><img src="/images/img/notes-edit-icon.png" style="width:48px; height:48px;">'
  },
  {
    'start': new Date(2010,7,29),
    'content': 'Phone call<br><img src="/images/img/Hardware-Mobile-Phone-icon.png" style="width:32px; height:32px;">'
  },
  {
    'start': new Date(2010,7,31),
    'end': new Date(2010,8,3),
    'content': 'Traject B'
  },
  {
    'start': new Date(2010,8,4,12,0,0),
    'content': 'Report<br><img src="/images/img/attachment-icon.png" style="width:32px; height:32px;">'
  }
  ];

// specify options
var options = {
    'width':  '100%',
    'height': '300px',
    'editable': true,   // enable dragging and editing events
    'style': 'box'
};

// Instantiate our timeline object.
var timeline = new links.Timeline(document.getElementById('mytimeline'));

function onRangeChanged(properties) {
    document.getElementById('info').innerHTML += 'rangechanged ' +
            properties.start + ' - ' + properties.end + '<br>';
}

// attach an event listener using the links events handler
links.events.addListener(timeline, 'rangechanged', onRangeChanged);

// Draw our timeline with the created data and options
timeline.draw(data, options);

ss.event.on("newTimelineData", function(data) {
  // convert serialized dates back to Date objects
  if (data.start) data.start = new Date(data.start)
  if (data.end)   data.end   = new Date(data.end)
  timeline.addItem(data)
});

// Private functions

var timestamp = function() {
  var d = new Date();
  return d.getHours() + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
};

var pad2 = function(number) {
  return (number < 10 ? '0' : '') + number;
};

var valid = function(text) {
  return text && text.length > 0;
};