/**
 * Created by yinchong on 2018/12/26
 */
'use strict';
import {
  EOS_GET_ACCOUNT,
  EOS_RAM_TYPE,
  EOS_STAKE_TYPE,
  EOS_GET_BALANCE,
  EOS_GET_PRICE,
  EOS_UPDATA_EXTRA,
  EOS_BUY_RAM_SUCCESS,
  EOS_BUY_RAM_FAIL,
  EOS_SELL_RAM_SUCCESS,
  EOS_SELL_RAM_FAIL,
  EOS_STAKE_SUCCESS,
  EOS_STAKE_FAIL,
  EOS_UNSTAKE_SUCCESS,
  EOS_UNSTAKE_FAIL,
  EOS_RAM_LOADING,
  EOS_STAKE_LOADING,
  EOS_RESOURCES_LOADING
} from '../actions/actionTypes'

const init = {
  ramLoading: false,
  stakeLoading: false,
  resourcesLoading: false,
  ramType: 0,      //0 == buy,  1 == sell,
  stakeType: 0,    //0 == stake,  1 == reclaim,
  account: {
    core_liquid_balance: 0,
    ram_quota: 0,
    ram_usage: 0,
    net_limit: {
      used: 0,
      available: 0,
      max: 0
    },
    cpu_limit: {
      used: 0,
      available: 0,
      max: 0
    },
    permissions: [],
    self_delegated_bandwidth: {
      net_weight: 0,
      cpu_weight: 0
    },
    refund_request: {
      cpu_amount: 0,
      net_amount: 0
    }
  },
  price: {
    ram: 0,
    net: 0,
    cpu: 0,
  },
  ramAmount: 0,
  cpuAmount: 0,
  netAmount: 0,
  buyExtra: '0.00 kb',
  sellExtra: '0.00 EOS',
  stakeCpuExtra: '0.00 ms',
  stakeNetExtra: '0.00 kb',
};

export default function eos(state = init, action) {
  switch (action.type) {
    case EOS_RAM_LOADING:
    case EOS_STAKE_LOADING:
    case EOS_RESOURCES_LOADING:
    case EOS_GET_ACCOUNT:
    case EOS_RAM_TYPE:
    case EOS_STAKE_TYPE:
    case EOS_GET_BALANCE:
    case EOS_GET_PRICE:
    case EOS_UPDATA_EXTRA:
    case EOS_BUY_RAM_FAIL:
    case EOS_SELL_RAM_FAIL:
    case EOS_STAKE_FAIL:
    case EOS_UNSTAKE_FAIL:
      return Object.assign({}, state, action);
    case EOS_BUY_RAM_SUCCESS:
    case EOS_SELL_RAM_SUCCESS:
    case EOS_STAKE_SUCCESS:
    case EOS_UNSTAKE_SUCCESS:
    default:
      return Object.assign({}, state, action);
  }
}