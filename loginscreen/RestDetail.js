import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Text,
  Platform,
} from 'react-native';
import MapApp from './MapApp';
import MapView, {Marker} from 'react-native-maps';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

export default class RestDetail extends Component {
  state = {
    isOnSRD: true,
  };

  _Back = () => {
    this.setState({
      isOnSRD: false,
    });
  };

  render() {
    const {isOnSRD} = this.state;
    return (
      <View style={styles.main}>
        {isOnSRD ? (
          <View style={styles.main}>
            <SafeAreaView style={styles.logout}>
              <View style={styles.loginleft}>
                <TouchableOpacity style={styles.logoutbtn} onPress={this._Back}>
                  <Image
                    style={styles.backimg}
                    source={require('./assets/images/back.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.restname}>
                <Text>식당 이름</Text>
              </View>
              <View style={styles.loginright}></View>
            </SafeAreaView>
            <ScrollView style={styles.detailscreen}>
              <View style={styles.mapdetail}>
                <MapView
                  scrollEnabled={false}
                  zoomEnabled={false}
                  style={styles.map}
                  region={{
                    latitude: this.props.lat,
                    longitude: this.props.long,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
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
              <View style={styles.restdetail}>
                <View style={styles.name}>
                  <Text style={styles.nametxt}>name, nametxt</Text>
                </View>
                <View style={styles.restaddr}>
                  <Text style={styles.addrtxt}>restaddr, addrtxt</Text>
                </View>
                <View style={styles.telnum}>
                  <Text style={styles.telnumtxt}>telnum, telnumtxt</Text>
                </View>
                <View style={styles.kakaolink}>
                  <Image
                    style={styles.kakaolinkimg}
                    source={require('./assets/images/kakaolink.png')}
                  />
                </View>
              </View>
              <View style={styles.reviewscreen}>
                <Text>review</Text>
              </View>
            </ScrollView>
            <StatusBar hidden={false} />
          </View>
        ) : (
          <MapApp lat={this.props.lat} long={this.props.long} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  logout: {
    height: '10%',
    alignItems: 'center',
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
    flexDirection: 'row',
  },
  backimg: {
    width: 30,
    height: 30,
  },
  loginleft: {
    flex: 1,
  },
  restname: {
    flex: 1,
    alignItems: 'center',
  },
  loginright: {
    flex: 1,
  },
  logoutbtn: {
    margin: 10,
    width: 35,
    height: 35,
  },
  map: {
    width: pwidth,
    height: pheight / 3,
  },
  detailscreen: {
    flex: 1,
    display: 'flex',
  },
  mapdetail: {
    flex: 1,
  },
  restdetail: {
    height: pheight / 3,
    borderBottomWidth: 1,
    margin: 10,
  },
  name: {
    justifyContent: 'center',
    flex: 1,
  },
  restaddr: {
    flex: 1,
  },
  telnum: {
    flex: 1,
  },
  kakaolink: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  kakaolinkimg: {
    width: pwidth / 2,
    height: 45,
  },
  reviewscreen: {
    height: pheight / 3,
    margin: 10,
  },
});
