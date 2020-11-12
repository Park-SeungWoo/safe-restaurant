import { Navigation } from "react-native-navigation";
import React, { Component } from 'react';
import { View, StatusBar, Button, Text } from 'react-native';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar
} from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RBSheet from "react-native-raw-bottom-sheet";

const MainScreen = (props) => {
  return (
      <SafeAreaProvider>
        <View>
          <StatusBar barStyle="dark-content" />
          <HeaderClassicSearchBar onChangeText={text => console.log(text)}/>
        </View>
        <Button title="OPEN BOTTOM SHEET" onPress={() => this.RBSheet.open()} />
        <RBSheet
          ref={ref => { this.RBSheet = ref; }}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <Button title="" onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'Detail',
            options: {
              topBar: {
                title: {
                  text: 'Detail'
                }
              }
            }
          }
        })}/>
        </RBSheet>
      </SafeAreaProvider>
  );
}
MainScreen.options = {
  topBar: {
    height: 0,
  }
}

const DetailScreen = (props) => {
  return(
    <View>
      <Text>this is fucking DetailScreen</Text>
    </View>
  );
}

Navigation.registerComponent('Main', () => MainScreen);
Navigation.registerComponent('Detail', () => DetailScreen);

Navigation.events().registerAppLaunchedListener( async () => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: 'Main'
             }
           }
         ]
       }
     }
  });
});

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
