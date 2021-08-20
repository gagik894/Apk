import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  BackHandler,
  Alert 
} from "react-native";
import Constants from "expo-constants";
import BottomTabNavigator from "./src/Navigation/BottomTabNavigation";
import Navigation from "./src/Navigation/Navigation";

import { NavigationContainer } from "@react-navigation/native";
import Add from "./src/screens/add/Add";
import Change from "./src/screens/auth/Change";
import ChatForm from './src/screens/chat/Chat'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';

import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;


export default function App() {

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       { text: 'YES', onPress: () => BackHandler.exitApp() },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () => backHandler.remove();
  // }, []);


  const [profile, setprofile] = React.useState(false);
  const [error, seterror] = React.useState(false);

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
      <StatusBar style="inverted" backgroundColor="black" />
      {error ? (
        <Text>Something went Wrong</Text>
      ) : profile ? (
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      ) : (
        <Navigation />
      )}
      {/* <ChatForm /> */}
      {/* <Add/> */}
      {/* <Change/> */}
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
