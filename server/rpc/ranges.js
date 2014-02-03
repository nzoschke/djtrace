var db = require("../../db")

// Define actions which can be called from the client using ss.rpc('timeline.ACTIONNAME', param1, param2...)
exports.actions = function(req, res, ss) {

  // Example of pre-loading sessions into req.session using internal middleware
  req.use("session")
  //req.use("debug", "cyan")

  return {
    load: function(start) {
      db.selectEvents(start, function(rows) {
        return res(rows)
      })
    },
  };

};