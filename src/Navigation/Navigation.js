import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigation";
import { NavigationContainer } from "@react-navigation/native";
import SignIn from "../screens/auth/SignIn";
import SignUp from "../screens/auth/SignUp";
import Change from "../screens/auth/Change"
const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={"none"}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Change" component={Change} />
        <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
