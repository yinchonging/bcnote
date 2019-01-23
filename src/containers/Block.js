/**
 * Created by yinchong on 2018/11/27
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

import {queryBlock} from './../actions'
import {backgroundColor, fontColor} from "../utils/constants"
import {blockchainNetwork} from "../api/blockchainStorage";

class Block extends React.Component<{}> {

  componentWillMount() {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = this.props;

    let {selectedIdentity} = identityState;

    let {state, setParams} = navigation;
    let {params} = state;
    let blockNumber = params ? params.blockNumber : null;

    if (!blockNumber) {
      navigation.goBack();
      return;
    }

    dispatch(queryBlock(selectedIdentity, blockNumber));

    setParams({polyglot});
  }


  renderETH(block) {
    let {languageState: {polyglot}} = this.props;
    return block.hash ?
      <ScrollView style={{padding: 20}}>

        <View style={styles.item}>
          <TouchableOpacity style={styles.hash} onPress={() => {
            Clipboard.setString(block.hash);
            Toast.success(polyglot.t('common.copy_tips'), 1);
          }}>
            <Text style={styles.text}>{`hash: ${block.hash}`}</Text>
            <Icon
              name={'content-copy'}
              size={14}
              style={styles.hashIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.item}><Text style={styles.text}>{`difficulty: ${block.difficulty}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`extraData: ${block.extraData}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`gasLimit: ${block.gasLimit}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`gasUsed: ${block.gasUsed}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`logsBloom: ${block.logsBloom}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`miner: ${block.miner}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`mixHash: ${block.mixHash}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`nonce: ${block.nonce}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`number: ${block.number}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`parentHash: ${block.parentHash}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`receiptsRoot: ${block.receiptsRoot}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`sha3Uncles: ${block.sha3Uncles}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`size: ${block.size}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`stateRoot: ${block.stateRoot}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`timestamp: ${block.timestamp}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`totalDifficulty: ${block.totalDifficulty}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`transactions: ${block.transactions}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`transactionsRoot: ${block.transactionsRoot}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`uncles: ${block.uncles}`}</Text></View>
      </ScrollView>
      :
      <View style={styles.loading}>
        <ActivityIndicator color={fontColor}/>
      </View>
  }


  renderEOS(block) {
    let {languageState: {polyglot}} = this.props;
    return block.id ?

      <ScrollView style={{padding: 20}}>
        <View style={styles.item}>
          <TouchableOpacity style={styles.hash} onPress={() => {
            Clipboard.setString(block.id);
            Toast.success(polyglot.t('common.copy_tips'), 1);
          }}>
            <Text style={styles.text}>{`id: ${block.id}`}</Text>
            <Icon
              name={'content-copy'}
              size={14}
              style={styles.hashIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.item}><Text style={styles.text}>{`block_num: ${block.block_num}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`ref_block_prefix: ${block.ref_block_prefix}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`timestamp: ${block.timestamp}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`producer: ${block.producer}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`confirmed: ${block.confirmed}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`previous: ${block.previous}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`transaction_mroot: ${block.transaction_mroot}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`action_mroot: ${block.action_mroot}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`new_producers: ${block.new_producers}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`header_extensions: ${block.header_extensions}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`producer_signature: ${block.producer_signature}`}</Text></View>
        <View style={styles.item}><Text style={styles.text}>{`transactions: ${block.transactions}`}</Text></View>
        <View style={styles.item}><Text
          style={styles.text}>{`block_extensions: ${block.block_extensions}`}</Text></View>
      </ScrollView> :
      <View style={styles.loading}>
        <ActivityIndicator color={fontColor}/>
      </View>
  }

  render() {
    let {navigation, blockchainState} = this.props;
    let {block} = blockchainState;

    let {state, setParams} = navigation;
    let {params} = state;
    let network = params ? params.network : null;

    if (!block)
      block = {};

    return (
      <View style={styles.container}>

        {
          network === blockchainNetwork.ETH ? this.renderETH(block) : this.renderEOS(block)
        }

      </View>
    )
  }
}

Block.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('block.title') : '',
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

export default connect(mapStateToProps)(Block);