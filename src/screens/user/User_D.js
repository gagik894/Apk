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
import Card from "../cards/Card_D";
import { BottomSheet } from "react-native-btr";
import Pusher from "pusher-js/react-native";
export default class Users extends React.Component {
  state = {
    data: [],
    profileData: {},
    loading: false,
    error: false,
    page: 1,
    visible: false,
    followings: 0,
    followers: 0,
  };
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
  toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    this.setState({ visible: !this.state.visible });
  };
  refreshData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        "https://backapi.herokuapp.com/posts/profile/my",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const fetchedProfileData = await fetch(
        "https://backapi.herokuapp.com/auth/profile/my",
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
        profileData: profiledata,
        followings: profiledata.followings.length,
        followers: profiledata.followers.length,
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
        "https://backapi.herokuapp.com/posts/profile/my",
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
        "https://backapi.herokuapp.com/auth/profile/my",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedProfileData.json();
      this.setState({
        profileData: profiledata,
        followings: profiledata.followings.length,
        followers: profiledata.followers.length,
      });
    } catch (error) {
      this.setState({ error: true, loading: false, visible: false });
      console.log("error", error);
    }
  };

  fetchDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      this.setState({ loading: true });
      const fetchedProfileData = await fetch(
        // "http://localhost:3333/auth/remove",
        "https://backapi.herokuapp.com/auth/remove",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const profiledata = await fetchedProfileData.json();
      this.setState({ loading: false, visible: false });
      this.removeToken();
      this.props.navigation.navigate("SignIn", { data: "name" });
    } catch (error) {
      this.setState({ error: true, loading: false });
      console.log("error", error);
    }
  };

  removeToken = async () => {
    await AsyncStorage.removeItem("token");
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
            <TouchableOpacity
              onPress={() => {
                this.removeToken();
                this.props.navigation.navigate("SignIn", { data: "name" });
              }}
            >
              <Text style={{ fontSize: 20,color: "#ffff" }}>
                {this.state.profileData.username}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.text}>
            <TouchableOpacity onPress={() => this.toggleBottomNavigationView()}>
              <Text style={{ fontSize: 15,color: "#ffff" }}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="white" />
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
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Add", { data: "cover" })
                  }
                  style={styles.coverimg}
                >
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
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Add", {
                          data: "avatar",
                        })
                      }
                      style={{ height: 148, width: 148, marginLeft: 5 }}
                    >
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
                    </TouchableOpacity>
                  </ImageBackground>
                </TouchableOpacity>
                <View style={styles.text1}>
                  <Text
                    style={{
                      fontSize: 25,color: "#ffff"
                    }}
                  >
                    {this.state.profileData.fullname}
                  </Text>
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
                        color: "#ffff"
                      }}
                    >
                      {this.state.followers}
                    </Text>
                    <Text style={{ textAlign: "center",color: "#ffff" }}>Followers</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.follows}>
                  <TouchableOpacity>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#ffff"
                      }}
                    >
                      {this.state.followings}
                    </Text>
                    <Text style={{ textAlign: "center",color: "#ffff" }}>Followings</Text>
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
        <BottomSheet
          visible={this.state.visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={this.toggleBottomNavigationView}
          //Toggling the visibility state on the click of the back botton
          onBackdropPress={this.toggleBottomNavigationView}
          //Toggling the visibility state on the clicking out side of the sheet
        >
          {/*Bottom Sheet inner View*/}
          <View style={styles.bottomNavigationView}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={styles.bottomNavigationViewButton}
                onPress={() => this.fetchDelete()}
              >
                <Text style={{ fontSize: 18, color: "red" }}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </View>
    );
  }
}
const width = Dimensions.get("window").width * 0.96;
const height = 0.5 * width;
const cardHeight = height + 100;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
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
    borderBottomColor: "#2a2a2a",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#202020",
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
    backgroundColor: "#202020",
    borderRadius: 15,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  coverimg: {
    alignItems: "center",
    backgroundColor: "#202020",
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
    backgroundColor: "#202020",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomNavigationView: {
    backgroundColor: "#202020",
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
