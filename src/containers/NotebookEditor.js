/**
 * Created by yinchong on 2018/11/1
 */


'use strict';
/**
 * Created by yinchong on 2018/11/1
 */

'use strict';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import React from 'react'
import {TextInput, Text, ScrollView, View, StyleSheet, AlertIOS, Alert, Platform} from 'react-native'
import {Button, Modal, Toast} from 'antd-mobile-rn';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uuid from 'uuid'
import Loading from './../components/Loading'
import to from 'await-to-js'
import prompt from 'react-native-prompt-android';
import {upsertNotebook, makeActionCreator} from "../actions";
import {blockchainFactory} from "../api";
import {
  UPSERT_NOTE_SUCCESS,
  UPSERT_NOTE_FAIL,
  UPSERT_NOTEBOOK_SUCCESS,
  UPSERT_NOTEBOOK_FAIL,
  UPSERT_NOTE_LOADING,
  INSUFFICIENT_FUNDS
} from '../actions/actionTypes'
import {lightGrey, themeColor, xx_small, smaller, small, lineColor, navColor, tabColor} from "../utils/constants"
import {blockchainNetwork} from "../api/blockchainStorage";

const renderTitleInput = (props) => {
  let {input: {onChange, value}, meta: {initial}, polyglot, focus} = props;
  return <TextInput
    style={[styles.input, styles.title]}
    returnKeyType={'next'}
    selectionColor={themeColor}
    placeholder={polyglot.t('note.notebook')}
    placeholderTextColor={'rgba(200,200,200,1)'}
    underlineColorAndroid='rgba(0,0,0,0)'
    onChangeText={onChange}
    defaultValue={initial}
    autoFocus={focus}
  />
};

const renderNoteInput = (props) => {
  let {input: {onChange, value}, meta: {initial}, polyglot, focus} = props;
  return <TextInput
    style={styles.textarea}
    multiline={true}
    textAlignVertical='top' //for android
    returnKeyType={'next'}
    selectionColor={themeColor}
    placeholder={polyglot.t('note.write')}
    placeholderTextColor={'rgba(200,200,200,1)'}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
    defaultValue={initial}
    autoFocus={focus}
  />
};

const required = value => {
  return value && value.trim().length > 0 ? undefined : 'Required'
};

let Form = props => {
  const {handleSubmit, polyglot} = props;

  let {initialValues: {notebookName, noteContent, focus}} = props;
  return (
    <View>
      <Field name="notebookName" component={renderTitleInput} meta={{initial: notebookName}} validate={required}
             polyglot={polyglot} focus={focus === 'create'}/>
      <Field name="noteContent" component={renderNoteInput} meta={{initial: noteContent}} validate={required}
             polyglot={polyglot} focus={focus !== 'create'}/>

      <Button style={styles.button}
              loading={props.loading}
              disabled={props.loading}
              activeStyle={styles.buttonActive}
              type="primary"
              onClick={handleSubmit(props.onSubmit)}>{polyglot.t('note.done')}</Button>
    </View>
  )
};

Form = reduxForm({
  form: 'notebookEditorForm'
})(Form);

