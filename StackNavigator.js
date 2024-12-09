import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import ThreadsScreen from "./screens/ThreadsScreen";
import ActivityScreen from "./screens/ActivityScreen";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SaleScreen from "./screens/SalesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import Reminder from "./screens/Reminder";
import Tips from "./screens/TipsScreen";
import ProfileScreen from "./screens/settingsScreens/ProfileScreen";
import PrivacyScreen from "./screens/settingsScreens/PrivacyScreen";
import ReportScreen from "./screens/settingsScreens/ReportScreen";
import SecurityScreen from "./screens/settingsScreens/SecurityScreen";
import SupportScreen from "./screens/settingsScreens/SupportScreen";
import { UserType } from "./UserContext";
import MapboxMap from "./screens/Map";
import WelcomeScreen from "./screens/WelcomeScreen";

const StackNavigator = () => {
  const { UserToken, UserRole } = useContext(UserType);
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
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: "Settings",
            tabBarLabelStyle: { fontSize: 12, padding: 5, color: "grey" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="settings" size={24} color="#4c7c54" />
              ) : (
                <Ionicons name="settings-outline" size={24} color="grey" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {UserToken !== null ? (
          <>
            {UserRole === "Admin" ? (
              <Stack.Screen
                name="Map"
                component={MapboxMap}
                options={{ headerShown: false }}
              />
            ) : (
              <React.Fragment>
                <Stack.Screen
                  name="Main"
                  component={BottomTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Sale"
                  component={SaleScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Reminder"
                  component={Reminder}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Tips"
                  component={Tips}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Privacy"
                  component={PrivacyScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Report"
                  component={ReportScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Security"
                  component={SecurityScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Support"
                  component={SupportScreen}
                  options={{ headerShown: false }}
                />
              </React.Fragment>
            )}
          </>
        ) : (
          <React.Fragment>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
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
          </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
