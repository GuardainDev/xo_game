const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridSize = 100;
const audio = new Audio('assets/sounds/bg_music.mp3');
const grid_count = Math.floor(canvas.height / gridSize) * Math.floor(canvas.width / gridSize);
var selectedImageId;
var opp_image_id;
drawGrid();
// for (let i = 1; i < 7; i++) {
// 	addAvatar(i, "Avatar " + i);
// }
var currentPlayer = "O";
let availables = {
	0: undefined,
	1: undefined,
	2: undefined,
	3: undefined,
	4: undefined,
	5: undefined,
	6: undefined,
	7: undefined,
	8: undefined,
}


var players = {};
var provider;
var signer;
var userAddress;
// initApp().then(async (value) => {
// 	await sleep(2000);
// 	$('#load_id').text("Transaction Started");
// });
async function initApp() {
	// Check if MetaMask is installed
	if (typeof window.ethereum !== 'undefined') {
		console.log("window etherum::", window.ethereum);
		// Initialize ethers provider and signer with MetaMask
		provider = new ethers.providers.Web3Provider(window.ethereum);
		signer = provider.getSigner();
		console.log("Signer::", signer);
		// Request user permission to connect to MetaMask
		try {
			//   await window.ethereum.request({ method: 'eth_requestAccounts' });
			let accounts = await ethereum.request({ method: 'eth_requestAccounts' });

			// const userAddress = accounts[0];
			userAddress = accounts[0];
			console.log('Connected to MetaMask::', userAddress);
			let balance = await ethereum.request({ method: 'eth_getBalance', params: [userAddress, 'latest'] });

			var formattedBalance = parseInt(balance, 16).toFixed(10);
			formattedBalance = formattedBalance / 10 ** 18;
			document.getElementById('balance').innerHTML = `<button id="eth_blnce" type="button" class="btn btn-success">
			Eth ${Number(formattedBalance).toFixed(5)}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
				viewBox="0 0 256 417">
				<path fill="#343434" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z" />
				<path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
				<path fill="#3C3C3B"
					d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.601l128.038-180.32z" />
				<path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
				<path fill="#141414" d="m127.961 287.958l127.96-75.637l-127.96-58.162z" />
				<path fill="#393939" d="m.001 212.321l127.96 75.637V154.159z" />
			</svg>
		</button>`
			// "Balance " + Number(formattedBalance).toFixed(4);
			console.log("Current Balance :::", formattedBalance);
			checkNetwork(); // Check the network after connecting
		} catch (error) {
			console.error('Error connecting to MetaMask:', error.message);
		}

		// Listen for network changes
		window.ethereum.on('networkChanged', (newNetwork, oldNetwork) => {
			console.log('Network changed:', newNetwork);
			checkNetwork();
		});
	} else {
		alert('Please install MetaMask to use this application');
	}
	return true;
}

async function checkNetwork() {
	if (!provider) {
		console.error('Provider is not initialized');
		return;
	}

	// Check if the user is connected to the Ethereum network
	try {
		const network = await provider.getNetwork();
		console.log(network);
		if (network.chainId !== 1) {
			// alert('Please connect to the Ethereum Mainnet');
		} else {
			console.log('Connected to Ethereum');
		}
	} catch (error) {
		console.error('Error checking network:', error.message);
	}
}

// Replace with your smart contract address
const contractAddress = '0x92B6a68799706BB18A60Dd535301fe99F9829AD2';

// Replace with your smart contract ABI
const contractABI = [{ "inputs": [{ "internalType": "uint256", "name": "room_id", "type": "uint256" }, { "internalType": "string", "name": "positions", "type": "string" }], "name": "add_user_positions", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "pot_amount", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "pot_entry_fee", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "roomid", "type": "string" }, { "indexed": false, "internalType": "string[]", "name": "track", "type": "string[]" }], "name": "roomLog", "type": "event" }, { "inputs": [{ "internalType": "address payable", "name": "winner", "type": "address" }], "name": "winner_reward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "balance_of_smart_contract", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "game_pot_entry_fee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "room_id", "type": "uint256" }], "name": "get_user_positions", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]; // Your contract ABI

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);





