// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC1620.sol";

contract ERC1620 is IMultiStream{

    uint public streamid;

    struct Stream{
        uint id;
        address token;
        address sender;
        address receiver;
        uint amount;
        uint rate;
        uint timestamp;
        bool status;
    }

    event StreamCreated(
        uint id,
        address token,
        address sender,
        address receiver,
        uint amount,
        uint rate,
        uint timestamp,
        bool status
    );

    mapping(uint => Stream) public streams;

    function createStream(uint _id, address _token, address _sender, address _receiver, uint _amount, uint _rate, uint _timestamp) external returns(bool){
        streams[_id]=Stream(_id,_token,_sender,_receiver,_amount,_rate,_timestamp,true);
        emit  StreamCreated(_id, _token, _sender, _receiver, _amount, _rate, _timestamp, true);
        return true;
    }

    function modifyStream(uint _id, uint _amount, uint _timestamp)external returns(bool){
        streams[_id].amount=_amount;
        streams[_id].timestamp=_timestamp;
        return true;
    }

    function deleteStream(uint _id)external returns (bool){
        streams[_id].status = false;
        streams[_id].rate=0;
        return true;
    }


}