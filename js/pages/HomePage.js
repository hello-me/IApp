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
import MyPage from './my/myPage'
import Toast,{DURATION} from 'react-native-easy-toast'
export default class HomePage extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      selectedTab: 'tb_polular'
    }
  }
  componentDidMount() {
  this.listener=DeviceEventEmitter.addListener('showToast', (text) =>{
    this.toast.show(text, DURATION.LENGTH_LONG)
  })
  }
  componentWillUnmount() {
  this.listener&&this.listener.remove(); //ccccc
  }
  render() {
    return (
      <View style={styles.container}>
          <TabNavigator>
         <TabNavigator.Item
         selected={this.state.selectedTab === 'tb_polular'}
         selectedTitleStyle= {{color: '#2196F3'}}
         tilte="最热"
         renderIcon={() => <Image style={styles.image} source={require("../../res/images/ic_polular.png")} />}
         renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196F3'}]} source={require("../../res/images/ic_polular.png")}/>}
         onPress={() => this.setState({selectedTab: 'tb_polular'})}
         >
         <PopularPage {...this.props}/>
         </TabNavigator.Item>
         <TabNavigator.Item
         selected={this.state.selectedTab === 'tb_trending'}
         selectedTitleStyle= {{color: 'yellow'}}
         tilte="趋势"
         renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
         renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]} source={require('../../res/images/ic_trending.png')}/>}
         onPress={() => this.setState({selectedTab: 'tb_trending'})}
         >
         <View style={styles.page2}>
         </View>
         </TabNavigator.Item>
         <TabNavigator.Item
         selected={this.state.selectedTab === 'tb_favorite'}
         selectedTitleStyle= {{color: 'red'}}
         tilte="收藏"
         renderIcon={() => <Image style={styles.image} source={require("../../res/images/ic_favorite.png")} />}
         renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]} source={require("../../res/images/ic_favorite.png")}/>}
         onPress={() => this.setState({selectedTab: 'tb_favorite'})}
         >
         <View style={styles.page3}>
         </View>
         </TabNavigator.Item>
         <TabNavigator.Item
         selected={this.state.selectedTab === 'tb_my'}
         selectedTitleStyle= {{color: 'yellow'}}
         tilte="我的"
         renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_my.png')} />}
         renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]} source={require("../../res/images/ic_my.png")}/>}
         onPress={() => this.setState({selectedTab: 'tb_my'})}>
           <MyPage {...this.props}>
           </MyPage>
         </TabNavigator.Item>
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
