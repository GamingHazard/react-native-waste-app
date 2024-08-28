import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import CreateBuyPost from "./CreateBuyPost";
import CreateSalePost from "./CreateSalePost";

const Buy = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://waste-recycle-app-backend.onrender.com/get-BuyPosts"
      );
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    }
  };

  const refreshPosts = () => {
    fetchPosts();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {modalVisible && (
          <BlurView intensity={30} style={styles.absolute}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.overlay}>
                <View style={styles.modalView}>
                  <AntDesign
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                    name="close"
                    size={24}
                    color="red"
                  />
                  <CreateSalePost refreshPosts={refreshPosts} />
                </View>
              </View>
            </Modal>
          </BlurView>
        )}

        <View style={styles.postsContainer}>
          {posts?.map((post) => (
            <View key={post._id} style={styles.postContainer}>
              <View style={styles.postFooter}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
                <View>
                  <Text style={styles.username}>{post?.user?.name}</Text>
                  <Text style={styles.timestamp}>{post?.createdAt}</Text>
                </View>
              </View>
              <View style={styles.postContent}>
                <Text style={styles.postText}>{post?.content}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // Dark semi-transparent overlay
  },
  header: {
    backgroundColor: "whitesmoke",
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 50,
    width: 40,
    height: 40,
    alignSelf: "flex-end",
    marginHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  overlay: {},
  modalView: {
    backgroundColor: "#4c7c54",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 350,
    height: 400,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  postsContainer: {
    flex: 1,
  },
  postContainer: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderTopWidth: 1,
  },
  postContent: {
    marginVertical: 10,
  },
  postText: { marginVertical: 10 },
  likesContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    paddingRight: 20,
    marginTop: 20,
  },
  likesCount: {
    color: "gray",
    flex: 1,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
    marginRight: 16,
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Buy;

// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Image,
//   Modal,
//   TouchableOpacity,
// } from "react-native";
// import React, { useEffect, useContext, useState, useCallback } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import jwt_decode from "jwt-decode";
// import { UserType } from "../UserContext";
// import axios from "axios";
// import { AntDesign } from "@expo/vector-icons";
// import { useFocusEffect } from "@react-navigation/native";
// import { BlurView } from "expo-blur";
// import CreateBuyPost from "./CreateBuyPost";

// const Buy = () => {
//   const { userId, setUserId } = useContext(UserType);
//   const [posts, setPosts] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = await AsyncStorage.getItem("authToken");
//       const decodedToken = jwt_decode(token);
//       const userId = decodedToken.userId;
//       setUserId(userId);
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     fetchPosts();
//     // Polling: Fetch data every 10 seconds
//     const interval = setInterval(fetchPosts, 10000); // 10 seconds

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchPosts();
//     }, [])
//   );

//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get(
//         "https://waste-recycle-app-backend.onrender.com/get-BuyPosts"
//       );
//       setPosts(response.data);
//     } catch (error) {
//       console.log("error fetching posts", error);
//     }
//   };

//   const handleLike = async (postId) => {
//     try {
//       const response = await axios.put(
//         `https://waste-recycle-app-backend.onrender.com/posts/${postId}/${userId}/like`
//       );
//       const updatedPost = response.data;
//       const updatedPosts = posts.map((post) =>
//         post._id === updatedPost._id ? updatedPost : post
//       );
//       setPosts(updatedPosts);
//     } catch (error) {
//       console.log("Error liking the post", error);
//     }
//   };

//   const handleDislike = async (postId) => {
//     try {
//       const response = await axios.put(
//         `https://waste-recycle-app-backend.onrender.com/posts/${postId}/${userId}/unlike`
//       );
//       const updatedPost = response.data;
//       const updatedPosts = posts.map((post) =>
//         post._id === updatedPost._id ? updatedPost : post
//       );
//       setPosts(updatedPosts);
//     } catch (error) {
//       console.error("Error unliking post:", error);
//     }
//   };

//   const refreshPosts = () => {
//     fetchPosts();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => setModalVisible(true)}
//         >
//           <AntDesign name="plus" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.scrollView}>
//         {modalVisible && (
//           <BlurView intensity={50} style={styles.absolute}>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => setModalVisible(false)}
//             >
//               <View style={styles.modalView}>
//                 <AntDesign
//                   onPress={() => setModalVisible(false)}
//                   style={styles.closeButton}
//                   name="close"
//                   size={24}
//                   color="red"
//                 />
//                 <CreateBuyPost refreshPosts={refreshPosts} />
//               </View>
//             </Modal>
//           </BlurView>
//         )}

//         <View style={styles.postsContainer}>
//           {posts?.map((post) => (
//             <View key={post._id} style={styles.postContainer}>
//               <View style={styles.postFooter}>
//                 <Image
//                   style={styles.profileImage}
//                   source={{
//                     uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
//                   }}
//                 />
//                 <View>
//                   <Text style={styles.username}>{post?.user?.name}</Text>
//                   <Text style={styles.timestamp}>{post?.createdAt}</Text>
//                 </View>
//               </View>
//               <View style={styles.postContent}>
//                 <Text style={styles.postText}>{post?.content}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   header: {
//     backgroundColor: "whitesmoke",
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     resizeMode: "contain",
//   },
//   addButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "black",
//     borderRadius: 50,
//     width: 40,
//     height: 40,
//     alignSelf: "flex-end",
//     marginHorizontal: 10,
//   },
//   scrollView: {
//     backgroundColor: "white",
//     flex: 1,
//   },
//   absolute: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   modalView: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: 350,
//     height: 400,
//     alignSelf: "center",
//     marginHorizontal: 10,
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//   },
//   postsContainer: {
//     flex: 1,
//   },
//   postContainer: {
//     padding: 10,
//     borderColor: "#D0D0D0",
//     borderTopWidth: 1,
//   },
//   postContent: {
//     marginVertical: 10,
//   },
//   postText: {
//     marginVertical: 10,
//   },
//   likesContainer: {
//     alignItems: "flex-end",
//     flexDirection: "row",
//     paddingRight: 20,
//     marginTop: 20,
//   },
//   likesCount: {
//     color: "gray",
//     flex: 1,
//   },
//   postFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     resizeMode: "contain",
//     marginRight: 16,
//   },
//   username: {
//     fontSize: 15,
//     fontWeight: "bold",
//   },
//   timestamp: {
//     fontSize: 15,
//   },
// });

// export default Buy;
