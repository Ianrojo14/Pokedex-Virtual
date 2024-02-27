// ==UserScript==
// @name         AgarIO Hub
// @namespace    agariohub.io
// @version      1.0
// @description  AgarIO Hub
// @author       JJimenez15
// @match        *.agariohub.io/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

function JJimenez15() {
    var html = `
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://www.google.com/recaptcha/api.js"></script>
	<script src="https://pastebin.com/raw/k3MBcE6E"></script>
	<script type="text/javascript">
var addAlert = function(type, message) {
	$("#notifications").append('<div class="notification ' + type + '" onclick="removeMe(this);">' + message + '</div>');
};

$("#loginbtn").click(function(){loginN(document.getElementById('email').value, document.getElementById('pass').value, $('#remember').is(':checked'));});
function loginN(email, pass, remember){
	if(email.length > 32 || pass.length > 32){
		addAlert("danger", "Email/Username and password don't match");
		return;
	}
	if(email.length < 4 || pass.length < 8){
		addAlert("danger", "Email/Username and password don't match");
		return;
	}
	if(grecaptcha.getResponse() == "") {
		addAlert("danger", "Check the reCAPTCHA box before logging in");
		return;
	}
	var json_send = {};
	json_send.email = email;
	json_send.pwd = pass;
	json_send.captcha = grecaptcha.getResponse();
	json_send.udi = getCookie("udi");
	grecaptcha.reset();
	if(createData(json_send) == null){
		addAlert("danger", "One of your inputs contain invalid chars. Your username can contain only letters, numbers, _ and -");
		return;
	}
	$.ajax({type: 'GET', url: 'http://api.agariohub.io/login/' + createData(json_send)}).done(function(r){
		if(r.state == "success"){
			setCookie("token", r.token, (remember?30:1));
			addAlert("success", "Logged in! Token: " + r.token);
			$("#ntfcto").append("Token: " + r.token);
		}else if(r.state == "redirect"){
			addAlert("warning", r.error);
			window.location = r.url;
		}else{
			addAlert("danger", r.error);
		}
	}).fail(function(){
		addAlert("danger", "Our login servers are not working! Try again later");
	});
}
	</script>
	<style>
	* {
		margin: 0;
		padding: 0;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	input {
		-webkit-touch-callout: text;
		-webkit-user-select: text;
		-khtml-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
	}

	body {
		font-size: 13px;
		font-family: Roboto, Arial;
		background-color: #F5F5F6;
	}

	a {
		color: #3F51B5;
		text-decoration: none;
	}

	.g-recaptcha{
		width: 304px;
		margin: auto;
	}

	@media screen and (min-width: 360px) {
		body{font-size: 14px;}
	}

	@media screen and (min-width: 600px) {
		body{font-size: 15px;}
	}

	.hide-l {
		opacity: 0 !important;
		left: -20em !important;
		transition: all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
	}

	.hide-r {
		opacity: 0 !important;
		left: 20em !important;
		transition: all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
	}

	.hide-t {
		opacity: 0 !important;
		top: -24em !important;
		transition: all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
	}

	#login-panel, #logged-panel {
		opacity: 1;
		left: 0;
		border-radius: 2px;
		position: relative;
		width: 80%;
		max-width: 24em;
		margin: auto;
		margin-top: -30vh;
		padding: 2.8em 2.4em;
		background-color: #FFFFFF;
		overflow: hidden;
		box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.6em rgba(0, 0, 0, 0.16);
		transition: all 0.2s cubic-bezier(0.4, 0.0, 1, 1);
	}

	#login-panel { padding-bottom: 1.4em; }

	#login-panel.loading:after {
		position: absolute;
		content: '';
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.8);
	}

	h1 {
		font-family: Roboto, Arial;
		font-size: 2em;
		margin-bottom: 0.4em;
		font-weight: 400;
		color: #424242;
	}

	input[type="password"], input[type="number"], input[type="text"] {
		box-sizing: border-box;
		display: block;
		width: 100%;
		height: 2.8em;
		padding: 0.8em 0.8em 0.8em 0.4em;
		margin: auto;
		border: none;
		border-bottom: 1px solid rgba(0, 0, 0, 0.21);
	}

	input:focus {
		outline: none;
	}

	.bar {
		display: block;
		margin: auto;
		position: relative;
		width: 100%;
	}
	.bar:before, .bar:after {
		content: '';
		height: 2px;
		width: 0;
		bottom: 1px;
		position: absolute;
		background-color: #3F51B5;
		transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
	}
	.bar:before { left: 50%; }
	.bar:after { right: 50%; }

	::placeholder {
		color: rgba(0, 0, 0, 0.21);
	}

	input:focus ~ .bar:before, input:focus ~ .bar:after {
		width: 50%;
	}

	#loader {
		position: absolute;
		width: 100%;
		height: 0.2em;
		margin: -2.8em -2.4em;
		z-index: 1;
	}
	#loader-bar {
		height: 100%;
		width: 0;
		background-color: #FFFFFF;
		animation: loading 3s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
	}

	@keyframes loading {
		0% {
			width: 0;
			float: left;
		}
		25% {
			width: 100%;
			float: left;
		}
		26% {
			width: 100%;
			float: right;
		}
		50% {
			width: 0;
			float: right;
		}
		75% {
			width: 100%;
			float: right;
		}
		76% {
			width: 100%;
			float: left;
		}
		100% {
			width: 0;
			float: left;
		}
	}

	.button {
		box-sizing: border-box;
		margin: 0.6em 0 0 0.6em;
		font-size: 1em;
		font-weight: 600;
		border-radius: 2px;
		background-color: #3F51B5;
		color: #FFFFFF;
		display: inline-block;
		padding: 0.5em 1.8em;
		cursor: pointer;
		box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.3em rgba(0, 0, 0, 0.16);
		transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
		text-align: center;
		text-decoration: none;
		float: right;
		text-transform: uppercase;
	}

	.button:hover {
		background-color: #002984;
		box-shadow: 0 0.3em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 0.6em rgba(0, 0, 0, 0.2);
		transform: scale(1.02, 1.02);
		transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
	}

	.button:active {
		background-color: #002984;
		box-shadow: 0 0.4em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 1em rgba(0, 0, 0, 0.24);
		transform: scale(1.04, 1.04);
		transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
	}

	.button-transparent {
		background-color: transparent;
		color: #3F51B5;
		box-shadow: none;
	}

	.button-transparent:hover {
		background-color: rgba(0, 0, 0, 0.1);
		transform: scale(1, 1);
		box-shadow: none;
	}

	.button-transparent:active {
		background-color: rgba(0, 0, 0, 0.2);
		transform: scale(1, 1);
		box-shadow: none;
	}

	.ribbon {
		width: 100%;
		height: 40vh;
		background-color: #3F51B5;
	}

	#notifications {
		position: fixed;
		display: block;
		top: 1em;
		left: 0;
		right: 0;
		z-index: 100;
	}

	.notification {
		text-align: left;
		border-radius: 2px;
		color: #FFFFFF;
		position: relative;
		width: 85%;
		margin: 0.5em auto;
		padding: 1em;
		box-shadow: 0 0.3em 0.2em rgba(0, 0, 0, 0.16), 0 0.3em 1em rgba(0, 0, 0, 0.24);
		overflow: hidden;
		cursor: pointer;
	}

	.notification:after {
		content: "x";
		float: right;
		font-weight: 800;
		font-family: Arial, Roboto;
		color: rgba(0, 0, 0, 0.4);
	}

	.notification.success {
		background-color: #4CAF50;
	}
	.notification.danger {
		background-color: #F44336;
	}

	.image {
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 50%;
		border-radius: 100%;
		box-shadow: 0 0.2em 0.2em rgba(0,0,0,0.16), 0 0.3em 0.6em rgba(0,0,0,0.16);
		transition: all 0.4s cubic-bezier(0.4,0.0,0.2,1);
		width: 4em;
		height: 4em;
		margin-right: 0.4em;
		margin-top: 0.2em;
		display: inline-block;
	}

	.image:hover {
		border-radius: 10%;
	}

	.user-right {
		vertical-align: top;
		display: inline-block;
		left: 0;
		right: 0;
		width: calc(100% - 5em);
		margin-top: 0.4em;
	}

	.user-name {
		font-size: 1.6em;
		letter-spacing: 0.2em;
	}

	.user-level {
		font-size: 1.2em;
		color: #999999;
	}

	.null {
		display: inline;
	}

	.s1 { height: 1em; }
	.s4 { height: 4em; }

	.checkbox label { cursor: pointer; }
	input[type="checkbox"] {
		position: relative;
		top: -0.2em;
		margin-right: 0.6em;
		margin-bottom: 0.6em;
		cursor: pointer;
	}
	input[type="checkbox"]:before {
		transition: all 0.3s ease;
		content: "";
		position: absolute;
		left: 0;
		z-index: 1;
		width: 1rem;
		height: 1rem;
		border: 2px solid #E1E2E1;
	}
	input[type="checkbox"]:checked:before {
		-webkit-transform: rotate(-45deg);
		-moz-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		-o-transform: rotate(-45deg);
		transform: rotate(-45deg);
		height: .5rem;
		border-color: #3F51B5;
		border-top-style: none;
		border-right-style: none;
	}
	input[type="checkbox"]:after {
		content: "";
		position: absolute;
		top: -0.125rem;
		left: 0;
		width: 1.1rem;
		height: 1.1rem;
		background: #fff;
		cursor: pointer;
	}

	.tip {
		position: fixed;
		float: right;
		background-color: rgba(0, 0, 0, 0.6);
		color: #FFFFFF;
		border-radius: 2px;
		padding: 1em;
		max-width: 15em;
		margin-left: 40em;
		margin-top: -4em;
		opacity: 0;
		transition: all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
		text-align: justify;
	}

	.g-recaptcha:hover ~ .tip, .checkbox:hover ~ .tip {
		opacity: 1;
		margin-left: 25em;
		transition: all 0.2s cubic-bezier(0.4, 0.0, 1, 1);
	}

	@media screen and (max-width: 615px) {
		.tip { display: none; }
	}

	#mask {
		background-color: rgba(0, 0, 0, 0.4);
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 12;
		cursor: pointer;
	}
	.modal {
		box-sizing: border-box;
		border-radius: 0.2em;
		background-color: #FFFFFF;
		text-align: center;
		position: fixed;
		top: 0;
		left: 50%;
		width: 34em;
		margin-top: 4em;
		margin-left: -17em;
		padding: 1em;
		z-index: 13;
		box-shadow: 0 0.4em 0.2em rgba(0, 0, 0, 0.24), 0 0.3em 1.2em rgba(0, 0, 0, 0.4);
		transition: all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
	}
	@media screen and (max-width: 490px) {
		.modal {
			width: 100%;
			margin-left: 0;
			left: 0;
		}
	}
	.modal h2 {
		font-family: Roboto, Arial;
		font-size: 2em;
		font-weight: 400;
		color: #424242;
	}
	.modal p {
		margin: 1em;
		text-align: justify;
	}
	</style>

	<div class="ribbon"></div><div class="message-container">
	<h1>AgarIO Hub Login</h1>
	<p>By JJimenez15</p>

	<div id="notifications"></div><div id="ntfcto"></div><br>
	<input id="email" class="form-control" placeholder="Email address" maxlength="32" type="text"/><br>
	<input id="pass" class="form-control" placeholder="Password" maxlength="32" type="password"/><br>
	<input id="remember" type="checkbox"/><label for="remember">Remember me</label><br>
	<div class="g-recaptcha" data-sitekey="6LeFHj0UAAAAABe7IZXsg9Jbq_lXIUl5CKOeo_Ua"></div><br>
	<button id="loginbtn" class="button">Login</button><br><br>
	</div>
	`;
	$('body').append(html);
}
JJimenez15();
