// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    var basename=event.basename
    var ch_name=event.ch_name
  return await db.collection(basename).where({
    ch_name:db.RegExp({
      regexp: ch_name,
      options: 'm',
    })
 }).get()
}