/**
 * Created by licong on 2018/5/5.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
export default class myPage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title='我的'
        style={{backgroundColor: '#6495ED'}}
        />
         <Text
          onPress={()=>{
          this.props.navigator.push({
          component: CustomKeyPage,
          params: {...this.props}
             })
          }}
          >自定义标签</Text>
        <Text
          onPress={()=>{
            this.props.navigator.push({
              component: SortKeyPage,
              params: {...this.props}
            })
          }}
        >标签排序</Text>
        <Text
          onPress={()=>{
            this.props.navigator.push({
              component: CustomKeyPage,
              params: {
              ...this.props,
              isRemoveKey: true
               }
            })
          }}
        >标签移除</Text>
      </View>)
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
