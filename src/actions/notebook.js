/**
 * Created by yinchong on 2018/11/5
 */


'use strict';

import _ from 'lodash'
import to from 'await-to-js'
import async from 'async'
import {blockchainFactory, saveNotebook, saveNote, loadNotes, loadNotebooks, delDifference} from "../api";
import {
  QUERY_NOTEBOOKS,
  QUERY_NOTES,
  UPSERT_NOTEBOOK_SUCCESS,
  UPSERT_NOTEBOOK_FAIL,
  UPSERT_NOTE_SUCCESS,
  UPSERT_NOTE_FAIL,
  UNLOCK_NOTE_SUCCESS,
  UNLOCK_NOTE_FAIL,
  UNLOCK_NOTEBOOK_SUCCESS,
  UNLOCK_NOTEBOOK_FAIL,
  INSUFFICIENT_FUNDS,
} from './actionTypes'

export function queryNotebooks(keystore) {

  return async dispatch => {
    let blockchainApi = blockchainFactory(keystore.network);

    let [queryErr, confirmedNotebooks] = await to(blockchainApi.getNotebooks(keystore.address));

    if (queryErr) {
      console.log('queryNotebookErr', queryErr);
      confirmedNotebooks = [];
    }

    let [err, localNotebooks] = await to(loadNotebooks(keystore.address));

    let notebooks;
    if (localNotebooks && localNotebooks.length > 0) {

      let unconfirmedNotebooks = _.differenceBy(localNotebooks, confirmedNotebooks, 'id');
      let localUndeterminedNotebooks = _.differenceBy(localNotebooks, unconfirmedNotebooks, 'id');

      let [delErr, del] = await to(delDifference(keystore.address, localUndeterminedNotebooks, 'id'));

      notebooks = unconfirmedNotebooks && unconfirmedNotebooks.length > 0 ? confirmedNotebooks.concat(unconfirmedNotebooks) : confirmedNotebooks;
    } else {
      notebooks = confirmedNotebooks;
    }

    console.log('notebooks', notebooks);

    dispatch({
      type: QUERY_NOTEBOOKS,
      notebooks
    });
  }
}


export function queryNotes(keystore, notebookId) {

  return async dispatch => {
    let blockchainApi = blockchainFactory(keystore.network);
    let [queryErr, confirmedNotes] = await to(blockchainApi.getNotes(keystore.address, notebookId));

    if (queryErr) {
      console.log('queryNoteErr', queryErr);
      confirmedNotes = [];
    }

    let [err, localNotes] = await to(loadNotes(`${keystore.address}-${notebookId}`));

    let notes;
    if (localNotes && localNotes.length > 0) {

      let unconfirmedNotes = _.differenceBy(localNotes, confirmedNotes, 'id');
      let localUndeterminedNotes = _.differenceBy(localNotes, unconfirmedNotes, 'id');

      if (localUndeterminedNotes && localUndeterminedNotes.length > 0) {

        let makeFunc = (item) => {
          return async function (callback) {
            let {transactionHash} = item;
            let receipt = await blockchainApi.getTransactionReceipt(transactionHash);
            item.receipt = receipt;
            callback(null, item);
          }
        };

        let funcArray = [];
        localUndeterminedNotes.forEach(async (item) => {
          let f = makeFunc(item);
          funcArray.push(f);
        });

        let p = new Promise((resolve, reject) => {
          async.parallel(funcArray, (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            let confirmedNotes = [];
            let unconfirmedNotes = [];
            results.forEach((item) => {
              if (item.receipt)
                confirmedNotes.push(item);
              else
                unconfirmedNotes.push(item);
            });
            resolve({confirmedNotes, unconfirmedNotes});
          });
        });

        let [err, networkResult] = await to(p);

        //删除本地已经被网络确认的note块
        let [delErr, del] = await to(delDifference(`${keystore.address}-${notebookId}`, networkResult.confirmedNotes, 'id'));

        //将本地未被确认的note块和已经被确认的note替换
        networkResult.unconfirmedNotes.forEach((item) => {
          let replaceIndex = _.findIndex(confirmedNotes, {'id': item.id});
          if (replaceIndex > -1) {
            confirmedNotes.splice(replaceIndex, 1, item);
          }
        })
      }

      notes = unconfirmedNotes && unconfirmedNotes.length > 0 ? confirmedNotes.concat(unconfirmedNotes) : confirmedNotes;
    } else {
      notes = confirmedNotes;
    }

    console.log('notes', notes);

    dispatch({
      type: QUERY_NOTES,
      notes
    });
  }
}

