var fs   = require("fs"),
    midi = require("midi"),
    mm   = require("musicmetadata"),
    path = require("path");

var cb = function(message) { console.log("MIDI DEBUG", message) }
var loadMessages  = []
var openEvents    = {}

exports.openAudioFile = function(fileName, ts) {
  // if no load messages, file opens are from the browser and are ignored
  if (loadMessages.length == 0) {
    console.log("track ignored filename=" + fileName)
    return false    
  }

  // if load message but much later file open, message was a snapshot and is discarded
  var message = loadMessages.pop()
  var d = ts / 1000000 - message.ts
  if (d > 200) { // TODO: should always be negative?
    console.log("track ignored filename=" + fileName + " delta=" + d)
    loadMessages = []
    return false;
  }

  // message and open are correlated, parse audio file and callback
  var parser = mm(fs.createReadStream(fileName));
  parser.on("metadata", function (result) {
    console.log("track loaded assignment=" + message[1] + " artist=" + result.artist + " title=" + result.title  + " delta=" + d)
    message.artist = result.artist
    message.title  = result.title
    message.group  = "Deck " + message[1] + " Load"
    cb(message)
  })

  // clear load messages buffer
  loadMessages = []
}

exports.listen = function(opts) {
  var portName = opts.portName  || "djtrace.js"
  if (opts.cb) cb = opts.cb

  var input = new midi.input();
  input.on("message", function(deltaTime, message) {
    message["ts"] = Date.now() // track wall time of message
    var channel = message[0]
    var cc      = message[1]
    var value   = message[2]

    console.log("midi input on message channel=" + channel + " cc=" + ("000" + cc).slice(-3) + " value=" + ("000" + value).slice(-3) + " ts=" + message.ts)

    if (channel == 176 && value==127) { // "Deck Is Loaded" events
      // buffer messages to process in openAudioFile callback
      loadMessages.push(message)
    }
    else if (channel == 177) { // Play/Pause + Monitor events
      if (cc >= 0 && cc <= 3) {
        message.group = "Deck " + message[1] + " Play"
        if (value == 127) cb(message)
      }
      else if (cc >= 4 && cc <= 7) {
        message.group = "Deck " + (message[1]-4) + " Mon."
        if (value == 127) cb(message)        
      }
    }
  })

  console.log("midi input open name=" + portName);
  input.openVirtualPort(portName);
}
