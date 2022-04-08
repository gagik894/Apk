import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Button, Text } from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";
import { TouchableOpacity } from "react-native-gesture-handler";
const width =
  Math.round(Dimensions.get("window").width) < "600"
    ? Math.round(Dimensions.get("window").width)
    : Math.round(Dimensions.get("window").width) / 2 - 20;
const height = Math.round(Dimensions.get("window").height);

export default function Card() {
  const inter = async () => {
    // await setTestDeviceIDAsync("EMULATOR");
    await AdMobInterstitial.setAdUnitID(
      "ca-app-pub-3477096567321367/7886806290"
    ); // Test ID, Replace with your-admob-unit-id
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  };
  const revarded = async () => {
    // await setTestDeviceIDAsync("EMULATOR");
    await AdMobRewarded.setAdUnitID("ca-app-pub-3477096567321367/2634479619"); // Test ID, Replace with your-admob-unit-id
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
  };
  return (
    <View style={styles.card}>
      <PublisherBanner
        style={{ height: 75 }}
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3477096567321367/2470828085" // Test ID, Replace with your-admob-unit-id
        //   onDidFailToReceiveAdWithError={this.bannerError}
        //     onAdMobDispatchAppEvent={this.adMobEvent}
      />
      <AdMobBanner
        style={{ height: 75 }}
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3477096567321367/2470828085" // Test ID, Replace with your-admob-unit-id
        servePersonalizedAds // true or false
        //   onDidFailToReceiveAdWithError={this.bannerError}
      />
      <TouchableOpacity onPress={()=>inter()} style={{width:"100%", height: 40, backgroundColor:"aqua", marginBottom: 5,}}>
        <Text>Ad 1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>revarded()} style={{width:"100%", height: 40, backgroundColor:"aqua"}}>
        <Text>Ad 2</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width,
    height: 250,
    backgroundColor: "#fff",
    marginTop: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "grey",
  },
});
