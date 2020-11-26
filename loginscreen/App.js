import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LogIn from './login';

export default class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <LogIn />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
