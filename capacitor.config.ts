import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aapearce.geofun',
  appName: 'GeoFun',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
