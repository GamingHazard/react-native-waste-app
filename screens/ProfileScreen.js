import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
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

  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          width: "100%",
          height: 550,
          backgroundColor: "#4c7c54",
          alignItems: "center",

          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          padding: 20,
        }}
      >
        <View
          style={{
            padding: 5,
            backgroundColor: "white",
            borderRadius: 120,
          }}
        >
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 30,
              resizeMode: "contain",
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "#fbfbda",
            marginVertical: 10,
          }}
        >
          {user?.name}
        </Text>
        <Text style={{ color: "#fbfbda", fontSize: 18, marginTop: 10 }}>
          followers : {user?.followers?.length}
        </Text>

        <View
          style={{
            marginVertical: 10,
            justifyContent: "center",
            alignItems: "center",

            width: 300,
            height: 90,
            overflow: "scroll",
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: "white",
            }}
          >
            <Text style={{ color: "black" }}>Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: "white",
            }}
          >
            <Text style={{ color: "black" }}>Logout</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          width: 360,
          height: "auto",
          padding: 10,
          alignSelf: "center",
          top: -90,

          elevation: 10,
          alignItems: "center",
          borderRadius: 30,
        }}
      >
        {/* Help Service */}
        <View
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "whitesmoke",
            height: 110,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginRight: 10 }}>
              Help Service
            </Text>
            {/* <Entypo name="help-with-circle" size={24} color="black" /> */}
            <AntDesign name="customerservice" size={24} color="black" />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              alignItems: "center",
              height: 60,
              flexDirection: "row",
            }}
          >
            <TextInput
              placeholder="Enter Message..."
              multiline
              numberOfLines={1}
              style={{ flex: 1, marginRight: 16 }}
            />
            <TouchableOpacity>
              <FontAwesome name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Terms & Conditions */}
        <View
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "whitesmoke",
            height: 110,

            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Advertisement
          </Text>
          <View
            style={{
              padding: 10,
              height: 60,
            }}
          >
            <Text>To advertise with us, click on the link below</Text>
            <Text style={{ color: "green" }}>www.ugarecycleadvert.com</Text>
          </View>
        </View>

        {/* Jobs & Carreas */}
        <View
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "whitesmoke",
            height: 110,

            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Jobs & Carreas
          </Text>
          <View
            style={{
              padding: 10,
              height: 60,
            }}
          >
            <Text>For job applicaton, click on the link below</Text>
            <Text style={{ color: "green" }}>www.ugarecycleadvert.com</Text>
            <Text>Call: 0774205474 / 0741745165</Text>
          </View>
        </View>

        {/*Contacts */}
        <View
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "whitesmoke",
            height: 110,

            marginBottom: 10,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            Important Contacts
          </Text>
          <View
            style={{
              padding: 10,
              height: 60,
            }}
          >
            <Text>KCCA: 0312 900 000 / 0800 299 000 (Toll free)</Text>
            <Text> Police : 911 / 999 </Text>
            <Text>Developer : 0741745165</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
