//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract tic_tak_toe{
// string private secret_key;
address public owner;
uint256 public game_pot_entry_fee;
// uint platform_fee = 0;
constructor() {
owner=msg.sender;
game_pot_entry_fee = 0.04*10**18;
// secret_key= bytes("tictactoe_with_blockchain");
}
modifier owner_check{
require(msg.sender==owner, "YOU ARE NOT THE OWNER");
_;
}
event pot_entry_fee(address indexed sender,uint value);
event roomLog(string indexed roomid,string[] track);

function pot_amount() external payable {
emit pot_entry_fee(msg.sender,msg.value);
}

function winner_reward(address payable winner)external {
uint player_percentage = game_pot_entry_fee*8/10;
// platform_fee=platform_fee +(game_pot_entry_fee-player_percentage);
winner.transfer(player_percentage);
}

function balance_of_smart_contract() owner_check external view returns (uint){

return (address(this).balance);
}

mapping (uint256=>string[]) internal user;

function add_user_positions(uint256 room_id,string memory positions)public {
// require(user[room_id].length<9, "YOU ARE OUT OF MOVES" ); user[room_id].push(positions); } function get_user_positions(uint256 room_id)public view returns (string[] memory) { return user[room_id]; } }