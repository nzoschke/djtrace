var libdtrace = require("libdtrace"),
    path      = require("path");

var dSrc      = 'syscall::open*:entry /execname == "Traktor"/ { @[copyinstr(arg0)] = max(walltimestamp); }'
var fileExts  = [".mp3", ".wav", ".aiff", ".flac", ".ogg", ".wma", ".aac"]
var portName  = "djtrace.js"

exports.consume = function(opts) {
  var execName = opts.execName  || "Traktor"
  var fileExts = opts.fileExts  || [".mp3"]
  var interval = opts.interval  || 1000
  var cb       = opts.cb        || function(path, ts) { console.log("DTRACE DEBUG", path, ts) }

  var src = 'syscall::open*:entry /execname == "' + execName + '"/ { @[copyinstr(arg0)] = max(walltimestamp); }'

  var dtp = new libdtrace.Consumer();
  dtp.strcompile(src);
  dtp.go();
  console.log("dtrace probe go");

  setInterval(function () {
    dtp.aggwalk(function (id, key, val) {
      if (fileExts.indexOf(path.extname(key[0])) == -1) return;
      cb(key[0], val)
      // if (loadMessages.length > 0) {
      //   emitter.emit("openAudioFile", key[0], val, loadMessages)
      //   loadMessages = []
      // }
    });
  }, interval);
}