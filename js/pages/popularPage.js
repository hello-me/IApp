/**
 * Created by licong on 2018/5/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Navigator,
  TextInput,
  ListView,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import NavigationBar from '../common/NavigationBar'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR='&sort=stars'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class PopularPage extends Component {
constructor(props) {
super(props)
  this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key)
  this.state = {
  languages: []
  }
}
 componentDidMount() {
 this.loadData()
 }
 loadData() {
   this.languageDao.fetch()
     .then(result=> {
       this.setState({
         languages: result
       })
     })
     .catch(error=> {
     console.log(error)
     })
 }
  render() {
  let content = this.state.languages.length > 0 ?
    <ScrollableTabView
      tabBarBackgroundColor="#2196F3"
      tabBarInctiveTextColor="mintcream"
      tabBarActiveTextColor="white"
      tabBarUnderlineStyle={{backgroundColor:'#e7e7e7', height:2}}
      renderTabBar={() => <ScrollableTabBar/>}
    >
      {this.state.languages.map((result,i, arr)=> {
        let lan=arr[i];
        return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}></PopularTab>: null
      })}
    </ScrollableTabView>: null;
    return <View style={styles.container}>
      <NavigationBar
        title={'最热'}
        statusBar={{ //状态栏
        backgroundColor:'#2196F3'
        }}
      />
      {content}
    </View>
  }
}
class PopularTab extends Component {
 constructor(props) {
  super(props);
  this.dataRespository = new DataRepository(FLAG_STORAGE.flag_popular);
  this.state = {
   result: '',
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
    isLoading: false,
    favoriteKeys: []
  }
 }//
 componentDidMount() {
 /*this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
   this.isFavoriteChanged = true;
 });*/
 this.loadData();
 }
/* componentWillUnmount() {
    if (this.listener) {
     this.listener.remove();
    }
 }*/
/* componentWillReceiveProps(nextProps) {
 if (this.isFavoriteChanged) {
   this.isFavoriteChanged = false;
   this.getFavoriteKeys();
   }
 }*/
 /*更新ProjectItem 的状态*/
 flushFavoriteState() {
  let projectModels = []
  let items = this.items;
  for (var i = 0, len = items.length; i < len; i++) {
     projectModels.push(new ProjectModel(item[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
  }
  this.updateState({
   isLoading: false,
  datasource: this.getDataSource(projectModels)
  });
 }
 getFavoriteKeys() {
 favoriteDao.getFavoriteKeys()
   .then(keys => {
   if (keys) {
   this.updateState({favoriteKeys:keys})
   }
   this.flushFavoriteState();
   })
   .catch(e=> {
   this.flushFavoriteState()
   })
 }
 updateState(dic) {
  if(!this) return;
  this.setState(dic)
 }
 loadData() {
 this.setState({
  isLoading:true
 })
   let url=this.genFetchUrl(this.props.tabLabel);
     this.dataRespository
       .fetchRepository(url)
       .then(result=> {
       let items=result && result.items ? result.items : result ? result : [];
         this.getFavoriteKeys()
       this.setState({
         dataSource:this.state.dataSource.cloneWithRows(items),
         isLoading: false,
       });
       if (result&&result.update_date&&!this.dataRespository.checkData(result.update_date)) {
         DeviceEventEmitter.emit('showToast', '数据已过时')
       return this.dataRespository.fetchNetRepository(url);
       } else {
         DeviceEventEmitter.emit('showToast', '显示缓存数据')
       }
       })
       .then(items=> {
        if(!items || items.length === 0) return;
         this.getFavoriteKeys()
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(items)
        })
         DeviceEventEmitter.emit('showToast', '显示网络数据')
       })
       .catch(error=> {
       console.log(error);
       this.setState({
       isLoading: false
       })
       })
 }
  getDataSource(items) {
  return this.state.dataSource.clonewithRows(items)
  }
  genFetchUrl(key) {
   return URL + key + QUERY_STR;
  }
  onSelect(item) {
   this.props.navigator.push({
    component: RepositoryDetail,
    params: {
        data: item,
        flag: FLAG_STORAGE.flag_popular,
      ...this.props
    }
   })
  }
  onFavorite(item, isFavorite) {
   if (isFavorite) {
   favoriteDao.saveFavoriteItem(item.toString(), JSON.stringify(item))
   } else {
   favoriteDao.removeFavoriteItem(item.id.toString())
   }
  }
  renderRow(data){
 return <RepositoryCell
  onSelect={() => this.onSelect(data)}
  data={data}
  key={data.id}
  onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
 />
 }
 render() {
 return <View style={{flex:1}}>
  <ListView
    dataSource={this.state.dataSource}
    renderRow={(data)=> this.renderRow(data)}
    refreshControl={
    <RefreshControl
      title='Loading...'
      refreshing={this.state.isLoading}
      onRefresh={()=>this.loadData()}
      colors={['#2196F3']}
      tintColor={'#2196F3'}
      titleColor={'#2196F3'}
      />
    }
  />
  </View>
 }
}
const styles = StyleSheet.create({
container: {
flex: 1
}
})