/**
 * Created by yinchong on 2018/11/8
 */

'use strict';

import crypto from 'crypto'
import ecc from 'eosjs-ecc'
import keythereum from './../utils/keythereum'
import {blockchainNetwork} from "./blockchainStorage";

export default class BlockchainApi {

  /**
   * static function getInstance();
   *
   * function setHttpProvider();
   * function createKeystore();
   * function recoverKeystore();
   * function deployContract();
   * function getBalance();
   * function getBlock();
   * function getTransactionReceipt();
   * function getTransaction();
   * function sendTransaction();
   * function hexToBytes();
   * function bytesToHex();
   *
   * //EOS ONLY
   * function importKeystore();
   * function getAccount()
   * function getPrice()
   * //EOS ONLY
   *
   * function getUpsertEstimate();
   * function upsertNotebook();
   * function getNotebooks();
   * function getNotes();
   * function getNotebookByById();
   * function unlockNote();
   */

  verifyNetwork = (privateKey) => {
    if (!privateKey || privateKey.toString().trim().length === 0) {
      return null;
    }

    privateKey = privateKey.toString().trim();

    if (ecc.isValidPrivate(privateKey)) {
      return blockchainNetwork.EOS;
    }

    if (keythereum.privateKeyVerify(privateKey)) {
      return blockchainNetwork.ETH;
    }

    return null;
  };

  encrypt = (data, key, iv) => {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return cipher.update(data, 'utf-8', 'base64') + cipher.final('base64');
  };

  decrypt = (data, key, iv) => {
    let cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return cipher.update(data, 'base64', 'utf-8') + cipher.final('utf-8');
  };
}