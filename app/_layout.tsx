import { Stack } from "expo-router";
import React from "react";
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from "@expo-google-fonts/poppins";
import { ThemeProvider } from "./providers/ThemeProviders";
import { ActivityIndicator, View } from "react-native";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/create-account" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/OTPVerification" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgotPasswordVerificationScreen" options={{ headerShown: false }} />
        <Stack.Screen name="auth/success" options={{ headerShown: false }} />
        <Stack.Screen name="auth/reset-success" options={{ headerShown: false }} />
        <Stack.Screen name="post-account/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="protected/Home/home" options={{ headerShown: false }} />
         <Stack.Screen name="protected/Home/trockler-profile" options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard/dashboard" options={{ headerShown: false  }} />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
