import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Platform,
  Image,
  Text,
  Linking,
  StatusBar,
  ScrollView,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {HeaderClassicSearchBar} from 'react-native-header-search-bar';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-easy-toast';
import DetailScreen from './DetailScreen';

const pheight = Dimensions.get('window').height;
const pwidth = Dimensions.get('window').width;
const DELTA_VALUE = 0.01;
const IPADDR = '220.68.233.99'; // change it when the ip addr was changed

export default class MapApp extends Component {
  state = {
    lat: this.props.route.params.lat,
    long: this.props.route.params.long,
    curlat: 0,
    curlong: 0,
    restscoord: [
      {
        description: 'restaurant datas will be saved and modified in here',
      },
    ],
    refcoordilat: this.props.route.params.lat,
    refcoordilong: this.props.route.params.long,
    loccoors: [],
    loccoorslen: 0,
    // 서버 닫혔을 때 기본 값으로 이 값이 넘어감
    curselecteditem: [
      {
        _id: '',
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
    ],
    clickonbottomsheet: false,
    searchtxt: '',
    jsonResult: [],
    selectedmarker: false,
    showcluster: false,
  };

  // 맵뷰의 화면이 움직이고 난 후 화면의 위치가 가상 윈도우의 바깥쪽에 있으면 호출하여 해당 화면의 마커들을 다시 받아오는 함수
  _MarkerData = (_lat, _long, _latD, _longD) => {
    // get latitude, longitude by using translated address
    fetch(
      `http://${IPADDR}/coordi?latitude=${_lat}&longitude=${_long}&latdelta=${_latD}&longdelta=${_longD}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.length < 200) {
          this._redundancy(json);
        } else {
          this.setState({
            showcluster: true,
            loccoorslen: 200,
          });
        }
        this.setState({
          refcoordilat: _lat,
          refcoordilong: _long,
        });
      });
  };

  // 맵뷰의 화면이 움직이고 나면 호출되는 함수
  _standardcoordi = (res) => {
    this.setState(
      {
        refcoordilat: res.latitude,
        refcoordilong: res.longitude,
      },
      () => {
        if (
          res.longitude > this.state.refcoordilat + 0.06 ||
          res.longitude < this.state.refcoordilat - 0.06 ||
          res.latitude > this.state.refcoordilong + 0.04 ||
          res.latitude < this.state.refcoordilong - 0.04
        ) {
          this._MarkerData(
            res.longitude,
            res.latitude,
            res.longitudeDelta * 0.7,
            res.latitudeDelta * 0.7,
            // 0.09,
            // 0.06,
          );
        } else {
        }
      },
    );
  };

  // MapApp 컴포넌트가 호출되고 나면 가장 처음 호출되는 함수
  componentDidMount = () => {
    this._MarkerData(this.state.lat, this.state.long, DELTA_VALUE, DELTA_VALUE);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        '종료',
        '정말로 종료하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '종료',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {cancelable: false},
      );
      return true;
    });

    this._getcurposition();
  };
  componentWillUnmount = async () => {
    this.backHandler.remove();
  };

  // 마커를 클릭했을 때 호출되는 함수
  _pushmarker = (item) => {
    this.setState(
      {
        curselecteditem: item,
        selectedmarker: true,
      },
      () => {
        this._moveScreenRegion(
          this.state.curselecteditem.length > 1
            ? item[0].longitude - 0.00055
            : item[0].longitude,
          item[0].latitude,
          0.0025,
          0.0025,
        );
        setTimeout(() => {
          this.rb.open();
        }, 300);
      },
    );
  };

  // 검색 결과 클릭시 호출
  // search 부분 고쳐야 함
  _pushSearchedItem = async (item) => {
    if (this.state.curselecteditem[0]._id == item._id) {
      await Promise.all([this.SearchResult.close()]).then(() => {
        setTimeout(() => {
          this.rb.open();
        }, 400);
      });
    } else {
      let arr = new Array();
      arr.push(item);
      this.setState(
        {
          curselecteditem: arr,
          selectedmarker: true,
        },
        () => {
          this._moveScreenRegion(item.longitude, item.latitude, 0.0025, 0.0025);
        },
      );
      this.refs.toast.show('한번 더 터치 시 상세페이지로 이동');
    }
  };

  _pushResult = (result) => {
    this.setState({
      jsonResult: result,
    });
  };

  // 마커를 클랙해 나온 바텀시트에 존재하는 버튼을 클릭했을 시 세부화면으로 넘어갈 수 있게 하는 함수
  _clickbottomsheetbtn = (i) => {
    this.setState({
      clickonbottomsheet: true,
      curselecteditem: this.state.curselecteditem[i],
    });
  };

  _getcurposition = () => {
    Geolocation.getCurrentPosition(
      (res) => {
        this.setState({
          curlat: res.coords.latitude,
          curlong: res.coords.longitude,
        });
      },
      (error) => console.log(error),
    );
  };

  _gotocurposition = () => {
    this._getcurposition();
    this._moveCurRegion(this.state.curlat, this.state.curlong, 0.012, 0.012);
  };

  _moveCurRegion = (lat, long, latdel, longdel) => {
    this.map.animateToRegion(
      {
        latitude: lat,
        longitude: long,
        latitudeDelta: latdel,
        longitudeDelta: longdel,
      },
      1000,
    );
  };

  _moveScreenRegion = (lat, long, latdel, longdel) => {
    this.map.animateToRegion(
      {
        latitude: lat,
        longitude: long,
        latitudeDelta: latdel,
        longitudeDelta: longdel,
      },
      100,
    );
  };

  filterClick = () => {
    alert('업데이트 준비중입니다!');
  };

  _redundancy = (datas) => {
    let locarr = datas;
    let coords = [];
    for (let i = 0; i < datas.length; i++) {
      let dataarr = locarr.filter((item) => {
        return (
          item.longitude == datas[i].longitude &&
          item.latitude == datas[i].latitude
        );
      });
      if (coords.length == 0) {
        coords.push(dataarr);
      }
      let exist = false;
      for (let j = 0; j < coords.length; j++) {
        for (let z = 0; z < coords[j].length; z++) {
          if (coords[j][z].restaurantid == dataarr[0].restaurantid) {
            exist = true;
          }
        }
      }
      if (!exist) {
        coords.push(dataarr);
      }
    }
    this.setState(
      {
        loccoors: coords,
        loccoorslen: coords.length,
        showcluster: coords.length > 30 ? true : false,
      },
      () => {},
    );
  };

  render() {
    const {
      isloggedin,
      lat,
      long,
      clickonbottomsheet,
      curselecteditem,
      searchtxt,
      selectedmarker,
      showcluster,
    } = this.state;
    return (
      <>
        <StatusBar barStyle={'dark-content'} />
        {clickonbottomsheet ? (
          // 바텀 시트내의 버튼을 클릭하면 clickonbottomsheet이 ture로 변경되며 RestDetail 컴포넌트 렌더링
          <DetailScreen
            item={curselecteditem}
            user={this.props.route.params.user}
          />
        ) : (
          // MapApp 컴포넌트의 가장 처음 화면 구성
          <View style={styles.main}>
            <View style={styles.main}>
              {/* 바텀 시트 부분 시작*/}
              <RBSheet
                ref={(ref) => {
                  this.rb = ref;
                }}
                height={pheight * 0.4}
                openDuration={250}
                animationType={'fade'}
                customStyles={{
                  container: {
                    backgroundColor: '#f1f1f1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height:
                      curselecteditem.length > 1
                        ? pheight * 0.6
                        : pheight * 0.45,
                  },
                }}
                closeOnDragDown={true}
                dragFromTopOnly={true}>
                <ScrollView style={{width: pwidth}}>
                  {curselecteditem.map((item, i) => (
                    <View style={styles.bottomsheetdes} key={i}>
                      <TouchableOpacity
                        style={styles.bottomsheetTop}
                        onPress={() => this._clickbottomsheetbtn(i)}>
                        <View style={styles.bottomsheetnameview}>
                          <Image
                            source={require('./assets/images/logo.png')}
                            style={{
                              width: 110,
                              height: 110,
                              borderRadius: 30,
                            }}
                          />
                          <View style={styles.bottomsheetTopRight}>
                            <Text style={styles.bottomsheetnametxt}>
                              {item.restaurantname}
                            </Text>
                            <View style={styles.bottomsheetgubuns}>
                              <Text style={styles.bottomsheetgubuntxt}>
                                {item.resGubun}
                              </Text>
                              <Text style={styles.bottomsheetgubuntxt}>
                                {item.resGubunDetail}
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
                          {`${item.kraddr}`}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bottomsheetdetailview}
                        onPress={() => Linking.openURL(`tel:${item.resTEL}`)}>
                        <Icon
                          name="call-outline"
                          size={20}
                          color="#111"
                          style={styles.bottomsheetIcons}
                        />
                        <Text style={styles.bottomsheetdetailtxt}>
                          {`${
                            item.resTEL != ''
                              ? item.resTEL
                              : '전화 번호가 없습니다.'
                          }`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </RBSheet>

              {/* 검색 결과 바텀 시트 */}
              <RBSheet
                ref={(ref) => {
                  this.SearchResult = ref;
                }}
                // height={400}
                openDuration={250}
                animationType={'fade'}
                customStyles={{
                  container: {
                    backgroundColor: '#f1f1f1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: pheight * 0.45,
                  },
                }}
                closeOnDragDown={true}
                dragFromTopOnly={true}>
                <ScrollView style={{width: pwidth}}>
                  {this.state.jsonResult.length == 0 ? (
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={{
                          margin: 20,
                          fontSize: 25,
                          fontFamily: 'BMJUA',
                        }}>
                        검색된 결과가 없습니다
                      </Text>
                    </View>
                  ) : (
                    this.state.jsonResult.map((result, i) => (
                      <TouchableOpacity
                        style={styles.bottomsheetTop}
                        onPress={() => this._pushSearchedItem(result)}
                        key={i}>
                        <View
                          style={{
                            ...styles.bottomsheetnameview,
                            height: 130,
                            width: pwidth - 20,
                          }}>
                          <Image
                            source={require('./assets/images/logo.png')}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 30,
                            }}
                          />
                          <View style={styles.bottomsheetTopRight}>
                            <Text
                              style={{
                                ...styles.bottomsheetnametxt,
                                fontSize: 28,
                              }}>
                              {result.restaurantname.replace('\n', '')}
                            </Text>
                            <View style={styles.bottomsheetgubuns}>
                              <Text style={styles.bottomsheetgubuntxt}>
                                {result.resGubun}
                              </Text>
                              <Text style={styles.bottomsheetgubuntxt}>
                                {result.resGubunDetail}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
                <Toast
                  ref={'toast'}
                  position="top"
                  positionValue={50}
                  style={{
                    backgroundColor: '#414141aa',
                    borderRadius: 20,
                  }}
                />
              </RBSheet>

              {/*검색 창*/}
              <View style={styles.logout}>
                <HeaderClassicSearchBar
                  onChangeText={(text) =>
                    this.setState({
                      searchtxt: text,
                    })
                  }
                  searchBoxOnPress={() => {
                    Keyboard.dismiss();
                    searchtxt
                      ? fetch(
                          `http://${IPADDR}/searchaddr?kaddrkeyword=${searchtxt}`,
                        )
                          .then((res) => res.json())
                          .then((json) => {
                            this._pushResult(json);
                            this.SearchResult.open();
                          })
                      : null;
                  }}
                  onPress={this.filterClick}
                />
              </View>

