'use strict';

import {
  Platform
} from 'react-native';

import {List} from 'antd-mobile-rn';

//colors
export const themeColor = 'rgba(26,175,125,1)'; //#1AAF7D
export const tabColor = 'rgba(30,45,53,1)';     //#1E2D35
export const navColor = 'rgba(250,250,250,1)';

export const backgroundColor = 'rgba(17,32,40,1)';        //Component 背景色
export const black = 'rgba(0,0,0,1)';                     //主内容 Black 黑色
export const semiBlack = 'rgba(53,53,53,1)';              //大段的说明内容而且属于主要内容用 Semi 黑
export const grey = 'rgba(136,136,136,1)';                //次要内容 Grey 灰色
export const lightGrey = 'rgba(178,178,178,1)';           //时间戳与表单缺省值 Light 灰色
export const fontColor = 'rgba(88,123,138,1)';
export const lineColor = 'rgba(38,53,66,1)';

//font size
export const smaller = 11;    //说明性文字，如版权信息等不需要用户关注的信息
export const small = 13;      //页面辅助信息，需要弱化的内容，如连接、小按钮等
export const x_small = 14;    //页面次要内容，服务于首要信息并与之关联，如列表摘要
export const xx_small = 17;   //页面内首要内容，基准的，可以联系的，如列表标题，消息气泡等
export const medium = 18;     //页面内大按钮字体，与按钮搭配只用
export const large = 20;      //页面大标题，一般用于结果、空状态等信息单一页面
export const larger = 40;     //只能为数字信息，如余额、时间等
export const x_large = 80;    //同上
export const xx_large = 120;  //同上


//local storage keys
export const k_nonce = "NONCE";
export const k_identities = "IDENTITIES";
export const k_selected_identity = "SELECTED_IDENTITIES";
export const k_network_node = "NETWORK_NODE";
export const k_language = 'LANGUAGE';


//node
export const eth_nodes = __DEV__ ? [
  'https://mainnet.infura.io/v3/499c78b667204cd2aecf4e6597a9624a',
  'http://188.165.227.180:55555',
  // 'http://94.23.17.170:55555',
  // 'http://94.23.57.58:55555',
  // 'http://192.168.17.13:8545'
] : [
  'https://mainnet.infura.io/v3/499c78b667204cd2aecf4e6597a9624a'
];

export const eos_nodes = __DEV__ ? [
  'https://api.kylin.alohaeos.com',
] : [
  'https://geo.eosasia.one',
  'https://mainnet-eos.token.im',
  'https://api1-imtoken.eosasia.one'
];

const Item = List.Item;

export const itemStyles = Object.assign({}, Item.defaultProps.styles, {
  Content: {
    color: "white",
    fontSize: 17,
    textAlignVertical: "center"
  },
  Item: {
    alignItems: "center",
    backgroundColor: tabColor,
    flexDirection: "row",
    flexGrow: 1,
    paddingLeft: 15
  },
  Line: {
    borderBottomColor: lineColor,
    alignItems: "center",
    borderBottomWidth: 0.3333333333333333,
    flex: 1,
    flexDirection: "row",
    minHeight: 44,
    paddingRight: 15,
    paddingVertical: 6
  },
  Arrow: {
    height: 13,
    marginLeft: 8,
    marginTop: 3,
    width: 8,
    tintColor: themeColor
  },
  underlayColor: {backgroundColor: themeColor},
  Extra: {
    color: fontColor,
    fontSize: 17,
    textAlign: "right",
    textAlignVertical: "center"
  },
  BriefText: {
    "color": fontColor,
    "fontSize": 15,
    "paddingTop": 3,
    "textAlignVertical": "center"
  },
});

export const listStyles = Object.assign({}, List.defaultProps.styles, {
  "Body": {
    "backgroundColor": tabColor,
    "borderTopWidth": 0.3333333333333333,
    "borderTopColor": tabColor
  },
  "BodyBottomLine": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "right": 0,
    "height": 1,
    "backgroundColor": lineColor,
    "borderBottomWidth": 0.3333333333333333,
    "borderBottomColor": lineColor
  }
});

export const inputItemStyles = {
  "container": {
    "height": 44.5,
    "borderBottomWidth": 0.3333333333333333,
    "borderBottomColor": lineColor,
    "marginLeft": 10,
    "marginRight": 10,
    "marginTop": 0,
    "marginBottom": 0,
    "flexDirection": "row",
    "alignItems": "center"
  },
  "text": {
    "marginRight": 5,
    "textAlignVertical": "center",
    "fontSize": 17,
    "selectionColor": themeColor,
    "color": "white"
  },
  "input": {
    "flex": 1,
    "height": 44,
    "backgroundColor": "transparent",
    "fontSize": 17,
    "color": 'white'
  },
  "inputErrorColor": {
    "color": "#f50"
  },
  "clear": {
    "backgroundColor": fontColor,
    "borderRadius": 15,
    "padding": 2
  },
  "extra": {
    "marginLeft": 5,
    "fontSize": 15,
    "color": fontColor,
    "flexDirection": 'row-reverse',
  },
  "errorIcon": {
    "marginLeft": 5,
    "width": 21,
    "height": 21
  }
};