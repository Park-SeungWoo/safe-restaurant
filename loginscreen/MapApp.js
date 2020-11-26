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
} from 'react-native';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-maps-clustering';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar,
} from 'react-native-header-search-bar';
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
  };

  // MapApp 컴포넌트가 호출되고 나면 가장 처음 호출되는 함수
  componentDidMount = () => {
    this._MarkerData(this.state.lat, this.state.long);
  };

  // 마커를 클릭했을 때 호출되는 함수
  _pushmarker = (item) => {
    this.setState({
      curselecteditem: item,
    });
    this.RBSheet.open();
  };

  // 마커를 클랙해 나온 바텀시트에 존재하는 버튼을 클릭했을 시 세부화면으로 넘어갈 수 있게 하는 함수
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
      searchtxt,
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
              // 로그인 상태를 통해 화면을 렌더링 하는 방식으로 현재 로그인=true이고 back버튼을 눌러 isloggedin을 False로 바꾸면 이전 화면인 login컴포넌트 렌더링
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

                {/*뒤로 가기 버튼*/}
                <View style={styles.logout}>
                  <HeaderClassicSearchBar
                    onChangeText={(text) =>
                      this.setState({
                        searchtxt: text,
                      })
                    }
                    searchBoxOnPress={() => {
                      fetch(
                        `http://220.68.233.99/searchaddr?kaddrkeyword=${searchtxt}`,
                      )
                        .then((res) => res.json())
                        .then((json) => {
                          json.map((result, i) =>
                            console.log(result.restaurantname),
                          );
                        });
                    }}
                  />
                </View>

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
                      key={i}
                      onPress={this._pushmarker.bind(this, coords)}
                    />
                  ))}
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
    // backgroundColor: '#BCCDF7',
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
