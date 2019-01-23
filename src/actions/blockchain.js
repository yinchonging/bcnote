/**
 * Created by yinchong on 2018/11/8
 */

'use strict';

import to from 'await-to-js'
import {eos_nodes, eth_nodes} from './../utils/constants'
import {QUERY_TRANSACTION, QUERY_BLOCK, SWITCH_NODE, GET_NODE} from './actionTypes'
import {blockchainFactory, getNetworkNode, setNetworkNode} from './../api'
import {blockchainNetwork} from "../api/blockchainStorage";

export function queryTransaction(keystore, transactionHash) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, transaction] = await to(blockchainApi.getTransaction(transactionHash));

    dispatch({
      type: QUERY_TRANSACTION,
      transaction
    });
  }
}

export function queryBlock(keystore, blockNumber) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, block] = await to(blockchainApi.getBlock(blockNumber));

    dispatch({
      type: QUERY_BLOCK,
      block
    });
  }
}

export function switchNode(network, node) {

  return async dispatch => {

    await setNetworkNode(network, node);

    let blockchainApi = blockchainFactory(network);
    blockchainApi.setHttpProvider(node);

    let action = {
      type: SWITCH_NODE
    };

    switch (network) {
      case blockchainNetwork.ETH:
        action.ethNode = node;
        break;
      case blockchainNetwork.EOS:
        action.eosNode = node;
        break;
    }

    dispatch(action);
  }
}

export function getNode() {

  return async dispatch => {

    let {ethNode, eosNode} = await getNetworkNode();

    dispatch({
      type: GET_NODE,
      ethNode,
      eosNode
    });
  }
}