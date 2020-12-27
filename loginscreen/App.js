import React, {Component} from 'react';
import {StyleSheet, Linking, Platform, Alert, BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LogIn from './login';
import MapApp from './MapApp';
import DetailScreen from './DetailScreen';

const Stack = createStackNavigator();

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={LogIn}>
          <Stack.Screen
            name="Login"
            component={LogIn}
            options={{
              header: () => null,
            }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              header: () => null,
            }}
          />
          <Stack.Screen
            name="Map"
            component={MapApp}
            options={{
              header: () => null,
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
