import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Stack } from "expo-router";
import "../global.css";
import { getUser } from "../lib/authStorage";
import storage from "../lib/storage";
import { useAuthStore } from "../store/auth";


export default function RootLayout() {
  const { setUser, setToken, setLoading } = useAuthStore();
  const { setColorScheme } = useColorScheme();
  
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize Theme
        const savedTheme = await storage.getItem('theme_preference');

        if (savedTheme) {
          setColorScheme(savedTheme as 'light' | 'dark' | 'system');
        }

        // Initialize Auth
        const { user, token } = await getUser();
        
        if (user && token) {
          setUser(user);
          setToken(token);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [setUser, setToken, setLoading, setColorScheme]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}
