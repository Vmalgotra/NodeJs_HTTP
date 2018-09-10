var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
process.env["Node_ENV"] = 'production';
var config = require("./config");

//server should return string
var server = http.createServer(function (req, res) {

    //parse the url and return an object
    var parsedUrl = url.parse(req.url, true);

    var path = parsedUrl.pathname;

    //trim the path from the url
    var trimpath = path.replace(/^\/+|\/+$/g, '');

    //fetch the method
    var method = req.method.toLowerCase();

    //parse the query
    var queryString = parsedUrl.query;

    //parse the headers
    var headers = req.headers;

    //initialise a decoder to receive the payload stream
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    //receive the stream
    req.on('data', function (data) {
        buffer += decoder.write(data);

    });

    //act upon stream completion
    req.on('end', function () {
        buffer += decoder.end();

        //choose the handler to which this request will route to
        var chosenhandler = typeof (router[trimpath]) !== "undefined" ? router[trimpath] : handelers.NotFound;

        //construct the data object
        var data = {
            'trimpath': trimpath,
            'method': method,
            'headers': headers,
            'queryString': queryString,
            'payload': buffer

        }

        //route the request to handler defined in request
        chosenhandler(data, function (status, payload) {
            //use the status called back by handler or use default

            status = typeof (status) === "number" ? status : 200;
            //use the payload called back by handler or use default
            payload = typeof (payload) === "object" ? payload : {};

            //convert payload to json
            var parsedPayload = JSON.stringify(payload);
            res.setHeader('content-type', 'application/json');
            res.writeHead(status);
            res.end(parsedPayload);
            console.log('Request received on path ' + status + ' ' + parsedPayload, buffer, queryString, headers);


        })


    })
});

//server listens on port 3000
server.listen(config.port, function () {
    console.log(`The server is listening at port ${process.env.Node_ENV}`);
    console.log(`The server is listening at port ${config.port}`);
});

var handelers = {};

handelers.sample = function (data, callback) {
    callback(201, {
        'name': 'sample'
    });
}

handelers.NotFound = function (data, callback) {
    callback(404);
}

var router = {
    'sample': handelers.sample
}