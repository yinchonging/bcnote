/**
 * Created by yinchong on 2018/10/26
 */


'use strict';
import {connect} from 'react-redux';
import React from 'react'
import {View, StatusBar, ActivityIndicator, StyleSheet} from 'react-native'

import {loadIdentity, loadLanguage} from "../actions";
import {getNetworkNode} from "./../api/localStorage"
import {LOAD_IDENTITY} from './../actions/actionTypes'
import {backgroundColor, fontColor} from "../utils/constants"
import {blockchainFactory, blockchainNetwork} from "../api/blockchainStorage";

class Auth extends React.Component<{}> {

  constructor() {
    super();
  }

  componentWillMount() {
    getNetworkNode().then((r) => {
      this.props.dispatch(loadLanguage());
      this.props.dispatch(loadIdentity());
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, identityState} = nextProps;
    switch (identityState.type) {
      case LOAD_IDENTITY:
        let {allIdentities} = identityState;
        if (allIdentities && allIdentities.length > 0) {
          navigation.navigate('AuthMain');
        } else {
          navigation.navigate('AuthWelcome');
        }
        return true;
      default:
        return true;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color={fontColor}/>
        </View>
        <StatusBar barStyle="light-content"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  loading: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  identityState: state.identity
});

export default connect(mapStateToProps)(Auth);
