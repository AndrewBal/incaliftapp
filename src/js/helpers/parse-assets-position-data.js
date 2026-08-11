import moment from "moment";
const CurrentTimeZone = moment().utcOffset() / 60;
export default function (arry, assets) {
 
  let newArry = [];
  assets.forEach(itm => {
    let posData = arry.find( assetPosData => assetPosData[1] === itm.IMEI)
    // console.log(arry)
    // console.log(itm.IMEI)
    if(!posData){
      return
    }
    let asset = {}
    asset.assetID = posData[0];
    asset.imei = posData[1];
    asset.name = itm.Name
    asset.protocolClass = posData[2];
    asset.positionType = posData[3];
    asset.dataType = posData[4];
    if(posData[5] !== null) {
      asset.positionTime = moment(posData[5].split('.')[0]).add(CurrentTimeZone, 'hours');
    }
    else {
      asset.positionTime = null;
    }
    if(posData[6] !== null) {
      asset.sysTime = moment(posData[6].split('.')[0]).add(CurrentTimeZone, 'hours');
    }
    else {
      asset.sysTime = null;
    }
    if(posData[7] !== null) {
      asset.staticTime = moment(posData[7]).add(CurrentTimeZone, 'hours');
    }
    else {
      asset.staticTime = null;
    }
    asset.isRealTime = posData[8];
    asset.isLocated = posData[9];
    asset.satelliteSignal = posData[10];
    asset.gsmSignal = posData[11];
    asset.lat = posData[12];
    asset.lng = posData[13];
    asset.alt = posData[14];
    asset.direct = posData[15];
    asset.speed = posData[16];
    asset.mileage = posData[17];
    asset.launchHours = posData[18];
    asset.alerts = posData[19];
    asset.status = posData[20];
    asset.originalAlerts = posData[21];
    asset.originalStatus = posData[22];
    asset.selected = false;
    newArry.push(asset);
  })
  return newArry;
}
/*
export default function (arry, assets) {
  let newArry = [];
  if (arry && arry.length) {
    for (let i = arry.length - 1; i >= 0; i--) {
      let asset = {}

      asset.assetID = arry[i][0];
      asset.imei = arry[i][1];

      let assetIdx = assets.findIndex( item => item.ID === asset.assetID )
      asset.name = assetIdx === -1 ? asset.imei : assets[assetIdx].Name

      asset.protocolClass = arry[i][2];
      asset.positionType = arry[i][3];
      asset.dataType = arry[i][4];
      if(arry[i][5] !== null) {
        asset.positionTime = moment(arry[i][5].split('.')[0]).add(CurrentTimeZone, 'hours');
      }
      else {
        asset.positionTime = null;
      }
      if(arry[i][6] !== null) {
        asset.sysTime = moment(arry[i][6].split('.')[0]).add(CurrentTimeZone, 'hours');
      }
      else {
        asset.sysTime = null;
      }
      if(arry[i][7] !== null) {
        asset.staticTime = moment(arry[i][7]).add(CurrentTimeZone, 'hours');
      }
      else {
        asset.staticTime = null;
      }
      asset.isRealTime = arry[i][8];
      asset.isLocated = arry[i][9];
      asset.satelliteSignal = arry[i][10];
      asset.gsmSignal = arry[i][11];
      asset.lat = arry[i][12];
      asset.lng = arry[i][13];
      asset.alt = arry[i][14];
      asset.direct = arry[i][15];
      asset.speed = arry[i][16];
      asset.mileage = arry[i][17];
      asset.launchHours = arry[i][18];
      asset.alerts = arry[i][19];
      asset.status = arry[i][20];
      asset.originalAlerts = arry[i][21];
      asset.originalStatus = arry[i][22];
      asset.selected = false;
      newArry.push(asset);
    }
    //newArry.reverse();
  }
  return newArry;
}*/
