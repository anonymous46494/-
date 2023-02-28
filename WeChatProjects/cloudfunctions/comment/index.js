// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event) => {
  var id = event.id
  var basename=event.basename
  var content=event.content
  var nickName=event.nickName
  var avatarUrl=event.avatarUrl
  var time = db.serverDate()
  return await db.collection(basename).doc(id).update({
    data: {
      comment: _.push([{
        time: time,
        content:content,
        nickName:nickName,
        avatarUrl:avatarUrl
      }])
    }
  })
}