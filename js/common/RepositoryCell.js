/**
 * Created by licong on 2018/5/4.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native'
export default class RepositoryCell extends Component{
  constructor(props) {
  super(props);
  this.state = {　/**/
    isFavorite: this.props.data.isFavorite,
    favoriteIcon: this.props.data.isFavorite === true ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
  }
  }
  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
    })
  }
  onPressFavorite() {
  this.setFavoriteState(!this.state.isFavorite);
  this.props.onFavorite(this.props.data.item , !this.state.isFavorite)
  }
  render() {
    let AuthorImage = this.props.data.owner ?  <Image style={{height: 22, width:22}} source={{uri:this.props.data.owner.avatar_url}}
    /> : <Image style={{height: 22, width:22}} source={require('../../res/images/wanzi.png')}/>
    let favoriteButton = <TouchableOpacity
    onPress={() =>this.onPressFavorite()}
    >
    <Image
    style={{width:22, height: 22, tintColor: '#2196F3'}}
    source={this.state.favoriteIcon}
    />
    </TouchableOpacity>
  return <TouchableOpacity
  onPress={this.props.onSelect}
  style={styles.container}
  >
  <View style={styles.cell_container}>
    <Text style={styles.title}>{this.props.data.full_name}</Text>
    <Text style={styles.description}>{this.props.data.description}</Text>
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>Author:</Text>
        {AuthorImage}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
       <Text>Start:</Text>
        <Text>{this.props.data.stargazers_count}</Text>
      </View>
      {favoriteButton}
    </View>
  </View>
  </TouchableOpacity>
  }
}
const styles=StyleSheet.create({
  container: {
  flex:1
 },
   tilte: {
   fontSize:16,
  marginBottom:2,
  color: '#212121'
 },
  description: {
  fontSize:14,
  marginBottom:2,
 color:'#757575'
},
 cell_container: {
   backgroundColor: 'white',
   padding: 10,
   marginLeft: 5,
   marginRight: 5,
   marginVertical: 3,
   borderColor: '#dddddd',
   borderWidth: 0.5,
   borderRadius: 2,
   shadowColor: 'gray',
   shadowOffset: {width:0.5, height: 0.5},
   shadowOpacity: 0.4,
   shadowRadius: 1,
   elevation:2
}
})
