
export default function directionFilter(value, format = 'full') {
  let ret = "Unknown";
  value = parseFloat(value);
  switch (true){
    case (value >= 338 || value <= 22 ):
      ret = 'North'; //LANGUAGE.COM_MSG22;
      break;
    case (value >= 23 && value <= 75 ):
      ret = 'Northeast'; //LANGUAGE.COM_MSG23;
      break;
    case (value >= 76 && value <= 112 ):
      ret = 'East'; //LANGUAGE.COM_MSG24;
      break;
    case (value >= 113 && value <= 157 ):
      ret = 'Southeast'; //LANGUAGE.COM_MSG25;
      break;
    case (value >= 158 && value <= 202 ):
      ret = 'South'; //LANGUAGE.COM_MSG26;
      break;
    case (value >= 203 && value <= 247 ):
      ret = 'Southwest'; //LANGUAGE.COM_MSG27;
      break;
    case (value >= 248 && value <= 292 ):
      ret = 'West'; //LANGUAGE.COM_MSG28;
      break;
    case (value >= 293 && value <= 337 ):
      ret = 'Northwest'; //LANGUAGE.COM_MSG29;
      break;
  }
  return format === 'short' ? ret : `${ret} (${value}°)`;
}