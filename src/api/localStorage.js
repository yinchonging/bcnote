/**
 * Created by yinchong on 2018/11/2
 */

'use strict';
import _ from 'lodash'
import {AsyncStorage} from 'react-native'
import {k_identities, k_selected_identity, k_network_node, eth_nodes, eos_nodes} from "../utils/constants"
import {blockchainNetwork} from "./blockchainStorage";

export let ethCurrentNode;
export let eosCurrentNode;

export function findAllIdentities() {
  return new Promise(async (resolve, reject) => {
    let r = await AsyncStorage.getItem(k_identities);
    resolve(r ? JSON.parse(r) : []);
  });
}

export function findIdentity(address) {
  return new Promise(async (resolve, reject) => {
    let identities = await findAllIdentities();
    let identity = _.find(identities, {'address': address});
    resolve(identity);
  });
}

export function updateIdentity(keystore) {
  return new Promise(async (resolve, reject) => {
    let identities = await findAllIdentities();

    let index = _.findIndex(identities, {'address': keystore.address});

    if (index === -1) {
      reject('Not Found');
      return;
    }

    identities.splice(index, 1, keystore);
    await AsyncStorage.setItem(k_identities, JSON.stringify(identities));

    let selectedIdentity = await getSelectedIdentity();
    if (keystore.address === selectedIdentity.address) {
      await setSelectedIdentity(keystore);
      selectedIdentity = keystore;
    }
    resolve({allIdentities: identities, selectedIdentity});
  });
}

export function insertIdentity(keystore) {

  return new Promise(async (resolve, reject) => {

    let identities = await findAllIdentities();
    let index = _.findIndex(identities, {'address': keystore.address});

    if (index > -1) {
      identities.splice(index, 1, keystore);
    } else {
      identities.push(keystore);
    }
    await AsyncStorage.setItem(k_identities, JSON.stringify(identities));

    let selectedIdentity = await getSelectedIdentity();
    if (!selectedIdentity || keystore.address === selectedIdentity.address) {
      await setSelectedIdentity(keystore);
      selectedIdentity = keystore;
    }
    resolve({allIdentities: identities, selectedIdentity});
  });
}

export function getSelectedIdentity() {
  return new Promise(async (resolve, reject) => {
    let r = await AsyncStorage.getItem(k_selected_identity);
    resolve(r ? JSON.parse(r) : null);
  });
}

export function setSelectedIdentity(identity) {
  return new Promise(async (resolve, reject) => {
    await AsyncStorage.setItem(k_selected_identity, JSON.stringify(identity));
    resolve('success');
  });
}

export function deleteIdentity(address) {
  return new Promise(async (resolve, reject) => {
    let identities = await findAllIdentities();
    let selectedIdentity = await getSelectedIdentity();

    let index = _.findIndex(identities, {'address': address});
    identities.splice(index, 1);

    await AsyncStorage.setItem(k_identities, JSON.stringify(identities));

    if (address === selectedIdentity.address) {
      selectedIdentity = identities[0];
      await setSelectedIdentity(selectedIdentity);
    }
    resolve({allIdentities: identities, selectedIdentity});
  });
}

export function clearIdentity() {
  return new Promise(async (resolve, reject) => {
    await AsyncStorage.clear();
    resolve('success');
  });
}

export function saveNotebook(key, notebook) {
  return new Promise(async (resolve, reject) => {
    let strNotebooks = await AsyncStorage.getItem(key);

    let notebooks = strNotebooks ? JSON.parse(strNotebooks) : [];
    let index = _.findIndex(notebooks, {'id': notebook.id});

    if (index > -1) {
      notebooks.splice(index, 1, notebook);
    } else {
      notebooks.push(notebook);
    }

    await AsyncStorage.setItem(key, JSON.stringify(notebooks));
    resolve('success');
  })
}


export function loadNotebooks(key) {
  return new Promise(async (resolve, reject) => {
    let notebooks = await AsyncStorage.getItem(key);
    resolve(notebooks ? JSON.parse(notebooks) : []);
  })
}

export function saveNote(key, note) {
  return new Promise(async (resolve, reject) => {
    let strNotes = await AsyncStorage.getItem(key);

    let notes = strNotes ? JSON.parse(strNotes) : [];
    let index = _.findIndex(notes, {'id': note.index});
    if (index > -1) {
      notes.splice(index, 1, note);
    } else {
      notes.push(note);
    }

    await AsyncStorage.setItem(key, JSON.stringify(notes));
    resolve('success');
  })
}

export function loadNotes(key) {
  return new Promise(async (resolve, reject) => {
    let notes = await AsyncStorage.getItem(key);
    resolve(notes ? JSON.parse(notes) : []);
  })
}

export function delDifference(key, delArray, differenceBy) {
  return new Promise(async (resolve, reject) => {
    if (!delArray || delArray.length === 0) {
      reject('del array empty');
      return;
    }
    let strData = await AsyncStorage.getItem(key);
    let array = strData ? JSON.parse(strData) : [];
    let result = _.differenceBy(array, delArray, differenceBy);

    await AsyncStorage.setItem(key, JSON.stringify(result));
    resolve('success');
  })
}


export function setNetworkNode(network, url) {
  return new Promise(async (resolve, reject) => {
    await AsyncStorage.setItem(`${k_network_node}_${network}`, url);
    switch (network) {
      case blockchainNetwork.ETH:
        ethCurrentNode = url;
        break;
      case blockchainNetwork.EOS:
        eosCurrentNode = url;
        break;
    }
    resolve('success');
  });
}

export function getNetworkNode() {
  return new Promise(async (resolve, reject) => {
    let ethUrl = await AsyncStorage.getItem(`${k_network_node}_${blockchainNetwork.ETH}`);
    let eosUrl = await AsyncStorage.getItem(`${k_network_node}_${blockchainNetwork.EOS}`);

    if (!ethUrl) {
      ethCurrentNode = eth_nodes[Math.floor(Math.random() * eth_nodes.length)];
      await setNetworkNode(blockchainNetwork.ETH, ethCurrentNode);
    } else {
      ethCurrentNode = ethUrl;
    }

    if (!eosUrl) {
      eosCurrentNode = eos_nodes[Math.floor(Math.random() * eos_nodes.length)];
      await setNetworkNode(blockchainNetwork.EOS, eosCurrentNode);
    } else {
      eosCurrentNode = eosUrl;
    }
    resolve({
      ethNode: ethCurrentNode,
      eosNode: eosCurrentNode
    });
  })
}
