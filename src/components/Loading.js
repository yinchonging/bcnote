/**
 * Created by yinchong on 2018/11/12
 */

'use strict';

import React from 'react'
import {ActivityIndicator} from 'react-native'
import {Modal} from 'antd-mobile-rn';

import {tabColor,fontColor} from "../utils/constants"

class Loading extends React.Component<{}> {
  render() {

    return (
      <Modal
        style={{
          width: 60,
          height: 60,
          backgroundColor: tabColor,
        }}
        visible={this.props.visible}
        transparent
        maskClosable={false}>
        <ActivityIndicator color={fontColor}/>
      </Modal>
    )
  }
}

export default Loading;