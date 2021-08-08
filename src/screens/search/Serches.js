import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MiniCard from "../cards/MiniCard";

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

export default class Searches extends React.Component {
  state = {
    data: [],
    loading: false,
    error: false,
    page: 1,
  };

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const fetchedData = await fetch("https://backapi.herokuapp.com/posts");
      const apidata = await fetchedData.json();
      this.setState({ data: apidata, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };
  componentDidMount() {
    this.fetchData();
  }
  render() {
    return (
      <View style={styles.container}>
        <Header />
        {this.state.loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <ScrollView>
            {this.state.error ? (
              <View>
                <Text>11111 error</Text>
              </View>
            ) : (
              <View style={styles.container1}>
                {this.state.data.map((i, index) => {
                  return <MiniCard key={index} data={i} />;
                })}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff",
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