              {/* 현재 위치로 이동 */}
              <TouchableOpacity
                style={styles.curlocbtn}
                onPress={this._gotocurposition}>
                <Icon
                  name="navigate-circle-outline"
                  size={40}
                  color={'#717171'}
                />
              </TouchableOpacity>

              {/* 맵뷰 부분 시작*/}
              <MapView
                ref={(ref) => {
                  this.map = ref;
                }}
                style={styles.map}
                initialRegion={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: DELTA_VALUE,
                  longitudeDelta: DELTA_VALUE,
                }}
                onRegionChangeComplete={(res) => this._standardcoordi(res)}
                minZoom={1}
                maxZoom={20}>
                {/*서버 열렸을때 실 사용 테스트용 마커*/}
                {!showcluster
                  ? this.state.loccoors.map((datas, i) => (
                      <Marker
                        coordinate={{
                          latitude: datas[0].longitude,
                          longitude: datas[0].latitude,
                        }}
                        key={i}
                        onPress={() => this._pushmarker(datas)}>
                        <View style={styles.markerdatasview}>
                          <View
                            style={
                              selectedmarker // 마커 선택되면 해당 마커 색 변환
                                ? datas[0].latitude ==
                                    curselecteditem[0].latitude &&
                                  datas[0].longitude ==
                                    curselecteditem[0].longitude
                                  ? {
                                      ...styles.markerinsideview,
                                      backgroundColor: '#ffbebc',
                                    }
                                  : styles.markerinsideview
                                : styles.markerinsideview
                            }
                          />
                        </View>
                      </Marker>
                    ))
                  : null}
                {/* 현재 위치 표시 */}
                <Marker
                  coordinate={{
                    latitude: this.state.curlat,
                    longitude: this.state.curlong,
                  }}>
                  <View style={styles.curmarker}>
                    <View
                      style={{
                        backgroundColor: '#FfD4C8',
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                      }}
                    />
                  </View>
                </Marker>
              </MapView>

              {/* 클러스터 비슷한 기능 */}
              {showcluster ? (
                <TouchableOpacity
                  onPress={() => {
                    this._moveCurRegion(
                      this.state.loccoors[0][0].longitude,
                      this.state.loccoors[0][0].latitude,
                      0.0025,
                      0.0025,
                    );
                  }}
                  style={{
                    ...styles.markerdatasview,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 8,
                    position: 'absolute',
                    zIndex: 1,
                    top: pheight / 2 - 50,
                    left: pwidth / 2 - 50,
                  }}>
                  <View
                    style={{
                      backgroundColor: '#FfD4C8',
                      width: 72,
                      height: 72,
                      borderRadius: 41,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 30,
                        color: '#f1f1f1',
                        fontFamily: 'BMEULJIROTTF',
                      }}>
                      {this.state.loccoorslen < 200
                        ? this.state.loccoorslen
                        : this.state.loccoorslen + '+'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      </>
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
  logout: {
    position: 'absolute',
    width: pwidth,
    ...Platform.select({
      ios: {
        shadowOffset: {
          height: 5,
        },
        shadowColor: 'black',
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 15,
      },
    }),
    justifyContent: 'center',
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
    margin: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
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
    fontFamily: 'BMEULJIROTTF',
  },
  bottomsheetgubuns: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 5,
  },
  bottomsheetgubuntxt: {
    fontSize: 18,
    color: '#c1c1c1',
    fontFamily: 'BMHANNAAir',
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
    fontFamily: 'BMHANNAPro',
  },
  bottomsheetIcons: {
    marginLeft: 10,
  },
  curlocbtn: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  curmarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FfD4C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerdatasview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BCCDF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerinsideview: {
    backgroundColor: '#BeCfF9',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
