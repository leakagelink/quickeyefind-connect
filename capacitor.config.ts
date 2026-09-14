import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.quickeye.find",
  appName: "Quike Eye",
  webDir: ".output/public",
  server: {
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#071A16",
  },
};

export default config;
