/**
 * Created by yinchong on 2018/11/5
 */

'use strict';
import EthApi from './ethApi'
import EosApi from './eosApi'
import BCNote from './bcnoteApi'

export const blockchainNetwork = {ETH: 'ETH', EOS: 'EOS', BCNOTE: 'BCNote'};

/**
 * @param blockChain = blockchainNetwork
 */
export function blockchainFactory(blockChain) {
  switch (blockChain) {
    case blockchainNetwork.ETH:
      return EthApi.getInstance();
    case blockchainNetwork.EOS:
      return EosApi.getInstance();
    case blockchainNetwork.BCNOTE:
      return BCNote.getInstance();
    default:
      return EthApi.getInstance();
  }
}
