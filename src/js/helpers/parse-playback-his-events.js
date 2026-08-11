export default function (arry) {
  let newArry = [];
  if (arry && arry.length) {
    for (let i = arry.length - 1; i >= 0; i--) {
      if ( JSON.stringify(arry[i]) !== JSON.stringify(arry[i-1]) ) {
        let index = 0;
        let point = {
          assetID: arry[i][index++],
          eventClass: arry[i][index++],
          eventType: arry[i][index++],
          state: arry[i][index++],
          otherCode: arry[i][index++],
          otherCode2: arry[i][index++],
          contactCode: arry[i][index++],
          beginTime: arry[i][index++],
          endTime: arry[i][index++],
          positionType: arry[i][index++],
          lat: arry[i][index++],
          lng: arry[i][index++],
          alt: arry[i][index++],
          alerts: arry[i][index++],
          status: arry[i][index++],
          content: arry[i][index++],
        };
        newArry.push(point);
      }
    }
    newArry.reverse();
  }
  return newArry;
}