const urlParams = new URLSearchParams(window.location.search);
const user_id = sessionStorage.getItem("user_id");//urlParams.get('id');
console.log('user id:::', user_id);
//"wss://xo-game-ecqy.onrender.com"
const socket = io.connect("ws://192.168.18.148:5000", { extraHeaders: { user_id: user_id } });
// var player_name = prompt("Enter name ");

var player_id = '';
var roomid = '';

// send_transaction().then(() => {


// });
// initApp();
// send_transaction().then(() => {

socket.emit("register", userAddress, async function (id) {
	player_id = id;
	console.log("register::")
	const overlay = document.getElementById('details');
	await sleep(2000);
	$('#load_id').text("Waiting for Opponent");
	// overlay.style.display = 'none';
	// document.getElementById('head').style.display = 'none';
});
// })


async function send_name() {
	let name = document.getElementById('name').value;
	let check_box = document.getElementById('exampleCheck1');

	if (check_box.checked && name && selectedImageId) {
		//openSearch("flex");

		playSound('play.wav')

		socket.emit("register", userAddress, function (id) {
			player_id = id;
			const overlay = document.getElementById('details');
			overlay.style.display = 'none';
			// document.getElementById('head').style.display = 'none';
		});

	} else {
		playSound('notification.wav');
		alert('Please Enter name and permission and Avatar');
	}
}

var lock = 'Y';
socket.on('match_found', async function (value) {
	console.log("id::::", value);
	currentPlayer = value.symbol;
	await sleep(2000);
	$('#load_id').text("Match Found");
	roomid = value.roomid;
	await match_found();
	// openSearch('none');


	await sleep(500);
	socket.emit('match_found', 1);
	selectedImageId = value.avatar_id;
	$("#player1").append('<div id="playerContainer"><span > Your Symbol ' + currentPlayer + '</span> <div class="profilePicture" id=profilePicture_' + value.avatar_id + '> <img src=assets/images/achivement/' + value.avatar_id + '.png alt = "Profile Picture" > </div> <div id="playerName" style="color:white">' + value.name + ' (You)</div> </div > ');
	$('#left_player').text(currentPlayer);
	if (currentPlayer === "X") {
		lock = "N";
		await sleep(1000);
		const turn_txt = document.getElementById('turn');
		turn_txt.style.display = 'block';
	}
	else {
		await sleep(1000);
		const op_turn = document.getElementById('turn');
		op_turn.className = "animate__animated animate__backInRight";
		op_turn.style.display = "block";
		op_turn.textContent = "OPPONENT TURN ";

		op_turn.style.color = "red";
	}


});


socket.on('spawn', function (value) {
	console.log("Oppenent joined", value);
	opp_image_id = value.avatar_id;
	$('#right_player').text(value.symbol);
	$("#player2").append('<div id="playerContainer"> <div class="profilePicture" id=profilePicture_' + value.avatar_id + '> <img src=assets/images/achivement/' + value.avatar_id + '.png alt = "Profile Picture" > </div> <div id="playerName" style="color:white">' + value.name + '</div> </div > ');

})





canvas.addEventListener('click', async function (e) {
	console.log("Lock state::", lock);
	const mouseX = e.clientX - canvas.getBoundingClientRect().left;
	const mouseY = e.clientY - canvas.getBoundingClientRect().top;

	// Get the clicked grid cell's center point
	const { x, y } = getGridCenterPoint(mouseX, mouseY);

	let cell = get_grid(x, y);
	if (lock === "N" && availables[cell] === undefined) {
		lock = "Y";
		console.log("Clieck Success:::");
		const playerContainer = document.getElementById('profilePicture_' + selectedImageId);
		console.log(playerContainer);
		if (playerContainer) {
			playerContainer.classList.remove('clicked');
		}

		// const mouseX = e.clientX - canvas.getBoundingClientRect().left;
		// const mouseY = e.clientY - canvas.getBoundingClientRect().top;

		// // Get the clicked grid cell's center point
		// const { x, y } = getGridCenterPoint(mouseX, mouseY);

		// let cell = get_grid(x, y);

		// if (availables[cell] === undefined) {
		drawSymbol(currentPlayer, x, y);
		playSound(currentPlayer + ".wav");
		console.log(roomid);
		let { row, column } = get_rowand_column(x, y);
		console.log("row ::", row, column, currentPlayer);

		availables[cell] = currentPlayer;
		socket.emit("draw_symbols", x, y);
		const turn_txt = document.getElementById('turn');
		turn_txt.style.display = 'none';

		const op_turn = document.getElementById('turn');
		op_turn.className = "animate__animated animate__backInRight";
		op_turn.style.display = "block";
		op_turn.textContent = "OPPONENT TURN ";

		op_turn.style.color = "red";

		// }

	}



});


