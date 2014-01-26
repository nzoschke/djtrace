// Timeline
var data = [];

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