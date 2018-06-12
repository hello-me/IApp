/**
 * Created by licong on 2018/5/22.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Navigator,
  TouchableOpacity,
  ListView,
  RefreshControl,
  DeviceEventEmitter,
  Image,
  findNodeHandle,
  NativeModules
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from "../expand/dao/FavoriteDao"
import TimeSpan from '../model/TimeSpan'
import PopoverTooltip from 'react-native-popover-tooltip'
const API_URL = 'https://api.github.com/search/repositories?q=';
import ActionUtils from '../util/ActionUtils'
 var timeSpanTextArray =[
  new TimeSpan('今天', 'since=daily')
  ,new TimeSpan('本周', 'since=weekly')
  ,new TimeSpan('本月', 'since=monthly')
 ]
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
export default class TrendingPage extends Component {
  constructor(props) {
    super(props)
    this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_language)
    this.state = {
      languages: [],
      timeSpan: timeSpanTextArray[0]
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
  renderTitleView() {
  return <View>
    <PopoverTooltip
      ref='tooltip'
      buttonComponent={
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '400'
              }}
            >趋势{this.state.timeSpan.showText}</Text>
            <Image
              style={{width: 12, height:10, marginLeft:5}}
              source={require('../../res/images/ic_spinner_triangle.png')}/>
          </View>
      }
      items={[
        {
          label: '今天',
          onPress: () => {this.onSelectTimeSpan(timeSpanTextArray[0])}
        },
        {
          label: '本周',
          onPress: () => {this.onSelectTimeSpan(timeSpanTextArray[1])}
        },
        {
          label: '本月',
          onPress: () => {this.onSelectTimeSpan(timeSpanTextArray[2])}
        }
      ]}
      animationType='timing'
      springConfig={{tension: 90, friction: 3}}
    />
  </View>
  }
  onSelectTimeSpan(timeSpan) {
   this.setState({
   timeSpan: timeSpan
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
          return lan.checked ? <TrendingTab key={i} tabLabel={lan.name} timeSpan={this.state.timeSpan}  {...this.props}></TrendingTab>: null
        })}
      </ScrollableTabView>: null;
    return <View style={styles.container}>
      <NavigationBar
       titleView={this.renderTitleView()}
        statusBar={{ //状态栏
          backgroundColor:'#2196F3'
        }}
      />
      {content}
    </View>
  }
}
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.isFavoriteChanged = false
    this.items = []
    this.dataRespository = new DataRepository(FLAG_STORAGE.flag_trending);
    this.state = {
      result: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
      isLoading: false,
    }
  }//
  componentDidMount() {
  this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
  this.isFavoriteChanged = true
  })
  this.loadData(this.props.timeSpan, true);
  }
  componentWillUnmount() {
   if (this.listener) {
   this.listener.remove()
   }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan)
    } else if (this.isFavoriteChanged) {
    this.getFavoriteKeys();
    } else {
      this.flushFavoriteState();
    }
  }
  flushFavoriteState() {
  let projectModels = [];
  let items = this.items;
  for (var i = 0, len = items.length; i < len; i++) {
    projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
  }
  this.updateState({
    isLoading: false,
    isLoadingFail: false,
    dataSource: this.getDataSource(projectModels),
  });
}
  getFavoriteKeys() {
    favoriteDao.getFavoriteKeys().then((keys)=> {
      if (keys) {
        this.updateState({favoriteKeys: keys});
      }
      this.flushFavoriteState();
    }).catch((error)=> {
      this.flushFavoriteState();
      console.log(error);
    });
  }
  onRefresh() {
  this.loadData(this.props.timeSpan, true)
  }
  getDataSource(items) {
    return this.state.dataSource.cloneWithRows(items);
  }
  updateState(dic) {
    if (!this)return;
    this.setState(dic);
  }
  loadData(timeSpan, isRefresh) {
    this.updateState({
      isLoading: true
    })
    let url = this.genFetchUrl(timeSpan, this.props.tabLabel);
    this.dataRespository
      .fetchRepository(url)
      .then(result=> {
        this.items = result && result.items ? result.items : result ? result : [];
        this.getFavoriteKeys();
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(this.items),
          isLoading: false,
        });
        if (!this.items || isRefresh && result && result.update_date && !Utils.checkDate(result.update_date)) {
          return this.dataRespository.fetchNetRepository(url);
        }
      })
      .then((items)=> {
        if (!items || items.length === 0)return;
        this.items = items;
        this.getFavoriteKeys();
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(this.items),
          isLoading: false,
        });
      })
      .catch(error=> {
        console.log(error);
        this.updateState({
          isLoading: false
        });
      })
  }
  genFetchUrl(timeSpan, category) {
   return API_URL + category + '?' + timeSpan.searchText
  }
  onSelect(item) {
    this.props.navigator.push({
      component: RepositoryDetail,
      params: {
        data: item,
        ...this.props
      }
    })
  }
  renderRow(data){
    return <TrendingCell
      onSelect={() => this.onSelect(data)}
      data={data}
      key={data.id}
      onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorte, FLAG_STORAGE.flag_trending)}
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
            onRefresh={()=>this.onRefresh()}
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
