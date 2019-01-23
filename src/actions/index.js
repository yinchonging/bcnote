/**
 * Created by yinchong on 2018/9/14
 */
'use strict';

import {
  loadIdentity,
  createIdentity,
  logoutIdentity,
  importIdentity,
  exportIdentity,
  switchIdentity,
  delIdentity,
  updateIdentityAlias,
  getIdentityBalance,
  changeIdentityPassword
} from './identity'


import {
  upsertGas,
  upsertNotebook,
  queryNotebooks,
  queryNotes,

  unlockNote,
  unlockNotebook
} from './notebook'

import {
  queryTransaction,
  queryBlock,
  switchNode,
  getNode
} from './blockchain'

import {
  loadLanguage,
  setLanguage
} from './language'

import {
  getEOSAccount,
  getEOSBalance,
  getEOSPrice,
  buyRam,
  sellRam,
  stake,
  unstake
} from './eos'


function makeActionCreator(type, ...argNames) {
  return function (...args) {
    let action = {type};
    for (let i = 0; i < argNames.length; i += 2) {
      action[argNames[i]] = argNames[i + 1];
    }
    return action;
  }
}

module.exports = {

  makeActionCreator,

  //language
  loadLanguage,
  setLanguage,

  //identity
  loadIdentity,
  createIdentity,
  logoutIdentity,
  importIdentity,
  exportIdentity,
  delIdentity,
  switchIdentity,
  updateIdentityAlias,
  getIdentityBalance,
  changeIdentityPassword,

  //notebooks
  upsertGas,
  upsertNotebook,
  queryNotebooks,
  queryNotes,
  unlockNote,
  unlockNotebook,

  //block chain
  queryTransaction,
  queryBlock,
  switchNode,
  getNode,

  //eos
  getEOSAccount,
  getEOSBalance,
  getEOSPrice,
  buyRam,
  sellRam,
  stake,
  unstake
};