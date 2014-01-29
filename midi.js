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
    message.ts = Date.now() // track wall time of message

    var channel = message[0]
    var cc      = message[1]
    var value   = message[2]

    console.log("midi message channel=" + channel + " cc=" + ("000" + cc).slice(-3) + " value=" + ("000" + value).slice(-3) + " ts=" + message.ts)

    // Deck Is Loaded events: buffer for external processing
    if (channel == 176) {
      exports.buffer[message.ts] = message
    }
    // Monitor events
    else if (channel == 177) {
      cb(message)
    }
    // Play/Pause events
    else if (channel == 178) {
      cb(message)
    }
    // Envelope events
    else if (channel == 179) {
      cb(message)
    }
  })

  console.log("midi input open name=" + portName);
  input.openVirtualPort(portName);
}
