import { Navigation } from "react-native-navigation";
import React, { Component, useRef, useState, useEffect } from 'react';
import { View, StatusBar, Button, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar
} from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RBSheet from "react-native-raw-bottom-sheet";
import {spinnerVisibility} from 'react-native-spinkit';
import ReviewModal from "react-native-review-modal";
import { gestureHandlerRootHOC, TextInput } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import Kakaologins from '@react-native-seoul/kakao-login';
import MapApp from './MapApp';
import LoginScreenStyle from "./LoginScreen.style";
import CardStyle from "./Card.style";
import TextArea from "@freakycoder/react-native-text-area";
import { withTheme } from "react-native-elements";
const react_native_helpers = require("@freakycoder/react-native-helpers");
import AsyncStorage from '@react-native-community/async-storage';


const LogInScreen = (props) => {
  // const [userlocal, setUserlocal] = useState({
  //   token: '',
  //   nickname:'',
  // });
  const [token, setToken] = useState('');
  const [nickname, setNickname] = useState('');


  useEffect(() => {
    AsyncStorage.getItem('clientToken', (err, result) => {
      if(result){ 
        setToken(result)
        accountconfirm();
      }
      console.log("확ㅋㅋㅋ인: ", token);
    });  
  },[])

  const _changecomponentMain = () => Navigation.push(props.componentId, {
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
  })

  
  const _signUp = () =>{
    console.log(`signup  Tocken : ${token}\n`);
    // Kakaologins.unlink()
    // .then(res => {
    //   console.log(res);
    // }).catch(err => {
    //   console.log(err)
    // })
    Kakaologins.getProfile().then((res_k) => {
      console.log(`Tocken : ${token}\nnickname : ${nickname}\n${JSON.stringify(res_k)}`);
      let option = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            _token: token,
            _name:res_k.nickname,
            _email:res_k.email,
            _age_range:res_k.age_range,
            _nickname:nickname,
        })
    };
    console.log("생성 계정 확인: ", option.body);
      fetch(
        `http://220.68.233.127/users/signup`, option
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if(json === 1) {
            console.log("계정 생성 성공: ",json);
            AsyncStorage.setItem('clientToken', token);
            _changecomponentMain()
          }
          else {
            console.log("계정 생성 실패: ",json);
          }
        });
    });
  }

  const accountconfirm = () => {
    let option = {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
          token:token,
      })
  };
    fetch(
      `http://220.68.233.127/users/account`, option
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if(json === 1) {
          console.log("계정 있음: ",json);
          _changecomponentMain()
        }
        else {
          console.log("계정 없음: ",json);
        }
      });
  }
  const _KakaoLogin = () => {
    Kakaologins.login()
      .then((res) => {
        console.log(`Tocken : ${res.accessToken}\n`);
        let temp = res.accessToken;
        setToken(res.accessToken);
        console.log("왜 안들어와ㅜㅜ", token);
        accountconfirm()
      })
      .catch((err) => {
        console.log('login failed');
        console.log(err);
      });
  }
  return(
    <View>
        <Image source={require('./safeRestaurant.png')} style={LoginScreenStyle.imageBackgroundStyle}/>
        <View
          style={{
            top: 25,
            alignItems: 'center',
            justifyContent: 'center',

          }}>
          <View>
            <Image
              style={{
                height: 250, 
                width: 250
              }}
                        
              source={require('./logo.png')}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.footer}>
            <View style={{flexDirection: 'column'}}>
              {token ? (
                <View>
                <View style={{flexDirection: 'row'}}>
                <TextInput style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }} value={nickname} onChangeText={(usernick)=>{
                    setNickname(usernick);
                  }}/>
                
                </View>
                <Button title="Create Account"style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                          onPress={_signUp}
                  />
                </View>
              ):(
                <View>
                <Text>
                  1. 음식 덜어먹기
                </Text>
                <Text>
                  2. 위생적 수저 관리
                </Text>
                <Text>
                  3. 종사자 마스크 쓰기
                </Text>
                <Button title="Login with kakaotalk"style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                          onPress={_KakaoLogin}
                  />
              </View>
              )}
              
            </View>
          </View>

        <View style={{ position: 'relative', alignSelf: 'center', marginTop: 64, }}>
                    
        {/* onPress={_signUp}
        onPress={_changecomponentMain}
        onPress={_KakaoLogin} 
        onChangeText={text => onChangeText(text)} value={this.nickname} */}
        <Text style={{color: 'white', fontSize: 30}}></Text>
        </View>
      </View>
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

const styles = StyleSheet.create({
  footer: {
    width: react_native_helpers.ScreenWidth - 30,
    height: react_native_helpers.ScreenWidth * 0.8,

    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 30
  }
});

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
