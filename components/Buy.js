import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { BlurView } from "expo-blur";
import CreateBuyPost from "./CreateBuyPost";

const Buy = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket("ws://your-server-ip:3000"); // Replace with your WebSocket server URL

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "NEW_BUY_POST":
          setPosts((prevPosts) => [data.post, ...prevPosts]);
          break;
        case "UPDATED_BUY_POST":
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === data.post._id ? data.post : post
            )
          );
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://waste-recycle-app-backend.onrender.com/get-BuyPosts"
      );
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to be passed to CreatePost for refreshing posts
  const refreshPosts = () => {
    fetchPosts();
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: "whitesmoke",
          padding: 16,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: "black",
              borderRadius: 50,
              marginHorizontal: 10,
              flexDirection: "row",
              padding: 15,
              justifyContent: "space-evenly",
            }}
          >
            <Text style={{ color: "white", marginHorizontal: 20 }}>
              Create Post
            </Text>
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{
          backgroundColor: "white",
          flex: 2,
        }}
      >
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />

        {modalVisible && (
          <BlurView intensity={50} style={styles.absolute}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalView}>
                <AntDesign
                  onPress={() => setModalVisible(false)}
                  style={{ alignSelf: "flex-end" }}
                  name="close"
                  size={24}
                  color="red"
                />
                <CreateBuyPost refreshPosts={refreshPosts} />
              </View>
            </Modal>
          </BlurView>
        )}

        <View style={{ width: "100%" }}>
          {posts?.map((post) => (
            <View
              key={post._id}
              style={{
                padding: 15,
                borderColor: "#D0D0D0",
                borderTopWidth: 1,
                gap: 10,
                padding: 10,
              }}
            >
              <View>
                <Text style={{ padding: 10 }}>{post?.content}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    resizeMode: "contain",
                    marginRight: 16,
                  }}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {post?.user?.name}
                  </Text>
                  <Text style={{ fontSize: 15 }}>{post?.createdAt}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: 500,
    alignSelf: "center",
    top: 80,
    marginHorizontal: 10,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default Buy;
