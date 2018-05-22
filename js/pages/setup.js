/**
 * Created by licong on 2018/4/28.
 */
import React, {Component} from 'react'
import {
 View,
 StyleSheet,
 Text
} from 'react-native'
import { Navigator } from 'react-native-deprecated-custom-components'
import WelcomePage from './WelcomePage'
function setup() {
 class Root extends Component{
   renderScence(route, navigator){
  let Component=route.component;
  return <Component {...route.params} navigator={navigator}/>
  }
  render(){
  return <Navigator
     initialRoute={{component: WelcomePage}}
     renderScene={(route, navigator)=>this.renderScence(route,navigator)}
  />
  }
 }
 return <Root/>
}
module.exports=setup;