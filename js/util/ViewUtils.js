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
  TouchableHighlight,
   Image
} from 'react-native'
export default class ViewUtils extends Component {
/*
* 获取设置页的Item
* callBack 单击item的回调
* icon 左侧的文本
* tintStyle 图标着色
* expandableIco 右侧图标
* */
 static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
   return (
   <TouchableHighlight
   onPress={callBack}>
  <View style={[styles.setting_item_container]}>
    <View style={{alignItems: 'center', flexDirection: 'row'}}>
      {icon ? <Image source={icon} resizeMode='stretch'
                     style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
        <View style={{opacity:1, width:16, height: 16, marginRight: 10}}/>
      }
      <Text>{text}</Text>
    </View>
    <Image source={expandableIco ? expandableIco : require('../../res/images/ic_tiaozhuan.png')}
     style={[{
     marginRight:10,
     height: 22,
     width:22,
     alignSelf: 'center',
     opacity: 1
     }, tintStyle]}
    />
  </View>
   </TouchableHighlight>
   )
 }
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
    },
    setting_item_container: {
    backgroundColor: 'white',
    padding: 10, height:60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
    }
  }
)