class NotebookEditor extends React.Component<{}> {
  constructor(props) {
    super(props);

    const {navigation} = props;
    let {state} = navigation;
    let {params} = state;
    let notebook = params ? params.notebook : null;
    let note = params ? params.note : null;

    if (notebook && note) {
      this.editor = 'update';
    } else if (notebook && !note) {
      this.editor = 'insert';
    } else if (!notebook && !note) {
      this.editor = 'create';
    }
  }

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, notebookState, dispatch, languageState: {polyglot}} = nextProps;
    switch (notebookState.type) {
      case UPSERT_NOTEBOOK_SUCCESS:
      case UPSERT_NOTE_SUCCESS:
        dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
        setTimeout(() => navigation.goBack(), 500);
        return true;
      case UPSERT_NOTE_FAIL:
      case UPSERT_NOTEBOOK_FAIL:
        dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;
      case INSUFFICIENT_FUNDS:
        dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
        setTimeout(() => Toast.fail(polyglot.t('note.insufficient'), 2), 500);
        return true;
      default:
        return true;
    }
  }

  _getUpsertParams = async (values) => {
    let {navigation, identityState} = this.props;
    let {selectedIdentity} = identityState;
    let blockchainApi = blockchainFactory(selectedIdentity.network);

    let {state} = navigation;
    let {params} = state;
    let notebook = params ? params.notebook : null;
    let note = params ? params.note : null;
    let notebookId, noteId;

    let upsertNotebookObj = {
      name: values.notebookName,
      at: new Date().getTime() / 1000
    };

    switch (this.editor) {
      case 'create': {
        if (selectedIdentity.network === blockchainNetwork.ETH) {
          notebookId = uuid.v4().replace(/-/g, '');
          noteId = uuid.v4().replace(/-/g, '');
        }

        if (selectedIdentity.network === blockchainNetwork.EOS) {
          let [err, primaryKey] = await to(blockchainApi.getPrimaryKey(selectedIdentity.address));
          notebookId = primaryKey.notebookId;
          noteId = primaryKey.noteId;
        }

        upsertNotebookObj.noteCount = 1;
        break;
      }
      case 'insert': {
        notebookId = notebook.id;

        if (selectedIdentity.network === blockchainNetwork.ETH) {
          noteId = uuid.v4().replace(/-/g, '');
        }

        if (selectedIdentity.network === blockchainNetwork.EOS) {
          let [err, primaryKey] = await to(blockchainApi.getPrimaryKey(selectedIdentity.address));
          noteId = primaryKey.noteId;
        }

        upsertNotebookObj.noteCount = parseInt(notebook.noteCount) + 1;
        break;
      }
      case 'update': {
        notebookId = notebook.id;
        noteId = note.id;
        upsertNotebookObj.noteCount = notebook.noteCount;
        break;
      }
    }
    upsertNotebookObj.id = notebookId;

    return {upsertNotebookObj, noteId};
  };

  _submit = (password, values) => {
    let {dispatch, identityState, languageState: {polyglot}} = this.props;
    let {selectedIdentity} = identityState;

    dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', true)());

    setTimeout(async () => {
      let {upsertNotebookObj, noteId} = await this._getUpsertParams(values);
      let blockchainApi = blockchainFactory(selectedIdentity.network);
      let [err, privateKey] = await to(blockchainApi.recoverKeystore(selectedIdentity, password));
      if (err) {
        console.log('recoverKeystoreErr', err);
        dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
        Toast.fail(polyglot.t('common.auth_fail'), 2);
        return;
      }

      let [gasErr, gas] = await to(blockchainApi.getUpsertEstimate(selectedIdentity.address, privateKey, upsertNotebookObj, noteId, values.noteContent));
      if (gasErr) {
        console.log('gasErr', gasErr);
        dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
        Toast.fail(`${polyglot.t('note.gas_fail')}, ${gasErr}`, 2);
        return;
      }

      if (selectedIdentity.network === blockchainNetwork.ETH) {
        let [balanceErr, balance] = await to(blockchainApi.getBalance(selectedIdentity.address));

        if (balanceErr) {
          console.log('balanceErr', balanceErr);
          dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
          Toast.fail(`${polyglot.t('note.get_balance_fail')}, ${balanceErr}`, 2);
          return;
        }

        if (balance < gas) {
          dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
          Toast.fail(polyglot.t('note.insufficient'), 2);
          return;
        }
        console.log('gas, balance', {gas, balance});
      }

      Alert.alert(
        `${selectedIdentity.network === blockchainNetwork.ETH ? 'GAS' : 'RAM'} ${polyglot.t('common.prompt')}`,
        polyglot.t('note.estimate_gas', {
          gas,
          unit: selectedIdentity.network === blockchainNetwork.ETH ? 'Ether' : 'Bytes'
        }),
        [
          {
            text: polyglot.t('common.cancel'),
            onPress: () => {
              dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)());
            }, style: 'cancel'
          },
          {
            text: polyglot.t('common.ok'),
            onPress: async () => {
              setTimeout(() => {
                dispatch(upsertNotebook(this.editor, selectedIdentity, privateKey, upsertNotebookObj, noteId, values.noteContent))
              }, 500)
            }
          }
        ],
        {
          onDismiss: () => {
            dispatch(makeActionCreator(UPSERT_NOTE_LOADING, 'noteEditorLoading', false)())
          }
        }
      )
    }, 500)
  };

  _onSubmit = (values) => {

    let {languageState: {polyglot}} = this.props;

    prompt(polyglot.t('common.input_password'), null, [
      {
        text: polyglot.t('common.cancel'),
        onPress: () => {
        }
      },
      {
        text: polyglot.t('common.ok'),
        onPress: async (password) => {
          if (!password || password.trim().length === 0) {
            return;
          }

          this._submit(password, values);
        }
      }
    ], {type: 'secure-text', placeholder: polyglot.t('common.password')});
  };

  render() {

    let {navigation, identityState, notebookState, languageState: {polyglot}} = this.props;
    let {selectedIdentity} = identityState;
    let {noteEditorLoading, err} = notebookState;

    let {state} = navigation;
    let {params} = state;
    let notebook = params ? params.notebook : null;
    let note = params ? params.note : null;

    let initialValues = {
      notebookName: notebook ? notebook.name : null,
      noteContent: note ? note.content : null,
      focus: this.editor
    };
    return (
      <ScrollView style={styles.container}>

        <Loading visible={noteEditorLoading}/>

        <View style={styles.notebook}>
          <Icon
            name={'note-add'}
            size={xx_small}
            style={styles.notebookIcon}/>
          <Text style={styles.notebookFont}>
            {`${selectedIdentity.network} - ${selectedIdentity.alias}`}
          </Text>
        </View>

        <Form
          initialValues={initialValues}
          loading={noteEditorLoading}
          polyglot={polyglot}
          onSubmit={this._onSubmit}/>

        <View style={styles.tips}>
          <Text style={styles.tipsFont}>{polyglot.t('note.tips')}</Text>
        </View>

      </ScrollView>
    )
  }
}

