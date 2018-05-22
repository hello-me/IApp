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
import DataRepository from '../expand/dao/DataRepository'
import NavigationBar from '../common/NavigationBar'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR='&sort=stars'
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
  this.dataRespository = new DataRepository();
  this.state = {
   result: '',
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
    isLoading: false,
  }
 }//
 componentDidMount() {
 this.loadData();
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
  genFetchUrl(key) {
   return URL + key + QUERY_STR;
  }
  onSelect(item) {
   this.props.navigator.push({
    component: RepositoryDetail,
    params: {
     item: item,
      ...this.props
    }
   })
  }
  renderRow(data){
 return <RepositoryCell
 onSelect={() => this.onSelect(data)}
 data={data}
  key={data.id}
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