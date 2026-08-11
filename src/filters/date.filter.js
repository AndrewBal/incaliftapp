import moment from 'moment'
import tFormat from '../js/helpers/time-formats'

export default function dateFilter(value, format = '', toFormat = 'full') {
  let ret = 'n/a';
  if(value){
    if(format === 'X'){
      ret = moment(value, format).format(toFormat === "onlyDate" ? tFormat[3] : (toFormat === 'shortDateTime') ? tFormat[5] : tFormat[0]);
    }else{
      ret = moment(value, format).add(moment().utcOffset(),'minutes').format(toFormat === "onlyDate" ? tFormat[3] : (toFormat === 'shortDateTime') ? tFormat[5] : tFormat[0]);
    }
  }
  return ret;
}