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
  Linking,
} from 'react-native';
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

  async componentDidMount() {
    // 여기부턴 기본 코드
    this.GetPosition();

    //로그인 확인
    try {
      const jsonValue = await AsyncStorage.getItem('SRLoginKey');
      this.setState({
        userloginjson: JSON.parse(jsonValue),
      });
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
          .catch((err) => {
            Alert.alert(
              `${err.message}`,
              '네트워크 연결 상태를 확인 해주십시오',
              [
                {
                  text: '확인',
                  onPress: () => {
                    BackHandler.exitApp();
                  },
                },
              ],
              {cancelable: false},
            );
          })
          .then((res) => res.json())
          .then((json) => {
            if (json == 1) {
              // kakao link를 타고 들어왔을 때 해당 식당 페이지로 보내주기 위함 but 아직 모두 구현되진 않음
              if (Platform.OS == 'android') {
                //안드로이드는 아래와 같이 initialURL을 확인하고 navigate 합니다.
                Linking.getInitialURL().then((url) => {
                  if (url) this.navigate(url); //
                });
              } else if (Platform.OS == 'ios') {
                //ios는 이벤트리스너를 mount/unmount 하여 url을 navigate 합니다.
                Linking.getInitialURL()
                  .then((url) => {
                    if (url) {
                      this.handleOpenURL({url});
                    }
                  })
                  .catch((err) => console.error('An error occurred', err));
              }
              this.props.navigation.push('Map', {
                lat: this.state.lat,
                long: this.state.long,
                user: this.state.userloginjson,
              });
            }
          });
      }
    } catch (e) {
      alert('로그인 정보 가져오기 실패');
    }
  }

  // ios handle url
  handleOpenURL = (event) => {
    this.navigate(event.url);
  };

  // kakao link를 타고 들어왔을 때 해당 식당 페이지로 보내주기 위함 but 아직 모두 구현되진 않음
  navigate = (url) => {
    const paths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
    if (paths.length > 1) {
      //파라미터가 있다
      const params = paths[1].split('&');
      let item = {};
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('='); // [0]: key, [1]:value
        if (param[0] == 'enaddr') {
          item.enaddr = param[1];
        } else if (param[0] == 'isSaferes') {
          item.isSaferes = param[1];
        } else if (param[0] == 'kraddr') {
          item.kraddr = decodeURI(decodeURIComponent(param[1])); // 이렇게 생긴거 모두 ios에서 deeplink로 url보낼때 한글 깨짐 현상때매 encoding해서 보낸거 다시 decode한거임
        } else if (param[0] == 'latitude') {
          item.latitude = Number(param[1]);
        } else if (param[0] == 'longitude') {
          item.longitude = Number(param[1]);
        } else if (param[0] == 'resGubunDetail') {
          item.resGubunDetail = decodeURI(decodeURIComponent(param[1]));
        } else if (param[0] == 'resTEL') {
          item.resTEL = param[1];
        } else if (param[0] == 'restaurantid') {
          item.restaurantid = param[1];
        } else if (param[0] == 'restaurantname') {
          item.restaurantname = decodeURI(decodeURIComponent(param[1]));
        } else if (param[0] == 'resGubun') {
          item.resGubun = decodeURI(decodeURIComponent(param[1]));
        }
      }
      //id 체크 후 상세페이지로 navigate 합니다.
      this.props.navigation.push('Detail', {
        item: item,
        user: this.state.userloginjson,
      });
    }
  };

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
                this.props.navigation.push('Map', {
                  lat: this.state.lat,
                  long: this.state.long,
                  user: this.state.userloginjson,
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
                      this.props.navigation.push('Map', {
                        lat: this.state.lat,
                        long: this.state.long,
                        user: this.state.userloginjson,
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
                    <Text style={{color: '#3c1e1e'}}>{' Create Account '}</Text>
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
