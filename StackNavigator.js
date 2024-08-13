import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import ThreadsScreen from "./screens/ThreadsScreen";
import ActivityScreen from "./screens/ActivityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CommunityPage from "./screens/ThreadsScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { fontSize: 12, padding: 5, color: "grey" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#4c7c54" />
              ) : (
                <AntDesign name="home" size={24} color="grey" />
              ),
          }}
        />

        <Tab.Screen
          name="Thread"
          component={ThreadsScreen}
          options={{
            tabBarLabel: "Community",
            tabBarLabelStyle: { fontSize: 12, padding: 5, color: "grey" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="people" size={24} color="#4c7c54" />
              ) : (
                <Ionicons name="people-outline" size={24} color="grey" />
              ),
          }}
        />

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: "Services",
            tabBarLabelStyle: { fontSize: 12, padding: 5, color: "grey" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="dump-truck"
                  size={24}
                  color="#4c7c54"
                />
              ) : (
                <MaterialCommunityIcons
                  name="dump-truck"
                  size={24}
                  color="grey"
                />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { fontSize: 12, padding: 5, color: "grey" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#4c7c54" />
              ) : (
                <Ionicons name="person-outline" size={24} color="grey" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
