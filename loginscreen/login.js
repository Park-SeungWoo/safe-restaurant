import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import MapApp from './MapApp';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import Kakaologins from '@react-native-seoul/kakao-login';
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

  componentDidMount() {
    this.GetPosition();
  }

  GetPosition = () => {
    Geolocation.getCurrentPosition(
      (res) => {
        this.setState({
          lat: res.coords.latitude,
          long: res.coords.longitude,
        });
      },
      (error) => {
        Alert.alert(
          'GPS 오류',
          '위치 정보 가져오기 실패!',
          [
            {
              text: '다시 가져오기',
              onPress: () => {
                this.GetPosition;
              },
            },
          ],
          {cancelable: false},
        );
      },
    );
  };

  _KakaoLogin = () => {
    Kakaologins.login()
      .then((res) => {
        this.setState({
          Token: res.accessToken,
        });
        Kakaologins.getProfile().then((res) => {
          //계정 유무 판단
          let option = {
            method: 'POST',
            mode: 'cors',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({_email: res.email}),
          };
          fetch(`http://${IPADDR}/users/email`, option)
            .catch((err) => {
              Alert.alert(
                `${err.message}`,
                '네트워크 연결 상태를 확인 해주십시오.',
                [
                  {
                    text: '확인',
                    onPress: () => {},
                  },
                ],
                {cancelable: false},
              );
            })
            .then((ress) => ress.json())
            .then(async (json) => {
              if (json == '0') {
                // 계정 없음
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
              } else {
                // 계정 있음
                this.setState(
                  {
                    userinfos: {
                      _token: this.state.Token,
                      _name: res.nickname,
                      _email: res.email,
                      _age_range: res.age_range,
                      _nickname: json[0].nickname,
                    },
                    userloginjson: {
                      _age_range: res.age_range,
                      _email: res.email,
                      _name: res.nickname,
                      _nickname: json[0].nickname,
                      _token: this.state.Token,
                    },
                  },
                  async () => {
                    const jsonValue = JSON.stringify(this.state.userinfos);
                    await AsyncStorage.setItem('SRLoginKey', jsonValue);
                    alert(
                      `카카오 계정으로 생성한\n닉네임이 이미 있습니다.\n닉네임 : ${this.state.userinfos._nickname}\n카카오 계정 : ${this.state.userinfos._email}`,
                    );
                  },
                );
                this.setState({
                  isloggedin: true,
                });
              }
            });
        });
      })
      .catch((err) => {
        alert('로그인 실패');
      });
  };

  // login func
  _signup = () => {
    this.setState(
      {
        userinfos: {
          ...this.state.userinfos,
          _nickname: this.state.usernick,
        },
        userloginjson: {
          _age_range: this.state.userinfos._age_range,
          _email: this.state.userinfos._email,
          _name: this.state.userinfos._nickname,
          _nickname: this.state.usernick,
          _token: this.state.Token,
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
              // 계정 유무 판단(앱 삭제 후 다시 설치 시 로컬 저장소 날아가서 componentDidmount에서 안잡힘)

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
                    try {
                      const jsonValue = JSON.stringify(this.state.userinfos);
                      AsyncStorage.setItem('SRLoginKey', jsonValue);
                      this.setState({
                        isloggedin: true,
                      });
                    } catch (e) {}
                  } else {
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
    const {
      isloggedin,
      lat,
      long,
      account,
      usernick,
      userloginjson,
    } = this.state;

    return (
      <>
        {isloggedin ? (
          <MapApp lat={lat} long={long} user={userloginjson} />
        ) : (
          <View style={styles.main}>
            <Image
              source={require('./safeRestaurant.png')}
              style={styles.imageBackgroundStyle}
            />
            <View
              style={{
                top: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
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
              behavior={'height'}
              style={{
                top: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.footer}>
                <View style={{flexDirection: 'column'}}>
                  {account ? (
                    <View>
                      <Text
                        style={{
                          fontSize: 30,
                          fontFamily: 'BMJUA',
                          color: '#fafafa',
                        }}>
                        NICKNAME
                      </Text>
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
