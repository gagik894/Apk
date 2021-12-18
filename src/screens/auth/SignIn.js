import React, { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Formik } from "formik";

import * as Yup from "yup";
import Error from "./Error";
import * as Facebook from "expo-facebook";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Image,
  BackHandler
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
const SignIn = ({ navigation }) => {
  const [error, seterror] = React.useState("");
  const [keyboardstatus, setkeyboardstatus] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [fbloading, setfbloading] = React.useState(false);
  const [hiden, sethiden] = React.useState(true);
  const backAction = () => {
    BackHandler.exitApp()
  };
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    BackHandler.addEventListener('hardwareBackPress', backAction);
    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const _keyboardDidShow = () => {
    setkeyboardstatus(true);
  };

  const _keyboardDidHide = () => {
    setkeyboardstatus(false);
  };

  const signUpFetch = async (value) => {
    setloading(true);
    let pushToken = await SecureStore.getItemAsync("pushToken");
    value.pushToken=pushToken;
    try {
      const fetchedSignUp = await fetch(
        // "http://localhost:3333/auth/fbsignup",
        "https://backapi.herokuapp.com/auth/fbsignup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );
      const data = await fetchedSignUp.json();
      setloading(false);
      if (data.error) {
        seterror(data.error);
      } else {
        await AsyncStorage.setItem("token", data.auth_token);
        navigation.navigate("BottomTabNavigator");
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  const signInFetch = async (value) => {
    setloading(true);
    let pushToken = await SecureStore.getItemAsync("pushToken");
    value.pushToken=pushToken;
    try {
      const fetchedSignIn = await fetch(
        "https://backapi.herokuapp.com/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );
      const data = await fetchedSignIn.json();
      setloading(false);
      if (data.error) {
        seterror(data.error);
      } else {
        await AsyncStorage.setItem("token", data.auth_token);
        navigation.navigate("BottomTabNavigator");
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  const facebookLogIn = async () => {
    try {
      await Facebook.initializeAsync("804105460333300");
      const { type, token, expires, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile", "email"],
        });
      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=name,email,picture.height(200)`
        );
        const data = await response.json();

        const send = {
          username: data.name.split(" ").join("_"),
          fullname: data.name,
          email: data.email || null,
        };
        signUpFetch(send);
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  };
  const validation = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email ardess")
      .max(40, "Must be shorter than 40")
      .required("required"),
    password: Yup.string().min(6, "Must be more than 6").required("required"),
  });
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validation}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        signInFetch(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => {
        return (
          <View style={styles.container}>
            <Animatable.View
              animation="slideInDown"
              style={
                keyboardstatus
                  ? {
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      paddingTop: 15,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                    }
                  : {
                      flex: 1,
                      justifyContent: "flex-end",
                      paddingHorizontal: 20,
                      paddingBottom: 50,
                    }
              }
            >
              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : keyboardstatus ? (
                <Image
                  source={require("../../../assets/img/T.png")}
                  style={{
                    width: 125,
                    height: 125,
                    alignSelf: "center",
                    borderRadius: 25,
                  }}
                ></Image>
              ) : (
                <Image
                  source={require("../../../assets/T.png")}
                  style={{
                    width: 150,
                    height: 150,
                    alignSelf: "center",
                    borderRadius: 25,
                  }}
                ></Image>
              )}
            </Animatable.View>

            <Animatable.View
              style={
                keyboardstatus
                  ? {
                      flex: 1,
                      backgroundColor: "#fff",
                    }
                  : {
                      flex: 3,
                      backgroundColor: "#fff",
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                    }
              }
              animation="fadeInUpBig"
            >
              <KeyboardAwareScrollView
                style={{
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
              >
                <View style={styles.main}>
                  <View style={styles.header1}>
                    <View style={styles.action}>
                      <TextInput

                        autoCapitalize="none"
                        autoCompleteType="email"
                        keyboardType="email-address"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        placeholder="Email or userrname"
                        placeholderTextColor="#666666"
                        style={styles.textInput}
                        value={values.email}
                      />
                    </View>
                    <Error touch={touched.email} error={errors.email} />

                    <View style={styles.action}>
                      <TextInput
                        autoCapitalize="none"
                        autoCompleteType="password"
                        keyboardType={hiden ? null : "visible-password"}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        placeholder="Password"
                        placeholderTextColor="#666666"
                        style={styles.textInput}
                        value={values.password}
                        secureTextEntry={hiden ? true : false}
                      />
                      <TouchableOpacity onPress={() => sethiden(!hiden)}>
                        {hiden ? (
                          <FontAwesome name="lock" size={20} />
                        ) : (
                          <FontAwesome name="unlock" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <Error touch={touched.password} error={errors.password} />
                    <TouchableOpacity
                      style={styles.signIn}
                      onPress={handleSubmit}
                    >
                      <View>
                        {loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text
                            style={[
                              styles.textSign,
                              {
                                color: "#fff",
                              },
                            ]}
                          >
                            Log In
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.button}>
                    <View style={styles.forgot}>
                      <Text
                        style={[
                          {
                            color: "#666666",
                            fontSize: 12,
                          },
                        ]}
                      >
                        Forgot your password?
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Change")}
                      >
                        <Text
                          style={[
                            {
                              color: "blue",
                              fontSize: 12,
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          {" "}
                          Get help heare
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.fbLogin}>
                      <TouchableOpacity
                        style={styles.fbsignIn}
                        onPress={() => facebookLogIn()}
                      >
                        <View>
                          {fbloading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text
                              style={[
                                styles.textSign,
                                {
                                  color: "#fff",
                                },
                              ]}
                            >
                              Continue with Facebook
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.signUp}>
                  <Text
                    style={[
                      {
                        color: "#666666",
                      },
                    ]}
                  >
                    Don't have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text
                      style={[
                        {
                          color: "blue",
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {" "}
                      Sign Up.
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </Animatable.View>
          </View>
        );
      }}
    </Formik>
  );
};

export default SignIn;

const height = Math.round(Dimensions.get("window").height * 0.75 - 50);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#45b6ed",
  },
  error: {
    fontSize: 25,
    color: "#fc0303",
  },
  header1: {
    paddingTop: 30,
    height: 225,
    justifyContent: "space-around",
  },
  main: {
    height: height - 60,
    paddingHorizontal: 20,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    borderRadius: 5,
    height: 50,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "black",
    paddingBottom: 5,
    justifyContent: "space-between",
    paddingRight: 10,
    alignItems: "center",
  },

  textInput: {
    width: "80%",
    paddingLeft: 15,
  },

  button: {
    borderRadius: 5,
    alignItems: "center",
    flex: 2,
  },
  signIn: {
    backgroundColor: "#45b6ed",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  fbsignIn: {
    backgroundColor: "#47639c",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  signUp: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "black",
    height: 50,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  forgot: {
    flexDirection: "row",
    margin: "3%",
  },
  fbLogin: {
    justifyContent: "center",
    width: "100%",
    height: 80,
    borderTopWidth: 1.5,
    borderTopColor: "#eaededed",
  },
});
