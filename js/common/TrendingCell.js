/**
 * Created by licong on 2018/5/4.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native'
import HTMLView from 'react-native-htmlview'
export default class TrendingCell extends Component{
  render() {
  let data = this.props.data.items? this.props.data.items:this.props.data
  let description ='<p>' +data.description + '</p>'
  return <TouchableOpacity
  onPress={this.props.onSelect}
  style={styles.container}
  >
  <View style={styles.cell_container}>
    <Text style={styles.title}>{data.fullName}</Text>
    <HTMLView
      value={description}
      onLinkPress={(url) => {
      }}
      stylesheet={{
        p:styles.description,
        a:styles.description,
      }}
    />
    <Text style={styles.description}>{data.default_branch}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Author:</Text>

          <Image style={{height: 22, width:22, marginRight: 5}}
                 source={require('../../res/images/wanzi.png')}
          />
          <Image style={{height: 22, width:22, marginRight: 5}}
                 source={require('../../res/images/wanzi.png')}
          />
          <Image style={{height: 22, width:22, marginRight: 5}}
                 source={require('../../res/images/wanzi.png')}
          />
          <Image style={{height: 22, width:22, marginRight: 5}}
                 source={require('../../res/images/wanzi.png')}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Start:</Text>
          <Text>{data.stargazers_count}</Text>
        </View>
        <Image style={{width:22, height:22}} source={require('../../res/images/ic_star.png')}/>
      </View>
    </View>
  </TouchableOpacity>
  }
}
const styles=StyleSheet.create({
  container: {
  flex:1
 },
   tilte: {
   fontSize:16,
  marginBottom:2,
  color: '#212121'
 },
  description: {
  fontSize:14,
  marginBottom:2,
 color:'#757575'
},
 cell_container: {
   backgroundColor: 'white',
   padding: 10,
   marginLeft: 5,
   marginRight: 5,
   marginVertical: 3,
   borderColor: '#dddddd',
   borderWidth: 0.5,
   borderRadius: 2,
   shadowColor: 'gray',
   shadowOffset: {width:0.5, height: 0.5},
   shadowOpacity: 0.4,
   shadowRadius: 1,
   elevation:2
},
author:{
fontSize:14,
marginBottom:2,
color: '#757575'
}
})