function get_rowand_column(x, y) {
	const column = Math.floor(x / gridSize);
	const row = Math.floor(y / gridSize);
	return { row, column };
}



socket.on('draw_symbol', function (x, y, symbol) {
	console.log("draw symbo listen ", lock)
	lock = "N";
	animateCard(selectedImageId);

	const turn_txt = document.getElementById('turn');
	turn_txt.style.display = 'none';
	let my_turn = document.getElementById('turn');
	my_turn.className = "animate__animated animate__backInLeft";
	my_turn.style.display = "block";
	my_turn.textContent = "YOUR TURN ";
	my_turn.style.color = "rgb(92, 205, 40)";
	// showNotification();
	playSound(symbol + ".wav");
	let cell = get_grid(x, y);
	if (availables[cell] === undefined) {
		// Draw "X" or "O" at the center point
		availables[cell] = symbol;
		socket.emit("draw_symbol", x, y);
		drawSymbol(symbol, x, y);
	}
});

socket.on('result', function (id, result, board_data, symbol, points) {

	console.log(result);
	const playerContainer = document.getElementById('profilePicture_' + selectedImageId);
	console.log(playerContainer);
	if (playerContainer) {
		playerContainer.classList.remove('clicked');
	}
	const turn_txt = document.getElementById('turn');
	turn_txt.style.display = 'none';
	showPopup(result, id, board_data, symbol, points);
});

socket.on('draw', function (value, points) {
	if (value === 'draw') {
		const turn_txt = document.getElementById('turn');
		turn_txt.style.display = 'none';
		showPopup("Match Ends in a Tie!", 'draw', '', '', points);
	}
})




function sleep(time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(), time);
	});
}






async function match_found() {
	// $('.preloader').css("display", "none")
	$('.preloader').fadeOut(1000);
	drawGrid();
	document.getElementById('game').style.display = "block";
	document.getElementById('login').style.display = "none";
	document.body.style.display = 'block';
	document.body.style['align-item'] = '';
	document.body.style['justify-content'] = '';

	document.getElementById('canvas-id').style.display = "flex";
}




function openSearch(status) {

	const overlay = document.getElementById('searchOverlay');
	overlay.style.display = status;
}






function getGridCenterPoint(mouseX, mouseY) {
	// Calculate the row and column indices of the clicked cell
	const colIndex = Math.floor(mouseX / gridSize);
	const rowIndex = Math.floor(mouseY / gridSize);

	// Calculate the center point of the clicked cell
	const centerX = colIndex * gridSize + gridSize / 2;
	const centerY = rowIndex * gridSize + gridSize / 2;

	return { x: centerX, y: centerY };
}
function drawSymbol(symbol, x, y) {

	ctx.font = '40px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.fillStyle = symbol === 'X' ? '#f9ff08' : '#f70000';
	ctx.fillText(symbol, x, y);
}



function drawWinningCell(x, y, width, height) {


	ctx.fillStyle = "#03df03";
	ctx.fillRect(x, y, width, height);
	ctx.strokeStyle = '#fff';
	ctx.lineWidth = 2;

	for (let i = 1; i < 3; i++) {
		ctx.beginPath();
		ctx.moveTo(i * gridSize, 0);
		ctx.lineTo(i * gridSize, canvas.height);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0, i * gridSize);
		ctx.lineTo(canvas.width, i * gridSize);
		ctx.stroke();
	}
}

