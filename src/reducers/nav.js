/**
 * Created by yinchong on 2017/12/13
 */
'use strict';

import {RootNavigator} from '../containers/AppNavigator';

const firstAction = RootNavigator.router.getActionForPathAndParams('Auth');
const initialNavState = RootNavigator.router.getStateForAction(firstAction);

export default function nav(state = initialNavState, action) {

  let nextState = RootNavigator.router.getStateForAction(action, state);

  return nextState || state;
}
