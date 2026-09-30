import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import { Button, HStack, Box, useToast } from "native-base";
import axios from "axios";
import Spinner from "react-native-spinkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import messaging from "@react-native-firebase/messaging";

const OTP_LENGTH = 5;

const Validation = ({ route, navigation }) => {
  const toast = useToast();
  const { phone } = route.params;

  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState(null);

  const digitsRef = useRef(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  const isVerifyingRef = useRef(false);
  const autoVerifyLockRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          setDeviceToken(fcmToken);
        }
      } catch (error) {
        console.log("FCM token error:", error);
      }
    };

    getFCMToken();
  }, []);

  const showToast = (message, type = "error") => {
    const backgroundColors = {
      success: "#218739",
      error: "#b4232b",
      warning: "#c87900",
    };

    toast.show({
      placement: "top",
      duration: 2500,
      render: () => (
        <Box bg={backgroundColors[type]} px="15" py="3" rounded="md" mb={5}>
          <Text style={styles.toastText}>{message}</Text>
        </Box>
      ),
    });
  };

  const updateDigits = (nextDigits) => {
    const normalized = [...nextDigits];
    while (normalized.length < OTP_LENGTH) normalized.push("");
    normalized.length = OTP_LENGTH;

    digitsRef.current = normalized;
    setDigits(normalized);
  };

  const focusInput = (index) => {
    if (index < 0 || index >= OTP_LENGTH) return;

    setTimeout(() => {
      inputRefs.current[index]?.focus();
    }, 0);
  };

  const getCode = (arr = digitsRef.current) => arr.join("");

  const handleVerifyCode = async () => {
    const submittedCode = getCode();

    Keyboard.dismiss();

    if (submittedCode.length !== OTP_LENGTH) {
      showToast("کد تایید باید ۵ رقمی باشد", "warning");
      return;
    }

    if (isVerifyingRef.current) return;

    isVerifyingRef.current = true;
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.ajur.app/auth/verify",
        {
          phone: phone,
          code: submittedCode,
          device_Token: deviceToken,
          password: "ddr007",
        }
      );

      if (response.data.status === "success") {
        await AsyncStorage.multiSet([
          ["id_token", response.data.result.token],
          ["stars", JSON.stringify(response.data.stars)],
          ["name", JSON.stringify(response.data.user.name || "")],
        ]);

        showToast("با موفقیت وارد شدید", "success");

        navigation.reset({
          index: 1,
          routes: [{ name: "Base" }, { name: "Dashboard" }],
        });
      } else if (response.data.status === "useless") {
        showToast("کد وارد شده منقضی شده است", "warning");
      } else {
        showToast("کد وارد شده اشتباه میباشد", "error");
      }
    } catch (error) {
      console.log("Verification error:", error);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setIsLoading(false);
      isVerifyingRef.current = false;
      autoVerifyLockRef.current = false;
    }
  };

  const maybeAutoVerify = (nextDigits) => {
    const code = nextDigits.join("");
    if (code.length === OTP_LENGTH && !autoVerifyLockRef.current) {
      autoVerifyLockRef.current = true;
      setTimeout(() => {
        handleVerifyCode();
      }, 80);
    }
  };

  const handleChangeText = (index, value) => {
    const cleanValue = String(value).replace(/\D/g, "");

    // حذف
    if (cleanValue.length === 0) {
      const nextDigits = [...digitsRef.current];
      nextDigits[index] = "";
      updateDigits(nextDigits);
      return;
    }

    const nextDigits = [...digitsRef.current];

    // اگر کاربر بیشتر از یک رقم paste کرد
    if (cleanValue.length > 1) {
      let cursor = index;

      for (let i = 0; i < cleanValue.length && cursor < OTP_LENGTH; i++) {
        nextDigits[cursor] = cleanValue[i];
        cursor += 1;
      }

      updateDigits(nextDigits);

      const firstEmptyIndex = nextDigits.findIndex((d) => d === "");
      if (firstEmptyIndex !== -1) {
        focusInput(firstEmptyIndex);
      } else {
        Keyboard.dismiss();
        maybeAutoVerify(nextDigits);
      }

      return;
    }

    // تایپ معمولی یک رقم
    nextDigits[index] = cleanValue;
    updateDigits(nextDigits);

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    } else {
      Keyboard.dismiss();
      maybeAutoVerify(nextDigits);
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.nativeEvent.key !== "Backspace") return;

    const nextDigits = [...digitsRef.current];

    if (nextDigits[index]) {
      nextDigits[index] = "";
      updateDigits(nextDigits);
      return;
    }

    if (index > 0) {
      nextDigits[index - 1] = "";
      updateDigits(nextDigits);
      focusInput(index - 1);
    }
  };

  const isCodeComplete = digits.join("").length === OTP_LENGTH;

  const renderOtpInputs = () => (
    <View style={styles.otpRow}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digits[index]}
          onChangeText={(value) => handleChangeText(index, value)}
          onKeyPress={(event) => handleKeyPress(index, event)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textAlign="center"
          autoCorrect={false}
          autoCapitalize="none"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          importantForAutofill="yes"
          style={[
            styles.otpInput,
            digits[index] && styles.otpInputFilled,
          ]}
        />
      ))}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HStack
          px="5"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          style={styles.topHeader}
        >
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Icon name="arrow-back" style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>تایید اس ام اس</Text>

          <View style={styles.headerSpacer} />
        </HStack>

        <ImageBackground
          style={styles.loginBackground}
          source={require("../assets/images/realstate-login-2.jpg")}
          resizeMode="cover"
        >
          <View style={styles.overlay} />

          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.instructionText}>
                  کد ۵ رقمی ارسال شده به شماره{"\n"}
                  <Text style={styles.phoneText}>{phone}</Text>
                  {"\n"}
                  را وارد کنید
                </Text>

                {renderOtpInputs()}

                {isLoading ? (
                  <View style={styles.spinnerContainer}>
                    <Spinner isVisible size={30} type="Circle" color="#a92b31" />
                  </View>
                ) : (
                  <Button
                    onPress={handleVerifyCode}
                    isDisabled={!isCodeComplete}
                    style={[
                      styles.submitButton,
                      !isCodeComplete && styles.disabledSubmitButton,
                    ]}
                  >
                    <Text style={styles.submitButtonText}>تایید و ورود</Text>
                  </Button>
                )}

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.8}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>کد را دریافت نکرده‌اید؟</Text>
                  <Text style={styles.resendActionText}>ارسال مجدد کد / تغییر شماره</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeader: {
    height: 58,
    backgroundColor: "#fff",
  },
  backIcon: {
    color: "#111",
    fontSize: 24,
  },
  headerTitle: {
    color: "#555",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 24,
  },
  loginBackground: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 65,
    paddingBottom: 45,
  },
  contentContainer: {
    width: "91%",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  instructionText: {
    color: "#555",
    fontSize: 16,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 28,
  },
  phoneText: {
    color: "#a92b31",
    fontSize: 17,
    fontWeight: "bold",
  },
  otpRow: {
    width: "100%",
    flexDirection: "row",
    direction: "ltr",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  otpInput: {
    width: 52,
    height: 58,
    borderWidth: 1.5,
    borderColor: "#d7d7d7",
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    padding: 0,
  },
  otpInputFilled: {
    borderColor: "#a92b31",
  },
  submitButton: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    backgroundColor: "#a92b31",
    marginBottom: 18,
  },
  disabledSubmitButton: {
    backgroundColor: "#d3b1b5",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  spinnerContainer: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  resendButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  resendText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
  },
  resendActionText: {
    color: "#a92b31",
    fontSize: 15,
    fontWeight: "600",
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Validation;
