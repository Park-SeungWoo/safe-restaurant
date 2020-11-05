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
import {Marker} from 'react-native-maps';
import MapView from 'react-native-maps-clustering'
import App from './App';
import RestDetail from './RestDetail';

const pheight = Dimensions.get('window').height;
const pwidth = Dimensions.get('window').width;
const DELTA_VALUE = 0.009;
const DELTA_lat = 0.09;
const DELTA_long = 0.06;

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
    loccoors: []
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

  _MarkerData = () => {
    // get latitude, longitude by using translated address
    console.log("1. ", this.state.lat, "\n2. ", this.state.long,"\n3. ", DELTA_lat,"\n4. ", DELTA_long);
    fetch(
      `http://220.68.233.127/coordi?latitude=${this.state.lat}&longitude=${this.state.long}&latdelta=${DELTA_lat}&longdelta=${DELTA_long}`
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log("tlqkf: ", json);
        this.setState({
          loccoors: json
        });
      });
  };
  componentDidMount = () => {
    this._MarkerData();
  }

  render() {
    const {isloggedin, isMClicked, lat, long} = this.state;
    console.log("lat: ", lat,"long: ",long)
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
                  initialRegion={{
                    latitude: long,
                    longitude: lat,
                    latitudeDelta: DELTA_VALUE + 0.03,
                    longitudeDelta: DELTA_VALUE + 0.03,
                  }}
                  onRegionChange={(res) => this._ReagionConsole(res)}>
                  {this.state.loccoors.map((coords, i) => 
                    (<Marker
                      coordinate={{latitude: coords.longitude, longitude: coords.latitude}}
                      title={`${coords.restaurantname}`}
                      description={`${coords.kraddr}`}
                      key={i}
                    />)
                  )}
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
