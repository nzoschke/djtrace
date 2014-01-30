var conf = require("./conf"),
    fs   = require("fs"),
    midi = require("midi"),
    mm   = require("musicmetadata"),
    path = require("path");

var cb = function(message) { console.log("MIDI DEBUG", message) }

exports.buffer = {}

exports.listen = function(opts) {
  if (opts.cb) cb = opts.cb

  var channels = {}
  var input = new midi.input()

  conf.midiIO.forEach(function(dev) {
    typeof dev.port == "string" ? input.openVirtualPort(dev.port) : input.openPort(dev.port)
    console.log("midi input open port=" + dev.port)

    for (channel in dev.channels) {
      channels[channel] = dev.channels[channel]
    }
  })

  input.on("message", function(deltaTime, message) {
    var ts      = Date.now() // track wall time of message

    var name  = null
    var group = null
    if (message[0] in channels && message[1] in channels[message[0]]) {
      name  = channels[message[0]][message[1]][0]
      group = channels[message[0]][message[1]][1]
    }

    console.log("midi message channel=" + message[0] + " cc=" + ("000" + message[1]).slice(-3) + " val=" + ("000" + message[2]).slice(-3) + " ts=" + ts + " group=" + group + " name=" + name)
    if (!group) return

    var m = {
      start:    ts,
      content:  message[2],
      group:    group,
    }

    // buffer load events to later correlate with open events
    if (group.match(/^ Load$/)) 
      exports.buffer[ts] = m

    // trigger callback for all other events
    else 
      cb(m)
  })

}
