/**
 * Created by licong on 2018/6/27.
 */

import React, {Component, PropTypes} from "react";
import {BackAndroid} from "react-native";

export default class BackPressComponent{
  /*super(props)初始化父类的构造方法*/
  constructor(props){
    this._hardwareBackPress=this.onHardwareBackPress.bind(this);
    this.props=props;
  }
  componentDidMount(){
    if(this.props.backPress)BackAndroid.addEventListener('hardwareBackPress',this._hardwareBackPress);
  }
  componentWillUnmount(){/*卸载的时候移除监听*/
    if(this.props.backPress)BackAndroid.removeEventListener('hardwareBackPress',this._hardwareBackPress);
  }
  onHardwareBackPress(e){/*定义回调方法*/
    return this.props.backPress(e);
  }
}

