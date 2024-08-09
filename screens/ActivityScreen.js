import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User";
import Spinner from "react-native-loading-spinner-overlay"; // Import the Spinner component

const ActivityScreen = () => {
  const [selectedButton, setSelctedButton] = useState("people");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Update the loading state
  const { userId, setUserId } = useContext(UserType);

  const handleButtonClick = (buttonName) => {
    setSelctedButton(buttonName);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting to fetch
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        let endpoint = "";
        switch (selectedButton) {
          case "people":
            endpoint = `/user/${userId}`;
            break;
          case "all":
            endpoint = "/users"; // Adjust this endpoint as needed
            break;
          case "requests":
            endpoint = "/requests"; // Adjust this endpoint as needed
            break;
          default:
            endpoint = `/user/${userId}`;
            break;
        }

        const response = await axios.get(
          `https://waste-recycle-app-backend.onrender.com${endpoint}`
        );
        setUsers(response.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [selectedButton]);

  return (
    <ScrollView style={{ marginTop: 50, flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => handleButtonClick("people")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "people" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "people"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              People
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("all")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "all" ? { backgroundColor: "black" } : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "all"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("requests")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: "#D0D0D0",
                borderRadius: 6,
                borderWidth: 0.7,
              },
              selectedButton === "requests"
                ? { backgroundColor: "black" }
                : null,
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "requests"
                  ? { color: "white" }
                  : { color: "black" },
              ]}
            >
              Reqst
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {loading ? (
            <Spinner
              visible={loading}
              textContent={"Loading..."}
              textStyle={styles.spinnerTextStyle}
            />
          ) : (
            <View style={{ marginVertical: 20 }}>
              {users?.map((item, index) => (
                <User key={index} item={item} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
});
