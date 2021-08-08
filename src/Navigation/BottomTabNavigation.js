import React, { useState } from "react";
import { View, Text, Button, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Add from "../screens/add/Add";
import { TouchableOpacity } from "react-native-gesture-handler";
import Cards from "../screens/cards/Cards";
import User from "../screens/user/User";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../screens/search/Search";
import SignIn from "../screens/auth/SignIn";
import SignUp from "../screens/auth/SignUp";
import Chat from "../screens/chat/Chat";
import ChatForm from "../screens/chat/ChatForm";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

function UserNavigation(props) {
  return (
    <Stack.Navigator headerMode={"none"}>
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <Stack.Navigator headerMode={"none"}>
      <Stack.Screen name="Cards" component={Cards} />
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
  const [bar, setBar] = useState(true);
  //   const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  //   switch (routeName) {
  //     case 'Feed':
  //       return 'News feed';
  //     case 'Profile':
  //       return 'My profile';
  //     case 'Account':
  //       return 'My account';
  //   }
  // console.log(routeName)
  return (
    <Tab.Navigator activeColor="#f0edf6">
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <Image
              style={{ width: 35, height: 35, marginTop: 15 }}
              source={require("../../assets/img/search.png")}
            />
          ),
        }}
        name="search"
        component={Search}
      />
      <Tab.Screen
        options={({ route }) => ({
          tabBarVisible: getScreen(route),
          tabBarLabel: "",
          tabBarIcon: () => (
            <Image
              style={{ width: 35, height: 35, marginTop: 15 }}
              source={require("../../assets/img/home.png")}
            />
          ),
        })}
        name="Cards"
        component={Navigation}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <Image
              style={{ width: 35, height: 35, marginTop: 15 }}
              source={require("../../assets/img/user.png")}
            />
          ),
        }}
        name="User"
        component={UserNavigation}
      />
    </Tab.Navigator>
  );
}

function getScreen(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Cards";

  switch (routeName) {
    case "Cards":
      return true;
    case "Add":
      return false;
    case "Chat":
      return false;
  }
}
