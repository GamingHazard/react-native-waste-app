import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import axios from "axios";

const UserType = createContext();

const UserContext = ({ children }) => {
  const [UserToken, setUserToken] = useState(null);
  const [UserID, setUserID] = useState(null);
  const [UserInfo, setUserInfo] = useState(null);
  const [UserRole, setUserRole] = useState(null);
  const [MainModal, setMainModal] = useState(null);
  // Check if the token exists in sessionStorage to set the initial authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!AsyncStorage.getItem("userToken")
  );
  const [SelectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const id = await AsyncStorage.getItem("userId");
        const profile = await AsyncStorage.getItem("profile");
        const role = await AsyncStorage.getItem("userRole");

        if (token && id) {
          setUserToken(token);
          setUserID(id);
          setUserRole(role);
          setUserInfo(profile); // Ensure profile is parsed if stored as a JSON string
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  //User Registration
  const register = async (token, id, data) => {
    setIsAuthenticated(true);
    setUserToken(token);
    setUserRole(role);
    setUserID(id);
    setUserInfo(data);
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("profile", JSON.stringify(data));
    await AsyncStorage.setItem("userId", id);
  };

  //User Login
  const login = async (token, role, id, data) => {
    setIsAuthenticated(true);
    setUserToken(token);
    setUserRole(role);
    setUserID(id);
    setUserInfo(data);
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("profile", JSON.stringify(data));
    await AsyncStorage.setItem("userId", id);
  };

  // User Logout
  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    setUserID(null);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("profile");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.clear();
  };

  const ShowEditPage = () => setMainModal(true);
  const HideEditPage = () => setMainModal(false);

  // Image Picker Logic
  const uploadImage = async (mode) => {
    try {
      let result = {};

      // Check permissions and pick image
      if (mode === "gallery") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission Required", "Gallery permission is required.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        const permissionResult =
          await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission Required", "Camera permission is required.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        await uploadImageToCloudinary(imageUri);
      }
    } catch (error) {
      console.log("Error selecting image: ", error);
    }
  };

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (imageUri) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/ghost150/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "profile-images";

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profilePicture.jpg",
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        await saveImageToStorage(data.secure_url);
        await saveImageToStorage();
      } else {
        throw new Error("Error uploading image to Cloudinary");
      }
    } catch (error) {
      // Alert.alert(error);
      Alert.alert(
        "Failed!",
        error.message +
          "                                             " +
          "                                             " +
          "Please check you internet connection and try again"
      );
      console.error("Cloudinary upload failed:", error);
    }
  };

  // Save image URL to AsyncStorage and update backend
  const saveImageToStorage = async (imageUrl) => {
    try {
      await updateProfilePicture(imageUrl);
    } catch (error) {
      Alert.alert(
        "Failed!",
        error.message +
          "                                             " +
          "Please check you internet connection and try again"
      );
      console.log("Error saving image:", error);
    }
  };
  // Update Profile Picture in Backend
  const updateProfilePicture = async (profilePictureUrl) => {
    try {
      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateProfilePicture/${UserID}`,
        { profilePicture: profilePictureUrl },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;
      if (response.status === 200) {
        console.log(data);

        setUserInfo(response.data);
        setUserToken(response.data.verificationToken);
        setUserID(response.data.user._id);

        await AsyncStorage.setItem("profile", JSON.stringify(data.user));

        await AsyncStorage.setItem("userToken", data.user.verificationToken);
        await AsyncStorage.setItem("userId", data.user._id);
        setSelectedImage(profilePictureUrl);
      }
    } catch (error) {
      console.log("Error updating profile picture:", error);
    }
  };

  // Remove Profile Picture
  const removeImage = async () => {
    try {
      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateProfilePicture/${UserID}`,
        { profilePicture: "" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setSelectedImage(null);
        await AsyncStorage.removeItem("userImage");
        setUserInfo(response.data);
        setUserToken(response.data.verificationToken);
        setUserID(response.data.user._id);
        await AsyncStorage.setItem("userInfo", response.data);
        await AsyncStorage.setItem(
          "userToken",
          response.data.verificationToken
        );
        await AsyncStorage.setItem("userId", response.data.user._id);
      }
    } catch (error) {
      Alert.alert("Failed!", error.message + "try again later");
      console.log("Error removing image: ", error);
    }
  };

  // Update User Profile
  const updateUserProfile = async (name, email, phone) => {
    try {
      const updateData = { name, email, phone };

      const response = await axios.patch(
        `https://uga-cycle-backend-1.onrender.com/updateUser/${UserID}`,
        updateData,
        { headers: { Authorization: `Bearer ${UserToken}` } }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("userInfo", response.data);
        setUserInfo(response.data);
        setUserID(response.data.user._id);
        setUserToken(response.data.verificationToken);
        Alert.alert("Success", "Profile updated successfully.");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert("Failed!", error.message + "try again later");
    }
  };

  return (
    <UserType.Provider
      value={{
        UserID,
        UserToken,
        UserInfo,
        logout,
        UserRole,
        login,
        register,
        SelectedImage,
        uploadImage,
        removeImage,
        MainModal,
        ShowEditPage,
        HideEditPage,
        updateUserProfile,
      }}
    >
      {children}
    </UserType.Provider>
  );
};

export { UserType, UserContext };
