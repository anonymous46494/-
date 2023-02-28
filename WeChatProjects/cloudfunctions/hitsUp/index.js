// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var basename=event.basename
    var id=event.id;
    var key=event.key
    return await db.collection(basename).doc(id).update({
    data:{
      [key]:_.inc(1)
    }
  })
}