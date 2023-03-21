import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mydomain.superpowers',
  appName: 'superpowers',
  webDir: 'dist/superpowers',
  ios: { contentInset: 'always'},
  bundledWebRuntime: false
};

export default config;
