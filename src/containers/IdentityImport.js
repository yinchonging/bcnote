/**
 * Created by yinchong on 2018/10/31
 */


'use strict';

import _ from 'lodash'
import to from 'await-to-js'
import React from 'react'
import {Text, ScrollView, View, StyleSheet, TextInput, Alert, Keyboard, LayoutAnimation, Dimensions} from 'react-native'
import {connect} from 'react-redux';
import {Button, Toast} from 'antd-mobile-rn';
import {Field, reduxForm} from 'redux-form';
import Loading from './../components/Loading'
import Radio from './../components/Radio'

import {importIdentity, makeActionCreator} from "../actions";
import {backgroundColor, themeColor, tabColor, fontColor} from "../utils/constants"
import {
  IMPORT_KEYSTORE_LOADING,
  IMPORT_IDENTITY_SUCCESS,
  IMPORT_IDENTITY_FAIL,
  IMPORT_IDENTITY_TYPE
} from "../actions/actionTypes"

import {blockchainFactory, blockchainNetwork} from "../api/blockchainStorage";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const renderKeystoreInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot, importType, importNetwork, onItemFocus}) => {

  let placeholder = importNetwork === 'EOS' ? 'Active Private Key' : 'Private Key';

  return <TextInput
    style={[styles.textarea, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    multiline={true}
    textAlignVertical='top' //for android
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('import.keystore', {content: importType === 0 ? placeholder : 'Keystore'})}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
    onFocus={() => {
      onItemFocus('keystore')
    }}
  />
};

const renderPasswordInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot, onItemFocus}) => {

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('common.password')}
    secureTextEntry={true}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
    onFocus={() => {
      onItemFocus('password')
    }}
  />
};

const renderVerifyPasswordInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot, onItemFocus}) => {

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('common.verify_password')}
    secureTextEntry={true}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
    onFocus={() => {
      onItemFocus('repassword')
    }}
  />
};

const renderHintInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot, onItemFocus}) => {

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('common.password_hint')}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
    onFocus={() => {
      onItemFocus('hint')
    }}
  />
};

const renderAliasInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot, onItemFocus}) => {

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    returnKeyType={'next'}
    selectionColor={themeColor}
    autoCapitalize={'none'}
    placeholder={polyglot.t('common.alias')}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
    onFocus={() => {
      onItemFocus('alias')
    }}
  />
};

const regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');

const required = value => {
  return value && value.trim().length > 0 ? undefined : 'Required'
};

const validPassword = (value, allValues, props, name) => {

  if (!value || value.trim().length === 0) {
    return 'Required';
  }

  if (allValues.password !== allValues.verifypassword) {
    return 'Two passwords are different';
  }

  return regex.test(value) ? undefined : 'Password rules do not match'
};

const validJson = value => {
  if (!value || value.trim().length === 0) {
    return 'Required'
  }

  try {
    let json = JSON.parse(value);
    return _.isObject(json) ? undefined : 'NOT JSON';
  } catch (e) {
    return 'NOT JSON';
  }
};

let Form = props => {
  const {handleSubmit, polyglot, importType, importNetwork, onItemFocus} = props;

  return (
    <View>
      <Field name="keystoreOrPrivateKey"
             component={renderKeystoreInput}
             validate={importType === 1 ? [required, validJson] : [required]}
             onItemFocus={onItemFocus}
             polyglot={polyglot}
             importType={importType}
             importNetwork={importNetwork}
      />
      <Field name="password"
             component={renderPasswordInput}
             validate={importType === 0 ? [required, validPassword] : [required]}
             onItemFocus={onItemFocus}
             polyglot={polyglot}/>
      {
        importType === 0 ?
          <Field name="verifypassword"
                 component={renderVerifyPasswordInput}
                 validate={[required, validPassword]}
                 onItemFocus={onItemFocus}
                 polyglot={polyglot}/> : null
      }
      <Field name="hint"
             component={renderHintInput}
             validate={required}
             onItemFocus={onItemFocus}
             polyglot={polyglot}/>
      <Field name="alias"
             component={renderAliasInput}
             validate={required}
             onItemFocus={onItemFocus}
             polyglot={polyglot}/>

      <Button style={styles.button}
              activeStyle={styles.buttonActive}
              type="primary"
              onClick={handleSubmit(props.onSubmit)}>{polyglot.t('import.btn')}</Button>

    </View>
  )
};

Form = reduxForm({
  form: 'identityImportForm'
})(Form);


