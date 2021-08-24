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
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Card from "./Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
const renderItem = ({ item }) => {
  return <Card data={item} />;
};
export default class Cards extends React.Component {
  state = {
    data: [],
    loading: false,
    error: false,
    page: 1,
    refreshing: false,
    user: null,
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
      apidata.data.map((i,index) =>{
        i.user = apidata.User
      })
      this.setState({ data: apidata.data, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
      console.log(error);
    }
  };

  componentDidMount() {
    this.fetchData();
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
          <View style={styles.headerItems}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Add")}
            >
              <Image
                source={require("../../../assets/img/camera.png")}
                style={{ width: 40, height: 40, marginHorizontal: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.title}>
            <Text
              style={[
                {
                  fontSize: 20,
                  alignSelf: "center",
                },
              ]}
            >
              Together beta
            </Text>
          </View>
          <View style={styles.headerItems}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Chat")}
            >
              <Image
                source={require("../../../assets/img/send.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginHorizontal: 5,
                  alignSelf: "flex-end",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : this.state.error ? (
          <View>
            <Text>Something went wrong</Text>
          </View>
        ) : (
          <FlatList
            style={{ flexDirection: "column" }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            data={this.state.data.slice(0).reverse()}
            userData={this.state.user}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id}
          />
        )}
      </View>
    );
  }
}

const width =
  Math.round(Dimensions.get("window").width) < "600"
    ? Math.round(Dimensions.get("window").width)
    : Math.round(Dimensions.get("window").width) / 2 - 16;

const height = Math.round(Dimensions.get("window").height);

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
  headerItems: {
    flex: 1,
  },
  title: {
    flex: 3,
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
});
