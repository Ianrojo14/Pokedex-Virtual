// API is found here: https://raw.githubusercontent.com/JJimenez15/AgarIO-Hub-API/master/api.js
const api = require('./api')

const token = "qwer1234"

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
            } else {
                console.log("Daily reward already given")
            }
            // Open mystery box if exists
            api.connectLogin("open-box", {
                token: token
            }, function(r) {
                if (r.state == "success") {
                    console.log("Mystery box success")
                } else {
                    console.log("There is no mystery box")
                }
            })
        })
    } else {
        console.log("Token is dead")
    }
})