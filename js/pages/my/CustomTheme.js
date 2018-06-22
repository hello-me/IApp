/**
 * Created by licong on 2018/6/22.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  TouchableHighlight,
  Modal,
  DeviceEventEmitter
} from 'react-native'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ThemeFactory, {ThemeFlags} from '../../../res/styles/ThemeFactory'
import ThemeDao from '../../expand/dao/ThemeDao'
import {ACTION_HOME} from '../HomePage'
export default class CustomTheme extends Component {
  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
    this.state = {}
  }
  onSelectTheme() {
  this.props.onClose()
  }
  getThemeItem(themeKey) {
    return <TouchableHighlight
    style={{flex:1}}
    underlayColor='white'
    onPress={()=> this.onSelectTheme(themeKey)}
    >
    <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
     <Text style={styles.themeText}>{themeKey}</Text>
    </View>
    </TouchableHighlight>
  }
 /**
  * 创建主题列表
  * */
  renderThemeItems() {
  var views = [];
  for (let i = 0, keys = Object.keys(ThemeFlags), l=keys.length; i<l; i+=3) {
    var key1=keys[i], key2=keys[i+1], key3=keys[i+2];
    views.push(<View key={i} style={{flexDirection: 'row'}}>
      {this.getThemeItem(key1)}
      {this.getThemeItem(key2)}
      {this.getThemeItem(key3)}
    </View>)
  }
  return views;
  }
  renderContentView() {/*定义方法，返回自定义主题弹框*/
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {this.props.onClose()}}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {this.renderThemeItems()}
          </ScrollView>
        </View>
      </Modal>
    )
  }
  render() {
    let view=this.props.visible?<View style={GlobalStyles.root_container}>
      {this.renderContentView()}
    </View>:null;
    return view;
  }
}
const styles = StyleSheet.create({
  themeItem: {
    flex:1,
    height: 120,
    margin:3,
    padding:3,
    borderRadius:2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex:1,
    margin:10,
    marginTop:Platform.OS==='ios'?20:10,
    backgroundColor:'white',
    borderRadius:3,
    shadowColor:'gray',
    shadowOffset:{width:2,height:2},
    shadowOpacity:0.5,
    shadowRadius:2,
    padding:3
  },
  themeText:{
    color:'white',
    fontWeight:'500',
    fontSize:16
  }
})