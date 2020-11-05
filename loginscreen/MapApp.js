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
const pwidth = Dimensions.get('window').width;
const DELTA_VALUE = 0.009;

export default class MapApp extends Component {
  state = {
    isloggedin: true,
    isMClicked: false,
    lat: this.props.lat,
    long: this.props.long,
    restscoord: [
      {
        description: 'restaurant datas will be saved and modified in here',
      },
    ],
  };

  _logout = () => {
    this.setState({
      isloggedin: false,
    });
  };

  _ClickMarker = () => {
    // this.setState({
    //   isMClicked: true,
    // });
  };

  _ReagionConsole = (res) => {
    console.log('coords');
    console.log(`lat : ${res.latitude}`);
    console.log(`long : ${res.longitude}`);
    console.log(`latdel : ${res.latitudeDelta}`);
    console.log(`longdel : ${res.longitudeDelta}`);
    console.log();
    console.log(pheight);
    console.log(pwidth);
    console.log();

    // send lat, long, longdel to server and retrieve coords included in virtual screen
  };

  render() {
    const {isloggedin, isMClicked, lat, long} = this.state;
    return (
      <View style={styles.main}>
        {isMClicked ? (
          <RestDetail lat={lat} long={long} />
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
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: DELTA_VALUE + 0.03,
                    longitudeDelta: DELTA_VALUE + 0.03,
                  }}
                  onRegionChange={(res) => this._ReagionConsole(res)}>
                  <Marker
                    coordinate={{
                      latitude: lat,
                      longitude: long,
                    }}
                    title={'current'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat - DELTA_VALUE * 0.5,
                      longitude: long + DELTA_VALUE * 0.5,
                    }}
                    title={'bottom right'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat - DELTA_VALUE * 0.5,
                      longitude: long - DELTA_VALUE * 0.5,
                    }}
                    title={'bottom left'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat + DELTA_VALUE * 0.5, // up, down
                      longitude: long + DELTA_VALUE * 0.5, // left, right
                    }}
                    title={'top right'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat + DELTA_VALUE * 0.5,
                      longitude: long - DELTA_VALUE * 0.5,
                      // delta value might be a latitude's or longitude's distance between the screen's each edges that already defined
                    }}
                    title={'top left'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  {/* 
                  we should longitudedelta value to get like the zoom level or something
                  because lat + latdelta * 0.5 value doesn't fit the phone's screen but, long + longdelta * 0.5 does. 
                  */}

                  {/* virtual screen size */}
                  <Marker
                    coordinate={{
                      latitude: lat - DELTA_VALUE * 1.5,
                      longitude: long + DELTA_VALUE * 1.5,
                    }}
                    title={'bottom right end'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat - DELTA_VALUE * 1.5,
                      longitude: long - DELTA_VALUE * 1.5,
                    }}
                    title={'bottom left end'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat + DELTA_VALUE * 1.5,
                      longitude: long + DELTA_VALUE * 1.5,
                    }}
                    title={'top right end'}
                    description={'current position'}
                    onPress={this._ClickMarker}
                  />
                  <Marker
                    coordinate={{
                      latitude: lat + DELTA_VALUE * 1.5,
                      longitude: long - DELTA_VALUE * 1.5,
                    }}
                    title={'top left end'}
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

// 0.017232196776063802
// 0.011685507718198096

// 1.0623178397468749
// 0.6858470206155118
