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
  return await db.collection('userData').doc(id).update({
    data: {
      history: _.push([{
        ch_name: event.ch_name,
        en_name: event.en_name,
        clas: event.clas,
        grade: event.grade,
        img: event.img,
      }])
    }
  })
}