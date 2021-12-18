import React, { useState, useEffect, useRef } from 'react';
import { Appearance, useColorScheme } from "react-native";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  BackHandler,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import BottomTabNavigator from "./src/Navigation/BottomTabNavigation";
import BottomTabNavigator_D from "./src/Navigation/BottomTabNavigation_D";
import Navigation from "./src/Navigation/Navigation";
import Navigation_D from "./src/Navigation/Navigation_D";
import Test from "./src/screens/test/test";
import { NavigationContainer } from "@react-navigation/native";
import Add from "./src/screens/add/Add";
import Change from "./src/screens/auth/Change";
import ChatForm from "./src/screens/chat/Chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import Pusher from "pusher-js/react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function App() {
  let colorScheme = useColorScheme();
  const [profile, setprofile] = React.useState(false);
  const [error, seterror] = React.useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        setprofile(true);
      } else {
        setprofile(false);
      }
    } catch (e) {
      seterror(false);
    }
  };
  getData();
  return (
    <SafeAreaView style={styles.container1}>
      {colorScheme == "dark" ? (
        <StatusBar backgroundColor="#202020" barStyle="light-content" />
      ) : (
        <StatusBar backgroundColor="#45b6ed" barStyle="light-content" />
      )}
      {error ? (
        <Text>Something went Wrong</Text>
      ) : profile ? (
        <NavigationContainer>
          {colorScheme == "dark" ? (
            <BottomTabNavigator_D />
          ) : (
            <BottomTabNavigator />
          )}
        </NavigationContainer>
      ) : colorScheme == "dark" ? (
        <Navigation_D />
      ) : (
        <Navigation />
      )}
      {/* <Test/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  container1: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    flex: 1,
  },
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  await SecureStore.setItemAsync("pushToken", token);
  return token;
}