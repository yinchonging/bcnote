/**
 * Created by yinchong on 2018/9/13
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
  AlertIOS,
  Alert
} from 'react-native'
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {List, Toast, Modal} from 'antd-mobile-rn';
import prompt from 'react-native-prompt-android';

import Loading from './../components/Loading'

import {blockchainNetwork} from './../api'
import {logoutIdentity, getIdentityBalance, setLanguage, makeActionCreator} from "../actions";
import {
  backgroundColor,
  xx_small,
  x_small,
  smaller,
  larger,
  tabColor,
  fontColor,
  itemStyles
} from "../utils/constants"
import {
  QUERY_PROFILE_BALANCE_LOADING,
  GET_PROFILE_BALANCE,
  LOGOUT_IDENTITY_SUCCESS,
  LOGOUT_IDENTITY_FAIL,
  SWITCH_IDENTITY,
  SET_LANGUAGE_SUCCESS,
  DELETE_IDENTITY_SUCCESS
} from './../actions/actionTypes'

const Item = List.Item;
const operation = Modal.operation;

class Profile extends React.Component<{}> {

  componentWillMount() {

    const {navigation, dispatch, identityState, languageState: {polyglot}} = this.props;

    let {selectedIdentity} = identityState;
    dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'balanceLoading', true)());
    dispatch(getIdentityBalance(selectedIdentity, 'profileBalance'));

    navigation.setParams({polyglot});
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = nextProps;

    switch (identityState.type) {
      case GET_PROFILE_BALANCE:
        dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'balanceLoading', false)());
        return true;
      case LOGOUT_IDENTITY_SUCCESS:
        dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'logoutLoading', false)());
        setTimeout(() => navigation.navigate('AuthWelcome'), 500);
        return true;
      case LOGOUT_IDENTITY_FAIL:
        dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'logoutLoading', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;
      case SET_LANGUAGE_SUCCESS:
        navigation.setParams({polyglot});
        return true;
      case SWITCH_IDENTITY:
        setTimeout(() => {
          dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'balanceLoading', true)());
          dispatch(getIdentityBalance(identityState.selectedIdentity, 'profileBalance'));
        }, 500);
        return true;
      case DELETE_IDENTITY_SUCCESS:
        setTimeout(() => {
          dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'balanceLoading', true)());
          dispatch(getIdentityBalance(identityState.selectedIdentity, 'profileBalance'));
        }, 500);
        return true;
      default:
        return true;
    }
  }

  _onLogout = () => {
    const {dispatch, identityState, languageState: {polyglot}} = this.props;

    Alert.alert(
      polyglot.t('common.prompt'),
      polyglot.t('profile.exit_prompt'),
      [
        {
          text: polyglot.t('common.cancel'),
          onPress: () => {
          }, style: 'cancel'
        },
        {
          text: polyglot.t('common.ok'),
          onPress: () => {

            let {selectedIdentity} = identityState;

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

                  dispatch(makeActionCreator(QUERY_PROFILE_BALANCE_LOADING, 'logoutLoading', true)());
                  setTimeout(() => {
                    dispatch(logoutIdentity(selectedIdentity, password))
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
    let {selectedIdentity, profileBalance, balanceLoading, logoutLoading} = identityState;
    let address = selectedIdentity.address;
    return (
      <ScrollView style={styles.container}>
        <Loading visible={logoutLoading}/>
        <TouchableOpacity style={styles.header} onPress={() => {
          navigation.navigate('Identity', {keystore: selectedIdentity});
        }}>

          <Image style={styles.logo}
                 resizeMode={'contain'}
                 source={selectedIdentity.network === blockchainNetwork.ETH ? require('./../images/eth.png') : require('./../images/eos.png')}/>

          <View>
            <Text style={styles.aliasFont}
                  numberOfLines={1}>
              {`${selectedIdentity.network} - ${selectedIdentity.alias}`}
            </Text>

            <TouchableOpacity style={styles.address} onPress={() => {
              Clipboard.setString(address);
              Toast.success(polyglot.t('common.copy_tips'), 1);
            }}>
              <Text
                style={styles.addressFont}>{address && address.length > 20 ? address.replace(address.substring(10, address.length - 10), '...') : address}</Text>
              <Icon
                name={'content-copy'}
                size={14}
                style={styles.addressIcon}/>
            </TouchableOpacity>

            <View style={styles.addressBalance}>
              {
                balanceLoading
                  ?
                  <ActivityIndicator color={fontColor}/>
                  :
                  <Text style={styles.addressBalanceFont}>
                    {profileBalance ? parseFloat(profileBalance).toFixed(4) : 0.00}
                  </Text>
              }

              <Text style={balanceLoading ? {marginLeft: 5, color: 'white'} : styles.addressBalanceUnit}>
                {selectedIdentity.network === blockchainNetwork.ETH ? 'Ether' : 'EOS'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.list}>
          <Item styles={itemStyles} arrow="horizontal"
                onClick={() => {
                  navigation.navigate('Identities');
                }}>{polyglot.t('profile.my_identities')}</Item>

          <Item styles={itemStyles} arrow="horizontal" onClick={() => {
            navigation.navigate('Network');
          }}>{polyglot.t('profile.network')}</Item>

          <Item styles={itemStyles} arrow="horizontal" onClick={() => {
            operation([
              {
                text: '中文',
                onPress: () => {
                  dispatch(setLanguage('zh'));
                }
              },
              {
                text: 'English',
                onPress: () => {
                  dispatch(setLanguage('en'));
                }
              },
            ]);
          }}>{polyglot.t('profile.language')}</Item>

        </View>

        <View style={styles.list}>
          <Item styles={itemStyles} arrow="horizontal" onClick={() => {
            navigation.navigate('Agreement')
          }}>{polyglot.t('profile.agreement')}</Item>

          <Item styles={itemStyles} arrow="horizontal" onClick={() => {
            navigation.navigate('PrivacyPolicy')
          }}>{polyglot.t('profile.privacy_policy')}</Item>

        </View>

        <View style={styles.list}>
          <Item styles={itemStyles} arrow="horizontal" onClick={() => {
            navigation.navigate('Helper');
          }}>{polyglot.t('profile.helper')}</Item>

          <Item styles={itemStyles} arrow="horizontal" onClick={() => {
            navigation.navigate('AboutUS')
          }}>{polyglot.t('profile.about')}</Item>

        </View>

        <View style={styles.list}>
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
            }
          })} arrow="horizontal"
                onClick={this._onLogout}>{polyglot.t('profile.exit')}</Item>
        </View>
        <View style={styles.footer}>
          <Text style={{color: fontColor, fontSize: smaller}}>BCNote v1.0.0</Text>
          <Text style={{color: fontColor, fontSize: smaller}}>Copyright 2016-2019 Release Corporation</Text>
        </View>

      </ScrollView>
    )
  }
}

Profile.navigationOptions = (props) => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('profile.title') : ''
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  balanceLoading: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },

  list: {marginTop: 20},

  header: {
    height: 200,
    backgroundColor: tabColor,
    alignItems: 'center',
    flexDirection: 'row'
  },

  logo: {
    width: 80,
    height: 80,
    marginLeft: 20
  },

  footer: {
    alignItems: 'center',
    margin: 20
  },

  alias: {flexDirection: 'row', alignItems: 'center'},
  aliasFont: {fontSize: xx_small, marginTop: 5, color: 'white', width: 200},
  aliasIcon: {color: 'white', marginTop: 5, marginLeft: 5},
  address: {flexDirection: 'row', alignItems: 'center'},
  addressFont: {fontSize: x_small, marginTop: 5, color: 'white'},
  addressIcon: {color: 'white', marginTop: 5, marginLeft: 5},
  addressBalance: {flexDirection: 'row', alignItems: 'flex-end'},
  addressBalanceFont: {fontSize: larger, color: 'white'},
  addressBalanceUnit: {marginBottom: 5, marginLeft: 5, color: 'white'}
});

const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language
});

export default connect(mapStateToProps)(Profile);