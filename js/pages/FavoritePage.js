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
  Alert,
  ListView,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from '../expand/dao/FavoriteDao'
import TrendingCell from '../common/TrendingCell'
import ArrayUtils from '../util/ArrayUtils'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ProjectModel from '../model/ProjectModel'
import BaseComponent from './BaseComponent'
export default class FavoritePage extends BaseComponent {
constructor(props) {
super(props)
 this.state = {
   theme: this.props.theme,
 }
}
  render() {
  let content =
    <ScrollableTabView
      tabBarBackgroundColor={this.state.theme.themeColor}
      tabBarInctiveTextColor="mintcream"
      tabBarActiveTextColor="white"
      tabBarUnderlineStyle={{backgroundColor:'#e7e7e7', height:2}}
      renderTabBar={() => <ScrollableTabBar/>}
    >
    <FavoriteTab tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
    <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
    </ScrollableTabView>
    return <View style={styles.container}>
      <NavigationBar
        title={'收藏'}
        statusBar={
          {backgroundColor: this.state.theme.themeColor}
        }
      />
      {content}
    </View>
  }
}
class FavoriteTab extends Component {
 constructor(props) {
  super(props);
   this.unFavoriteItems = []
   this.favoriteDao = new FavoriteDao(this.props.flag);
  this.state = {
   result: '',
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
    isLoading: false,
    favoriteKeys: []
  }
 }
 componentDidMount() {
 this.loadData()
 }
 componentWillReceiveProps(nextProps) {
  this.loadData(false)
 }
 updateState(dic) {
  if(!this) return;
  this.setState(dic)
 }
 loadData(isShowLoading) {
 if (isShowLoading)
 this.updateState({
 isLoading: true
 })
   this.favoriteDao.getAllItems().then((items)=> {
     var resultData = [];
     for (var i = 0, len = items.length; i < len; i++) {
       resultData.push(new ProjectModel(items[i], true));
     }
     this.setState({
       isLoading: false,
       dataSource: this.getDataSource(resultData),
     });
     console.log(this.state.dataSource)
   }).catch((error)=> {
     this.setState({
       isLoading: false,
     });
   });
 }
  getDataSource(items) {
  return this.state.dataSource.cloneWithRows(items)
  }
  onSelect(data) {
   this.props.navigator.push({
    component: RepositoryDetail,
    params: {
        data: data,
        flag: FLAG_STORAGE.flag_popular,
      ...this.props
    }
   })
  }
  onFavorite(item, isFavorite) {
    ArrayUtils.updateArray(this.unFavoriteItems, item);
    if (this.unFavoriteItems.length > 0) {
      if (this.props.flag === FLAG_STORAGE.flag_popular) {
        DeviceEventEmitter.emit('favoriteChanged_popular');
      } else {
        DeviceEventEmitter.emit('favoriteChanged_trending');
      }
    }
  }
  renderRow(data){
let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell
 return <CellComponent
onSelect={() => this.onSelect(data)}
  data={data}
 theme={this.props.theme}
  key={this.props.flag === FLAG_STORAGE.flag_popular ? data.id : data.fullName}
  onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
  isFavorite={true}
 />
 }
 render() {
 return <View style={{flex:1}}>
  <ListView
    dataSource={this.state.dataSource}
    renderRow={(data)=> this.renderRow(data)}
    enableEmptySections={true}
    refreshControl={
    <RefreshControl
      title='Loading...'
      refreshing={this.state.isLoading}
      onRefresh={()=>this.loadData()}
      colors={[this.props.theme.themeColor]}
      tintColor={this.props.theme.themeColor}
      titleColor={this.props.theme.themeColor}
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