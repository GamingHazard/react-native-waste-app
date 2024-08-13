import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    setLoading(true);
    const user = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://waste-recycle-app-backend.onrender.com/register",
        user
      );
      console.log(response);
      Alert.alert(
        "Registration successful",
        "You have been registered successfully"
      );
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
      navigation.replace("Main");
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Registration failed",
        "An error occurred during registration"
      );
      console.error("Registration error", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4c7c54" }}>
      <View style={{ marginTop: 50 }}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 150,
            height: 100,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 25,
              color: "#fbfbda",
            }}
          >
            Register Account
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
              marginHorizontal: 16,
              backgroundColor: "white",
            }}
          >
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="#4c7c54"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"#4c7c54"}
              style={{
                color: "#4c7c54",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="Enter your Name"
            />
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 5,
              marginHorizontal: 16,
              backgroundColor: "white",
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="#4c7c54"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"#4c7c54"}
              style={{
                color: "#4c7c54",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="Enter your Email"
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 5,
                marginHorizontal: 16,
                backgroundColor: "white",
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock"
                size={24}
                color="#4c7c54"
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={"#4c7c54"}
                style={{
                  color: "#4c7c54",
                  marginVertical: 10,
                  width: 300,
                  fontSize: 16,
                }}
                placeholder="Enter your Password"
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 45 }} />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "#fbfbda",
            padding: 15,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#4c7c54" />
          ) : (
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
                color: "#4c7c54",
              }}
            >
              Register
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16, color: "#fbfbda" }}>
            Already have an account? Login
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
