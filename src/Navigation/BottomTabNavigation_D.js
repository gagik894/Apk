import React, { useState } from "react";
import { View, Text, Button, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Add from "../screens/add/Add_D";
import { TouchableOpacity } from "react-native-gesture-handler";
import Cards from "../screens/cards/Cards";
import Cards_D from "../screens/cards/Cards_D";//
import Card_D from "../screens/cards/Card_D";
import User from "../screens/user/User_D";
import Users from "../screens/user/Users_D";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search_D from "../screens/search/Search_D";
import SignIn from "../screens/auth/SignIn_D";
import SignUp from "../screens/auth/SignUp_D";
import Chat from "../screens/chat/Chat_D";
import ChatForm from "../screens/chat/ChatForm_D";
import Change from "../screens/auth/Change";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

function UserNavigation(props) {
  return (
    <Stack.Navigator headerMode={"none"}>
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Add" component={Add} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Change" component={Change} />
      <Stack.Screen name="Card" component={Card_D} />
      <Stack.Screen name="Search" component={Search_D} />
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <Stack.Navigator headerMode={"none"}>
      {/* <Stack.Screen name="Cards" component={Cards} /> */}
      <Stack.Screen name="Cards" component={Cards_D} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="Add" component={Add} />
      <Stack.Screen name="Chat" component={ChatNavigation} />
    </Stack.Navigator>
  );
}

function ChatNavigation(props) {
  return (
    <Stack.Navigator headerMode={"none"}>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatForm" component={ChatForm} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator(route) {
  return (
    <Tab.Navigator initialRouteName="Cards" 
    tabBarOptions={{
          style: {
                backgroundColor: '#202020',
          }
   }}
    >
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                style={{ width: 35, height: 35, marginTop: 15 }}
                source={require("../../assets/img/searchActive_D.png")}
              />
            ) : (
              <Image
                style={{ width: 35, height: 35, marginTop: 15 }}
                source={require("../../assets/img/search_D.png")}
              />
            ),
        }}
        name="search"
        component={Search_D}
      />
      <Tab.Screen
        options={({ route }) => ({
          tabBarVisible: getScreenChat(route),
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                style={{ width: 35, height: 35, marginTop: 15 }}
                source={require("../../assets/img/homeActive_D.png")}
              />
            ) : (
              <Image
                style={{ width: 35, height: 35, marginTop: 15 }}
                source={require("../../assets/img/home_D1.png")}
              />
            ),
        })}
        name="Cards"
        component={Navigation}
      />
      <Tab.Screen
        options={({ route }) => ({
          tabBarVisible: getScreen(route),
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                style={{ width: 35, height: 35, marginTop: 15 }}
                source={require("../../assets/img/userActive_D.png")}
              />
            ) : (
              <Image
                style={{ width: 35, height: 35, marginTop: 15 }}
                source={require("../../assets/img/user_D.png")}
              />
            ),
        })}
        name="User"
        component={UserNavigation}
      />
    </Tab.Navigator>
  );
}

function getScreenChat(route1) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName1 = getFocusedRouteNameFromRoute(route1) ?? "Cards";

  switch (routeName1) {
    case "Cards":
      return true;
    case "Add":
      return false;
    case "Chat":
      return false;
  }
}
function getScreen(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "User";

  switch (routeName) {
    case "User":
      return true;
    case "Users":
      return true;
    case "Add":
      return false;
    case "SignIn":
      return false;
    case "SignUp":
      return false;
    case "Change":
      return false;
    case "BottomTabNavigator":
      return false;
  }
}
