/**
 * Created by yinchong on 2018/12/28
 */
'use strict';

import React from 'react'
import {Text, ScrollView, View, StyleSheet, TouchableOpacity, Clipboard} from 'react-native'
import {connect} from 'react-redux'
import {List, Toast} from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Loading from './../components/Loading'
import {getEOSAccount, makeActionCreator} from "../actions";
import {backgroundColor, x_small, themeColor, tabColor, fontColor, itemStyles, listStyles} from "../utils/constants"
import {
  EOS_RESOURCES_LOADING,
  EOS_GET_ACCOUNT,
  EOS_STAKE_SUCCESS,
  EOS_UNSTAKE_SUCCESS,
  EOS_BUY_RAM_SUCCESS,
  EOS_SELL_RAM_SUCCESS
} from "../actions/actionTypes"

const Item = List.Item;
const Brief = Item.Brief;

class EOSResources extends React.Component<{}> {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

    const {navigation, dispatch, languageState: {polyglot}} = this.props;

    let {state, setParams} = navigation;
    let {params} = state;
    let keystore = params.keystore;

    dispatch({
      type: EOS_RESOURCES_LOADING,
      resourcesLoading: true
    });

    dispatch(getEOSAccount(keystore));
    setParams({polyglot});
  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState) {

    const {navigation, dispatch, eosState} = nextProps;
    switch (eosState.type) {
      case EOS_GET_ACCOUNT:
        dispatch(makeActionCreator(EOS_RESOURCES_LOADING, 'resourcesLoading', false)());
        return true;
      case EOS_STAKE_SUCCESS:
      case EOS_UNSTAKE_SUCCESS:
      case EOS_BUY_RAM_SUCCESS:
      case EOS_SELL_RAM_SUCCESS: {

        let {state} = navigation;
        let {params} = state;
        let keystore = params.keystore;

        setTimeout(() => {
          dispatch({
            type: EOS_RESOURCES_LOADING,
            resourcesLoading: true
          });

          dispatch(getEOSAccount(keystore));
        }, 500)
      }
        return true;
      default:
        return true;
    }
  }

  _bytesConvert = (bytes) => {
    let kb = bytes / 1024;
    let text = `${parseFloat(kb).toFixed(2)} kb`;

    if (kb > 1024) {
      let mb = kb / 1024;
      text = `${parseFloat(mb).toFixed(2)} mb`;

      if (mb > 1024) {
        let gb = mb / 1024;
        text = `${parseFloat(gb).toFixed(2)} GB`;
      }
    }

    return text;
  };

  _timeConvert = (timestamp) => {
    let ms = timestamp / 1000;
    let text = `${parseFloat(ms).toFixed(2)} ms`;

    if (ms > 1000) {
      let s = ms / 1000;
      text = `${parseFloat(s).toFixed(2)} s`;

      if (s > 60) {
        let min = s / 60;
        text = `${parseFloat(min).toFixed(2)} min`;

        if (min > 60) {
          let hour = min / 60;
          text = `${parseFloat(hour).toFixed(2)} h`;
        }
      }
    }

    return text;
  };

  render() {

    const {navigation, languageState: {polyglot}, eosState: {account, resourcesLoading}} = this.props;

    let totalAssets = 0, staked = 0, reclaiming = 0, balance = 0;

    balance = account.core_liquid_balance ? parseFloat(account.core_liquid_balance) : 0;

    let bandwidth = account.self_delegated_bandwidth;
    if (bandwidth)
      staked = (parseFloat(bandwidth.net_weight) + parseFloat(bandwidth.cpu_weight));

    let refund = account.refund_request;
    if (refund)
      reclaiming = (parseFloat(refund.cpu_amount) + parseFloat(refund.net_amount));

    totalAssets = balance + staked + reclaiming;

    return (
      <ScrollView style={styles.container}>

        <TouchableOpacity style={styles.about}
                          onPress={() => {
                            navigation.navigate('EOSAbout')
                          }}>
          <Text style={styles.aboutText}>{polyglot.t('eos.why')}</Text>
        </TouchableOpacity>

        <List styles={listStyles} renderHeader={
          () => {
            return (
              <View style={styles.header}>
                <Text style={{color: fontColor}}>{polyglot.t('eos.assets')}</Text>
              </View>
            )
          }}
        >

          <Item styles={itemStyles} extra={`${parseFloat(totalAssets).toFixed(4)} EOS`}>
            {polyglot.t('eos.total_assets')}
          </Item>
          <Item styles={itemStyles} extra={`${parseFloat(balance).toFixed(4)} EOS`}>
            {polyglot.t('eos.balance', {balance: '', unit: ''})}
          </Item>
          <Item styles={itemStyles} extra={`${parseFloat(staked).toFixed(4)} EOS`}>
            {polyglot.t('eos.staked')}
          </Item>
          <Item styles={itemStyles} extra={`${parseFloat(reclaiming).toFixed(4)} EOS`}>
            {polyglot.t('eos.reclaiming')}
          </Item>
        </List>

        <List styles={listStyles} renderHeader={
          () => {
            return (
              <View style={styles.header}>
                <Text style={{color: fontColor}}>{polyglot.t('eos.ram')}</Text>
              </View>
            )
          }}
              renderFooter={
                () => {
                  return (
                    <View style={styles.footer}>
                      <TouchableOpacity style={styles.footerBtn} onPress={() => {
                        if (!resourcesLoading)
                          navigation.navigate('EOSRam', {action: 'buy'})
                      }}>
                        <Icon name={'add'} size={14} style={styles.footerBtnIcon}/>
                        <Text style={styles.footerBtnText}>{polyglot.t('eos.ram_buy')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.footerBtn, {backgroundColor: '#f66156'}]} onPress={() => {
                        if (!resourcesLoading)
                          navigation.navigate('EOSRam', {action: 'sell'})
                      }}>
                        <Icon name={'remove'} size={14} style={styles.footerBtnIcon}/>
                        <Text style={styles.footerBtnText}>{polyglot.t('eos.ram_sell')}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
              }
        >

          <Item styles={itemStyles} multipleLine onClick={() => {

          }}>
            {`${polyglot.t('eos.available', {str: polyglot.t('eos.ram')})} ${this._bytesConvert(account.ram_quota - account.ram_usage)}`}
            <Brief styles={itemStyles}>
              {`${polyglot.t('eos.ram_quota')} ${this._bytesConvert(account.ram_quota)}`}
              {`,   ${polyglot.t('eos.used')} ${this._bytesConvert(account.ram_usage)}`}
            </Brief>
          </Item>

        </List>

        <List styles={listStyles} renderHeader={
          () => {
            return (
              <View style={styles.header}>
                <Text style={{color: fontColor}}>{polyglot.t('eos.staked')}</Text>
              </View>
            )
          }}
              renderFooter={
                () => {
                  return (
                    <View style={styles.footer}>
                      <TouchableOpacity style={styles.footerBtn} onPress={() => {
                        if (!resourcesLoading)
                          navigation.navigate('EOSStake', {action: 'stake'})
                      }}>
                        <Icon name={'add'} size={14} style={styles.footerBtnIcon}/>
                        <Text style={styles.footerBtnText}>{polyglot.t('eos.stake')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.footerBtn, {backgroundColor: '#f66156'}]} onPress={() => {
                        if (!resourcesLoading)
                          navigation.navigate('EOSStake', {action: 'reclaim'})
                      }}>
                        <Icon name={'remove'} size={14} style={styles.footerBtnIcon}/>
                        <Text style={styles.footerBtnText}>{polyglot.t('eos.reclaim')}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
              }
        >

          <Item styles={itemStyles} multipleLine onClick={() => {

          }}>
            {`${polyglot.t('eos.available', {str: polyglot.t('eos.cpu')})} ${this._timeConvert(account.cpu_limit.available)}`}
            <Brief styles={itemStyles}>
              {`${polyglot.t('eos.bandwidth')} ${this._timeConvert(account.cpu_limit.max)}`}
              {`,   ${polyglot.t('eos.used')} ${this._timeConvert(account.cpu_limit.used)}`}
            </Brief>
          </Item>

          <Item styles={itemStyles} multipleLine onClick={() => {

          }}>
            {`${polyglot.t('eos.available', {str: polyglot.t('eos.net')})} ${this._bytesConvert(account.net_limit.available)}`}
            <Brief styles={itemStyles}>
              {`${polyglot.t('eos.bandwidth')} ${this._bytesConvert(account.net_limit.max)}`}
              {`,   ${polyglot.t('eos.used')} ${this._bytesConvert(account.net_limit.used)}`}

            </Brief>
          </Item>
        </List>
      </ScrollView>
    )
  }
}

EOSResources.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('eos.resources') : '',
      headerRight: (<View/>)
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 15,
  },

  footer: {
    backgroundColor: tabColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },

  icon: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  footerBtn: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
    padding: 5,
    margin: 5
  },

  footerBtnText: {
    fontSize: x_small,
    color: 'white'
  },

  footerBtnIcon: {
    color: 'white'
  },

  about: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: fontColor,
  },

  aboutText: {
    color: fontColor,
    fontStyle: 'italic'
  }
});

const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language,
  eosState: state.eos
});

export default connect(mapStateToProps)(EOSResources);