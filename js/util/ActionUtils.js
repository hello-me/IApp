/**
 * Created by licong on 2018/6/8.
 */
import RepositoryDetail from '../pages/RepositoryDetail'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'

export default class ActionUtils {
  static onSelectRepository(params) {
    var {navigator}=params;
    navigator.push({
      component: RepositoryDetail,
      params: {
        ...params
      },
    });
  }
  static onFavorite(favoriteDao,item, isFavorite, flag) {
    var key= flag===FLAG_STORAGE.flag_trending? item.fullName: item.toString();
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(key);
    }
  }
}