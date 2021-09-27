import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Button,
  ImageBackground,
  TouchableOpacity,
  Image,
  RefreshControl,
  DrawerLayoutAndroid,
  Alert,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Navigation from "../../Navigation/Navigation";
import Card from "../cards/Card";
import Pusher from "pusher-js/react-native";
export default class Users extends React.Component {
  state = {
    data: [],
    profileData: {},
    loading: false,
    error: false,
    page: 1,
    followed: false,
  };
  id = this.props.route.params.data;
  Push = () => {
    const pusher = new Pusher("111c634f224bfb055def", {
      cluster: "ap2",
    });

    const refreshData = async () => {
      await this.refreshData();
    };
    const channel = pusher.subscribe("posts");
    channel.bind("update", function (data) {
      refreshData();
    });
    const channel1 = pusher.subscribe("users");
    channel1.bind("update", function (data) {
      refreshData();
    });
  };
  constructor(props) {
    super(props);
  }
  refreshData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        `https://backapi.herokuapp.com/posts/profile/${this.id}`,
        // "http://localhost:3333/posts/profile/612ba05f88153422289ac44c",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const fetchedProfileData = await fetch(
        `https://backapi.herokuapp.com/auth/profile/${this.id}`,
        //  `http://localhost:3333/auth/profile/612ba05f88153422289ac44c`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedProfileData.json();
      const apidata = await fetchedData.json();
      apidata.data.map((i, index) => {
        i.user = apidata.User;
      });
      this.setState({
        data: apidata.data,
        visible: false,
        profileData: profiledata.data,
        followed: profiledata.followed,
        followings: profiledata.data.followings.length,
        followers: profiledata.data.followers.length,
      });
    } catch (error) {
      this.setState({ error: true });
      console.log("error", error);
    }
  };
  fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      this.setState({ loading: true });
      const fetchedData = await fetch(
        `https://backapi.herokuapp.com/posts/profile/${this.id}`,
        // "http://localhost:3333/posts/profile/612ba05f88153422289ac44c",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const apidata = await fetchedData.json();
      apidata.data.map((i, index) => {
        i.user = apidata.User;
      });
      this.setState({ data: apidata.data, loading: false, visible: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
      console.log("error", error);
    }
  };
  fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedProfileData = await fetch(
        `https://backapi.herokuapp.com/auth/profile/${this.id}`,
        // "http://localhost:3333/auth/profile/612ba05f88153422289ac44c",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedProfileData.json();
      this.setState({
        profileData: profiledata.data,
        followed: profiledata.followed,
        followings: profiledata.data.followings.length,
        followers: profiledata.data.followers.length,
      });
    } catch (error) {
      this.setState({ error: true, loading: false, visible: false });
      console.log("error", error);
    }
  };
  fetchFollow = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedFollowData = await fetch(
        `https://backapi.herokuapp.com/auth/follow/${this.id}`,
        // "http://localhost:3333/auth/follow/612ba05f88153422289ac44c/",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedFollowData.json();
    } catch (error) {
      this.setState({ error: true, loading: false, visible: false });
      console.log("error", error);
    }
  };
  fetchunFollow = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedFollowData = await fetch(
        `https://backapi.herokuapp.com/auth/unfollow/${this.id}`,
        // "http://localhost:3333/auth/unfollow/612ba05f88153422289ac44c/",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedFollowData.json();
    } catch (error) {
      this.setState({ error: true, loading: false, visible: false });
      console.log("error", error);
    }
  };
  componentDidMount() {
    this.fetchProfile();
    this.fetchData();
    this.Push();
  }
  async _onRefresh() {
    this.setState({ refreshing: true });
    await this.refreshData();
    await this.fetchProfile();
    this.setState({ refreshing: false });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.text}>
            <Text style={{ fontSize: 20 }}>
              {this.state.profileData.username}
            </Text>
          </View>
        </View>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <View>
              <View style={styles.card}>
                <View style={styles.coverimg}>
                  <ImageBackground
                    source={{
                      uri: `https://drive.google.com/uc?export=wiew&id=${this.state.profileData.coverImgUrl}`,
                    }}
                    style={{
                      borderRadius: 15,
                      alignSelf: "center",
                      height: height,
                      width: "100%",
                      paddingTop: height / 2,
                    }}
                  >
                    <View style={{ height: 148, width: 148, marginLeft: 5 }}>
                      <Image
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 148 / 2,
                          backgroundColor: "#eaeded",
                        }}
                        source={{
                          uri: `https://drive.google.com/uc?export=wiew&id=${this.state.profileData.avatar}`,
                        }}
                      ></Image>
                    </View>
                  </ImageBackground>
                </View>
                <View style={styles.text1}>
                  <Text
                    style={{
                      fontSize: 25,
                    }}
                  >
                    {this.state.profileData.fullname}
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 35,
                    alignSelf: "center",
                    paddingHorizontal: (width / 2 - 120) / 2,
                  }}
                >
                  {this.state.followed ? (
                    <TouchableOpacity
                      onPress={() => this.fetchunFollow()}
                      style={{
                        width: 120,
                        height: 35,
                        backgroundColor: "#eaeded",
                        borderRadius: 10,
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "black", fontSize: 15 }}>
                        Unfollow
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.fetchFollow()}
                      style={{
                        width: 120,
                        height: 35,
                        backgroundColor: "blue",
                        borderRadius: 10,
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 15 }}>
                        Follow
                      </Text>
                    </TouchableOpacity>
                  )}
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
                      {this.state.followers}
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
                      {this.state.followings}
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
                    {this.state.data
                      .slice(0)
                      .reverse()
                      .map((i, index) => {
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
const width = Dimensions.get("window").width * 0.96;
const height = 0.5 * width;
const cardHeight = height + 120;
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
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
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
    height: cardHeight,
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  coverimg: {
    alignItems: "center",
    backgroundColor: "#eaeded",
    height: height,
    width: "96%",
    borderRadius: 15,
  },
  text1: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  follows: {
    height: 36,
    width: 120,
    justifyContent: "center",
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
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavigationViewButton: {
    width: "100%",
    justifyContent: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    height: 70,
  },
});
