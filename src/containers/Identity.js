/**
 * Created by yinchong on 2018/10/31
 */


'use strict';

import React from 'react'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Clipboard,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native'
import {connect} from 'react-redux';
import QRCode from 'react-native-qrcode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {List, Toast, Modal} from 'antd-mobile-rn';
import prompt from 'react-native-prompt-android';

import Loading from './../components/Loading'
import {blockchainNetwork} from './../api'
import {updateIdentityAlias, getIdentityBalance, exportIdentity, delIdentity, makeActionCreator} from "../actions";
import {
  QUERY_IDENTITY_BALANCE_LOADING,
  VIEW_IDENTITY,
  GET_IDENTITY_BALANCE,
  EXPORT_IDENTITY_SUCCESS,
  EXPORT_IDENTITY_FAIL,

  DELETE_IDENTITY_FAIL,
  DELETE_IDENTITY_SUCCESS
} from './../actions/actionTypes'
import {
  backgroundColor,
  themeColor,
  xx_small,
  tabColor,
  listStyles,
  itemStyles, fontColor
} from "../utils/constants"
import {EXPORT_KEYSTORE_LOADING} from "../actions/actionTypes";

const Item = List.Item;
const operation = Modal.operation;
const iconSize = xx_small;

class Identity extends React.Component<{}> {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

    const {navigation, dispatch, languageState: {polyglot}} = this.props;

    let {state, setParams} = navigation;
    let {params} = state;
    setParams({polyglot});

    let keystore = params.keystore;

