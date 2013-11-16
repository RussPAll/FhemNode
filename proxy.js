var http = require('http');

exports.proxy = function (prefix, host, portNo) {
  return function (req, res, next) {
    var options = {
      host: host,
      port: portNo,
      // the server receives a url like http://foo.com/api/(*)
      // send the proxy only (*)
      path: req.url.substr(prefix.length),
      // headers and the method need to be written explicitely
      method: req.method,
      headers: req.headers
    };
    if (req.url.indexOf(prefix) === 0) {
      req.pipe(http.request(options, function (proxy) {
        res.writeHead(proxy.statusCode, proxy.headers);
        proxy.pipe(res);
      }).on('error', next));
    } else {
      next();
    }
  };
};