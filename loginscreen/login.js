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
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from 'react-native-login-screen';
import { Input } from 'react-native-elements';
import { spinnerVisibility } from 'react-native-spinkit';


let pwidth = Dimensions.get('window').width;

export default class LogIn extends Component {
  state = {
    isloggedin: false,
    lat: 126.9502641,
    long: 37.3468471,
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
    const _login = () => {
      console.log("zzzzzzzz");
      this.setState({
        isloggedin: true,
      });
    };
    const renderLogo = () => (
      <View
        style={{
          top: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          resizeMode="contain"
          source={require("./logo.png")}
          style={{ height: 250, width: 250 }}
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
              color: "#adadad",
              fontFamily: "Now-Bold",
            }}
            logoComponent={renderLogo()}
            logoTextStyle={{
              fontSize: 27,
              color: "#fdfdfd",
              fontFamily: "Now-Black",
            }}
            loginButtonTextStyle={{
              color: "#fdfdfd",
              fontFamily: "Now-Bold",
            }}
            textStyle={{
              color: "#757575",
              fontFamily: "Now-Regular",
            }}
            signupStyle={{
              color: "#fdfdfd",
              fontFamily: "Now-Bold",
            }}
            emailOnChangeText={(username) => console.log("addr: ", username)}
            onPressSettings={() => alert("Settings Button is pressed")}
            passwordOnChangeText={(password) => console.log("Password: ", password)}
            onPressLogin={() => {
              console.log("로그인");
              _login();
              console.log("로그인 gj");

            }}
            onPressSignup={() => {
              console.log("onPressSignUp is pressed");
            }}
          >
            <View
              style={{
                position: "relative",
                alignSelf: "center",
                marginTop: 64,
              }}
            >
              <Text style={{ color: "white", fontSize: 30 }}>
              </Text>
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
