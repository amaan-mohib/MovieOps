/**
 * @format
 * @flow strict-local
 */

import NetInfo from '@react-native-community/netinfo';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {Title} from 'react-native-paper';
import RecieveSahringIntent from 'react-native-receive-sharing-intent';
import SplashScreen from 'react-native-splash-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotFound from './assets/undraw_not_found_60pq.svg';
import {theme} from './index';
import MoviesRoute from './Movie';
import MusicRoute from './Music';
import {isMountedRef, navigate, navigationRef} from './RootNavigation';
import Settings from './Settings';
import ShareScr from './ShareScr';
import Story from './Story';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const NoNet = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <NotFound width={'50%'} height={200} />
      <Title>Please, check your internet connection</Title>
    </View>
  );
};
const BottomNavStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Movies"
      shifting={true}
      barStyle={{backgroundColor: '#5d4037'}}>
      <Tab.Screen
        name="Movies"
        component={MoviesRoute}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="movie" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Music"
        component={MusicRoute}
        options={{
          tabBarLabel: 'Music',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="music-note" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  // const [url, setUrl] = useState(null);
  //const [no, setNo] = useState(0);

  useEffect(() => {
    SplashScreen.hide();
    isMountedRef.current = true;
    NetInfo.configure({
      reachabilityUrl: 'https://clients3.google.com/generate_204',
      reachabilityTest: async (response) => response.status === 204,
      reachabilityLongTimeout: 60 * 1000, // 60s
      reachabilityShortTimeout: 5 * 1000, // 5s
      reachabilityRequestTimeout: 15 * 1000, // 15s
    });
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log(
        'Is connected?',
        state.isConnected,
        state.isInternetReachable,
      );
      if (!(state.isConnected && state.isInternetReachable)) navigate('NoNet');
      else navigate('Main');
    });
    RecieveSahringIntent.getReceivedFiles(
      (files) => {
        console.log(files[0]);
        //setUrl(files[0].weblink || files[0].text);
        let url = files[0].weblink || files[0].text;
        if (url) {
          navigate('Main');
          setTimeout(() => {
            navigate('ShareModal', {url: url});
          }, 100);
        }
      },
      (error) => {
        console.error(error);
      },
    );
    // // RNRestart.Restart();
    return () => {
      RecieveSahringIntent.clearReceivedFiles();
      unsubscribe();
      isMountedRef.current = false;
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Main"
          component={BottomNavStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ShareModal"
          component={ShareScr}
          options={{title: 'Select', headerStyle: {backgroundColor: '#5d4037'}}}
        />
        <Stack.Screen
          name="NoNet"
          component={NoNet}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Story"
          component={Story}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
