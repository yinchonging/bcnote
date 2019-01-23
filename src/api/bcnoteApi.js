/**
 * Created by yinchong on 2018/11/8
 */
'use strict';
import BlockchainApi from './blockchainApi'

export default class BCNoteApi extends BlockchainApi {

  constructor() {
    super();
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new BCNote();
    }
    return this.instance;
  }

  setHttpProvider(url) {
  }

  createKeystore(privateKey, password, hint, alias) {
  }

  recoverKeystore(keystore, password) {
  }

  importKeystore() {
  }

  deployContract(abi, code, address) {
  }

  getBalance(address) {
  }

  getBlock(number) {
  }

  getTransactionReceipt(transactionHash) {
  }

  getTransaction(transactionHash) {
  }

  sendTransaction(privateKey, data) {
  }

  bytesToHex(bytes) {
  }

  hexToBytes(string) {
  }

  getUpsertEstimate() {
  }

  upsertNotebook() {
  }

  getNotebooks() {
  }

  getNotebookByById() {
  }

  getNotes() {
  }

  unlockNote() {
  }
}