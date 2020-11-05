import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from 'react-native-login-screen';
import { Input } from 'react-native-elements';
import { spinnerVisibility } from 'react-native-spinkit';

export default class App extends Component {
  render() {
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
        {/* <Input
          placeholder='User Name'
          leftIcon={{ type: 'ion-icons', name: 'person-outline' }}
          onChangeText={value => this.setState({ user_name: value })}
        />
        <Input
          placeholder="E-Mail"
          leftIcon={{ type: 'ion-icons', name: 'mail-outline' }}
          onChangeText={value => this.setState({ email_addr: value })}
        />

        <Input placeholder="Password" secureTextEntry={true} 
          leftIcon={{ type: 'ion-icons', name: 'lock-outline' }}
        /> */}
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
            setSpinnerVisibility(true);
            setTimeout(() => {
              setSpinnerVisibility(false);
            }, 2000);
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
      </View>
    );
  }
}