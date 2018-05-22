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
  WebView
} from 'react-native'
import NavigationBar from '../../js/common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
// const URL = 'http://www.imooc.com'
const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    this.url = this.props.item.html_url ? this.props.item.html_url
      : TRENDING_URL + this.props.item.fullName;
    var title = this.props.item.full_name ? this.props.item.full_name
      : this.props.item.fullName;
    this.state = {
     url: this.url,
     canGoBack: false,
     title: title
    }
  }
search() {
  this.setState({
  url: this.searchText
  })
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
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          statusBar={{
            backgroundColor:'#2196F3'
          }}
          leftButton={ViewUtils.getLeftButton(() =>this.onBack())}
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
