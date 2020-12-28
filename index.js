/**
 * @format
 */
import * as React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NavigationContainer} from '@react-navigation/native';

export const theme = {
  ...DarkTheme,
  mode: 'exact',
  colors: {
    ...DarkTheme.colors,
    primary: '#5d4037',
    accent: '#616161',
    text: '#FFFFFF',
    surface: '#424242',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
  },
};

export default function Main(props) {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
if (!__DEV__) {
  global.console.log = () => {};
  global.console.warn = () => {};
  global.console.error = () => {};
}
LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => Main);
