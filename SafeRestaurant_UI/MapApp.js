import { Navigation } from "react-native-navigation";
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
  Button,
  StatusBar,
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-maps-clustering';
import RBSheet from 'react-native-raw-bottom-sheet';
import App from './App';
import RestDetail from './RestDetail';
import Screens from './index';
import Icon from 'react-native-vector-icons/Ionicons';
import { HeaderSearchBar, HeaderClassicSearchBar } from "react-native-header-search-bar";

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
    curselecteditem: {
      restaurantid: 1,
      restaurantname: '힛더스팟(현대중동점)',
      latitude: 126.7620841,
      longitude: 37.504318,
      kraddr: '경기도 부천시 길주로 180 현대백화점 8층',
      enaddr: '180, Gilju-ro, Bucheon-si, Gyeonggi-do, Republic of Korea',
      resGubun: '일반음식점',
      resGubunDetail: '서양식',
      resTEL: '032-623-2882',
      isSaferes: 'Y',
    },
    clickonbottomsheet: false,
  };

  _logout = () => {
    this.setState({
      isloggedin: false,
    });
  };

  _MarkerData = (_lat, _long) => {
    // get latitude, longitude by using translated address
    console.log('marker data called!');
    fetch(
      `http://220.68.233.99/coordi?latitude=${_lat}&longitude=${_long}&latdelta=${DELTA_lat}&longdelta=${DELTA_long}`,
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          refcoordilat: _lat,
          refcoordilong: _long,
          loccoors: json,
        });
      });
  };

  _standardcoordi = (res) => {
    console.log('function called!');
    if (
      res.longitude > this.state.refcoordilat + 0.06 ||
      res.longitude < this.state.refcoordilat - 0.06 ||
      res.latitude > this.state.refcoordilong + 0.04 ||
      res.latitude < this.state.refcoordilong - 0.04
    ) {
      this._MarkerData(res.longitude, res.latitude);
      console.log('Data retrieve succeed');
    } else {
      console.log('Data retrieve failed');
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
    let searchText = '';
    return (
      <View style={styles.main}>
        {clickonbottomsheet ? (
          // 바텀 시트내의 버튼을 클릭하면 clickonbottomsheet이 ture로 변경되며 RestDetail 컴포넌트 렌더링
          <View style={styles.main}>
            <RestDetail item={curselecteditem} />
          </View>
        ) : (
          // MapApp 컴포넌트의 가장 처음 화면 구성
          <View style={styles.main}>
              <View style={styles.main}>
                {/* 바텀 시트 부분 시작*/}
                <RBSheet
                  ref={(ref) => {
                    this.RBSheet = ref;
                  }}
                  height={400}
                  openDuration={250}
                  animationType={'fade'}
                  customStyles={{
                    container: {
                      backgroundColor: '#f1f1f1',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      // height: 290,
                      ...Platform.select({
                        ios: {
                          height: 310,
                        },
                        android: {
                          height: 300,
                        },
                      }),
                    },
                  }}
                  closeOnDragDown={true}
                  dragFromTopOnly={true}>
                  <View style={{flex: 1}}>
                    <View style={styles.bottomsheetdes}>
                      <TouchableOpacity
                        style={styles.bottomsheetTop}
                        onPress={this._clickbottomsheetbtn}>
                        <View style={styles.bottomsheetnameview}>
                          <Image
                            source={require('./logo.png')}
                            style={{width: 110, height: 110}}
                          />
                          <View style={styles.bottomsheetTopRight}>
                            <Text style={styles.bottomsheetnametxt}>
                              {curselecteditem.restaurantname}
                            </Text>
                            <View style={styles.bottomsheetgubuns}>
                              <Text style={styles.bottomsheetgubuntxt}>
                                {curselecteditem.resGubun}
                              </Text>
                              <Text style={styles.bottomsheetgubuntxt}>
                                {curselecteditem.resGubunDetail}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.bottomsheetdetailview}>
                        <Icon
                          name="location-outline"
                          size={20}
                          color="#111"
                          style={styles.bottomsheetIcons}
                        />
                        <Text style={styles.bottomsheetdetailtxt}>
                          {`${curselecteditem.kraddr}`}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bottomsheetdetailview}
                        onPress={() =>
                          Linking.openURL(`tel:${curselecteditem.resTEL}`)
                        }>
                        <Icon
                          name="call-outline"
                          size={20}
                          color="#111"
                          style={styles.bottomsheetIcons}
                        />
                        <Text style={styles.bottomsheetdetailtxt}>
                          {`${
                            curselecteditem.resTEL != ''
                              ? curselecteditem.resTEL
                              : '전화 번호가 없습니다.'
                          }`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>

                
                <SafeAreaView style={styles.searchBar}>
                  <StatusBar barStyle="dark-content"/>
                  <HeaderClassicSearchBar onChangeText={text => searchText = text } searchBoxOnPress={()=>{
                    // console.log(searchText); 
                    fetch(
                      `http://220.68.233.99/searchaddr?kaddrkeyword=${searchText}`
                    ).then((res) => res.json())
                    .then((json) => {
                      json.map((result, i) => (console.log(result.restaurantname + i)))
                    });
                  }}/>
                </SafeAreaView>

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
                  {/*서버 닫혔을 때 실험용 마커*/}
                  {/* <Marker
                    coordinate={{
                      latitude: long,
                      longitude: lat,
                    }}
                    title={`test`}
                    description={`test`}
                    onPress={this._pushmarker.bind(
                      this,
                      this.state.curselecteditem,
                    )}
                  /> */}
                  {/*서버 열렸을때 실 사용 테스트용 마커*/}
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
        )}
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
    height: pheight,
    width: pwidth,
  },
  searchBar: {
    ...Platform.select({
      ios: {
        height: pheight * 0.11,
        shadowOffset: {
          height: 5,
        },
        shadowColor: 'black',
        shadowOpacity: 0.1,
      },
      android: {
        height: pheight * 0.08,
        elevation: 15,
      },
    }),
    justifyContent: 'center',
    backgroundColor: '#BCCDF7',
    zIndex: 1,
  },
  backimg: {
    width: 30,
    height: 30,
  },
  logoutbtn: {
    margin: 10,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomsheetdes: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    width: pwidth - 20,
    marginHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  bottomsheetTop: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomsheetnameview: {
    borderBottomWidth: 2,
    borderBottomColor: '#e1e1e1',
    width: pwidth - 40,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomsheetTopRight: {
    width: pwidth - 150,
    alignItems: 'flex-end',
  },
  bottomsheetnametxt: {
    fontSize: 28,
    color: '#333',
    marginRight: 5,
  },
  bottomsheetgubuns: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 5,
  },
  bottomsheetgubuntxt: {
    fontSize: 15,
    color: '#c1c1c1',
  },
  bottomsheetdetailview: {
    borderBottomWidth: 2,
    borderBottomColor: '#f1f1f1aa',
    width: pwidth - 40,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  bottomsheetdetailtxt: {
    fontSize: 20,
    color: '#818181',
    marginLeft: 10,
    marginRight: 20,
    paddingRight: 20,
  },
  bottomsheetIcons: {
    marginLeft: 10,
  },
});
