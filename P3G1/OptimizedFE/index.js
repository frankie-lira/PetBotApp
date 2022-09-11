document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("input");
    inputField.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        let input = inputField.value;
        inputField.value = "";
        output(input);
      }
    });
  });
  
  function output(input) {
    let product;
  
    // Regex remove non word/space chars
    // Trim trailing whitespce
    // Remove digits - not sure if this is best
    // But solves problem of entering something like 'hi1'
  
    let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
    text = text
      .replace(/ a /g, " ")   // 'tell me a story' -> 'tell me story'
      .replace(/i feel /g, "")
      .replace(/whats/g, "what is")
      .replace(/please /g, "")
      .replace(/ please/g, "")
      .replace(/r u/g, "are you");
  
    if (compare(prompts, replies, text)) { 
      // Search for exact match in `prompts`
      product = compare(prompts, replies, text);
    } else if (text.match(/thank/gi)) {
      product = "You're welcome!"
    } else if (text.match(/(corona|covid|virus)/gi)) {
      // If no match, check if message contains `coronavirus`
      product = coronavirus[Math.floor(Math.random() * coronavirus.length)];
    } else {
      // If all else fails: random alternative
      product = alternative[Math.floor(Math.random() * alternative.length)];
    }
  
    // Update DOM
    addChat(input, product);
  }
  
  function compare(promptsArray, repliesArray, string) {
    let reply;
    let replyFound = false;
    for (let x = 0; x < promptsArray.length; x++) {
      for (let y = 0; y < promptsArray[x].length; y++) {
        if (promptsArray[x][y] === string) {
          let replies = repliesArray[x];
          reply = replies[Math.floor(Math.random() * replies.length)];
          // Call my REST API with string
          getResponse(string);
          replyFound = true;
          // Stop inner loop when input value matches prompts
          break;
        }
      }
      if (replyFound) {
        // Stop outer loop when reply is found instead of interating through the entire array
        break;
      }
    }
    return reply;
  }
  
  function addChat(input, product) {
    const messagesContainer = document.getElementById("messages");
  
    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.className = "user response";
    userDiv.innerHTML = `<img src="Avatar.png" class="avatar"><span>${input}</span>`;
    messagesContainer.appendChild(userDiv);
  
    let botDiv = document.createElement("div");
    let botImg = document.createElement("img");
    let botText = document.createElement("span");
    botDiv.id = "bot";
    botImg.src = "pup.png";
    botImg.className = "avatar";
    botDiv.className = "bot response";
    botText.innerText = "Typing...";
    botDiv.appendChild(botText);
    botDiv.appendChild(botImg);
    messagesContainer.appendChild(botDiv);
    // Keep messages at most recent
    messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
  
    // Fake delay to seem "real"
    setTimeout(() => {
      botText.innerText = `${product}`;
      textToSpeech(product)
    }, 2000
    )
  
  }

  /*
  function viewStudent(fname, lname) {
	const xhttp = new XMLHttpRequest();
	url = "https://amhep.pythonanywhere.com/grades/" + fname;
	if (lname ) {
		url = url + "%20" + lname;
	}
	//alert(url);
	// https://amhep.pythonanywhere.com/grades/Joe%20Biden%20Jr 
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("ans").innerHTML = this.responseText;
		}
	}
	xhttp.open("GET", url);
	xhttp.send();
}
*/

function getResponse(keyWrd) {
	const xhttp = new XMLHttpRequest();
	//url = "https://amhep.pythonanywhere.com/grades/" + fname;
  url = "http://127.0.0.1:5000/get?msg=" + keyWrd
	
  /*if (lname ) {
		url = url + "%20" + lname;
	}
  */

	alert(url);
	// https://amhep.pythonanywhere.com/grades/Joe%20Biden%20Jr 
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			//document.getElementById("ans").innerHTML = this.responseText;
      alert(this.responseText)
		}
	}
	xhttp.open("GET", url);
	xhttp.send();
}
