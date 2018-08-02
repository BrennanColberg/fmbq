"use strict";
(function() {
	
	const MAX_JUMPS_PER_QUESTION = 4;

	// transitioning to using cookies (multiple pages)
	// [ q a z ] vs [ ] ' / ] (sides)
	const keys = [[81, 65, 90], [221, 222, 191]];
	let reading = false;
	let jumpTime = undefined;
	let quizzers = [];
	let standing = [];
	let forfeited = [];
	let asking = true;
	let jumps = 0; // number of jumped players for current question
	
	
	// 	body
	// 	lights
	//		team
	//			name
	//			quizzer
	//				[icon]
	//				text
	//					name
	//					message
	//				[icon]
	
	
	window.addEventListener("load", function() {
		let lights = document.getElementById("lights");
		for (let t = 0; t < keys.length; t++) {
			let teamKeys = keys[t];
			let team = document.createElement("div");
			team.className = "team";
			let teamName = document.createElement("input");
			teamName.className = "name";
			teamName.type = "text";
			teamName.placeholder = "team";
			team.appendChild(teamName);
			lights.appendChild(team);
			for (let i = 0; i < teamKeys.length; i++) {
				// setup
				let quizzer = document.createElement("div");
				quizzer.className = "quizzer";
				quizzer.active = false;
				quizzer.keyCode = teamKeys[i];
				
				// name
				let quizzerName = document.createElement("input");
				quizzerName.className = "name";
				quizzerName.type = "text";
				quizzerName.team = t;
				quizzerName.index = i;
				quizzerName.onchange = updateName;
				quizzerName.placeholder = "name";
				// message
				let message = document.createElement("h2");
				message.innerHTML = "";
				// icon
				let icon = document.createElement("img");
				icon.src = "keys/key_" + quizzer.keyCode + ".png";
				icon.alt = "key #" + quizzer.keyCode;
				icon.className = t == 0 ? "left" : "right";
				
				// incorporation into HTML
				quizzer.appendChild(quizzerName);
				quizzer.appendChild(icon);
				quizzer.appendChild(message);
				team.appendChild(quizzer);
				quizzers.push(quizzer);
				// listeners
				document.addEventListener("keyup", function(event){jump(event, quizzer);});
				document.addEventListener("keydown", function(event){sit(event, quizzer);});
			}
		}
	}, false);
	
	function getQuizzer(teamIndex, index) {
		let lights = document.getElementById("lights");
		let team = lights.childNodes[teamIndex];
		let quizzer = team.childNodes[index];
		return quizzer;
	}
	
	function updateName() {
		let quizzer = this.parentElement;
		quizzer.active = this.value;
		if (!quizzer.active) {
			dequeue(quizzer);
		}
		updateLight(quizzer);
	}
	
	function updateLight(quizzer) {
		if (quizzer.active) {
			quizzer.className = "quizzer down";
		} else {
			quizzer.className = "quizzer";
		}
	}
	
	function jump(event, quizzer) {
		if (event.keyCode == quizzer.keyCode && quizzer.active) {
			quizzer.className = "quizzer up";
			if (!forfeited.includes(quizzer)) {
				enqueue(quizzer);
			}
		}
	}
	
	function sit(event, quizzer) {
		if (event.keyCode == quizzer.keyCode && quizzer.active) {
			quizzer.className = "quizzer down";
			dequeue(quizzer);
		}
	}
	
	function enqueue(quizzer) {
		dequeue(quizzer);
		if (jumps < MAX_JUMPS_PER_QUESTION) { // can't use standing.length due to sitting
			standing.push(quizzer);
			jumps++;
		}
		updateMessages();
	}
	
	function dequeue(quizzer) {
		if (standing.includes(quizzer)) {
			let index = standing.indexOf(quizzer);
			standing.splice(index, 1);
			forfeited.push(quizzer);
		}
		updateMessages();
		if (standing.length == 0) {
			forfeited = [];
			jumps = 0;
		}
	}
	
	function updateMessages() {
		for (let i = 0; i < quizzers.length; i++) {
			updateMessage(quizzers[i]);
		}
	}
	
	function updateMessage(quizzer) {
		let index = standing.indexOf(quizzer);
		let message = "";
		if (index == 0) {
			message = "Answering";
		} else if (index > 0 && index < MAX_JUMPS_PER_QUESTION) {
			message = "#" + index + " in line";
		} else {
			message = "";
		}
		quizzer.lastChild.innerHTML = message;
	}
	
})();