/**
 * Created by yinchong on 2018/10/24
 */


'use strict';

import React from 'react'
import {ScrollView, Text, StyleSheet, View} from 'react-native'
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {List} from 'antd-mobile-rn';

import {blockchainNetwork} from './../api'
import {switchNode, getNode} from "../actions";
import {backgroundColor, fontColor, listStyles, itemStyles, themeColor} from "../utils/constants"

const Item = List.Item;

let resetItemStyles = Object.assign({}, itemStyles, {
  Extra: {
    color: themeColor,
    fontSize: 17,
    textAlign: "right",
    textAlignVertical: "center"
  }
});

class Network extends React.Component<{}> {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}, dispatch} = this.props;
    setParams({polyglot});
    dispatch(getNode());
  }


  _onETHChange = (node) => {
    let {dispatch} = this.props;
    dispatch(switchNode(blockchainNetwork.ETH, node));
  };

  _onEOSChange = (node) => {
    let {dispatch} = this.props;
    dispatch(switchNode(blockchainNetwork.EOS, node));
  };

  render() {

    let {blockchainState, languageState: {polyglot}} = this.props;

    let {ethNode, ethNodes, eosNode, eosNodes} = blockchainState;

    return (
      <ScrollView style={styles.container}>

        <List styles={listStyles}
              renderHeader={() => <Text style={styles.listHeaderTitle}>{polyglot.t('network.eth_node')}</Text>}>
          {ethNodes.map(i => (
            <Item key={i}
                  styles={resetItemStyles}
                  extra={ethNode === i ? <Icon
                    name={'check'}
                    size={17}
                    style={{color: themeColor, marginLeft: 5}}/> : null}
                  onClick={() => this._onETHChange(i)}>{i.indexOf('v3') > -1 ? i.substring(0, i.indexOf('v3')) : i}</Item>
          ))}
        </List>


        <List styles={listStyles}
              renderHeader={() => <Text style={styles.listHeaderTitle}>{polyglot.t('network.eos_node')}</Text>}>
          {eosNodes.map(i => (
            <Item key={i}
                  styles={resetItemStyles}
                  extra={eosNode === i ? <Icon
                    name={'check'}
                    size={17}
                    style={{color: themeColor, marginLeft: 5}}/> : null}
                  onClick={() => this._onEOSChange(i)}>{i}</Item>
          ))}
        </List>
      </ScrollView>
    )
  }
}

Network.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('network.title') : '',
    headerRight: (<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  listHeaderTitle: {marginLeft: 15, marginTop: 20, marginBottom: 10, color: fontColor}
});

const mapStateToProps = state => ({
  blockchainState: state.blockchain,
  languageState: state.language
});

export default connect(mapStateToProps)(Network);