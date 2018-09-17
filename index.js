"use strict";
(function() {

	// self-explanatory -- max # of players who have opportunity to answer per Q
	const MAX_JUMPERS_PER_QUESTION = 4;
	// [ q a z ] vs [ ] ' / ] (sides)
	const keys = [[81, 65, 90], [221, 222, 191]];
	
	// all quizzers playing
	let quizzers = [];
	// players who are in line to answer
	let jumpQueue = [];
	// players who have jumped then sat down for this question
	let forfeited = [];
	// number of players who have jumped for current question
	let jumps = 0;

	// DOM Structure:
	// 	body
	//		team
	//			name
	//			quizzer
	//				[icon]
	//				text
	//					name
	//					message
	//				[icon]


	// loads the DOM asap!
	window.addEventListener("load", loadDOM);
	
	// Generates the HTML elements used by the webpage, according to the const
	// KEYS detailed above. Places all generated elements in a div in the body
	function loadDOM() {
		let body = document.querySelector("body");
		// processes each team
		for (let t = 0; t < keys.length; t++) {
			let teamKeys = keys[t];
			let team = document.createElement("div");
				team.className = "team";
				let teamName = document.createElement("input");
					teamName.className = "name";
					teamName.type = "text";
					teamName.placeholder = "team";
				team.appendChild(teamName);
			body.appendChild(team);
			
			// processes each player within a team
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
				// message ("jumped" etc)
				let message = document.createElement("h2");
					message.innerHTML = "";
				// icon (key to press)
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
				document.addEventListener("keyup", function(event) {
					jump(event, quizzer);
				});
				document.addEventListener("keydown", function(event) {
					sit(event, quizzer);
				});
			}
		}
	}
	
	// given the index of a quizzer's team and its index within that team,
	// returns the DOM element of the quizzer
	function getQuizzer(teamIndex, index) {
		let body = document.querySelector("body");
		let team = body.childNodes[teamIndex];
		let quizzer = team.childNodes[index];
		return quizzer;
	}
	
	// Called by an input within a quizzer div when the input changes.
	// Updates the active status of the quizzer, based on its input
	function updateName() {
		let quizzer = this.parentElement;
		// if there's no name, it's not active! can simply call as boolean
		quizzer.active = this.value;
		if (!quizzer.active) {
			dequeue(quizzer);
		}
		if (quizzer.active) {
			// if active for the first time, make it sit
			if (quizzer.classList.length == 1) {
				quizzer.classList.add("down");
			}
		} else {
			// if inactive, remove any potential status
			quizzer.className = "quizzer";
		}
	}

	// when a key is pressed, if the corresponding quizzer is active, add them
	// to the jump queue and show that they're up! Then, add them to the queue
	// if they're eligible
	function jump(event, quizzer) {
		if (event.keyCode == quizzer.keyCode && quizzer.active) {
			quizzer.className = "quizzer up";
			if (!forfeited.includes(quizzer)) {
				enqueue(quizzer);
			}
		}
	}
	
	// removes a quizzer from the queue if they're active (& shows them sitting)
	function sit(event, quizzer) {
		if (event.keyCode == quizzer.keyCode && quizzer.active) {
			quizzer.className = "quizzer down";
			dequeue(quizzer);
		}
	}

	// adds a quizzer to the jump queue
	function enqueue(quizzer) {
		dequeue(quizzer);
		// stops adding people to queue after the max have jumped
		if (jumps < MAX_JUMPERS_PER_QUESTION) {
			jumpQueue.push(quizzer);
			jumps++;
		}
		updateMessages();
	}

	// removes a quizzer from the jump queue
	function dequeue(quizzer) {
		if (jumpQueue.includes(quizzer)) {
			let index = jumpQueue.indexOf(quizzer);
			jumpQueue.splice(index, 1);
			forfeited.push(quizzer);
		}
		updateMessages();
		// resets if nobody's in the queue anymore!
		if (jumpQueue.length == 0) {
			forfeited = [];
			jumps = 0;
		}
	}
	
	// shows the status message for each quizzer
	function updateMessages() {
		for (let i = 0; i < quizzers.length; i++) {
			updateMessage(quizzers[i]);
		}
	}

	// shows the status message for given quizzer
	// (answering, in line, or nada)
	function updateMessage(quizzer) {
		let index = jumpQueue.indexOf(quizzer);
		let message = "";
		if (index == 0) {
			message = "Answering";
		} else if (index > 0 && index < MAX_JUMPERS_PER_QUESTION) {
			message = "#" + index + " in line";
		} else {
			message = "";
		}
		quizzer.lastChild.innerHTML = message;
	}

})();
