/**
 * Created by yinchong on 2018/11/2
 */
'use strict';

import {
  findAllIdentities,
  findIdentity,
  updateIdentity,
  insertIdentity,
  getSelectedIdentity,
  setSelectedIdentity,
  deleteIdentity,
  clearIdentity,

  saveNote,
  saveNotebook,
  loadNotes,
  loadNotebooks,
  delDifference,


  setNetworkNode,
  getNetworkNode
} from './localStorage'

import {blockchainFactory, blockchainNetwork} from './blockchainStorage'

module.exports = {

  //localStorage
  findAllIdentities,
  findIdentity,
  updateIdentity,
  insertIdentity,
  getSelectedIdentity,
  setSelectedIdentity,
  deleteIdentity,
  clearIdentity,

  saveNote,
  saveNotebook,
  loadNotes,
  loadNotebooks,
  delDifference,

  //blockchcainStorage
  blockchainNetwork,
  blockchainFactory,
  setNetworkNode,
  getNetworkNode
};