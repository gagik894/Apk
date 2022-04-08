import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";

export default class Testik extends React.Component {
  bannerError() {
    console.log("An error");
    return;
  }
  inter = async () => {
    await AdMobInterstitial.setAdUnitID(
      "ca-app-pub-3477096567321367/7521042077"
    ); // Test ID, Replace with your-admob-unit-id
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  };
  revarded = async () => {
    await AdMobRewarded.setAdUnitID("ca-app-pub-3477096567321367/9383243496"); // Test ID, Replace with your-admob-unit-id
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
  };
  async componentDidMount() {
    await setTestDeviceIDAsync("EMULATOR");
    await this.inter();
    await this.revarded();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <PublisherBanner
        //   style={{ width: "100%" }}
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-3477096567321367/6748507148" // Test ID, Replace with your-admob-unit-id
          onDidFailToReceiveAdWithError={this.bannerError}
            onAdMobDispatchAppEvent={this.adMobEvent}
        />
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-3477096567321367/6748507148" // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds // true or false
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomBanner: {
    position: "absolute",
    bottom: 0,
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
