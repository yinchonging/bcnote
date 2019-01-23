/**
 * Created by yinchong on 2018/11/1
 */


'use strict';
import {connect} from 'react-redux';
import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  ActivityIndicator,
  AlertIOS,
  Platform
} from 'react-native'

import {Modal, Toast} from 'antd-mobile-rn';
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../components/Loading'
import prompt from 'react-native-prompt-android';
import {queryNotes, unlockNote, unlockNotebook, makeActionCreator} from './../actions'
import {
  backgroundColor, themeColor, x_small, xx_small, lineColor, tabColor, fontColor, lightGrey
} from "../utils/constants"
import {
  QUERY_NOTES,
  QUERY_NOTE_LOADING,
  UNLOCK_NOTEBOOK_SUCCESS,
  UNLOCK_NOTEBOOK_FAIL,
  UNLOCK_NOTE_SUCCESS,
  UNLOCK_NOTE_FAIL
} from './../actions/actionTypes'
import {UNLOCK_NOTE_LOADING} from "../actions/actionTypes";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Notes extends React.Component<{}> {

  componentWillMount() {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = this.props;

    let {state, setParams} = navigation;
    let {params} = state;
    let notebook = params.notebook;
    setParams({onListUnlockClick: this._onListUnlockClick, polyglot});

    dispatch(makeActionCreator(QUERY_NOTE_LOADING, 'noteLoading', true)());
    dispatch(queryNotes(identityState.selectedIdentity, notebook.id));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, notebookState, dispatch, languageState: {polyglot}} = nextProps;
    switch (notebookState.type) {
      case QUERY_NOTES:
        dispatch(makeActionCreator(QUERY_NOTE_LOADING, 'noteLoading', false)());
        return true;
      case UNLOCK_NOTEBOOK_SUCCESS:
        dispatch(makeActionCreator(UNLOCK_NOTE_LOADING, 'visible', false)());
        navigation.setParams({unlock: true});
        return true;
      case UNLOCK_NOTEBOOK_FAIL:
        dispatch(makeActionCreator(UNLOCK_NOTE_LOADING, 'visible', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;
      case UNLOCK_NOTE_SUCCESS:
        dispatch(makeActionCreator(UNLOCK_NOTE_LOADING, 'visible', false)());

        return true;
      case UNLOCK_NOTE_FAIL:
        dispatch(makeActionCreator(UNLOCK_NOTE_LOADING, 'visible', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;
      default:
        return true;
    }
  }

  _keyExtractor = (item, index) => index.toString();

  _onListUnlockClick = () => {

    const {dispatch, identityState, notebookState, languageState: {polyglot}} = this.props;

    prompt(polyglot.t('common.input_password'), null, [
      {
        text: polyglot.t('common.cancel'),
        onPress: () => {
        }
      },
      {
        text: polyglot.t('common.ok'),
        onPress: (password) => {
          if (!password || password.trim().length === 0) return;
          dispatch(makeActionCreator(UNLOCK_NOTE_LOADING, 'visible', true)());
          setTimeout(() => {
            let {selectedIdentity} = identityState;
            let {notes} = notebookState;
            dispatch(unlockNotebook(selectedIdentity, password, notes));
          }, 500)

        }
      }
    ], {type: 'secure-text', placeholder: polyglot.t('common.password')});
  };

  _onListItemClick = (item, index) => {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = this.props;

    if (!item.lock) {
      let {state} = navigation;
      let {params} = state;
      let notebook = params.notebook;
      navigation.navigate('NotebookEditorModal', {notebook: notebook, note: item});
      return;
    }

    prompt(polyglot.t('common.input_password'), null, [
      {
        text: polyglot.t('common.cancel'),
        onPress: () => {
        }
      },
      {
        text: polyglot.t('common.ok'),
        onPress: (password) => {
          if (!password || password.trim().length === 0) return;
          dispatch(makeActionCreator(UNLOCK_NOTE_LOADING, 'visible', true)());
          setTimeout(() => {
            let {selectedIdentity} = identityState;
            item.edit = true;
            dispatch(unlockNote(selectedIdentity, password, item));
          }, 500)
        }
      }
    ], {type: 'secure-text', placeholder: polyglot.t('common.password')});
  };

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={[styles.listItem, item.lock ? {} : {backgroundColor: themeColor}]}
                        onPress={this._onListItemClick.bind(this, item, index)}>
        <View style={styles.listItemTitle}>
          <Text style={[styles.listItemTitleFont, {
            color: item.lock ? fontColor : 'white'
          }]}>No.{index + 1}</Text>

          <Icon
            name={item.lock ? 'visibility-off' : 'visibility'}
            size={20}
            style={{color: item.lock ? fontColor : 'white'}}
          />
        </View>
        <Text style={[styles.listItemContent, {color: item.lock ? fontColor : 'white'}]}>{item.content}</Text>

        <View style={styles.listItemFooter}>
          <Text
            style={[styles.listItemTime, item.lock ? {} : {color: 'white'}]}>{moment.unix(item.at).format("YYYY-MM-DD HH:MM:ss")}</Text>

          <TouchableOpacity style={{width: 20}} onPress={() => {

            let {identityState} = this.props;
            let {selectedIdentity} = identityState;

            if (item.confirmed)
              this.props.navigation.navigate('BlockModal', {
                blockNumber: item.number,
                network: selectedIdentity.network
              });
            else
              this.props.navigation.navigate('TransactionModal', {
                transactionHash: item.transactionHash,
                network: selectedIdentity.network
              })
          }}>
            <Icon
              name={item.confirmed ? 'done-all' : 'watch-later'}
              size={20}
              style={{color: item.lock ? item.confirmed ? fontColor : 'rgba(255, 152, 0, 1)' : 'white'}}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  render() {

    let {navigation, identityState, notebookState, languageState: {polyglot}} = this.props;
    let {selectedIdentity} = identityState;
    let {notes, noteLoading, visible} = notebookState;

    let {state} = navigation;
    let {params} = state;
    let notebook = params.notebook;


    return (
      <View style={styles.container}>

        <Loading visible={visible}/>

        <View style={styles.notebook}>
          <Icon
            name={'note-add'}
            size={xx_small}
            style={styles.notebookIcon}/>
          <Text style={styles.notebookFont}>
            {`${selectedIdentity.network} - ${selectedIdentity.alias} - ${notebook ? notebook.name : ''}`}
          </Text>
        </View>

        {
          noteLoading ?
            <View style={styles.noteLoading}>
              <ActivityIndicator color={fontColor}/>
            </View>
            :
            <AnimatedFlatList
              style={styles.list}
              ref={(ref) => {
                this._listRef = ref
              }}
              keyExtractor={this._keyExtractor}
              data={notes}
              horizontal={false}
              legacyImplementation={false}
              numColumns={1}
              refreshing={false}
              renderItem={this._renderItem}
              ListFooterComponent={(notes && notes.length > 0 ?
                <Text style={styles.end}>{polyglot.t('note.count', {count: notes.length})}</Text> : null)}
            />
        }
      </View>
    )
  }
}

Notes.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let {notebook, polyglot} = params;

  return (
    {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon
            name={'navigate-before'}
            size={40}
            style={{color: themeColor, marginRight: 10}}
          />
        </TouchableOpacity>
      ),
      title: polyglot ? polyglot.t('note.title') : '',
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {
            if (params && params.onListUnlockClick && !params.unlock)
              params.onListUnlockClick();
          }}>
            <Icon
              name={params && params.unlock ? 'visibility' : 'visibility-off'}
              size={26}
              style={{color: themeColor, marginRight: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('NotebookEditorModal', {notebook})
          }}>
            <Icon
              name={'edit'}
              size={26}
              style={{color: themeColor, marginRight: 10}}
            />
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

  noteLoading: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center'
  },

  notebook: {
    flexDirection: 'row',
    alignItems: 'center',
    color: themeColor,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: lineColor
  },

  notebookIcon: {color: fontColor, fontSize: xx_small},
  notebookFont: {color: fontColor, fontSize: xx_small, marginLeft: 5, fontWeight: 'bold'},


  list: {flex: 1},

  listItem: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: tabColor
  },

  listItemTitle: {flexDirection: 'row'},
  listItemTitleFont: {fontSize: xx_small, flex: 1, color: 'white', fontWeight: 'bold'},
  listItemContent: {fontSize: x_small, marginTop: 5, color: fontColor},
  listItemFooter: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 5},
  listItemTime: {color: fontColor, fontSize: x_small},

  unconfirmed: {
    alignItems: 'flex-end'
  },

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

});


const mapStateToProps = state => ({
  identityState: state.identity,
  notebookState: state.notebook,
  languageState: state.language
});

export default connect(mapStateToProps)(Notes);