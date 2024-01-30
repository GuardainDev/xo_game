const ethers = require('ethers');
module.exports = class Ethers {
	constructor(private_key, wallet_address) {
		this.private_key = private_key;
		this.contract_adderess = '0x92B6a68799706BB18A60Dd535301fe99F9829AD2';
		this.wallet_address = wallet_address;
		this.contract_abi = [{ "inputs": [{ "internalType": "uint256", "name": "room_id", "type": "uint256" }, { "internalType": "string", "name": "positions", "type": "string" }], "name": "add_user_positions", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "pot_amount", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "pot_entry_fee", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "roomid", "type": "string" }, { "indexed": false, "internalType": "string[]", "name": "track", "type": "string[]" }], "name": "roomLog", "type": "event" }, { "inputs": [{ "internalType": "address payable", "name": "winner", "type": "address" }], "name": "winner_reward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "balance_of_smart_contract", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "game_pot_entry_fee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "room_id", "type": "uint256" }], "name": "get_user_positions", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
		this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/5549602c545c40eb9a36c7748588fd3c');
		this.wallet = new ethers.Wallet(this.private_key, this.provider);
		this.contract = new ethers.Contract(this.contract_adderess, this.contract_abi, this.wallet);
		this.balance = 0;
	}

	async get_balance() {
		try {
			const balance_wei = await this.provider.getBalance(this.wallet_address);
			const balanceEther = ethers.formatEther(balance_wei);
			return balanceEther;
		} catch (err) {
			console.log("Balance Check Error -> ", err);
		}

	}
	async send_eth_particular_address(send_address, amount) {
		try {

			const gas_price = await provider.send('eth_gasPrice', []);
			const transaction = {
				to: send_address,
				value: ethers.parseEther(amount),
				gasPrice: gas_price,
			};
			const sentTransaction = await this.wallet.sendTransaction(transaction);//.sendTransaction(transaction);
			return sentTransaction;
		}
		catch (err) {
			console.log("Send Eth Error -> ", err);
		}
	}

	async sendEthToContract(amount) {
		try {
			const amountToSend = ethers.parseEther(amount);
			const transaction = await this.contract.pot_amount({
				value: amountToSend,
			});
			return transaction;
		} catch (error) {
			console.error('Error:', error);
		}
	}

}
