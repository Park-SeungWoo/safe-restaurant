import { Navigation } from "react-native-navigation";
import React, { Component } from 'react';
import { View, StatusBar, Button, Text, Image } from 'react-native';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar
} from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RBSheet from "react-native-raw-bottom-sheet";
import LoginScreen from 'react-native-login-screen';
import {spinnerVisibility} from 'react-native-spinkit';

const LogInScreen = (props) => {
  const renderLogo = () => (
    <View
      style={{
        top: 25,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        resizeMode="contain"
        source={require('./logo.png')}
        style={{height: 250, width: 250}}
      />
    </View>
  );
  return(
    <View>
      <LoginScreen
        source={require('./safeRestaurant.png')}
        spinnerEnable
        spinnerVisibility={spinnerVisibility}
        labelTextStyle={{
          color: '#adadad',
          fontFamily: 'Now-Bold',
        }}
        logoComponent={renderLogo()}
        logoTextStyle={{
          fontSize: 27,
          color: '#fdfdfd',
          fontFamily: 'Now-Black',
        }}
        loginButtonTextStyle={{
          color: '#fdfdfd',
          fontFamily: 'Now-Bold',
        }}
        textStyle={{
          color: '#757575',
          fontFamily: 'Now-Regular',
        }}
        signupStyle={{
          color: '#fdfdfd',
          fontFamily: 'Now-Bold',
        }}
        emailOnChangeText={(username) => console.log('addr: ', username)}
        onPressSettings={this._KakaoLogin}
        passwordOnChangeText={(password) =>
          console.log('Password: ', password)
        }
        onPressLogin={() => Navigation.push(props.componentId, {
          component: {
            name: 'Main',
            options: {
              topBar: {
                title: {
                  text: 'Main'
                }
              }
            }
          }
        })}
        onPressSignup={() => {
          console.log('onPressSignUp is pressed');
        }}>
        <View
          style={{
            position: 'relative',
            alignSelf: 'center',
            marginTop: 64,
          }}>
          <Text style={{color: 'white', fontSize: 30}}></Text>
        </View>
      </LoginScreen>
    </View>
  );
}
LogInScreen.options = {
  topBar: {
    height: 0,
  }
}

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
Navigation.registerComponent('LogIn', () => LogInScreen);


Navigation.events().registerAppLaunchedListener( async () => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: 'LogIn'
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
