var utils = {
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
        document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/client/";
    },
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return "";
    },
    createData: function(json) {
        try {
            return encodeURIComponent(btoa(JSON.stringify(json)).split("/").join("%"));
        } catch (e) {
            return null;
        }
    },
    checkLogin: function(callback) {
        if (this.getCookie("token") == "") {
            callback(false);
            return;
        }
        var json_send = {};
        json_send.token = this.getCookie("token");
        $.ajax({
            type: 'GET',
            url: 'http://api.agariohub.io/check-login/' + createData(json_send)
        }).done(function(r) {
            if (r.state == "success")
                callback(r.logged);
            else
                callback(false);
        }).fail(function() {
            callback(false);
        });
    },
    xpToLevel: function(xp, callback) {
        var txp = xp;
        for (var i = 0; i < 200; i++) {
            if (txp - this._xpTl(i) >= 0) {
                txp -= this._xpTl(i);
            } else {
                callback(i, txp, this._xpTl(i));
                break;
            }
        }
    },
    randomInt: function(min, max) {
        if (min == max)
            return min;
        return min + Math.floor(Math.random() * (max - min + 1));
    },
    generateUdi: function(size) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          , answer = "";
        for (var i = 0; i < size; i++)
            answer += chars[this.randomInt(0, chars.length - 1)];
        return answer;
    },
    theCode: function() {
        return this.randomInt(1e4, 4e7);
    },
    fixSkin: function(skin) {
        return skin.split("no_skin").join("C41G7n2").split("no_color").join("#FF0000");
    },
    isVip: function(rank) {
        return [1, 2, 12, 13, 22, 23, 32, 33, 40, 50].indexOf(rank) > -1;
    },
    isLegend: function(rank) {
        return [2, 13, 23, 33, 40, 50].indexOf(rank) > -1;
    },
    isMod: function(rank) {
        return rank >= 10;
    },
    isAdmin: function(rank) {
        return rank >= 40;
    },
    minToSec: function(min) {
        return 60 * min;
    },
    redirectLogin: function() {
        window.location = "http://stg.agariohub.io/login";
    },
    addAlert: function(color, message) {
        $("#alerts").append($("#model-alert").html().split("%color%").join(color).split("%message%").join(message));
    },
    noConnection: function() {
        utils.addAlert("red", "Couldn't stablish a connections to our servers, try again later")
    },
    _xpTl: function(i) {
        return Math.floor(100 * Math.pow(i, 2) - 50 * i + 250);
    }
};
if (utils.getCookie("udi") == "")
    utils.setCookie("udi", utils.generateUdi(64), 36500);
function removeMe(me) {
    $(me).fadeOut(200, function() {
        $(me).remove();
    });
}
