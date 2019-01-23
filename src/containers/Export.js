/**
 * Created by yinchong on 2018/10/31
 */
'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Clipboard, Text, View, StyleSheet, ScrollView, TextInput} from 'react-native'
import {Button, Toast} from 'antd-mobile-rn';

import {backgroundColor, themeColor, tabColor} from "../utils/constants"

class Export extends React.Component<{}> {

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  render() {

    const {navigation, languageState: {polyglot}} = this.props;

    let {state} = navigation;
    let {params} = state;
    let keystore = params.keystore;
    let privateKey = params.privateKey;
    let exportType = params.exportType;

    return (
      <ScrollView style={styles.container}>

        <View style={styles.tips}>

          <Text style={{color: themeColor}}>{polyglot.t('export.tips1_title')}</Text>
          <Text style={{color: 'white'}}>{polyglot.t('export.tips1_content')}</Text>

          <Text style={{color: themeColor, marginTop: 10}}>{polyglot.t('export.tips2_title')}</Text>
          <Text style={{color: 'white'}}>{polyglot.t('export.tips2_content')}</Text>

          <Text style={{color: themeColor, marginTop: 10}}>{polyglot.t('export.tips3_title')}</Text>
          <Text style={{color: 'white'}}>{polyglot.t('export.tips3_content')}</Text>
        </View>

        <TextInput
          style={styles.textarea}
          multiline={true}
          textAlignVertical='top' //for android
          editable={false}
          selectionColor={themeColor}
          returnKeyType={'next'}
          autoCapitalize={'none'}
          placeholderTextColor={'rgba(200,200,200,1)'}
          underlineColorAndroid='rgba(0,0,0,0)'
          clearButtonMode={"always"}
          blurOnSubmit={true}
          value={exportType === 'keystore' ? JSON.stringify(keystore) : privateKey}
          onChangeText={(text) => {
          }}
        />

        <Button style={styles.button}
                activeStyle={styles.buttonActive}
                type="primary"
                onClick={() => {
                  Clipboard.setString(exportType === 'keystore' ? JSON.stringify(keystore) : privateKey);
                  Toast.success(polyglot.t('common.copy_tips'), 1);
                }}>{polyglot.t('common.copy')}</Button>


      </ScrollView>
    )
  }
}

Export.navigationOptions = props => {

  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('export.title') : '',
    headerRight: (<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  tips: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    backgroundColor: tabColor
  },

  textarea: {
    color: 'white',
    backgroundColor: tabColor,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    minHeight: 88,
    padding: 10,
  },

  button: {
    height: 40,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: themeColor,
    borderColor: themeColor,
    borderRadius: 0
  },

  buttonActive: {
    height: 40,
    backgroundColor: themeColor,
    borderColor: themeColor,
    borderRadius: 0
  },
});

const mapStateToProps = state => ({
  languageState: state.language
});

export default connect(mapStateToProps)(Export);