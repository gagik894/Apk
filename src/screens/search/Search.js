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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MiniCard from "../cards/MiniCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
const renderItem = ({ item }) => {
  return <MiniCard data={item} />;
};

function Header() {
  const [search, searchval] = useState("");
  return (
    <View style={styles.container0}>
      <View style={styles.header}>
        <View style={styles.text}>
          <FontAwesome name="search" color="#05375a" size={25} />
          <TextInput
            placeholder="Shearch"
            onChangeText={(val) => {
              searchval(val);
            }}
            style={{
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
  );
}

export default class Search extends React.Component {
  state = {
    data: [],
    loading: false,
    error: false,
    page: 1,
    refreshing: false,
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
      console.log(apidata.data);
      this.setState({ data: apidata.data, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
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
        <Header />
        {this.state.loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <View>
            {this.state.error ? (
              <View>
                <Text>11111 error</Text>
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
    marginBottom: 2,
    backgroundColor: "#ffff",
  },
  text: {
    height: 30,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
});
