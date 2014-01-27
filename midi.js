var fs   = require("fs"),
    midi = require("midi"),
    mm   = require("musicmetadata"),
    path = require("path");

var cb = function(message) { console.log("MIDI DEBUG", message) }
var loadMessages = {}
var openEvents   = {}

exports.openAudioFile = function(fileName, ts) {
  console.log("open debug filename=" + fileName + " ts=" + ts)

  // if no load messages, file opens are from the browser and are ignored
  if (Object.keys(loadMessages).length == 0) {
    console.log("file ignored filename=" + fileName + " ts=" + ts + " messages={}")
    return false    
  }

  // clone the message buffer and process it
  var messages = JSON.parse(JSON.stringify(loadMessages))
  for (var mts in messages) {
    var message = messages[mts]
    var delta = ts / 1000000 - mts
    // console.log("message debug message=" + message + " ts=" + mts + " delta=" + delta)

    // if message came shortly after open (500ms), assume they go together
    if (delta < 0 && delta > -500) {
      var parser = mm(fs.createReadStream(fileName))
      parser.on("metadata", function (result) {
        console.log("track loaded assignment=" + message[1] + " artist=" + result.artist + " title=" + result.title)
        message.start  = parseInt(mts)
        message.artist = result.artist[0]
        message.title  = result.title
        message.group  = "Deck " + message[1] + " Load"
        cb(message)
      })

      // remove processed message from buffer
      console.log("message processed message=" + message + " ts=" + mts + " delta=" + delta)
      delete loadMessages[mts]
    }

    // if message came way before open (5s), assume message window is long past and discard
    else if (delta > 5000) {
      console.log("message discarded message=" + message + " ts=" + mts + " delta=" + delta)
      delete loadMessages[mts]
    }

    // otherwise assume message window is still open
    else {
      console.log("message deferred message=" + message + " ts=" + mts + " delta=" + delta)
    }
  }
}

exports.listen = function(opts) {
  var portName = opts.portName  || "djtrace.js"
  if (opts.cb) cb = opts.cb

  var input = new midi.input();
  input.on("message", function(deltaTime, message) {
    message.ts = Date.now() // track wall time of message

    var channel = message[0]
    var cc      = message[1]
    var value   = message[2]

    console.log("midi input on message channel=" + channel + " cc=" + ("000" + cc).slice(-3) + " value=" + ("000" + value).slice(-3) + " ts=" + message.ts)

    if (channel == 176 && value==127) { // "Deck Is Loaded" events
      // buffer messages to process in openAudioFile callback
      loadMessages[message.ts] = message
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
    else if (channel == 178) {
      message.group = "Deck " + (message[1]-4) + " Env."
      cb(message)
    }
  })

  console.log("midi input open name=" + portName);
  input.openVirtualPort(portName);
}
