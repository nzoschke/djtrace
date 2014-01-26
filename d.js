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
  cb:       midi.openAudioFile
})

midi.listen({
  portName: "djtrace.js",
  cb:       app.publishTimelineData
})

