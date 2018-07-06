(function() {

	// [ q a z ] vs [ ] ' / ] (sides)
	const keys = [[81, 65, 90], [221, 222, 191]];
	let reading = false;
	let jumpTime = undefined;
	let quizzers = [];
	let standing = [];
	let forfeited = [];
	let asking = true;
	
	
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
				icon.src = "key_" + quizzer.keyCode + ".png";
				icon.alt = "key #" + quizzer.keyCode;
				icon.className = t == 0 ? "left" : "right"
				
				// incorporation into HTML
				quizzer.appendChild(quizzerName);
				quizzer.appendChild(icon);
				quizzer.appendChild(message);
				team.appendChild(quizzer);
				quizzers.push(quizzer);
				// listeners
				document.addEventListener("keyup", function(event){jump(event, quizzer)});
				document.addEventListener("keydown", function(event){sit(event, quizzer)});
			}
		}
	});
	
	function getQuizzer(team, index) {
		let lights = document.getElementById("lights");
		let team = lights.childNodes[team];
		let quizzer = team.childNodes[index];
		return quizzer;
	}
	
	function updateName() {
		let quizzer = this.parentElement;
		quizzer.active = this.value;
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
		standing.push(quizzer);
		for (qi in quizzers) {
			updateMessage(quizzers[qi]);
		}
	}
	
	function dequeue(quizzer) {
		if (standing.includes(quizzer)) {
			let index = standing.indexOf(quizzer);
			standing.splice(index, 1);
			forfeited.push(quizzer);
		}
		for (qi in quizzers) {
			updateMessage(quizzers[qi]);
		}
		if (standing.length == 0) {
			forfeited = [];
		}
	}
	
	function updateMessage(quizzer) {
		let index = standing.indexOf(quizzer);
		let message = "";
		if (index == 0) {
			message = "Answering";
		} else if (index > 0 && index < 4) {
			message = "#" + index + " in line";
		} else {
			message = "";
		}
		quizzer.lastChild.innerHTML = message;
	}
	
})();