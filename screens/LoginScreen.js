import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { UserType } from "../UserContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(UserType);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const validateIdentifier = (identifier) => {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(identifier) || phoneRegex.test(identifier)) {
      setIdentifierError("");
    } else {
      setIdentifierError("Please enter a valid email address or phone number");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const Userlogin = async (identifier, password) => {
    try {
      if (isConnected) {
        // Try to login as an Admin first
        const response = await axios.post(
          "https://uga-cycle-backend-1.onrender.com/admin-login",
          { identifier, password }
        );

        const { token, user } = response.data;

        login(token, user.role, user.id, response.data);
        return response.data; // Return successful admin login data
      } else {
        Alert.alert("Network Error", "No internet Connection");
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 401)
      ) {
        try {
          const response = await axios.post(
            "https://uga-cycle-backend-1.onrender.com/login",
            { identifier, password }
          );

          const { token, user } = response.data;

          login(token, user.role, user.id, response.data);
          return response.data; // Return successful user login data
        } catch (userLoginError) {
          throw new Error(
            userLoginError.response?.data?.message || userLoginError.message
          );
        }
      } else {
        throw new Error(error.response?.data?.message || error.message);
      }
    }
  };

  const handleLogin = async () => {
    validateIdentifier(identifier); // Ensure this runs when typing

    if (!identifierError && identifier && password) {
      setLoading(true);
      try {
        await Userlogin(identifier, password);
      } catch (error) {
        Alert.alert("Login failed", error.message || "try again later");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Invalid input", "Please correct the identifier or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={require("../assets/icon3.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.title}>Sign in to your account</Text>

        <View
          style={[
            styles.inputContainer,
            { borderColor: identifierError ? "red" : "#3b6d3b" },
          ]}
        >
          <MaterialCommunityIcons name="account" size={24} color="#3b6d3b" />
          <TextInput
            style={styles.input}
            placeholderTextColor={"#3b6d3b"}
            placeholder="Email address or Phone number"
            onChangeText={setIdentifier}
            onBlur={() => validateIdentifier(identifier)}
            autoCapitalize="none"
            value={identifier}
          />
        </View>
        {identifierError ? (
          <Text style={styles.errorText}>{identifierError}</Text>
        ) : null}

        <View
          style={{
            width: "100%",
            height: 60,
            padding: 15,
            borderWidth: 0.5,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "whitesmoke",
          }}
        >
          <Fontisto name="locked" size={24} color="#3b6d3b" />
          <TextInput
            style={styles.input}
            placeholderTextColor={"#3b6d3b"}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="#3b6d3b"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text>Don't have an account yet?</Text>
          <Text
            onPress={() => navigation.navigate("Register")}
            style={styles.createAccountText}
          >
            Create an account
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fbfbda", top: 60 }}>Developed by JOEL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b6d3b",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "white",
    elevation: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    width: "90%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginVertical: 15,
    color: "#3b6d3b",
  },
  inputContainer: {
    width: "100%",
    height: 60,
    padding: 15,
    borderWidth: 0.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "whitesmoke",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
  },
  forgotPassword: {
    marginVertical: 20,
    color: "blue",
  },
  loginButton: {
    width: 200,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#3b6d3b",
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fbfbda",
    fontSize: 16,
  },
  continueWithContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-evenly",
    marginVertical: 15,
    alignItems: "center",
  },
  separator: {
    height: 0.5,
    width: 80,
    borderWidth: 0.5,
    borderColor: "lightgrey",
    marginHorizontal: 15,
  },
  orContinueText: {
    marginVertical: 15,
    color: "grey",
  },
  authButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  authButton: {
    width: 120,
    height: 50,
    borderRadius: 10,
    backgroundColor: "whitesmoke",
    flexDirection: "row",
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  authButtonText: {
    marginLeft: 10,
    fontSize: 18,
  },
  footer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    padding: 15,
    flexDirection: "row",
    marginVertical: 20,
  },
  createAccountText: {
    color: "blue",
  },
});

export default LoginScreen;
