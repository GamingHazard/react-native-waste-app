import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Buy from "../components/Buy";
import Sale from "../components/Sale";

const HomeScreen = () => {
  const [activeComponent, setActiveComponent] = useState("one");
  const [loading, setLoading] = useState(false);

  // Function to simulate data loading
  const fetchData = async () => {
    setLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust this timeout to match your data fetching duration
  };

  useEffect(() => {
    fetchData(); // Load data when component mounts
  }, [activeComponent]);

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Load data when the screen is focused
    }, [activeComponent])
  );

  const renderComponent = () => {
    if (activeComponent === "one") {
      return <Buy />;
    } else if (activeComponent === "two") {
      return <Sale />;
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

      <View style={styles.componentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4c7c54" />
        ) : (
          renderComponent()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navBar: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#4c7c54",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    color: "#fbfbda",
    fontWeight: "bold",
    fontSize: 20,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#fbfbda",
  },
  componentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});

export default HomeScreen;
