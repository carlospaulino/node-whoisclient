var	net = require('net'),
	dns = require('dns');

function doQuery(server, host, command) {

}
	
exports.query = function(domain, options, callback) {
	if(!domain) {
		throw new Error("Domain name is mandatory eg: google.com");
	}
	
	// Query TLD.whois-servers.net
	var server = domain.substring(domain.lastIndexOf( '.' ) + 1) +'.whois-servers.net';
	var port = 43;
	var command = 'domain ' + domain + '\r\n';

	if (arguments.length == 2) {
		if (Object.prototype.toString.call(arguments[1]) == "[object Function]") {
			callback = options; 
		}
	} else {
		server = options.server;
		port = options.port;	
		command = domain + '\r\n';
	}

	dns.resolveCname(server, function(err, addresses) {	
		var host = server;
		if(!err) {
			// Let's just use the supplied server address
			host = addresses[0];
		}
		var whoisdata = '';
		var socket = net.createConnection(port, host, function() {
			socket.write(command,'ascii');
		});
		socket.setEncoding('ascii');
		socket.on('data', function(data) {
			whoisdata = whoisdata + data;
		}).on('close', function(had_error) {
			if(had_error) {
				callback('WHOIS server is not responding, domain is not registered or this TLD has no whois server.');
			} else  {
				callback(whoisdata);
			}
		});
	});
}