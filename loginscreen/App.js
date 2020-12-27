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
  state = {
    isalreadylogin: false,
    Linked: false,
    userloginjson: null,
    URLitem: null,
    lat: 10,
    long: 10,
  };

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const {
      isalreadylogin,
      Linked,
      userloginjson,
      lat,
      long,
      URLitem,
    } = this.state;
    return (
      // <SafeAreaProvider>
      //   {Linked ? (
      //     <DetailScreen item={URLitem} user={userloginjson} />
      //   ) : isalreadylogin ? (
      //     <MapApp lat={lat} long={long} user={userloginjson} />
      //   ) : (
      //     <LogIn />
      //   )}
      // </SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={LogIn}>
          <Stack.Screen name="Login" component={LogIn} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Map" component={MapApp} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
