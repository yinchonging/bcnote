/**
 * Created by yinchong on 2018/12/28
 */
'use strict';
import React from 'react'
import {Text, ScrollView, View, StyleSheet, TextInput, Clipboard} from 'react-native'
import {connect} from 'react-redux'
import {List, Toast} from 'antd-mobile-rn';

import {getEOSAccount, makeActionCreator} from "../actions";
import {backgroundColor, x_small, themeColor, tabColor, fontColor, itemStyles, listStyles} from "../utils/constants"

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
    dispatch(getEOSAccount(keystore));

    setParams({polyglot});
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }


  render() {

    const {navigation, languageState: {polyglot}, eosState: {account}} = this.props;

    return (
      <ScrollView style={styles.container}>{
        account.permissions.map((item, index) => {
          return (
            <List key={index} styles={listStyles} renderHeader={
              () => {
                return (
                  <View style={styles.header}>
                    <Text
                      style={{color: fontColor}}>{`${polyglot.t('eos.role', {name: item.perm_name})} [${polyglot.t('eos.threshold', {threshold: item.required_auth.threshold})}]`}</Text>
                  </View>
                )
              }}
            >
              {
                item.required_auth.keys.map((publicKey, index) => {
                  return (
                    <Item key={index} styles={itemStyles} arrow="horizontal" multipleLine onClick={() => {
                      Clipboard.setString(publicKey.key);
                      Toast.success(polyglot.t('common.copy_tips'), 1);
                    }}>
                      {polyglot.t('eos.weight', {weight: publicKey.weight})}
                      <Brief styles={itemStyles}>
                        {publicKey.key}
                      </Brief>
                    </Item>
                  );
                })
              }
            </List>
          )
        })
      }
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
      title: polyglot ? polyglot.t('eos.permission_view') : '',
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

});

const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language,
  eosState: state.eos
});

export default connect(mapStateToProps)(EOSResources);