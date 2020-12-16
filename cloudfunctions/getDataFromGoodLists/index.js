// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var databaseName = event.databaseName
  var skipNumber = Number(event.skipNumber)
  var needNumber = Number(event.needNumber)
  var type = event.type
  var campus = event.campus
  if(campus == "全部校区"){
    var goodList = db.collection(databaseName).where({
    }).skip(skipNumber).limit(needNumber).get()
    return goodList
  }
  else{
    var goodList = db.collection(databaseName).where({
      type: _.in([type]),
      campus:campus
    }).skip(skipNumber).limit(needNumber).get()
    return goodList
  }
}