I think all dates/times are in GMT  
Please see https://www.coinspot.com.au/api for documentation on the CoinSpot API.

## Bugs
I could not get [/api/ro/my/balances/:cointype to work](https://www.coinspot.com.au/api#rocoinsbalance)

Example usage

```javascript
var coinspot = require('coinspot-api');

var secret = ''; // insert your secret here
var key = ''; // insert your key here

var client = new coinspot(key, secret);

client.orders('LTC', function(e, data) {
 	console.log(data);
});

client.myorders(function(e, data) {
 	console.log(data);
});

client.spot(function(e, data) {
	console.log(data);
});

client.buy('BTC', 0.3, 529, function(e, data) {
	console.log(data);
});

client.sell('DOGE', 0.3, 0.00024, function(e, data) {
	console.log(data);
});
```