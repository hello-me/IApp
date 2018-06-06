/**
 * Created by licong on 2018/4/28.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Navigator
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import HomePage from './HomePage'
export default class WelcomePage extends Component {
componentDidMount() {
  this.timer=setTimeout(()=>{
  this.props.navigator.resetTo({
  component: HomePage
  })
  }, 2000)
}
 componentWillUnmount() {
 this.timer&&clearTimeout(this.timer);
 }
 render() {
 return <View>
  <NavigationBar
    title={'再看'}
  />
  <View style={{flexDirection: 'row', marginLeft: 150, marginTop: 250}}>
     <Image
            source={require('../../res/images/welcome.png')}
     />
  </View>
   <View style={{marginLeft: 155}}>
     <Text>静静的看着你装逼</Text>
   </View>
 </View>
 }
}