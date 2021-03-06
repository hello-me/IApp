/**
 * Created by licong on 2018/5/22.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  WebView,
  Image
} from 'react-native'
import NavigationBar from '../../js/common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import BackPressComponent from '../common/BackPressComponent'
// const URL = 'http://www.imooc.com'
const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    var item = this.props.data.item? this.props.data.item:this.props.data
    this.url = item.html_url ? item.html_url
      : TRENDING_URL + item.fullName;
    var title = item.full_name ?item.full_name
      : item.fullName;
    this.favoriteDao = new FavoriteDao(this.props.flag)
    this.state = {
     url: this.url,
     canGoBack: false,
     title: title,
     isFavorite: this.props.data.isFavorite,
      favoriteIcon: this.props.data.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
    }
  }
search() {
  this.setState({
  url: this.searchText
  })
}
  componentDidMount(){
    this.backPress.componentDidMount();/*调用*/
  }
  onBackPress(e){
    this.onBack();
    return true;
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();/*移除*/
  }
onBack() {
  if (this.state.canGoBack) {
   this.webView.goBack();
  } else {
   this.props.navigator.pop();
  }
}
 onNavigationStateChange(e) {
   this.setState({
    canGoBack: e.canGoBack,
    url: e.url
   })
 }
 setFavoriteState(isFavorite) {
  this.setState({
   isFavorite: isFavorite,
    favoriteIcon:  isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
  })
 }
  onRightButtonClick() {
   var projectModel = this.props.data;
   this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
   var key = projectModel.fullName ? projectModel.fullName : projectModel.full_name;
   if (projectModel.isFavorite) {
     this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel));
   } else {
     this.favoriteDao.removeFavoriteItem(key)
   }
  }
 renderRightButton() {
 return <TouchableOpacity
 onPress={()=> this.onRightButtonClick()}
 >
 <Image
 style={{width: 20, height: 20, marginRight: 10}}
 source={this.state.favoriteIcon}
 />
 </TouchableOpacity>
 }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          statusBar={{
            backgroundColor:'#2196F3'
          }}
          leftButton={ViewUtils.getLeftButton(() =>this.onBack())}
          rightButton={this.renderRightButton()}
        />
      <WebView
      ref={webView=>this.webView = webView}
      startInLoadingState={true}
      onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
      source={{uri: this.state.url}}
      />
      </View>
    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
  }
)
