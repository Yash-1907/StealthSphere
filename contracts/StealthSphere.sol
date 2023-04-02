// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract StealthSphere {
    mapping(address => string) public addressToCid;
    mapping(address => address[]) public contacts;
    mapping(address => mapping(address => string)) public contactAlias;
    //mapping(address => mapping(address => uint)) private channelId;
    mapping(address => mapping(address => string[])) public messages;

    function generateKeys(string memory cid) public {
        addressToCid[msg.sender] = cid;
    }

    function addContact(address contact) public {
        contacts[msg.sender].push(contact);
        contacts[contact].push(msg.sender);
    }

    function changeAlias(address contact, string memory name) public {}

    function sendMessage(
        address receiver,
        string memory messageReceiver,
        string memory messageSender
    ) public {
        messages[msg.sender][receiver].push(messageSender);
        messages[receiver][msg.sender].push(messageReceiver);
    }

    function getContacts(address user) public view returns (address[] memory) {
        return contacts[user];
    }

    function getCid(address user) public view returns (string memory) {
        return addressToCid[user];
    }

    function getMessages(
        address user0,
        address user1
    ) public view returns (string[] memory) {
        return messages[user0][user1];
    }

    function getMessagesLength(
        address user0,
        address user1
    ) public view returns (uint256) {
        return messages[user0][user1].length;
    }
}
