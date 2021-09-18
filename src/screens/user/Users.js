import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Button,
  AsyncStorage,
  ImageBackground,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Card from "../cards/Card";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Users extends React.Component {
  state = {
    data: [],
    profileData: {},
    loading: false,
    error: false,
    page: 1,
  };

  fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      this.setState({ loading: true });
      const fetchedData = await fetch(
        "https://backapi.herokuapp.com/posts/profile",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const apidata = await fetchedData.json();
      apidata.data.map((i,index) =>{
        i.user = apidata.User
      })
      this.setState({ data: apidata.data, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
      console.log("error", error);
    }
  };
  fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      this.setState({ loading: true });
      const fetchedProfileData = await fetch(
        "https://backapi.herokuapp.com/auth/profile",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedProfileData.json();
      this.setState({ profileData: profiledata, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
      console.log("error", error);
    }
  };
  componentDidMount() {
    this.fetchData();
    this.fetchProfile();
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <ScrollView>
            <View>
              <View style={styles.header}>
                <View style={styles.text}>
                  <Text style={{ fontSize: 20 }}>
                    {this.state.profileData.username}
                  </Text>
                </View>
              </View>
              <View style={styles.card}>
                <View style={styles.coverimg}>
                  <ImageBackground
                    source={{
                      uri:
                        this.state.profileData.coverImgUrl ||
                        "https://www.kenangan.com/assets/img/default-cover-user.png",
                    }}
                    style={{
                      alignSelf: "center",
                      height: 193,
                      width: "100%",
                      paddingTop: 193 / 2,
                    }}
                  >
                    <View style={{ height: 148, width: 148, marginLeft: 5 }}>
                      <Image
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 148 / 2,
                        }}
                        source={{
                          uri: `https://drive.google.com/uc?export=wiew&id=${this.state.profileData.avatar}`,
                        }}
                      ></Image>
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.name}>
                  <Text
                    style={{
                      fontSize: 25,
                    }}
                  >
                    {this.state.profileData.fullname}
                  </Text>
                  <View style={styles.button}>
                    <TouchableOpacity style={styles.button}>
                      <View>
                        {this.state.loading ? (
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
                            Follow
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.card2}>
                <View style={styles.follows}>
                  <TouchableOpacity>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "blue",
                      }}
                    >
                      1856
                    </Text>
                    <Text style={{ textAlign: "center" }}>Followers</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.follows}>
                  <TouchableOpacity>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "blue",
                      }}
                    >
                      1856
                    </Text>
                    <Text style={{ textAlign: "center" }}>Followings</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.error ? (
                <View>
                  <Text>Something went wrong!!</Text>
                </View>
              ) : (
                <View>
                  <View style={styles.container1}>
                    {this.state.data.map((i, index) => {
                      return <Card key={index} data={i} />;
                    })}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EAEDED",
    flex: 1,
    width: "100%",
  },
  container1: {
    height: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  header: {
    borderBottomWidth: 0.4,
    borderBottomColor: "grey",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#ffff",
    marginBottom: 2,
  },
  text: {
    height: 30,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  card: {
    height: 322,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 8,
  },
  card2: {
    paddingHorizontal: 15,
    height: 60,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverimg: {
    alignItems: "center",
    height: 193,
    width: "96%",
  },
  name: {
    height: 50,
    width: "100%",
    marginTop: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  follows: {
    height: 36,
    width: 120,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#0095f6",
    width: "40%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});
