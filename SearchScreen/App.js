import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar
} from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default class App extends Component {
  render() {
    return (
        <SafeAreaProvider>
          <View>
            <StatusBar barStyle="dark-content" />
            <HeaderClassicSearchBar onChangeText={text => console.log(text)}/>
            
          </View>
        </SafeAreaProvider>
    );
  }
}