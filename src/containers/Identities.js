/**
 * Created by yinchong on 2018/10/24
 */


'use strict';

import React from 'react'
import {TouchableOpacity, ScrollView, Text, View, StyleSheet, Image, Alert} from 'react-native'
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {List, Modal} from 'antd-mobile-rn';

import {blockchainNetwork} from '../api'
import {backgroundColor, x_small, themeColor, tabColor, fontColor, itemStyles, listStyles} from "../utils/constants"

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

class Identities extends React.Component<{}> {

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  render() {

    const {navigation, identityState, languageState: {polyglot}} = this.props;

    let {allIdentities} = identityState;
    let eth = [];
    let eos = [];
    let bcnote = [];

    allIdentities.forEach((item) => {
      switch (item.network) {
        case blockchainNetwork.ETH:
          eth.push(item);
          break;
        case blockchainNetwork.EOS:
          eos.push(item);
          break;
        case blockchainNetwork.BCNOTE:
          bcnote.push(item);
          break;
      }
    });


    return (
      <ScrollView style={styles.container}>

        <List styles={listStyles} renderHeader={
          () => {
            return (
              <View style={styles.header}>
                <Image style={styles.logo}
                       resizeMode={'contain'}
                       source={require('./../images/eth.png')}/>
                <Text style={{color: fontColor}}>{polyglot.t('identity.eth_identities')}</Text>
              </View>
            )
          }}
              renderFooter={
                () => {
                  return (
                    <View style={styles.footer}>
                      <TouchableOpacity style={styles.importBtn} onPress={() => {
                        navigation.navigate('IdentityImport', {importNetwork: 'ETH'})
                      }}>
                        <Icon name={'add'} size={14} style={styles.importBtnIcon}/>
                        <Text style={styles.importBtnText}>{polyglot.t('identity.import_eth')}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
              }
        >

          {
            eth.map((item, index) => {
              return (
                <Item styles={itemStyles} key={index} arrow="horizontal" multipleLine onClick={() => {
                  navigation.navigate('Identity', {keystore: item});
                }}>
                  {item.alias}
                  <Brief styles={itemStyles}>
                    {item.address && item.address.length > 20 ? item.address.replace(item.address.substring(10, item.address.length - 10), '...') : item.address}
                  </Brief>
                </Item>
              )
            })
          }
        </List>


        <List styles={listStyles} renderHeader={
          () => {
            return (
              <View style={styles.header}>
                <Image style={styles.logo}
                       resizeMode={'contain'}
                       source={require('./../images/eos.png')}/>
                <Text style={{color: fontColor}}>{polyglot.t('identity.eos_identities')}</Text>
              </View>
            )
          }}
              renderFooter={
                () => {
                  return (
                    <View style={styles.footer}>
                      <TouchableOpacity style={styles.importBtn} onPress={() => {
                        navigation.navigate('IdentityImport', {importNetwork: 'EOS'});
                      }}>
                        <Icon name={'add'} size={14} style={styles.importBtnIcon}/>
                        <Text style={styles.importBtnText}>{polyglot.t('identity.import_eos')}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
              }
        >

          {
            eos.map((item, index) => {
              return (
                <Item styles={itemStyles} key={index} arrow="horizontal" multipleLine onClick={() => {
                  navigation.navigate('Identity', {keystore: item});
                }}>
                  {item.alias}
                  <Brief
                    styles={itemStyles}>{item.address && item.address.length > 20 ? item.address.replace(item.address.substring(10, item.address.length - 10), '...') : item.address}</Brief>
                </Item>
              )
            })
          }
        </List>

      </ScrollView>
    )
  }
}

Identities.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('identity.list') : '',
    headerRight: (<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  logo: {
    width: 30,
    height: 30,
    marginRight: 10
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },

  footer: {
    backgroundColor: tabColor,
    flexDirection: 'row-reverse',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5
  },

  importBtn: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColor,
    padding: 5,
    margin: 5
  },

  importBtnText: {
    fontSize: x_small,
    color: 'white'
  },

  importBtnIcon: {
    color: 'white'
  }
});

const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language
});

export default connect(mapStateToProps)(Identities);