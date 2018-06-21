/**
 * Created by licong on 2018/6/12.
 */
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ListView,
  Linking,
  TouchableOpacity,
  Platform,
  PixelRatio,
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput
} from 'react-native'
import {MORE_MENU} from '../../common/MoreMenu'
import AboutCommon,{FLAG_ABOUT}from './Aboutcommon'
import WebViewPage from '../../pages/WebViewPage'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import config from '../../../res/data/config.json'
import RepositoryUtils from '../../expand/dao/RepositoryUtils'
import AboutMePage from './AboutMePage'
export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon=new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config);
    this.repositoryUtils = new RepositoryUtils(this)
    this.state = {
     projectModels: [],
     author: config.author
    }
  }
  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }
  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount()
  }
  updateState(dic) {
  this.setState(dic)
  }
  onClick(tab) {
  let TargetComponent, params = {...this.props,menuType:tab};
  switch (tab) {
    case MORE_MENU.About_Author:
      TargetComponent = AboutMePage
       break;
    case MORE_MENU.Website:
      TargetComponent = WebViewPage;
      params.title='GitHubPopular';
      params.url = 'http://www.devio.org/io/GitHubPopular/';
      break;
    case MORE_MENU.Feedback:
     var url = 'mailto://crazycodeboy@gmail.com';
     Linking.canOpenURL(url).then(supported => {
     if (!supported) {
      console.log('Can\'t handle url: ' + url);
     } else {
     return Link.openURl(url);
     }
     }).catch(err=> console.log.error('An error', err));
     break;
    case MORE_MENU.Share:
      break;
  }
  if (TargetComponent) {
  this.props.navigator.push({
    component: TargetComponent,
    params: params,
  })
  }
  }
  render() {
     let content = <View>
       {this.aboutCommon.renderRepository(this.state.projectModels)}
      {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Website), require('../../../res/images/ic_computer.png'),MORE_MENU.Website, {tintColor: '#6495ED'})}
      <View style={GlobalStyles.line}/>
      {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.About_Author), require('../my/img/ic_insert_emoticon.png'), MORE_MENU.About_Author, {tintColor: '#6495ED'})}
      <View style={GlobalStyles.line}/>
      {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback, {tintColor: '#6495ED'})}
    </View>
    return this.aboutCommon.render(content, {
       'name': '樱桃子',
       'description' : '小名是小丸子',
       'avatar': this.state.author.avatar1,
       'backgroundImg': this.state.author.backgroundImg1
    }

    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
  }
)
