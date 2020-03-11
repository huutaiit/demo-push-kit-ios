/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import VoipPushNotification from 'react-native-voip-push-notification';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {v4} from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import  PushNotification from "react-native-push-notification";


// PushNotification.localNotificationSchedule({
//   //... You can use all the options from localNotifications
//   message: "My Notification Message", // (required)
//   date: new Date(Date.now() + 10 * 1000), // in 60 secs
//   contentAvailable:1
// });




RNCallKeep.setup({
  ios: {
    appName: 'demoPushKit',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
  },
});
const getNewUuid = () => v4().toLowerCase();

const format = uuid => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));


const displayIncomingCall = (number) => {
  const callUUID = getNewUuid();
  // addCall(callUUID, number);
  //
  // log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

  RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
};

VoipPushNotification.requestPermissions(); // --- optional, you can use another library to request permissions
VoipPushNotification.registerVoipToken(); // --- required

VoipPushNotification.addEventListener('register', (token) => {
  console.log('token',token)
  // send token to your apn provider server
});

VoipPushNotification.addEventListener('notification', notification => {
  // register your VoIP client, show local notification, etc.
  // e.g.
  console.log("notification",notification);
  displayIncomingCall(getRandomNumber());
  console.log("VoipPushNotification.wakeupByPush",VoipPushNotification.wakeupByPush);
  if (VoipPushNotification.wakeupByPush) {
    // do something...

    // remember to set this static variable to false
    // since the constant are exported only at initialization time
    // and it will keep the same in the whole app
    VoipPushNotification.wakeupByPush = false;
  }

  /**
   * Local Notification Payload
   *
   * - `alertBody` : The message displayed in the notification alert.
   * - `alertAction` : The "action" displayed beneath an actionable notification. Defaults to "view";
   * - `soundName` : The sound played when the notification is fired (optional).
   * - `category`  : The category of this notification, required for actionable notifications (optional).
   * - `userInfo`  : An optional object containing additional notification data.
   */
});


 class App extends Component{
   constructor() {
     super();
    // VoipPushNotification.wakeupByPush = true;
   }

   componentDidMount(): void {

    // displayIncomingCall(getRandomNumber());
     //PushNotification.popInitialNotification((notification) => { console.log(notification); })

     PushNotification.configure({
       // (optional) Called when Token is generated (iOS and Android)
       onRegister: function (token) {
       //  alert(token.token);
         console.log("TOKEN:", token);
       },
       onNotification: function(notification) {
         console.log("NOTIFICATION:", notification);
         displayIncomingCall(getRandomNumber());
         // process the notification

         // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
         // notification.finish(PushNotificationIOS.FetchResult.NoData);
       },
       permissions: {
         alert: true,
         badge: true,
         sound: true
       },

       // Should the initial notification be popped automatically
       // default: true
       popInitialNotification: true,

       /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
       requestPermissions: true
     })
     // RNCallKit.addEventListener('didReceiveStartCallAction', (data)=>{
     //   RNCallKit.startCall(callUUID, data.handle);
     // });
     // RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
     // RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
     //   console.log("callUUID",callUUID)
     //   RNCallKeep.startCall(this.getCurrentCallId());
     //   // Do your normal `Answering` actions here.
     // });
   }

   didReceiveStartCallAction=(data) => {
     //alert("sdfds")
   let { handle, callUUID, name } = data;
   this.startCall(callUUID,handle,name);
}
   getCurrentCallId = () => {
     if (!this.currentCallId) {
       this.currentCallId = v4().toLowerCase();
     }

     return this.currentCallId;
   };

  
   render() {
    return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
              <Header />
              {global.HermesInternal == null ? null : (
                  <View style={styles.engine}>
                    <Text style={styles.footer}>Engine: Hermes</Text>
                  </View>
              )}
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Step One</Text>
                  <Text style={styles.sectionDescription}>
                    Edit <Text style={styles.highlight}>App.js</Text> to change this
                    screen and then come back to see your edits.
                  </Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>See Your Changes</Text>
                  <Text style={styles.sectionDescription}>
                    <ReloadInstructions />
                  </Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Debug</Text>
                  <Text style={styles.sectionDescription}>
                    <DebugInstructions />
                  </Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Learn More</Text>
                  <Text style={styles.sectionDescription}>
                    Read the docs to discover what to do next:
                  </Text>
                </View>
                <LearnMoreLinks />
              </View>
            </ScrollView>
          </SafeAreaView>
        </>
    );
  }

}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
