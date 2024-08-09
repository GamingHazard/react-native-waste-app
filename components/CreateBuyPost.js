import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

const CreateBuyPost = ({ refreshPosts }) => {
  const { userId } = useContext(UserType);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://waste-recycle-app-backend.onrender.com/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProfile();
  });

  const handlePostSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter content before submitting.");
      return;
    }

    const postData = {
      userId,
      content: content.trim(),
    };

    setLoading(true);

    axios
      .post(
        "https://waste-recycle-app-backend.onrender.com/create-BuyPosts",
        postData
      )
      .then((response) => {
        setContent("");
        setLoading(false);
        refreshPosts(); // Refresh posts after successful submission
      })
      .catch((error) => {
        console.log("error creating post", error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text style={styles.username}>{user?.name}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"lightgrey"}
          placeholder="Enter you Items, their prices, your contact details..."
          multiline
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Pressable onPress={handlePostSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Share Post</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    // backgroundColor: "lightblue",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  username: {
    fontWeight: "bold",
  },
  inputContainer: {
    marginVertical: 10,
    width: "100%",
    height: 200,
    // backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    marginVertical: 20,
  },
  textInput: {
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateBuyPost;