export function upsertGas(keystore, privateKey, notebook, noteId, noteContent) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, gas] = await to(blockchainApi.getUpsertEstimate(keystore.address, privateKey, notebook, noteId, noteContent));

    dispatch({
      type: UPSERT_GAS,
      gas
    })
  }
}

export function upsertNotebook(type, keystore, privateKey, notebook, noteId, noteContent) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);

    let [upsertErr, unconfirmed] = await to(blockchainApi.upsertNotebook(keystore.address, privateKey, notebook, noteId, noteContent));
    if (upsertErr) {
      dispatch({
        type: upsertErr.message.indexOf('insufficient funds') > -1 ? INSUFFICIENT_FUNDS : type === 'create' ? UPSERT_NOTEBOOK_FAIL : UPSERT_NOTE_FAIL,
        err: upsertErr
      });
      return;
    }

    let [notebookSavedErr, notebookSaved] = await to(saveNotebook(keystore.address, notebook));
    let [noteSavedErr, noteSaved] = await to(saveNote(`${keystore.address}-${notebook.id}`, unconfirmed));
    if (noteSavedErr || notebookSavedErr) {
      dispatch({
        type: type === 'create' ? UPSERT_NOTEBOOK_FAIL : UPSERT_NOTE_FAIL,
        err: noteSavedErr || notebookSavedErr
      });
      return;
    }

    console.log('notebook', notebook, 'unconfirmed', unconfirmed);

    dispatch({
      type: type === 'create' ? UPSERT_NOTEBOOK_SUCCESS : UPSERT_NOTE_SUCCESS,
      unconfirmed,
      notebook
    });
  }
}

export function unlockNotebook(keystore, password, noteList) {

  return async dispatch => {
    let blockchainApi = blockchainFactory(keystore.network);
    let [pwdErr, privateKey] = await to(blockchainApi.recoverKeystore(keystore, password));
    if (pwdErr) {
      dispatch({
        type: UNLOCK_NOTEBOOK_FAIL,
        err: pwdErr
      });
      return;
    }

    let makeFunc = (item) => {
      return async function (callback) {
        if (item.lock) {
          let [unlockErr, unlockNote] = await to(blockchainApi.unlockNote(privateKey, item.content));
          item.content = unlockNote;
          item.lock = false;
        }
        callback(null, item);
      }
    };

    let funcArray = [];
    noteList.forEach(async (item) => {
      let f = makeFunc(item);
      funcArray.push(f);
    });

    let p = new Promise((resolve, reject) => {
      async.parallel(funcArray, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });

    let [err, notes] = await to(p);

    dispatch({
      type: UNLOCK_NOTEBOOK_SUCCESS,
      notes
    });
  }
}

export function unlockNote(keystore, password, note) {

  return async dispatch => {

    if (note.lock) {
      let blockchainApi = blockchainFactory(keystore.network);
      let [err, privateKey] = await to(blockchainApi.recoverKeystore(keystore, password));
      if (err) {
        dispatch({
          type: UNLOCK_NOTE_FAIL,
          err
        });
        return;
      }

      let [unlockErr, unlockNote] = await to(blockchainApi.unlockNote(privateKey, note.content));
      if (unlockErr) {
        dispatch({
          type: UNLOCK_NOTE_FAIL,
          err: unlockErr
        });
        return;
      }

      note.lock = false;
      note.content = unlockNote;
    }

    dispatch({
      type: UNLOCK_NOTE_SUCCESS,
      unlockNote: note
    });
  }
}