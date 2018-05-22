/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Navigator,
  Text,
  View
} from 'react-native';
export default class App extends Component<Props> {
 constructor(props){
  super(props);
  this.state={
  }
}
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
 page1: {
 flex:1,
 backgroundColor: 'red',
 },
  page2: {
    flex:1,
    backgroundColor: 'yellow',
  },
  page3: {
    flex:1,
    backgroundColor: 'red',
  },
  page4: {
    flex:1,
    backgroundColor: 'yellow',
  },

  image: {
  height: 22,
  width: 22
  }
});
