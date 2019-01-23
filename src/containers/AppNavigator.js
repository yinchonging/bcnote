/**
 * Created by yinchong on 2018/9/13
 */

'use strict';

import React from 'react';
import {View, Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';

import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Auth from './Auth'
import Welcome from './Welcome'
import IdentityCreate from './IdentityCreate'
import IdentityImport from './IdentityImport'
import EOSResources from './EOSResources'
import EOSPermission from './EOSPermission'
import EOSAbout from './EOSAbout'
import EOSRam from './EOSRam'
import EOSStake from './EOSStake'
import Notebooks from './Notebooks'
import IdentitySwitch from './IdentitySwitch'
import NotebookEditor from './NotebookEditor'
import Notes from './Notes'
import Transaction from './Transaction'
import Block from './Block'
import Profile from './Profile'
import Identities from './Identities'
import Identity from './Identity'
import ChangePassword from './ChangePassword'
import Export from './Export'
import Network from './Network'
import Helper from './Helper'
import Agreement from './Agreement'
import PrivacyPolicy from './PrivacyPolicy'
import AboutUS from './AboutUS'

import {themeColor, tabColor, fontColor, small,} from "../utils/constants"

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

const navigationOptions = {
  headerStyle: {
    backgroundColor: tabColor,
    borderBottomColor: tabColor
  },
  headerTitleStyle: Platform.OS === 'android' ? {
    textAlign: 'center',
    alignSelf: 'center',
    flexGrow: 1,
    color: 'white'
  } : {color: 'white'},
  headerTintColor: themeColor
};

const tabIconSize = 26;

const NotebookStack = createStackNavigator({
  Notebook: Notebooks
}, {
  navigationOptions: navigationOptions
});

const ProfileStack = createStackNavigator({
  Profile: Profile
}, {
  navigationOptions: navigationOptions
});

const TabNavigator = createBottomTabNavigator(
  {
    Notebook: {
      screen: NotebookStack,
      navigationOptions: ({navigation, screenProps}) => {
        return ({
          tabBarIcon: ({tintColor, focused}) => (
            <Icon
              name={focused ? 'folder' : 'folder-open'}
              size={tabIconSize}
              style={{color: focused ? 'white' : fontColor}}
            />
          )
        });
      }
    },
    Add: {
      screen: () => <View/>,
      navigationOptions: ({navigation, screenProps}) => {
        return ({
          tabBarIcon: ({tintColor, focused}) => (
            <Image style={Platform.OS === 'android' ? {width: 40, height: 40} : {width: 50, height: 50, marginTop: -20}}
                   source={require('./../images/add.png')}/>
          ),
          tabBarOnPress: (({navigation, defaultHandler}) => {
            navigation.navigate('NotebookEditor');
          })
        });
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: ({navigation, screenProps}) => {
        return ({
          tabBarIcon: ({tintColor, focused}) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              size={tabIconSize}
              style={{color: focused ? 'white' : fontColor}}
            />
          )
        });
      }
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: themeColor,
      inactiveTintColor: 'white',
      labelStyle: {
        fontSize: small,
      },
      style: {
        backgroundColor: tabColor
      },
    },
  }
);


TabNavigator.navigationOptions = ({navigation}) => {
  return {
    header: null, //https://reactnavigation.org/docs/zh-Hans/navigation-options-resolution.html
    tintColor: themeColor,
    ...navigationOptions
  }
};

const MainModalStack = createStackNavigator(
  {
    Tab: TabNavigator,
    IdentitySwitch: IdentitySwitch,
    NotebookEditor: NotebookEditor
  },
  {
    mode: 'modal',
    navigationOptions: navigationOptions
  }
);


MainModalStack.navigationOptions = ({navigation}) => {
  return {
    header: null, //https://reactnavigation.org/docs/zh-Hans/navigation-options-resolution.html
    tintColor: themeColor,
    ...navigationOptions
  }
};


const NoteModalStack = createStackNavigator(
  {
    NoteModal: Notes,
    NotebookEditorModal: NotebookEditor,
    TransactionModal: Transaction,
    BlockModal: Block
  },
  {
    mode: 'modal',
    navigationOptions: navigationOptions
  }
);


NoteModalStack.navigationOptions = ({navigation}) => {
  return {
    header: null, //https://reactnavigation.org/docs/zh-Hans/navigation-options-resolution.html
    tintColor: themeColor,
    ...navigationOptions
  }
};

const MainNavigator = createStackNavigator(
  {
    Main: MainModalStack,
    Notes: NoteModalStack,
    Identities: Identities,
    Identity: Identity,
    ChangePassword: ChangePassword,
    IdentityCreate: IdentityCreate,
    IdentityImport: IdentityImport,
    EOSPermission: EOSPermission,
    EOSResources: EOSResources,
    EOSAbout: EOSAbout,
    EOSRam: EOSRam,
    EOSStake: EOSStake,
    Export: Export,
    Network: Network,
    Agreement: Agreement,
    PrivacyPolicy: PrivacyPolicy,
    AboutUS: AboutUS,
    Helper: Helper
  },
  {
    navigationOptions: navigationOptions
  }
);

const WelcomeNavigator = createStackNavigator(
  {
    Welcome: Welcome,
    WelcomeIdentityCreate: IdentityCreate,
    WelcomeIdentityImport: IdentityImport
  },
  {
    navigationOptions: navigationOptions
  }
);


const RootNavigator = createSwitchNavigator({
    Auth: Auth,
    AuthMain: MainNavigator,
    AuthWelcome: WelcomeNavigator,
  },
  {
    navigationOptions: navigationOptions
  });

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export {RootNavigator, AppNavigator, middleware};
