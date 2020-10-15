import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import App from './App';
import RestDetail from './RestDetail';

const pheight = Dimensions.get('window').height;

export default class MapApp extends Component {
  state = {
    isloggedin: true,
    isMClicked: false,
  };

  _logout = () => {
    this.setState({
      isloggedin: false,
    });
  };

  _ClickMarker = () => {
    this.setState({
      isMClicked: true,
    });
  };

  render() {
    const {isloggedin, isMClicked} = this.state;
    return (
      <View style={styles.main}>
        {isMClicked ? (
          <RestDetail lat={this.props.lat} long={this.props.long} />
        ) : (
          <View style={styles.main}>
            {isloggedin ? (
              <View style={styles.main}>
                <SafeAreaView style={styles.logout}>
                  <TouchableOpacity
                    style={styles.logoutbtn}
                    onPress={this._logout}>
                    <Image
                      style={styles.backimg}
                      source={require('./assets/images/back.png')}
                    />
                  </TouchableOpacity>
                </SafeAreaView>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: this.props.lat,
                    longitude: this.props.long,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: this.props.lat,
                      longitude: this.props.long,
                    }}
                    title={'current'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                </MapView>
              </View>
            ) : (
              <App />
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  map: {
    height: pheight,
    flex: 1,
  },
  logout: {
    height: '10%',
    justifyContent: 'center',
    backgroundColor: '#BCCDF7',
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 13,
      },
    }),
  },
  backimg: {
    width: 30,
    height: 30,
  },
  logoutbtn: {
    margin: 10,
    width: 35,
    height: 35,
  },
});
