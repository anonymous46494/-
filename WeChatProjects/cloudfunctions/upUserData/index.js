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
  var location = event.location
  var time = db.serverDate()
  return await db.collection('userData').doc(id).update({
    data: {
      login_Date: _.push([{
        time: time,
        location: location
      }])
    }
  })
}