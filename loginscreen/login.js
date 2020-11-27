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
  KeyboardAvoidingView,
} from 'react-native';
import MapApp from './MapApp';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import Kakaologins, {login} from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;
const IPADDR = '220.68.233.99'; // change it when the ip addr was changed

export default class LogIn extends Component {
  state = {
    isloggedin: false,
    lat: 126.9502641,
    long: 37.3468471,
    // login 관련
    account: false, // signup 화면으로 전환위해 필요
    userloginjson: null, // asyncstorage에서 가져온 객체 저장
    Token: '', // login하고 받은 token값 저장
    usernick: '', // signup에서 유저가 입력한 닉네임값 저장
    userinfos: null, // getprofile, 모든 종합 값들(서버에 보내서 signup시키기 위함)
  };

  async componentDidMount() {
    // kakao link를 타고 들어왔을 때 해당 식당 페이지로 보내주기 위함 but 아직 모두 구현되진 않음
    if (Platform.OS === 'android') {
      //안드로이드는 아래와 같이 initialURL을 확인하고 navigate 합니다.
      Linking.getInitialURL().then((url) => {
        if (url) this.navigate(url); //
      });
    } else {
      //ios는 이벤트리스너를 mount/unmount 하여 url을 navigate 합니다.
      Linking.addEventListener('url', this.handleOpenURL);
    }

    //로그인 확인
    try {
      const jsonValue = await AsyncStorage.getItem('SRLoginKey');
      this.setState({
        userloginjson: JSON.parse(jsonValue),
      });
      console.log(this.state.userloginjson);
      if (this.state.userloginjson != null) {
        // 서버에 값 보내서 계정 유무 판단
        let option = {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
            _email: this.state.userloginjson._email,
          }),
        };
        fetch(`http://${IPADDR}/users/account`, option)
          .then((res) => res.json())
          .then((json) => {
            if (json == 1) {
              this.setState({
                isloggedin: true,
              });
            }
          });
      } else {
        console.log('as data does not have anything');
      }
    } catch (e) {
      console.log('login data read error!!');
    }

    // 여기부턴 기본 코드
    this.GetPosition();
  }

  // kakao link를 타고 들어왔을 때 해당 식당 페이지로 보내주기 위함 but 아직 모두 구현되진 않음
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
          lat: res.coords.longitude,
          long: res.coords.latitude,
        });
      },
      (error) => console.log(error),
    );
  };

  _KakaoLogin = () => {
    Kakaologins.login()
      .then((res) => {
        console.log(res.accessToken);
        this.setState({
          Token: res.accessToken,
        });
        Kakaologins.getProfile().then((res) => {
          console.log(JSON.stringify(res));
          this.setState({
            account: true,
            userinfos: {
              _token: this.state.Token,
              _name: res.nickname,
              _email: res.email,
              _age_range: res.age_range,
              _nickname: '',
            },
          });
        });
      })
      .catch((err) => {
        console.log('login failed');
        alert('로그인 실패');
        console.log(err);
      });

    // 연결 끊기(연결 끊고 다시 로그인 하고싶으면 이거 주석 해제 하고 함수 내 다른 모든 코드 주석처리)
    // Kakaologins.unlink((err, res) => {
    //   if (err) {
    //     console.log('failed');
    //   } else {
    //     console.log('success');
    //   }
    // });
  };

  // login func
  _signup = () => {
    console.log(this.state.usernick);
    this.setState(
      {
        userinfos: {
          ...this.state.userinfos,
          _nickname: this.state.usernick,
        },
      },
      () => {
        // 닉네임 중복체크
        let option = {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({_nick: this.state.usernick}),
        };
        fetch(`http://${IPADDR}/users/nickname`, option)
          .then((res) => res.json())
          .then((json) => {
            if (json == 1) {
              // 서버에 보내서 계정 생성 완료 되면 as에 저장
              let option = {
                method: 'POST',
                mode: 'cors',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(this.state.userinfos),
              };
              fetch(`http://${IPADDR}/users/signup`, option)
                .then((res) => res.json())
                .then((json) => {
                  if (json == 1) {
                    console.log('create account succeed!!');
                    try {
                      const jsonValue = JSON.stringify(this.state.userinfos);
                      AsyncStorage.setItem('SRLoginKey', jsonValue);
                      console.log('AS save succeed!!');
                      this.setState({
                        isloggedin: true,
                      });
                    } catch (e) {
                      console.log('AS save failed');
                    }
                  } else {
                    console.log('create account failed..');
                  }
                });
            } else {
              alert('닉네임이 중복 되었습니다.');
            }
          });
      },
    );
  };

  // have to make these things work
  render() {
    const {isloggedin, lat, long, account, usernick} = this.state;

    return (
      <>
        {isloggedin ? (
          <MapApp lat={lat} long={long} />
        ) : (
          <View style={styles.main}>
            <Image
              source={require('./safeRestaurant.png')}
              style={styles.imageBackgroundStyle}
            />
            <View
              style={{top: 25, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{
                  height: pwidth * 0.66,
                  width: pwidth * 0.66,
                }}
                source={require('./logo.png')}
                resizeMode={'contain'}
              />
            </View>

            {/* login 창 */}
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={pheight * 0.26}>
              <View
                style={{
                  top: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={styles.footer}>
                  <View style={{flexDirection: 'column'}}>
                    {account ? (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextInput
                            style={{
                              height: 40,
                              width: 200,
                              borderColor: 'gray',
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              borderWidth: 1,
                            }}
                            value={usernick}
                            maxLength={8}
                            multiline={false}
                            enablesReturnKeyAutomatically={true}
                            placeholder={'최대 8자 닉네임을 입력하세요.'}
                            onChangeText={(txt) => {
                              this.setState({
                                usernick: txt,
                              });
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.loginButton}
                          onPress={this._signup}>
                          <Text style={{color: '#3c1e1e'}}>
                            {' Create Account '}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <View style={{flex: 0.8, marginTop: 20}}>
                          <Text style={styles.textStyle}>
                            <Icon name="checkmark" size={20} color="#ff5555" />
                            음식 덜어먹기
                          </Text>
                          <Text style={styles.textStyle}>
                            <Icon name="checkmark" size={20} color="#ff5555" />
                            위생적 수저 관리
                          </Text>
                          <Text style={styles.textStyle}>
                            <Icon name="checkmark" size={20} color="#ff5555" />
                            종사자 마스크 쓰기
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.loginButton}
                          onPress={this._KakaoLogin}>
                          <Text style={{color: '#3c1e1e'}}>
                            {' Login with kakaotalk '}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    position: 'relative',
                    alignSelf: 'center',
                    marginTop: 64,
                  }}>
                  <Text style={{color: 'white', fontSize: 30}}></Text>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  imageBackgroundStyle: {
    position: 'absolute',
    flex: 1,
    zIndex: -1,
    width: pwidth,
    height: pheight,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#fae100',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
  },
  footer: {
    width: pwidth * 0.9,
    height: pwidth * 0.6,

    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: pheight * 0.25,

    backgroundColor: 'rgba(150,150,150,0.3)',
  },
});
