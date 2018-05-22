/**
 * Created by licong on 2018/5/5.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
   Image
} from 'react-native'
export default class ViewUtils extends Component {
 static getLeftButton(callBack) {
 return <TouchableOpacity
     style={{padding: 8}}
     onPress={callBack}
 >
   <Image
   style={{width: 26, height: 26, tintColor: 'yellow'}}
   source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
 </TouchableOpacity>
 }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
  }
)
