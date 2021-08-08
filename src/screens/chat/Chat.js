import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
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
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Chatform from "./ChatForm";
import Pusher from 'pusher-js/react-native';
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
    loading: false,
    error: false,
    refreshing: false,
    clicked: false,
    messageData: null,
    user: null,
    textval: null,
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
      messageData: messageData,
    });
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
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
  
  componentDidMount() {
    this.fetchData();
    
  }
  componentDidUpdate(){
    this.Push()
  }
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
            <View style={styles.title}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    clicked: false,
                  });
                }}
              >
                <Text>back</Text>
              </TouchableOpacity>
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
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
            >
              {this.state.clicked
                ? this.state.messageData.message.slice(0).reverse().map((i, index) => {
                    return (
                      <Chatform
                        key={index}
                        data={i}
                        userData={this.state.messageData}
                        user={this.state.user}
                      />
                    );
                  })
                : this.state.data.slice(0).reverse().map((i, index) => {
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
                    style={{
                      paddingHorizontal: 10,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: "red",
                      width: "90%",
                      height: "100%",
                      fontSize: 15,
                    }}
                  />
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
    paddingHorizontal: 5,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "flex-start",
   },
});
