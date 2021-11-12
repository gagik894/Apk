import React, { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { Formik } from "formik";
import * as Yup from "yup";
import Error from "./Error";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const SignUp = ({ navigation }) => {
  const [error, seterror] = React.useState(null);
  const [signuppage, setsignup] = React.useState(1);
  const [keyboardstatus, setkeyboardstatus] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [hiden, sethiden] = React.useState(true);
  let email;
  let validation;
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setkeyboardstatus(true);
  };

  const _keyboardDidHide = () => {
    setkeyboardstatus(false);
  };

  const verifyFetch = async (value) => {
    setloading(true);
    const codeHash = await SecureStore.getItemAsync("secCode");
    const code = value.code;
    const profileData = await SecureStore.getItemAsync("profileData");
    const sent = {
      codeHash: codeHash,
      code: code,
      profileData: profileData,
    };
    try {
      const verifyedFetch = await fetch(
        // "http://localhost:3333/auth/verify",
        "https://backapi.herokuapp.com/auth/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sent),
        }
      );
      const data = await verifyedFetch.json();
      setloading(false);
      if (data.error) {
        seterror(data.error);
        return;
      }
      await AsyncStorage.setItem("token", data.auth_token);
      await SecureStore.deleteItemAsync("secCode");
      await SecureStore.deleteItemAsync("profileData");
      navigation.navigate("BottomTabNavigator");
    } catch (error) {
      console.log(error);
      seterror("Something went wrong!!!");
      setloading(false);
    }
  };
  const signUpFetch = async (value) => {
    setloading(true);
    try {
      const fetchSignUp = await fetch(
        // "http://localhost:3333/auth/signup",
        "https://backapi.herokuapp.com/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );
      const data = await fetchSignUp.json();
      setloading(false);
      if (data.error) {
        seterror(data.error);
        return;
      }
      const profileData = JSON.stringify(data.data);
      await SecureStore.setItemAsync("profileData", profileData);
      await SecureStore.setItemAsync("secCode", data.secCode);
      // await AsyncStorage.setItem("token", data.auth_token);
      setsignup(4);
      seterror(false);
      // navigation.navigate("BottomTabNavigator");
    } catch (error) {
      console.log(error);
      seterror("Something went wrong!!!");
      setloading(false);
    }
  };
  const signUpFetchTest = async (value) => {
    setloading(true);

    try {
      const fetchSignUpTest = await fetch(
        // "http://localhost:3333/auth/signup/test",
        "https://backapi.herokuapp.com/auth/signup/test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );
      const data = await fetchSignUpTest.json();
      setloading(false);
      if (data.email == value.email) {
        setsignup(2);
        seterror(null);
      }
      if (data.error) {
        seterror(data.error);
      }
    } catch (error) {
      seterror("Something went wrong!!!");
      setloading(false);
    }
  };

  signuppage == 1
    ? (validation = Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email ardess")
          .max(40, "Must be shorter than 40")
          .required("required"),
        password: Yup.string().min(6, "Must be more than 6"),
        fullname: Yup.string(),
        username: Yup.string(),
        repeatPassword: Yup.string(),
      }))
    : signuppage == 2
    ? (validation = Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email ardess")
          .max(40, "Must be shorter than 40"),
        password: Yup.string().min(6, "Must be more than 6"),
        fullname: Yup.string().required("required"),
        username: Yup.string(),
        repeatPassword: Yup.string(),
      }))
    : signuppage == 3
    ? (validation = Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email ardess")
          .max(40, "Must be shorter than 40"),
        password: Yup.string().min(6, "Must be more than 6"),
        fullname: Yup.string(),
        username: Yup.string().required("required"),
        repeatPassword: Yup.string().required("required"),
      }))
    : (validation = Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email ardess")
          .max(40, "Must be shorter than 40"),
        password: Yup.string().min(6, "Must be more than 6"),
        fullname: Yup.string(),
        username: Yup.string().required("required"),
        repeatPassword: Yup.string().required("required"),
        code: Yup.string()
          .required("required")
          .min(6, "Must be 6 digit")
          .max(6, "Must be 6 digit"),
      }));

  return (
    <Formik
      initialValues={{
        fullname: "",
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        code: "",
      }}
      validationSchema={validation}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        {
          signuppage == 1
            ? signUpFetchTest(values)
            : signuppage == 3
            ? signUpFetch(values)
            : verifyFetch(values);
        }
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
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  paddingHorizontal: 20,
                  paddingBottom: 50,
                }}
              >
                <View style={styles.text}>
                  {error ? (
                    <Text style={styles.error}>{error}</Text>
                  ) : signuppage == 1 ? (
                    <Text style={styles.text_header}>
                      Enter your email adress
                    </Text>
                  ) : signuppage == 2 ? (
                    <Text style={styles.text_header}>Enter your Full name</Text>
                  ) : signuppage == 3 ? (
                    <Text style={styles.text_header}>
                      Enter your new username & password
                    </Text>
                  ) : (
                    <Text style={styles.text_header}>
                      Enter the code we sent to your E-mail
                    </Text>
                  )}
                </View>
              </Animatable.View>
              <Animatable.View
                style={{
                  flex: 3,
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
                animation="fadeInUpBig"
              >
                <KeyboardAwareScrollView
                  style={{
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.main}>
                      <View style={styles.header1}>
                        {signuppage == 1 ? (
                          <View>
                            <View style={styles.action}>
                              <TextInput
                                autoCapitalize="none"
                                autoCompleteType="email"
                                keyboardType="email-address"
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                placeholder="Valide email adress"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                value={values.email}
                              />
                            </View>
                            <Error touch={touched.email} error={errors.email} />
                          </View>
                        ) : signuppage == 2 ? (
                          <View>
                            <View style={styles.action}>
                              <TextInput
                                autoCapitalize="words"
                                autoCompleteType="name"
                                keyboardType="default"
                                onChangeText={handleChange("fullname")}
                                onBlur={handleBlur("fullname")}
                                placeholder="full name"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                value={values.fullname}
                              />
                            </View>
                          </View>
                        ) : signuppage == 3 ? (
                          <View>
                            <View style={styles.action}>
                              <TextInput
                                autoCapitalize="none"
                                autoCompleteType="username"
                                keyboardType="default"
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                placeholder="New username"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                value={values.username}
                              />
                            </View>
                            <Error
                              touch={touched.username}
                              error={errors.username}
                            />
                            <View style={styles.action}>
                              <TextInput
                                autoCapitalize="none"
                                autoCompleteType="password"
                                keyboardType={hiden ? null : "visible-password"}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                placeholder="New password"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                value={values.password}
                                secureTextEntry={hiden ? true : false}
                              />
                              <TouchableOpacity
                                onPress={() => sethiden(!hiden)}
                              >
                                {hiden ? (
                                  <FontAwesome name="lock" size={20} />
                                ) : (
                                  <FontAwesome name="unlock" size={20} />
                                )}
                              </TouchableOpacity>
                            </View>
                            <Error
                              touch={touched.password}
                              error={errors.password}
                            />
                            <View style={styles.action}>
                              <TextInput
                                autoCapitalize="none"
                                autoCompleteType="password"
                                keyboardType={hiden ? null : "visible-password"}
                                onChangeText={handleChange("repeatPassword")}
                                onBlur={handleBlur("repeatPassword")}
                                placeholder="Repeat password"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                value={values.repeatPassword}
                                secureTextEntry={hiden ? true : false}
                              />
                            </View>

                            <Error
                              touch={touched.repeatPassword}
                              error={errors.repeatPassword}
                            />
                          </View>
                        ) : (
                          <View>
                            <View style={styles.action}>
                              <TextInput
                                autoCapitalize="none"
                                autoCompleteType="tel"
                                keyboardType="numeric"
                                onChangeText={handleChange("code")}
                                onBlur={handleBlur("code")}
                                placeholder="6 digit code"
                                placeholderTextColor="#666666"
                                style={styles.textInput}
                                value={values.code}
                              />
                            </View>
                            <Error touch={touched.code} error={errors.code} />
                          </View>
                        )}
                        {signuppage == 1 ? (
                          <View>
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
                                    Next
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : signuppage == 2 ? (
                          <View>
                            <Error
                              touch={touched.fullname}
                              error={errors.fullname}
                            />
                            <TouchableOpacity
                              style={styles.signIn}
                              onPress={() => setsignup(3)}
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
                                    Next
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : signuppage == 3 ? (
                          <View>
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
                                    Next
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View>
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
                                    Register and Login
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <View style={styles.button}>
                        <View style={styles.forgot}></View>
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
                        Have an account?
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("SignIn")}
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
                          Sign In.
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              </Animatable.View>
            </View>
        );
      }}
    </Formik>
  );
};

export default SignUp;
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
  header: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header1: {
    paddingTop: 30,
    height: 300,
    justifyContent: "flex-start",
  },
  main: {
    height: height - 60,
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "black",
    paddingBottom: 5,
    marginBottom: 10,
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
  },
});
