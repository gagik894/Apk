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
import { Video } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
const width =
  Math.round(Dimensions.get("window").width) < "600"
    ? Math.round(Dimensions.get("window").width) / 3 - 1
    : Math.round(Dimensions.get("window").width) / 6 - 1;

export default function MiniCard(props) {
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
        {props.data.type == "image" ? (
          <View style={styles.main}>
            <Image
              source={{
                uri: `https://drive.google.com/uc?export=wiew&id=${props.data.imgId}`,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        ) : (
          <View>
            <Video
              // ref={video}
              source={{
                uri: `https://drive.google.com/uc?export=view&id=${props.data.imgId}`,
              }}
              style={{ width: "100%", height: "100%", alignSelf: "center" }}
              // useNativeControls
              resizeMode="stretch"
              // isLooping
              shouldPlay={false}
              // onPlaybackStatusUpdate={true}
            />
            <View style={{position: "absolute",height: width, width:width, alignItems: "flex-end", justifyContent:"flex-end", padding: "10%"}}>
            <FontAwesome name="play"  size={25} color="#FFFFFF" />
            </View>
            
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 2,
    width: width,
    height: width,
  },
  card1: {
    marginBottom: 2,
    width: width,
    height: 2 * width,
  },
});
