import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Linking,
  Animated,
  Easing,
  Image,
  Dimensions,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appJson from "../app.json";

const { height } = Dimensions.get("window");

const UpdateModal = () => {
  const [visible, setVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const STORAGE_KEY = "@update_dismissed_time";

  useEffect(() => {
    checkVersion();

  }, []);


   
  
  const checkVersion = async () => {
    try {
      const res = await fetch("https://api.ajur.app/api/app-version");
      const data = await res.json();
      const currentVersion = appJson.version || "1.0.0";

      if (compareVersions(data.latest_version, currentVersion) > 0) {
        // For forced updates, always show regardless of dismissal time
        if (data.force_update) {
          setUpdateInfo(data);
          setVisible(true);
          showModal();
          return;
        }

        // For non-forced updates, check if user dismissed recently
        const dismissedTime = await AsyncStorage.getItem(STORAGE_KEY);
        if (dismissedTime) {
          const now = new Date().getTime();
          const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
          if (now - parseInt(dismissedTime) < threeDaysInMs) {
            return; // Don't show modal if dismissed within 3 days
          }
        }

        setUpdateInfo(data);
        setVisible(true);
        showModal();
      }
    } catch (err) {
      console.log("Update check failed:", err);
    }
  };

  const showModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const compareVersions = (v1, v2) => {
    const t = (v) => v.split(".").map(Number);
    const [a1, b1, c1] = t(v1);
    const [a2, b2, c2] = t(v2);
    if (a1 !== a2) return a1 - a2;
    if (b1 !== b2) return b1 - b2;
    return c1 - c2;
  };

  const handleDismiss = async () => {
    // Store current time when user dismisses (only for non-forced updates)
    if (!updateInfo?.force_update) {
      await AsyncStorage.setItem(STORAGE_KEY, new Date().getTime().toString());
    }
    closeModal();
  };

  const closeModal = () => {
    // Don't allow closing if it's a forced update
    if (updateInfo?.force_update) {
      return;
    }

    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  // PanResponder for swipe down to close (only for non-forced updates)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !updateInfo?.force_update,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (updateInfo?.force_update) return false;
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (updateInfo?.force_update) return;
        if (gestureState.dy > 0) { // Only allow dragging down
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (updateInfo?.force_update) return;
        if (gestureState.dy > 100) { // If dragged down more than 100 units, close modal
          handleDismiss();
        } else {
          // Return to original position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!updateInfo) return null;

  const isForcedUpdate = updateInfo.force_update;

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      onRequestClose={() => {
        // Prevent back button from closing modal on forced updates
        if (!isForcedUpdate) {
          handleDismiss();
        }
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            paddingBottom: 30,
          }}
        >
          {/* Grabber - Only show for non-forced updates */}
          {!isForcedUpdate && (
            <View 
              style={{ 
                alignItems: "center", 
                marginBottom: 10,
              }}
              {...panResponder.panHandlers}
            >
              <View
                style={{
                  width: 40,
                  height: 5,
                  backgroundColor: "#ccc",
                  borderRadius: 3,
                }}
              />
            </View>
          )}

          {/* Forced Update Indicator */}
          {/* {isForcedUpdate && (
            <View style={{ alignItems: "center", marginBottom: 15 }}>
              <Text style={{ 
                color: "#ff3b30", 
                fontWeight: "bold", 
                fontSize: 16,
                textAlign: "center"
              }}>
                ⚠️ به روز رسانی اجباری
              </Text>
              <Text style={{ 
                color: "#666", 
                fontSize: 14,
                textAlign: "center",
                marginTop: 5
              }}>
                برای ادامه استفاده از برنامه، باید نسخه جدید را نصب کنید
              </Text>
            </View>
          )} */}

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 15 }}>
            <Image
              source={require("./assets/intro/ajour-logo.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {updateInfo.title}
          </Text>

          <Text
            style={{
              color: 'gray',
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {updateInfo.motto}
          </Text>

          {/* Changelog */}
          {updateInfo.changelog.map((item, i) => (
            <Text
              key={i}
              style={{ textAlign: "right", marginVertical: 2, fontSize: 14 }}
            >
              • {item}
            </Text>
          ))}

          {/* Buttons Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: isForcedUpdate ? "space-around" : "space-between",
              marginTop: 25,
              paddingHorizontal: 10,
            }}
          >
            {/* Bazar */}
            <TouchableOpacity
              onPress={() => Linking.openURL(updateInfo.links.bazar)}
              style={{ alignItems: "center", width: 70 }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Image
                  source={require("./assets/bazzar-128.png")}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ fontSize: 13, color: "#000" }}>بازار</Text>
            </TouchableOpacity>

            {/* Myket */}
            {/* <TouchableOpacity
              onPress={() => Linking.openURL(updateInfo.links.myket)}
              style={{ alignItems: "center", width: 70 }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Image
                  source={require("./assets/myket-128.png")}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ fontSize: 13, color: "#000" }}>مایکت</Text>
            </TouchableOpacity> */}

            {/* Direct */}
            <TouchableOpacity
              onPress={() => Linking.openURL(updateInfo.links.direct)}
              style={{ alignItems: "center", width: 70 }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Image
                  source={require("./assets/android-128.png")}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ fontSize: 13, color: "#000" }}>مستقیم</Text>
            </TouchableOpacity>

            {/* Not Now Button - Only show for non-forced updates */}
            {!isForcedUpdate && (
              <TouchableOpacity
                onPress={handleDismiss}
                style={{ alignItems: "center", width: 70 }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: "#000",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 20, color: "#000" }}>×</Text>
                </View>
                <Text style={{ fontSize: 13, color: "#000" }}>الان نه</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Additional message for forced updates */}
          {isForcedUpdate && (
            <Text style={{
              textAlign: "center",
              color: "#ff3b30",
              fontSize: 12,
              marginTop: 15,
              fontStyle: "italic"
            }}>
              برنامه بدون به روز رسانی قابل استفاده نیست
            </Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UpdateModal;