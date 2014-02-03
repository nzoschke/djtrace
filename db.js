var       _ = require('underscore')
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

exports.selectEvents = function(start, cb) {
  db.all(" SELECT * FROM ranges WHERE start > ? ORDER BY start", start, function(err, rows) {
    console.log(err)
    cb(rows)
  })
}

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
    // Process Audio File Opens by correlating to a recent Deck Load (or ignoring)
    // TODO: Proper serialzation, BEGIN ... END
    // https://github.com/Strix-CZ/sqlite3-transactions ?
    db.each("SELECT * FROM events WHERE grp='Audio File Open' AND rangeId IS NULL ORDER BY start", function(err, openEvent) {
      db.all("SELECT * FROM events WHERE grp LIKE 'Deck _ Load' AND start BETWEEN ? AND ? ORDER BY start",
        openEvent.start - 500, openEvent.start + 500,
        function(err, loadEvents) {
          if (err || loadEvents.length == 0) return

          var grps = _.uniq(_.pluck(loadEvents, "grp"))
          if (grps.length > 1)        console.log("SQL DEBUG Audio File Open -> Deck Load", loadEvents)
          if (loadEvents.length > 2)  console.log("SQL DEBUG Audio File Open -> Deck Load", loadEvents)

          var unloadEvent = _.find(loadEvents, function(r) { return r.content == "0"   })
          var loadEvent   = _.find(loadEvents, function(r) { return r.content == "127" })

          // end a range, if exists
          var endEvent = unloadEvent || loadEvent
          db.run(
            "UPDATE ranges SET end = ? WHERE grp = ? AND end IS NULL",
            endEvent.start, endEvent.grp
          )

          // start a new range
          var startEvent = loadEvent || unloadEvent
          db.run("INSERT INTO ranges (start, grp, content) VALUES (?, ?, ?)",
            startEvent.start, startEvent.grp, openEvent.content,
            function(err) {
              if (err) { 
                console.log("SQL DEBUG ERROR", err)
                return
              }

              // link all source events to new range
              var ids = _.pluck(loadEvents, "id")
              ids.push(openEvent.id)
              db.run("UPDATE events SET rangeID = ? WHERE id IN (" + ids.join(",") + ")", this.lastID)

              // callback with new range
              db.all("SELECT * FROM ranges WHERE id IN (" + this.lastID + ")", function(err, ranges) {
                cb(ranges)
              })
            }
          )
        }
      )
    })




    // new event comes in
    // it can start a new group
    // it can end an existing group
    // it can update a group
    //   noop if value hasnt changed
    //   append if value has changed

    // special cases
    // unload: closes load, seek, 
    // load: 0 -> end
    // seek: >0 : start
    // crossfader: 0 - 31: A, 32 - 94: A+B, 95 - 127: B
    // var now = Date.now()
    // db.each("SELECT * FROM events WHERE rangeID IS NULL ORDER BY start", function(err, row) {
    //   "SELECT * FROM ranges WHERE end = null AND grp = ?"

    //   // ignore and expire events <10s old
    //   if (row.start < now - 10000)
    //     return db.run("UPDATE events SET rangeID = -10 WHERE id = ?", row.id)
    // })
    
    // SELECT grp, MIN(start), MAX(start), GROUP_CONCAT(content, ",") FROM events WHERE rangeID IS NULL GROUP BY grp, round(start/10000);

    // TODO: expire remaining events more than 10s old
    //db.run("UPDATE events SET rangeID = -10 WHERE start < ?", Date.now() - 10000)
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