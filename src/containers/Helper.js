/**
 * Created by yinchong on 2018/10/25
 */


'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {ScrollView, Text, View, StyleSheet, Image, Dimensions, Linking, TouchableOpacity} from 'react-native'
import {Accordion, List} from 'antd-mobile-rn';

import {backgroundColor, lineColor, tabColor, themeColor} from "../utils/constants"

const resetStyle = {
  "container": {"borderTopWidth": 0.3333333333333333, "borderTopColor": lineColor},
  "header": {
    "flexDirection": "row",
    "alignItems": "center",
    "paddingLeft": 15,
    "paddingRight": 30,
    "borderBottomWidth": 0.3333333333333333,
    "borderBottomColor": lineColor
  },
  "arrow": {
    "width": 12, "height": 12,
    "tintColor": themeColor
  },
  "headerText": {"color": "white", "fontSize": 17},
  "content": {
    "paddingVertical": 9,
    "paddingHorizontal": 8,
    "borderBottomWidth": 0.3333333333333333,
    "borderBottomColor": lineColor
  },
  "contentText": {"fontSize": 15, "color": 'white'}
};
const panelStyles = Object.assign({}, Accordion.defaultProps.styles, resetStyle);
const {height, width} = Dimensions.get('window');
const imageWidth = (width - 100) / 2;
const imageHeight = (height - 100) / 2;

class Helper extends React.Component<{}> {

  componentWillMount() {
    const {navigation: {setParams}, languageState: {polyglot}} = this.props;
    setParams({polyglot});
  }

  render() {

    const {languageState: {polyglot, primaryLang}} = this.props;

    return (
      <ScrollView style={styles.container}>
        <Accordion styles={panelStyles} accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>

          <Accordion.Panel header={polyglot.t('helper.no8_title')}>
            <View style={styles.accordion}>

              <TouchableOpacity style={{borderBottomColor:'white',borderBottomWidth:1,alignItems:'center'}} onPress={() => {
                Linking.openURL(polyglot.t('helper.no8_url'))
              }}>
                <Text style={{
                  color: 'white'
                }}>{polyglot.t('helper.no8_content')}</Text>
              </TouchableOpacity>

            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no0_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no0_content')}</Text>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no1_title')}>
            <View style={styles.accordion}>
              <Image style={{width: width - 80, height: 180}}
                     resizeMode='contain'
                     source={require('./../images/keystore.png')}/>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no1_content')}</Text>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no2_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no2_content')}</Text>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no3_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no3_content_step1')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_profile.png') : require('./../images/en_profile.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_identities.png') : require('./../images/en_identities.png')}/>
              </View>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no3_content_step2')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_import.png') : require('./../images/en_import.png')}/>
              </View>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no4_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no4_content_step1')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_profile.png') : require('./../images/en_profile.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_identities.png') : require('./../images/en_identities.png')}/>
              </View>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no4_content_step2')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_input_password.png') : require('./../images/en_input_password.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_export.png') : require('./../images/en_export.png')}/>
              </View>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no5_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no5_content_step1')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_profile.png') : require('./../images/en_profile.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_identities.png') : require('./../images/en_identities.png')}/>
              </View>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no5_content_step2')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_identity.png') : require('./../images/en_identity.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_input_password.png') : require('./../images/en_input_password.png')}/>
              </View>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no6_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no6_content_step1')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_profile.png') : require('./../images/en_profile.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_identities.png') : require('./../images/en_identities.png')}/>
              </View>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no6_content_step2')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_identity.png') : require('./../images/en_identity.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_receive_address.png') : require('./../images/en_receive_address.png')}/>
              </View>
            </View>
          </Accordion.Panel>

          <Accordion.Panel header={polyglot.t('helper.no7_title')}>
            <View style={styles.accordion}>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no7_content_step1')}</Text>
              <View style={styles.step}>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_note_undetermined.png') : require('./../images/en_note_undetermined.png')}/>
                <Image style={styles.image}
                       resizeMode='contain'
                       source={primaryLang === 'zh' ? require('./../images/zh_transaction.png') : require('./../images/en_transaction.png')}/>
              </View>
              <Text style={{color: 'white'}}>{polyglot.t('helper.no7_content_step2')}</Text>
            </View>
          </Accordion.Panel>

        </Accordion>
      </ScrollView>
    )
  }
}

Helper.navigationOptions = props => {
  const {navigation} = props;

  let {state} = navigation;
  let {params} = state;
  let polyglot = params ? params.polyglot : null;

  return {
    title: polyglot ? polyglot.t('helper.title') : '',
    headerRight: (<View/>)
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  },

  accordion: {
    margin: 20,
    padding: 20,
    backgroundColor: lineColor
  },

  step: {flexDirection: 'row', justifyContent: 'space-between'},
  image: {width: imageWidth, height: imageHeight}
});

const mapStateToProps = state => ({
  languageState: state.language
});

export default connect(mapStateToProps)(Helper);