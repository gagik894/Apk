import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
const FormData = require("form-data");

export default function ImagePickerExample(props) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const go = props.navigation.goBack;
  let picType = props.route.params.data;
  console.log(props.route.params.data);

  const fetchAdd = async (props) => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append("image", {
        uri: props,
        name: "image.jpg",
        type: "image/jpeg",
      });
      const token = await AsyncStorage.getItem("token");
      const fetchedProfileData = await fetch(
        // `http://localhost:3333/posts/add/${picType}`,
        `https://backapi.herokuapp.com/posts/add/${picType}`,
        {
          method: "Post",
          headers: {
            "auth-token": token,
            "Content-Type": "multipart/form-data",
          },
          body: formdata,
        }
      );
      const profiledata = await fetchedProfileData.json();
      setLoading(false);
      go();
    } catch (error) {
      setLoading(false);
      console.log("erroor", error);
    }
  };
  const fetchAddVideo = async (props) => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append("video", {
        uri: props,
        name: "video.mp4",
        type: "video/mp4",
      });
      const token = await AsyncStorage.getItem("token");
      const fetchedProfileData = await fetch(
        `http://localhost:3333/posts/new/video`,
        // `https://backapi.herokuapp.com/posts/add/${picType}`,
        {
          method: "Post",
          headers: {
            "auth-token": token,
            "Content-Type": "multipart/form-data",
          },
          body: formdata,
        }
      );
      const profiledata = await fetchedProfileData.json();
      setLoading(false);
      go();
    } catch (error) {
      setLoading(false);
      console.log("erroor", error);
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    let result;
    if (picType == "avatar" || picType == "post") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      });
    }

    // Explore the result

    if (!result.cancelled) {
      fetchAdd(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result;
    if (picType == "avatar" || picType == "post") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      });
    }

    if (!result.cancelled) {
      fetchAdd(result.uri);
    }
  };

  const pickVideo = async () => {
    let result;
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });
    if (!result.cancelled) {
      fetchAddVideo(result.uri);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button color="#45b6ed" onPress={pickImage} title="Select an image" />
        <Button color="#45b6ed" onPress={pickVideo} title="Select a video" />
        <Button color="#45b6ed" onPress={openCamera} title="Open camera" />
      </View>
      {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
      {loading ? <ActivityIndicator color="white" size="large" /> : null}
      {/* <Button title="Sent" onPress={() => fetchAdd(image)} /> */}
      {/* {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )} */}
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202020",
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: "cover",
  },
});
