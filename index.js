var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connections = 0;
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  connections++;
  
  socket.on('disconnect', function () {
    connections--;
    console.log(connections + " client connected");
  });
  console.log(connections + " client connected");
  socket.on('ciz', function (args) {
    var distx = args.W.X - args.T.X;
    var disty = args.W.Y - args.T.Y;
    if (distx < 0)
      distx = distx * -1;
    if (disty < 0)
      disty = disty * -1;
    if (distx + disty > 200)
      return;
    if ((distx + disty)>20) {
      if (args.W.X == args.T.X)
        return;
      if (args.W.Y == args.T.Y)
        return;
    }

    if (args.G > 11)
      args.G = 0;
    io.emit('ciz', args);
  });
  socket.on('temizle', function (arg) {
    io.emit('ciz',
      {
        W: { X: 0, Y: 0 },
        T: { X: 600, Y: 600 },
        C: "white",
        G: 1500
      }
    );
  });
});

http.listen(80, '0.0.0.0');
