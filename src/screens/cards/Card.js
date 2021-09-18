import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheet } from "react-native-btr";

export default function Card(props) {
  const [liked, setlike] = useState(false); 
  const [disliked, setdislike] = useState(false);
  const [visible, setVisible] = useState(false);
  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  async function fetchDelete(value) {
    try {
      const token = await AsyncStorage.getItem("token");
      const fetchedDelet = await fetch(
        // `https://backapi.herokuapp.com/posts/post/${props.data._id}/delete`,
        `http://localhost:3333/posts/post/${props.data._id}/delete`,
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
 if (props.data.likedpeople.length !=0) {
    props.data.likedpeople.map((i, index)=>{
    if (i == props.data.user && liked == false) {
      setlike(true)
      if (disliked == true) {
        setdislike(false)
      } 
    }
  })
}else if (liked == true) {
  setlike(false)
}
if (props.data.dislikedpeople.length !=0) {
  
    props.data.dislikedpeople.map((i, index)=>{
    if (i == props.data.user && disliked == false) {
      setdislike(true)
      if (liked == true) {
        setlike(false)
      }    
    }
  })
}else if (disliked == true) {
  setdislike(false)
}
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Image
            source={{
              uri:`https://drive.google.com/uc?export=wiew&id=${props.data.userId.avatar}` ,
            }}
            style={{
              width: "85%",
              height: "85%",
              borderRadius: 15,
              alignSelf: "center",
              backgroundColor: "#eaeded",
            }}
          />
        </View>
        <View style={styles.text}>
          <Text style={{ fontSize: 15 }}>{props.data.userId.username}</Text>
        </View>
        <View style={styles.more}>
          <TouchableOpacity onPress={toggleBottomNavigationView}>
            <Image
              source={require("../../../assets/img/more.png")}
              style={{ width: 30, height: 30, alignSelf: "center" }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.main}>
        <Image
          source={{
            uri: `https://drive.google.com/uc?export=wiew&id=${props.data.imgId}`,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View style={styles.top}>
        <View style={styles.more}>
          <TouchableOpacity
            style={styles.more1}
            onPress={() => {
              setdislike(false)
              setlike(false)
              if (liked) {
                fetchLike("unlike");
              } else if(disliked){
                fetchLike("like");
                fetchLike("undislike")
              }else{
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
                source={require("../../../assets/img/like.png")}
                style={{ width: "65%", height: "65%", alignSelf: "center" }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.text1}>
          <View style={styles.like}>
            <Text style={{ fontSize: 15 }}>
              {props.data.likes}
            </Text>
          </View>
          <View style={styles.likes}>
            <Text style={{ fontSize: 15 }}>
              {(props.data.likes )- (props.data.dislikes)}
            </Text>
          </View>
          <View style={styles.dislikes}>
            <Text style={{ fontSize: 15 }}>
              {props.data.dislikes}
            </Text>
          </View>
        </View>
        <View style={styles.more}>
          <TouchableOpacity
            style={styles.more1}
            onPress={() => {setdislike(false)
              setlike(false)
              if (disliked) {
                fetchLike("undislike");
              } else if(liked){
                fetchLike("dislike");
                fetchLike("unlike");
              }else{
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
                source={require("../../../assets/img/dislike.png")}
                style={{ width: "65%", height: "65%", alignSelf: "center" }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={{ fontSize: 11 }}>{props.data.desc}</Text>
        <Text style={{ fontSize: 11 }}>{props.data.date.substring(0, 10)}</Text>
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
                    : { fontSize: 18, color: "#c7c7c7" }
                }
              >
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavigationViewButton}
              onPress={() => alert("soon")}
            >
              <Text style={{ fontSize: 18 }}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomNavigationViewButton}
              onPress={() => toggleBottomNavigationView()}
            >
              <Text style={{ fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const width =
  Math.round(Dimensions.get("window").width) < "600"
    ? Math.round(Dimensions.get("window").width)
    : Math.round(Dimensions.get("window").width) / 2 - 20;

const height = Math.round(Dimensions.get("window").height);

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
    backgroundColor: "#fff",
    marginTop: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "grey",
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
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
