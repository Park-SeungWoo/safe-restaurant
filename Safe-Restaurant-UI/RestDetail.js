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
import RNKakaoLink from 'react-native-kakao-links';

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

  _kakaoshare = async () => {
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

  render() {
    console.log(this.props.item);
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
                <Text>{this.props.item.restaurantname}</Text>
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
                    latitude: this.props.item.longitude,
                    longitude: this.props.item.latitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: this.props.item.longitude,
                      longitude: this.props.item.latitude,
                    }}
                    title={this.props.item.restaurantname}
                    description={this.props.item.resGubun}
                    onPress={this._ClickMarker}
                  />
                </MapView>
              </View>
              <View style={styles.restdetail}>
                <View style={styles.name}>
                  <Text style={styles.nametxt}>
                    {this.props.item.restaurantname}
                  </Text>
                </View>
                <View style={styles.restaddr}>
                  <Text style={styles.addrtxt}>{this.props.item.kraddr}</Text>
                </View>
                <View style={styles.telnum}>
                  <Text style={styles.telnumtxt}>{this.props.item.resTEL}</Text>
                </View>
                <TouchableOpacity
                  style={styles.kakaolink}
                  onPress={this._kakaoshare}>
                  <Image
                    style={styles.kakaolinkimg}
                    source={require('./assets/images/kakaolink.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.reviewscreen}>
                <Text>review</Text>
              </View>
            </ScrollView>
          </View>
        ) : (
          <MapApp
            lat={this.props.item.latitude}
            long={this.props.item.longitude}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: pheight,
    // display: 'flex',
  },
  logout: {
    height: pheight * 0.08,
    alignItems: 'center',
    backgroundColor: '#BCCDF7',
    elevation: 13,
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
    height: pheight * 0.92,
    width: pwidth,
    paddingBottom: pheight,
  },
  mapdetail: {
    width: pwidth,
    height: pheight / 3,
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
