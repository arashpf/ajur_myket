import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
} from "react-native";
import { Input, Button, Text, Box, useToast } from "native-base";
import axios from "axios";
import Spinner from "react-native-spinkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    const iranMobileRegex = /^09[0-9]{9}$/;
    setIsValidPhone(iranMobileRegex.test(phone));
  }, [phone]);

  const showToast = (message, type) => {
    const colors = {
      success: "green.700",
      error: "red.700",
      warning: "orange.700",
    };

    toast.show({
      render: () => (
        <Box bg={colors[type]} px="15" py="3" rounded="md" mb={5}>
          <Text style={{ color: "white", fontSize: 16 }}>{message}</Text>
        </Box>
      ),
      placement: "top",
      duration: 3000,
    });
  };

  const handlePhoneSubmit = () => {
    Keyboard.dismiss();

    if (!isValidPhone) {
      showToast("فرمت شماره موبایل معتبر نیست (مثال: 09123456789)", "warning");
      return;
    }

    setConfirmModalVisible(true);
  };

  const sendVerificationCode = async () => {
    try {
      setConfirmModalVisible(false);
      setIsLoading(true);

      await AsyncStorage.setItem("cellphone", phone);

      const response = await axios.post("https://api.ajur.app/auth/register", {
        phone: phone,
      });

      if (response.data) {
        showToast("کد تایید به شماره شما ارسال شد", "success");
        navigation.navigate("Rvalidation", { phone: phone });
      } else {
        showToast("خطا در ارسال کد تایید", "error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.loginBackground}
          source={require("../assets/images/realstate-login.jpg")}
          resizeMode="cover"
        >
          <View style={styles.overlay} />

          <View style={styles.contentContainer}>
            <Box style={styles.headerBox}>
              <Text style={styles.titleText}>به آجر خوش آمدید</Text>
              <Text style={styles.subtitleText}>
                لطفا برای ورود شماره موبایل خود را وارد کنید
              </Text>
            </Box>

            <Box style={styles.formBox}>
              <Input
                autoFocus={true}
                placeholder="09123456789"
                placeholderTextColor="#999"
                returnKeyType="done"
                keyboardType="phone-pad"
                maxLength={11}
                value={phone}
                onChangeText={setPhone}
                onSubmitEditing={handlePhoneSubmit}
                style={styles.formInput}
                variant="filled"
                size="lg"
              />
            </Box>

            {isLoading ? (
              <View style={styles.spinnerView}>
                <Spinner
                  isVisible={true}
                  size={50}
                  type="Circle"
                  color="#a92b31"
                />
              </View>
            ) : (
              <Button
                full
                style={[
                  styles.submitButton,
                  !isValidPhone && styles.disabledButton,
                ]}
                onPress={handlePhoneSubmit}
                disabled={!isValidPhone || isLoading}
              >
                <Text style={styles.buttonText}>دریافت کد تایید</Text>
              </Button>
            )}
          </View>

          <Modal
            transparent
            visible={confirmModalVisible}
            animationType="fade"
            onRequestClose={() => setConfirmModalVisible(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>تایید شماره موبایل</Text>

                <Text style={styles.modalText}>
                  کد تایید به شماره{" "}
                  <Text style={styles.modalPhone}>{phone}</Text> ارسال میشود
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={sendVerificationCode}
                  >
                    <Text style={styles.modalButtonText}>تایید</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalButton, styles.changeButton]}
                    onPress={() => setConfirmModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>تغییر شماره</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginBackground: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  headerBox: {
    width: "90%",
    marginBottom: 30,
    alignItems: "center",
    paddingTop: 10,
  },
  titleText: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 34,
  },
  subtitleText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formBox: {
    width: "90%",
    marginBottom: 20,
  },
  formInput: {
    backgroundColor: "white",
    fontSize: 18,
    textAlign: "left",
    writingDirection: "ltr",
    paddingHorizontal: 16,
    height: 60,
    borderRadius: 12,
  },
  submitButton: {
    width: "90%",
    borderRadius: 12,
    backgroundColor: "#a92b31",
    height: 52,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    fontFamily: "IRAN Sans",
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  spinnerView: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 14,
  },
  modalText: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 24,
  },
  modalPhone: {
    fontWeight: "bold",
    color: "#a92b31",
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 22,
  },
  modalButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#a92b31",
    marginRight: 8,
  },
  changeButton: {
    backgroundColor: "#6c757d",
    marginLeft: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Login;
