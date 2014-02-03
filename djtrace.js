#!/usr/bin/env node
console.log("djtrace.js start")

var app     = require("./app")
var db      = require("./db")
var dtrace  = require("./dtrace")
var midi    = require("./midi")

app.listen({
  port:     3000
})

db.processEvents({
  cb:       app.publishRanges,
  interval: 1000
})

dtrace.consume({
  cb:       db.saveEvent,
  execName: "Traktor", 
  fileExts: [".mp3", ".wav", ".aiff", ".flac", ".ogg", ".wma", ".aac"],
  interval: 500
})

midi.listen({
  cb:       db.saveEvent
})
