/**
 * Created by yinchong on 2018/12/29
 */

'use strict';

import React from 'react'
import {View, Text, TextInput, Platform} from 'react-native';
import {tabColor, fontColor, themeColor, lineColor} from "../utils/constants"

class Input extends React.Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    }
  }

  onChange = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {

    return (
      <View style={[{
        flexDirection: 'column',
        backgroundColor: tabColor,
        padding: 10
      }, this.props.style]}>
        <View style={{
          flexDirection: "row",
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: lineColor,
          paddingBottom: 2,
        }}>
          <Text style={{color: this.props.titleColor || 'white'}}>{this.props.title}</Text>
          <Text style={{color: this.props.titleExtraColor || fontColor}}>{this.props.titleExtra}</Text>
        </View>
        <View style={{flexDirection: "row", alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <TextInput
              style={{
                height: Platform.OS === 'android' ? 40 : 30,
                color: this.props.inputColor || 'white'
              }}
              returnKeyType={'next'}
              selectionColor={themeColor}
              autoCapitalize={'none'}
              placeholder={this.props.placeholder}
              keyboardType={this.props.keyboardType}
              placeholderTextColor={fontColor}
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={this.onChange}
              autoFocus={this.props.focus}
              editable={this.props.editable}
              defaultValue={this.props.defaultValue}
            />
          </View>
          <Text style={{color: fontColor}}>{this.props.extra}</Text>
        </View>
      </View>
    )
  }
}

export default Input;