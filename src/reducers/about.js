/**
 * Created by yinchong on 2018/12/18
 */
'use strict';


import {DONATE_MODAL} from "../actions/actionTypes"

const initState = {
  address: ''
};

export default function language(state = initState, action) {
  switch (action.type) {
    case DONATE_MODAL:
      return Object.assign({}, state, action);
    default:
      return Object.assign({}, state, action);
  }
}