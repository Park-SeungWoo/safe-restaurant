import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import LogIn from './login';

export default class App extends Component {
  render() {
    return (
      <View style={styles.main}>
        <LogIn />
        <StatusBar hidden={false} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
