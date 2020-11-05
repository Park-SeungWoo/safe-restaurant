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
} from 'react-native';
import MapApp from './MapApp';
import Geolocation from '@react-native-community/geolocation';

let pwidth = Dimensions.get('window').width;

export default class LogIn extends Component {
  state = {
    isloggedin: false,
    lat: 126.9502641,
    long: 37.3468471,
  };
  _login = () => {
    this.setState({
      isloggedin: true,
    });
  };

  componentDidMount() {
    this.GetPosition();
  }

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

  // have to make these things work
  render() {
    const {isloggedin, lat, long} = this.state;
    return (
      <View style={styles.main}>
        {isloggedin ? (
          <MapApp lat={lat} long={long} />
        ) : (
          <SafeAreaView style={styles.container}>
            <View style={styles.topnav}>
              <View style={styles.logo}>
                <Image
                  style={styles.logo}
                  source={require('./assets/images/logo.png')}
                />
              </View>
              <TextInput style={styles.Inputtext} placeholder={'ID'} />
              <TextInput
                style={styles.Inputtext}
                placeholder={'Password'}
                secureTextEntry={true}
              />
              <View style={styles.extraloginfunc}>
                <TouchableOpacity style={styles.autologin}>
                  <TouchableOpacity
                    style={styles.autologinckb}></TouchableOpacity>
                  <Text style={styles.extrainfotxt}>자동 로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.findID}>
                  <Text style={styles.extrainfotxt}>아이디 찾기</Text>
                </TouchableOpacity>
                <View style={styles.divide}>
                  <Text style={styles.extrainfotxt}>|</Text>
                </View>
                <TouchableOpacity style={styles.findPW}>
                  <Text style={styles.extrainfotxt}>비밀번호 찾기</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomnav}>
              <View style={styles.logins}>
                <TouchableOpacity style={styles.loginbtn} onPress={this._login}>
                  <Text style={styles.logintxt}>로그인 하기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createaccount}>
                  <Text style={styles.logintxt}>회원 가입</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Image
                  style={styles.kakaoimg}
                  source={require('./assets/images/kakaolg.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.SRintronav}>
              <View style={styles.SRintroduction}>
                <View style={styles.STintrotitle}>
                  <Text style={styles.SRintrotitletxt}>안심 식당</Text>
                </View>
                <View style={styles.SRintrodesc}>
                  <Text style={styles.SRintrodesctxt}>
                    1. 덜어먹기 가능한 도구 비치·제공
                  </Text>
                  <Text style={styles.SRintrodesctxt}>
                    2. 위생적인 수저관리
                  </Text>
                  <Text style={styles.SRintrodesctxt}>
                    3. 종사자 마스크 착용
                  </Text>
                  <Text style={styles.SRintrodesctxt}>
                    등 3대 식사문화 개선 수칙을 지키는 곳 입니다.
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {flex: 1},
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#BCCDF7',
    alignItems: 'center',
    ...Platform.select({
      android: {
        paddingTop: '20%',
      },
    }),
  },
  topnav: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  bottomnav: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  SRintronav: {
    flex: 0.8,
    marginBottom: 20,
  },
  SRintroduction: {
    width: pwidth - 40,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(250, 250, 250, 0.4)',
  },
  logo: {
    width: 150,
    height: 150,
  },
  Inputtext: {
    borderWidth: 1,
    borderColor: '#818181',
    width: pwidth - 40,
    height: 40,
    margin: 5,
    paddingLeft: 5,
  },
  extraloginfunc: {
    flexDirection: 'row',
    alignItems: 'center',
    width: pwidth - 40,
    paddingTop: 5,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#81818181',
    borderRadius: 1,
  },
  extrainfotxt: {
    fontSize: 11,
    color: '#a1a1a1',
  },
  autologin: {
    flex: 1,
    flexDirection: 'row',
  },
  autologinckb: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#717171',
    backgroundColor: '#f1f1f1',
    marginRight: 3,
  },
  findID: {
    marginRight: 3,
  },
  divide: {
    width: 5,
  },
  findPW: {
    marginLeft: 3,
  },
  logins: {
    width: pwidth - 40,
    margin: 7,
  },
  loginbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: pwidth - 40,
    backgroundColor: '#a1a1a1',
    borderRadius: 10,
  },
  kakaoimg: {
    width: pwidth - 40,
    height: 40,
    borderRadius: 10,
  },
  logintxt: {
    fontSize: 20,
    fontWeight: '500',
    color: '#f1f1f1',
  },
  createaccount: {
    alignItems: 'center',
    justifyContent: 'center',
    width: pwidth - 40,
    height: 40,
    backgroundColor: '#a1a1a1',
    marginTop: 7,
    borderRadius: 10,
  },
  STintrotitle: {
    height: 100,
    justifyContent: 'center',
  },
  SRintrotitletxt: {
    fontSize: 60,
    color: '#F7D3C5',
    fontFamily: 'EastSeaDokdo-Regular',
  },
  SRintrodesc: {
    alignItems: 'flex-start',
    height: 100,
  },
  SRintrodesctxt: {
    fontSize: 13,
    color: '#717171',
  },
});
