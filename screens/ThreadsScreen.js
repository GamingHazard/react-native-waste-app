import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  Modal,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "react-native";
import CreatePost from "../components/CreatePost";

const ThreadScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://waste-recycle-app-backend.onrender.com/get-posts"
      );
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `https://waste-recycle-app-backend.onrender.com/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `https://waste-recycle-app-backend.onrender.com/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  // Function to be passed to CreatePost for refreshing posts
  const refreshPosts = () => {
    fetchPosts();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "lightblue" }}>
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          backgroundColor: "whitesmoke",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={{}}>
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              flex: 1,
            }}
            source={{
              uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
            }}
          />
        </View>

        {/* Add Content button */}
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            borderRadius: 50,
            width: 40,
            height: 40,
            alignSelf: "flex-end",
            marginHorizontal: 10,
          }}
        >
          <AntDesign
            onPress={() => setModalVisible(true)}
            name="plus"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* content */}
      <ScrollView
        style={{
          backgroundColor: "white",
          flex: 2,
        }}
        contentContainerStyle={{
          transform: [{ scaleY: -1 }], // Flip the ScrollView vertically
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
                <CreatePost refreshPosts={refreshPosts} />
              </View>
            </Modal>
          </BlurView>
        )}

        <View style={{}}>
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
              <View
                style={{
                  transform: [{ scaleY: -1 }], // Flip each item back to normal
                }}
              >
                <View style={{ width: "100%", height: "auto" }}>
                  <Text style={{ padding: 10 }}>{post?.content}</Text>
                </View>

                {/* Heart Icon */}
                <View
                  style={{
                    alignItems: "flex-end",
                    gap: 10,
                    marginTop: 15,
                    paddingRight: 20,
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginTop: 7, color: "gray", flex: 1 }}>
                    {post?.likes?.length} likes
                  </Text>
                  {post?.likes?.includes(userId) ? (
                    <TouchableOpacity onPress={() => handleDislike(post?._id)}>
                      <AntDesign name="heart" size={18} color="green" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleLike(post?._id)}>
                      <AntDesign name="hearto" size={18} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  transform: [{ scaleY: -1 }], // Flip each item back to normal
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
    width: 350,
    height: 300,
    alignSelf: "center",
    top: 100,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ThreadScreen;
