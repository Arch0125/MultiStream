//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

/**
* @dev interface for ERC20 native streams compatible with smart contract wallets.
*/

interface IMultiStream {
    /*
    * @dev the `token` should contain the address of the token to be streamed
    * ERC20 spent has to be approved before/while creating the stream
    * the tokens are locked in the contract when the stream is created
    *
    * @return boolean whether the stream creation was successful or not
    *
    * emits the event {StreamCreated} if transaction is successful
    */
    function createStream(address _token, address _sender, address _receiver, uint _amount, uint _rate, uint _timestamp) external returns(bool);

    /*
    * @dev this function will take amount/timestamp or both to change the current rate
    * the stream is identified the unique stream id
    * modification can be done only by the stream owner
    *
    * @return boolean whether modification was successful or not
    *
    *emits the event {StreamModified} if the transaction is successful
    */
    function modifyStream(uint _id, uint _amount, uint _timestamp)external returns(bool);

    /*
    * @dev this function stops the ongoing stream
    * the rate should be set to 0 on execution
    */
    function deleteStream(uint _id)external returns (bool);

}