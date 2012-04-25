# node-whoisclient

A javascript implementation of the WHOIS protocol for node.js

## Installation

### Installing npm (node package manager)
``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing node-whoisclient
``` bash
  $ npm install whoisclient
```

## Usage

### Basic Example

``` js 
  var whois = require('whoisclient');

	whois.query('google.com', function(data) {
		console.log(data);
	});
```

### Advanced Example

``` js 
	var whois = require('whoisclient');
	var options = { 
		server: 'whois.server.tld', // Different whois server 
		port: 43 // Different port
	};

	whois.query('google.com', options, function(data) {
		console.log(data);
});

```

## Roadmap

1. Implement automatic thick Lookups

#### Author: [Carlos Paulino](http://github.com/carlospaulino)

