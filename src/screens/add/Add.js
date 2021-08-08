import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
const FormData = require("form-data");

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const fetchAdd = async (props) => {
    console.log("000");
    try {
      let formdata = new FormData();
      formdata.append("image", {
        uri: props,
        name: "image.jpg",
        type: "image/jpeg",
      });
      const token = await AsyncStorage.getItem("token");
      const fetchedProfileData = await fetch(
        // "http://localhost:3333/posts/add",
        "https://backapi.herokuapp.com/posts/add",
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
      console.log("resp", profiledata);
    } catch (error) {
      console.log("erroor", error);
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <TouchableOpacity onPress={() => fetchAdd(image)}>
        <View
          style={{
            backgroundColor: "blue",
            width: 70,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Sent</Text>
        </View>
      </TouchableOpacity>
      {/* <Button title="Sent" onPress={() => fetchAdd(image)} /> */}
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}
