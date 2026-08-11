import moment from "moment";

export default function(date1, date2){
  let ret = "";
  if (date1 && date2) {
    //let one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    let date1_ms = moment(date1).valueOf();
    let date2_ms = moment(date2).valueOf();

    ret = date2_ms - date1_ms;
  }
  return ret;
}