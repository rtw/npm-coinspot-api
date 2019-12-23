var hmac = require("crypto").createHmac,
	https = require('https');

function coinspot(key, secret) {
  	this.key = key;
  	this.secret = secret;

	var request = (path, postdata, callback) => {
		var nonce = new Date().getTime();

		var postdata = postdata || {};
		postdata.nonce = nonce;

		var stringmessage = JSON.stringify(postdata);
		var signedMessage = new hmac("sha512", this.secret);

		signedMessage.update(stringmessage);

		var sign = signedMessage.digest('hex');

		var options = {
			rejectUnauthorized: false,
			method: 'POST',
			host: 'www.coinspot.com.au',
			port: 443,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'sign': sign,
				'key': this.key
			}
		};

		var req = https.request(options, (resp) => {
			var data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', (chunk) => {
				callback(null, data);
			});
		}).on("error", (e) => {
			callback(e, data);
		});

		req.write(stringmessage);
		req.end();
	}

	this.sendCoin = (cointype, amount, address, callback) => {
		request('/api/my/coin/send', {cointype:cointype, amount:amount, address:address}, callback);
	}

	this.coinDeposit = (cointype, callback) => {
		request('/api/my/coin/deposit', {cointype:cointype}, callback);
	}

	this.quoteBuy = (cointype, amount, callback) => {
		request('/api/quote/buy', {cointype:cointype, amount:amount}, callback);
	}

	this.quoteSell = (cointype, amount, callback) => {
		request('/api/quote/sell', {cointype:cointype, amount:amount}, callback);
	}

	this.balances = (callback) => {
		request('/api/my/balances', {}, callback);
	}

	this.orders = (cointype, callback) => {
		request('/api/orders', {cointype:cointype}, callback);
	}

	this.myOrders = (callback) => {
		request('/api/my/orders', {}, callback);
	}

	this.spot = (callback) => {
		request('/api/spot', {}, callback);
	}

	this.buy = (cointype, amount, rate, callback) => {
		var data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/buy', data, callback);
	}

	this.sell = (cointype, amount, rate, callback) => {
		var data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/sell', data, callback);
	}

	this.cancelBuy = (id, callback) => {
		request(
			'/api/my/buy/cancel',
			{ 
				id
			},
			callback
		);
	}

	this.cancelSell = (id, callback) => {
		request(
			'/api/my/sell/cancel',
			{ 
				id
			},
			callback
		);
	}
}

module.exports = coinspot;