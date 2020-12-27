import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Platform,
  FlatList,
  TextInput,
  Modal,
  Linking,
  SafeAreaView,
  BackHandler,
  Alert,
} from 'react-native';
import MapApp from './MapApp';
import MapView, {Marker} from 'react-native-maps';
import RNKakaoLink from 'react-native-kakao-links';
import {Picker} from '@react-native-picker/picker';
import {WheelPicker} from 'react-native-wheel-picker-android';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-easy-toast';
import v4 from 'uuid/v4';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;
const IPADDR = '220.68.233.99'; // change it when the ip addr was changed

export default class DetailScreen extends Component {
  state = {
    isOnSRD: true,
    modalVisible: false, // 모달창(리뷰 작성창) 플로팅
    pickerval: 1, //rating val,
    commenttxt: '',
    ratingData: ['1', '2', '3', '4', '5'],
    restdatas: this.props.item,
    reviews: [],
    reviewcnt: 0,
    isFirst: true,
  };

  constructor(props) {
    super(props);
    this.reviewblock = this.reviewblock.bind(this);
    this._getreviews = this._getreviews.bind(this);
    this._kakaoshare = this._kakaoshare.bind(this);
    this._ratingBottom = this._ratingBottom.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.setState({
        isOnSRD: false,
      });
      return true; // back 버튼 눌러도 앱이 꺼지지 않음
    });

    this._getreviews();
  };

  _getreviews = async () => {
    // get reviews
    let option = {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        rest_id: this.state.restdatas.restaurantid,
        nickname: this.props.user._nickname,
      }),
    };
    await fetch(`http://${IPADDR}/rreview`, option)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          reviews: json,
        });
      });
  };

  componentWillUnmount = async () => {
    this.backHandler.remove();
  };

  _Back = () => {
    this.setState({
      isOnSRD: false,
    });
  };

  // _kakaoshare = async () => {
  //   const snapshot = this.map.takeSnapshot({
  //     width: 300, // optional, when omitted the view-width is used
  //     height: 300, // optional, when omitted the view-height is used
  //     format: 'png', // image formats: 'png', 'jpg' (default: 'png')
  //     quality: 0.8, // image quality: 0..1 (only relevant for jpg, default: 1)
  //     result: 'file', // result types: 'file', 'base64' (default: 'file')
  //   });
  //   snapshot.then((uri) => {
  //     alert(uri);
  //     // 여기 나온 캡쳐 사진 파일을 서버에 저장 후 카카오 공유의 imageURL부분에 해당 서버 주소 입력하여 보내기
  //     // try {
  //     //   const options = {
  //     //     objectType: 'location', //required
  //     //     content: {
  //     //       title: 'location', //required
  //     //       link: {
  //     //         webURL: 'https://developers.kakao.com',
  //     //         mobileWebURL: 'https://developers.kakao.com',
  //     //       }, //required
  //     //       imageURL: uri(uri), //required
  //     //     }, //required
  //     //     address: this.props.item.kraddr,
  //     //     addressTitle: 'My house',
  //     //   };
  //     //   RNKakaoLink.link(options);
  //     // } catch (e) {
  //     //   console.warn(e);
  //     // }
  //   });
  // };

  _kakaoshare = async () => {
    const {
      enaddr,
      isSaferes,
      kraddr,
      latitude,
      longitude,
      resGubun,
      resGubunDetail,
      resTEL,
      restaurantid,
      restaurantname,
    } = this.props.item;
    try {
      const options = {
        objectType: 'location', //required
        content: {
          desc: `${kraddr}`, //required
          title: `${restaurantname}`,
          link: {
            androidExecutionParams: `restaurantid=${restaurantid}&restaurantname=${restaurantname}&resTEL=${resTEL}&resGubunDetail=${resGubunDetail}&resGubun=${resGubun}&longitude=${longitude}&latitude=${latitude}&kraddr=${kraddr}&isSaferes=${isSaferes}&enaddr=${enaddr}`,
            iosExecutionParams: `restaurantid=${restaurantid}&restaurantname=${encodeURI(
              encodeURIComponent(restaurantname),
            )}&resTEL=${resTEL}&resGubunDetail=${encodeURI(
              encodeURIComponent(resGubunDetail),
            )}&resGubun=${encodeURI(
              encodeURIComponent(resGubun),
            )}&longitude=${longitude}&latitude=${latitude}&kraddr=${encodeURI(
              encodeURIComponent(kraddr),
            )}&isSaferes=${isSaferes}&enaddr=${enaddr}`, // ios에서 url보낼때 한글이 깨져서 encoding해서 보내고 받을 땐 decode해서 받아서 navigate함
          }, //required
          imageURL:
            'https://github.com/Park-SeungWoo/safe-restaurant/blob/master/SafeRestaurant_UI/logo.png', //required
        }, //required
        address: this.props.item.kraddr,
        addressTitle: restaurantname,
        buttons: [
          {
            title: '앱으로 이동',
            link: {
              androidExecutionParams: `restaurantid=${restaurantid}&restaurantname=${restaurantname}&resTEL=${resTEL}&resGubunDetail=${resGubunDetail}&resGubun=${resGubun}&longitude=${longitude}&latitude=${latitude}&kraddr=${kraddr}&isSaferes=${isSaferes}&enaddr=${enaddr}`,
              iosExecutionParams: `restaurantid=${restaurantid}&restaurantname=${encodeURI(
                encodeURIComponent(restaurantname),
              )}&resTEL=${resTEL}&resGubunDetail=${encodeURI(
                encodeURIComponent(resGubunDetail),
              )}&resGubun=${encodeURI(
                encodeURIComponent(resGubun),
              )}&longitude=${longitude}&latitude=${latitude}&kraddr=${encodeURI(
                encodeURIComponent(kraddr),
              )}&isSaferes=${isSaferes}&enaddr=${enaddr}`, // ios에서 url보낼때 한글이 깨져서 encoding해서 보내고 받을 땐 decode해서 받아서 navigate함
            },
          },
        ],
      };
      RNKakaoLink.link(options);
    } catch (e) {
      console.warn(e);
    }
  };

  // rating wheel picker 바텀시트 여는 창
  _ratingBottom = () => {
    this.ratingbs.open();
  };
  render() {
    const {isOnSRD, restdatas} = this.state;
    return (
      <>
        {isOnSRD ? (
          <SafeAreaView style={styles.main}>
            <View style={styles.topbar}>
              <TouchableOpacity style={styles.backbtn} onPress={this._Back}>
                <Icon name={'arrow-back-outline'} style={styles.backicon} />
              </TouchableOpacity>
              <Text style={styles.topbarnametxt}>안심 식당</Text>
            </View>
            <View style={styles.maincontents}>
              <MapView
                scrollEnabled={false}
                zoomEnabled={false}
                style={styles.mapv}
                region={{
                  latitude: restdatas.longitude,
                  longitude: restdatas.latitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
                ref={(map) => {
                  this.map = map;
                }}>
                <Marker
                  coordinate={{
                    latitude: restdatas.longitude,
                    longitude: restdatas.latitude,
                  }}
                  title={restdatas.restaurantname}
                  description={restdatas.resGubun}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: '#BCCDF7',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
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
              <View style={styles.detail}>
                <View style={styles.name}>
                  <Text style={styles.nametxt}>{restdatas.restaurantname}</Text>
                </View>
                <View style={styles.addr}>
                  <Text style={styles.addrtxt}>{restdatas.kraddr}</Text>
                  <TouchableOpacity
                    style={styles.detailbtn}
                    onPress={() => {
                      Clipboard.setString(`${restdatas.kraddr}`);
                      this.refs.toast.show('클립보드에 복사하였습니다.');
                    }}>
                    <Icon name={'copy-outline'} style={styles.detailIcons} />
                  </TouchableOpacity>
                </View>
                <View style={styles.telnum}>
                  {restdatas.resTEL != '' ? (
                    <>
                      <Text style={styles.telnumtxt}>{restdatas.resTEL}</Text>
                      <TouchableOpacity
                        style={styles.detailbtn}
                        onPress={() => {
                          Linking.openURL(`tel:${restdatas.resTEL}`);
                        }}>
                        <Icon
                          name={'call-outline'}
                          style={styles.detailIcons}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Text style={styles.telnumtxt}>전화번호가 없습니다.</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={this._kakaoshare}
                  style={styles.share}>
                  <Image
                    style={styles.shareimg}
                    source={require('./assets/images/kakao.png')}
                  />
                  <Text style={styles.sharetxt}>카카오톡으로 공유하기</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.review}>
                <View style={styles.reviewview}>
                  <FlatList
                    data={this.state.reviews}
                    style={{paddingHorizontal: 10}}
                    renderItem={this.reviewblock}
                    keyExtractor={(item) => item.reviewId}
                    initialScrollIndex={this.state.reviews.length > 1 ? 1 : 0}
                    horizontal
                    snapToInterval={pwidth - 20}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    bounces={false}
                    getItemLayout={(data, index) => ({
                      length: pwidth - 20,
                      offset: (pwidth - 20) * index,
                      index,
                    })}
                  />
                </View>
              </View>
            </View>
            <Toast
              ref={'toast'}
              style={{backgroundColor: '#414141aa', borderRadius: 20}}
            />
          </SafeAreaView>
        ) : (
          <MapApp
            lat={restdatas.longitude}
            long={restdatas.latitude}
            user={this.props.user}
          />
        )}
      </>
    );
  }

  // 리뷰 모달창 띄우는 함수
  reviewblock = ({item}) => {
    let {modalVisible, pickerval} = this.state;
    const _addreview = () => {
      this.setState({
        modalVisible: true,
      });
    };

    //리뷰 작성 후 저장하는 버튼 이벤트 핸들러
    const _savereview = () => {
      Alert.alert(
        '리뷰 저장',
        '저장 후에는 수정 및 삭제가 불가합니다.\n저장하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: '저장',
            onPress: async () => {
              // 이 부분에 서버와 연동해서 구현하면 됨
              let op = {
                method: 'POST',
                mode: 'cors',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                  rest_id: this.state.restdatas.restaurantid,
                }),
              };
              await fetch(`http://${IPADDR}/rreview`, op)
                .then((res) => res.json())
                .then((json) => {
                  this.setState(
                    {
                      reviewcnt: json.length,
                    },
                    () => {
                      const ID = v4() + '';
                      let option = {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json;charset=UTF-8',
                        },
                        body: JSON.stringify({
                          rest_id: this.state.restdatas.restaurantid,
                          rating: this.state.pickerval,
                          comment: this.state.commenttxt,
                          nickname: this.props.user._nickname,
                          reviewId: ID,
                        }),
                      };
                      fetch(`http://${IPADDR}/wreview`, option)
                        .then((res) => res.json())
                        .then((json) => {
                          if (json == 1) {
                            this._getreviews();
                            let modified = this.state.reviews;
                            modified.shift();
                            this.setState({
                              modalVisible: false,
                              review: modified,
                            });
                            this.refs.toast.show('저장 성공');
                          } else {
                            this.refs.toast.show('저장 실패');
                          }
                        });
                    },
                  );
                });
            },
          },
        ],
        {cancelable: false},
      );
    };
    return (
      <>
        {item.reviewId != '0' ? (
          <View style={styles.reviewdatas}>
            <View style={styles.reviewtop}>
              <Text style={styles.nicknametxt}>{item.nickname}</Text>
              <Text
                style={
                  styles.reviewratingtxt
                }>{`rating : ${item.rating}/5`}</Text>
            </View>
            <View style={styles.reviewcontent}>
              <Text style={styles.reviewcontenttxt}>{item.comment}</Text>
            </View>
          </View>
        ) : (
          // add 버튼 누르면 리뷰 작성할 수 있도록 구현하기
          <View
            style={[
              styles.reviewdatas,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            <TouchableOpacity
              onPress={_addreview}
              style={{
                width: 100,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name={'add-circle-outline'} size={80} color={'#a1a1a1'} />
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.reviewbsTop}>
                    <View style={styles.modaltopleft}>
                      <TouchableOpacity
                        style={styles.modalclosebtn}
                        onPress={() => {
                          Alert.alert(
                            '리뷰창 닫기',
                            '현재까지의 내용이 사라집니다. \n나가시겠습니까?',
                            [
                              {
                                text: '취소',
                                onPress: () => {},
                                style: 'cancel',
                              },
                              {
                                text: '확인',
                                onPress: () => {
                                  this.setState({
                                    modalVisible: false,
                                  });
                                },
                              },
                            ],
                            {cancelable: false},
                          );
                        }}>
                        <Icon
                          name="close-outline"
                          size={25}
                          color="#111"
                          style={{fontWeight: 'bold'}}
                        />
                      </TouchableOpacity>
                      <Text style={styles.modalnicknametxt}>
                        {this.props.user._nickname}
                      </Text>
                    </View>
                    <View style={styles.reviewbsRating}>
                      <TouchableOpacity
                        onPress={this._ratingBottom}
                        style={styles.ratingbtn}>
                        <Text style={styles.ratingtxt}>
                          rating : {pickerval}
                          /5
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.reviewdone}
                        onPress={_savereview}>
                        <Text style={styles.reviewdonetxt}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.ratingcontent}>
                    <TextInput
                      style={styles.ratingcontentinput}
                      multiline
                      maxLength={200}
                      onChangeText={(txt) => {
                        this.setState({
                          commenttxt: txt,
                        });
                      }}
                      placeholder={
                        '여기에 리뷰를 작성해주세요. \n수정 및 삭제가 불가하니 신중하게 작성해주세요. \n200자까지 작성 가능합니다.'
                      }
                    />
                  </View>
                </View>
              </View>
              {/* bottom sheet for rating */}
              <RBSheet
                ref={(ref) => {
                  this.ratingbs = ref;
                }}
                height={300}
                openDuration={250}
                animationType={'fade'}
                customStyles={{
                  container: {
                    backgroundColor: '#f1f1f1',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 300,
                    padding: 20,
                  },
                }}
                closeOnDragDown={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: pwidth,
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  <Text style={styles.ratingbsheader}>별점을 골라주세요</Text>
                  <TouchableOpacity
                    style={{position: 'absolute', right: 20}}
                    onPress={() => {
                      this.ratingbs.close();
                    }}>
                    <Text style={styles.ratingbsdone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.ratingPicker}>
                  {Platform.OS == 'ios' ? (
                    // for ios
                    <Picker
                      selectedValue={this.state.pickerval}
                      style={{
                        width: pwidth,
                        heigth: 300,
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          pickerval: itemValue,
                        });
                      }}>
                      <Picker.Item label="1" value="1" />
                      <Picker.Item label="2" value="2" />
                      <Picker.Item label="3" value="3" />
                      <Picker.Item label="4" value="4" />
                      <Picker.Item label="5" value="5" />
                    </Picker>
                  ) : (
                    // for android
                    <WheelPicker
                      data={this.state.ratingData}
                      selectedItem={0}
                      style={styles.wheelpickerandroid}
                      itemTextSize={23}
                      selectedItemTextSize={23}
                      onItemSelected={(idx) => {
                        this.setState({
                          pickerval: this.state.ratingData[idx] * 1,
                        });
                      }}
                    />
                  )}
                </View>
              </RBSheet>
            </Modal>
          </View>
        )}
      </>
    );
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#BCCDF7',
  },

  // main => topbar
  topbar: {
    width: pwidth,
    height: pheight * 0.08,
    backgroundColor: '#BCCDF7',
    zIndex: 1,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowOffset: {
          height: 7,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 5,
      },
    }),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // // main => topbar => back
  backbtn: {
    position: 'absolute',
    left: 10,
  },
  backicon: {
    fontSize: 40,
    color: '#fafafa',
  },
  // // main => topbar => topnametxt
  topbarnametxt: {
    fontSize: 30,
    color: '#1a1a1a',
    fontFamily: 'BMEULJIROTTF',
  },

  // main => maincontents
  maincontents: {
    height: pheight,
    width: pwidth,
    backgroundColor: '#fafafa',
  },

  // // main => maincontents => map, details, review
  // ios가 작은게 safeareaview때문인지 확인해야함(안드로이드 시뮬 돌려서 확인하기)
  mapv: {
    width: pwidth,
    height: pheight * 0.3,
  },
  detail: {
    width: pwidth - 20,
    height: pheight / 3 - pheight * 0.07,
    backgroundColor: '#fafafa',
    padding: 10,
    justifyContent: 'space-between',
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#71717144',
  },
  review: {
    width: pwidth,
    height: pheight * 0.3,
    paddingBottom: 0,
  },

  // // // details => name, addr, telnum, share
  name: {},
  addr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telnum: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  share: {
    backgroundColor: '#FBEC4e',
    borderRadius: 10,
    width: 250,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  nametxt: {
    fontSize: 25,
    fontFamily: 'BMJUA',
  },
  addrtxt: {
    fontSize: 18,
    fontFamily: 'BMYEONSUNG',
  },
  telnumtxt: {
    fontSize: 18,
    fontFamily: 'BMYEONSUNG',
  },
  sharetxt: {
    color: '#381F1F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareimg: {
    width: 40,
    height: 40,
    margin: 5,
  },
  detailbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
  },
  detailIcons: {
    fontSize: 15,
  },

  // 리뷰 아이템들 horizontal flatlist
  reviewview: {
    flex: 1,
    padding: 0,
  },
  reviewdatas: {
    width: pwidth - 30,
    height: 190,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 5,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  reviewtop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#d1d1d188',
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  reviewcontent: {
    padding: 10,
  },
  reviewcontenttxt: {
    fontFamily: 'BMHANNAAir',
  },
  nicknametxt: {
    fontSize: 25,
    // fontWeight: '700',
    fontFamily: 'BMEULJIROTTF',
    color: '#1a1a1a',
    lineHeight: 30,
  },

  // modal(review)
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: pwidth - 40,
    height: 250,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 15,
    ...Platform.select({
      ios: {
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        paddingTop: 0,
        elevation: 5,
      },
    }),
  },
  ratingbtn: {
    margin: 5,
  },
  ratingcontentinput: {
    padding: 5,
    textAlignVertical: 'top',
  },
  modaltopleft: {
    flexDirection: 'row',
  },
  modalclosebtn: {
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingtxt: {
    fontSize: 20,
    fontFamily: 'BMHANNAPro',
  },
  modalnicknametxt: {
    fontSize: 25,
    color: '#1a1a1a',
    fontFamily: 'BMEULJIROTTF',
  },
  reviewratingtxt: {
    marginTop: 5,
    fontSize: 18,
    fontFamily: 'BMHANNAAir',
  },

  // 모달창 내에서 rating점수를 등록하기 위한 바텀시트
  reviewbsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#818181aa',
  },
  reviewbsRating: {
    flexDirection: 'row',
  },
  ratingPicker: {
    width: pwidth,
    height: 300,
    alignItems: 'center',
  },
  wheelpickerandroid: {
    width: pwidth - 40,
    height: 300,
  },
  reviewdone: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // height: 25,
  },
  reviewdonetxt: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingbsheader: {
    fontSize: 30,
    fontFamily: 'BMHANNAPro',
  },
  ratingbsdone: {
    fontSize: 15,
    fontWeight: '700',
  },
});
