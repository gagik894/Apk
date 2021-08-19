import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

export default function Chatform(props) {
  return (
    <View
      style={
        props.data.user == props.user
          ? {
              flexDirection: "row-reverse",
              marginLeft: "2%",
              transform: [{ rotate: "180deg" }],
            }
          : { flexDirection: "row", transform: [{ rotate: "180deg" }] }
      }
    >
      {props.data.user == props.user ? null : (
        <View style={styles.left}>
          <Image
            source={{
              uri: props.userData.avatar,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 9,
              borderWidth: 0.4,
              borderColor: "grey",
              backgroundColor: "#eaeded",
            }}
          />
        </View>
      )}
      <View
        style={
          props.data.user == props.user
            ? {
                marginRight: 6,
                marginTop: 4,
                maxWidth: "65%",
                minHeight: 50,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderTopRightRadius: 3,
                borderWidth: 1,
                borderColor: "grey",
                paddingVertical: 2,
                paddingHorizontal: 7,
                marginBottom: 0,
                
              }
            : {
                marginTop: 4,
                maxWidth: "65%",
                minHeight: 50,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderTopLeftRadius: 3,
                borderWidth: 1,
                borderColor: "grey",
                paddingVertical: 2,
                paddingHorizontal: 7,
                marginBottom: 0,
              }
        }
      >
        <View style={styles.center}>
          <View>
            <Text style={{ fontSize: 16, fontFamily: "sans-serif" }}>
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.ghdf sdfgh sdfgh sdfgh sdfhqweg sdvsd wsc */}
              {props.data.message}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={{ fontSize: 11, fontFamily: "sans-serif" }}>
            {props.data.time.substring(11, 16)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {

    alignSelf: "center",
  },
  right: {
    maxHeight: 25,
    alignSelf: "flex-end",
    marginHorizontal: 2
  },
});
