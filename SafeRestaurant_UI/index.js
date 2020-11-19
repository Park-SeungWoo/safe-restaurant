import { Navigation } from "react-native-navigation";
import React, { Component, useRef } from 'react';
import { View, StatusBar, Button, Text, Image, TouchableOpacity } from 'react-native';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar
} from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RBSheet from "react-native-raw-bottom-sheet";
import LoginScreen from 'react-native-login-screen';
import {spinnerVisibility} from 'react-native-spinkit';
import ReviewModal from "react-native-review-modal";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import MapApp from './MapApp';

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
  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  let lat = 126.9502641;
  let long = 37.3468471;

  return (
      <SafeAreaProvider>
        <View>
          <StatusBar barStyle="dark-content" />
          <HeaderClassicSearchBar onChangeText={text => console.log(text)}/>
          <MapApp lat={lat} long={long} LtoM={props}/>
        </View>
        {/* <TouchableOpacity onPress={onOpen}>
          <Text>Open the modal</Text>
        </TouchableOpacity>
        <Modalize ref={modalizeRef}>
          <Text>Opened modal</Text>
        </Modalize> */}
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
      <Button title='review' onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'Review',
            options: {
              topBar: {
                title: {
                  text: 'Review'
                }
              }
            }
          }
        })}/>
    </View>
  );
}

const ReviewPopUp = (props) => {
  let starCount = 5;
  const onStarRatingPress = (rating) => {
      starCount = rating;
  }
  return (
    <ReviewModal
      starRating={starCount}
      onStarRatingPress={rating => {
        onStarRatingPress(rating);
      }}
    />
  );
}

const bottom = () => {
  
};

Navigation.registerComponent('Main', () => MainScreen);
Navigation.registerComponent('Detail', () => DetailScreen);
Navigation.registerComponent('LogIn', () => LogInScreen);
Navigation.registerComponent('Review', () => ReviewPopUp);
Navigation.registerComponent('com.myApp.WelcomeScreen', () => gestureHandlerRootHOC(App));

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
