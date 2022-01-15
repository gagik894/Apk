import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MiniCard from "../cards/MiniCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Pusher from "pusher-js/react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
const renderItem = ({ item }) => {
  return <MiniCard data={item} />;
};

// function Header() {
//   const [search, searchval] = useState("");
//   return (

//   );
// }

function Users(props) {
  let UserId = props.data;
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          props.data.handler({
            id: UserId._id,
          });
        }}
        // onPress={() => {
        // props.handler({
        //   messages: props.data.chat,
        //   userAvatar: `https://drive.google.com/uc?export=wiew&id=${UserId.avatar}`,
        //   otherUser: UserId,
        // });
        // }}
      >
        <View style={styles.chat}>
          <View style={styles.left}>
            <Image
              source={{
                uri: `https://drive.google.com/uc?export=wiew&id=${UserId.avatar}`,
              }}
              style={{
                width: "80%",
                height: "80%",
                borderRadius: 15,
                backgroundColor: "#eaeded",
              }}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ height: "100%", justifyContent: "space-around" }}>
              <View style={{ height: "50%", justifyContent: "flex-end" }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    fontFamily: "sans-serif",
                    color: "#fff",
                  }}
                >
                  {UserId.username}
                </Text>
              </View>
              <View style={{ height: "50%", justifyContent: "flex-start" }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: "sans-serif",
                    color: "#D3D3D3",
                  }}
                >
                  {UserId.fullname}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default class Search extends React.Component {
  state = {
    data: [],
    loading: false,
    error: false,
    refreshing: false,
    focused: false,
    searchdata: [],
  };

  blurTextInput() {
    this.refs.myInput.blur();
  }

  BackBtn = () => {
    const backAction = () => {
      if (this.state.focused == true) {
        this.blurTextInput();
        // this.setState({ focused: false });
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
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
  };

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.Push = this.Push.bind(this);
  }
  handler(props) {
    this.props.navigation.navigate("Users", { data: props.id });
  }
  refreshData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        // "http://localhost:3333/posts",
        "https://backapi.herokuapp.com/posts",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const apidata = await fetchedData.json();
      apidata.data.map((i, index) => {
        i.handler = this.handler;
        i.user = apidata.User;
      });
      this.setState({ data: apidata.data });
    } catch (error) {
      this.setState({ error: true });
    }
  };
  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        // "http://localhost:3333/posts",
        "https://backapi.herokuapp.com/posts",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const apidata = await fetchedData.json();
      apidata.data.map((i, index) => {
        i.handler = this.handler;
        i.user = apidata.User;
      });
      this.setState({ data: apidata.data, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };
  fetchSearch = async (value) => {
    try {
      this.setState({ loading: true });
      const token = await AsyncStorage.getItem("token");
      const fetchedData = await fetch(
        // "http://localhost:3333/auth/search",
        "https://backapi.herokuapp.com/auth/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({ search: value }),
        }
      );
      const apidata = await fetchedData.json();
      apidata.data.map((i, index) => {
        i.handler = this.handler;
      });
      this.setState({ searchdata: apidata.data, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
      alert(error);
    }
  };
  componentDidMount() {
    this.fetchData();
    this.Push();
    this.BackBtn();
  }
  async _onRefresh() {
    this.setState({ refreshing: true });
    await this.refreshData();
    this.setState({ refreshing: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <View style={styles.text}>
              <FontAwesome name="search" color="#fff" size={25} />
              <TextInput
                ref="myInput"
                placeholderTextColor="#fff"
                placeholder="Search"
                // value={this.state.searchval}
                onChangeText={(val) => {
                  this.fetchSearch(val);
                }}
                onFocus={() => this.setState({ focused: true })}
                onBlur={() => this.setState({ focused: false })}
                style={{
                  color: "#fff",
                  marginHorizontal: 10,
                  alignSelf: "flex-end",
                  borderColor: "black",
                  width: "85%",
                  height: "100%",
                  fontSize: 15,
                }}
              />
            </View>
          </View>
        </View>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <View>
            {this.state.focused ? (
              <View
                style={{
                  backgroundColor: "#000",
                  width: "100%",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <ScrollView
                  keyboardDismmiseMode="on-drag"
                  keyboardShouldPersistTaps="always"
                >
                  {this.state.searchdata.length != 0
                    ? this.state.searchdata.map((i, index) => {
                        return <Users key={index} data={i} />;
                      })
                    : null}
                </ScrollView>
              </View>
            ) : (
              <View>
                {this.state.error ? (
                  <View>
                    <Text>Something went wrong</Text>
                  </View>
                ) : (
                  <FlatList
                    style={{ marginBottom: 52 }}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                      />
                    }
                    data={this.state.data.slice(0).reverse()}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item._id}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

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
    borderBottomColor: "grey",
    justifyContent: "center",
    height: 50,
    marginBottom: 2,
    backgroundColor: "#202020",
  },
  text: {
    height: 30,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  chat: {
    marginTop: 8,
    height: 65,
    marginHorizontal: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#202020",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#202020",
  },
  left: {
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },
});
