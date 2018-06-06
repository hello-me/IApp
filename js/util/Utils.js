/**
 * Created by licong on 2018/5/5.
 */
export default class Utils {
 /*
 * 检查该Item 有没有被收藏过
 * */
 static checkFavorite(item, items) {
 for (var i=0, len=items.length; i< len; i++) {
 if (item.id.toString() === items[i]) {
 return true;
    }
   }
   return false;
 }
/*
 * 检查该项目的更新时间
 * */
  static checkDate(longTime) {
    return false;
    let currentDate = new Date();
    let targetDate = new Date();
    targetDate.setTime(longTime);
    if (currentDate.getMonth() !== targetDate.getMonth())return false;
    if (currentDate.getDate() !== targetDate.getDate())return false;
    if (currentDate.getHours() - targetDate.getHours() > 4)return false;
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return true;
  }
}
