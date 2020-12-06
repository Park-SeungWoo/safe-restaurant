import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Linking,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import LogIn from './login';
import MapApp from './MapApp';
import DetailScreen from './DetailScreen';

const IPADDR = '220.68.233.99'; // change it when the ip addr was changed

export default class App extends Component {
  state = {
    isalreadylogin: false,
    Linked: false,
    userloginjson: null,
    URLitem: null,
    lat: 10,
    long: 10,
  };

  async componentDidMount() {
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
              this.setState({
                isalreadylogin: true,
              });
            }
          });
      }
    } catch (e) {
      alert('로그인 정보 가져오기 실패');
    }

    // 여기부턴 기본 코드
    this.GetPosition();
    SplashScreen.hide();
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
      this.setState({
        Linked: true,
        URLitem: item,
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
      (error) => alert('위치 정보 가져오기 실패!'),
    );
  };

  render() {
    const {
      isalreadylogin,
      Linked,
      userloginjson,
      lat,
      long,
      URLitem,
    } = this.state;
    return (
      <SafeAreaProvider>
        {Linked ? (
          <DetailScreen item={URLitem} user={userloginjson} />
        ) : isalreadylogin ? (
          <MapApp lat={lat} long={long} user={userloginjson} />
        ) : (
          <LogIn />
        )}
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
