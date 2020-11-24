//kakao login, share은 동작 중지됨
//bundle id 바꿔서 여기서 사용하려면 다시 바꿔야 함

import React, {Component, useState} from 'react';
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
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import MapApp from './MapApp';
import MapView, {Marker} from 'react-native-maps';
import RNKakaoLink from 'react-native-kakao-links';
import {Picker} from '@react-native-picker/picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import REVIEWDATA from './review.json';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

export default class RestDetail extends Component {
  state = {
    isOnSRD: true,
    modalVisible: false, // 모달창(리뷰 작성창) 플로팅
    pickerval: 5,
  };

  _Back = () => {
    this.setState({
      isOnSRD: false,
    });
  };

  // _kakaoshare = async () => {
  //   console.log('share');
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
    try {
      const options = {
        objectType: 'location', //required
        content: {
          title: 'location', //required
          link: {
            webURL: 'https://developers.kakao.com',
            mobileWebURL: 'https://developers.kakao.com',
          }, //required
          imageURL:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/220px-Image_created_with_a_mobile_phone.png', //required
        }, //required
        address: this.props.item.kraddr,
        addressTitle: 'My house',
        buttons: [
          {
            title: '앱으로 이동',
            link: {
              // webURL: 'https://developers.kakao.com',
              // mobileWebURL: 'https://developers.kakao.com',
              androidExecutionParams: 'id=0',
              iosExecutionParams: 'id=0',
            },
          },
        ],
      };
      RNKakaoLink.link(options);
    } catch (e) {
      console.warn(e);
    }
  };

  // for flatlist
  isLegitIndex(index, length) {
    if (index < 0 || index >= length) return false;
    return true;
  }
  index = 1;
  pagination = (velocity) => {
    let nextIndex;
    if (Platform.OS == 'ios') {
      nextIndex = velocity > 0 ? this.index + 1 : this.index - 1;
    } else {
      nextIndex = velocity < 0 ? this.index + 1 : this.index - 1;
    }
    if (this.isLegitIndex(nextIndex, REVIEWDATA.length)) {
      this.index = nextIndex;
    }
    this.flatlist.scrollToIndex({index: this.index, animated: true});
  };
  scrollToIndexFailed(error) {
    const offset = error.averageItemLength * error.index;
    this.flatlist.scrollToOffset({offset});
  }

  // 리뷰 목록들 및 추가 창(flatlist로 처리함)
  _ratingBottom = () => {
    console.log('rating bottom sheet');
    this.ratingbs.open();
  };

  reviewblock = ({item}) => {
    let {modalVisible, pickerval} = this.state;
    const _addreview = () => {
      console.log('add review');
      this.setState({
        modalVisible: true,
      });
    };
    return (
      <>
        {item.text != 'add' ? (
          <View style={styles.reviewdatas}>
            <View style={styles.reviewtop}>
              <Text style={styles.nicknametxt}>{item.nickname}</Text>
              <Text>{`rating : ${item.rating}/5`}</Text>
            </View>
            <View style={styles.reviewcontent}>
              <Text>{item.text}</Text>
            </View>
          </View>
        ) : (
          // add 버튼 누르면 리뷰 작성할 수 있도록 구현하기
          <View
            style={[
              styles.reviewdatas,
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            <TouchableOpacity onPress={_addreview}>
              <Text>{item.text}</Text>
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
                        style={styles.reviewdone}
                        onPress={() => {
                          this.setState({
                            modalVisible: false,
                          });
                        }}>
                        <Text>close</Text>
                      </TouchableOpacity>
                      <Text style={styles.nicknametxt}>nickname</Text>
                    </View>
                    <View style={styles.reviewbsRating}>
                      <TouchableOpacity
                        onPress={this._ratingBottom}
                        style={styles.ratingbtn}>
                        <Text>rating : {pickerval}/5</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.reviewdone}
                        onPress={() => {
                          this.setState({
                            modalVisible: false,
                          });
                        }}>
                        <Text>done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.ratingcontent}>
                    <TextInput
                      style={styles.ratingcontentinput}
                      multiline
                      maxLength={200}
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
                height={400}
                openDuration={250}
                animationType={'fade'}
                customStyles={{
                  container: {
                    backgroundColor: '#f1f1f1',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 400,
                    padding: 20,
                  },
                }}
                closeOnDragDown={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: pwidth,
                    justifyContent: 'center',
                  }}>
                  <Text>별점을 골라주세요</Text>
                  <TouchableOpacity
                    style={{position: 'absolute', right: 20}}
                    onPress={() => {
                      this.ratingbs.close();
                    }}>
                    <Text>Done</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.ratingPicker}>
                  <Picker
                    selectedValue={this.state.pickerval}
                    style={{
                      ...Platform.select({
                        ios: {
                          width: pwidth,
                        },
                        android: {
                          width: 100,
                        },
                      }),
                      heigth: 400,
                    }}
                    mode={'dropdown'}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({pickerval: itemValue})
                    }>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                  </Picker>
                </View>
              </RBSheet>
            </Modal>
          </View>
        )}
      </>
    );
  };

  render() {
    const {isOnSRD} = this.state;
    return (
      <View style={styles.main}>
        {isOnSRD ? (
          <View style={styles.main}>
            <View style={styles.logout}>
              <TouchableOpacity style={styles.logoutbtn} onPress={this._Back}>
                <Image
                  style={styles.backimg}
                  source={require('./assets/images/back.png')}
                />
              </TouchableOpacity>
              <View style={styles.restname}>
                <Text style={styles.restnametxt}>
                  {this.props.item.restaurantname}
                </Text>
              </View>
            </View>
            <ScrollView
              style={styles.detailscreen}
              showsVerticalScrollIndicator={false}>
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
                  }}
                  ref={(map) => {
                    this.map = map;
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
                <View style={styles.kakaolink}>
                  <TouchableOpacity onPress={this._kakaoshare}>
                    <Image
                      style={styles.kakaolinkimg}
                      source={require('./assets/images/kakaolink.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.reviewscreen}>
                <View style={styles.reviewview}>
                  <FlatList
                    data={REVIEWDATA}
                    style={{padding: 10}}
                    renderItem={this.reviewblock}
                    keyExtractor={(item) => item.id}
                    horizontal
                    initialScrollIndex={1}
                    showsHorizontalScrollIndicator={false}
                    ref={(ref) => (this.flatlist = ref)}
                    onScrollEndDrag={(e) => {
                      this.pagination(e.nativeEvent.velocity.x);
                    }}
                    onScrollToIndexFailed={() => this.scrollToIndexFailed(this)}
                  />
                </View>
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
    // height: pheight,
    // display: 'flex',
  },
  logout: {
    ...Platform.select({
      ios: {
        height: 90,
        shadowOffset: {
          height: 5,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        paddingTop: 30,
      },
      android: {
        height: 60,
        elevation: 15,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#BCCDF7',
    flexDirection: 'row',
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
    zIndex: 2,
  },
  restname: {
    flex: 1,
    width: pwidth,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        height: 90,
        paddingTop: 40,
      },
      android: {
        height: 60,
      },
    }),
  },
  restnametxt: {
    fontSize: 20,
  },
  map: {
    width: pwidth,
    height: pheight / 3,
  },
  detailscreen: {
    backgroundColor: '#f5f5f5',
    width: pwidth,
    ...Platform.select({
      ios: {
        paddingBottom: pheight - 30,
      },
      android: {
        paddingBottom: pheight,
      },
    }),
  },
  mapdetail: {
    width: pwidth,
    height: pheight / 3,
  },
  restdetail: {
    height: pheight / 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    marginHorizontal: 10,
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
    margin: 5,
  },
  kakaolinkimg: {
    width: pwidth / 2,
    height: 45,
  },

  // 리뷰 아이템들 horizontal flatlist
  reviewscreen: {
    height: pheight / 3 + 10,
    paddingVertical: 10,
  },
  reviewview: {
    flex: 1,
  },
  reviewdatas: {
    width: pwidth - 30,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    margin: 5,
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
  nicknametxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 30,
  },

  // modal(review)

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    width: pwidth - 40,
    height: pheight / 3,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitbtn: {
    backgroundColor: '#d3a3c3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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

  // 모달창 내에서 rating점수를 등록하기 위한 바텀시트
  reviewbsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#818181aa',
  },
  reviewbsRating: {
    flexDirection: 'row',
  },
  ratingPicker: {
    width: pwidth,
    height: 400,
    alignItems: 'center',
  },
  reviewdone: {
    margin: 5,
    borderWidth: 1,
  },
});
