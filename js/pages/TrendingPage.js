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
import DataRepository from '../expand/dao/DataRepository'
import NavigationBar from '../common/NavigationBar'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TrendingCell from '../common/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'
import TimeSpan from '../model/TimeSpan'
import PopoverTooltip from 'react-native-popover-tooltip'
const API_URL = 'https://api.github.com/search/repositories?q=';
 var timeSpanTextArray =[
  new TimeSpan('今天', 'since=daily')
  ,new TimeSpan('本周', 'since=weekly')
  ,new TimeSpan('本月', 'since=monthly')
 ]
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
    this.dataRespository = new DataRepository();
    this.state = {
      result: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
      isLoading: false,
    }
  }//
  componentDidMount() {
  this.loadData(this.props.timeSpan, true);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan)
    }
  }
  onRefresh() {
  this.loadData(this.props.timeSpan, true)
  }
  loadData(timeSpan, isRefresh) {
    this.setState({
      isLoading:true
    })
    let url=this.genFetchUrl(timeSpan, this.props.tabLabel);
    console.log(url)
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
  genFetchUrl(timeSpan, category) {
   return API_URL + category + '?' + timeSpan.searchText
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
    return <TrendingCell
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