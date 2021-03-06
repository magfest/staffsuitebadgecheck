var status_box	= document.getElementById('response')
var button		= document.getElementById('button')
var input		= document.getElementById('badgeID')
var d_bnum		= document.getElementById('BNUM').children[1]
var d_name		= document.getElementById('NAME').children[1]
var d_btext		= document.getElementById('BTEXT').children[1]
var d_hours		= document.getElementById('HOURS').children
var d_btype		= document.getElementById('BTYPE').children[1]
var d_ribbons	= document.getElementById('RIBBONS').children[1]
var d_sandwich	= document.getElementById('SANDWICH').children[1]
var r_vegan		= document.getElementById('VEGAN').children[1]
var r_pork		= document.getElementById('PORK').children[1]
var r_gluten	= document.getElementById('GLUTEN').children[1]
var r_nuts		= document.getElementById('NUTS').children[1]
var r_freeform	= document.getElementById('FREEFORM').children[1]

function tBox_keydown(element, event) {
	if (event.keyCode == 13) {
		button.click()
		element.select()
	}
}


var socket = new WebSocket("ws://magbadge.kaeva.info:28424/")
socket.onmessage = function(response) {
	data = JSON.parse(response.data)
	if (data.status == 200){
		data = data.result
		// Simple data display
		d_bnum.textContent	= data.badge_num
		d_name.textContent	= data.name
		d_btext.textContent	= data.btext
		d_hours[1].textContent = data.hr_worked
		d_hours[2].textContent = data.hr_total
		d_btype.textContent = data.badge_t
		d_ribbons.textContent = data.ribbons
		d_name.textContent = data.name
		d_sandwich.textContent = data.sandwich

		// Restrictions display
		r_freeform.textContent = data.restrict[0]
		if (data.restrict[1].indexOf('Vegetarian/Vegan') == -1) {
			r_vegan.textContent = "No"
			r_vegan.parentElement.style.backgroundColor = "green"
		} else {
			r_vegan.textContent = "Yes"
			r_vegan.parentElement.style.backgroundColor = "red"
		}
		if (data.restrict[1].indexOf('No pork') == -1) {
			r_pork.textContent = "No"
			r_pork.parentElement.style.backgroundColor = "green"
		} else {
			r_pork.textContent = "Yes"
			r_pork.parentElement.style.backgroundColor = "red"
		}
		if (data.restrict[1].indexOf('No gluten') == -1) {
			r_gluten.textContent = "No"
			r_gluten.parentElement.style.backgroundColor = "green"
		} else {
			r_gluten.textContent = "Yes"
			r_gluten.parentElement.style.backgroundColor = "red"
		}
		if (data.restrict[1].indexOf('No nuts') == -1) {
			r_nuts.textContent = "No"
			r_nuts.parentElement.style.backgroundColor = "green"
		} else {
			r_nuts.textContent = "Yes"
			r_nuts.parentElement.style.backgroundColor = "red"
		}

		// Done all displaying
		if (data.message && data.message != "") {
			status_box.innerHTML = data.message
		} else {
			status_box.innerHTML = "Done"
		}
	} else {
		status_box.innerHTML = "HTTP " + data.status +"<br />"+ data.error
	}
}
socket.onclose = function(event) {
	status_box.innerHTML = "Socket closed, please refresh. Here's some data:<br>" +
						"Close code: " + event.code +
						" | Close clean: " + (event.wasClean ? "Yes" : "No") + "<br>" +
						"Close reason: " + event.reason + "<br>"
	button.disabled = true
}


function sendBadge() {
	var meal_selection = document.getElementsByName('meal')
	var meal_choice = ''
	for (var i = 0; i < meal_selection.length; i++) {
		if (meal_selection[i].checked) {
			meal_choice = meal_selection[i].value
			break
		}
	}
	console.log(meal_choice)
	data = {action	: "query.badge",
			meal	: meal_choice,
			params	: isNaN(input.value) ? input.value : parseInt(input.value)}
	status_box.innerHTML = "Checking badge..."
	socket.send(JSON.stringify(data))
}
button.disabled = false
