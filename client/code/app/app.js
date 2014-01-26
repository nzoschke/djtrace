// Timeline
var data = [];

// specify options
var options = {
  'box.align': 'left',
  'style': 'box',
  'axisOnTop': true,
  'groupsOrder': function(a, b) {
    var groups = [
      "Deck 0 Load", "Deck 0 Play", "Deck 0 Mon.", "Deck 0 Env",
      "Deck 1 Load", "Deck 1 Play", "Deck 1 Mon.", "Deck 1 Env",
      "Deck 2 Load", "Deck 2 Play", "Deck 2 Mon.", "Deck 2 Env",
      "Deck 3 Load", "Deck 3 Play", "Deck 3 Mon.", "Deck 3 Env",
    ]
    return groups.indexOf(a.content) - groups.indexOf(b.content);
  },
  'start':  new Date(Date.now() - 60000),   // -1m
  'end':    new Date(Date.now() + 600000),  // +10m
  // 'groupsWidth': 1000
};

// Instantiate our timeline object.
var timeline = new links.Timeline(document.getElementById('mytimeline'));

// function onRangeChanged(properties) {
//     document.getElementById('info').innerHTML += 'rangechanged ' +
//             properties.start + ' - ' + properties.end + '<br>';
// }

// attach an event listener using the links events handler
// links.events.addListener(timeline, 'rangechanged', onRangeChanged);

// Draw our timeline with the created data and options
timeline.draw(data, options);

ss.event.on("newTimelineData", function(data) {
  console.log(data)
  // convert serialized dates back to Date objects
  if (data.start) data.start = new Date(data.start)
  if (data.end)   data.end   = new Date(data.end)
  timeline.addItem(data)
});