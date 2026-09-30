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
} from "react-native";
import appJson from "../app.json";

const { height } = Dimensions.get("window");

const UpdateModal = () => {
  const [visible, setVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      const res = await fetch("https://api.ajur.app/api/app-version");
      const data = await res.json();
      const currentVersion = appJson.version || "1.0.0";

      if (compareVersions(data.latest_version, currentVersion) > 0) {
        setUpdateInfo(data);
        setVisible(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    } catch (err) {
      console.log("Update check failed:", err);
    }
  };

  const compareVersions = (v1, v2) => {
    const t = (v) => v.split(".").map(Number);
    const [a1, b1, c1] = t(v1);
    const [a2, b2, c2] = t(v2);
    if (a1 !== a2) return a1 - a2;
    if (b1 !== b2) return b1 - b2;
    return c1 - c2;
  };

  if (!updateInfo) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
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
              color:'gray',
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
              justifyContent: "space-between",
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
            <TouchableOpacity
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
            </TouchableOpacity>

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

            {/* Not Now */}
            {!updateInfo.force_update && (
              <TouchableOpacity
                onPress={() => setVisible(false)}
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
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
