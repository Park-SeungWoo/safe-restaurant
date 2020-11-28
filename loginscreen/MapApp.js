// 검색으로 식당을 찾으면 서버에 string으로 넘겨서 찾고 서버에서 넘겨줄 때에는 res=0 or res=1로 보내 데이터 존재 여부를 찾고 해당 식당 정보들을 클라이언트에게 list로 넘겨줌
// 클라이언트에서는 받아온 리스트를 바텀시트에 기존 바텀시트처럼 리스트로 쭉 나열하고 맵은 가장 첫번째에 존재하는 식당 정보를 기반으로 중심 좌표를 이동한다.

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
  Linking,
  StatusBar,
  ScrollView,
  Keyboard,
  Alert,
  BackHandler,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
// import MapView from 'react-native-maps-clustering';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar,
} from 'react-native-header-search-bar';
import Geolocation from '@react-native-community/geolocation';
import Toast, {DURATION} from 'react-native-easy-toast';
import App from './App';
import DetailScreen from './DetailScreen';

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
    curlat: 0,
    curlong: 0,
    restscoord: [
      {
        description: 'restaurant datas will be saved and modified in here',
      },
    ],
    refcoordilat: this.props.lat,
    refcoordilong: this.props.long,
    loccoors: [],
    // 서버 닫혔을 때 기본 값으로 이 값이 넘어감
    curselecteditem: {
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
    clickonbottomsheet: false,
    searchtxt: '',
    jsonResult: [],
    selectedmarker: false,
  };

  // back버튼을 누르면 로그인 화면으로 돌아가는 함수
  _logout = () => {
    this.setState({
      isloggedin: false,
    });
  };

  // 맵뷰의 화면이 움직이고 난 후 화면의 위치가 가상 윈도우의 바깥쪽에 있으면 호출하여 해당 화면의 마커들을 다시 받아오는 함수
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

  // 맵뷰의 화면이 움직이고 나면 호출되는 함수
  _standardcoordi = (res) => {
    this.setState(
      {
        refcoordilat: res.latitude,
        refcoordilong: res.longitude,
      },
      () => {
        console.log('가상 윈도우 설정 function called!');
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
      },
    );
  };

  // MapApp 컴포넌트가 호출되고 나면 가장 처음 호출되는 함수
  componentDidMount = () => {
    this._MarkerData(this.state.lat, this.state.long);
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
  componentWillUnmount = () => {
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
        this.rb.open();
        console.log(item);
        this._moveScreenRegion(item.longitude, item.latitude, 0.008, 0.008);
      },
    );
  };

  // 검색 결과 클릭시 호출
  _pushSearchedItem = async (item) => {
    if (this.state.curselecteditem._id == item._id) {
      await Promise.all([this.SearchResult.close()]).then(() => {
        setTimeout(() => {
          this.rb.open();
        }, 500);
      });
    } else {
      this.setState(
        {
          curselecteditem: item,
          selectedmarker: true,
        },
        () => {
          this._moveScreenRegion(item.longitude, item.latitude, 0.005, 0.005);
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
  _clickbottomsheetbtn = () => {
    this.setState({
      clickonbottomsheet: true,
    });
  };

  _getcurposition = () => {
    // alert('gotocurloc');
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
    this._moveScreenRegion(this.state.curlat, this.state.curlong, 0.012, 0.012);
  };

  _moveScreenRegion = (lat, long, latdel, longdel) => {
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

  render() {
    const {
      isloggedin,
      lat,
      long,
      clickonbottomsheet,
      curselecteditem,
      searchtxt,
      selectedmarker,
    } = this.state;
    return (
      <>
        <StatusBar barStyle={'dark-content'} />
        {clickonbottomsheet ? (
          // 바텀 시트내의 버튼을 클릭하면 clickonbottomsheet이 ture로 변경되며 RestDetail 컴포넌트 렌더링
          <DetailScreen item={curselecteditem} />
        ) : (
          // MapApp 컴포넌트의 가장 처음 화면 구성
          <View style={styles.main}>
            {isloggedin ? (
              <View style={styles.main}>
                {/* 바텀 시트 부분 시작*/}
                <RBSheet
                  ref={(ref) => {
                    this.rb = ref;
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
                        <Text style={{margin: 20, fontSize: 20}}>
                          검색된 결과가 없습니다
                        </Text>
                      </View>
                    ) : (
                      this.state.jsonResult.map((result, i) => (
                        // <TouchableOpacity
                        //   onPress={() => this._pushSearchedItem(result)}
                        //   style={styles.bottomsheetListContent}
                        //   key={i}>
                        //   <Text style={{margin: 5, fontSize: 18}}>
                        //     {result.restaurantname.replace('\n', ' ')}
                        //   </Text>
                        //   <Text style={{margin: 5, fontSize: 14}}>
                        //     {result.kraddr.replace('\n', ' ')}
                        //   </Text>
                        // </TouchableOpacity>
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
                              source={require('./logo.png')}
                              style={{width: 100, height: 100}}
                            />
                            <View style={styles.bottomsheetTopRight}>
                              <Text style={styles.bottomsheetnametxt}>
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
                      // console.log(searchText);
                      searchtxt
                        ? fetch(
                            `http://220.68.233.99/searchaddr?kaddrkeyword=${searchtxt}`,
                          )
                            .then((res) => res.json())
                            .then((json) => {
                              console.log(json);
                              this._pushResult(json);
                              this.SearchResult.open();
                            })
                        : console.log('검색할 데이터가 없습니다');
                    }}
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
                    latitudeDelta: DELTA_VALUE + 0.03,
                    longitudeDelta: DELTA_VALUE + 0.03,
                  }}
                  onRegionChangeComplete={(res) => this._standardcoordi(res)}
                  minZoom={1}
                  maxZoom={20}>
                  {/*서버 닫혔을 때 실험용 마커*/}
                  {/* <Marker
                    coordinate={{
                      latitude: long,
                      longitude: lat,
                    }}
                    title={`test`}
                    onPress={this._pushmarker.bind(
                      this,
                      this.state.curselecteditem,
                    )}
                  /> */}
                  {/*서버 열렸을때 실 사용 테스트용 마커*/}
                  <>
                    {this.state.loccoors.map((coords, i) => (
                      <Marker
                        coordinate={{
                          latitude: coords.longitude,
                          longitude: coords.latitude,
                        }}
                        // title={`${coords.restaurantname}`}
                        key={i}
                        onPress={() => this._pushmarker(coords)}
                        pinColor={
                          selectedmarker // 마커 선택되면 해당 마커 색 변환(android ver) but, 휴대폰 성능때문인지 작동이 잘 안됨 (아래에 마커 따로 구현한 ios는 잘 됨)
                            ? coords.restaurantid ==
                              curselecteditem.restaurantid
                              ? '#ffbebc'
                              : '#BCCDF7'
                            : '#BCCDF7'
                        }>
                        {Platform.OS == 'ios' ? (
                          <View style={styles.markerdatasview}>
                            <View
                              style={
                                selectedmarker // 마커 선택되면 해당 마커 색 변환(ios ver)
                                  ? coords.restaurantid ==
                                    curselecteditem.restaurantid
                                    ? {
                                        ...styles.markerinsideview,
                                        backgroundColor: '#ffbebc',
                                      }
                                    : styles.markerinsideview
                                  : styles.markerinsideview
                              }
                            />
                          </View>
                        ) : null}
                      </Marker>
                    ))}
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
                  </>
                </MapView>
              </View>
            ) : (
              <App />
            )}
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
    backgroundColor: '#BCCDF7',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
