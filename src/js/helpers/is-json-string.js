export default function(str){
  let ret = false;
  try{ret=JSON.parse(str);}catch(e){return false;}return ret;
}