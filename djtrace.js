#!/usr/bin/env node
console.log("djtrace.js start")

var app     = require("./app")
var dtrace  = require("./dtrace")
var midi    = require("./midi")

app.listen({
  port: 3000
})

dtrace.consume({
  execName: "Traktor", 
  fileExts: [".mp3", ".wav", ".aiff", ".flac", ".ogg", ".wma", ".aac"],
  interval: 500,
})

midi.listen({
  cb: app.publishTimelineData
})

function drainBuffers(dts, mts) {
  var message = midi.buffer[mts]
  message.content = dtrace.buffer[dts].split("/").slice(-1)[0]
  app.publishTimelineData(message)  // emit correlated event

  delete dtrace.buffer[dts]         // modify dtrace buffer
  delete midi.buffer[dts]           // modify midi buffer
}

setInterval(function() {
  var dts = Object.keys(dtrace.buffer)
  var mts = Object.keys(midi.buffer)

  // stale case: any event timestamp is more than 10 sec old
  var now = Date.now()
  dts.concat(mts).forEach(function(ts) {
    if (ts < now - 10000) {
      delete dtrace.buffer[ts]
      delete   midi.buffer[ts]
    }
  })

  // Correlate every file event with a midi event. Depends on time sorting.
  dts = Object.keys(dtrace.buffer).sort()
  mts = Object.keys(midi.buffer).sort()

  // special case: a single file event is trailed by a single load event
  if (dts.length == mts.length == 1 && mts[0]-dts[0] > 0 && mts[0]-dts[0] < 5000)
    return drainBuffers(dts[0], mts[0])

  // normal case: a file event is preceeded between -10 and 100ms by an (un)load event
  for (var i = 0; i < dts.length; i++) {
    mts = Object.keys(midi.buffer).sort()  // reload midi buffer in case modified
    for (var j = 0; j < mts.length; j++) {
      var delta = dts[i] - mts[j]
      if (-10 < delta && delta < 100) {
        drainBuffers(dts[i], mts[j])
        break
      }
    }
  }
}, 1000)