/**
 * Created by licong on 2018/6/21.
 */

export default function makeCancelable(promise) {
  let hasCanceled_=false; /*标志*/
  const wrappedPromise=new Promise((resolve,reject)=>{
    promise.then((val)=>{
      hasCanceled_?reject({isCanceled:true}):resolve(val)/*获取数据*/
    });
    promise.catch((error)=>{
      hasCanceled_?reject({isCanceled:true}):resolve(error)
    })
  });
  return {
    promise:wrappedPromise, /*封装的promise*/
    cancel(){
      hasCanceled_=true;
    }
  }

}