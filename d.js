#!/usr/bin/env node

var app     = require("./app")
// var dtrace  = require("dtrace")
// var midi    = require("midi")

app.listen({port: 3000})

// midi.listen(
//   portName: "djtrace.js",
//   cb:       web.publishTimelineData
// )

// dtrace.consume(
//   execName: "Traktor", 
//   fileExts: [".mp3", ".wav", ".aiff", ".flac", ".ogg", ".wma", ".aac"],
//   cb:       midi.openAudioFile
// )
