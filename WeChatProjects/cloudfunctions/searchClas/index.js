// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    var basename=event.basename
    var pageSize=event.pageSize
    var pageSkip=event.pageSkip
    var role=event.role
    var key=event.key
  return await db.collection(basename).where({
    [key]:db.RegExp({
      regexp: role,
      options: 'm',
    })
 }).get()
}