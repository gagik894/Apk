import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
  PublisherBanner,
} from 'expo-ads-admob'
import React, { Component } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { Button, Text } from 'react-native'
console.disableYellowBox = true
const testID = 'cdcb341d-2e9d-4764-9988-3b51ae960f24';
AdMobInterstitial.setAdUnitID("ca-app-pub-3477096567321367/7521042077")
AdMobInterstitial.setTestDeviceID('EMULATOR')
AdMobRewarded.setAdUnitID("ca-app-pub-3477096567321367/9383243496")
AdMobRewarded.setTestDeviceID('EMULATOR')

const productionID = 'my-id';
// Is a real device and running in production.

class Test extends Component {
  state = {
    disableInterstitialBtn: false,
    disableRewardedBtn: false,
  }

  _openInterstitial = async () => {
    try {
      this.setState({ disableInterstitialBtn: true })
      await AdMobInterstitial.requestAdAsync()
      await AdMobInterstitial.showAdAsync()
    } catch (error) {
      console.error(error)
    } finally {
      this.setState({ disableInterstitialBtn: false })
    }
  }

  _openRewarded = async () => {
    try {
      this.setState({ disableRewardedBtn: true })
      await AdMobRewarded.requestAdAsync()
      await AdMobRewarded.showAdAsync()
    } catch (error) {
      console.error(error)
    } finally {
      this.setState({ disableRewardedBtn: false })
    }
  }

  render() {
    const { disableInterstitialBtn, disableRewardedBtn } = this.state
    return (
      <ScrollView>
        <SafeAreaView style={{ margin: 20 }}>
          <Text h2>GOOGLE ADMOB DEMO</Text>
          <Text>
            Set Ad Unit Id, Interstitial Id & Rewarded Id only on the top level
            component once.
          </Text>
          <Text h4>Banner Ad</Text>
          <AdMobBanner bannerSize="mediumRectangle" adUnitID={"ca-app-pub-3477096567321367/6748507148"} />
          <Text h4>Publisher Banner</Text>
          <PublisherBanner bannerSize="banner" adUnitID={"ca-app-pub-3477096567321367/6748507148"} />
          <Text h4>Interstitial Ad</Text>
          <Button
            title="Open"
            type="outline"
            disabled={disableInterstitialBtn}
            onPress={this._openInterstitial}
          />
          <Text h4>Rewarded Ad</Text>
          <Button
            title="Open"
            type="outline"
            disabled={disableRewardedBtn}
            onPress={this._openRewarded}
          />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

export default Test