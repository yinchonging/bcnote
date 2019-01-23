/**
 * Created by yinchong on 2018/11/8
 */
'use strict';
import {AsyncStorage} from 'react-native'
import to from 'await-to-js'
import zlib from 'zlib'
import _ from 'lodash'

import Web3 from 'web3'
import Transaction from 'ethereumjs-tx'
import keythereum from '../utils/keythereum'
import {abi} from '../utils/abi'

import BlockchainApi from './blockchainApi'
import {blockchainNetwork} from "./blockchainStorage"
import {ethCurrentNode, eosCurrentNode} from "./localStorage"
import {k_nonce} from "../utils/constants";

const GZIP_FLAG = 'YGV1';
const GAS_ESTIMATE = 0.1;
const MAINNET = '0x42aAe33a1E7Fb339e993dd757Fd54d117df0223f';
const RINKEBY = '0x68cDa8303544e9Daf62f6472d498172aa1562658';

export default class EthApi extends BlockchainApi {

  constructor() {
    super();

    this.instance = null;
    this.contractAddress = this._getContractAddress(ethCurrentNode);
    this.gasLimit = 4712357;
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(ethCurrentNode)
    );
    this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
    console.log('ethCurrentNode', ethCurrentNode, 'contractAddress', this.contractAddress);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EthApi();
    }
    return this.instance;
  }

  _getContractAddress(url) {
    return url.indexOf('mainnet.infura.io') > -1 ? MAINNET : RINKEBY;
  }

  setHttpProvider(url) {
    if (url) {
      this.web3.setProvider(new Web3.providers.HttpProvider(url));
      this.contractAddress = this._getContractAddress(url);
      this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
    }
  }

  /**
   * @param privateKey option
   */
  createKeystore(privateKey, password, hint, alias) {
    return new Promise((resolve, reject) => {

      privateKey = privateKey ? privateKey.trim() : privateKey;

      if (privateKey && !keythereum.privateKeyVerify(privateKey)) {
        reject('Invalid Private Key');
        return;
      }

      keythereum.create({}, function (dk) {

        let options = {network: 'ETH'};
        keythereum.dump(password, privateKey || dk.privateKey, dk.salt, dk.iv, options, (err, jsonKeystore) => {

          if (err) {
            reject(err);
            return;
          }

          jsonKeystore.address = `0x${jsonKeystore.address}`;
          jsonKeystore.hint = hint;
          jsonKeystore.alias = alias;
          jsonKeystore.network = blockchainNetwork.ETH;
          resolve(jsonKeystore);

        });
      });
    })
  }

  recoverKeystore(keystore, password) {
    return new Promise((resolve, reject) => {

      keythereum.recover(password, keystore, (err, privateKey) => {
        if (err) {
          reject(err);
          return;
        }
        privateKey = this.web3.utils.bytesToHex(privateKey);
        // console.log('privateKey', privateKey);
        resolve(privateKey);
      });

    })
  }

  getBalance(address) {
    return new Promise(async (resolve, reject) => {
      try {
        let balance = await this.web3.eth.getBalance(address);
        let value = this.web3.utils.fromWei(balance, 'ether');
        resolve(value);
      } catch (e) {
        reject(e);
      }
    })
  }

  getBlock(number) {
    return new Promise(async (resolve, reject) => {
      try {
        let block = await this.web3.eth.getBlock(number);
        resolve(block);
      } catch (e) {
        reject(e);
      }
    });
  }

  getTransactionReceipt(transactionHash) {
    return new Promise(async (resolve, reject) => {
      try {
        let receipt = await this.web3.eth.getTransactionReceipt(transactionHash);
        resolve(receipt);
      } catch (e) {
        reject(e);
      }
    })
  }

  getTransaction(transactionHash) {
    return new Promise(async (resolve, reject) => {
      try {
        let transaction = await this.web3.eth.getTransaction(transactionHash);
        resolve(transaction);
      } catch (e) {
        reject(e);
      }
    })
  }

  sendTransaction(privateKey, rawTx) {

    return new Promise(async (resolve, reject) => {

      /**
       * let rawTx = {
       *  chainId
       *  nonce
       *  gasPrice
       *  gasLimit
       *  to
       *  from
       *  value
       *  data
       * }
       */

      try {
        privateKey = privateKey.constructor === String && privateKey.indexOf('0x') === 0 ? privateKey.substr(2) : privateKey;
        privateKey = keythereum.str2buf(privateKey);

        const tx = new Transaction(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();

        this.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, transactionHash) => {

          if (err) {
            reject(err);
            return;
          }
          resolve(transactionHash);
        })
      } catch (e) {
        reject(e);
      }
    })
  }

  bytesToHex(bytes) {
    return this.web3.utils.bytesToHex(bytes);
  }

  hexToBytes(string) {
    return this.web3.utils.hexToBytes(string);
  }

  getNotebooks(address) {
    return new Promise(async (resolve, reject) => {
      try {
        let [err, notebookCount] = await to(this.contract.methods.getNotebookCount().call({from: address}));

        let notebooks = [];

        if (notebookCount === '3963877391197344453575983046348115674221700746820753546331534351508065746944') {
          resolve(notebooks);
          return;
        }

        for (let i = 0; i < notebookCount; i++) {
          let notebook = await this.contract.methods.getNotebookByIndex(i).call({from: address});
          notebook.confirmed = true;
          notebooks.push(notebook);
        }

        resolve(notebooks);
      } catch (e) {
        reject(e);
      }
    })
  }

  getNotes(address, notebookId) {
    return new Promise(async (resolve, reject) => {
      try {
        let {noteCount} = await this.contract.methods.getNotebookById(notebookId).call({from: address});

        let notes = [];

        for (let i = 0; i < noteCount; i++) {
          let note = await this.contract.methods.getNoteByIndex(notebookId, i).call({from: address});
          note.lock = true;
          note.confirmed = true;
          notes.push(note);
        }

        resolve(notes);
      } catch (e) {
        reject(e);
      }
    })
  }

  getNotebookById(address, notebookId) {
    return new Promise(async (resolve, reject) => {
      try {

        let notebook = await this.contract.methods.getNotebookById(notebookId).call({from: address});
        notebook.confirmed = true;
        resolve(notebook);

      } catch (e) {
        reject(e);
      }
    })
  }

  getUpsertEstimate(address, privateKey, notebook, noteId, noteContent) {
    return new Promise(async (resolve, reject) => {
        try {
          let {id, name} = notebook;
          let key = this.web3.utils.toHex(privateKey).substring(2, 18);
          let iv = this.web3.utils.toHex(privateKey).substring(18, 34);

          let zip = zlib.gzipSync(noteContent, {level: zlib.Z_BEST_COMPRESSION}).toString('base64');
          let zipEncrypt = this.encrypt(zip, key, iv);
          let unzipEncrypt = this.encrypt(noteContent, key, iv);
          let content = zipEncrypt.length < unzipEncrypt.length ? `${GZIP_FLAG}${zipEncrypt}` : unzipEncrypt;

          let mUpsert = await this.contract.methods.upsert(id, name, noteId, '', content);
          let data = mUpsert.encodeABI();
          let gasPrice = await this.web3.eth.getGasPrice();

          let localNonce = await AsyncStorage.getItem(`${k_nonce}_${address}`);
          let remoteNonce = await this.web3.eth.getTransactionCount(address);

          localNonce = localNonce ? (parseInt(localNonce) + 1) : remoteNonce;
          let nonce = localNonce < remoteNonce ? remoteNonce : localNonce;

          let gas = await mUpsert.estimateGas({
            nonce: parseInt(nonce),
            gasLimit: this.gasLimit,
            gasPrice: gasPrice,
            to: this.contractAddress,
            from: address,
            value: '0x00',
            data: data
          });
          resolve(this.web3.utils.fromWei(String(parseInt((gas + gas * GAS_ESTIMATE) * gasPrice)), 'ether'));
        } catch (e) {
          reject(e);
        }
      }
    )
  }

  upsertNotebook(address, privateKey, notebook, noteId, noteContent) {
    return new Promise(async (resolve, reject) => {

      try {

        let {id, name} = notebook;

        let key = this.web3.utils.toHex(privateKey).substring(2, 18);
        let iv = this.web3.utils.toHex(privateKey).substring(18, 34);

        let zip = zlib.gzipSync(noteContent, {level: zlib.Z_BEST_COMPRESSION}).toString('base64');
        let zipEncrypt = this.encrypt(zip, key, iv);
        let unzipEncrypt = this.encrypt(noteContent, key, iv);
        let content = zipEncrypt.length < unzipEncrypt.length ? `${GZIP_FLAG}${zipEncrypt}` : unzipEncrypt;

        console.log('zipEncrypt.length ', zipEncrypt.length, 'unzipEncrypt.length', unzipEncrypt.length);

        let mUpsert = await this.contract.methods.upsert(id, name, noteId, '', content);
        let data = mUpsert.encodeABI();
        let gasPrice = await this.web3.eth.getGasPrice();
        let localNonce = await AsyncStorage.getItem(`${k_nonce}_${address}`);
        let remoteNonce = await this.web3.eth.getTransactionCount(address);

        localNonce = localNonce ? (parseInt(localNonce) + 1) : remoteNonce;
        let nonce = localNonce < remoteNonce ? remoteNonce : localNonce;

        let rawTx = {
          //chainId: 10,   //networkid
          nonce: parseInt(nonce),
          gasLimit: this.gasLimit,
          gasPrice: gasPrice,
          to: this.contractAddress,
          from: address,
          value: '0x00',
          data: data
        };

        let gas = await mUpsert.estimateGas(rawTx);
        console.log('gas', gas, 'nonce', nonce, 'rawTx', rawTx);

        let transactionHash = await this.sendTransaction(privateKey, rawTx);
        await AsyncStorage.setItem(`${k_nonce}_${address}`, String(nonce));
        resolve({
          transactionHash,
          content: content,
          id: noteId,
          lock: true,
          confirmed: false,
          at: new Date().getTime() / 1000
        });
      } catch (e) {
        reject(e);
      }
    })
  }

  unlockNote(privateKey, lockNote) {
    return new Promise((resolve, reject) => {
      let key = this.web3.utils.toHex(privateKey).substring(2, 18);
      let iv = this.web3.utils.toHex(privateKey).substring(18, 34);

      let unlockNote;
      if (lockNote.indexOf(GZIP_FLAG) === 0) {
        let unzipContent = this.decrypt(lockNote.substr(GZIP_FLAG.length), key, iv);
        unlockNote = zlib.unzipSync(new Buffer(unzipContent, 'base64')).toString();
      } else {
        unlockNote = this.decrypt(lockNote, key, iv);
      }
      resolve(unlockNote);
    })
  }
}
