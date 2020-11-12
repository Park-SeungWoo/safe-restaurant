import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Kakaologins from '@react-native-seoul/kakao-login';
import RNKakaoLink from 'react-native-kakao-links';

export default class App extends Component {
  _kakaolink = async () => {
    console.log('share');
    try {
      const options = {
        objectType: 'location', //required
        content: {
          title: 'location', //required
          link: {
            webURL: 'https://developers.kakao.com',
            mobileWebURL: 'https://developers.kakao.com',
          }, //required
          imageURL: 'https://i.stack.imgur.com/lQQjg.png', //required
        }, //required
        address: '인천 광역시 부평구 일신동 12-24',
        addressTitle: 'My house',
      };
      const mes = await RNKakaoLink.link(options);
      console.log(mes);
    } catch (e) {
      console.warn(e);
    }
  };
  _kakaologinfunc = () => {
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
  };
  _kakaologoutfunc = () => {
    Kakaologins.logout((err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('success');
        console.log(res);
      }
    });
  };
  _getprofile = () => {
    Kakaologins.getProfile().then((res) => {
      console.log(`${JSON.stringify(res)}`);
    });
  };
  _disconnect = () => {
    Kakaologins.unlink((err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('unlink!');
        console.log(res);
      }
    });
  };
  state = {
    Tocken: 'Not yet',
  };
  render() {
    return (
      <View style={styles.main}>
        <Text style={{fontSize: 12}}>{this.state.Tocken}</Text>
        <View style={styles.btns}>
          <TouchableOpacity style={styles.btn} onPress={this._kakaologinfunc}>
            <Text style={styles.txt}>log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={this._kakaologoutfunc}>
            <Text style={styles.txt}>log out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={this._getprofile}>
            <Text style={styles.txt}>get profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={this._disconnect}>
            <Text style={styles.txt}>unlink</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={this._kakaolink}>
            <Text style={styles.txt}>share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    margin: 20,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 30,
  },
});
