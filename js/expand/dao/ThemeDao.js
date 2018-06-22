/**
 * Created by licong on 2018/6/22.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput
} from 'react-native'
export default class ThemeDao extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}></View>
    )
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
  }
)
