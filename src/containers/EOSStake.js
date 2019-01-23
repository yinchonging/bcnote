/**
 * Created by yinchong on 2018/12/28
 */

'use strict';
import to from 'await-to-js'
import {connect} from 'react-redux';
import React from 'react'
import {View, StyleSheet} from 'react-native'
import {Button, Toast} from 'antd-mobile-rn';
import prompt from 'react-native-prompt-android';

import Loading from './../components/Loading'
import Radio from './../components/Radio'
import Input from './../components/Input'

import {stake, unstake, getEOSPrice, makeActionCreator} from "../actions";

import {
  backgroundColor,
  fontColor,
  themeColor
} from "../utils/constants"

import {
  EOS_STAKE_TYPE,
  EOS_STAKE_LOADING,
  EOS_UPDATA_EXTRA,
  EOS_STAKE_SUCCESS,
  EOS_STAKE_FAIL,
  EOS_UNSTAKE_SUCCESS,
  EOS_UNSTAKE_FAIL,
} from "../actions/actionTypes"
import {blockchainFactory} from "../api/blockchainStorage";

class EOSStake extends React.Component<{}> {

  constructor() {
    super();
  }

  componentWillMount() {
    const {dispatch, navigation, languageState: {polyglot}} = this.props;
    let {setParams, state} = navigation;
    let {params} = state;
    let action = params.action;

    setParams({polyglot});

    dispatch({
      type: EOS_STAKE_TYPE,
      stakeType: action === 'stake' ? 0 : 1
    });

    dispatch(getEOSPrice());

  }

  shouldComponentUpdate(nextProps, nextState) {
    const {dispatch, eosState, languageState: {polyglot}} = nextProps;
    switch (eosState.type) {
      case EOS_STAKE_SUCCESS:
        dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', false)());
        Toast.success(polyglot.t('eos.stake_success'));
        return true;
      case EOS_STAKE_FAIL:
        dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', false)());
        Toast.fail(polyglot.t('eos.stake_fail'));
        return true;
      case EOS_UNSTAKE_SUCCESS:
        dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', false)());
        Toast.success(polyglot.t('eos.unstake_success'));
        return true;
      case EOS_UNSTAKE_FAIL:
        dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', false)());
        Toast.fail(polyglot.t('eos.unstake_fail'));
        return true;
      default:
        return true;
    }
  }

