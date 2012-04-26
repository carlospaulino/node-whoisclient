/*	The net module is required to connect to the WHOIS server.
	The dns module is required to resolve the whois server original name
*/
var	net = require('net'),
	dns = require('dns');

exports.query = function(domain, options, callback) {
	/*	Verify that the domain is supplied 
		Currently no validation is performed
	*/
	if(!domain) {
		throw new Error("Domain name is mandatory eg: google.com");
	}
	
	// Query TLD.whois-servers.net
	var server = domain.substring(domain.lastIndexOf( '.' ) + 1) +'.whois-servers.net';
	
	/*	By default user standard port 43 
	*/
	var port = 43;
	
	/* 	When we query the WHOIS it searches in all of its records
		so by default we query 
		
		For more information see Verign's documentation here: http://bit.ly/IUvugY
	*/
	var command = 'domain ' + domain + '\r\n';

	/*	We check if the user sent custom options
	*/
	if (arguments.length == 2) {
		if (Object.prototype.toString.call(arguments[1]) == "[object Function]") {
			callback = options; 
		}
	} else {
		/*	If the user specifies the WHOIS server 
			we don't send the "domain" command.
		*/
		server = options.server;
		port = options.port;	
		command = domain + '\r\n';
	}
	
	
	/*	Usually all WHOIS servers resolve to a CNAME
		e.g. com.whois-servers.net resolves to whois.verisign-grs.com
		e.g. uk.whois-servers.net resolves to whois.nic.uk	
	*/
	dns.resolveCname(server, function(err, addresses) {	
		var host = '';
		
		/*	Sometimes WHOIS servers are not using 
			any aliases so in case we get any errors we use the original address
		*/
		if(!err) {
			host = addresses[0];
		} else {
			host = server;
		}
		
		/*	Socket data might come in chunks, 
			so we need to put it together
		*/
		var whoisdata = '';
		
		var socket = net.createConnection(port, host, function() {
			/*	Once connection is established we send our command 
			*/
			socket.write(command,'ascii');
		});
		
		/*	Encoding is set to ASCII so we can 
			understand the receive data
		*/
		socket.setEncoding('ascii');
		
		/*	Wait for data to arrive
		*/
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