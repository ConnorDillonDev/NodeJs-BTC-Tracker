module.exports = {
    coinDeskGet(url, callback) {
        var request = require('request');
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var info = JSON.parse(body)
                callback(info);
            }
        })
    }
}