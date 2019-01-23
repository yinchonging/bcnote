/**
 * Created by yinchong on 2017/12/13
 */
'use strict';

import {combineReducers} from 'redux'
import {reducer as form} from 'redux-form'

import nav from './nav'
import identity from './identity'
import notebook from './notebook'
import blockchain from './blockchain'
import language from './language'
import about from './about'
import eos from './eos'

const AppReducer = combineReducers({
  nav,
  form,
  identity,
  notebook,
  blockchain,
  language,
  about,
  eos
});

export default AppReducer;
