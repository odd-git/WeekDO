import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "com.lovable.app",
  "appName": "YourAppName",
  "webDir": "www",
  server: {
    url: 'https://8fe6d62b-2e9e-4181-af0b-216fc24de5ea.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
