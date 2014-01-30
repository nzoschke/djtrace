// Timeline
var data = [];

// specify options
var options = {
  'animate': false,
  'box.align': 'left',
  'cluster': true,
  'style': 'box',
  'axisOnTop': true,
  'groupsOrder': function(a, b) {
    if (a.content < b.content) return -1
    if (a.content > b.content) return 1
    return 0
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
  if (data.start) data.start = new Date(parseInt(data.start))
  if (data.end)   data.end   = new Date(parseInt(data.end))

  // update proof-of-concept
  // TODO: set proper IDs on the messages in the backend to keep everything in sync
  //console.log(timeline.getData())
  //var l = timeline.getData().length
  //if (l > 0) timeline.changeItem(l - 1, {end: data.start})

  // insert new data
  timeline.addItem(data)

});