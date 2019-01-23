/**
 * Created by yinchong on 2018/12/28
 */
'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Text, View, ScrollView, StyleSheet} from 'react-native'

import {backgroundColor} from "../utils/constants"

class EOSAbout extends React.Component<{}> {
  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  render() {

    const {languageState: {polyglot}} = this.props;

    return (
      <ScrollView style={styles.container}>
        <View style={{margin: 20}}>
          <Text style={{color: 'white'}}>{polyglot.t('eos.about_resources')}</Text>
        </View>
      </ScrollView>
    )
  }
}

EOSAbout.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('eos.about') : '',
    headerRight:(<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  }
});

const mapStateToProps = state => ({
  languageState: state.language
});

export default connect(mapStateToProps)(EOSAbout);