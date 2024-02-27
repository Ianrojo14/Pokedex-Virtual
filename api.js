// AgarIO-Hub-API - api.js
// By JJimenez_15 (https://github.com/JJimenez15)

const btoa = require('btoa')
const request = require('request')

const BASE_URL = "http://api.agariohub.io/"

module.exports = {
	fakeCaptcha: function(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	createData: function(json) {
        return encodeURIComponent(btoa(JSON.stringify(json)).split("/").join("%"))
    },
	randomInt: function(min, max) {
        if (min == max) {
			return min
		}
        return min + Math.floor(Math.random() * (max - min + 1))
    },
	generateUdi: function(size) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        var answer = ""
        for (var i = 0; i < size; i++) {
			answer += chars[this.randomInt(0, chars.length - 1)]
		}
        return answer
    },
	theCode: function() {
        return this.randomInt(1e4, 4e7)
    },
	connectLogin: function (page, jsonSend, callback, debug) {
		var dataSend = this.createData(jsonSend)
		if (!dataSend) {
			console.error("Failed building data when trying to connect to: " + page)
			return false
		}
		request(`${BASE_URL}${page}/${dataSend}`, (err, req, data) => {
			var responseParse = JSON.parse(data)
			if (debug) {
				console.log(`[DEBUGGER] URL: ${BASE_URL}${page}/${dataSend}\n[DEBUGGER] DATA: ${data}`)
			}
			callback(responseParse)
		})
	}
}
