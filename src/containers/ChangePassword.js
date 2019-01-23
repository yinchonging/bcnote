/**
 * Created by yinchong on 2019/1/9
 */
'use strict';

//Change your password

import React from 'react'
import {Field, reduxForm} from 'redux-form';
import {Text, ScrollView, View, StyleSheet, TextInput} from 'react-native'
import {connect} from 'react-redux';
import {Button, Toast} from 'antd-mobile-rn';
import Loading from './../components/Loading'

import {changeIdentityPassword, makeActionCreator} from "../actions";
import {backgroundColor, fontColor, tabColor, themeColor} from "../utils/constants"
import {CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL, CHANGE_PASSWORD_LOADING} from '../actions/actionTypes'

const renderPasswordInput = (props) => {

  let {input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot} = props;

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('password.current_password')}
    secureTextEntry={true}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
  />
};

const renderNewPasswordInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot}) => {

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('password.new_password')}
    secureTextEntry={true}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
  />
};


const renderVerifyPasswordInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot}) => {

  return <TextInput
    style={[styles.input, error ? styles.inputError : {}]}
    selectionColor={themeColor}
    returnKeyType={'next'}
    autoCapitalize={'none'}
    placeholder={polyglot.t('password.verify_password')}
    secureTextEntry={true}
    placeholderTextColor={fontColor}
    underlineColorAndroid='rgba(0,0,0,0)'
    clearButtonMode={"always"}
    onChangeText={onChange}
  />
};


const renderHintInput = ({input: {onChange, ...restInput}, meta: {touched, error, warning}, polyglot}) => {

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

  if (allValues.newpassword !== allValues.verifypassword) {
    return 'Two passwords are different';
  }

  return regex.test(value) ? undefined : 'Password rules do not match'
};

let Form = props => {
  const {handleSubmit, polyglot} = props;

  return (
    <View>
      <Field name="currentpassword" component={renderPasswordInput} validate={required} polyglot={polyglot}/>
      <Field name="newpassword" component={renderNewPasswordInput} validate={[required, validPassword]}
             polyglot={polyglot}/>
      <Field name="verifypassword" component={renderVerifyPasswordInput} validate={[required, validPassword]}
             polyglot={polyglot}/>
      <Field name="hint" component={renderHintInput} validate={required} polyglot={polyglot}/>

      <Button style={styles.button}
              activeStyle={styles.buttonActive}
              type="primary"
              onClick={handleSubmit(props.onSubmit)}>{polyglot.t('password.save')}</Button>

    </View>
  )
};

Form = reduxForm({
  form: 'changeYourPassword'
})(Form);

class ChangePassword extends React.Component<{}> {

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {navigation, identityState, dispatch, languageState: {polyglot}} = nextProps;
    switch (identityState.type) {
      case CHANGE_PASSWORD_SUCCESS:
        dispatch(makeActionCreator(CHANGE_PASSWORD_LOADING, 'visible', false)());
        Toast.success(`${polyglot.t('common.success')}`, 1);
        setTimeout(() => navigation.goBack(), 1500);
        return true;
      case CHANGE_PASSWORD_FAIL:
        dispatch(makeActionCreator(CHANGE_PASSWORD_LOADING, 'visible', false)());
        Toast.fail(`${polyglot.t('common.fail')} ${identityState.err}`);
        return true;
      default:
        return true;
    }
  }

  _onSubmit = async (values) => {

    const {navigation, dispatch} = this.props;
    let {currentpassword, newpassword, hint} = values;

    let {state} = navigation;
    let {params} = state;
    let keystore = params.keystore;

    dispatch(makeActionCreator(CHANGE_PASSWORD_LOADING, 'visible', true)());
    setTimeout(() => dispatch(changeIdentityPassword(keystore, currentpassword, newpassword, hint)), 500)

  };

  render() {

    const {identityState, languageState: {polyglot}} = this.props;
    let {visible} = identityState;

    return (
      <ScrollView style={styles.container}>

        <Loading visible={visible}/>

        <View style={styles.tips}>
          <Text style={{color: themeColor}}>{polyglot.t('create.tips_title')}</Text>
          <Text style={{color: 'white'}}>{polyglot.t('create.tips_content')}</Text>
        </View>

        <Form onSubmit={this._onSubmit} polyglot={polyglot}/>

      </ScrollView>
    )
  }
}

ChangePassword.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return (
    {
      title: polyglot ? polyglot.t('password.title') : '',
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
    borderRadius: 0,
    borderColor: themeColor
  },

  buttonActive: {
    height: 40,
    backgroundColor: themeColor,
    borderRadius: 0,
    borderColor: themeColor
  },
});

const mapStateToProps = state => ({
  identityState: state.identity,
  languageState: state.language
});

export default connect(mapStateToProps)(ChangePassword);