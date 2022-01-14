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
import Pusher from "pusher-js/react-native";
const renderItem = ({ item }) => {
  return <MiniCard data={item} />;
};

// function Header() {
//   const [search, searchval] = useState("");
//   return (
    
//   );
// }

export default class Search extends React.Component {
  state = {
    data: [],
    loading: false,
    error: false,
    page: 1,
    refreshing: false,
    searchval: null,
  };
  Push = () => {
    const pusher = new Pusher("111c634f224bfb055def", {
      cluster: "ap2",
    });

    const refreshData = async()=>{
      await this.refreshData();
    }
    const channel = pusher.subscribe("posts");
    channel.bind("update", function (data) {
      refreshData()
    });
  };

  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.Push = this.Push.bind(this);
  }
  handler(props) {
    this.props.navigation.navigate("Users", {data: props.id})
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
      apidata.data.map((i,index) =>{
        i.handler=this.handler;
        i.user = apidata.User
      })
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
      apidata.data.map((i,index) =>{
        i.handler=this.handler
        i.user = apidata.User
      })
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
          body: JSON.stringify({"search": value}),
        }
      );
      const apidata = await fetchedData.json();
      console.log(apidata)
    } catch (error) {
      this.setState({ error: true, loading: false });
      alert(error)
    }
  };
  componentDidMount() {
    this.fetchData();
    this.Push()
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
          <FontAwesome name="search" color="#05375a" size={25} />
          <TextInput
            placeholder="Search"
            // value={this.state.searchval}
            onChangeText={(val) => {
              this.fetchSearch(val);
            }}
            // onFocus={()=>{alert("soon")}}
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
        {this.state.loading ? (
          <ActivityIndicator size="large" color="black" />
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
