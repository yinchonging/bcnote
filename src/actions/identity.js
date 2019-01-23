/**
 * Created by yinchong on 2018/11/2
 */


'use strict';

import {
  CREATE_IDENTITY_SUCCESS,
  CREATE_IDENTITY_FAIL,
  DELETE_IDENTITY_SUCCESS,
  DELETE_IDENTITY_FAIL,
  LOGOUT_IDENTITY_SUCCESS,
  LOGOUT_IDENTITY_FAIL,
  LOAD_IDENTITY,
  SWITCH_IDENTITY,
  UPDATE_IDENTITY_ALIAS,
  GET_PROFILE_BALANCE,
  GET_IDENTITY_BALANCE,
  IMPORT_IDENTITY_SUCCESS,
  IMPORT_IDENTITY_FAIL,
  EXPORT_IDENTITY_SUCCESS,
  EXPORT_IDENTITY_FAIL,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL
} from "./actionTypes"

import {
  findAllIdentities,
  getSelectedIdentity,
  setSelectedIdentity,
  insertIdentity,
  deleteIdentity,
  clearIdentity,
  updateIdentity,
  blockchainFactory,
  blockchainNetwork
} from "../api";

import to from 'await-to-js'

export function loadIdentity() {

  return async dispatch => {
    let allIdentities = await findAllIdentities();

    let selectedIdentity = await getSelectedIdentity();
    if (!selectedIdentity && allIdentities.length > 0) {
      selectedIdentity = allIdentities[0];
      await setSelectedIdentity(selectedIdentity)
    }

    dispatch({
      type: LOAD_IDENTITY,
      allIdentities,
      selectedIdentity
    });

  }
}

export function createIdentity(privateKey, password, hint, alias) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(blockchainNetwork.ETH);
    let [err, keystore] = await to(blockchainApi.createKeystore(privateKey, password, hint, alias));

    if (err) {
      dispatch({
        type: CREATE_IDENTITY_FAIL
      });
      return;
    }

    await insertIdentity(keystore);
    await setSelectedIdentity(keystore);

    let allIdentities = [keystore];
    let selectedIdentity = keystore;

    dispatch({
      type: CREATE_IDENTITY_SUCCESS,
      allIdentities,
      selectedIdentity
    });
  }
}

export function importIdentity(keystore, password, hint, alias) {
  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network || blockchainNetwork.ETH);
    let [err, privateKey] = await to(blockchainApi.recoverKeystore(keystore, password));
    if (err || privateKey === null) {
      dispatch({
        type: IMPORT_IDENTITY_FAIL,
        err: 'Password Validation Failed'
      });
      return;
    }

    let network = blockchainApi.verifyNetwork(privateKey);

    if (network === null) {
      dispatch({
        type: IMPORT_IDENTITY_FAIL,
        err: 'Invalid Private Key'
      });
      return;
    }

    keystore.hint = hint;
    keystore.alias = alias;
    keystore.network = network;
    let {allIdentities, selectedIdentity} = await insertIdentity(keystore);
    dispatch({
      type: IMPORT_IDENTITY_SUCCESS,
      allIdentities,
      selectedIdentity
    });
  }
}

export function exportIdentity(type, keystore, password) {
  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, privateKey] = await to(blockchainApi.recoverKeystore(keystore, password));

    if (err) {
      dispatch({
        type: EXPORT_IDENTITY_FAIL
      });
      return;
    }

    dispatch({
      type: EXPORT_IDENTITY_SUCCESS,
      keystore,
      privateKey: privateKey,
      exportType: type
    });
  }
}

export function logoutIdentity(keystore, password) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, privateKey] = await to(blockchainApi.recoverKeystore(keystore, password));

    if (err) {
      dispatch({
        type: LOGOUT_IDENTITY_FAIL
      });
      return;
    }
    await clearIdentity();
    dispatch({
      type: LOGOUT_IDENTITY_SUCCESS,
      allIdentities: []
    });
  }
}

export function switchIdentity(identity) {

  return async dispatch => {

    await setSelectedIdentity(identity);

    dispatch({
      type: SWITCH_IDENTITY,
      selectedIdentity: identity
    });
  }
}

export function delIdentity(keystore, password) {
  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, privateKey] = await to(blockchainApi.recoverKeystore(keystore, password));

    if (err) {
      dispatch({
        type: DELETE_IDENTITY_FAIL
      });
      return;
    }

    let allIdentities = await findAllIdentities();

    if (allIdentities.length === 1) {

      await clearIdentity();
      dispatch({
        type: LOGOUT_IDENTITY_SUCCESS,
        allIdentities: []
      });

    } else {

      let {allIdentities, selectedIdentity} = await deleteIdentity(keystore.address);

      dispatch({
        type: DELETE_IDENTITY_SUCCESS,
        allIdentities,
        selectedIdentity,
        keystore
      });
    }
  }
}

export function updateIdentityAlias(keystore, alias) {

  return async dispatch => {

    keystore.alias = alias;

    let {allIdentities, selectedIdentity} = await updateIdentity(keystore);

    dispatch({
      type: UPDATE_IDENTITY_ALIAS,
      allIdentities,
      selectedIdentity
    });
  }
}

export function changeIdentityPassword(keystore, currentPassword, newPassword, hint) {

  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, privateKey] = await to(blockchainApi.recoverKeystore(keystore, currentPassword));

    if (err || privateKey === null) {
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        err: 'Password Validation Failed'
      });
      return;
    }
    let [keystoreErr, newKeystore] = await to(blockchainApi.createKeystore(privateKey, newPassword, hint, keystore.alias));

    if (keystoreErr || newKeystore === null) {
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        err: keystoreErr || 'Create Keystore Failed'
      });
      return;
    }

    let {allIdentities, selectedIdentity} = await updateIdentity(newKeystore);

    dispatch({
      type: CHANGE_PASSWORD_SUCCESS,
      allIdentities,
      selectedIdentity,
      currentViewIdentity: newKeystore
    });
  }
}


export function getIdentityBalance(keystore, balanceKey) {
  return async dispatch => {

    let blockchainApi = blockchainFactory(keystore.network);
    let [err, balance] = await to(blockchainApi.getBalance(keystore.address));

    if (err) {
      balance = 0;
    }

    let j = {
      type: balanceKey === 'profileBalance' ? GET_PROFILE_BALANCE : GET_IDENTITY_BALANCE
    };
    j[balanceKey] = balance;
    dispatch(j);
  }
}
