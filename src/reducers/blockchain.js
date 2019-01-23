/**
 * Created by yinchong on 2018/11/8
 */
'use strict';

import {
  QUERY_TRANSACTION,
  QUERY_BLOCK,
  SWITCH_NODE,
  GET_NODE
} from "./../actions/actionTypes"

import {eos_nodes, eth_nodes} from './../utils/constants'

const initBlockchain = {
  ethNode: 'https://mainnet.infura.io',
  ethNodes: eth_nodes,
  eosNode: 'https://mainnet-eos.token.im',
  eosNodes: eos_nodes
};

export default function blockchain(state = initBlockchain, action) {
  switch (action.type) {
    case QUERY_TRANSACTION:
    case QUERY_BLOCK:
    case GET_NODE:
    case SWITCH_NODE:
      return Object.assign({}, state, action);
    default:
      return Object.assign({}, state, action);
  }
}