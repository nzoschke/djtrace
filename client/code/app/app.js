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

// Instantiate our timeline object and draw with options
var timeline = new links.Timeline(document.getElementById('mytimeline'));
timeline.draw(data, options)

// function onRangeChanged(properties) {
//     document.getElementById('info').innerHTML += 'rangechanged ' +
//             properties.start + ' - ' + properties.end + '<br>';
// }

// attach an event listener using the links events handler
// links.events.addListener(timeline, 'rangechanged', onRangeChanged);

function addRangeItems(ranges) {
    for(var i = 0; i < ranges.length; i++) {
    timeline.addItem({
      start:      ranges[i].start,
      end:        ranges[i].end,
      group:      ranges[i].grp,
      content:    ranges[i].content,
      className:  ranges[i].className
    })
  }
}

links.events.addListener(timeline, "ready", function(e) {
  ss.rpc("ranges.load", Date.now() - 100000000, function(ranges) { // TODO: more reasonable past window
    console.log("ranges.load", ranges)
    addRangeItems(ranges)
  })
})

ss.event.on("ranges.new", function(ranges) {
  console.log("ranges.new", ranges)
  addRangeItems(ranges)
})