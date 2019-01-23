/**
 * Created by yinchong on 2018/12/28
 */


'use strict';
import to from 'await-to-js'
import {
  EOS_GET_ACCOUNT,
  EOS_GET_BALANCE,
  EOS_GET_PRICE,
  EOS_BUY_RAM_SUCCESS,
  EOS_SELL_RAM_SUCCESS,
  EOS_SELL_RAM_FAIL,
  EOS_BUY_RAM_FAIL,
  EOS_STAKE_SUCCESS,
  EOS_STAKE_FAIL,
  EOS_UNSTAKE_SUCCESS,
  EOS_UNSTAKE_FAIL,
} from "./actionTypes"

import {
  blockchainFactory
} from "../api";
import {blockchainNetwork} from "../api/blockchainStorage";

export function getEOSAccount(keystore) {
  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, account] = await to(blockchainApi.getAccount(keystore.address));

    if (err) {
      return;
    }

    dispatch({
      type: EOS_GET_ACCOUNT,
      account
    });
  }
}

export function getEOSBalance(address) {
  return async dispatch => {

    let blockchainApi = blockchainFactory(blockchainNetwork.EOS);
    let [err, balance] = await to(blockchainApi.getBalance(address));

    dispatch({
      type: EOS_GET_BALANCE,
      balance
    });
  }
}

export function getEOSPrice() {
  return async dispatch => {

    let blockchainApi = blockchainFactory(blockchainNetwork.EOS);
    let [err, price] = await to(blockchainApi.getPrice());

    dispatch({
      type: EOS_GET_PRICE,
      price
    });
  }
}

export function buyRam(privateKey, payer, receiver, bytes) {
  return async dispatch => {

    let actions = [{
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [{
        actor: payer,
        permission: 'active',
      }],
      data: {
        payer,
        receiver,
        bytes,
      },
    }];

    console.log('buy action', actions[0]);

    let blockchainApi = blockchainFactory(blockchainNetwork.EOS);
    let [err, result] = await to(blockchainApi.sendTransaction(privateKey, actions));

    console.log('buyResult', {err, result});

    if (err) {
      dispatch({
        type: EOS_BUY_RAM_FAIL
      });
      return;
    }

    dispatch({
      type: EOS_BUY_RAM_SUCCESS,
      buyResult: result,
      bytes
    });
  }
}

export function sellRam(privateKey, account, bytes) {
  return async dispatch => {

    let actions = [{
      account: 'eosio',
      name: 'sellram',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        account: account,
        bytes: bytes,
      },
    }];

    console.log('sell action', actions[0]);

    let blockchainApi = blockchainFactory(blockchainNetwork.EOS);
    let [err, result] = await to(blockchainApi.sendTransaction(privateKey, actions));

    console.log('sellResult', {err, result});

    if (err) {
      dispatch({
        type: EOS_SELL_RAM_FAIL
      });
      return;
    }

    dispatch({
      type: EOS_SELL_RAM_SUCCESS,
      sellResult: result,
      bytes
    });
  }
}

export function stake(privateKey, from, receiver, cpu, net) {
  return async dispatch => {

    let actions = [{
      account: 'eosio',
      name: 'delegatebw',
      authorization: [{
        actor: from,
        permission: 'active',
      }],
      data: {
        from: from,
        receiver: receiver,
        stake_net_quantity: `${net.toFixed(4)} EOS`, //'1.0000 EOS'
        stake_cpu_quantity: `${cpu.toFixed(4)} EOS`, //'1.0000 EOS'
        transfer: false,
      }
    }];

    console.log('stake action', actions[0]);

    let blockchainApi = blockchainFactory(blockchainNetwork.EOS);
    let [err, result] = await to(blockchainApi.sendTransaction(privateKey, actions));

    console.log('stakeResult', {err, result});

    if (err) {
      dispatch({
        type: EOS_STAKE_FAIL
      });
      return;
    }

    dispatch({
      type: EOS_STAKE_SUCCESS,
      stakeResult: result,
      stakeNetQuantity: net,
      stakeCpuQuantity: cpu
    });
  }
}

export function unstake(privateKey, from, receiver, cpu, net) {
  return async dispatch => {

    let actions = [{
      account: 'eosio',
      name: 'undelegatebw',
      authorization: [{
        actor: from,
        permission: 'active',
      }],
      data: {
        from: from,
        receiver: receiver,
        unstake_net_quantity: `${net.toFixed(4)} EOS`,  //'1.0000 EOS'
        unstake_cpu_quantity: `${cpu.toFixed(4)} EOS`,  //'1.0000 EOS'
        transfer: false,
      }
    }];

    console.log('unstake action', actions[0]);

    let blockchainApi = blockchainFactory(blockchainNetwork.EOS);
    let [err, result] = await to(blockchainApi.sendTransaction(privateKey, actions));

    console.log('unstakeResult', {err, result});

    if (err) {
      dispatch({
        type: EOS_UNSTAKE_FAIL
      });
      return;
    }

    dispatch({
      type: EOS_UNSTAKE_SUCCESS,
      unstakeResult: result,
      unstakeNetQuantity: net,
      unstakeCpuQuantity: cpu
    });
  }
}