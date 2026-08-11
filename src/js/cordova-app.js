import APIMETHODS from './api-methods'
import {store} from '@/store'
import getDevicePushInfo from "./helpers/get-device-push-info";
import formatNewNotification from './helpers/fromat-new-notification'

var cordovaApp = {
  f7: null,
  push: null,
  /*
  This method hides splashscreen after 2 seconds
  */
  handleSplashscreen: function() {
    var f7 = cordovaApp.f7;
    if (!window.navigator.splashscreen || f7.device.electron) return;
    setTimeout(() => {
      window.navigator.splashscreen.hide();
    }, 2000);
  },
  /*
  This method prevents back button tap to exit from app on android.
  In case there is an opened modal it will close that modal instead.
  In case there is a current view with navigation history, it will go back instead.
  */
  handleAndroidBackButton: function () {
    var f7 = cordovaApp.f7;
    const $ = f7.$;
    if (f7.device.electron) return;

    document.addEventListener('backbutton', function (e) {
      if ($('.actions-modal.modal-in').length) {
        f7.actions.close('.actions-modal.modal-in');
        e.preventDefault();
        return false;
      }
      if ($('.dialog.modal-in').length) {
        f7.dialog.close('.dialog.modal-in');
        e.preventDefault();
        return false;
      }
      if ($('.sheet-modal.modal-in').length) {
        f7.sheet.close('.sheet-modal.modal-in');
        e.preventDefault();
        return false;
      }
      if ($('.popover.modal-in').length) {
        f7.popover.close('.popover.modal-in');
        e.preventDefault();
        return false;
      }
      if ($('.popup.modal-in').length) {
        if ($('.popup.modal-in>.view').length) {
          const currentView = f7.views.get('.popup.modal-in>.view');
          if (currentView && currentView.router && currentView.router.history.length > 1) {
            currentView.router.back();
            e.preventDefault();
            return false;
          }
        }
        f7.popup.close('.popup.modal-in');
        e.preventDefault();
        return false;
      }
      if ($('.login-screen.modal-in').length) {
        f7.loginScreen.close('.login-screen.modal-in');
        e.preventDefault();
        return false;
      }

      if ($('.page-current .searchbar-enabled').length) {
        f7.searchbar.disable('.page-current .searchbar-enabled');
        e.preventDefault();
        return false;
      }

      if ($('.page-current .card-expandable.card-opened').length) {
        f7.card.close('.page-current .card-expandable.card-opened');
        e.preventDefault();
        return false;
      }

      const currentView = f7.views.current;
      if (currentView && currentView.router && currentView.router.history.length > 1) {
        currentView.router.back();
        e.preventDefault();
        return false;
      }

      if ($('.panel.panel-in').length) {
        f7.panel.close('.panel.panel-in');
        e.preventDefault();
        return false;
      }
    }, false);
  },
  /*
  This method does the following:
    - provides cross-platform view "shrinking" on keyboard open/close
    - hides keyboard accessory bar for all inputs except where it required
  */
  handleKeyboard: function () {
    var f7 = cordovaApp.f7;
    if (!window.Keyboard || !window.Keyboard.shrinkView || f7.device.electron) return;
    var $ = f7.$;
    window.Keyboard.shrinkView(false);
    window.Keyboard.disableScrollingInShrinkView(true);
    window.Keyboard.hideFormAccessoryBar(true);
    window.addEventListener('keyboardWillShow', () => {
      f7.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidShow', () => {
      f7.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidHide', () => {
      if (document.activeElement && $(document.activeElement).parents('.messagebar').length) {
        return;
      }
      window.Keyboard.hideFormAccessoryBar(false);
    });
    window.addEventListener('keyboardHeightWillChange', (event) => {
      var keyboardHeight = event.keyboardHeight;
      if (keyboardHeight > 0) {
        // Keyboard is going to be opened
        document.body.style.height = `calc(100% - ${keyboardHeight}px)`;
        $('html').addClass('device-with-keyboard');
      } else {
        // Keyboard is going to be closed
        document.body.style.height = '';
        $('html').removeClass('device-with-keyboard');
      }

    });
    $(document).on('touchstart', 'input, textarea, select', function (e) {
      var nodeName = e.target.nodeName.toLowerCase();
      var type = e.target.type;
      var showForTypes = ['datetime-local', 'time', 'date', 'datetime'];
      if (nodeName === 'select' || showForTypes.indexOf(type) >= 0) {
        window.Keyboard.hideFormAccessoryBar(false);
      } else {
        window.Keyboard.hideFormAccessoryBar(true);
      }
    }, true);
  },
  setupTrackingPlugin() {
    if(!window.BackgroundGeolocation){
      console.log('no background tracking plugin');
      return;
    }
    let config = {
      reset: false,
      foregroundService: true,
      notification: {
        priority: window.BackgroundGeolocation.NOTIFICATION_PRIORITY_MAX
      },
      debug: false,
      logLevel: window.BackgroundGeolocation.LOG_LEVEL_VERBOSE, //bgGeo.LOG_LEVEL_ERROR,
      desiredAccuracy: window.BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      //schedule: ["1-7 00:00-23:59"],
      allowIdenticalLocations: true,
      //distanceFilter: 0,
      url: APIMETHODS.URL.GPS_UPLOAD_LINK,
      maxDaysToPersist: 5,
      autoSync: true,
      //autoSyncThreshold: 2,
      batchSync: true,
      maxBatchSize: 50,
      stopOnTerminate: false,
      startOnBoot: true,
      speedJumpFilter: 200,
      forceReloadOnBoot: true,
      scheduleUseAlarmManager: true,
    };

    // 2. Execute #ready method:
    window.BackgroundGeolocation.ready(config).then(state => {
      console.log('- BackgroundGeolocation is ready: ', state);
    }).catch(error => {
      console.log('- BackgroundGeolocation error: ', error);
    });
  },
  setupPushPlugin(){
    let push = cordovaApp.push
    var f7 = cordovaApp.f7;

    push = PushNotification.init({
      "android": {
        //"senderID": "264121929701"
        icon: 'notification',
        //iconColor: 'blue'
      },
      "browser": {
        pushServiceURL: 'https://push.api.phonegap.com/v1/push'
      },
      "ios": {
        "sound": true,
        "vibration": true,
        "badge": true
      },
      "windows": {}
    });

    push.on('registration', function(data) {
      console.log('registration event: ' + data.registrationId);
      // alert('registered '+ data.registrationId);
      if (localStorage.PUSH_DEVICE_TOKEN !== data.registrationId) {
        // Save new registration ID
        localStorage.PUSH_DEVICE_TOKEN = data.registrationId;
        // Post registrationId to your app server as the value has changed
        setTimeout(function() {
          if (localStorage.PUSH_MOBILE_TOKEN && store.state.info.MajorToken && store.state.info.MinorToken && data.registrationId) {
            store.dispatch('REFRESH_PUSH_TOKEN', {
              MajorToken: store.state.info.MajorToken,
              MinorToken: store.state.info.MinorToken,
              MobileToken: localStorage.PUSH_MOBILE_TOKEN,
              DeviceToken: data.registrationId,
            })
          }

          getDevicePushInfo();
          if(localStorage.USERNAME && localStorage.PASSWORD){
            store.dispatch('login', {
              username: localStorage.USERNAME,
              password: localStorage.PASSWORD,

              AppKey: !localStorage.PUSH_APP_KEY ? '123' : localStorage.PUSH_APP_KEY,
              MobileToken: !localStorage.PUSH_MOBILE_TOKEN ? '123' : localStorage.PUSH_MOBILE_TOKEN,
              DeviceToken: !localStorage.PUSH_DEVICE_TOKEN ? '123' : localStorage.PUSH_DEVICE_TOKEN,
              DeviceType: !localStorage.DEVICE_TYPE ? 'webapp' : localStorage.DEVICE_TYPE,
            })
          }

        },1000);
      }
    });

    push.on('error', function(e) {
      //console.log("push error = " + e.message);
      alert("push error = " + e.message);
    });

    push.on('notification', function(data) {
      if (!localStorage.USERNAME || !localStorage.PASSWORD) {
        return
      }
      if (data && data.additionalData && data.additionalData.foreground) {
        // if application open, show popup
        let alertData = formatNewNotification([data.additionalData])[0];
        cordovaApp.displayNewNotificationArrived(alertData);
      } else if (data && data.additionalData && data.additionalData.payload) {
        //if user NOT using app and push notification comes
        f7.preloader.show();
        window.loginTimer = setInterval(function() {
          if (store.state.isLoggedIn) {
            clearInterval(window.loginTimer);
            setTimeout(function() {
              const mainView = f7.views.get('.view-main');
              let alertData = formatNewNotification([data.additionalData])[0];
              if(mainView.router.currentRoute.name && mainView.router.currentRoute.name === 'notification'){
                mainView.router.navigate('/notification/',{context: alertData, reloadCurrent: true, ignoreCache: true, });
              }else {
                mainView.router.navigate('/notification/',{context: alertData });
              }

              f7.preloader.hide();
            }, 1000);
          }
        }, 1000);
      }

      if (f7.device && f7.device.ios) {
        push.finish(
          () => {
            console.log('processing of push data is finished');
          },
          () => {
            console.log(
              'something went wrong with push.finish for ID =',
              data.additionalData.notId
            );
          },
          data.additionalData.notId
        );
      }
    });

    if　 (!localStorage.USERNAME && push) {
      push.clearAllNotifications(
        () => {
          console.log('success');
        },
        () => {
          console.log('error');
        }
      );
    }
  },
  displayNewNotificationArrived: function(message){
    let f7 = cordovaApp.f7;
    const mainView = f7.views.get('.view-main');

    f7.notification.create({
      //title: self.name,
      //titleRightText: LANGUAGE.COM_MSG091, //now
      subtitle: message.alarm,
      text: message.AssetName,
      closeOnClick: true,
      closeButton: true,
      on: {
        click: function () {
          if(mainView.router.currentRoute.name && mainView.router.currentRoute.name === 'notification'){
            mainView.router.navigate('/notification/',{context: message, reloadCurrent: true, ignoreCache: true, });
          }else {
            mainView.router.navigate('/notification/',{context: message });
          }
        },
      },
    }).open();

  },
  init: function (f7) {
    // Save f7 instance
    cordovaApp.f7 = f7;

    // Handle Android back button
    cordovaApp.handleAndroidBackButton();

    // Handle Splash Screen
    cordovaApp.handleSplashscreen();

    // Handle Keyboard
    cordovaApp.handleKeyboard();

    if (window.BuildInfo){
      f7.data.AppDetails.appId = window.BuildInfo.packageName;
      if (window.BuildInfo.version){
        f7.data.AppDetails.appVersion = window.BuildInfo.version;
      }
    }

    if (window.MobileAccessibility) {
      window.MobileAccessibility.usePreferredTextZoom(false);
    }

    if (window.StatusBar) {
      window.StatusBar.styleBlackOpaque();
    }

    if(window.isTablet){
      window.screen.orientation.unlock('any');
    }else{
      window.screen.orientation.lock('portrait');
    }

    //cordovaApp.setupTrackingPlugin();
    cordovaApp.setupPushPlugin();
  },
};

export default cordovaApp;
