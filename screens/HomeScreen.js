import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay"; // Import Spinner
import Buy from "../components/Buy";
import Sale from "../components/Sale";

const HomeScreen = () => {
  const [activeComponent, setActiveComponent] = useState("one");

  const renderComponent = () => {
    if (activeComponent === "one") {
      return <ComponentOne />;
    } else if (activeComponent === "two") {
      return <ComponentTwo />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeComponent === "one" && styles.activeButton,
          ]}
          onPress={() => setActiveComponent("one")}
        >
          <Text style={styles.navText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeComponent === "two" && styles.activeButton,
          ]}
          onPress={() => setActiveComponent("two")}
        >
          <Text style={styles.navText}>Sale</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
};

const ComponentOne = () => <Buy />;

const ComponentTwo = () => <Sale />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "green",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  componentContainer: {
    flex: 1,
  },
});

export default HomeScreen;