function drawWinningSymbol(x, y, symbol) {

	ctx.fillStyle = "#fff";
	ctx.fillText(symbol, x, y);
}


function drawGrid() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = '#fff';
	ctx.lineWidth = 2;

	for (let i = 1; i < 3; i++) {
		ctx.beginPath();
		ctx.moveTo(i * gridSize, 0);
		ctx.lineTo(i * gridSize, canvas.height);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0, i * gridSize);
		ctx.lineTo(canvas.width, i * gridSize);
		ctx.stroke();
	}

	ctx.font = '40px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
}
function drawGrid1() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#121212';
	ctx.lineWidth = 1;

	// Vertical lines
	for (let x = gridSize; x < canvas.width; x += gridSize) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
	}

	// Horizontal lines
	for (let y = gridSize; y < canvas.height; y += gridSize) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
	}
}


function get_grid(x, y) {
	const col = Math.floor(x / gridSize);
	const row = Math.floor(y / gridSize);
	const num_cols = canvas.width / gridSize; // get number of columns
	let cell_index = row * num_cols + col;
	if (cell_index === grid_count) {
		cell_index = grid_count - 1;
	}
	return cell_index;
}



async function showPopup(winner, id, board_data, symbol, points) {
	const winnerPopup = document.getElementById('winnerPopup');
	const winnerText = document.getElementById('winnerText');
	const winner_header = document.getElementById('win-pop');
	const points_tag = document.getElementById('points')
	let win_txt = `${winner} wins!`;
	let header = 'You Win!';
	let point_txt = "POINT 0";

	if (id === 'draw') {
		header = " TIE ";
		win_txt = ` ${winner}`;
		point_txt = points + " POINT EARNED";
	}
	if (id !== 'draw') {
		let { row, col } = getWinningIndices(board_data);
		console.log("symbol::", symbol);
		for (let i = 0; i < row.length; i++) {
			const x = col[i] * gridSize + gridSize / 2;
			const y = row[i] * gridSize + gridSize / 2;
			drawWinningCell(col[i] * gridSize, row[i] * gridSize, gridSize, gridSize);


			console.log("Winniing:::", x, y, symbol);
			drawWinningSymbol(x, y, symbol);
		}
	}

	if (player_id === id) {
		playSound('match.wav')
		await sleep(1000);

		win_txt = ` You win the Match!`;
		point_txt = points + " POINTS EARNED";
		let interval = setInterval(() => {
			confetti({
				particleCount: 500,
				spread: 2000,
				startVelocity: 15,
				scalar: 0.9,
				ticks: 120
			});
		}, 800);
		setTimeout(() => {
			clearInterval(interval);
		}, 5000)

	}
	else if (id !== 'draw') {
		playSound('lose.mp3');
		header = 'You Lose';
		point_txt = "0 POINT EARNED";
	}
	winner_header.textContent = header;
	winnerText.textContent = win_txt;
	points_tag.textContent = point_txt;
	winnerPopup.style.display = 'block';
	playSound('win.mp3')
}

// GET ROW AND COLUMN WINNING INDECIES
function getWinningIndices(board) {
	// Check rows
	let result;
	for (let row = 0; row < 3; row++) {
		if (
			board[row][0] !== '' &&
			board[row][0] === board[row][1] &&
			board[row][0] === board[row][2]
		) {
			result = { type: 'row', indices: [row, 0, row, 1, row, 2] };
		}
	}

	// Check columns
	for (let col = 0; col < 3; col++) {
		if (
			board[0][col] !== '' &&
			board[0][col] === board[1][col] &&
			board[0][col] === board[2][col]
		) {
			result = { type: 'column', indices: [0, col, 1, col, 2, col] };
		}
	}

	// Check diagonals
	if (
		board[0][0] !== '' &&
		board[0][0] === board[1][1] &&
		board[0][0] === board[2][2]
	) {
		result = { type: 'diagonal', indices: [0, 0, 1, 1, 2, 2] };
	}

	if (
		board[0][2] !== '' &&
		board[0][2] === board[1][1] &&
		board[0][2] === board[2][0]
	) {
		result = { type: 'diagonal', indices: [0, 2, 1, 1, 2, 0] };
	}
	const rowIndices = [];
	const colIndices = [];

	// Separate row and column indices
	for (let i = 0; i < result.indices.length; i += 2) {
		rowIndices.push(result.indices[i]);
		colIndices.push(result.indices[i + 1]);
	}
	// No winning combination
	return { row: rowIndices, col: colIndices };
}





