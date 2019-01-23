/**
 * Created by yinchong on 2018/11/22
 */

'use strict';
import {AsyncStorage, NativeModules, Platform} from 'react-native';
import Polyglot from "node-polyglot";
import zh from './../locales/zh';
import en from './../locales/en';

import {LOAD_LANGUAGE_SUCCESS, SET_LANGUAGE_SUCCESS} from './actionTypes'
import {k_language} from './../utils/constants'

export function loadLanguage() {

  return async dispatch => {
    let systemLanguage = Platform.OS === 'android' ? NativeModules.I18nManager.localeIdentifier : NativeModules.SettingsManager.settings.AppleLocale.replace(/_/, '-');
    let savedLanguage = await AsyncStorage.getItem(k_language);

    let lang = savedLanguage ? savedLanguage : systemLanguage;
    let primaryLang = (lang === 'zh-CN' || lang === 'zh') ? 'zh' : 'en';

    let polyglot = new Polyglot();
    polyglot.extend(primaryLang === 'zh' ? zh : en);

    dispatch({
      type: LOAD_LANGUAGE_SUCCESS,
      primaryLang,
      polyglot
    });
  }
}


export function setLanguage(lang) {

  return async dispatch => {
    await AsyncStorage.setItem(k_language, lang);

    let polyglot = new Polyglot();
    polyglot.extend(lang === 'zh' ? zh : en);

    dispatch({
      type: SET_LANGUAGE_SUCCESS,
      primaryLang: lang,
      polyglot
    });
  }
}