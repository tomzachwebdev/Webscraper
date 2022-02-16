var http = require('http');

var proxy = require('http-proxy');

proxyServer= proxy.createProxyServer({target:'http://127.0.0.1:9000'});

proxyServer.listen(8000);

server = http.createServer(function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.write('Proxy Request was Successful!' + '\n' + JSON.stringify(req.headers, true, 2));

  res.end();

});

server.listen(9000);