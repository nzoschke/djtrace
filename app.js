var http  = require("http"),
    ss    = require("socketstream");

// Define a single-page client called "timeline"
ss.client.define("timeline", {
  view: "app.html",
  css:  ["libs/reset.css", "libs/timeline.css"],
  code: ["libs/jquery.min.js", "libs/timeline.js", "app"],
  tmpl: "*"
});

// Serve this client on the root URL
ss.http.route("/", function(req, res){
  res.serveClient("timeline");
});

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === "production") ss.client.packAssets();

// Start web server + socketstram
exports.listen = function(opts) {
  var server = http.Server(ss.http.middleware);
  server.listen(opts.port || 3000);
  ss.start(server);
}