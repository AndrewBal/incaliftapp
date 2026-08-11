function guid() {
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export default function(){
  let uid = guid();
  if(window.device) {
    if(!localStorage.PUSH_MOBILE_TOKEN){
      localStorage.PUSH_MOBILE_TOKEN = uid;
    }
    localStorage.PUSH_APP_KEY = BuildInfo.packageName;
    localStorage.PUSH_APPID_ID = BuildInfo.packageName;
    localStorage.DEVICE_TYPE = device.platform;
  }else{
    if(!localStorage.PUSH_MOBILE_TOKEN)
      localStorage.PUSH_MOBILE_TOKEN = uid;
    if(!localStorage.PUSH_APP_KEY)
      localStorage.PUSH_APP_KEY = uid;
    if(!localStorage.PUSH_DEVICE_TOKEN)
      localStorage.PUSH_DEVICE_TOKEN = uid;
    localStorage.PUSH_APPID_ID = 'android.app.quiktrak.eu.prestart';
    localStorage.DEVICE_TYPE = "android.app.quiktrak.eu.prestart";
  }
}