    dispatch(makeActionCreator(QUERY_IDENTITY_BALANCE_LOADING, 'balanceLoading', true)());
    dispatch(makeActionCreator(VIEW_IDENTITY, 'currentViewIdentity', keystore)());
    dispatch(getIdentityBalance(keystore, 'identityBalance'));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = nextProps;
    switch (identityState.type) {
      case GET_IDENTITY_BALANCE:
        dispatch(makeActionCreator(QUERY_IDENTITY_BALANCE_LOADING, 'exportLoading', false, 'balanceLoading', false)());
        return true;

      case EXPORT_IDENTITY_SUCCESS:
        dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'exportLoading', false, 'balanceLoading', false)());
        navigation.navigate('Export', {
          exportType: identityState.exportType,
          keystore: identityState.keystore,
          privateKey: identityState.privateKey
        });
        return true;

      case EXPORT_IDENTITY_FAIL:
        dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'exportLoading', false, 'balanceLoading', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;

      case DELETE_IDENTITY_SUCCESS:
        setTimeout(() => {
          dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'exportLoading', false, 'balanceLoading', false)());
          navigation.goBack();
        }, 500);
        return true;
      case DELETE_IDENTITY_FAIL:
        dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'exportLoading', false, 'balanceLoading', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;
      default:
        return true;
    }
  }

  _onExportIdentity = (type) => {

    const {identityState, dispatch, languageState: {polyglot}} = this.props;
    let {currentViewIdentity} = identityState;
    let keystore = currentViewIdentity;

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

          dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'exportLoading', true)());
          setTimeout(() => {
            dispatch(exportIdentity(type, keystore, password))
          }, 500);
        }
      }
    ], {type: 'secure-text', placeholder: polyglot.t('common.password')});
  };

  _onDelIdentity = () => {

    const {identityState, dispatch, languageState: {polyglot}} = this.props;
    let {currentViewIdentity} = identityState;
    let keystore = currentViewIdentity;

    Alert.alert(
      polyglot.t('common.prompt'),
      polyglot.t('identity.del_prompt'),
      [
        {
          text: polyglot.t('common.cancel'),
          onPress: () => {
          }, style: 'cancel'
        },
        {
          text: polyglot.t('common.ok'),
          onPress: () => {

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
                  dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'exportLoading', true)());
                  setTimeout(() => {
                    dispatch(delIdentity(keystore, password))
                  }, 500);
                }
              }
            ], {type: 'secure-text', placeholder: polyglot.t('common.password')});
          }
        },
      ]
    );
  };

  render() {

    const {navigation, dispatch, identityState, languageState: {polyglot}} = this.props;
    let {currentViewIdentity, identityBalance, balanceLoading, exportLoading, receiveVisible} = identityState;
    let keystore = currentViewIdentity;

    return (
      <ScrollView style={styles.container}>
        <Loading visible={exportLoading}/>

        <Modal
          visible={receiveVisible}
          transparent
          animationType={'slide-up'}
          maskClosable={false}
          onClose={() => {
          }}
          title={polyglot.t('identity.receive_address')}
          footer={[{
            text: polyglot.t('common.close'), onPress: () => {
              dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'receiveVisible', false)());
            }
          }]}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.addressBtn}
                              onPress={() => {
                                dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'receiveVisible', false)());
                                Clipboard.setString(keystore.address);
                                Toast.success(polyglot.t('common.copy_tips'), 1);
                              }}>
              <Text
                style={styles.addressBtnFont}>
                {keystore.address && keystore.address.length > 20 ? keystore.address.replace(keystore.address.substring(10, keystore.address.length - 10), '...') : keystore.address}
              </Text>
              <Icon
                name={'content-copy'}
                size={iconSize}
                style={styles.addressBtnIcon}/>
            </TouchableOpacity>
            <QRCode
              value={keystore.address}
              size={200}
              bgColor={tabColor}
              fgColor={themeColor}/>
          </View>
        </Modal>

        <View style={styles.header}>

          <Image style={styles.logo}
                 resizeMode={'contain'}
                 source={keystore.network === blockchainNetwork.ETH ? require('./../images/eth.png') : require('./../images/eos.png')}/>

          <View>
            <Text style={styles.aliasFont}
                  numberOfLines={1}>
              {`${keystore.network} - ${keystore.alias}`}
            </Text>
            <TouchableOpacity style={styles.addressBtn}
                              onPress={() => {
                                Clipboard.setString(keystore.address);
                                Toast.success(polyglot.t('common.copy_tips'), 1);
                              }}>
              <Text
                style={styles.addressBtnFont}>{keystore.address && keystore.address.length > 20 ? keystore.address.replace(keystore.address.substring(10, keystore.address.length - 10), '...') : keystore.address}</Text>
              <Icon
                name={'content-copy'}
                size={iconSize}
                style={styles.addressBtnIcon}/>
            </TouchableOpacity>


            <View style={styles.addressBalance}>

              {
                balanceLoading
                  ?
                  <ActivityIndicator color={fontColor}/>
                  :
                  <Text style={styles.addressBalanceFont}>
                    {identityBalance ? parseFloat(identityBalance).toFixed(4) : 0.00}
                  </Text>
              }

              <Text
                style={styles.addressBalanceUnit}>{keystore.network === blockchainNetwork.ETH ? 'Ether' : 'EOS'}</Text>
            </View>
          </View>
        </View>

        {
          keystore.network === blockchainNetwork.EOS ?
            <List style={styles.list} styles={listStyles}>
              <Item styles={itemStyles} thumb={
                <Icon
                  name={'dashboard'}
                  size={iconSize}
                  style={styles.icon}/>
              } arrow="horizontal" onClick={() => {
                navigation.navigate('EOSResources', {keystore});
              }}>{polyglot.t('eos.resources')}</Item>

              <Item styles={itemStyles} thumb={
                <Icon
                  name={'info'}
                  size={iconSize}
                  style={styles.icon}/>
              } arrow="horizontal" onClick={() => {
                navigation.navigate('EOSPermission', {keystore});
              }}>{polyglot.t('eos.permission_view')}</Item>

            </List> : null
        }


        <List style={styles.list} styles={listStyles}>

          <Item styles={itemStyles} thumb={
            <Icon
              name={'public'}
              size={iconSize}
              style={styles.icon}/>
          } arrow="horizontal" onClick={() => {
            dispatch(makeActionCreator(EXPORT_KEYSTORE_LOADING, 'receiveVisible', true)());
          }}>{polyglot.t('identity.receive_address')}</Item>

        </List>

        <List style={styles.list} styles={listStyles}>

          <Item styles={itemStyles} thumb={
            <Icon
              name={'account-circle'}
              size={iconSize}
              style={styles.icon}/>
          } arrow="horizontal" onClick={() => {
            prompt(polyglot.t('identity.input_alias'), null, [
              {
                text: polyglot.t('common.cancel'), onPress: () => {
              }
              },
              {
                text: polyglot.t('common.ok'), onPress: (value) => {
                dispatch(updateIdentityAlias(keystore, value));
              }
              }
            ], {type: 'plain-text', placeholder: polyglot.t('common.alias')});
          }}>{polyglot.t('identity.updata_alias')}</Item>

          <Item styles={itemStyles} thumb={
            <Icon
              name={'security'}
              size={iconSize}
              style={styles.icon}/>
          } arrow="horizontal"
                onClick={() => {
                  navigation.navigate('ChangePassword', {keystore})
                }}>{polyglot.t('identity.change_password')}</Item>

          <Item styles={itemStyles} thumb={
            <Icon
              name={'description'}
              size={iconSize}
              style={styles.icon}/>
          } arrow="horizontal" onClick={() => {
            operation([
              {
                text: keystore.hint, onPress: () => {
              }
              },
            ]);
          }}>{polyglot.t('common.password_hint')}</Item>

        </List>

        <List style={styles.list} styles={listStyles}>

          <Item styles={itemStyles} thumb={
            <Icon
              name={'backup'}
              size={iconSize}
              style={styles.icon}/>
          } arrow="horizontal"
                onClick={this._onExportIdentity.bind(this, 'keystore')}>{polyglot.t('identity.backup_keystore')}</Item>

          <Item styles={itemStyles} thumb={
            <Icon
              name={'save'}
              size={iconSize}
              style={styles.icon}/>
          } arrow="horizontal"
                onClick={this._onExportIdentity.bind(this, 'privateKey')}>{polyglot.t('identity.export_private_key')}</Item>

        </List>

        <List style={styles.list}
              styles={listStyles}
        >

          <Item styles={Object.assign({}, itemStyles, {
            Content: {
              color: "#f66156",
              fontSize: 17,
              textAlignVertical: "center"
            },
            Arrow: {
              height: 13,
              marginLeft: 8,
              marginTop: 3,
              width: 8,
              tintColor: '#f66156'
            },
          })} thumb={
            <Icon
              name={'delete'}
              size={iconSize}
              style={[styles.icon, {color: '#f66156'}]}/>
          } arrow="horizontal" onClick={this._onDelIdentity}>{polyglot.t('common.delete')}</Item>

        </List>


        <View style={styles.footer}>
          <TouchableOpacity style={styles.importBtn} onPress={() => {
            navigation.navigate('PrivacyPolicy')
          }}>
            <Text style={styles.privacyPolicy}>{`《${polyglot.t('profile.privacy_policy')}》`}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    )
  }
}

Identity.navigationOptions = (props) => {

  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('identity.title') : '',
    headerRight: (<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  list: {marginTop: 20},

  header: {
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 88,
    backgroundColor: tabColor,
    alignItems: 'center',
    flexDirection: 'row'
  },

  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 14
  },

  icon: {
    color: themeColor,
    marginRight: 10
  },

  modalContent: {alignItems: 'center'},
  aliasFont: {fontSize: iconSize, marginTop: 5, color: 'white', width: 200},
  addressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: tabColor
  },
  addressBtnFont: {fontSize: iconSize, color: 'white'},
  addressBtnIcon: {color: 'white', marginLeft: 5},
  addressBalance: {flexDirection: 'row', alignItems: 'center'},
  addressBalanceFont: {fontSize: iconSize, color: 'white'},
  addressBalanceUnit: {marginLeft: 5, color: 'white'},

  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  privacyPolicy: {
    color: fontColor
  }
});

const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language
});

export default connect(mapStateToProps)(Identity);