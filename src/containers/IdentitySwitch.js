/**
 * Created by yinchong on 2018/11/1
 */


'use strict';
import {connect} from 'react-redux';
import React from 'react'
import {Text, View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

import {switchIdentity} from "../actions";
import {small, tabColor, themeColor, fontColor, backgroundColor} from "../utils/constants"

const {width} = Dimensions.get('window');

class IdentitySwitch extends React.Component<{}> {
  render() {

    let {identityState, languageState: {polyglot}} = this.props;

    let {allIdentities, selectedIdentity} = identityState;

    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.tips}>{polyglot.t('switch.tips')}</Text>

          {
            allIdentities.map((item, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  onPress={() => {
                    if (selectedIdentity.address !== item.address) {
                      this.props.dispatch(switchIdentity(item));
                    }
                    this.props.navigation.goBack()
                  }}>

                  <Text style={styles.aliasFont}
                        numberOfLines={1}>
                    {`${item.network} - ${item.alias}`}
                  </Text>

                  {
                    item.address === selectedIdentity.address ?
                      <Icon
                        name={'check'}
                        size={14}
                        style={{color: themeColor, marginLeft: 5}}/> : null
                  }
                </TouchableOpacity>
              )
            })
          }

        </View>
      </ScrollView>
    )
  }
}


IdentitySwitch.navigationOptions = props => {
  const {navigation, dispatch} = props;
  return (
    {
      headerLeft: null,
      headerTitle: (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity style={styles.header} onPress={() => {
            navigation.goBack()
          }}>
            <Icon
              name={'expand-more'}
              size={14}
              style={{color: 'white'}}/>
          </TouchableOpacity>
        </View>

      )
    }
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  tips: {
    backgroundColor: tabColor,
    color: fontColor,
    marginTop: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: small
  },

  header: {
    width: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },

  item: {
    backgroundColor: tabColor,
    height: 40,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  aliasFont: {color: 'white', maxWidth: (width - 80)}
});


const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language
});

export default connect(mapStateToProps)(IdentitySwitch);