class IdentityImport extends React.Component<{}> {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
    this.keyboardDidShowListener = Keyboard.addListener("keyboardWillShow", this._keyboardWillShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener("keyboardWillHide", this._keyboardWillHide.bind(this));
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: IMPORT_IDENTITY_TYPE,
      importType: 0
    });
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }


  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = nextProps;
    switch (identityState.type) {
      case IMPORT_IDENTITY_SUCCESS:
        let {state} = navigation;
        let {params} = state;
        let isLogin = params ? params.isLogin : false;

        dispatch(makeActionCreator(IMPORT_KEYSTORE_LOADING, 'visible', false)());
        setTimeout(() => {
          isLogin ? navigation.navigate('AuthMain') : navigation.goBack();
        }, 500);
        return true;
      case IMPORT_IDENTITY_FAIL:
        dispatch(makeActionCreator(IMPORT_KEYSTORE_LOADING, 'visible', false)());
        setTimeout(() => Toast.fail(polyglot.t('common.auth_fail'), 2), 500);
        return true;
      default:
        return true;
    }
  }

  _keyboardWillShow = (e) => {
    let y = e.endCoordinates.screenY;
    this.keyboardHeight = height - y;
  };

  _keyboardWillHide = (e) => {
    this.keyboardHeight = 0;
    this._scrollRef.scrollTo({x: 0, y: 0, animated: true})
  };

  _onSubmit = async (values) => {

    const {dispatch, identityState: {importType}, languageState: {polyglot}} = this.props;

    let {keystoreOrPrivateKey, password, hint, alias} = values;

    dispatch(makeActionCreator(IMPORT_KEYSTORE_LOADING, 'visible', true)());

    let keystore;

    switch (importType) {
      case 0: // private key
        let network = blockchainFactory().verifyNetwork(keystoreOrPrivateKey);
        if (!network) {
          dispatch(makeActionCreator(IMPORT_KEYSTORE_LOADING, 'visible', false)());
          Toast.fail(polyglot.t('import.import_fail', {err: 'Invalid Private Key'}), 2);
          return;
        }

        let blockchainApi = blockchainFactory(network);
        let [err, result] = await to(blockchainApi.createKeystore(keystoreOrPrivateKey, password, hint, alias));
        if (err) {
          dispatch(makeActionCreator(IMPORT_KEYSTORE_LOADING, 'visible', false)());
          Toast.fail(polyglot.t('import.import_fail', {err}), 2);
          return;
        }

        keystore = result;
        break;
      case 1:  // keystore
        keystore = _.isObject(keystoreOrPrivateKey) ? keystoreOrPrivateKey : JSON.parse(keystoreOrPrivateKey);
        break;
    }
    setTimeout(() => dispatch(importIdentity(keystore, password, hint, alias)), 500)
  };


  render() {

    const {navigation, dispatch, identityState, languageState: {polyglot}, identityState: {importType}} = this.props;
    let {visible} = identityState;

    let {state} = navigation;
    let {params} = state;
    let importNetwork = params ? params.importNetwork : null;

    return (
      <ScrollView
        ref={(ref) => {
          this._scrollRef = ref
        }}
        style={styles.container}>

        <Loading visible={visible}/>

        <Radio style={{marginTop: 20}}
               items={['Private Key', 'Keystore']}
               onChange={(item, index) => {
                 dispatch({
                   type: IMPORT_IDENTITY_TYPE,
                   importType: index
                 })
               }}
        />

        <View style={styles.tips}>
          <Text style={{color: themeColor}}>{polyglot.t('import.tips_title')}</Text>
          <Text
            style={{color: 'white'}}>{polyglot.t('import.tips_content', {content: importType === 0 ? 'Private Key' : 'Keystore'})}</Text>
          {
            importType === 0 ?
              <Text style={{color: 'white'}}>{polyglot.t('create.tips_content')}</Text> : null
          }
        </View>

        <Form onSubmit={this._onSubmit}
              polyglot={polyglot}
              importType={importType}
              importNetwork={importNetwork}
              onItemFocus={(item) => {
                let y = 0;
                let offset = importType === 1 ? 1 : 2;
                switch (item) {
                  case 'keystore':
                    break;
                  case 'password':
                    break;
                  case 'repassword':
                    y = 64 * offset;
                    break;
                  case 'hint':
                    y = 64 * (offset + 1);
                    break;
                  case 'alias':
                    y = 64 * (offset + 2);
                    break;
                }
                this._scrollRef.scrollTo({x: 0, y: y, animated: true})
              }}/>

      </ScrollView>
    )
  }
}

IdentityImport.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('import.title') : '',
      headerRight: (<View/>)
    }
  );
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
    backgroundColor: tabColor,
    padding: 10
  },

  textarea: {
    borderWidth: 1,
    borderColor: 'rgba(26,175,125, 0.3)',
    backgroundColor: 'rgba(26,175,125, 0.3)',
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 120,
    padding: 10,
    color: 'white'
  },

  input: {
    borderWidth: 1,
    height: 44,
    borderColor: 'rgba(26,175,125, 0.3)',
    backgroundColor: 'rgba(26,175,125, 0.3)',
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
    color: 'white'
  },

  inputError: {
    backgroundColor: tabColor,
    borderColor: tabColor,
    borderWidth: 1,
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
  identityState: state.identity,
  languageState: state.language
});

export default connect(mapStateToProps)(IdentityImport);