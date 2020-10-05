import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import MapApp from './MapApp.js';
import LogIn from './login.js';
import Geolocation from '@react-native-community/geolocation';

export default class App extends Component {
  state = {
    lat: 10, // dummy value
    long: 10, // dummy value
    isloggedin: false,
  };

  // Have to make function which can toggle isloggedin

  LogIn = () => {
    this.setState({
      isloggedin: true,
    });
  };

  Back = () => {
    this.setState({
      isloggedin: false,
    });
  };

  GetPosition = () => {
    Geolocation.getCurrentPosition((res) => {
      this.setState({
        lat: res.coords.latitude,
        long: res.coords.longitude,
      });
      // console.log(this.state.lat, this.state.long);
    });
  };

  componentDidMount() {
    this.GetPosition();
  }

  render() {
    const {isloggedin, lat, long} = this.state;
    return (
      <View style={styles.main}>
        {isloggedin ? (
          <View style={styles.main}>
            <MapApp style={styles.main} lat={lat} long={long} />
            <TouchableOpacity style={styles.back} onPress={this.Back}>
              <Text style={styles.backtxt}>back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <LogIn />
        )}
        <StatusBar hidden={false} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    marginTop: 80,
    right: 10,
    backgroundColor: '#ffffffaa',
    width: 80,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backtxt: {
    fontSize: 20,
    fontWeight: '700',
  },
});
