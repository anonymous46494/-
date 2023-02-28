// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var basename = event.basename
  var pageSize = event.pageSize
  var pageSkip = event.pageSkip
  return await db.collection(basename).skip(pageSkip).limit(pageSize).get()
}