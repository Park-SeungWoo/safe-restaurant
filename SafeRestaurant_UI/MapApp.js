import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
  Text,
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-maps-clustering';
import RBSheet from 'react-native-raw-bottom-sheet';
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
    lat: this.props.lat,
    long: this.props.long,
    restscoord: [
      {
        description: 'restaurant datas will be saved and modified in here',
      },
    ],
    refcoordilat: this.props.lat,
    refcoordilong: this.props.long,
    loccoors: [],
    curselecteditem: null,
    clickonbottomsheet: false,
  };

  _logout = () => {
    this.setState({
      isloggedin: false,
    });
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
    this._standardcoordi(res.latitude, res.longitude);
    // send lat, long, longdel to server and retrieve coords included in virtual screen
  };

  _MarkerData = (_lat, _long) => {
    // get latitude, longitude by using translated address
    console.log(
      '1. ',
      this.state.lat,
      '\n2. ',
      this.state.long,
      '\n3. ',
      DELTA_long,
      '\n4. ',
      DELTA_lat,
    );
    fetch(
      `http://220.68.233.127/coordi?latitude=${_lat}&longitude=${_long}&latdelta=${DELTA_lat}&longdelta=${DELTA_long}`,
    )
      .then((res) => res.json())
      .then((json) => {
        console.log('nowlat', _lat, '  nowlong:', _long);
        this.setState({
          // lat:_lat,
          // long:_long,
          refcoordilat: _lat,
          refcoordilong: _long,
          loccoors: json,
        });
      });
    console.log(this.state.loccoors);
  };

  _standardcoordi = (res) => {
    console.log('coords');
    console.log(
      `lat(${this.state.refcoordilat + 0.06}) : nowlat(${
        res.longitude
      }) : lat(${this.state.refcoordilat - 0.06})`,
    );
    console.log(
      `long(${this.state.refcoordilong + 0.04}) : nowlong(${
        res.latitude
      }) : long(${this.state.refcoordilong - 0.04})`,
    );
    console.log();
    console.log(res);
    console.log('function called!');
    if (
      res.longitude > this.state.refcoordilat + 0.06 ||
      res.longitude < this.state.refcoordilat - 0.06 ||
      res.latitude > this.state.refcoordilong + 0.04 ||
      res.latitude < this.state.refcoordilong - 0.04
    ) {
      console.log('zzzzzzzztlqkf');
      this._MarkerData(res.longitude, res.latitude);
    } else {
      console.log('nop');
    }
  };

  componentDidMount = () => {
    this._MarkerData(this.state.lat, this.state.long);
  };

  _pushmarker = (item) => {
    this.setState({
      curselecteditem: item,
    });
    this.RBSheet.open();
  };

  _clickbottomsheetbtn = () => {
    this.setState({
      clickonbottomsheet: true,
    });
  };
  render() {
    const {
      isloggedin,
      lat,
      long,
      clickonbottomsheet,
      curselecteditem,
    } = this.state;
    console.log('lat: ', lat, 'long: ', long);
    return (
      <View style={styles.main}>
          <View style={styles.main}>
            {/* <RestDetail item={curselecteditem} /> */}
          </View>
          <View style={styles.main}>
              <View style={styles.main}>
                {/* 바텀 시트 부분 시작*/}
                {/* <RBSheet
                  ref={(ref) => {
                    this.RBSheet = ref;
                  }}
                  height={400}
                  openDuration={250}
                  customStyles={{
                    container: {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={this._clickbottomsheetbtn}>
                      <Text>bottom sheet</Text>
                    </TouchableOpacity>
                  </View>
                </RBSheet>

                <SafeAreaView style={styles.logout}>
                  <TouchableOpacity
                    style={styles.logoutbtn}
                    onPress={this._logout}>
                    <Image
                      style={styles.backimg}
                      source={require('./assets/images/back.png')}
                    />
                  </TouchableOpacity>
                </SafeAreaView> */}

                {/* 맵뷰 부분 시작*/}
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: long,
                    longitude: lat,
                    latitudeDelta: DELTA_VALUE + 0.03,
                    longitudeDelta: DELTA_VALUE + 0.03,
                  }}
                  onRegionChangeComplete={(res) => this._standardcoordi(res)}>
                  {this.state.loccoors.map((coords, i) => (
                    <Marker
                      coordinate={{
                        latitude: coords.longitude,
                        longitude: coords.latitude,
                      }}
                      title={`${coords.restaurantname}`}
                      description={`${coords.kraddr}`}
                      key={i}
                      onPress={this._pushmarker.bind(this, coords)}
                    />
                  ))}
                </MapView>
              </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: 'flex',
  },
  map: {
    height: pheight * 0.92,
    width: pwidth,
  },
  logout: {
    height: pheight * 0.08,
    justifyContent: 'center',
    backgroundColor: '#BCCDF7',
    zIndex: 1,
    elevation: 13,
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
