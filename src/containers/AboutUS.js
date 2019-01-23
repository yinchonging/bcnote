/**
 * Created by yinchong on 2018/10/25
 */


'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Image, Text, View, StyleSheet, ScrollView, Linking, TouchableOpacity, Clipboard} from 'react-native'
import {List, Modal, Toast} from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode';

import {makeActionCreator} from "../actions";
import {DONATE_MODAL} from './../actions/actionTypes'
import {backgroundColor, listStyles, itemStyles, fontColor, tabColor, themeColor, xx_small} from "../utils/constants"

const Item = List.Item;
const BTC_ADDRESS = '3JCqQHHKUeaHniMVFAVHw9vniwvdVviTrq';
const ETH_ADDRESS = '0x4C38A591d58c698E43DdB16F928583f1F217A820';
const EOS_ADDRESS = 'yinchongbase';

class AboutUS extends React.Component<{}> {

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  render() {

    const {dispatch, aboutState, languageState: {polyglot}} = this.props;

    let {donateVisible, address} = aboutState;

    return (
      <ScrollView style={styles.container}>

        <Modal
          visible={donateVisible}
          transparent
          animationType={'slide-up'}
          maskClosable={false}
          onClose={() => {
          }}
          title={polyglot.t('about.address')}
          footer={[{
            text: polyglot.t('common.close'), onPress: () => {
              dispatch(makeActionCreator(DONATE_MODAL, 'donateVisible', false)());
            }
          }]}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.addressBtn}
                              onPress={() => {
                                dispatch(makeActionCreator(DONATE_MODAL, 'donateVisible', false)());
                                Clipboard.setString(address);
                                Toast.success(polyglot.t('common.copy_tips'), 1);
                              }}>
              <Text
                style={styles.addressBtnFont}>
                {address && address.length > 20 ? address.replace(address.substring(10, address.length - 10), '...') : address}
              </Text>
              <Icon
                name={'content-copy'}
                size={xx_small}
                style={styles.addressBtnIcon}/>
            </TouchableOpacity>
            <QRCode
              value={address}
              size={200}
              bgColor={tabColor}
              fgColor={themeColor}/>
          </View>
        </Modal>

        <View style={styles.header}>

          <Image
            source={require('../images/logo.png')}
            style={styles.logo}/>

        </View>

        <List styles={listStyles}>
          <Item onClick={() => {
            Linking.openURL('http://xrelease.cn');
          }} styles={itemStyles} extra={'http://xrelease.cn'}>Website</Item>

          <Item onClick={() => {
            Linking.canOpenURL('tg://resolve?domain=BCNote').then(supported => {
              if (supported) {
                Linking.openURL('tg://resolve?domain=BCNote');
              }
            });
          }} styles={itemStyles} extra={'@BCNote'}>Telegram</Item>

        </List>

        <List styles={listStyles}
              renderHeader={
                () => {
                  return (
                    <View style={styles.listHeader}>
                      <Text style={{color: fontColor, marginLeft: 5}}>{polyglot.t('about.donate')}</Text>
                    </View>
                  )
                }}
        >
          <Item styles={itemStyles}
                extra={BTC_ADDRESS}
                onClick={() => {
                  dispatch(makeActionCreator(DONATE_MODAL, 'donateVisible', true, 'address', BTC_ADDRESS)());
                }}
          >BTC</Item>

          <Item styles={itemStyles}
                extra={ETH_ADDRESS}
                onClick={() => {
                  dispatch(makeActionCreator(DONATE_MODAL, 'donateVisible', true, 'address', ETH_ADDRESS)());
                }}
          >ETH</Item>

          <Item styles={itemStyles}
                extra={EOS_ADDRESS}
                onClick={() => {
                  dispatch(makeActionCreator(DONATE_MODAL, 'donateVisible', true, 'address', EOS_ADDRESS)());
                }}
          >EOS</Item>

        </List>
      </ScrollView>
    )
  }
}

AboutUS.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('about.title') : '',
    headerRight: (<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    paddingLeft: 10,
  },

  header: {alignItems: 'center', margin: 20},
  logo: {width: 100, height: 100, alignSelf: 'center', borderRadius: 20},

  modalContent: {alignItems: 'center'},
  addressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: tabColor
  },
  addressBtnFont: {fontSize: xx_small, color: 'white'},
  addressBtnIcon: {color: 'white', marginLeft: 5}

});

const mapStateToProps = state => ({
  languageState: state.language,
  aboutState: state.about
});

export default connect(mapStateToProps)(AboutUS);