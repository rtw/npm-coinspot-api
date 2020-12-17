const hmac = require("crypto").createHmac,
	https = require('https');

function coinspot(key, secret) {
  	this.key = key;
  	this.secret = secret;

	const formatData = data => {
		try { return JSON.parse(data) } 
		catch { return data }
	}

	const request = (path, callback, postdata) => {
		const nonce = new Date().getTime();

		var postdata = postdata || {};
		postdata.nonce = nonce;

		const stringmessage = JSON.stringify(postdata);
		const signedMessage = new hmac("sha512", this.secret);

		signedMessage.update(stringmessage);

		const sign = signedMessage.digest('hex');

		const options = {
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

		const req = https.request(options, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});
			resp.on('end', () => {
				callback(formatData(data), null);
			});
		}).on("error", (e) => {
			callback(formatData(data), e);
		});

		req.write(stringmessage);
		req.end();
	}

	this.sendCoin = (cointype, amount, address, callback) => {
		request('/api/my/coin/send', callback, {cointype:cointype, amount:amount, address:address});
	}

	this.coinDeposit = (cointype, callback) => {
		request('/api/my/coin/deposit', callback, {cointype:cointype});
	}

	this.quoteBuy = (cointype, amount, callback) => {
		request('/api/quote/buy', callback, {cointype:cointype, amount:amount});
	}

	this.quoteSell = (cointype, amount, callback) => {
		request('/api/quote/sell', callback, {cointype:cointype, amount:amount});
	}

	this.balances = (callback) => {
		request('/api/ro/my/balances', callback);
	}

	this.orders = (cointype, callback) => {
		request('/api/orders', callback, {cointype:cointype});
	}

	this.myOrders = (callback) => {
		request('/api/my/orders', callback);
	}

	// Deprecated
	this.spot = (callback) => {
		request('/api/spot', callback);
	}

	this.buy = (cointype, amount, rate, callback) => {
		const data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/buy', callback, data);
	}

	this.sell = (cointype, amount, rate, callback) => {
		const data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/sell', callback, data);
	}

	this.cancelBuy = (id, callback) => {
		request('/api/my/buy/cancel', callback, { id });
	}

	this.cancelSell = (id, callback) => {
		request('/api/my/sell/cancel', callback, { id });
	}

	// These were added by Kowasaur

	this.depositHistory = (callback, startdate, enddate) => {
		request('/api/ro/my/deposits', callback, {startdate, enddate})
	}

	this.withdrawalHistory = (callback, startdate, enddate) => {
		request('/api/ro/my/withdrawals', callback, {startdate, enddate})
	}

	this.transactions = (callback, params = { cointype: '', startdate: '', enddate: '' }) => {
		// the || '' part is need so that when using dates without a cointype, it works
		request('/api/ro/my/transactions/' + (params.cointype || ''), callback, {
			startdate: params.startdate, enddate: params.enddate})
	}

	this.openTransactions = (callback, cointype) => {
		const path = (!cointype) ? '/api/ro/my/transactions/open/' : `/api/ro/my/transactions/${cointype}/open/`
		request(path, callback)
	}

	this.sendReceive = callback => {
		request('/api/ro/my/sendreceive', callback)
	}

	this.affiliate = callback => {
		request('/api/ro/my/affiliatepayments', callback)
	}

	this.referral = callback => {
		request('/api/ro/my/referralpayments', callback)
	}
}

module.exports = coinspot;