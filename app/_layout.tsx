import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from "@expo-google-fonts/poppins";
import { ThemeProvider } from "./providers/ThemeProviders";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "./store/auth.store";
import Toast from "react-native-toast-message";
import { checkOnboardingStatus } from "./hooks/userProfile";
import { QueryProvider } from "./providers/queryProvider";




// CHANGE AuthInitializer to this
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const loadAuthData = useAuthStore((s) => s.loadAuthData);
  const clearAuthData = useAuthStore((s) => s.clearAuthData)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  useEffect(() => { 
    useAuthStore.setState({ isLoading: false });
  // clearAuthData();
   // loadAuthData(); 
  }, []);
  
 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3247D5' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <>{children}</>;
}


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
     <QueryProvider>
        <AuthInitializer>
          <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/create-account" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/OTPVerification" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="auth/reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="offer/create-offer" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgotPasswordVerificationScreen" options={{ headerShown: false }} />
        <Stack.Screen name="auth/success" options={{ headerShown: false }} />
        <Stack.Screen name="auth/reset-success" options={{ headerShown: false }} />
        <Stack.Screen name="post-account/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="protected/Home/home" options={{ headerShown: false }} />
         <Stack.Screen name="protected/Home/trockler-profile" options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard/dashboard" options={{ headerShown: false  }} />
      </Stack>
       <Toast />
     </AuthInitializer>
     </QueryProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
