import { Navigation } from "react-native-navigation";
import React, { Component, useRef, useState, useEffect } from 'react';
import { View, StatusBar, Button, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { HeaderSearchBar, HeaderClassicSearchBar } from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RBSheet from "react-native-raw-bottom-sheet";
import {spinnerVisibility} from 'react-native-spinkit';
import ReviewModal from "react-native-review-modal";
import { gestureHandlerRootHOC, TextInput } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import Kakaologins from '@react-native-seoul/kakao-login';
import MapApp from './MapApp';
import LoginScreenStyle from "./LoginScreen.style";
import TextArea from "@freakycoder/react-native-text-area";
import { withTheme } from "react-native-elements";
const react_native_helpers = require("@freakycoder/react-native-helpers");
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'


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
      <View style={{top: 25, alignItems: 'center', justifyContent: 'center',}}>
        <Image style={{ height: react_native_helpers.ScreenWidth * 0.66, width: react_native_helpers.ScreenWidth * 0.66, }} source={require('./logo.png')} resizeMode={'contain'}/>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={react_native_helpers.ScreenHeight * 0.26}>
        <View style={{ top: 25, alignItems: 'center', justifyContent: 'center', }}>
          <View style={styles.footer}>
            <View style={{flexDirection: 'column'}}>
              {token ? (
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
                  <TextInput style={{ height: 40, width: 200, borderColor: 'gray', backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 1 }} value={nickname} maxLength={20} multiline={true} onChangeText={(usernick)=>{
                      setNickname(usernick);
                    }}/>
                  </View>
                  <TouchableOpacity style={styles.loginButton} onPress={_signUp}>
                    <Text style={{color:"#3c1e1e"}}> Create Account </Text>
                  </TouchableOpacity>
                </View>
              ):(
                <View>
                  <View style={{ flex: 0.8, marginTop: 20 }}>
                    <Text style={styles.textStyle}>
                      <Icon name="checkmark" size={20} color="#ff5555"/>
                      음식 덜어먹기
                    </Text>
                    <Text style={styles.textStyle}>
                      <Icon name="checkmark" size={20} color="#ff5555"/>
                      위생적 수저 관리
                    </Text>
                    <Text style={styles.textStyle}>
                      <Icon name="checkmark" size={20} color="#ff5555"/>
                      종사자 마스크 쓰기
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.loginButton} onPress={_KakaoLogin}>
                    <Text style={{color:"#3c1e1e"}}> Login with kakaotalk </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View style={{ position: 'relative', alignSelf: 'center', marginTop: 64, }}>
            <Text style={{color: 'white', fontSize: 30}}></Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  loginButton: {
    marginTop: 20,
    backgroundColor: "#fae100",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 20,
    color: "white",
  },
  footer: {
    width: react_native_helpers.ScreenWidth * 0.9,
    height: react_native_helpers.ScreenWidth * 0.6,

    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: react_native_helpers.ScreenHeight * 0.25,

    backgroundColor: "rgba(150,150,150,0.3)",
  }
});

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
