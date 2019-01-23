/**
 * Created by yinchong on 2018/10/26
 */


'use strict';

import React from 'react'
import {Text, View, TouchableOpacity, StyleSheet, StatusBar, ToastAndroid, BackHandler, Platform} from 'react-native'
import {connect} from 'react-redux';
import {Button, Modal} from 'antd-mobile-rn';

import {backgroundColor, semiBlack, themeColor, tabColor, lightGrey, xx_small, navColor} from "../utils/constants"
import {setLanguage,} from "../actions";
import {SET_LANGUAGE_SUCCESS} from './../actions/actionTypes'

const operation = Modal.operation;

class Welcome extends React.Component<{}> {

  constructor() {
    super();
    this.backAt = 0;
  }

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});

    if (Platform.OS === 'android')
      BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonPress);
  }

  componentWillUnmount() {
    if (Platform.OS === 'android')
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonPress);
  }


  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, languageState} = nextProps;

    switch (languageState.type) {
      case SET_LANGUAGE_SUCCESS:
        navigation.setParams({polyglot: languageState.polyglot});
        return true;
      default:
        return true;
    }
  }

  _getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return this._getCurrentRouteName(route);
    }
    return route.routeName;
  };

  _handleBackButtonPress = () => {

    const {navigation, nav, languageState} = this.props;
    const {polyglot} = languageState;

    navigation.goBack(null);

    let routeName = this._getCurrentRouteName(nav);

    if (routeName === 'Welcome') {
      let t = new Date().getTime();
      let duration = t - this.backAt;
      this.backAt = t;
      if (duration > 2000) {
        ToastAndroid.show(polyglot.t('common.exit_suggest'), ToastAndroid.SHORT);
      }
      return !(duration < 2000);
    } else {
      return true;
    }
  };

  render() {

    let {dispatch, languageState: {polyglot, primaryLang}} = this.props;

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={styles.welcome}>
            <Text style={styles.welcomeS1}>
              {polyglot.t('welcome.tips1')}
            </Text>
            <Text style={styles.welcomeS2}>
              {polyglot.t('welcome.tips2')}
            </Text>
          </View>
          <Button style={styles.createButton}
                  activeStyle={styles.createButtonActive}
                  type="primary"
                  onClick={() => this.props.navigation.navigate('WelcomeIdentityCreate')}>
            {polyglot.t('welcome.create_identity')}
          </Button>

          <Button style={styles.importButton}
                  activeStyle={styles.importButtonActive}
                  onClick={() => this.props.navigation.navigate('WelcomeIdentityImport', {isLogin: true})}>
            {polyglot.t('welcome.import_identity')}
          </Button>
        </View>

        <TouchableOpacity style={styles.language} onPress={() => {
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
        }}>
          <Text>{polyglot.t(`welcome.language`)}</Text>
          <Text style={{color: semiBlack}}>{polyglot.t(`common.${primaryLang}`)}</Text>
        </TouchableOpacity>


        <StatusBar barStyle="light-content"/>
      </View>
    )
  }
}

Welcome.navigationOptions = props => {

  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('welcome.title') : ''
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  welcome: {
    height: 136,
    backgroundColor: tabColor,
    alignItems: 'center',
    justifyContent: 'center'
  },

  welcomeS1: {fontWeight: 'bold', fontSize: xx_small, color: 'white', marginTop: -20},
  welcomeS2: {fontWeight: 'bold', fontSize: xx_small, color: 'white', marginTop: 5},

  createButton: {
    height: 40,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: themeColor,
    borderRadius: 0,
    borderColor: themeColor
  },

  createButtonActive: {
    height: 40,
    backgroundColor: themeColor,
    borderRadius: 0,
    borderColor: themeColor
  },

  importButton: {
    height: 40,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: navColor,
    borderRadius: 0,
    borderColor: navColor
  },

  importButtonActive: {
    height: 40,
    backgroundColor: lightGrey,
    borderRadius: 0,
    borderColor: lightGrey
  },

  language: {
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: navColor
  }
});

const mapStateToProps = state => ({
  languageState: state.language,
  nav: state.nav
});

export default connect(mapStateToProps)(Welcome);