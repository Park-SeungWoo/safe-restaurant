// 앱이 처음 실행되면 기기 내에 저장된 kakao Tocken값이 있는지 확인하고 있으면 가져와서 우리 db에 저장된 토큰이랑 같은지 보고 같으면 바로 맵으로 넘어가고 다르면 로그인 페이지로 가기
// 로그인 페이지에서 카카오 로그인을 하면 나온 토큰값을 기기 스토리지에 저장하고 맵으로 넘어가기
// 맵에서 로그아웃 버튼을 누르면 기기 내에 저장된 토큰값 삭제, 카카오 로그아웃 및 연결도 끊기
// 링크를 타고 들어온 경우 토큰 확인 하고 넘어가기

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Linking,
} from 'react-native';
import MapApp from './MapApp';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from 'react-native-login-screen';
import {Input} from 'react-native-elements';
import {spinnerVisibility} from 'react-native-spinkit';
import Kakaologins from '@react-native-seoul/kakao-login';

let pwidth = Dimensions.get('window').width;

export default class LogIn extends Component {
  state = {
    isloggedin: false,
    lat: 126.9502641,
    long: 37.3468471,
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      //안드로이드는 아래와 같이 initialURL을 확인하고 navigate 합니다.
      Linking.getInitialURL().then((url) => {
        if (url) this.navigate(url); //
      });
    } else {
      //ios는 이벤트리스너를 mount/unmount 하여 url을 navigate 합니다.
      Linking.addEventListener('url', this.handleOpenURL);
    }
    this.GetPosition();
  }

  navigate = (url) => {
    console.log(url); // exampleapp://somepath?id=3
    const paths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
    if (paths.length > 1) {
      //파라미터가 있다
      const params = paths[1].split('&');
      let id;
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('='); // [0]: key, [1]:value
        if (param[0] === 'id') {
          id = Number(param[1]); //id=3
        }
      }
      //id 체크 후 상세페이지로 navigate 합니다.
      //id 로 서버에서 데이터 받아오고 그 값으로 바로 RestDetail호출
    }
  };

  GetPosition = () => {
    Geolocation.getCurrentPosition(
      (res) => {
        this.setState({
          lat: 126.9502641,
          long: 37.3468471,
        });
        // console.log(this.state.lat, this.state.long);
      },
      (error) => console.log(error),
    );
  };

  _KakaoLogin = () => {
    Kakaologins.login()
      .then((res) => {
        console.log(res.accessToken);
        this.setState({
          Tocken: res.accessToken,
        });
      })
      .catch((err) => {
        console.log('login failed');
        console.log(err);
      });
    Kakaologins.getProfile().then((res) => {
      console.log(JSON.stringify(res));
    });

    //연결 끊기(연결 끊고 다시 로그인 하고싶으면 이거 주석 해제 하고 함수 내 다른 모든 코드 주석처리)
    // Kakaologins.unlink((err, res) => {
    //   if (err) {
    //     console.log('failed');
    //   } else {
    //     console.log('success');
    //   }
    // });
  };

  // have to make these things work
  render() {
    const {isloggedin, lat, long} = this.state;
    const _login = () => {
      console.log('zzzzzzzz');
      this.setState({
        isloggedin: true,
      });
    };
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
    return (
      <View>
        {isloggedin ? (
          <MapApp lat={lat} long={long} />
        ) : (
          <LoginScreen
            source={require('./safeRestaurant.png')}
            spinnerEnable
            spinnerVisibility={spinnerVisibility}
            labelTextStyle={{
              color: '#adadad',
              fontFamily: 'EastSeaDokdo-Regular',
            }}
            logoComponent={renderLogo()}
            logoTextStyle={{
              fontSize: 27,
              color: '#fdfdfd',
              fontFamily: 'EastSeaDokdo-Regular',
            }}
            loginButtonTextStyle={{
              color: '#fdfdfd',
              fontFamily: 'EastSeaDokdo-Regular',
            }}
            textStyle={{
              color: '#757575',
              fontFamily: 'EastSeaDokdo-Regular',
            }}
            signupStyle={{
              color: '#fdfdfd',
              fontFamily: 'EastSeaDokdo-Regular',
            }}
            emailOnChangeText={(username) => console.log('addr: ', username)}
            onPressSettings={this._KakaoLogin}
            passwordOnChangeText={(password) =>
              console.log('Password: ', password)
            }
            onPressLogin={() => {
              console.log('로그인');
              _login();
              console.log('로그인 gj');
            }}
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
        )}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   main: {flex: 1},
//   container: {
//     flex: 1,
//     display: 'flex',
//     backgroundColor: '#BCCDF7',
//     alignItems: 'center',
//     ...Platform.select({
//       android: {
//         paddingTop: '20%',
//       },
//     }),
//   },
//   topnav: {
//     flex: 0.8,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginBottom: 5,
//   },
//   bottomnav: {
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   SRintronav: {
//     flex: 0.8,
//     marginBottom: 20,
//   },
//   SRintroduction: {
//     width: pwidth - 40,
//     marginTop: 10,
//     alignItems: 'center',
//     borderRadius: 20,
//     backgroundColor: 'rgba(250, 250, 250, 0.4)',
//   },
//   logo: {
//     width: 150,
//     height: 150,
//   },
//   Inputtext: {
//     borderWidth: 1,
//     borderColor: '#818181',
//     width: pwidth - 40,
//     height: 40,
//     margin: 5,
//     paddingLeft: 5,
//   },
//   extraloginfunc: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: pwidth - 40,
//     paddingTop: 5,
//     paddingBottom: 7,
//     borderBottomWidth: 1,
//     borderBottomColor: '#81818181',
//     borderRadius: 1,
//   },
//   extrainfotxt: {
//     fontSize: 11,
//     color: '#a1a1a1',
//   },
//   autologin: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   autologinckb: {
//     width: 14,
//     height: 14,
//     borderWidth: 1,
//     borderColor: '#717171',
//     backgroundColor: '#f1f1f1',
//     marginRight: 3,
//   },
//   findID: {
//     marginRight: 3,
//   },
//   divide: {
//     width: 5,
//   },
//   findPW: {
//     marginLeft: 3,
//   },
//   logins: {
//     width: pwidth - 40,
//     margin: 7,
//   },
//   loginbtn: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 40,
//     width: pwidth - 40,
//     backgroundColor: '#a1a1a1',
//     borderRadius: 10,
//   },
//   kakaoimg: {
//     width: pwidth - 40,
//     height: 40,
//     borderRadius: 10,
//   },
//   logintxt: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: '#f1f1f1',
//   },
//   createaccount: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: pwidth - 40,
//     height: 40,
//     backgroundColor: '#a1a1a1',
//     marginTop: 7,
//     borderRadius: 10,
//   },
//   STintrotitle: {
//     height: 100,
//     justifyContent: 'center',
//   },
//   SRintrotitletxt: {
//     fontSize: 60,
//     color: '#F7D3C5',
//     fontFamily: 'EastSeaDokdo-Regular',
//   },
//   SRintrodesc: {
//     alignItems: 'flex-start',
//     height: 100,
//   },
//   SRintrodesctxt: {
//     fontSize: 13,
//     color: '#717171',
//   },
// });
