/**
 * Created by yinchong on 2018/12/28
 */


'use strict';
import to from 'await-to-js'
import {connect} from 'react-redux';
import React from 'react'
import {View, StatusBar, ScrollView, StyleSheet} from 'react-native'
import {Button, Toast} from 'antd-mobile-rn';
import prompt from 'react-native-prompt-android';

import Loading from './../components/Loading'
import Radio from './../components/Radio'
import Input from './../components/Input'

import {
  backgroundColor, fontColor, themeColor
} from "../utils/constants"
import {
  EOS_RAM_TYPE,
  EOS_UPDATA_EXTRA,
  EOS_SELL_RAM_FAIL,
  EOS_SELL_RAM_SUCCESS,
  EOS_BUY_RAM_FAIL,
  EOS_BUY_RAM_SUCCESS,
  EOS_RAM_LOADING
} from "../actions/actionTypes"
import {buyRam, sellRam, getEOSPrice, makeActionCreator} from "../actions";
import {blockchainFactory} from "../api/blockchainStorage";

class EOSRam extends React.Component<{}> {

  constructor() {
    super();
  }

  componentWillMount() {
    const {
      dispatch, navigation,
      languageState: {polyglot}
    } = this.props;

    let {setParams, state} = navigation;
    setParams({polyglot});

    let {params} = state;
    let action = params.action;
    dispatch(getEOSPrice());

    dispatch({
      type: EOS_RAM_TYPE,
      ramType: action === 'buy' ? 0 : 1
    })
  }


  shouldComponentUpdate(nextProps, nextState) {
    const {dispatch, eosState, languageState: {polyglot}} = nextProps;
    switch (eosState.type) {
      case EOS_BUY_RAM_SUCCESS:
        dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', false)());
        Toast.success(polyglot.t('eos.buy_success'));
        return true;
      case EOS_BUY_RAM_FAIL:
        dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', false)());
        Toast.fail(polyglot.t('eos.buy_fail'));
        return true;
      case EOS_SELL_RAM_SUCCESS:
        dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', false)());
        Toast.success(polyglot.t('eos.sell_success'));
        return true;
      case EOS_SELL_RAM_FAIL:
        dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', false)());
        Toast.fail(polyglot.t('eos.sell_fail'));
        return true;
      default:
        return true;
    }
  }


  _kbConvert = (kb) => {
    let fixed = kb < 0.0001 ? 6 : 4;

    let text = `${parseFloat(kb).toFixed(fixed)} kb`;

    if (kb > 1024) {
      let mb = kb / 1024;
      text = `${parseFloat(mb).toFixed(fixed)} mb`;

      if (mb > 1024) {
        let gb = mb / 1024;
        text = `${parseFloat(gb).toFixed(fixed)} GB`;

      }
    }

    return text;
  };

  _onChange = (value) => {
    const {dispatch, eosState: {ramType, price}} = this.props;

    value = parseFloat(value);
    if (isNaN(value) || value <= 0) {
      let action = {
        type: EOS_UPDATA_EXTRA
      };

      if (ramType === 0)
        action.buyExtra = '0.00 kb';
      else
        action.sellExtra = '0.00 EOS';

      dispatch(action);
      return;
    }

    let ramPrice = parseFloat(price.ram);
    if (ramPrice === 0) return;

    switch (ramType) {
      case 0: //buy
      {
        let amount = `≈${this._kbConvert(value / ramPrice)}`;
        dispatch({
          type: EOS_UPDATA_EXTRA,
          buyExtra: amount,
          ramAmount: value
        });
      }
        break;
      case 1: //sell
      {
        if (value <= 1) return;
        let kb = value / 1024;
        let amount = `≈${parseFloat(kb * ramPrice).toFixed(4)} EOS`;
        dispatch({
          type: EOS_UPDATA_EXTRA,
          sellExtra: amount,
          ramAmount: value
        });
      }
        break;
    }
  };

