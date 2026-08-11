const DOMAIN1 = "https://newapi.quiktrak.co/";
const DOMAIN1_ = "https://testapi.quiktrak.co/";
const DOMAIN2 = "https://helper.quiktrak.com.au/"
const DOMAIN4 = "https://osrm.sinopacific.com.ua/";
const DOMAIN7 = "https://nominatim.sinopacific.com.ua/";
const DOMAIN8 = "https://nominatim.openstreetmap.org/";
const DOMAIN9 = "https://upload.quiktrak.co/";
export default {
  DOMAIN1,
  DOMAIN1_,
  DOMAIN4,
  DOMAIN7,
  DOMAIN8,
  DOMAIN9,
  URL: {
    LOGIN: DOMAIN1+'PreStart/V1/User/Auth',
    LOGOUT: DOMAIN1+'QuikProtect/V1/Client/Logoff',
    PHOTO_UPLOAD: DOMAIN9+'image/Upload',
    UPLOAD_TASK: DOMAIN1+'prestart/v1/user/UploadTask',
    GPS_UPLOAD_LINK: 'https://sinopacificukraine.com/test/phonetrack/locations.php',
    START_TRIP: DOMAIN1+'prestart/v1/user/StartTrip',
    END_TRIP: DOMAIN1+'prestart/v1/user/EndTrip',
    EDIT_TRIP: DOMAIN1+'prestart/V1/user/EditTrip',
 
    GET_TRIPS: DOMAIN1+'prestart/v1/user/QueryTrip',
    GET_FAULTS: DOMAIN1+'prestart/v1/user/QueryTask',
    SUBMIT_ACCIDENT_REPORT: DOMAIN1+'prestart/v1/user/SubmitAccidentEvent',
    GET_TASKS: DOMAIN1+'/prestart/v1/user/GetAllTaskOfDriver',

    GET_TRIPS_IN_PROGRESS: DOMAIN1+'prestart/v1/user/GetLiveTripList',
    GET_PLAYBACK: DOMAIN1+'QuikTrak/V1/Device/GetHisPosArray2',
    GET_ADDRESS_BY_GEOCODER: DOMAIN7+'reverse.php',
    GET_ADDRESS_BY_GEOCODER2: DOMAIN8+'reverse',
    GET_COORDINATES_BY_GEOCODER: DOMAIN7+'search.php',
    GET_COORDINATES_BY_GEOCODER2: DOMAIN8+'search',
    GET_PLAYBACK_ARR_OPTIMISED: DOMAIN4+'playback/v2',
    GET_ASSETS_LOCATION: DOMAIN1+'QuikTrak/V1/Device/GetPosInfosDB',
    SET_IMMOBILISATION_NO_PAY: DOMAIN1 + "Quikloc8/V1/asset/RelayNoPay",

    EDIT_ACCOUNT: DOMAIN1 + 'QuikTrak/V1/User/Edit',
    CHANGE_PASSWORD: DOMAIN1 + 'QuikTrak/V1/User/Password',

    SET_NOTIFICATION_STATUS: DOMAIN1 + "Installer/V1/Client/Notification",
    GET_JOB_LIST: DOMAIN1_ + "Installer/V1/Job/getlist",
    CHANGE_JOB_STATUS: DOMAIN1_ + "Installer/V1/Job/ChangeStatus",
    EDIT_JOB: DOMAIN1_ + "Installer/V1/Job/Edit",
    GET_JOB_CHECKLIST: DOMAIN1_ + "Installer/V1/Job/GetCheckList",
    REFRESH_PUSH_TOKEN: DOMAIN1 + "QuikTrak/V1/User/RefreshToken",
    GET_NEW_NOTIFICATIONS: DOMAIN1 + "QuikTrak/V1/Device/Alarms",
    GET_ASSET_DETAILS: DOMAIN1 + "Common/v1/Activation/GetAssetsInfo",
    UNBIND_ASSET:  DOMAIN1  +   "/prestart/v1/user/UnbindAsset",
    SET_LOCAL_DB: 'https://activation.smartostrich.quiktrak.eu/php/set_trip.php',
    GET_ASSET_RATING: DOMAIN1 + "QuikTrak/V1/Device/DriverBehaviour",
    SEND_TRIP_REPORT: DOMAIN2 + "send-smartostrich-trip/"
  }
}
//https://newapi.quiktrak.co/Common/v1/Activation/GetAssetsInfo