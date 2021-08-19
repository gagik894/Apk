import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  TextInput,
  BackHandler,
  Alert
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Chatform from "./ChatForm";
import Pusher from "pusher-js/react-native";
import { NetInfoCellularGeneration } from "@react-native-community/netinfo";
import { FontAwesome } from "@expo/vector-icons";
//page 1 single chat
function Chats(props) {
  let UserId;
  if (props.user == props.data.userId._id) {
    UserId = props.data.userId1;
  } else {
    UserId = props.data.userId;
  }
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          props.handler({
            messages: props.data.chat,
            userAvatar: UserId.avatar,
            otherUser: UserId,
          });
        }}
      >
        <View style={styles.chat}>
          <View style={styles.left}>
            <Image
              source={{
                uri: UserId.avatar,
              }}
              style={{
                width: "80%",
                height: "80%",
                borderRadius: 15,
                backgroundColor: "#eaeded",
              }}
            />
          </View>
          <View style={styles.center}>
            <View>
              <Text
                numberOfLines={1}
                style={{ fontSize: 17, fontFamily: "sans-serif" }}
              >
                {UserId.username}
              </Text>
            </View>
            <View>
              <Text
                numberOfLines={2}
                style={{ fontSize: 13, fontFamily: "sans-serif" }}
              >
                {props.data.chat[props.data.chat.length - 1].message}
              </Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text
              numberOfLines={2}
              style={{ fontSize: 11, fontFamily: "sans-serif" }}
            >
              {props.data.chat[props.data.chat.length - 1].time.substring(
                0,
                10
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default class Chat extends React.Component {
  state = {
    data: [],
    newData: null,
    loading: false,
    error: false,
    refreshing: false,
    clicked: false,
    messageData: null,
    user: null,
    textval: null,
    otherUser: null,
  };

  BackBtn = ()=>{
    const backAction = () => {
      if (this.state.clicked == true) {
        this.setState({clicked: false})
        return true;
      }   
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }
  Push = () => {
    const pusher = new Pusher("111c634f224bfb055def", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    // alert(this.state.user)
    let user = this.state.user;
    const addNewData = (props) => {
      let newDataArray = [];
      if (this.state.newData) {
        newDataArray = this.state.newData;
      }
      newDataArray.push(props);
      this.setState({
        newData: newDataArray,
      });
    };
    const refresh = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const fetchedData = await fetch(
          // "http://localhost:3333/messages",
          "https://backapi.herokuapp.com/messages",
          {
            method: "GET",
            headers: {
              "auth-token": token,
            },
          }
        );
        const data = await fetchedData.json();

        this.setState({
          data: data.messageData,
          user: data.user,
        });
      } catch (error) {
        console.log(error, "f");
        this.setState({ error: true });
      }
    };

    channel.bind("new", function (data) {
      if (user == data.user || user == data.user1) {
        // alert("true");
        refresh();
        addNewData(data);
      }

      // console.log(JSON.stringify(data));
      // alert(JSON.stringify(data));
    });
  };

  constructor(props) {
    super(props);

    this.handler = this.handler.bind(this);
  }

  handler(props) {
    const messageData = {
      message: props.messages,
      avatar: props.userAvatar,
    };
    this.setState({
      clicked: true,
      otherUser: props.otherUser,
      messageData: messageData,
    });
  }

  fetchMessage = async () => {
    if (this.state.textval) {
      try {
        const token = await AsyncStorage.getItem("token");
        const send = {
          message: this.state.textval,
          userId1: this.state.otherUser._id,
        };
        this.setState({
          textval: null,
        });
        const fetchedData = await fetch(
          // "http://localhost:3333/messages/add",
          "https://backapi.herokuapp.com/messages/add",
          {
            method: "POST",
            headers: {
              "auth-token": token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(send),
          }
        );
        const data = await fetchedData.json();
        console.log(data);
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  ref = async () => {
    try {
      console.log("tr");
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        // "http://localhost:3333/messages",
        "https://backapi.herokuapp.com/messages",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await fetchedData.json();

      this.setState({
        data: data.messageData,
        user: data.user,
        newData: null,
      });
    } catch (error) {
      console.log(error, "f");
      this.setState({ error: true });
    }
  };
  fetchData = async () => {
    try {
      this.setState({ loading: true, newData: null });
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        // "http://localhost:3333/messages",
        "https://backapi.herokuapp.com/messages",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await fetchedData.json();
      this.setState({
        data: data.messageData,
        user: data.user,
        loading: false,
      });
    } catch (error) {
      console.log(error, "f");
      this.setState({ error: true, loading: false });
    }
  };

  async componentDidMount() {
    await this.fetchData();
    this.Push();
    this.BackBtn();
  }
  componentDidUpdate() {}
  async _onRefresh() {
    this.setState({ refreshing: true });
    await this.fetchData();
    this.setState({ refreshing: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainheader}>
          {this.state.clicked ? (
            <View
              style={
                (styles.title, { flexDirection: "row", alignItems: "center" })
              }
            >
              <TouchableOpacity
                onPress={() => {
                  this.ref();
                  this.setState({
                    clicked: false,
                  });
                }}
              >
                <FontAwesome name="arrow-left" size={30} />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={[
                    {
                      fontSize: 20,
                      justifySelf: "center",
                    },
                  ]}
                >
                  {this.state.otherUser.username}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.title}>
              <Text
                style={[
                  {
                    fontSize: 20,
                    alignSelf: "center",
                  },
                ]}
              >
                Together
              </Text>
            </View>
          )}
        </View>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : this.state.error ? (
          <View>
            <Text>Something went wrong</Text>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            {this.state.clicked ? (
              <ScrollView
                style={{ transform: [{ rotate: "180deg" }] }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                }
              >
                {this.state.newData != [] && this.state.newData
                  ? this.state.newData
                      .slice(0)
                      .reverse()
                      .map((j, index) => {
                        if (
                          (j.user == this.state.user &&
                            j.user1 == this.state.otherUser._id) ||
                          (j.user1 == this.state.user &&
                            j.user == this.state.otherUser._id)
                        ) {
                          return (
                            <Chatform
                              key={index}
                              data={j}
                              userData={this.state.messageData}
                              user={this.state.user}
                            />
                          );
                        }
                      })
                  : null}
                {this.state.messageData.message
                  .slice(0)
                  .reverse()
                  .map((i, index) => {
                    return (
                      <Chatform
                        key={index}
                        data={i}
                        userData={this.state.messageData}
                        user={this.state.user}
                      />
                    );
                  })}
              </ScrollView>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                }
              >
                {this.state.data
                  .slice(0)
                  .reverse()
                  .map((i, index) => {
                    return (
                      <Chats
                        key={index}
                        data={i}
                        user={this.state.user}
                        handler={this.handler}
                      />
                    );
                  })}
              </ScrollView>
            )}
            <View
              style={{ flexDirection: "column", justifyContent: "flex-end" }}
            >
              {this.state.clicked ? (
                <View style={styles.text}>
                  <TextInput
                    placeholder="Message..."
                    onChangeText={(val) => {
                      this.setState({
                        textval: val,
                      });
                    }}
                    value={this.state.textval}
                    style={{
                      paddingHorizontal: 10,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: "red",
                      width: "87%",
                      height: "100%",
                      fontSize: 15,
                    }}
                  />
                  <TouchableOpacity onPress={() => this.fetchMessage()}>
                    <FontAwesome name="paper-plane" color="black" size={27} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
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
  headerItems: {
    flex: 1,
  },
  title: {
    flex: 3,
  },
  container1: {
    height: "90%",
    justifyContent: "space-around",
  },
  mainheader: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderBottomColor: "black",
    alignItems: "center",
    height: 50,
    backgroundColor: "#ffff",
  },
  header: {
    height: 52,
    flexDirection: "row",
  },
  chat: {
    marginTop: 8,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "grey",
  },
  left: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    paddingVertical: 10,
  },
  right: {
    width: 80,
    paddingVertical: 10,
  },
  text: {
    height: 40,
    flexDirection: "row",
    paddingHorizontal: 2,
    justifyContent: "space-around",
    marginVertical: 10,
    alignItems: "center",
  },
});
