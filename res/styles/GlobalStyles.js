/**
 * Created by licong on 2018/6/12.
 */

import {Dimensions} from 'react-native'
 const {height, width} = Dimensions.get('window');
module.exports = {
  line: {
  height:0.4,
  opacity:0.5,
  backgroundColor: 'darkgray',
  },
  root_container: {
  flex:1,
  backgroundColor: '#f3f3f4',
  },
  backgroundColor:'#f3f3f4',
  nav_bar_height_ios:44,
  nav_bar_height_android:50,
  window_height: height,
 }