function closePopup() {
	const winnerPopup = document.getElementById('winnerPopup');
	const overlay = document.getElementById('overlay');

	winnerPopup.style.display = 'none';
	overlay.style.display = 'none';
	window.location.href = '/index.html';
}



async function showNotification() {
	document.getElementById("you-turn").style.display = "block";
	$("#you-turn")
		.fadeIn()
		.css({ right: 0, position: "absolute" })
		.animate({ left: 500 }, 500, function () {
			// $('#selector').delay(5000).fadeOut('slow');
		});
	await sleep(1000);
	hideNotification();
}

function hideNotification() {
	$("#you-turn").fadeOut("slow");
	document.getElementById("you-turn").style.display = "none";
	document.getElementById("you-turn").style.position = null;
	document.getElementById("you-turn").style.left = null;
}




// Interact with your contract (example: call a read-only function)
async function callContractFunction(roomid, write_value) {
	try {
		const result = await contract.connect(signer).add_user_positions(roomid, write_value); // Replace with your function name
		console.log('Result:', result);
	} catch (error) {
		console.error('Error calling contract function:', error.message);
	}
}

async function getPositions(value) {
	try {
		const result = await contract.connect(signer).get_user_positions(value); // Replace with your function name
		console.log('Result:', result);
	} catch (error) {
		console.error('Error calling contract function:', error.message);
	}
}



async function send_transaction() {
	// Sending 0.1 ether as an example
	// $('.preloader').css("display", "block");
	$('.preloader').fadeIn(1000);
	let state = false;
	try {

		const amountToSend = ethers.utils.parseEther('0.02');
		const transaction = await contract.pot_amount({
			value: amountToSend,
		});
		await sleep(2000);
		$('#load_id').text("Transaction Pending");
		await sleep(1000);
		$('#load_id').text('Buckle up for the ultimate brain showdown! ⌛️🔍 Currently seeking the perfect opponent for your Tic-Tac-Toe skills. Stay tuned!')
		console.log('Transaction Hash:', transaction.hash);

		// Wait for the transaction to be mined
		await transaction.wait();
		await sleep(2000);
		$('#load_id').text("Transaction Confirmed");
		if (transaction.hash) {
			state = true;
		}
		console.log('Transaction mined!');
	} catch (error) {
		console.error('Error:', error.message);
		window.location.href = '/index.html';
	}
	return state;
}



async function winner_reward(rewarded_id) {
	try {
		const result = await contract.connect(signer).winner_reward(rewarded_id); // Replace with your function name
		console.log('Result:', result);
	} catch (error) {
		console.error('Error calling contract function:', error.message);
	}
}




function addAvatar(id, alt) {
	let src = 'assets/images/achivement/' + id + ".png";
	const avatarContainer = document.getElementById('avatarContainer');



	// Create a new avatar element
	var newAvatar = document.createElement('div');
	newAvatar.className = 'avatar';
	newAvatar.onclick = function () { selectAvatar(this) };

	// Create a new image element
	var newImage = document.createElement('img');
	newImage.src = src;
	newImage.alt = alt;
	newImage.id = id;
	// Append the new image to the new avatar
	newAvatar.appendChild(newImage);

	// Append the new avatar to the avatar container
	avatarContainer.appendChild(newAvatar);
}


function selectAvatar(selectedAvatar_id) {
	const avatars = document.querySelectorAll('.avatar');

	avatars.forEach(avatar => {
		avatar.classList.remove('selected');
	});

	selectedAvatar_id.classList.add('selected');
	selectedImageId = selectedAvatar_id.querySelector('img').id;
	playSound('btn_click.wav')

}


