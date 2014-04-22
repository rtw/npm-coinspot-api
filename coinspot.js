var hmac = require("crypto").createHmac,
	https = require('https');

function coinspot(key, secret) {
  	var self = this;
  	self.key = key;
  	self.secret = secret;

	var request = function(path, postdata, callback) {
		var nonce = new Date().getTime();

		var postdata = postdata || {};
		postdata.nonce = nonce;

		var stringmessage = JSON.stringify(postdata);
		var signedMessage = new hmac("sha512", self.secret);

		signedMessage.update(stringmessage);

		var sign = signedMessage.digest('hex');

		var options = {
			rejectUnauthorized: false,
			method: 'POST',
			host: 'localhost',
			port: 9000,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'sign': sign,
				'key': self.key
			}
		};

		var req = https.request(options, function(resp){
			var data = '';
			resp.on('data', function(chunk){
				data += chunk;
			});
			resp.on('end', function(chunk){
				callback(null, data);
			});
		}).on("error", function(e){
			callback(e, data);
		});

		req.write(stringmessage);
		req.end();
	}

	self.myorders = function(callback) {
		request('/api/my/orders', {}, callback);
	}

	self.spot = function(callback) {
		request('/api/spot', {}, callback);
	}

	self.buy = function(cointype, amount, rate, callback) {
		var data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/buy', data, callback);
	}

	self.sell = function(cointype, amount, rate, callback) {
		var data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/sell', data, callback);
	}
}

module.exports = coinspot;