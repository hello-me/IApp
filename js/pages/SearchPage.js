/**
 * Created by licong on 2018/6/21.
 */
import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ListView,
  StyleSheet,
  ActivityIndicator,
  DeviceEventEmitter
} from 'react-native'
import Toast, {DURATION} from "react-native-easy-toast";
import GlobalStyles from "../../res/styles/GlobalStyles";
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ActionUtils from '../util/ActionUtils';
import {ACTION_HOME, FLAG_TAB} from './HomePage';
import Utils from '../util/Utils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import makeCancelable from '../util/Cancleable'
import ProjectModel from '../model/ProjectModel'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ViewUtils from "../util/ViewUtils";
const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars';
export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.favoriteKeys = [];
    this.keys=[];
    this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChange=false;
    this.state = {
    rightButtonText: '搜索',
    isLoading: false,
    showBottomButton: false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2})
    }
  }
 componentDidMount() {
  this.initKeys()
 }
 componentWillUnmount() {
  if (this.isKeyChange) {
  DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART, FLAG_TAB.flag_popularTab)
  }
   this.cancelable&&this.cancelable.cancel();
 }
 /**
 * 添加标签
 * */
 saveKey() {
 let key = this.inputKeky;
 if (this.checkKeyIsExixt(this.keys, key)) {
 this.toast.show(key + '已经存在', DURATION.LENGTH_LONG);
 } else {
 key = {
 "path": key,
 "name": key,
 "checked": true
 };
   this.keys.unshift(key);
   this.languageDao.save(this.keys);
   this.toast.show(key.name+'保存成功',DURATION.LENGTH_LONG);
   this.isKeyChange=true;
 }
 }
 /**
 * 获取所有标签
 * */
 async initKeys(){
   this.keys=await this.languageDao.fetch();
 }
 /**
 *
 *   */
 checkKeyIsExixt(keys, key) {
 for(let i=0,l=keys.length; i<l;i++){
 if(key.toLowerCase()===keys[i].name.toLowerCase()) return true;
 }
 return false;
 }
 /**
 * 更新ProjectFavoriteItem的Favorite状态
 * */
 flushFavoriteState() {
   let projectModels = [];
   let items = this.items;
   for (var i = 0, len = items.length; i < len; i++) {
     projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)));
   }
   this.updateState({
     isLoading: false,
     dataSource: this.getDataSource(projectModels),
     rightButtonText:'搜索'
   });
 }
  getDataSource(items) {
    return this.state.dataSource.cloneWithRows(items);
  }
 /**
 * 获取本地用户收藏的ProjectItem
 * */
  getFavoriteKeys() {
    this.favoriteDao.getFavoriteKeys().then((keys)=> {
    this.favoriteKeys = keys || [];
    this.flushFavoriteState()
    }).catch((error) => {
      this.flushFavoriteState()
      console.log(error)
    })
 }
 loadData() {
 this.updateState({
 isLoading: true,
 })
   this.cancelable=makeCancelable(fetch(this.genFetchUrl(this.inputKeky))); /*fetch返回的promise*/
   this.cancelable.promise
     .then(response=>response.json())
     .then(responseData=>{
      if(!responseData || !responseData.items || responseData.items.length === 0) {
      this.toast.show(this.inputKeky + '什么也没找到', DURATION.LENGTH_LONG);
      this.updateState({isLoading: false, rightButtonText: '搜索'})
      return;
      }
       this.items=responseData.items;
       this.getFavoriteKeys();
       if(!this.checkKeyIsExixt(this.keys, this.inputKeky)) {
       this.updateState({showBottomButton:true})
       }
     }).catch(e => {
     this.updateState({
     isLoading:false,
     rightButtonText: '搜索'
       })
     })
 }
 genFetchUrl(key) {
   return API_URL + key + QUERY_STR;
 }
 onBackPress(e) {
  this.refs.input.blur();
  this.props.navigator.pop();
  return true;
 }
 updateState(dic) {
 this.setState(dic)
 }
 onRightButtonClick() {
 if (this.state.rightButtonText === '搜索') {
   this.updateState({rightButtonText: '取消'})
   this.loadData();
 } else {
   this.updateState({rightButtonText: '搜索',
   isLoading:false
   })
   this.cancelable.cancel();
 }
 }
  renderNavBar() {
  let backButton = ViewUtils.getLeftButton(() => this.onBackPress());
    let inputView = <TextInput
    ref="input"
    onChangeText={text=>this.inputKeky=text}
    style={styles.textInput}
    >
    </TextInput>
    let rightButton =
    <TouchableOpacity
    onPress={() => {
    this.refs.input.blur();
    this.onRightButtonClick();
    }}
    >
    <View style={{marginRight:10}}>
    <Text style={styles.title}>
      {this.state.rightButtonText}
    </Text>
    </View>
    </TouchableOpacity>
    return <View style={{
       backgroundColor: '#6495ED',
       flexDirection: 'row',
       alignItems: 'center',
       height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
      }}>
        {backButton}
        {inputView}
        {rightButton}
      </View>
  }
  renderRow(projectModel) {
  return <RepositoryCell
       key={projectModel.item.id}
       data={projectModel}
       onSelect={() => ActionUtils.onSelectRepository({
       data: projectModel,
       flag: FLAG_STORAGE.flag_popular,
         ...this.props
       })}
       onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
  />
  }
  render() {
  let statusBar = null;
  if (Platform.OS === 'ios') {
    statusBar = <View style={[styles.statusBar, {backgroundColor: '#6495ED'}]}/>
  }
  let listView=!this.state.isLosading? <ListView
   dataSource = {this.state.dataSource}
   renderRow= {(e) => this.renderRow(e)}
  /> : null;
  let indicatorView = this.state.isLoading ?
  <ActivityIndicator
  style={styles.centering}
  size="large"
  animating={this.state.isLoading}
  /> : null;
  let resultView=<View style={{flex:1}}>
    {indicatorView}
    {listView}
  </View>
  let bottomButton = this.state.showBottomButton?
    <TouchableOpacity
    style={[styles.bottomButton, {backgroundColor: '#6495ED'}]}
    onPress={() => {
    this.saveKey();
    }
    }
    >
    <View style={{justifyContent: 'center'}}>
     <Text style={styles.title}>添加标签</Text>
    </View>
    </TouchableOpacity>: null
    return <View style={GlobalStyles.root_container}>
      {statusBar}
      {this.renderNavBar()}
      {resultView}
      {bottomButton}
      <Toast ref={toast=> this.toast=toast}/>
    </View>
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
    },
  statusBar: {
   height: 20,
    },
    textInput: {
     flex: 1,
     height: (Platform.OS === 'ios') ? 30 : 40,
     borderWidth:(Platform.OS === 'ios') ? 1: 0,
     borderColor: "white",
     alignSelf: 'center',
     paddingLeft: 5,
     marginRight: 10,
     marginLeft: 5,
     borderRadius:3,
     opacity: 0.7,
     color: 'white'
    },
    title: {
    fontSize: 18,
    color: "white",
    fontWeight: '500'
    },
  centering:{
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },
  bottomButton:{
    alignItems:'center',
    justifyContent:'center',
    opacity:0.9,
    height:40,
    position:'absolute',
    left:10,
    top:GlobalStyles.window_height-65, /*位置*/
    right:10,
    borderRadius:3
  }
  }
)
