/**
 * Created by yinchong on 2018/11/8
 */


'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Clipboard,
  TouchableOpacity
} from 'react-native'
import {Toast} from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {queryTransaction} from './../actions'
import {backgroundColor, fontColor} from "../utils/constants"
import {blockchainNetwork} from "../api/blockchainStorage";

class Transaction extends React.Component<{}> {

  componentWillMount() {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = this.props;

    let {selectedIdentity} = identityState;

    let {state, setParams} = navigation;
    let {params} = state;
    let transactionHash = params ? params.transactionHash : null;

    if (!transactionHash)
      navigation.goBack();

    dispatch(queryTransaction(selectedIdentity, transactionHash));

    setParams({polyglot});
  }

  renderETH(transaction) {
    let {languageState: {polyglot}} = this.props;
    return transaction.hash ?
      <ScrollView style={{padding: 20}}>

        <View style={styles.item}>
          <TouchableOpacity style={styles.hash} onPress={() => {
            Clipboard.setString(transaction.hash);
            Toast.success(polyglot.t('common.copy_tips'), 1);
          }}>
            <Text style={styles.text}>{`hash: ${transaction.hash}`}</Text>
            <Icon
              name={'content-copy'}
              size={14}
              style={styles.hashIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.item}><Text style={styles.text}>{`blockHash: ${transaction.blockHash}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`blockNumber: ${transaction.blockNumber}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`from: ${transaction.from}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`to: ${transaction.to}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`gas: ${transaction.gas}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`gasPrice: ${transaction.gasPrice}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`input: ${transaction.input}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`nonce: ${transaction.nonce}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`r: ${transaction.r}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`s: ${transaction.s}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`transactionIndex: ${transaction.transactionIndex}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`v: ${transaction.v}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`value: ${transaction.value}`}</Text></View>
      </ScrollView>
      :
      <View style={styles.loading}>
        <ActivityIndicator color={fontColor}/>
      </View>
  }

  renderEOS(transaction) {
    let {languageState: {polyglot}} = this.props;
    return transaction.hash ?
      <ScrollView style={{padding: 20}}>

        <View style={styles.item}>
          <TouchableOpacity style={styles.hash} onPress={() => {
            Clipboard.setString(transaction.hash);
            Toast.success(polyglot.t('common.copy_tips'), 1);
          }}>
            <Text style={styles.text}>{`hash: ${transaction.hash}`}</Text>
            <Icon
              name={'content-copy'}
              size={14}
              style={styles.hashIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.item}><Text style={styles.text}>{`blockHash: ${transaction.blockHash}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`blockNumber: ${transaction.blockNumber}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`from: ${transaction.from}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`to: ${transaction.to}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`gas: ${transaction.gas}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`gasPrice: ${transaction.gasPrice}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`input: ${transaction.input}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`nonce: ${transaction.nonce}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`r: ${transaction.r}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`s: ${transaction.s}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`transactionIndex: ${transaction.transactionIndex}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`v: ${transaction.v}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`value: ${transaction.value}`}</Text></View>
      </ScrollView>
      :
      <View style={styles.loading}>
        <ActivityIndicator color={fontColor}/>
      </View>
  }

  render() {
    let {navigation, blockchainState} = this.props;
    let {transaction} = blockchainState;

    let {state, setParams} = navigation;
    let {params} = state;
    let network = params ? params.network : null;

    if (!transaction)
      transaction = {};

    return (
      <View style={styles.container}>
        {
          network === blockchainNetwork.ETH ? this.renderETH(transaction) : this.renderEOS(transaction)
        }
      </View>
    )
  }
}

Transaction.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('transaction.title') : '',
      headerTitleStyle: Platform.OS === 'android' ? {
        textAlign: 'center',
        alignSelf: 'center',
        flexGrow: 1,
        color: 'white'
      } : {color: 'white'},
      headerRight: (<View/>)
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  item: {
    marginTop: 5,
    padding: 5
  },

  text: {
    color: fontColor
  },

  loading: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hash: {flexDirection: 'row', alignItems: 'center'},
  hashIcon: {color: fontColor, marginTop: 5, marginLeft: 5},

});

const mapStateToProps = state => ({
  identityState: state.identity,
  blockchainState: state.blockchain,
  languageState: state.language
});

export default connect(mapStateToProps)(Transaction);