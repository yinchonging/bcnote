/**
 * Created by yinchong on 2018/11/22
 */

'use strict';

import {LOAD_LANGUAGE_SUCCESS, SET_LANGUAGE_SUCCESS} from "../actions/actionTypes"

const initLanguage = {
  primaryLang: 'zh',
  polyglot: {}
};

export default function language(state = initLanguage, action) {
  switch (action.type) {
    case LOAD_LANGUAGE_SUCCESS:
    case SET_LANGUAGE_SUCCESS:
      return Object.assign({}, state, action);
    default:
      return Object.assign({}, state, action);
  }
}