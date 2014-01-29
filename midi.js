var fs   = require("fs"),
    midi = require("midi"),
    mm   = require("musicmetadata"),
    path = require("path");

var cb = function(message) { console.log("MIDI DEBUG", message) }

exports.buffer = {}

exports.listen = function(opts) {
  var portName = opts.portName  || "djtrace.js"
  if (opts.cb) cb = opts.cb

  var input = new midi.input();
  input.on("message", function(deltaTime, message) {
    var ts      = Date.now() // track wall time of message
    var channel = message[0]
    var cc      = message[1]
    var value   = message[2]

    console.log("midi message channel=" + channel + " cc=" + ("000" + cc).slice(-3) + " value=" + ("000" + value).slice(-3) + " ts=" + ts)

    // Deck Is Loaded events: buffer for external processing
    if (channel == 176) {
      exports.buffer[ts] = message
    }
    // Monitor, Play/Pause or Envelope events
    else if (channel == 177 || channel == 178 || channel == 179) {
      message.start   = ts
      message.content = value
      message.group   = channel + "," + cc
      cb(message)
    }
  })

  console.log("midi input open name=" + portName);
  input.openVirtualPort(portName);
}
