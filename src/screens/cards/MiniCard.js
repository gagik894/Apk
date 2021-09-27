import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function MiniCard(props) {
  console.log(props, "pr");
  return (
    <View style={styles.card}>
      <TouchableOpacity
        disabled={props.data.user == props.data.userId._id}
        onPress={() => {
          props.data.handler({
            id: props.data.userId._id,
          });
        }}
      >
        <ImageBackground
          source={{
            uri: `https://drive.google.com/uc?export=wiew&id=${props.data.imgId}`,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
    </View>
  );
}

const width =
  Math.round(Dimensions.get("window").width) < "600"
    ? Math.round(Dimensions.get("window").width) / 3 - 1
    : Math.round(Dimensions.get("window").width) / 6 - 1;

const styles = StyleSheet.create({
  card: {
    marginBottom: 2,
    width: width,
    height: width,
  },
});
