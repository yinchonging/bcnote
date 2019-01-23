/**
 * Created by yinchong on 2018/11/8
 */
'use strict';
import uuid from 'uuid'
import to from 'await-to-js'
import _ from 'lodash'
import zlib from 'zlib'

import {Api, JsonRpc, RpcError, Serialize} from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'; // development only
import {TextDecoder, TextEncoder} from 'text-encoding';
import ecc from 'eosjs-ecc'
import keythereum from './../utils/keythereum'

import BlockchainApi from './blockchainApi'
import {blockchainNetwork} from "./blockchainStorage"
import {ethCurrentNode, eosCurrentNode} from "./localStorage"

const GZIP_FLAG = 'YGV1';

export default class EosApi extends BlockchainApi {

  constructor() {
    super();
    this.instance = null;
    this.contract = 'yinchongbase';
    const signatureProvider = new JsSignatureProvider(['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3']);
    const rpc = new JsonRpc(eosCurrentNode, {fetch});
    this.api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EosApi();
    }
    return this.instance;
  }

  setHttpProvider(url) {
    this.api.rpc = new JsonRpc(url, {fetch});
  }

  createKeystore(privateKey, password, hint, alias) {

    return new Promise(async (resolve, reject) => {

      if (!privateKey) {
        reject('Invalid Private Key');
        return;
      }

      try {
        privateKey = privateKey.trim();

        if (!ecc.isValidPrivate(privateKey)) {
          reject('Invalid Private Key');
          return;
        }

        let publicKey = ecc.privateToPublic(privateKey);
        let accounts = await this.api.rpc.history_get_key_accounts(publicKey);
        if (!accounts || !accounts.account_names || accounts.account_names.length === 0) {
          reject('Import Account Not Found');
          return;
        }

        //Only Support Active Public Key
        let account = accounts.account_names[0];
        let accountInfo = await this.api.rpc.get_account(account);

        let activeRole = _.find(accountInfo.permissions, {perm_name: 'active'});
        let isActive = _.find(activeRole.required_auth.keys, {key: publicKey});

        if (!isActive) {
          reject('Only Support Active Private Key');
          return;
        }

        keythereum.create({}, function (dk) {
          dk.privateKey = privateKey;

          let options = {network: 'EOS', address: account};
          keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (err, jsonStore) {

            jsonStore.hint = hint;
            jsonStore.alias = alias;
            jsonStore.network = blockchainNetwork.EOS;

            resolve(jsonStore);
          });
        });
      } catch (e) {
        reject(e);
      }
    })
  }

  recoverKeystore(keystore, password) {
    return new Promise((resolve, reject) => {

      keythereum.recover(password, keystore, (err, privateKey) => {
        if (err) {
          reject(err);
          return;
        }
        //console.log('privateKey',privateKey.toString());
        resolve(privateKey.toString());
      });
    })
  }

  importKeystore(privateKey) {
    return new Promise(async (resolve, reject) => {
      let publicKey = ecc.privateToPublic(privateKey);
      let accounts = await this.api.rpc.history_get_key_accounts(publicKey);
      if (!accounts || accounts.length === 0) {
        reject('Import Account Not Found');
        return;
      }

      resolve(accounts.account_names[0])
    })
  }

  getPrice() {
    return new Promise(async (resolve, reject) => {

      let price = {};
      let rammarket = await this.api.rpc.get_table_rows({
        json: true,
        code: 'eosio',
        scope: 'eosio',
        table: 'rammarket' //global
      });

      let data = rammarket.rows[0];
      price.ram = parseFloat(parseFloat(data['quote']['balance']) / parseFloat(data['base']['balance']) * 1024);  //  EOS/kb

      let info = await this.api.rpc.get_info();
      console.log('producer', info.head_block_producer);

      let result = await this.api.rpc.get_account(info.head_block_producer);

      let cpuStaked = parseFloat(result.total_resources.cpu_weight);
      let cpuAvailable = result.cpu_limit.available / 1000;       // convert microseconds to milliseconds
      price.cpu = cpuStaked / cpuAvailable / 3;                   // EOS/ms;

      let netStaked = parseFloat(result.total_resources.net_weight);
      let netAvailable = result.net_limit.available / 1024;       // convert bytes to kilobytes
      price.net = netStaked / netAvailable / 3;                   // EOS/kb;

      resolve(price);
    })
  }

  getAccount(account) {
    return new Promise(async (resolve, reject) => {
      try {
        let v = await this.api.rpc.get_account(account);
        resolve(v);
      } catch (e) {
        reject(e);
      }
    })
  }

  getBalance(address) {

    return new Promise(async (resolve, reject) => {
      try {
        let v = await this.api.rpc.get_currency_balance('eosio.token', address, 'EOS');
        if (v === null || v.length === 0) {
          resolve('0');
        } else {
          resolve(parseFloat(v[0]).toFixed(4));
        }
      } catch (e) {
        reject(e);
      }
    })
  }

  getBlock(number) {
    return this.api.rpc.get_block(number);
  }

  getTransactionReceipt(number) {
    return new Promise(async (resolve, reject) => {
      let result = await this.api.rpc.get_block(number);
      if (result) {
        resolve(result);
      } else {
        reject(null);
      }
    })
  }

  getTransaction(transactionHash) {
    return this.api.rpc.history_get_transaction(transactionHash);
  }

  sendTransaction(privateKey, actions) {
    return new Promise(async (resolve, reject) => {

      this.api.signatureProvider = new JsSignatureProvider([privateKey]);
      try {
        let result = await this.api.transact({
          actions: actions
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        });
        resolve(result);
      } catch (e) {
        reject(e);
      }
    })
  }

  bytesToHex(bytes) {
  }

  hexToBytes(string) {
  }

  getUpsertEstimate(address, privateKey, notebook, noteId, noteContent) {
    return new Promise(async (resolve, reject) => {
      let {id, name} = notebook;
      let transaction = {
        account: address,
        notebook_id: id,
        notebook_name: name,
        note_id: noteId,
        note_title: '',
        note_content: noteContent
      };
      resolve(JSON.stringify(transaction).length);
    })
  }

  upsertNotebook(address, privateKey, notebook, noteId, noteContent) {

    return new Promise(async (resolve, reject) => {
      try {
        let {id, name} = notebook;

        let key = privateKey.substring(2, 18);
        let iv = privateKey.substring(18, 34);

        let zip = zlib.gzipSync(noteContent, {level: zlib.Z_BEST_COMPRESSION}).toString('base64');
        let zipEncrypt = this.encrypt(zip, key, iv);
        let unzipEncrypt = this.encrypt(noteContent, key, iv);
        let content = zipEncrypt.length < unzipEncrypt.length ? `${GZIP_FLAG}${zipEncrypt}` : unzipEncrypt;

        console.log('zipEncrypt.length ', zipEncrypt.length, 'unzipEncrypt.length', unzipEncrypt.length);

        this.api.signatureProvider = new JsSignatureProvider([privateKey]);
        let result = await this.api.transact({
          actions: [{
            account: this.contract,
            name: 'upsert',
            authorization: [{
              actor: address,
              permission: 'active',
            }],
            data: {
              account: address,
              notebook_id: id,
              notebook_name: name,
              note_id: noteId,
              note_title: '',
              note_content: content
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        });

        resolve({
          transactionHash: result.processed.block_num,
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

  getPrimaryKey(address) {
    return new Promise(async (resolve, reject) => {
      try {
        let primaryKeyResult = await this.api.rpc.get_table_rows({
          json: true,
          code: this.contract,
          scope: address,
          table: 'myprimarykey'
        });

        let primaryKey = {notebookId: 0, noteId: 0};
        if (primaryKeyResult && primaryKeyResult.rows && primaryKeyResult.rows.length > 0) {
          let {notebook_primary_key: notebookId, note_primary_key: noteId} = primaryKeyResult.rows[0];
          primaryKey.notebookId = notebookId;
          primaryKey.noteId = noteId;
        }
        resolve(primaryKey);
      } catch (e) {
        reject(e);
      }
    });
  }

  getNotebooks(address) {
    return new Promise(async (resolve, reject) => {

      try {
        let notebookResult = await this.api.rpc.get_table_rows({
          json: true,
          code: this.contract,
          scope: address,
          table: 'notebook',
          limit: 1000
        });

        console.log('notebookResult', notebookResult);

        let notebooks = [];
        if (notebookResult && notebookResult.rows) {
          notebookResult.rows.forEach((item) => {

            notebooks.push({
              id: item.id,
              name: item.name,
              noteCount: item.note_count,
              number: item.number,
              at: item.at / 1000000,
              confirmed: true
            })
          })
        }
        resolve(notebooks);
      } catch (e) {
        reject(e);
      }
    });
  }

  getNotes(address, notebookId) {
    return new Promise(async (resolve, reject) => {
      try {
        notebookId = parseInt(notebookId);
        let noteResult = await this.api.rpc.get_table_rows({
          json: true,
          code: this.contract,
          scope: address,
          table: 'note',
          index_position: 2,
          key_type: 'i64',
          table_key: 'bynotebookid',
          lower_bound: notebookId,
          upper_bound: notebookId,
          limit: 1000
        });

        console.log('noteResult', noteResult);

        let notes = [];

        if (noteResult && noteResult.rows) {
          noteResult.rows.forEach((item) => {
            notes.push({
              id: item.id,
              title: item.title,
              content: item.content,
              number: item.number,
              at: parseInt(item.at) / 1000000,
              lock: true,
              confirmed: true
            })
          })
        }
        resolve(notes);
      } catch (e) {
        reject(e);
      }
    })
  }

  unlockNote(privateKey, lockNote) {
    return new Promise((resolve, reject) => {
      try {
        let key = privateKey.substring(2, 18);
        let iv = privateKey.substring(18, 34);

        let unlockNote;
        if (lockNote.indexOf(GZIP_FLAG) === 0) {
          let unzipContent = this.decrypt(lockNote.substr(GZIP_FLAG.length), key, iv);
          unlockNote = zlib.unzipSync(new Buffer(unzipContent, 'base64')).toString();
        } else {
          unlockNote = this.decrypt(lockNote, key, iv);
        }
        resolve(unlockNote);
      } catch (e) {
        reject(e);
      }
    })
  }
}
