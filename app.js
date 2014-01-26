// My SocketStream 0.3 app

var http = require('http'),
    ss = require('socketstream');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'libs/timeline.css', 'app.styl'],
  code: ['libs/jquery.min.js', 'libs/timeline.js', 'app'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

// Start SocketStream
ss.start(server);

// Connect midi events to socket stream message passing
setInterval(function() {
  console.log("publishing...")
  ss.api.publish.all('newMessage', "works?");
  ss.api.publish.all("newTimelineData", {
    'start': new Date(2010,7,26),
    'end': new Date(2010,8,2),
    'content': 'Traject A'
  })
}, 10000)
