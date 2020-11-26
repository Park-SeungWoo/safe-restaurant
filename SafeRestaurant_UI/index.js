import { Navigation } from "react-native-navigation";
import React, { Component, useRef, useState, useEffect } from 'react';
import { View, StatusBar, Button, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Dimensions } from 'react-native';
import { HeaderSearchBar, HeaderClassicSearchBar } from "react-native-header-search-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RBSheet from "react-native-raw-bottom-sheet";
import {spinnerVisibility} from 'react-native-spinkit';
import ReviewModal from "react-native-review-modal";
import { gestureHandlerRootHOC, TextInput } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import Kakaologins from '@react-native-seoul/kakao-login';
import MapApp, { SeletetedToMain } from './MapApp';
import LoginScreenStyle from "./LoginScreen.style";
import TextArea from "@freakycoder/react-native-text-area";
import { withTheme } from "react-native-elements";
const react_native_helpers = require("@freakycoder/react-native-helpers");
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'
import RestDetail from './RestDetail';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

const LogInScreen = (props) => {
  // const [userlocal, setUserlocal] = useState({
  //   token: '',
  //   nickname:'',
  // });
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState(0);
  const [nickname, setNickname] = useState('');
  const [update, setUpdate] = useState('');


  useEffect(() => {
    AsyncStorage.getItem('clientEmail', (err, result) => {
      if(result){ 
        console.log("email", result);
        let option = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({
            _email:result,
          })
        };
        fetch(
          `http://220.68.233.99/users/account`, option
        )
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          _KakaoLogin();
          if(json === 1) {
            console.log("계정 있음: ",json);
            _changecomponentMain();
          }
          else {
            console.log("계정 없음: ",json);       
          }
        });
      }
      else console.log("확ㅋㅋㅋ인: ", token);
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
    console.log(`signup  Nickname : ${nickname}\n`);
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
        `http://220.68.233.99/users/signup`, option
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if(json === 1) {
            console.log("계정 생성 성공: ",json);
            AsyncStorage.setItem('clientEmail', email);
            _changecomponentMain()
          }
          else {
            console.log("계정 생성 실패: ",json);
          }
        });
    });
  }

  const tokenUpdate = (uptoken) => {
    Kakaologins.getProfile()
    .then((res_k) => {
    let option = {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
          _email:res_k.email,
          _token:uptoken,
      })
  };
    fetch(
      `http://220.68.233.99/users/tokenupdate`, option
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if(json === 1) {
          console.log("token update");
        }
        else {
          console.log("token update faild");
        }
      });
    });
    }

  const accountconfirm = (uptoken) => {
    Kakaologins.getProfile()
    .then((res_k) => {
      console.log("res_k.email", res_k.email);
      console.log("accountconfirm 입장!", email);
      let option = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
          _email:res_k.email,
        })
      };
      fetch(
        `http://220.68.233.99/users/account`, option
      )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if(json === 1) {
          console.log("계정 있음: ",json);
          tokenUpdate(uptoken);
          _changecomponentMain();
        }
        else {
          console.log("계정 없음: ",json);     
          setAccount(1)    
        }
      });
    });
  }

  const _KakaoLogin = () => {
    Kakaologins.login()
      .then((res) => {
        console.log(`Tocken : ${res.accessToken}\n`);
        setToken(res.accessToken);
        console.log("왜 안들어와ㅜㅜ", token);
        console.log("이메일 확인 중 : ", email);
        accountconfirm(res.accessToken);
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
              {account ? (
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
              ):
              (
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
  let lat = 126.9502641;
  let long = 37.3468471;
  let isDetailOpened = false;
  return (
      <SafeAreaProvider>
        <View>
          <MapApp lat={lat} long={long}/>
        </View>
      </SafeAreaProvider>
  );
}
MainScreen.options = {
  topBar: {
    height: 0,
  }
}

Navigation.registerComponent('Main', () => MainScreen);
Navigation.registerComponent('LogIn', () => LogInScreen);

Navigation.events().registerAppLaunchedListener( async () => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
              name: 'LogIn'
              //name: 'Main'
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
  },
  main: {
    flex: 1,
    // height: pheight,
    // display: 'flex',
  },
  logout: {
    ...Platform.select({
      ios: {
        height: 90,
        shadowOffset: {
          height: 5,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        paddingTop: 30,
      },
      android: {
        height: 60,
        elevation: 15,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#BCCDF7',
    flexDirection: 'row',
    zIndex: 1,
  },
  backimg: {
    width: 30,
    height: 30,
  },
  logoutbtn: {
    margin: 10,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  restname: {
    flex: 1,
    width: pwidth,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        height: 90,
        paddingTop: 40,
      },
      android: {
        height: 60,
      },
    }),
  },
  restnametxt: {
    fontSize: 20,
  },
  map: {
    width: pwidth,
    height: pheight / 3,
  },
  detailscreen: {
    backgroundColor: '#f5f5f5',
    width: pwidth,
    ...Platform.select({
      ios: {
        paddingBottom: pheight - 30,
      },
      android: {
        paddingBottom: pheight,
      },
    }),
  },
  mapdetail: {
    width: pwidth,
    height: pheight / 3,
  },
  restdetail: {
    height: pheight / 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    marginHorizontal: 10,
  },
  name: {
    justifyContent: 'center',
    flex: 1,
  },
  restaddr: {
    flex: 1,
  },
  telnum: {
    flex: 1,
  },
  kakaolink: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  kakaolinkimg: {
    width: pwidth / 2,
    height: 45,
  },

  // 리뷰 아이템들 horizontal flatlist
  reviewscreen: {
    height: pheight / 3 + 10,
    paddingVertical: 10,
  },
  reviewview: {
    flex: 1,
  },
  reviewdatas: {
    width: pwidth - 30,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    margin: 5,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  reviewtop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#d1d1d188',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  reviewcontent: {
    padding: 10,
  },
  nicknametxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 30,
  },

  // modal(review)

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    width: pwidth - 40,
    height: pheight / 3,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitbtn: {
    backgroundColor: '#d3a3c3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  ratingbtn: {
    margin: 5,
  },
  ratingcontentinput: {
    padding: 5,
    textAlignVertical: 'top',
  },
  modaltopleft: {
    flexDirection: 'row',
  },

  // 모달창 내에서 rating점수를 등록하기 위한 바텀시트
  reviewbsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#818181aa',
  },
  reviewbsRating: {
    flexDirection: 'row',
  },
  ratingPicker: {
    width: pwidth,
    height: 400,
    alignItems: 'center',
  },
  reviewdone: {
    margin: 5,
    borderWidth: 1,
  },
});

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