  _kbConvert = (kb) => {
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

  _timeConvert = (ms) => {
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

  _onSubmit = () => {

    const {
      dispatch,
      languageState: {polyglot},
      identityState: {selectedIdentity},
      eosState
    } = this.props;

    let {stakeType, account} = eosState;
    let cpuAmount = parseFloat(eosState.cpuAmount || 0);
    let netAmount = parseFloat(eosState.netAmount || 0);

    let balance = account.core_liquid_balance ? parseFloat(account.core_liquid_balance) : 0;

    if ((cpuAmount + netAmount) <= 0) {
      return;
    }

    if (stakeType === 0 && (cpuAmount + netAmount) > balance) {
      Toast.fail(polyglot.t('note.insufficient'));
      return;
    }

    let bandwidth = account.self_delegated_bandwidth ? account.self_delegated_bandwidth : {
      net_weight: '0.0000 EOS',
      cpu_weight: '0.0000 EOS'
    };

    if (stakeType === 1 &&
      (cpuAmount > parseFloat(bandwidth.cpu_weight)
        || netAmount > parseFloat(bandwidth.net_weight))) {
      Toast.fail(polyglot.t('note.insufficient'));
      return;
    }


    prompt(polyglot.t('common.input_password'), null, [
      {
        text: polyglot.t('common.cancel'),
        onPress: () => {
        }
      },
      {
        text: polyglot.t('common.ok'),
        onPress: (password) => {
          if (!password || password.trim().length === 0) return;

          dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', true)());

          setTimeout(async () => {
            let blockchainApi = blockchainFactory(selectedIdentity.network);
            let [err, privateKey] = await to(blockchainApi.recoverKeystore(selectedIdentity, password));
            if (err) {
              dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', false)());
              Toast.fail(polyglot.t('common.auth_fail'), 2);
              return;
            }

            switch (stakeType) {
              case 0:
                dispatch(stake(privateKey, account.account_name, account.account_name, cpuAmount, netAmount));
                break;
              case 1:
                dispatch(unstake(privateKey, account.account_name, account.account_name, cpuAmount, netAmount));
                break;
              default:
                dispatch(makeActionCreator(EOS_STAKE_LOADING, 'stakeLoading', false)());
                break;
            }
          }, 500);
        }
      }
    ], {type: 'secure-text', placeholder: polyglot.t('common.password')});

  };

  _onChange = (type, value) => {

    const {
      dispatch,
      languageState: {polyglot},
      eosState: {account, price, stakeType}
    } = this.props;

    value = parseFloat(value);

    if (isNaN(parseFloat(value)) || value <= 0) {
      let action = {
        type: EOS_UPDATA_EXTRA
      };

      if (stakeType === 0) {
        if (type === 'cpu')
          action.stakeCpuExtra = '0.00 ms';
        else
          action.stakeNetExtra = '0.00 kb';
      }
      dispatch(action);
      return;
    }

    let action = {
      type: EOS_UPDATA_EXTRA
    };
    action[type === 'cpu' ? 'cpuAmount' : 'netAmount'] = value;

    switch (stakeType) {
      case 0: {
        let cpuPrice = parseFloat(price.cpu);
        let netPrice = parseFloat(price.net);

        if (type === 'cpu') {
          action.stakeCpuExtra = `≈${this._timeConvert(value / cpuPrice)}`;
          if (cpuPrice === 0) return;
        } else if (type === 'net') {
          action.stakeNetExtra = `≈${this._kbConvert(value / netPrice)}`;
          if (netPrice === 0) return;
        }
      }
        break;
      case 1:
        break;
    }

    dispatch(action);
  };

  render() {

    const {
      dispatch,
      languageState: {polyglot},
      eosState: {account, price, stakeType, stakeLoading, stakeCpuExtra, stakeNetExtra}
    } = this.props;

    let balance = account.core_liquid_balance ? parseFloat(account.core_liquid_balance) : 0;
    let bandwidth = account.self_delegated_bandwidth ? account.self_delegated_bandwidth : {
      net_weight: '0.0000 EOS',
      cpu_weight: '0.0000 EOS'
    };

    return (
      <View style={styles.container}>
        <Loading visible={stakeLoading}/>
        <Radio style={{marginTop: 20}}
               defaultIndex={stakeType}
               items={[polyglot.t('eos.stake'), polyglot.t('eos.reclaim')]}
               onChange={(item, index) => {
                 dispatch({
                   type: EOS_STAKE_TYPE,
                   stakeType: index
                 })
               }}
        />

        <View style={{margin: 20}}>

          <Input
            title={polyglot.t('eos.current_identity')}
            inputColor={fontColor}
            extra={polyglot.t('eos.balance', {
              balance: parseFloat(balance).toFixed(4),
              unit: 'EOS'
            })}
            editable={false}
            defaultValue={account ? account.account_name : ''}
          />

          <Input
            style={{marginTop: 20}}
            title={stakeType === 0 ? polyglot.t('eos.stake_cpu') : polyglot.t('eos.reclaim_cpu')}
            titleExtra={
              stakeType === 0 ?
                `${polyglot.t('eos.staked_amount', {str: bandwidth.cpu_weight})}`
                : `${polyglot.t('eos.reclaim_amount', {str: bandwidth.cpu_weight})}`
            }
            extra={
              stakeType === 0 ? stakeCpuExtra : ''
            }
            placeholder={polyglot.t('eos.stake_placeholder')}
            keyboardType="numeric"
            focus={true}
            editable={true}
            onChange={this._onChange.bind(this, 'cpu')}
          />

          <Input
            style={{marginTop: 20}}
            title={stakeType === 0 ? polyglot.t('eos.stake_net') : polyglot.t('eos.reclaim_net')}
            titleExtra={
              stakeType === 0 ?
                `${polyglot.t('eos.staked_amount', {str: bandwidth.net_weight})}`
                : `${polyglot.t('eos.reclaim_amount', {str: bandwidth.net_weight})}`
            }
            extra={
              stakeType === 0 ? stakeNetExtra : ''
            }
            placeholder={polyglot.t('eos.stake_placeholder')}
            keyboardType="numeric"
            editable={true}
            onChange={this._onChange.bind(this, 'net')}
          />

        </View>

        <Button style={[styles.button, stakeType === 1 ? {backgroundColor: '#f66156', borderColor: '#f66156'} : {}]}
                activeStyle={[styles.buttonActive, stakeType === 1 ? {
                  backgroundColor: '#f66156',
                  borderColor: '#f66156'
                } : {}]}
                type="primary"
                onClick={this._onSubmit}>
          {stakeType === 0 ? polyglot.t('eos.stake') : polyglot.t('eos.reclaim')}
        </Button>
      </View>
    )
  }
}

EOSStake.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('eos.stake') : '',
      headerRight: (<View/>)
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  button: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: themeColor,
    borderRadius: 0,
    borderColor: themeColor
  },

  buttonActive: {
    height: 40,
    backgroundColor: themeColor,
    borderRadius: 0,
    borderColor: themeColor
  },
});

const mapStateToProps = state => ({
  eosState: state.eos,
  languageState: state.language,
  identityState: state.identity,
});

export default connect(mapStateToProps)(EOSStake);