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
  ScrollView,
  Image,
  Alert
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import CheckBox from 'react-native-check-box'
import ArrayUtils from '../../util/ArrayUtils'
export default class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
  this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key) //初始化
    this.changeValues = []
    this.isRemoveKey=this.props.isRemoveKey? true:false;
  this.state={
  dataArray: []
  }
  }
  componentDidMount() {
  this.languageDao = new LanguageDao(this.props.flag)
  this.loadData()
  }
  loadData() {
    this.languageDao.fetch()
      .then(result=> {
      this.setState({
        dataArray: result
      })
      })
      .catch(error=>{
      console.log(error)
      })
  }
 onSave() {
 if (this.changeValues.length===0){
   this.props.navigator.pop();
   return;
 }
   if(this.isRemoveKey){
     for(let i=0,l=this.changeValues.length;i<l;i++){
       ArrayUtils.remove(this.state.dataArray,this.changeValues[i]);
     }
   }
 this.languageDao.save(this.state.dataArray);
 this.props.navigator.pop() // 返回之前的页面
 }
 renderView() {
     if (!this.state.dataArray || this.state.dataArray.length === 0)return;
     var len = this.state.dataArray.length;
     var views = [];
     for (var i = 0, l = len - 2; i < l; i += 2) {
       views.push(
         <View key={i}>
           <View style={styles.item}>
             {this.renderCheckBox(this.state.dataArray[i])}
             {this.renderCheckBox(this.state.dataArray[i + 1])}
           </View>
           <View style={styles.line}/>
         </View>
       )
     }
     views.push(
       <View key={len - 1}>
         <View style={styles.item}>
           {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
           {this.renderCheckBox(this.state.dataArray[len - 1])}
         </View>
       </View>
     )
     return views;
 }
  onClick(data) {
    if(!this.isRemoveKey)data.checked = !data.checked;
    ArrayUtils.updateArray(this.changeValues, data)
  }
  onBack() {
  if (this.changeValues.length === 0) {
  this.props.navigator.pop();
  return;
  }
  Alert.alert(
   '提示',
   '要保存修改吗？',
   [
    {text: '不保存', onPress: () =>{
    this.props.navigator.pop();
    }, style: 'cancel'},
     {text: '保存', onPress: () => {this.onSave()}}
   ]
  )
  }
  renderCheckBox(data) {
    let leftText = data.name;
    let isChecked = this.isRemoveKey ? false : data.checked;
    return (
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={()=>this.onClick(data)}
        isChecked={isChecked}
        leftText={leftText}
        checkedImage={<Image source={require('../../pages/my/img/ic_check_box.png')}
                       style={{tintColor: '#6495ED'}}/>}
        unCheckedImage={<Image source={require('../../pages/my/img/ic_check_box_outline_blank.png')}
                        style={{tintColor: '#6495ED'}}/>}
      />);
  }
   render() {
     let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    let rightButton=<TouchableOpacity
    onPress={()=>this.onSave()}
    >
    <View style={{margin:10}}>
    <Text style={styles.title}>{rightButtonTitle}</Text>
    </View>
    </TouchableOpacity>
     let title = this.isRemoveKey ? '标签移除' : '自定义标签';
     title=this.props.flag===FLAG_LANGUAGE.flag_language? '自定义语言' : title
    return (
    <View style={styles.container}>
   <NavigationBar
     title={title}
   style={{backgroundColor: '#6495ED'}}
   leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
   rightButton={rightButton}
   />
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>)
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2f2'
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
