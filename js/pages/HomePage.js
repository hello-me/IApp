/**
 * Created by licong on 2018/4/28.
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  Navigator,
  Text,
  View,
  DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import PopularPage from './popularPage'
import TrendingPage from './TrendingPage'
import FavriteDao from './FavoritePage'
import MyPage from './my/myPage'
import Toast,{DURATION} from 'react-native-easy-toast'
import BaseComponent from './BaseComponent'
export const ACTION_HOME={A_SHOW_TOAST: 'showToast', A_RESTART: 'restatrt',A_THEME:'theme'}
export const FLAG_TAB={
  flag_popularTab:'tb_popular',
  flag_trendingTab:'tb_trending',
  flag_favoriteTab:'tb_favorite',
  flag_my:'tb_my'
}
export default class HomePage extends BaseComponent {
  constructor(props){
    super(props);
    let selectedTab=this.props.selectedTab?this.props.selectedTab:'tb_popular';
    this.state={
      selectedTab: selectedTab,
      theme: this.props.theme
    }
  }
  componentDidMount() {
  super.componentDidMount()
  this.listener=DeviceEventEmitter.addListener('ACTION_HOME',
   (action, params) =>
    this.onAction(action, params));
  }
  /**
  * 通知回调函数
  * */
  onAction(action, params) {
   if (ACTION_HOME.A_RESTART===action) {
    this.onRestart(params)
   } else if (ACTION_HOME.A_SHOW_TOAST===action) {
   this.toast.show(params.text,DURATION.LENGTH_LONG)
   }
  }
  /**
  * 重启首页*/
  onRestart(jumpToTab) {
    this.props.navigator.resetTo({
    component:HomePage,
    params: {
      ...this.props,
      selectedTab: jumpToTab
      }
    })
  }
  componentWillUnmount() {
  super.componentWillUnmount()
  this.listener&&this.listener.remove();
  }
  _renderTab(Component, selectTab, title, renderIcon) {
   return <TabNavigator.Item
     selected={this.state.selectedTab === selectTab}
     selectedTitleStyle= {this.state.theme.styles.selectedTitleStyle}
     tilte={title}
     renderIcon={() => <Image style={styles.image} source={renderIcon} />}
     renderSelectedIcon={() => <Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]} source={renderIcon}/>}
     onPress={() => this.setState({selectedTab: selectTab})}
   >
     <Component {...this.props} theme={this.state.theme}/>
   </TabNavigator.Item>
  }
  render() {
    return (
      <View style={styles.container}>
          <TabNavigator>
            {this._renderTab(PopularPage,'tb_popular','最热',require('../../res/images/ic_polular.png'))}
            {this._renderTab(TrendingPage,'tb_trending','趋势',require('../../res/images/ic_trending.png'))}
            {this._renderTab(FavriteDao,'tb_favorite','收藏',require('../../res/images/ic_favorite.png'))}
            {this._renderTab(MyPage,'tb_my','我的',require('../../res/images/ic_my.png'))}
         </TabNavigator>
         <Toast ref={toast=> this.toast=toast}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  page1: {
    flex:1,
    backgroundColor: 'red',
  },
  page2: {
    flex:1,
    backgroundColor: 'yellow',
  },
  page3: {
    flex:1,
    backgroundColor: 'red',
  },
  page4: {
    flex:1,
    backgroundColor: 'yellow',
  },

  image: {
    height: 22,
    width: 22
  }
});