NotebookEditor.navigationOptions = props => {
  const {navigation} = props;
  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;
  return (
    {
      title: params && polyglot ? polyglot.t('note.editor') : '',
      headerTitleStyle: Platform.OS === 'android' ? {
        textAlign: 'center',
        alignSelf: 'center',
        flexGrow: 1,
        color: 'white'
      } : {color: 'white'},
      headerRight: (<View/>)
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
    borderBottomColor: 'rgba(245,245,245,1)'
  },

  notebookIcon: {color: themeColor},
  notebookFont: {color: themeColor, fontSize: xx_small, marginLeft: 5, fontWeight: 'bold'},

  tips: {
    margin: 20
  },

  tipsFont: {color: lightGrey, fontSize: smaller},

  input: {
    height: 44,
    borderColor: 'white',
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    padding: 5
  },

  textarea: {
    borderColor: 'white',
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    minHeight: 200,
  },

  button: {
    height: 40,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: themeColor,
    borderColor: themeColor,
    borderRadius: 0,
  },

  buttonActive: {
    height: 40,
    backgroundColor: themeColor,
    borderColor: themeColor,
    borderRadius: 0,
  },

  title: {
    fontWeight: 'bold',
    fontSize: xx_small
  }
});


const mapStateToProps = state => ({
  identityState: state.identity,
  notebookState: state.notebook,
  languageState: state.language
});

export default connect(mapStateToProps)(NotebookEditor);