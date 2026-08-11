export default function (arry) {
  let newArry = [];
  if (arry && arry.length) {
    for (let i = arry.length - 1; i >= 0; i--) {
      if ( JSON.stringify(arry[i]) !== JSON.stringify(arry[i-1]) ) {
        let index = 0;
        let point = {
          positionTime: arry[i][index++],
          lat: arry[i][index++],
          lng: arry[i][index++],
          direct: arry[i][index++],
          speed: arry[i][index++],
          timeSpan: arry[i][index++],
          mileage: arry[i][index++],
          alerts: arry[i][index++],
          status: arry[i][index++],
        };
        newArry.push(point);
      }
    }
    newArry.reverse();
  }
  return newArry;
}