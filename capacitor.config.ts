import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.quickeye.find",
  appName: "Quike Eye",
  webDir: ".output/public",
  server: {
    // Live site is loaded directly, so the app always shows the latest
    // version and the backend (login, database, live location) works.
    url: "https://eye.socilet.in",
    androidScheme: "https",
    cleartext: false,
    allowNavigation: ["eye.socilet.in", "*.socilet.in", "*.supabase.co", "*.lovable.app"],
  },
  android: {
    backgroundColor: "#071A16",
  },
};

export default config;
