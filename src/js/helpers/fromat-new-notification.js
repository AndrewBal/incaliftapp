import moment from "moment";
import tFormat from './time-formats'
import isJsonString from './is-json-string'

export default function(messageList = []){
  let newMessageList = [];

  if (Array.isArray(messageList)) {
    for (let i = 0; i < messageList.length; i++) {
      let msg = null;
      let msgTemp = null;
      let popped = null;
      let localTime = null
      if (messageList[i].payload) {
        msg = isJsonString(messageList[i].payload);
        if (!msg) {
          msg = messageList[i].payload;
        }
      }else{
        msg = isJsonString(messageList[i]);
        if (!msg) {
          msg = messageList[i];
        }
      }
      if (msg ) {
        if (msg.PositionTime) {
          localTime  = moment.utc(msg.PositionTime).toDate();
          msg.PositionTime = moment(localTime).format(tFormat[0]);
        }
        if (msg.time) {
          localTime  = moment.utc(msg.time).toDate();
          msg.time = moment(localTime).format(tFormat[0]);
        }
        if (msg.CreateDateTime) {
          localTime  = moment.utc(msg.CreateDateTime).toDate();
          msg.CreateDateTime = moment(localTime).format(tFormat[0]);
        }
        if(msg.lat){
          msg.Lat = msg.lat;
        }
        if(msg.lng){
          msg.Lng = msg.lng;
        }
        if(msg.title){
          msg.alarm = msg.title;
        }
        if(msg.imei){
          msg.Imei = msg.imei;
        }
        if(msg.IMEI){
          msg.Imei = msg.IMEI;
        }
        if(msg.name){
          msg.AssetName = msg.name;
        }
        if(msg.speed){
          msg.Speed = msg.speed;
        }
        if(typeof msg.direct !== 'undefined'){
          msg.Direction = msg.direct;
        }
        if(msg.time){
          msg.CreateDateTime = msg.time;
        }

        /*if(msg.type && parseInt(msg.type) === 1024){
          self.methods.getNewData(false, true);
        }*/

        msgTemp = msg;
        popped = newMessageList.pop();
        if (popped) {
          popped = JSON.stringify(popped);
          msgTemp = JSON.stringify(msgTemp);

          if (popped !== msgTemp) {
            popped = JSON.parse(popped);
            newMessageList.push(popped);
          }
        }

        newMessageList.push(msg);
      }
    }
  }
  return newMessageList;
}