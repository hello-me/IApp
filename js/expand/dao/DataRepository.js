/**
 * Created by licong on 2018/5/2.
 */
import {
 AsyncStorage
} from 'react-native'
import GitHubTrending from 'GitHubTrending'
export var FLAG_STORAGE={flag_popular: 'popular', flag_trending: 'trending'};
export default class DataRepository {
constructor(flag) {
 this.flag = flag;
 if (flag===FLAG_STORAGE.flag_trending)this.trending=new GitHubTrending()
}
  fetchRepository(url) {
    return new Promise((resolve, reject)=> {
      this.fetchLocalRepository(url).then((wrapData)=> {
        if (wrapData) {
          resolve(wrapData, true);
        } else {
          this.fetchNetRepository(url).then((data)=> {
            resolve(data);
          }).catch((error)=> {
            reject(error);
          })
        }

      }).catch((error)=> {
        this.fetchNetRepository(url).then((data)=> {
          resolve(data);
        }).catch((error=> {
          reject(error);
        }))
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
      if (this.flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then((response)=>response.json())
          .catch((error)=> {
            reject(error);
          }).then((responseData)=> {
          if (this.flag === FLAG_STORAGE.flag_my && responseData) {
            this.saveRepository(url, responseData)
            resolve(responseData);
          } else if (responseData && responseData.items) {
            this.saveRepository(url, responseData.items)
            resolve(responseData.items);
          } else {
            reject(new Error('responseData is null'));
          }
        })
      } else {
        this.treding.fetchTrending(url)
          .then((items)=> {
            if (!items) {
              reject(new Error('responseData is null'));
              return;
            }
            resolve(items);
            this.saveRepository(url, items)
          }).catch((error)=> {
          reject(error);
        })
      }
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