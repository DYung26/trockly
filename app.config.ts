import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config } : ConfigContext): ExpoConfig => ({
   ...config,
   name: 'trockly',
   slug: 'trockly',
   version: '1.0.0',
   plugins: [
     ...(config.plugins || []),
     'expo-web-browser',
   ],
   extra: {
    ...config.extra,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
   }
});