function animateCard(id) {
	const playerContainer = document.getElementById('profilePicture_' + id);
	console.log("aniamte car:::", playerContainer);
	if (playerContainer) {
		playerContainer.classList.add('clicked');
	}
}

function off_animateCard(id) {
	const playerContainer = document.getElementById('profilePicture_' + id);
	playerContainer.classList.remove('clicked');

}



playbg()
function playbg(sound) {

	audio.loop = true;
	audio.muted = false;

	audio.play();
}

function sound_off() {
	console.log('sound off');
	let ico = document.getElementById('sound');

	audio.muted = true;
	ico.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50"  height="50" fill="currentColor" onclick="sound_on()"
	class="bi bi-volume-mute" viewBox="0 0 16 16">
	<path
		d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
	</svg>`;


}




for (let i = 1; i < 7; i++) {
	addAvatar1(i, 'emoji-' + i)
}


function seeMore() {
	const text = document.getElementById('emojis')
	// const text2 = document.getElementById('website-info-technical')
	text.classList.toggle("show")
	// text2.classList.toggle("show")
}

function addAvatar1(id, alt) {
	let src = 'assets/emojis/e_' + id + ".png";
	const avatarContainer = document.getElementById('text');



	// Create a new avatar element
	// var newAvatar = document.createElement('div');
	// newAvatar.className = 'animate__animated emoji';

	// newAvatar.onclick = function () { selectAvatar(this) };

	// Create a new image element
	var newImage = document.createElement('img');
	newImage.src = src;
	newImage.alt = alt;
	newImage.id = id;
	newImage.onclick = function () { show_emoji_mine(id) };
	// newImage.onclick = show_emoji(id);
	newImage.height = 10;
	newImage.className = "menu-item";
	newImage.width = 10;
	// Append the new image to the new avatar
	// newAvatar.appendChild(newImage);

	// Append the new avatar to the avatar container
	avatarContainer.appendChild(newImage);
}


socket.on("emoji", function (id) {
	console.log("emoji:::::", id);
	show_emoji_opponent(id);
})

function show_emoji_opponent(id) {
	emoji_sound(id);
	let src = 'assets/emojis/e_' + id + ".png";
	$("#emoji_slot_2").attr("src", src);
	$("#emoji_slot_2").addClass("animate__animated animate__wobble");

	$("#emoji_slot_2").css("visibility", "visible");

	setTimeout(() => {
		$("#emoji_slot_2").removeClass("animate__animated animate__wobble");
		$("#emoji_slot_2").css("visibility", "hidden");
	}, 2000)
}
function show_emoji_mine(id) {
	emoji_sound(id);
	console.log("emoji emit")
	socket.emit("emoji", id);
	const yourCheckbox = document.getElementById('menu-open');
	yourCheckbox.checked = false;
	$(".emoji").css("pointer-events", "none");

	let src = 'assets/emojis/e_' + id + ".png";
	$("#emoji_slot").attr("src", src);
	$("#emoji_slot").addClass("animate__animated animate__wobble");

	$("#emoji_slot").css("visibility", "visible");
	setTimeout(() => {
		$("#emoji_slot").removeClass("animate__animated animate__wobble");
		$("#emoji_slot").css("visibility", "hidden");
		// $("#emojis").css("visibility", "visible");
		// $("#emojis").attr("disabled", false);
		$(".emoji").css("pointer-events", "unset");
	}, 2000)
}



function sound_on() {
	console.log('sound on:::');
	let ico = document.getElementById('sound');
	// playbg()
	ico.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" onclick="sound_off()"
	fill="currentColor" class="bi bi-volume-up" viewBox="0 0 16 16" id="on">
	<path
		d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
	<path
		d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89z" />
	<path
		d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11" />
	</svg>`;
	audio.muted = false;
}

function playSound(file_name) {
	const audio = new Audio('assets/sounds/' + file_name); // Replace with the path to your audio file
	audio.play();
}



function emoji_sound(id) {
	const audio = new Audio('assets/sounds/Emoji_' + id + '.ogg');
	audio.play();
}