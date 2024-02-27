# AgarIO-Hub-API

[![Discord](https://discordapp.com/api/guilds/602558493614014468/widget.png?style=banner2)](https://discord.gg/P8avcyY)

**AGARIO HUB API IS STILL WORKING, EVEN IF THE GAME IS CLOSED!**

AgarIO Hub API script and documentation for easy usage with accounts, bots, etc.

A token is needed! You can get a them by loggin in on AgarIO Hub using this [userscript](https://github.com/JJimenez15/AgarIO-Hub-API/edit/master/script.user.js) ([Tampermonkey](https://tampermonkey.net) is needed).

# Installation

Install [Node.js](https://nodejs.org)
Download this repository and extract it

Open a terminal and write this commands inside `AgarIO-Hub-API-master`:

```bash
npm install btoa
npm install request
```

Create a JavaScript file and add this line on the top to load the api.

```js
const api = require('./api')
```

# Usage

```js
// ConnectLogin
api.connectLogin("Page here", {
	// Input here
}, function(r) {
	// Callback
})
```

```js
// Create Data
api.createData("Input here")
```

```js
// Generate Udi
api.generateUdi(64)
```

```js
// Fake reCAPTCHA response
// (Helps to prevent your account from getting banned by sending a not "real" response)
api.fakeCaptcha(486)
```

```js
// The Code
api.theCode()
```

### Enable debugger

```js
api.connectLogin("Page here", {
	// Data here
}, function(r) {
	// Callback
}, true)
```

# Pages, Inputs and Outputs
|Page|Input|Output (incomplete)|
|----|-----|-------------------|
|check-login|token|state, logged, time|
|user-search|query||
|leaderboards|token||
|simple-info|token||
|info|token, theCode (optional), lastNotification (optional)||
|event|||
|mall|token||
|shop|||
|name-color|token, id||
|set-hat|token, sId||
|set-skin|token, sId||
|coin-skin|token, sId||
|buy-boost|token, sId||
|buy-mass|token|state, time|
|daily-reward|token|state, messages, time|
|open-box|token|state, messages, time|
|chest-add|token, amount, time||
|change-pw|token, pwd (old password), npwd (new password)|state, time|
|send-coins|token, username, amount|state, time|
|sell-item|token, type, id, price|state, time|
|buy-mall|token, id|state, time|
|cancel-mall|token, id|state, time|
|follow|token, username|state, time|
|remove-comment|token, id|state, time|
|comment|token, username, message, recaptcha (required but agariohub does not validate captcha token)|state, time|
|user-profile|token, username||

# Example

```js
const api = require('./api')

api.connectLogin("check-login", {
	token: "9ZUickVsDP4IaNZzQGojGtEJTg8u2ViCY4UpqsdbAA3QwBu9MmEJAe7bbHwHp2nB"
}, function(r) {
	if (r.state == "success" && r.logged == true) {
		console.log("Login success")
	} else {
		console.log("Login failed")
	}
})
```

```js
const api = require('./api')

const token = "9ZUickVsDP4IaNZzQGojGtEJTg8u2ViCY4UpqsdbAA3QwBu9MmEJAe7bbHwHp2nB"

// Verify if token is still working
api.connectLogin("check-login", {
	token: token
}, function(r) {
	console.log("Login success")
	if (r.state == "success" && r.logged == true) {
		// Collect daily reward
		api.connectLogin("daily-reward", {
			token: token
		}, function(r) {
			if (r.state == "success") {
				console.log("Daily reward success")
			}
			// Open mystery box if exists
			api.connectLogin("open-box", {
				token: token
			}, function(r) {
				if (r.state == "success") {
					console.log("Mystery box success")
				}
			})
		})
	} else {
		console.log("Login failed")
	}
})
```
