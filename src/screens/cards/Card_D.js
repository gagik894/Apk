import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheet } from "react-native-btr";
import { Video } from "expo-av";

const width =
    Math.round(Dimensions.get("window").width) < "600"
      ? Math.round(Dimensions.get("window").width)
      : Math.round(Dimensions.get("window").width) / 2 - 20;

  const height = Math.round(Dimensions.get("window").height);

export default function Card(props) {
  const [liked, setlike] = useState(false);
  const [disliked, setdislike] = useState(false);
  const [visible, setVisible] = useState(false);
  const [videoHeight, setVideoHeight] = useState(width);
  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  async function fetchDelete(value) {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedDelet = await fetch(
        `https://backapi.herokuapp.com/posts/post/${props.data._id}/delete`,
        // `http://localhost:3333/posts/post/${props.data._id}/delete`,
        {
          method: "delete",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await fetchedDelet.json();
      toggleBottomNavigationView();
    } catch (error) {
      console.log(error);
      toggleBottomNavigationView();
    }
  }
  async function fetchLike(value) {
    const send = { like: value };

    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedLogin = await fetch(
        `https://backapi.herokuapp.com/posts/post/${props.data._id}/like`,
        // `http://localhost:3333/posts/post/${props.data._id}/like`,
        {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(send),
        }
      );
      const data = await fetchedLogin.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function mapLikes() {
    if (props.data.likedpeople.length != 0) {
      let x = false;
      await props.data.likedpeople.map((i, index) => {
        if (i == props.data.user) {
          x = true;
        }
      });
      if (x == true) {
        if (liked == false) {
          setlike(true);
          if (disliked == true) {
            setdislike(false);
          }
        }
      }
      if (x == false && liked == true) {
        setlike(false);
      }
    } else if (liked == true) {
      setlike(false);
    }
  }
  async function mapDisLikes() {
    let x = false;
    if (props.data.dislikedpeople.length != 0) {
      await props.data.dislikedpeople.map((i, index) => {
        if (i == props.data.user) {
          x = true;
        }
      });
      if (x == true) {
        if (disliked == false) {
          setdislike(true);
          if (liked == true) {
            setlike(false);
          }
        }
      } else if (x == false && disliked == true) {
        setdislike(false);
      }
    } else if (disliked == true) {
      setdislike(false);
    }
  }
  mapLikes();
  mapDisLikes();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `https://drive.google.com/uc?export=wiew&id=${props.data.imgId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <TouchableOpacity
            disabled={props.data.user == props.data.userId._id}
            onPress={() => {
              props.data.handler({
                id: props.data.userId._id,
              });
            }}
          >
            <Image
              source={{
                uri: `https://drive.google.com/uc?export=wiew&id=${props.data.userId.avatar}`,
              }}
              style={{
                width: "85%",
                height: "85%",
                borderRadius: 10,
                alignSelf: "center",
                backgroundColor: "#eaeded",
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.text}>
          <TouchableOpacity
            disabled={props.data.user == props.data.userId._id}
            onPress={() => {
              props.data.handler({
                id: props.data.userId._id,
              });
            }}
          >
            <Text style={{ fontSize: 15, color: "#ffff" }}>
              {props.data.userId.username}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.more}>
          <TouchableOpacity onPress={toggleBottomNavigationView}>
            <Image
              source={require("../../../assets/img/more_D.png")}
              style={{ width: 30, height: 30, alignSelf: "center" }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
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
                style={{
                  width: width,
                  height: videoHeight,
              }}
              useNativeControls
              onReadyForDisplay={(response) => {
                const newWidth= response.naturalSize.width;
                const newHeight = response.naturalSize.height;
                const heightScaled = newHeight * (width / newWidth);
                setVideoHeight(heightScaled)
              }}
              resizeMode="contain"
              isLooping
              shouldPlay={true}
              // onPlaybackStatusUpdate={true}
            />
          </View>
        )}
      </View>
      <View style={styles.top}>
        <View style={styles.more}>
          <TouchableOpacity
            style={styles.more1}
            onPress={() => {
              if (liked) {
                fetchLike("unlike");
              } else if (disliked) {
                fetchLike("like");
                fetchLike("undislike");
              } else {
                fetchLike("like");
              }
            }}
          >
            {liked ? (
              <Image
                source={require("../../../assets/img/liked.png")}
                style={{ width: "65%", height: "65%", alignSelf: "center" }}
              />
            ) : (
              <Image
                source={require("../../../assets/img/like_D.png")}
                style={{ width: "65%", height: "65%", alignSelf: "center" }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.text1}>
          <View style={styles.like}>
            <Text style={{ fontSize: 15, color: "#ffff" }}>
              {props.data.likes}
            </Text>
          </View>
          <View style={styles.likes}>
            <Text style={{ fontSize: 15, color: "#ffff" }}>
              {props.data.likes - props.data.dislikes}
            </Text>
          </View>
          <View style={styles.dislikes}>
            <Text style={{ fontSize: 15, color: "#ffff" }}>
              {props.data.dislikes}
            </Text>
          </View>
        </View>
        <View style={styles.more}>
          <TouchableOpacity
            style={styles.more1}
            onPress={() => {
              if (disliked) {
                fetchLike("undislike");
              } else if (liked) {
                fetchLike("dislike");
                fetchLike("unlike");
              } else {
                fetchLike("dislike");
              }
            }}
          >
            {disliked ? (
              <Image
                source={require("../../../assets/img/disliked.png")}
                style={{ width: "65%", height: "65%", alignSelf: "center" }}
              />
            ) : (
              <Image
                source={require("../../../assets/img/dislike_D.png")}
                style={{ width: "65%", height: "65%", alignSelf: "center" }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={{ fontSize: 11 }}>{props.data.desc}</Text>
        <Text style={{ fontSize: 11, color: "#ffff" }}>
          {props.data.date.substring(0, 10)}
        </Text>
      </View>
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}
        <View style={styles.bottomNavigationView}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={styles.bottomNavigationViewButton}
              disabled={!(props.data.user == props.data.userId._id)}
              onPress={() => fetchDelete()}
            >
              <Text
                style={
                  props.data.user == props.data.userId._id
                    ? { fontSize: 18, color: "red" }
                    : { fontSize: 18, color: "#000" }
                }
              >
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavigationViewButton}
              onPress={() => onShare()}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavigationViewButton}
              onPress={() => toggleBottomNavigationView()}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    height: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  header: {
    height: 52,
    flexDirection: "row",
  },
  profile: {
    width: 52,
    height: 52,
    justifyContent: "center",
    marginLeft: 8,
  },
  text: {
    flex: 1,
    height: 52,
    justifyContent: "center",
  },
  text1: {
    flex: 1,
    height: 52,
    justifyContent: "center",
    flexDirection: "row",
  },
  like: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  likes: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  dislikes: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },
  more: {
    width: 52,
    height: 52,
    justifyContent: "center",
  },
  more1: {
    height: 52,
    justifyContent: "center",
  },
  main: {
    height: width,
  },
  video: {
    alignSelf: "center",
    width: width,
  },
  top: {
    height: 50,
    flexDirection: "row",
  },
  bottom: {
    borderTopColor: "grey",
    borderTopWidth: 0.4,
    height: 25,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    width: width,
    backgroundColor: "#202020",
    marginTop: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  bottomNavigationView: {
    backgroundColor: "#202020",
    width: "100%",
    height: 204,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavigationViewButton: {
    width: "100%",
    justifyContent: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    height: 68,
  },
});
