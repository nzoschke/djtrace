var sqlite3 = require("sqlite3").verbose()

var db = new sqlite3.Database("./djtrace.sqlite3")

db.on("trace", function(s) {
  if (s.substring(0, 6) == "SELECT") return;
  console.log("SQL TRACE " + s)
})

db.serialize(function() {
  // https://github.com/mapbox/node-sqlite3/wiki/API
  db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY ASC, start REAL,           grp TEXT, content TEXT, rangeId INTEGER);")
  db.run("CREATE TABLE IF NOT EXISTS ranges (id INTEGER PRIMARY KEY ASC, start REAL, end REAL, grp TEXT, content TEXT, className TEXT);")
})

exports.saveEvent = function(event) {
  db.run(
    "INSERT INTO events VALUES (null, ?, ?, ?, null)", 
    event.start, event.group, event.content
  )
}

exports.processEvents = function(opts) {
  var interval = opts.interval  || 1000
  var cb       = opts.cb        || function(row) { console.log("SQL DEBUG", row) }

  setInterval(function() {

    db.each("SELECT * FROM events WHERE grp='Audio File Open' AND rangeId IS NULL", function(err, row) {
      db.all("SELECT * FROM events WHERE grp LIKE 'Deck _ Load' AND start BETWEEN ? AND ?",
        row.start - 500, row.start + 500,
        function(err, rows) {
          if (rows.length == 0) return
          if (rows.length  > 1) console.log("SQL DEBUG Audio File Open -> Deck Load", rows)

          // create a range, and link events to it
          // TODO: BEGIN ... END
          db.run("INSERT INTO ranges VALUES (null, ?, null, ?, ?, null)",
            row.start, rows[0].grp, row.content,
            function(err) {
              console.log(err, this.lastID)
              db.run("UPDATE events SET rangeID = ? WHERE id = ?", this.lastID, row.id)
              db.run("UPDATE events SET rangeID = ? WHERE id = ?", this.lastID, rows[0].id)
            }
          )
        }
      )
    })

    // TOOD: Collapse midi events into less granular ranges

    // TODO: expire remaining events more than 10s old
    //db.run("UPDATE events SET rangeID = -1 WHERE start < ?", Date.now() - 10000)
  }, interval)
}

/*

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

  // normal case: a file event is preceeded between -100 and 100ms by an (un)load event
  for (var i = 0; i < dts.length; i++) {
    mts = Object.keys(midi.buffer).sort()  // reload midi buffer in case modified
    for (var j = 0; j < mts.length; j++) {
      var delta = dts[i] - mts[j]
      if (-100 < delta && delta < 100) {
        drainBuffers(dts[i], mts[j])
        break
      }
    }
  }
}, 1000)
*/