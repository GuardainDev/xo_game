
const { ethers } = require('ethers');

// module.exports =
class Ethers {
	constructor() {
		this.provider = 0;
		this.signer;
		// Replace with your smart contract address
		this.contractAddress = '0xCd950103351D0386e876F8145D19973bB3A432f7';
		this.address = '';
		this.wallet = '';
		// Replace with your smart contract ABI
		this.contractABI = [{ "inputs": [{ "internalType": "uint256", "name": "room_id", "type": "uint256" }, { "internalType": "string", "name": "positions", "type": "string" }], "name": "add_user_positions", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "room_id", "type": "uint256" }], "name": "get_user_positions", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }]; // Your contract ABI

		// Create a contract instance



	}



	async initApp() {
		// Check if MetaMask is installed

		// Initialize ethers provider and signer with MetaMask
		// this.provider = new this.ethers.providers.Web3Provider(window.ethereum);

		const privateKey = 'b0829eb44538bcef3a727c2ef1940f9da7b50696daf040b7ee2d1f47de13a703';
		const infuraApiKey = '8bbff778f93a47c08efe13de46686757';

		this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/5549602c545c40eb9a36c7748588fd3c`);

		this.wallet = new ethers.Wallet(privateKey, this.provider);
		this.address = this.wallet.address;
		console.log("Address::", this.address);
		this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.address);

		this.signer = this.wallet.connect(this.provider);
	}
	async callContractFunction(roomid, write_value) {
		try {
			const result = await this.contract.connect(this.signer).add_user_positions(roomid, write_value); // Replace with your function name
			console.log('Result:', result);
		} catch (error) {
			console.error('Error calling contract function:', error.message);
		}
	}

	async getPositions(value) {
		try {
			const result = await this.contract.connect(this.signer).get_user_positions(value); // 
			return result;
		} catch (error) {
			console.error('Error calling contract function:', error.message);
		}
	}


	async getBalance() {
		try {
			const balanceWei = await this.provider.getBalance(this.address);
			const balanceEther = ethers.formatEther(balanceWei);

			console.log(`Balance of address ${this.address}: ${balanceEther} ETH`);
			return balanceEther;
		} catch (error) {
			console.error('Error getting balance:', error);
		}
	}

}




(async () => {
	const ethers_check = new Ethers();
	await ethers_check.initApp();
	const result = await ethers_check.contract['getPositions'](4619);

	console.log(`Function '${functionName}' result:`, result);
	// let data = await ethers_check.getPositions(4619)
	// console.log("data::", data);
	// let balance = await ethers_check.getBalance();
	// console.log("Balance :::", balance);
})()



async function deductEther() {
	const privateKey = document.getElementById('privateKey').value.trim();
	const contractAddress = document.getElementById('contractAddress').value.trim();
	const amountToDeduct = document.getElementById('amountToDeduct').value.trim();

	try {
		const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
		const wallet = new ethers.Wallet(privateKey, provider);

		const contract = new ethers.Contract(
			contractAddress,
			['function deductEther(uint256 amount) public'],
			wallet
		);

		const transaction = await contract.deductEther(ethers.utils.parseEther(amountToDeduct));
		await transaction.wait();
		alert(`Deducted ${amountToDeduct} ETH. Transaction hash: ${transaction.hash}`);
	} catch (error) {
		alert(`Error deducting Ether: ${error.message}`);
	}
}