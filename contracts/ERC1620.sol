// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC1620.sol";
import "./interfaces/IERC20.sol";

contract ERC1620 is IMultiStream{

    uint public streamid = 0;
    IERC20 public token;

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

    struct NetFlowRate{
        uint Inflow;
        uint Outflow;
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
    mapping(address => NetFlowRate) public netFlowRates;
    mapping(address => uint) public vaultBalanceOf;

    function depositToken(address _token, uint _amount) public returns(bool){
        token = IERC20(_token);
        token.transferFrom(msg.sender, address(this), _amount);
        vaultBalanceOf[_token] += _amount;
        return true;
    }

    function getNetFlowRate(address _address) external view returns(bool){
        uint inflow = netFlowRates[_address].Inflow;
        uint outflow = netFlowRates[_address].Outflow;
        if(inflow >= outflow){
            return true;
        }
        else{
            return false;
        }
    }

    function createStream(address _token, address _sender, address _receiver, uint _amount, uint _rate, uint _timestamp) external returns(bool){
        token = IERC20(_token);
        require(_token != address(0), "ERC1620: token address cannot be zero");
        require(msg.sender != address(0), "ERC1620: sender address cannot be zero");
        //require(msg.sender == _sender, "ERC1620: sender address should be the same as the msg.sender");
        require(_receiver != address(0), "ERC1620: receiver address cannot be zero");
        require(_amount > 0, "ERC1620: amount cannot be zero");
        require(_rate > 0, "ERC1620: rate cannot be zero");
        require(_timestamp > 0, "ERC1620: timestamp cannot be zero");
        require(netFlowRates[_sender].Inflow >= netFlowRates[_sender].Outflow, "ERC1620: sender should have a positive net flow rate");
        streamid++;
        streams[streamid]=Stream(streamid,_token,msg.sender,_receiver,_amount,_rate,_timestamp,true);
        netFlowRates[_receiver].Inflow += _rate;
        netFlowRates[_sender].Outflow += _rate;
        emit  StreamCreated(streamid, _token, msg.sender, _receiver, _amount, _rate, _timestamp, true);
        return true;
    }

    function modifyStream(uint _id, uint _amount, uint _timestamp)external returns(bool){
        require(streams[_id].id != 0, "ERC1620: stream does not exist");
        
        require(streams[_id].sender == msg.sender, "ERC1620: only stream owner can modify");
        require(_id <= streamid, "ERC1620: invalid stream id");
        require(_amount > 0 && _timestamp > 0, "ERC1620: amount and timestamp should be greater than zero");
        require(streams[_id].status == true, "ERC1620: stream is already stopped");
        streams[_id].amount=_amount;
        streams[_id].timestamp=_timestamp;
        return true;
    }

    function stopStream(uint _id) external returns(bool){
        require(streams[_id].id != 0, "ERC1620: stream does not exist");
        require(streams[_id].sender == msg.sender, "ERC1620: only stream owner can stop");
        require(_id <= streamid, "ERC1620: invalid stream id");
        require(streams[_id].status == true, "ERC1620: stream is already stopped");
        streams[_id].status = false;
        streams[_id].rate = 0;
        return true;
    }

    function deleteStream(uint _id)external returns (bool){
        streams[_id].status = false;
        streams[_id].rate=0;
        return true;
    }

    function getStreams() external view returns(uint){
        return streamid;
    }

    function getStreambyId(uint _id) external view returns(Stream memory){
        return streams[_id];
    }

    function getVaultBalance(address _token) external view returns(uint){
        return vaultBalanceOf[_token];
    }

}