  _onSubmit = () => {
    const {
      dispatch,
      languageState: {polyglot},
      identityState: {selectedIdentity},
      eosState: {account, price, ramType, ramAmount}
    } = this.props;

    if (isNaN(parseFloat(ramAmount)) || parseFloat(ramAmount) <= 0) return;

    let balance = account.core_liquid_balance ? parseFloat(account.core_liquid_balance) : 0;

    if (ramType === 0 && ramAmount > balance) {
      Toast.fail(polyglot.t('note.insufficient'));
      return;
    }

    let ramBalance = account.ram_quota - account.ram_usage;
    if (ramType === 1 && ramAmount > ramBalance) {
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
          dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', true)());

          setTimeout(async () => {
            let blockchainApi = blockchainFactory(selectedIdentity.network);
            let [err, privateKey] = await to(blockchainApi.recoverKeystore(selectedIdentity, password));
            if (err) {
              dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', false)());
              Toast.fail(polyglot.t('common.auth_fail'), 2);
              return;
            }

            switch (ramType) {
              case 0:
                let ramPrice = parseFloat(price.ram);
                let bytes = parseInt(ramAmount / ramPrice * 1024);
                dispatch(buyRam(privateKey, account.account_name, account.account_name, bytes));
                break;
              case 1:
                dispatch(sellRam(privateKey, account.account_name, ramAmount));
                break;
              default:
                dispatch(makeActionCreator(EOS_RAM_LOADING, 'ramLoading', false)());
                break;
            }
          }, 500);
        }
      }
    ], {type: 'secure-text', placeholder: polyglot.t('common.password')});

  };

  render() {
    const {
      dispatch,
      languageState: {polyglot},
      eosState: {account, ramType, price, buyExtra, sellExtra, ramLoading}
    } = this.props;

    let balance = account.core_liquid_balance ? parseFloat(account.core_liquid_balance) : 0;
    let ramBalance = account.ram_quota - account.ram_usage;

    return (
      <ScrollView style={styles.container}>
        <Loading visible={ramLoading}/>

        <Radio style={{marginTop: 20}}
               defaultIndex={ramType}
               items={[polyglot.t('eos.ram_buy'), polyglot.t('eos.ram_sell')]}
               onChange={(item, index) => {
                 dispatch({
                   type: EOS_RAM_TYPE,
                   ramType: index,
                 })
               }}
        />

        <View style={{margin: 20}}>
          <Input
            title={polyglot.t('eos.current_identity')}
            inputColor={fontColor}
            extra={polyglot.t('eos.balance', {
              balance: ramType === 0 ? parseFloat(balance).toFixed(4) : ramBalance,
              unit: ramType === 0 ? 'EOS' : 'bytes'
            })}
            editable={false}
            defaultValue={account ? account.account_name : ''}
          />
          <Input
            style={{marginTop: 20}}
            title={ramType === 0 ? polyglot.t('eos.purchase') : polyglot.t('eos.sell')}
            titleExtra={price ? `${polyglot.t('eos.ram')} ${parseFloat(price.ram).toFixed(4)} EOS/kb` : ''}
            placeholder={ramType === 0 ? polyglot.t('eos.purchase_placeholder') : polyglot.t('eos.sell_placeholder')}
            keyboardType="numeric"
            extra={ramType === 0 ? buyExtra : sellExtra}
            focus={true}
            editable={true}
            onChange={this._onChange}
          />
        </View>

        <Button style={[styles.button, ramType === 1 ? {backgroundColor: '#f66156', borderColor: '#f66156'} : {}]}
                activeStyle={[styles.buttonActive, ramType === 1 ? {
                  backgroundColor: '#f66156',
                  borderColor: '#f66156'
                } : {}]}
                type="primary"
                onClick={this._onSubmit}>
          {ramType === 0 ? polyglot.t('eos.ram_buy') : polyglot.t('eos.ram_sell')}
        </Button>

      </ScrollView>
    )
  }
}

EOSRam.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('eos.ram') : '',
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

export default connect(mapStateToProps)(EOSRam);