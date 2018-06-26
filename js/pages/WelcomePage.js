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
import ThemeDao from '../expand/dao/ThemeDao'
export default class WelcomePage extends Component {
constructor(props) {
super(props)
  this.state = {
    theme: ''
  }
}
componentDidMount() {
new ThemeDao().getTheme().then((data) => {
this.setState({
 theme: data
})
})
  this.timer=setTimeout(()=>{
  this.props.navigator.resetTo({
  component: HomePage,
  params: {
  theme: this.state.theme,
  }
  })
  }, 500)
}
 componentWillUnmount() {
 this.timer&&clearTimeout(this.timer);
 }
 render() {
 return <View>
  <NavigationBar
    title={'再看'}
    statusBar={{backgroundColor:this.state.theme.themeColor}}
    style={{backgroundColor:this.state.theme.themeColor}}
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