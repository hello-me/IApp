/**
 * Created by licong on 2018/5/2.
 */
import {
 AsyncStorage
} from 'react-native'
export default class DataRepository {
  fetchRepository(url) { //获取本地数据
  return new Promise((resolve, reject) => {
  this.fetchLocalRepository(url)
    .then(result=> {
     if (result) {
             resolve(result);
     } else {
     this.fetchNetRepository(url)
       .then(result=> {
       resolve(result)
       })
       .catch(e=> {
       resolve(e)
       })
     }
    })
    .catch(e=> {
    this.fetchNetRepository(url)
      .then(result => {
      resolve(result)
      })
      .catch(e=> {
        resolve(e)
      })
    })
  })
  }
  fetchLocalRepository(url) {
   return new Promise((resolve, reject) => {
   AsyncStorage.getItem(url, (error, result) => {
   if (!error) {
    try {
    resolve(JSON.parse(result));
    } catch(e) {
    reject(e);
    console.error(e)
    }
   } else {
   reject(error);
   console.error(error);
   }
   })
   })
  }
 fetchNetRepository(url) {
   return new Promise((resolve, reject)=> {
     fetch(url)
       .then(response=>response.json())
       .then(result=> {
         if(!result) {
           reject(new Error('responseData is null'));
           return;
         }
         resolve(result.items);
         this.saveRepository(url, result.items)
       })
       .catch(error=> {
        reject(error)
       })
   })
 }
  saveRepository(url, items, callBack) {
  if(!url|| !items) return;
  let wrapData = {items: items, update_date: new Date().getTime()};
  AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
  }
  checkData(longtime) {
  return false;
  let cDate = new Date();
  let tDate = new Date();
  tDate.setTime(longtime);
  if (cDate.getMonth() !== tDate.getMonth()) return false;
  if (cDate.getDay() !== tDate.getDay()) return false;
  if (cDate.getHours()-tDate.getHours() > 4) return false;
  return true;
  }
}