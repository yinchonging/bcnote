/**
 * Created by yinchong on 2018/9/13
 */


'use strict';

import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  StatusBar,
  ActivityIndicator,
  Dimensions, ToastAndroid, BackHandler, Platform, Alert
} from 'react-native'
import {connect} from 'react-redux';
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {List} from 'antd-mobile-rn';

import {queryNotebooks, makeActionCreator} from "../actions";
import {
  backgroundColor,
  xx_small,
  x_small,
  tabColor,
  fontColor,
  listStyles,
  itemStyles, themeColor
} from "../utils/constants"
import {
  QUERY_NOTEBOOKS,
  QUERY_NOTEBOOK_LOADING,
  SWITCH_IDENTITY,
  UPDATE_IDENTITY_ALIAS,
  DELETE_IDENTITY_SUCCESS
} from "../actions/actionTypes";
import {blockchainFactory, blockchainNetwork} from "../api/blockchainStorage";

const Item = List.Item;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const {width} = Dimensions.get('window');

class Notebooks extends React.Component<{}> {

  constructor(props) {
    super(props);
    this.backAt = 0;
  }

  componentWillMount() {

    const {navigation, identityState, dispatch} = this.props;
    navigation.setParams({selectedIdentity: identityState.selectedIdentity});

    dispatch(makeActionCreator(QUERY_NOTEBOOK_LOADING, 'notebookLoading', true)());
    dispatch(queryNotebooks(identityState.selectedIdentity));

    if (Platform.OS === 'android')
      BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonPress);
  }

  componentWillUnmount() {
    if (Platform.OS === 'android')
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonPress);
  }

  shouldComponentUpdate(nextProps, nextState) {

    const {navigation, identityState, dispatch} = nextProps;
    switch (identityState.type) {
      case QUERY_NOTEBOOKS:
        dispatch(makeActionCreator(QUERY_NOTEBOOK_LOADING, 'notebookLoading', false)());
        return true;
      case SWITCH_IDENTITY:
        setTimeout(() => {
          navigation.setParams({selectedIdentity: identityState.selectedIdentity});
          dispatch(makeActionCreator(QUERY_NOTEBOOK_LOADING, 'notebookLoading', true)());
          dispatch(queryNotebooks(identityState.selectedIdentity));
        }, 300);
        return true;
      case UPDATE_IDENTITY_ALIAS:
        navigation.setParams({selectedIdentity: identityState.selectedIdentity});
        return true;
      case DELETE_IDENTITY_SUCCESS:
        setTimeout(() => {
          navigation.setParams({selectedIdentity: identityState.selectedIdentity});
          dispatch(queryNotebooks(identityState.selectedIdentity));
        }, 500);
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

    let tabs = ['Notebook', 'Add', 'Profile'];
    if (tabs.indexOf(routeName) !== -1) {
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

  _onRefresh = () => {
    const {dispatch, identityState} = this.props;
    dispatch(makeActionCreator(QUERY_NOTEBOOK_LOADING, 'notebookLoading', true)());
    dispatch(queryNotebooks(identityState.selectedIdentity));
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item, index}) => {
    const {navigation, languageState: {polyglot}} = this.props;

    return (
      <TouchableOpacity key={index} style={styles.listItem} onPress={() => {
        navigation.navigate('Notes', {notebook: item})
      }}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        <Text style={styles.listItemCount}>{polyglot.t('notebook.note_count', {count: item.noteCount || 1})}</Text>
        <Text style={styles.listItemTime}>{moment.unix(item.at).format("YYYY-MM-DD HH:MM:ss")}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation, identityState, notebookState, languageState: {polyglot}} = this.props;

    let {notebooks, notebookLoading} = notebookState;

    return (
      <View style={styles.container}>

        {
          identityState.selectedIdentity.network === blockchainNetwork.EOS ?
            <List style={{marginTop: 20, marginLeft: 10, marginRight: 10}} styles={listStyles}>
              <Item styles={itemStyles} thumb={
                <Icon
                  name={'dashboard'}
                  size={xx_small}
                  style={{
                    color: themeColor,
                    marginRight: 10
                  }}/>
              } arrow="horizontal" onClick={() => {
                navigation.navigate('EOSResources', {keystore: identityState.selectedIdentity});
              }}>{polyglot.t('eos.resources')}</Item>
            </List> : null
        }

        {
          notebookLoading ?
            <View style={styles.notebookLoading}>
              <ActivityIndicator color={fontColor}/>
            </View>
            :
            <AnimatedFlatList
              style={styles.list}
              ref={(ref) => {
                this._listRef = ref
              }}
              keyExtractor={this._keyExtractor}
              onRefresh={this._onRefresh}
              data={notebooks}
              horizontal={false}
              legacyImplementation={false}
              numColumns={1}
              refreshing={false}
              renderItem={this._renderItem}
              ListEmptyComponent={(<Text style={styles.empty}>{polyglot.t('common.no_result')}</Text>)}
              ListFooterComponent={(notebooks && notebooks.length > 0 ?
                <Text
                  style={styles.end}>{polyglot.t('notebook.notebook_count', {count: notebooks.length})}</Text> : null)}
            />
        }
        <StatusBar barStyle="light-content"/>
      </View>
    )
  }
}

Notebooks.navigationOptions = props => {
  const {navigation} = props;
  const {state} = navigation;
  const {params} = state;

  let title = 'Notebook';
  if (params && params.selectedIdentity) {
    let {selectedIdentity} = params;
    title = `${selectedIdentity.network} - ${selectedIdentity.alias}`;
  }

  return (
    {
      headerTitle: (
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity style={styles.headerTitle} onPress={() => {
            navigation.navigate('IdentitySwitch')
          }}>
            <Text style={styles.headerTitleFont}
                  numberOfLines={1}>{title}</Text>

            <Icon
              name={'expand-more'}
              size={14}
              style={{color: 'white', fontWeight: 'bold'}}/>
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

  notebookLoading: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },

  list: {flex: 1},

  listItem: {
    backgroundColor: tabColor,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },

  listItemTitle: {fontSize: xx_small, color: 'white', fontWeight: 'bold'},
  listItemCount: {
    fontSize: x_small,
    color: fontColor,
    marginTop: 5,
    marginBottom: 5
  },
  listItemTime: {fontSize: x_small, color: fontColor},

  empty: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 188,
    color: fontColor
  },

  end: {
    margin: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: fontColor
  },

  headerTitle: {
    flexDirection: 'row',
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },

  headerTitleFont: {color: 'white', fontWeight: 'bold', maxWidth: (width - 80)}
});

const mapStateToProps = state => ({
  identityState: state.identity,
  notebookState: state.notebook,
  languageState: state.language,
  nav: state.nav
});

export default connect(mapStateToProps)(Notebooks);