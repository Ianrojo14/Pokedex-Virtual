const BASE_URL = "http://api.agariohub.io/";
var mainThread, lbThread;
var isBusy = false,
    isTabFocused = true,
    threads = [];
var lastSearchValue = "",
    lastUrl = window.location.pathname.substring(1),
    isBusySearching = false,
    isFirstAccess = true,
    lastNotification = 0,
    notificationAmount = 0,
    notificationQuery = 0,
    notificationGlow = true,
    currentProfile = "",
    packTime = 0,
    message = {
        time: 0,
        text: ""
    },
    popUps = [];
var isProfileShown = false,
    areNotificationsShown = false,
    isNavShown = false,
    isCtxMenuOpened = false,
    tooltipTimer = null;
var i, j, eventInfo, closeAll;
var player = {
    following: []
};
$(function() {
    var themeAttrs = {
        type: 'text/css',
        rel: 'stylesheet',
        href: ''
    };
    switch (utils.getCookie("theme")) {
        case "dark":
            themeAttrs.href = 'http://stg.agariohub.io/assets/styles/dark.css';
            $("#theme").html("Light theme");
            console.info("Using dark theme");
            break;
        case "halloween":
            themeAttrs.href = 'http://stg.agariohub.io/assets/styles/halloween.css';
            $("#theme").html("Dark theme");
            console.info("Using halloween theme");
            break;
        case "kindle":
            themeAttrs.href = 'http://stg.agariohub.io/assets/styles/kindle.css';
            $("#theme").html("Dark theme");
            console.info("Using kindle theme");
            break;
        default:
            console.info("Using light theme");
    }
    $('<link>').appendTo('head').attr(themeAttrs);

    function Thread(execute) {
        this.execute = execute;
    }
    Thread.prototype.register = function(interval, intervalNotFocused, timeout) {
        this.interval = interval;
        this.intervalNotFocused = (intervalNotFocused || interval);
        this.timeout = (timeout || 0);
        threads.push(this);
        return this;
    };
    Thread.prototype.force = function(timeout) {
        this.timeout = 0;
        if (timeout)
            this.timeout = timeout;
    };
    $(window).focus(function() {
        isTabFocused = true;
    });
    $(window).blur(function() {
        isTabFocused = false;
    });
    setInterval(function() {
        for (i = 0; i < threads.length; i++) {
            var target = threads[i],
                interval = target.intervalNotFocused;
            if (isTabFocused)
                interval = target.interval;
            if (target.timeout == 0) {
                target.timeout = interval;
                target.execute();
            } else {
                if (target.timeout > interval)
                    target.timeout = interval;
            }
            target.timeout--;
        }
    }, 1000);
    new Thread(function() {
        var currentSearchValue = $("#user-search-bar").val();
        if (currentSearchValue != lastSearchValue && !isBusySearching && currentSearchValue.length <= 16 && currentSearchValue.length >= 1) {
            isBusySearching = true;
            lastSearchValue = currentSearchValue;
            connectLogin("user-search", {
                query: currentSearchValue
            }, function(r) {
                if (r.state == "error") return isBusySearching = false;
                var searchHtml = "";
                for (i = 0; i < r.users.length; i++) {
                    var target = r.users[i];
                    searchHtml += build.build(build.USER_INFO_HOR, [(target.skin.code), (target.skin.color), target.nickname, target.username, build.buildBadges(target.badges), target.level, target.ncolor]);
                }
                $("#user-search-result").html(searchHtml);
                isBusySearching = false;
            }, function() {
                isBusySearching = false;
            }, true);
        }
    }).register(1);
    lbThread = new Thread(function() {
        if (!isTabFocused)
            return (lbThread.timeout = 2);
        connectLogin("leaderboards", {
            token: utils.getCookie("token")
        }, function(t) {
            if (t.state == "error") return;
            var timetop = "";
            for (i = 0; i < t.timetop.length; i++)
                timetop += build.build(build.FULL_USER_INFO, [(t.timetop[i].skin.code), (t.timetop[i].skin.color), t.timetop[i].position + ".Â " + t.timetop[i].nickname, t.timetop[i].username, build.buildBadges(t.timetop[i].badges), t.timetop[i].xp, t.timetop[i].xpt, t.timetop[i].xp * 100 / t.timetop[i].xpt, t.timetop[i].followers, t.timetop[i].coins, t.timetop[i].playtime, t.timetop[i].level, t.timetop[i].ncolor]);
            $("#tab-body-ptlb").html(timetop);
            var xptop = "";
            for (i = 0; i < t.xptop.length; i++)
                xptop += build.build(build.FULL_USER_INFO, [(t.xptop[i].skin.code), (t.xptop[i].skin.color), t.xptop[i].position + ".Â " + t.xptop[i].nickname, t.xptop[i].username, build.buildBadges(t.xptop[i].badges), t.xptop[i].xp, t.xptop[i].xpt, t.xptop[i].xp * 100 / t.xptop[i].xpt, t.xptop[i].followers, t.xptop[i].coins, t.xptop[i].playtime, t.xptop[i].level, t.xptop[i].ncolor]);
            $("#tab-body-xplb").html(xptop);
            var cointop = "";
            for (i = 0; i < t.cointop.length; i++)
                cointop += build.build(build.FULL_USER_INFO, [(t.cointop[i].skin.code), (t.cointop[i].skin.color), t.cointop[i].position + ".Â " + t.cointop[i].nickname, t.cointop[i].username, build.buildBadges(t.cointop[i].badges), t.cointop[i].xp, t.cointop[i].xpt, t.cointop[i].xp * 100 / t.cointop[i].xpt, t.cointop[i].followers, t.cointop[i].coins, t.cointop[i].playtime, t.cointop[i].level, t.cointop[i].ncolor]);
            $("#tab-body-coinlb").html(cointop);
            var flwtop = "";
            for (i = 0; i < t.flwtop.length; i++)
                flwtop += build.build(build.FULL_USER_INFO, [(t.flwtop[i].skin.code), (t.flwtop[i].skin.color), t.flwtop[i].position + ".Â " + t.flwtop[i].nickname, t.flwtop[i].username, build.buildBadges(t.flwtop[i].badges), t.flwtop[i].xp, t.flwtop[i].xpt, t.flwtop[i].xp * 100 / t.flwtop[i].xpt, t.flwtop[i].followers, t.flwtop[i].coins, t.flwtop[i].playtime, t.flwtop[i].level, t.flwtop[i].ncolor]);
            $("#tab-body-flwlb").html(flwtop);
            var rubytop = "";
            for (i = 0; i < t.rubytop.length; i++)
                rubytop += build.build(build.FULL_USER_INFO_RUBY, [(t.rubytop[i].skin.code), (t.rubytop[i].skin.color), t.rubytop[i].position + ".Â " + t.rubytop[i].nickname, t.rubytop[i].username, build.buildBadges(t.rubytop[i].badges), t.rubytop[i].xp, t.rubytop[i].xpt, t.rubytop[i].xp * 100 / t.rubytop[i].xpt, t.rubytop[i].followers, t.rubytop[i].coins, t.rubytop[i].rubies, t.rubytop[i].playtime, t.rubytop[i].level, t.rubytop[i].ncolor]);
            $("#tab-body-rubylb").html(rubytop);
        }, null, true);
    }).register(utils.minToSec(2), utils.minToSec(2), 5);
    mainThread = new Thread(function() {
        if (utils.getCookie("token") == "") {
            utils.redirectLogin();
            return;
        }
        connectLogin("info", {
            token: utils.getCookie("token"),
            theCode: utils.theCode(),
            lastNotification: notificationQuery
        }, function(r) {
            if (r.state == "error")
                return utils.redirectLogin();
            mainThread.interval = r.updateTime;
            player.username = r.username;
            player.totalXp = r.level.totalXp;
            player.level = r.level.level;
            player.coins = r.coins;
            player.rubies = r.rubies;
            player.rank = r.rank;
            player.subscription = r.subscription;
            player.skins = r.cskins;
            player.hats = r.hats;
            if (r.alert)
                message = r.alert;
            if (!player.challenge)
                player.challenge = {};
            player.challenge.status = r.challenge.status;
            player.challenge.xp = r.challenge.xp;
            if (player.challenge.time != null) {
                if (Math.abs(player.challenge.time - r.challenge.time * 60) > 100 && r.challenge.status != 0) {
                    player.challenge.time = r.challenge.time * 60;
                    closeAll(false);
                    $("#mask").fadeIn(200);
                    $(".challenge").fadeIn(500);
                }
            } else {
                player.challenge.time = r.challenge.time * 60;
            }
            if (r.event.time > 0 && eventInfo == null)
                connectLogin("event", {}, function(rEvent) {
                    eventInfo = rEvent;
                }, null, true);
            if (!player.event)
                player.event = {};
            if (player.event.part != null && r.event.part != 0 && r.event.part != 9 && r.event.time > 0) {
                if (player.event.part != r.event.part || player.event.progress != r.event.progress || Math.abs(player.event.time - r.event.time * 60) > 100) {
                    closeAll(false);
                    $("#mask").fadeIn(200);
                    $(".event").fadeIn(500);
                }
            }
            player.event.part = r.event.part;
            player.event.progress = r.event.progress;
            if (player.event.time != null) {
                if (Math.abs(player.event.time - r.event.time * 60) > 100)
                    player.event.time = r.event.time * 60;
            } else {
                player.event.time = r.event.time * 60;
            }
            if (!player.chest)
                player.chest = {};
            player.chest.boost = r.chest.boost;
            player.chest.total = r.chest.total;
            if ((player.chest.coins != r.chest.coins || Math.abs(player.chest.time - r.chest.time * 60) > 100) && r.chest.time > 0) {
                closeAll(false);
                $("#mask").fadeIn(200);
                $(".chest").fadeIn(500);
            }
            player.chest.coins = r.chest.coins;
            if (player.chest.time == null || Math.abs(player.chest.time - r.chest.time * 60) > 100)
                player.chest.time = r.chest.time * 60;
            if (Math.abs(packTime - r.packTime * 60) > 100)
                packTime = r.packTime * 60;
            $("#username").html(r.username);
            $("#un-rubies").html(r.username);
            $("#subtime").html(r.subscription.time);
            if (r.subscription.isSubscriber)
                $("#sub-panel").show();
            $("#box-type").html(r.box.name);
            $("#box-time-label").html(r.box.time);
            if (r.box.time > 0) {
                $("#box-time").show();
                $("#box-button").hide();
                $("#box-panel").show();
            } else if (r.box.name != "no_box") {
                $("#box-time").hide();
                $("#box-button").show();
                $("#box-panel").show();
            } else {
                $("#box-panel").hide();
            }
            $("#tweet-link").attr("href", "https://twitter.com/intent/tweet?text=I'm%20on%20%23AgarIOHub%20right%20now!%20Come%20play%20with" +
                "%20me%3A%20http%3A%2F%2Fagariohub.io%2F%23l" + r.id + "&source=AgarIO_Hub&related=AgarIO_Hub");
            $("#tweet").hide();
            if (r.tweet == 0)
                $("#tweet").show();
            if (r.reward == 0) {
                $("#reward").removeClass("disabled");
                $("#reward").removeClass("tooltip");
            } else {
                $("#reward").attr("data-tooltip", JSON.stringify({
                    time: 0.4,
                    text: "You can open your daily reward in " + Math.floor(r.reward / 60) + "h" + (r.reward % 60) + "min"
                }));
                $("#reward").addClass("disabled");
                $("#reward").addClass("tooltip");
            }
            build.rebuild("#reward-holder");
            $(".i1").css("background-image", "url('" + (r.skin.url) + "')");
            $(".i1").css("background-color", (r.skin.color));
            $(".i1").css("border", "0.1em solid" + (r.skin.color));
            $(".pid").attr("value", r.id);
            $(".self-profile .level-label").html("Level " + r.level.level);
            $(".self-profile .xp-label").html(r.boost.total == 1 ? "Experience" : (r.boost.total + "x XP boost" + (r.boost.time > 0 ? " for " + r.boost.time + " minutes" : "") +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
            $(".self-profile .xpa-label").html("<strong>" + r.level.xp + "</strong>/" + r.level.total + " Xp");
            $(".self-profile .coins-label").html(r.coins + " Coins<br>" + r.rubies + " Rubies");
            $(".self-profile .mass-label").html(r.mass + " Spawning mass");
            $(".self-profile .self-xp").css("width", Math.round(r.level.xp * 100 / r.level.total) + "%");
            $(".self-profile .self-xp").css("background", "linear-gradient(to right, #3F51B5, #3F51B5, #3F51B5, #3F51B5, " +
                (r.boost.total == 1 ? "#3F51B5" : "#FF0000") + ")");
            var inventory = "";
            var mallInventory = "";
            if (r.box.type != 0) {
                inventory += build.build(build.ITEM_CELL, ["openBox();", r.box.name, r.box.time == 0 ? "green" : "orange", "s3mLx6D", "Open", r.box.time > 0]);
                mallInventory += build.build(build.ITEM_CELL, ["sellItem('box', " + r.box.type + ");", r.box.name, r.box.time == 0 ? "green" : "orange", "s3mLx6D", "Sell", r.box.time > 0]);
            }
            for (i = 0; i < r.inventory.length; i++) {
                var currentBox = r.inventory[i];
                inventory += build.build(build.ITEM_CELL, ["utils.addAlert('orange', 'You need to open or sell your main box first');", currentBox.name, "red", "s3mLx6D", "Open", true]);
                mallInventory += build.build(build.ITEM_CELL, ["utils.addAlert('orange', 'You need to open or sell your main box first');", currentBox.name, "red", "s3mLx6D", "Sell", true]);
            }
            for (i = 0; i < r.hats.length; i++) {
                for (j = 0; j < shop.hats.length; j++) {
                    if (shop.hats[j].id != r.hats[i])
                        continue;
                    var currentHat = shop.hats[j];
                    inventory += build.build(build.ITEM_CELL, ["changeHat(" + currentHat.id + ");", "Hat", "green", currentHat.url, "Use", false]);
                    mallInventory += build.build(build.ITEM_CELL, ["sellItem('hat', " + currentHat.id + ");", "Hat", "green", currentHat.url, "Sell", false]);
                }
            }
            for (i = 0; i < r.cskins.length; i++) {
                for (j = 0; j < shop.cskins.length; j++) {
                    if (shop.cskins[j].id != r.cskins[i])
                        continue;
                    var currentSkin = shop.cskins[j];
                    inventory += build.build(build.SKIN_CELL, ["changeCSkin(" + currentSkin.id + ");", "Skin", "green", currentSkin.url, currentSkin.color, "Use", false, false]);
                    mallInventory += build.build(build.SKIN_CELL, ["sellItem('skin', " + currentSkin.id + ");", "Skin", "green", currentSkin.url, currentSkin.color, "Sell", false, false]);
                }
            }
            if (inventory != "" && inventory != $("#inventory").html())
                $("#inventory").html(inventory);
            else if (inventory == "")
                $("#inventory").html("Nothing here yet, buy skins or find boxes!");
            if (mallInventory != "" && mallInventory != $("#mall-inventory").html())
                $("#mall-inventory").html(mallInventory);
            else if (mallInventory == "")
                $("#mall-inventory").html("Nothing here yet, buy skins or find boxes!");
            if (Number(utils.getCookie("lastNotification")) == "NaN")
                utils.setCookie("lastNotification", "0", 40000);
            var notificationCookie = utils.getCookie("lastNotification");
            if (Number(utils.getCookie("lastShownNotification")) == "NaN")
                utils.setCookie("lastShownNotification", "0", 40000);
            var notificationCookieB = utils.getCookie("lastShownNotification");
            var notifications = $("#notifications").html();
            for (i = r.notifications.length - 1; i >= 0; i--) {
                notifications = build.build(build.NOTIFICATION, [r.notifications[i].message, r.notifications[i].onclick, (notificationGlow = !notificationGlow)]) + notifications;
                if (r.notifications[i].id > lastNotification)
                    lastNotification = r.notifications[i].id;
                if (r.notifications[i].id > notificationQuery)
                    notificationQuery = r.notifications[i].id;
                if (r.notifications[i].id > notificationCookie)
                    notificationAmount++;
                if (r.notifications[i].id > notificationCookie && r.notifications[i].id > notificationCookieB && !isFirstAccess) {
                    if (Notification) {
                        if (Notification.permission !== "granted") {
                            Notification.requestPermission();
                        } else {
                            try {
                                new Notification('AgarIO Hub', {
                                    icon: "https://cdn.codetunnel.net/ahub/logo-transparent.png",
                                    body: r.notifications[i].message
                                });
                            } catch (e) {
                                console.log("Unable to show notification!");
                            }
                        }
                    }
                }
            }
            utils.setCookie("lastShownNotification", ("" + lastNotification), 40000);
            $("#notifications").html(notifications);
            $("#notification-amount").html(notificationAmount);
            if (notificationAmount > 0)
                $("#notification-amount").show();
            var followers = "";
            for (i = 0; i < r.followers.length; i++)
                followers += build.build(build.USER_INFO_COMPACT, [(r.followers[i].skin.code), (r.followers[i].skin.color), r.followers[i].nickname, r.followers[i].username, build.buildBadges(r.followers[i].badges)]);
            if (followers != "")
                $("#followers_fill").html(followers);
            var following = "";
            player.following = [];
            for (i = 0; i < r.following.length; i++) {
                following += build.build(build.USER_INFO_COMPACT, [(r.following[i].skin.code), (r.following[i].skin.color), r.following[i].nickname, r.following[i].username, build.buildBadges(r.following[i].badges)]);
                player.following.push(r.following[i].username);
            }
            if (following != "")
                $("#following_fill").html(following);
            var ncolors = "";
            for (i = 0; i < shop.ncolors.length; i++) {
                var canUse = true;
                if (shop.ncolors[i].rank > player.rank || (shop.ncolors[i].subscription == 1 && !player.subscription.isSubscriber))
                    canUse = false;
                ncolors += build.build(build.COLOR_CELL, ["changeColor(" + shop.ncolors[i].id + ");", shop.ncolors[i].label, canUse ? "green" : "red", shop.ncolors[i].hex, "Use", !canUse]);
            }
            $("#tab-body-colors").html(ncolors);
            var hats = "";
            for (i = 0; i < shop.hats.length; i++) {
                var label = "";
                var canUse = false;
                if (shop.hats[i].name == "no_name") {
                    label = shop.hats[i].price + " Coins";
                } else {
                    label = shop.hats[i].name;
                    if (label == "VIP Hat" && utils.isVip(player.rank))
                        canUse = true;
                }
                if (player.hats.indexOf(shop.hats[i].id) > -1)
                    canUse = true;
                hats += build.build(build.ITEM_CELL, ["changeHat(" + shop.hats[i].id + ");", label, canUse ? "green" : (shop.hats[i].price > player.coins ? "red" : "orange"), shop.hats[i].url, canUse ? "Use" : (shop.hats[i].price > player.coins ? (shop.hats[i].price >= 11111111 ? "Use" : "Buy") : "Buy"), !(canUse || player.coins >= shop.hats[i].price)]);
            }
            $("#tab-body-hats").html(hats);
            var xp_skins = "";
            for (i = 0; i < shop.skins.length; i++) {
                if (shop.skins[i].level < 1000 && shop.skins[i].glow != 2)
                    xp_skins += build.build(build.SKIN_CELL, ["changeSkin(" + shop.skins[i].id + ");", "Level " + shop.skins[i].level, shop.skins[i].level > player.level ? "red" : "green", shop.skins[i].url, shop.skins[i].color, "Use", shop.skins[i].level > player.level, false]);
            }
            $("#tab-body-xpsk").html(xp_skins);
            var coin_skins = "";
            for (i = 0; i < shop.cskins.length; i++) {
                if (shop.cskins[i].price < 9999999 && shop.cskins[i].glow != 2)
                    coin_skins += build.build(build.SKIN_CELL, ["changeCSkin(" + shop.cskins[i].id + ");", shop.cskins[i].price + " Coins", player.skins.indexOf(shop.cskins[i].id) > -1 ? "green" : (shop.cskins[i].price > player.coins ? "red" : "orange"), shop.cskins[i].url, shop.cskins[i].color, player.skins.indexOf(shop.cskins[i].id) > -1 ? "Use" : "Buy", player.skins.indexOf(shop.cskins[i].id) == -1 && shop.cskins[i].price > player.coins, shop.cskins[i].glow == 1]);
            }
            $("#tab-body-coinsk").html(coin_skins);
            var rank_skins = "";
            for (i = 0; i < shop.skins.length; i++) {
                var rank_label = "VIP";
                if (shop.skins[i].level >= 4000) rank_label = "Legend";
                if (shop.skins[i].level >= 6000) rank_label = "Mod";
                if (shop.skins[i].level >= 10000) rank_label = "Admin";
                var canUse = false;
                if (rank_label == "VIP" && utils.isVip(player.rank)) canUse = true;
                if (rank_label == "Legend" && utils.isLegend(player.rank)) canUse = true;
                if (rank_label == "Mod" && utils.isMod(player.rank)) canUse = true;
                if (rank_label == "Admin" && utils.isAdmin(player.rank)) canUse = true;
                if (shop.skins[i].level > 1000 && shop.skins[i].glow != 2)
                    rank_skins += build.build(build.SKIN_CELL, ["changeSkin(" + shop.skins[i].id + ");", rank_label, canUse ? "green" : "red", shop.skins[i].url, shop.skins[i].color, "Use", !canUse, false]);
            }
            $("#tab-body-ranksk").html(rank_skins);
            var box_skins = "";
            for (i = 0; i < shop.cskins.length; i++) {
                if (shop.cskins[i].price == 9999999 && shop.cskins[i].glow != 2)
                    box_skins += build.build(build.SKIN_CELL, ["changeCSkin(" + shop.cskins[i].id + ");", "Box Skin", player.skins.indexOf(shop.cskins[i].id) > -1 ? "green" : "red", shop.cskins[i].url, shop.cskins[i].color, "Use", player.skins.indexOf(shop.cskins[i].id) == -1, false]);
            }
            $("#tab-body-boxsk").html(box_skins);
            var event_skins = "";
            for (i = 0; i < shop.cskins.length; i++) {
                if (shop.cskins[i].price <= 99999999 && shop.cskins[i].price >= 99999997 && shop.cskins[i].glow != 2) {
                    var label = "";
                    switch (shop.cskins[i].price) {
                        case 99999997:
                            label = "Event Skin";
                            break;
                        case 99999998:
                            label = "Pack Skin";
                            break;
                        default:
                            label = "Birthday Skin";
                    }
                    event_skins += build.build(build.SKIN_CELL, ["changeCSkin(" + shop.cskins[i].id + ");", label, player.skins.indexOf(shop.cskins[i].id) > -1 ? "green" : "red", shop.cskins[i].url, shop.cskins[i].color, "Use", player.skins.indexOf(shop.cskins[i].id) == -1, false]);
                }
            }
            $("#tab-body-eventsk").html(event_skins);
            var ruby_skins = "";
            for (i = 0; i < shop.cskins.length; i++) {
                if (shop.cskins[i].price <= 89999999 && shop.cskins[i].price >= 80000000 && shop.cskins[i].glow != 2) {
                    var label = (shop.cskins[i].price - 80000000) + " Rubies";
                    ruby_skins += build.build(build.SKIN_CELL, ["changeCSkin(" + shop.cskins[i].id + ");", label, player.skins.indexOf(shop.cskins[i].id) > -1 ? "green" : (player.rubies >= (shop.cskins[i].price - 80000000) ? "orange" : "red"), shop.cskins[i].url, shop.cskins[i].color, player.skins.indexOf(shop.cskins[i].id) == -1 ? "Buy" : "Use", player.skins.indexOf(shop.cskins[i].id) == -1 && player.rubies < (shop.cskins[i].price - 80000000), false]);
                }
            }
            $("#tab-body-rubysk").html(ruby_skins);
            var xp_boosts = "";
            for (i = 0; i < shop.boosts.length; i++)
                xp_boosts += build.build(build.ITEM_CELL, ["buyBoost(" + shop.boosts[i].id + ");", shop.boosts[i].price + " Coins", shop.boosts[i].price > player.coins ? "red" : "green", shop.boosts[i].image, "Buy", shop.boosts[i].price > player.coins]);
            $("#tab-body-xpbst").html(xp_boosts);
            var mass_price = (150 + (r.mass * r.mass * 9));
            $("#tab-body-massbst").html(build.build(build.ITEM_CELL, ["buyMass();", mass_price + " Coins", mass_price > player.coins ? "red" : "green", "iOtD6D8", "Buy", mass_price > player.coins]));
            if (isFirstAccess) {
                isFirstAccess = false;
                updateUrl();
                if (player.chest.time > 0)
                    popUps.push(".chest");
                if (player.event.part > 0 && player.event.part < 9 && player.event.time > 0)
                    popUps.push(".event");
                if (player.challenge.status != 0)
                    popUps.push(".challenge");
                if (packTime > 0)
                    popUps.push(".pack");
                closeAll(true);
            }
            connectLogin("mall", {
                token: utils.getCookie("token")
            }, function(s) {
                const MAX_ITEMS = 48;
                var skinCount = 0,
                    skinsMall = "",
                    skinsPages = "",
                    boxesMall = "",
                    hatsMall = "",
                    selfMall = "";
                for (i = 0; i < s.mall.length; i++) {
                    switch (s.mall[i].type) {
                        case "skin":
                            for (j = 0; j < shop.cskins.length; j++) {
                                if (shop.cskins[j].id != s.mall[i].item)
                                    continue;
                                var currentSkin = s.mall[i];
                                if (skinCount == 0)
                                    skinsMall += '<div id="skin-page-1" class="panel-page">';
                                skinsMall += build.build(build.SKIN_CELL, ["buyMall(" + currentSkin.id + ");", currentSkin.username + "<br>" + currentSkin.price + " Coins", player.coins >= currentSkin.price ? "green" : "red", shop.cskins[j].url, shop.cskins[j].color, "Buy", currentSkin.price > player.coins, false]);
                                if ((skinCount + 1) % MAX_ITEMS == 0)
                                    skinsMall += '</div><div id="skin-page-' + (((skinCount + 1) / MAX_ITEMS) + 1) + '" class="panel-page" style="display: none;">';
                                if (currentSkin.username == player.username)
                                    selfMall += build.build(build.SKIN_CELL, ["cancelMall(" + currentSkin.id + ");", currentSkin.price + " Coins", "green", shop.cskins[j].url, shop.cskins[j].color, "Cancel", false, false]);
                                skinCount++;
                            }
                            break;
                        case "box":
                            var currentBox = s.mall[i];
                            boxesMall += build.build(build.ITEM_CELL, ["buyMall(" + currentBox.id + ");", currentBox.username + "<br>" + currentBox.extra + "<br>" + currentBox.price + " Coins", player.coins >= currentBox.price ? "green" : "red", "s3mLx6D", "Buy", currentBox.price > player.coins]);
                            if (currentBox.username == player.username)
                                selfMall += build.build(build.ITEM_CELL, ["cancelMall(" + currentBox.id + ");", currentBox.extra + "<br>" + currentBox.price + " Coins", "green", "s3mLx6D", "Cancel", false]);
                            break;
                        case "hat":
                            for (j = 0; j < shop.hats.length; j++) {
                                if (shop.hats[j].id != s.mall[i].item)
                                    continue;
                                var currentHat = s.mall[i];
                                hatsMall += build.build(build.ITEM_CELL, ["buyMall(" + currentHat.id + ");", currentHat.username + "<br>" + currentHat.price + " Coins", player.coins >= currentHat.price ? "green" : "red", shop.hats[j].url, "Buy", currentHat.price > player.coins]);
                                if (currentHat.username == player.username)
                                    selfMall += build.build(build.ITEM_CELL, ["cancelMall(" + currentHat.id + ");", currentHat.price + " Coins", "green", shop.hats[j].url, "Cancel", false]);
                            }
                            break;
                        default:
                            console.log("Unknown item type on mall!");
                    }
                }
                for (i = 0; i < Math.floor(skinCount / MAX_ITEMS) + 1; i++)
                    skinsPages += '<div onclick="pageClick(this);" id="skin-page" class="panel-page-btn' + (i == 0 ? " selected" : "") + '">' + (i + 1) + '</div>';
                if (skinsMall != "") {
                    skinsMall += '</div>';
                    $("#skin-pages").html(skinsMall);
                    $("#skin-buttons").html(skinsPages);
                } else {
                    $("#skin-pages").html("No skins being sold");
                }
                if (hatsMall != "")
                    $("#tab-body-mall-3").html(hatsMall);
                else
                    $("#tab-body-mall-3").html("No hats being sold");
                if (boxesMall != "")
                    $("#tab-body-mall-2").html(boxesMall);
                else
                    $("#tab-body-mall-2").html("No boxes being sold");
                if (selfMall != "") {
                    $("#self-mall-items").html(selfMall);
                    $("#self-mall").show();
                } else {
                    $("#self-mall").hide();
                }
            }, null, true);
        }, utils.redirectLogin, true);
    });
    new Thread(function() {
        if (!player.challenge) return;
        if (lastUrl != window.location.pathname.substring(1))
            updateUrl();
        var challengeText = "",
            chestText = "";
        switch (player.challenge.status) {
            case 1:
                challengeText = "WOW! You are doing very well with your account, I'm amazed with the dedication you are putting into the game, so I'll make a special offer to you: if you are able to reach level&nbsp;%1 in %2&nbsp;days %3&nbsp;hours %4&nbsp;minutes and %5&nbsp;seconds, I'll give you %6&nbsp;Xp. Lets see if you can do it!";
                break;
            case 2:
                challengeText = "Congratulations on level&nbsp;%0! But, unfortunately, you didn't make it in time to get the reward I proposed to you. Don't worry though, I have a better offer this time: if you are able to reach level&nbsp;%1 in %2&nbsp;days %3&nbsp;hours %4&nbsp;minutes and %5&nbsp;seconds, I'll give you %6&nbsp;Xp. Lets see if you can do it!";
                break;
            case 3:
                challengeText = "You did it! You impressed me with how fast you could do it, but I'll give you a harder challenge this time: if you are able to reach level&nbsp;%1 in %2&nbsp;days %3&nbsp;hours %4&nbsp;minutes and %5&nbsp;seconds, I'll give you %6&nbsp;Xp. Lets see if you can do it again!";
                break;
        }
        if (player.challenge.time > 0)
            player.challenge.time--;
        if (player.chest.time > 0)
            player.chest.time--;
        if (player.event.time > 0)
            player.event.time--;
        if (packTime > 0)
            packTime--;
        if (message.time > 0)
            message.time--;
        if (player.chest.coins >= player.chest.total) {
            chestText = "There is a filled Chest of Gold in the server! A global %3x Xp boost is active for %1&nbsp;minutes and %2&nbsp;seconds, buying a 3x boost for your account will give you a %4x boost.";
            $(".chest .chest-goal, .chest .chest-goal-value, .chest .progress, .chest input, .chest .button").hide();
        } else {
            chestText = "There is an opened chest in the server! If we are able to fill it with coins within %1&nbsp;minutes and %2&nbsp;seconds, there will be a global %3x boost for 3 hours, buying a 3x boost for your account will give you a %4x. The whole server is putting coins into it, would you like to help ? You can add any amount";
            $(".chest .chest-goal, .chest .chest-goal-value, .chest .progress, .chest input, .chest .button").show();
        }
        if (player.challenge.time == 0 && $(".challenge").is(":visible"))
            closeAll(true);
        if (player.chest.time == 0 && $(".chest").is(":visible"))
            closeAll(true);
        if ((player.event.time == 0 || player.event.part == 0 || player.event.part == 9) && $(".event").is(":visible"))
            closeAll(true);
        if (packTime == 0 && $(".pack").is(":visible"))
            closeAll(true);
        challengeText = challengeText.split("%0").join(player.level).split("%1").join(player.level + 1).split("%5").join(player.challenge.time % 60).split("%4").join(Math.floor(player.challenge.time / 60) % 60).split("%3").join(Math.floor(player.challenge.time / 3600) % 24).split("%2").join(Math.floor(player.challenge.time / (3600 * 24))).split("%6").join(player.challenge.xp).split(" 0&nbsp;days").join("").split(" 0&nbsp;hours").join("").split(" 0&nbsp;minutes").join("").split(" 1&nbsp;days").join(" 1&nbsp;day").split(" 1&nbsp;hours").join(" 1&nbsp;hour").split(" 1&nbsp;minutes").join(" 1&nbsp;minute").split(" 1&nbsp;seconds").join(" 1&nbsp;second").split("in and").join("in");
        chestText = chestText.split("%1").join(Math.floor(player.chest.time / 60)).split("%2").join(player.chest.time % 60).split("%3").join(player.chest.boost).split("%4").join(player.chest.boost * 3).split(" 1&nbsp;minutes").join(" 1&nbsp;minute").split(" 1&nbsp;seconds").join(" 1&nbsp;second");
        $(".challenge p").html(challengeText);
        $(".chest p").html(chestText);
        $(".chest .progress-bar").css("width", (100 * player.chest.coins / player.chest.total) + "%");
        $(".chest-goal-value").html("<strong>" + player.chest.coins + "</strong>/" + player.chest.total + " Coins");
        $(".challenge-reward").html(player.challenge.xp + "&nbsp;Xp");
        $(".challenge-time").html("%1d %2h %3m %4s".split("%4").join(player.challenge.time % 60).split("%3").join(Math.floor(player.challenge.time / 60) % 60).split("%2").join(Math.floor(player.challenge.time / 3600) % 24).split("%1").join(Math.floor(player.challenge.time / (3600 * 24))));
        $(".pack-time").html("%1d %2h %3m %4s".split("%4").join(packTime % 60).split("%3").join(Math.floor(packTime / 60) % 60).split("%2").join(Math.floor(packTime / 3600) % 24).split("%1").join(Math.floor(packTime / (3600 * 24))));
        $("#message").html(message.text.split("%time%").join(message.time > 60 ? (Math.floor(message.time / 60) + "&nbsp;minutes and " + (message.time % 60) + "&nbsp;seconds") : (message.time + "&nbsp;seconds")).split(" 1&nbsp;minutes").join(" 1&nbsp;minute").split(" 1&nbsp;seconds").join(" 1&nbsp;second"));
        if (message.time > 0) $("#message").removeClass("hidden");
        else $("#message").addClass("hidden");
        if (eventInfo == null || player.event.time == 0 || player.event.part == 0 || player.event.part == 9) return;
        var eventProgress = player.event.progress;
        if (eventInfo.parts[player.event.part - 1].type == 2) eventProgress = player.totalXp - player.event.progress;
        $(".event h2").html(eventInfo.name + " (" + player.event.part + "/" + eventInfo.parts.length + ")");
        $(".event p").html(eventInfo.parts[player.event.part - 1].description);
        $(".event-item").html(eventInfo.parts[player.event.part - 1].itemName);
        $(".event .progress-bar").css("width", (100 * eventProgress / eventInfo.parts[player.event.part - 1].totalItems) + "%");
        $(".event-item-amount").html("<strong>" + eventProgress + "</strong>/" + eventInfo.parts[player.event.part - 1].totalItems);
        $(".event-time").html("%1d %2h %3m %4s".split("%4").join(player.event.time % 60).split("%3").join(Math.floor(player.event.time / 60) % 60).split("%2").join(Math.floor(player.event.time / 3600) % 24).split("%1").join(Math.floor(player.event.time / (3600 * 24))));
    }).register(1);
    connectLogin("shop", {}, function(r) {
        if (r.state == "error") {
            utils.addAlert("red", r.error);
            return;
        }
        shop = r;
        mainThread.register(utils.minToSec(2), utils.minToSec(3));
    }, null, true);

    function onCtxMenu(event) {
        switch (event.type) {
            case "comment":
                return [{
                    text: "Visit profile",
                    onclick: "openProfile('" + event.user + "');"
                }, {
                    text: "Remove comment",
                    onclick: "removeComment('" + event.cid + "');"
                }];
                break;
            case "user":
                return [{
                    text: "Send coins",
                    onclick: "preSendCoins('" + event.user + "');"
                }];
                break;
            case "mall":
                return [{
                    text: "Visit Profile",
                    onclick: "openProfile('" + event.user + "');"
                }];
                break;
        }
        return [];
    }
    var _closeAll = function(closeMask) {
        if (closeMask && popUps.length == 0) $("#mask").fadeOut(500);
        $(".modal-holder").fadeOut(200);
        $("#profile-container").fadeOut(200);
        $("#notifications-container").fadeOut(200);
        $(".pack").fadeOut(200);
        $(".challenge").fadeOut(200);
        $(".chest").fadeOut(200);
        $(".event").fadeOut(200);
        $("#nav-profile").removeClass("selected");
        $("#nav-notifications").removeClass("selected");
        isProfileShown = false;
        areNotificationsShown = false;
        if (popUps.length > 0 && closeMask) {
            closeAll(false);
            $("#mask").fadeIn(200);
            $(popUps[0]).fadeIn(500);
            popUps.splice(0, 1);
        }
    }
    closeAll = _closeAll;
    $("#nav-profile").click(function() {
        if (isProfileShown) {
            closeAll(true);
        } else {
            closeAll(false);
            $("#mask").fadeIn(200);
            $("#profile-container").fadeIn(500);
            $("#nav-profile").addClass("selected");
            isProfileShown = true;
        }
    });
    $("#nav-notifications").click(function() {
        if (areNotificationsShown) {
            closeAll(true);
        } else {
            closeAll(false);
            $("#mask").fadeIn(200);
            $("#notifications-container").fadeIn(500);
            $("#nav-notifications").addClass("selected");
            utils.setCookie("lastNotification", ("" + lastNotification), 40000);
            $("#notification-amount").hide();
            areNotificationsShown = true;
            notificationAmount = 0;
        }
    });
    $("#mask").click(function() {
        closeAll(true);
    });
    $(".pack-close").click(function() {
        closeAll(true);
    });
    $(".challenge-close").click(function() {
        closeAll(true);
    });
    $(".chest-close").click(function() {
        closeAll(true);
    });
    $(".event-close").click(function() {
        closeAll(true);
    });
    $(".modal .close-btn").click(function() {
        closeAll(true);
    });
    $(".navbar .nav-item").click(function() {
        var id = $(this).attr("id");
        $(".page").hide();
        $("#" + id.split("nav-").join("") + ".page").show();
        $(".navbar .nav-item").removeClass("selected");
        $(this).addClass("selected");
        history.pushState('', '', '/' + $(this).data("url"));
        lastUrl = window.location.pathname.substring(1);
    });
    $(".tab-panel .panel-head .tab").click(function() {
        var id = $(this).attr("id");
        var parentId = $(this).parent().parent().attr("id");
        $("#" + parentId + " .tab-body").hide();
        $("#tab-body-" + id.split("tab-").join("") + ".tab-body").show();
        $("#" + parentId + " .panel-head .tab").removeClass("selected");
        $(this).addClass("selected");
    });
    $("#tab-profile-mall").click(function() {
        history.pushState('', '', '/mall/' + currentProfile);
        lastUrl = window.location.pathname.substring(1);
    });
    $("#tab-comments").click(function() {
        history.pushState('', '', '/user/' + currentProfile);
        lastUrl = window.location.pathname.substring(1);
    });
    $("#ham-menu").click(function() {
        if (isNavShown) {
            $(".navbar").css("margin-left", "-12em");
            $("#ham-menu").removeClass("selected");
        } else {
            $(".navbar").css("margin-left", "0");
            $("#ham-menu").addClass("selected");
        }
        isNavShown = !isNavShown;
    });
    $(document.body).delegate(".tooltip", "mouseenter", function() {
        var self = this;
        if (tooltipTimer) clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(function() {
            tooltipTimer = null;
            var info = typeof $(self).data("tooltip") == "object" ? $(self).data("tooltip") : JSON.parse($(self).data("tooltip").text);
            $("#tooltip").html($(self).data("tooltip").text);
            if ($(self).data("tooltip").left)
                $("#tooltip").css("margin-left", ($(self).offset().left - $("#tooltip").outerWidth() - 2) + "px");
            else
                $("#tooltip").css("margin-left", ($(self).offset().left + $(self).outerWidth() + 2) + "px");
            $("#tooltip").css("margin-top", ($(self).offset().top + $(self).outerHeight() / 2 - document.documentElement.scrollTop - $("#tooltip").outerHeight() / 2) + "px");
            $("#tooltip").fadeIn(200);
        }, $(self).data("tooltip").time * 1000);
    });
    $(document.body).delegate(".tooltip", "mouseleave", function() {
        if (tooltipTimer) {
            clearTimeout(tooltipTimer);
            tooltipTimer = null;
        } else {
            $("#tooltip").fadeOut(200);
        }
    });
    $("#tooltip").hover(function() {
        $("#tooltip").fadeOut(200);
    });
    $(document).bind("contextmenu", function(event) {
        var target = event.target;
        if (!$(target).hasClass("ctxmenu") && $(target).parents(".ctxmenu").length == 0) return;
        if (!$(target).hasClass("ctxmenu"))
            target = $(target).parents(".ctxmenu")[0];
        isCtxMenuOpened = true;
        var elements = onCtxMenu($(target).data("ctx")),
            html = "";
        for (var i = 0; i < elements.length; i++)
            html += '<div class="ctx_item" onclick="' + elements[i].onclick + '">' + elements[i].text + '</div>';
        $("#ctxmenu").html(html);
        $("#ctxmenu").css("margin-left", event.pageX + "px");
        $("#ctxmenu").css("margin-top", (event.pageY - document.documentElement.scrollTop) + "px");
        $("#ctxmenu").show();
        event.preventDefault();
    });
    $(document).click(function(event) {
        isCtxMenuOpened = false;
        $("#ctxmenu").hide();
    });
});
var connectLogin = function(page, jsonSend, onSuccess, onError, bypassBusy) {
    var dataSend = utils.createData(jsonSend);
    if (!dataSend) {
        console.error("Failed building data when trying to connect to: " + page);
        if (onError) onError();
        return;
    }
    if (!bypassBusy) {
        if (isBusy) {
            utils.addAlert("orange", "Still thinking... wait a little before performing another action");
            return;
        }
        isBusy = true;
        $("#loader").css("z-index", 11);
    }
    $.ajax({
        type: 'GET',
        url: BASE_URL + page + "/" + dataSend
    }).done(function(r) {
        if (!bypassBusy) {
            isBusy = false;
            $("#loader").css("z-index", 0);
        }
        if (onSuccess) onSuccess(r);
    }).error(function() {
        if (!bypassBusy) {
            isBusy = false;
            $("#loader").css("z-index", 0);
        }
        if (onError) onError();
    });
};

function updateUrl() {
    var url = window.location.pathname.substring(1);
    var urlElement = $("div[data-url='" + url + "']");
    lastUrl = url;
    if (urlElement) urlElement.click();
    if (url.split("/").length == 2) {
        switch (url.split("/")[0]) {
            case "user":
                openProfile(url.split("/")[1], true, function() {
                    $("#tab-comments").click();
                    $("#loading").fadeOut(500);
                });
                break;
            case "mall":
                openProfile(url.split("/")[1], true, function() {
                    $("#tab-profile-mall").click();
                    $("#loading").fadeOut(500);
                });
                break;
            default:
                $("#loading").fadeOut(500);
        }
    } else {
        $("#loading").fadeOut(500);
    }
}
var changeColor = function(id) {
    connectLogin("name-color", {
        token: utils.getCookie("token"),
        id: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Color changed!");
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var changeHat = function(id) {
    connectLogin("set-hat", {
        token: utils.getCookie("token"),
        sId: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", r.message);
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var changeSkin = function(id) {
    connectLogin("set-skin", {
        token: utils.getCookie("token"),
        sId: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Skin changed!");
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var changeCSkin = function(id) {
    connectLogin("coin-skin", {
        token: utils.getCookie("token"),
        sId: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", r.message);
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var buyBoost = function(id) {
    connectLogin("buy-boost", {
        token: utils.getCookie("token"),
        sId: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Boost successfully activated!");
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var buyMass = function() {
    connectLogin("buy-mass", {
        token: utils.getCookie("token")
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Spawning mass successfully bought!");
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var dailyReward = function() {
    connectLogin("daily-reward", {
        token: utils.getCookie("token")
    }, function(r) {
        if (r.state == "success") {
            for (i = 0; i < r.messages.length; i++)
                utils.addAlert("green", r.messages[i]);
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var openBox = function() {
    connectLogin("open-box", {
        token: utils.getCookie("token")
    }, function(r) {
        if (r.state == "success") {
            for (i = 0; i < r.messages.length; i++)
                utils.addAlert("green", r.messages[i]);
            mainThread.force(2);
        } else {
            utils.addAlert("red", r.error);
            mainThread.force();
        }
    }, utils.noConnection, false);
};
var chestAdd = function(amount) {
    if (amount == null || isNaN(amount) || amount <= 0)
        return utils.addAlert("red", "You need to type a value greater then zero in the box!");
    connectLogin("chest-add", {
        token: utils.getCookie("token"),
        amount: amount
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "You successfully contributed to the chest of gold!");
            player.chest.coins += Number(amount);
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};

function changePw(old_pass, pass, passr) {
    if (pass.length > 32 || old_pass.length > 32) {
        utils.addAlert("red", "Password is too big, max length is 32 chars");
        return;
    }
    if (pass.length < 8 || old_pass.length < 8) {
        utils.addAlert("red", "Password is too short, min length is 8 chars");
        return;
    }
    if (pass != passr) {
        utils.addAlert("red", "Passwords don't match");
        return;
    }
    connectLogin("change-pw", {
        token: utils.getCookie("token"),
        pwd: old_pass,
        npwd: pass
    }, function(r) {
        if (r.state == "success") utils.addAlert("green", "Password changed!");
        else utils.addAlert("red", r.error);
    }, utils.noConnection, false);
}

function preSendCoins(username) {
    $("#modal-15").html(build.build(build.SEND_COINS, [username]));
    showDialog(15);
}

function sendCoins(username, amount) {
    if (isNaN(amount)) {
        utils.addAlert("red", "Invalid amount!");
        return;
    }
    if (amount < 500) {
        utils.addAlert("red", "You need to send at least 500 Coins");
        return;
    }
    $(".modal .close-btn").click();
    connectLogin("send-coins", {
        token: utils.getCookie("token"),
        username: username,
        amount: amount
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Coins successfully sent!");
            mainThread.force();
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
}

function sellItem(type, id, price) {
    if (price) {
        if (isNaN(price)) {
            utils.addAlert("red", "Invalid price!");
            return;
        }
        if (price > 2000000 || price < 100) {
            utils.addAlert("red", "Your items need to be between 100 and 2000000 coins");
            return;
        }
        $(".modal .close-btn").click();
        connectLogin("sell-item", {
            token: utils.getCookie("token"),
            type: type,
            id: id,
            price: price
        }, function(r) {
            if (r.state == "success") {
                utils.addAlert("green", "Item added to the mall!");
                mainThread.force();
            } else {
                utils.addAlert("red", r.error);
            }
        }, utils.noConnection, false);
    } else {
        $("#modal-15").html(build.build(build.SET_PRICE, [type, id]));
        showDialog(15);
    }
}
var buyMall = function(id) {
    connectLogin("buy-mall", {
        token: utils.getCookie("token"),
        id: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Item bought with success!");
            mainThread.force(4);
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var cancelMall = function(id) {
    connectLogin("cancel-mall", {
        token: utils.getCookie("token"),
        id: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Item cancelled with success!");
            mainThread.force(4);
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var follow = function(username) {
    connectLogin("follow", {
        token: utils.getCookie("token"),
        username: username
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", r.message);
            if (player.following.indexOf(username) > -1) player.following.splice(player.following.indexOf(username), 1);
            else player.following.push(username);
            mainThread.force();
            openProfile(currentProfile, true);
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var removeComment = function(id) {
    connectLogin("remove-comment", {
        token: utils.getCookie("token"),
        id: id
    }, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Comment removed!");
            $('.comment').each(function(i, comment) {
                if ($(comment).data("ctx").cid == id) $(comment).remove();
            });
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var comment = function(recaptcha) {
    var json_send = {};
    json_send.token = utils.getCookie("token");
    json_send.username = currentProfile;
    json_send.message = $("#comment-area").val();
    json_send.recaptcha = recaptcha;
    grecaptcha.reset();
    if (utils.createData(json_send) == null) {
        utils.addAlert("red", "Your comment contains invalid characters");
        return;
    }
    connectLogin("comment", json_send, function(r) {
        if (r.state == "success") {
            utils.addAlert("green", "Comment submitted!");
            $("#comment-area").val("");
            openProfile(currentProfile, true);
        } else {
            utils.addAlert("red", r.error);
        }
    }, utils.noConnection, false);
};
var openProfile = function(username, bypass, callback) {
    $(".page").slideUp(1000);
    var user = player.username;
    if (username) user = username;
    connectLogin("user-profile", {
        token: utils.getCookie("token"),
        username: user
    }, function(r) {
        if (r.state == "success") {
            history.pushState('', '', '/user/' + user);
            lastUrl = window.location.pathname.substring(1);
            currentProfile = user;
            $("#tab-comments").click();
            if (callback) callback();
            if (utils.getCookie("firstProfile") != "nope") {
                utils.setCookie("firstProfile", "nope", 31);
                showDialog(14);
            }
            $("#full-profile-info").html(build.build(build.FULL_PROFILE, [(r.skin.code), (r.skin.color), r.nickname, r.username, build.buildBadges(r.badges), r.xp, r.xpt, r.xp * 100 / r.xpt, r.followers, r.coins, r.playtime, r.level, r.ncolor, player.following.indexOf(username) > -1 ? "Un-Follow" : "Follow", r.lastArena]).split("%bnr%").join(''));
            $("#full-profile").slideDown(200);
            var userMall = "";
            for (i = 0; i < r.mall.length; i++) {
                if (r.mall[i].type == "skin") {
                    for (j = 0; j < shop.cskins.length; j++) {
                        if (shop.cskins[j].id != r.mall[i].item)
                            continue;
                        var currentSkin = r.mall[i];
                        userMall += build.build(build.SKIN_CELL, ["buyMall(" + currentSkin.id + ");", currentSkin.price + " Coins", player.coins >= currentSkin.price ? "green" : "red", shop.cskins[j].url, shop.cskins[j].color, "Buy", currentSkin.price > player.coins, false]);
                    }
                } else if (r.mall[i].type == "box") {
                    var currentBox = r.mall[i];
                    userMall += build.build(build.ITEM_CELL, ["buyMall(" + currentBox.id + ");", currentBox.extra + "<br>" + currentBox.price + " Coins", player.coins >= currentBox.price ? "green" : "red", "s3mLx6D", "Buy", currentBox.price > player.coins]);
                } else if (r.mall[i].type == "hat") {
                    for (j = 0; j < shop.hats.length; j++) {
                        if (shop.hats[j].id != r.mall[i].item)
                            continue;
                        var currentHat = r.mall[i];
                        userMall += build.build(build.ITEM_CELL, ["buyMall(" + currentHat.id + ");", currentHat.price + " Coins", player.coins >= currentHat.price ? "green" : "red", shop.hats[j].url, "Buy", currentHat.price > player.coins]);
                    }
                }
            }
            if (userMall != "")
                $("#tab-body-profile-mall").html(userMall);
            else
                $("#tab-body-profile-mall").html("This user has no items in the mall!");
            var userComments = "";
            for (i = 0; i < r.comments.length; i++)
                userComments += build.build(build.COMMENT, [r.comments[i].id, (r.comments[i].skin.code), (r.comments[i].skin.color), r.comments[i].nickname, r.comments[i].username, build.buildBadges(r.comments[i].badges), r.comments[i].date, r.comments[i].message]);
            $("#profile-comments").html(userComments);
        } else {
            $(".page").slideDown(100);
            utils.addAlert("red", r.error);
        }
    }, function() {
        $(".page").slideDown(100);
        utils.noConnection();
    }, bypass);
};

function toggleTheme() {
    switch (utils.getCookie("theme")) {
        case "dark":
            utils.setCookie("theme", "light", 365000);
            break;
        case "light":
            utils.setCookie("theme", "dark", 365000);
            break;
        default:
            console.log("Unknown current theme, changing to light");
            utils.setCookie("theme", "light", 365000);
    }
    location.reload();
}

function showDialog(id) {
    $("#modal-" + id).fadeIn(500);
    $("#mask").fadeIn(200);
    $("#profile-container").fadeOut(200);
    $("#nav-profile").removeClass("selected");
    $("#notifications-container").fadeOut(200);
    $("#nav-notifications").removeClass("selected");
}

function pageClick(that) {
    var id = $(that).attr("id"),
        parentId = $(that).parent().parent().attr("id");
    $("#" + parentId + " .panel-page").hide();
    $("#" + id + "-" + $(that).html()).show();
    $("#" + parentId + " .panel-pages .panel-page-btn").removeClass("selected");
    $(that).addClass("selected");
}
