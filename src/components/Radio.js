/**
 * Created by yinchong on 2018/12/26
 */


'use strict';

import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {tabColor, fontColor, themeColor} from "../utils/constants"

class Radio extends React.Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: props.defaultIndex || 0
    }

  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultIndex !== this.props.defaultIndex) {
      this.setState({
        selectedIndex: this.props.defaultIndex
      });
    }
  }

  render() {
    return (
      <View style={[{
        flexDirection: 'row',
        backgroundColor: tabColor,
        marginLeft: 20,
        marginRight: 20,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
      }, this.props.style]}>
        {
          this.props.items ? this.props.items.map((item, index) => {
            return (
              <TouchableOpacity key={index}
                                style={{flexDirection: 'row', alignItems: 'center'}}
                                onPress={() => {
                                  this.setState({selectedIndex: index});

                                  if (this.props.onChange) {
                                    this.props.onChange(item, index);
                                  }
                                }}
              >
                <Text style={{color: fontColor, marginRight: 5}}>{item}</Text>
                <Icon
                  name={index === this.state.selectedIndex ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  style={{color: themeColor}}
                />
              </TouchableOpacity>
            )
          }) : null
        }
      </View>
    )
  }
}

export default Radio;